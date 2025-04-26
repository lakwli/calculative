"""Initialize the app package."""
import os
import logging
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime
from flask import Flask, Blueprint
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Import configurations
from app.config.config import config

# Custom JSON Formatter
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
            "pathname": record.pathname,
            "lineno": record.lineno,
        }
        # Add extra fields if available (e.g., request info)
        if hasattr(record, 'request_info'):
            log_record.update(record.request_info)
        if record.exc_info:
            # Add exception info if present
            log_record['exception'] = self.formatException(record.exc_info)
            # Optionally add stack trace
            # log_record['stack_trace'] = self.formatStack(record.stack_info)
        return json.dumps(log_record)

def setup_logging(app):
    """Configure logging for the application."""
    log_dir = '/app/logs'  # Log directory inside the container
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir)
            # Ensure the directory is writable by the app user
            # This might be needed depending on permissions setup
            # os.chmod(log_dir, 0o755)
        except OSError as e:
            # Handle potential errors during directory creation
            print(f"Error creating log directory {log_dir}: {e}")
            # Fallback or raise an error if logging is critical
            return

    log_level_str = os.getenv('LOG_LEVEL', 'INFO' if os.getenv('FLASK_ENV') == 'production' else 'DEBUG')
    log_level = getattr(logging, log_level_str.upper(), logging.INFO)

    formatter = JsonFormatter()

    # --- Application Logger (for general app events) ---
    app_handler = RotatingFileHandler(
        os.path.join(log_dir, 'application.log'),
        maxBytes=100*1024*1024,  # 100 MB
        backupCount=5,  # Keep 5 backup files (e.g., app.log, app.log.1, ..., app.log.5)
        encoding='utf-8'
    )
    app_handler.setFormatter(formatter)
    app_handler.setLevel(log_level) # Use the determined log level

    # --- Error Logger (for warnings, errors, critical issues) ---
    error_handler = RotatingFileHandler(
        os.path.join(log_dir, 'error.log'),
        maxBytes=100*1024*1024,  # 100 MB
        backupCount=5,
        encoding='utf-8'
    )
    error_handler.setFormatter(formatter)
    error_handler.setLevel(logging.WARNING) # Capture WARNING level and above

    # --- Access Logger (for HTTP request/response info) ---
    # We create the logger here, but it will be used via middleware/decorators in app.py
    access_handler = RotatingFileHandler(
        os.path.join(log_dir, 'access.log'),
        maxBytes=100*1024*1024,  # 100 MB
        backupCount=5,
        encoding='utf-8'
    )
    access_handler.setFormatter(formatter)
    access_handler.setLevel(logging.INFO) # Typically INFO level for access logs
    access_logger = logging.getLogger('access')
    # Check if handlers already exist to prevent duplicates during reloads (in dev)
    if not access_logger.hasHandlers():
        access_logger.addHandler(access_handler)
    access_logger.setLevel(logging.INFO)
    access_logger.propagate = False # Prevent access logs from bubbling up to the root logger

    # Configure Flask's default logger (app.logger)
    # Remove default Flask handlers if you ONLY want file logging
    # del app.logger.handlers[:]

    # Add our file handlers to Flask's logger
    # Check if handlers already exist
    if not any(isinstance(h, RotatingFileHandler) and h.baseFilename == app_handler.baseFilename for h in app.logger.handlers):
         app.logger.addHandler(app_handler)
    if not any(isinstance(h, RotatingFileHandler) and h.baseFilename == error_handler.baseFilename for h in app.logger.handlers):
         app.logger.addHandler(error_handler)

    app.logger.setLevel(log_level) # Set the overall level for the app logger

    # Optionally configure Werkzeug logger (handles basic request logs)
    werkzeug_logger = logging.getLogger('werkzeug')
    # You might want to redirect Werkzeug logs to your access log or app log
    # Or disable its default handler if it's too noisy / redundant
    # Example: Redirect to access log
    # if not werkzeug_logger.hasHandlers():
    #    werkzeug_logger.addHandler(access_handler)
    # werkzeug_logger.setLevel(logging.INFO)
    # werkzeug_logger.propagate = False # Prevent double logging if needed

    app.logger.info(f"Logging configured. Level: {log_level_str}. Log directory: {log_dir}")

# Initialize Limiter globally so it can be imported by blueprints
limiter = Limiter(
    key_func=get_remote_address,
    # We will initialize it with the app later
)

def create_app(config_name='default'):
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Load config before setting up logging, as config might influence logging
    app.config.from_object(config[config_name]())

    # Setup Logging (call this only once)
    setup_logging(app)

    # Initialize CORS early - using '*' for now to debug, refine later
    # Ensure supports_credentials=True if you need cookies/auth headers
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    app.logger.info(f"CORS initialized with origins: *") # Log CORS setup

    # Initialize Limiter with the app instance
    limiter.init_app(app)
    app.logger.info(f"Limiter initialized with default limits: {app.config.get('RATE_LIMIT', '100 per minute')}")

    # Import and register Blueprints
    # We will create this file in the next step
    try:
        from .routes import main_routes
        app.register_blueprint(main_routes)
        app.logger.info("Registered main_routes Blueprint.")
    except ImportError as e:
        app.logger.error(f"Failed to import or register Blueprint: {e}")
        # Decide how to handle this - maybe raise the error or log and continue
        raise e # Re-raise to make the startup failure clear

    # Return only the app instance
    return app
