import os
import json
from flask import request, jsonify, Response
from datetime import datetime
import logging
from . import create_app
from .fin.stock_cal import StockCal

# Create and configure the application
app, limiter = create_app(os.getenv('FLASK_ENV', 'default'))

# Set logging level based on environment
if os.getenv('FLASK_ENV') == 'production':
    app.logger.setLevel(logging.INFO)

@app.route('/')
def home():
    app.logger.info('Home endpoint accessed')
    return 'Hello, Flask! 123'

@app.route('/health')
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route('/test1', methods=['GET'])
@limiter.limit(app.config['RATE_LIMIT'])
def test1():
    app.logger.info("Test1 endpoint accessed")
    return 'test1'

@app.route('/getCal', methods=['POST', 'OPTIONS'])
@limiter.limit(app.config['RATE_LIMIT'])
def get_cal():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    else:
        data = request.json
        app.logger.info("Calculation request received")

        # Extracting JSON data into separate variables
        age = data.get('age')
        initial_capital = data.get('initialCapital')
        yearly_withdraw = data.get('yearlyWithdraw')
        inflation = data.get('inflation')
        return_type = data.get('returnType') #S (Simple), M (Market index), I (Investment)
        # Handle missing required fields
        if data.get('backTestYear') is None:
            response = jsonify({"error": "backTestYear is required"}), 400
            return _corsify_actual_response(response[0]), response[1]
        back_test_year = int(data.get('backTestYear'))
        index = data.get('index')  
        portfolio=None
        if return_type == "M":
            return_type = "I"
            portfolio={index: 1.0}
        elif return_type == "I":
            portfolio = data.get('portfolio')
        # Set default value for fixReturn if not provided
        fix_return = data.get('fixReturn', 0)  # Default to 0 if not provided
        div_withhold_tax = data.get('divWithholdTax')
        
        stockCal = StockCal()
        # Check for other required fields
        if initial_capital is None or yearly_withdraw is None or inflation is None:
            response = jsonify({"error": "initialCapital, yearlyWithdraw, and inflation are required"}), 400
            return _corsify_actual_response(response[0]), response[1]
            
        try:
            df = stockCal.get_yearly_investment_return(
                portfolio,  
                initial_investment=float(initial_capital),
                initial_withdrawal=float(yearly_withdraw),
                withdrawal_inflation_rate=float(inflation)/100,
                dividend_tax_rate=float(div_withhold_tax or 0)/100,  # Default to 0 if None
                start_year=back_test_year,
                starting_age=int(age or 30),  # Default to 30 if None
                return_type=return_type or 'S',  # Default to 'S' if None
                expected_return=float(fix_return)/100,
                initial_dividend_yield=0, 
                dividend_growth=0
            )
        except (TypeError, ValueError) as e:
            response = jsonify({"error": str(e)}), 400
            return _corsify_actual_response(response[0]), response[1]

        # Convert DataFrame to proper JSON
        json_data = json.loads(df)  # Since df is already a JSON string
        response = jsonify(json_data)
        return _corsify_actual_response(response)

def _build_cors_preflight_response():
    response = jsonify(success=True)
    origin = request.headers.get('Origin')
    app.logger.debug(f"Received preflight request from origin: {origin}")
    app.logger.debug(f"Allowed origins: {app.config['CORS_ORIGINS']}")
    if origin in app.config['CORS_ORIGINS']:
        app.logger.debug(f"Adding CORS headers for origin: {origin}")
        response.headers.add("Access-Control-Allow-Origin", origin)
    else:
        app.logger.debug(f"Origin not allowed: {origin}")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
    return response

def _corsify_actual_response(response):
    origin = request.headers.get('Origin')
    app.logger.debug(f"Received request from origin: {origin}")
    app.logger.debug(f"Allowed origins: {app.config['CORS_ORIGINS']}")
    if origin in app.config['CORS_ORIGINS']:
        app.logger.debug(f"Adding CORS headers for origin: {origin}")
        response.headers.add("Access-Control-Allow-Origin", origin)
    else:
        app.logger.debug(f"Origin not allowed: {origin}")
    return response

# Global error handler
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {str(e)}")
    response = jsonify({"error": "Internal server error"}), 500
    return _corsify_actual_response(response[0]), response[1]

if __name__ == '__main__':
    # Add the current directory to Python path
    import sys
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    # In production, debug should be False
    debug = os.getenv('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=5000)
