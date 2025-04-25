"""Initialize the app package."""
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Import configurations
from app.config.config import config

def create_app(config_name='default'):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(config[config_name]())
    
    # Initialize extensions
    CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=[app.config['RATE_LIMIT']]
    )
    
    return app, limiter
