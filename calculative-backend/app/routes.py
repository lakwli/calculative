import os
import json
import time
from flask import Blueprint, request, jsonify, Response, g, current_app
from datetime import datetime
import logging

# Import limiter initialized in __init__.py
from app import limiter
# Import business logic
from .fin.stock_cal import StockCal

# Get the access logger instance configured in __init__.py
access_logger = logging.getLogger('access')

# Create Blueprint
main_routes = Blueprint('main', __name__)

# --- Request/Response Logging ---

@main_routes.before_app_request
def log_request_info():
    """Log incoming request details before processing."""
    g.start_time = time.time() # Store start time in Flask's 'g' object
    # Log only technical information
    request_info = {
        "event": "request_started",
        "method": request.method,
        "path": request.path
    }
    access_logger.info("Incoming request", extra={'request_info': request_info})


@main_routes.after_app_request
def log_response_info(response):
    """Log outgoing response details after processing."""
    duration_ms = (time.time() - g.start_time) * 1000 if hasattr(g, 'start_time') else -1

    # Log only technical information
    response_info = {
        "event": "request_finished",
        "method": request.method,
        "path": request.path,
        "status_code": response.status_code,
        "duration_ms": round(duration_ms, 2)
    }
    access_logger.info("Request finished", extra={'request_info': response_info})
    # Apply CORS headers using the helper function if needed (though global CORS might handle it)
    # return _corsify_actual_response(response) # Re-evaluate if this is needed
    return response # Return the original response for now

# --- Routes ---

@main_routes.route('/')
def home():
    current_app.logger.info('Home endpoint accessed')
    return 'Hello, Flask! 123 - Refactored'

@main_routes.route('/health')
def health_check():
    """Health check endpoint for monitoring."""
    current_app.logger.info('Health check accessed')
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

@main_routes.route('/test1', methods=['GET'])
@limiter.limit(lambda: current_app.config.get('RATE_LIMIT', '100 per minute'))
def test1():
    current_app.logger.info("Test1 endpoint accessed")
    return 'test1 - Refactored'

@main_routes.route('/getCal', methods=['POST', 'OPTIONS'])
@limiter.limit(lambda: current_app.config.get('RATE_LIMIT', '100 per minute'))
def get_cal():
    # Use current_app.logger instead of app.logger
    logger = current_app.logger

    if request.method == 'OPTIONS':
        # The global CORS setup in __init__ should handle preflight requests.
        # If issues persist, we might need _build_cors_preflight_response here.
        logger.debug("Handling OPTIONS request for /getCal (likely handled by global CORS)")
        # Return an empty response, headers are added by Flask-CORS
        return '', 204

    # Handle POST request - technical logging only
    logger.debug("Processing /getCal POST request")
    data = request.json
    if not data:
        logger.debug("Request validation failed: empty JSON")
        return jsonify({"error": "Request must be JSON"}), 400

    logger.info("Starting calculation processing")

    # Extracting JSON data into separate variables
    age = data.get('age')
    initial_capital = data.get('initialCapital')
    yearly_withdraw = data.get('yearlyWithdraw')
    inflation = data.get('inflation')
    return_type = data.get('returnType') #S (Simple), M (Market index), I (Investment)
    back_test_year_str = data.get('backTestYear')
    index = data.get('index')
    portfolio = None
    fix_return_str = data.get('fixReturn')
    div_withhold_tax_str = data.get('divWithholdTax')

    # --- Input Validation ---
    required_fields = ['initialCapital', 'yearlyWithdraw', 'inflation', 'backTestYear', 'returnType']
    missing_fields = [field for field in required_fields if data.get(field) is None]
    if missing_fields:
        logger.debug("Request validation failed: missing required fields")
        return jsonify({"error": "Missing required fields"}), 400

    try:
        back_test_year = int(back_test_year_str)
        initial_capital_float = float(initial_capital)
        yearly_withdraw_float = float(yearly_withdraw)
        inflation_float = float(inflation) / 100
        fix_return_float = float(fix_return_str or 0) / 100 # Default to 0 if None or empty
        div_withhold_tax_float = float(div_withhold_tax_str or 0) / 100 # Default to 0 if None or empty
        starting_age_int = int(age or 30) # Default age
    except (ValueError, TypeError) as e:
        logger.debug("Request validation failed: numeric conversion error")
        return jsonify({"error": "Invalid input type for numerical fields"}), 400

    # --- Portfolio Logic ---
    if return_type == "M":
        if not index:
            logger.debug("Request validation failed: missing index for market type")
            return jsonify({"error": "Index is required for Market Index return type"}), 400
        return_type = "I" # Treat Market Index as Investment type with single index portfolio
        portfolio = {index: 1.0}
        logger.debug("Processing market index calculation")
    elif return_type == "I":
        portfolio = data.get('portfolio')
        if not portfolio or not isinstance(portfolio, dict):
            logger.debug("Request validation failed: invalid portfolio format")
            return jsonify({"error": "Portfolio dictionary is required for Investment return type"}), 400
        # Optional: Validate portfolio weights sum to 1.0
        if not abs(sum(portfolio.values()) - 1.0) < 1e-6:
             logger.debug("Portfolio weights validation warning")
        logger.debug("Processing investment calculation")
    elif return_type == "S":
        logger.debug("Processing simple calculation")
        portfolio = None # Ensure portfolio is None for Simple type
    else:
        logger.debug("Request validation failed: invalid return type")
        return jsonify({"error": "Invalid return type. Must be S, M, or I."}), 400

    # --- Calculation ---
    stockCal = StockCal()
    try:
        logger.debug("Starting calculation execution")
        df_json_string = stockCal.get_yearly_investment_return(
            portfolio=portfolio,
            initial_investment=initial_capital_float,
            initial_withdrawal=yearly_withdraw_float,
            withdrawal_inflation_rate=inflation_float,
            dividend_tax_rate=div_withhold_tax_float,
            start_year=back_test_year,
            starting_age=starting_age_int,
            return_type=return_type,
            expected_return=fix_return_float,
            initial_dividend_yield=0,
            dividend_growth=0
        )
        logger.info("Calculation completed successfully")
    except Exception as e:
        logger.debug("Calculation execution failed")
        return jsonify({"error": "Calculation failed"}), 500

    # Convert DataFrame JSON string to Python object and then jsonify
    try:
        json_data = json.loads(df_json_string)
        response = jsonify(json_data)
        logger.debug("Response preparation complete")
        return response
    except json.JSONDecodeError:
        logger.debug("JSON processing failed")
        return jsonify({"error": "Failed to process calculation result"}), 500


# --- CORS Helper Functions (Potentially redundant with global CORS) ---
# These might be needed if specific headers/methods are required beyond global setup

def _build_cors_preflight_response():
    # This is likely handled by Flask-CORS automatically now
    response = jsonify(success=True)
    # Headers like Allow-Origin, Allow-Methods, Allow-Headers are added by Flask-CORS
    current_app.logger.debug("Building CORS preflight response (likely handled globally)")
    return response

def _corsify_actual_response(response):
    # This is likely handled by Flask-CORS automatically now
    # It adds the Access-Control-Allow-Origin header based on the global config
    current_app.logger.debug("Applying CORS headers to actual response (likely handled globally)")
    return response

# --- Global Error Handler ---

@main_routes.app_errorhandler(Exception)
def handle_exception(e):
    """Handle unexpected errors."""
    # Log only technical information about the error
    current_app.logger.debug("Handling unexpected error")
    
    # Check if it's a known HTTP exception
    from werkzeug.exceptions import HTTPException
    if isinstance(e, HTTPException):
        status_code = e.code
        if status_code == 404:
            error_msg = "Endpoint not found"
        elif status_code == 405:
            error_msg = "Method not allowed"
        else:
            error_msg = "Request error"
    else:
        # For unknown errors, log minimal information and return generic message
        current_app.logger.error(f"Error type: {e.__class__.__name__}")
        status_code = 500
        error_msg = "Internal server error"

    response = jsonify({"error": error_msg})
    return response, status_code
