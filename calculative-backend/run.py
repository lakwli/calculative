"""Run the Flask application."""
#/app$ python run.py
import os
import sys

# Add the application package to the Python path if necessary,
# though relative imports within the 'app' package should handle most cases.
# sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import the application factory
from app import create_app

if __name__ == '__main__':
    # Determine the configuration name ('development', 'production', etc.)
    config_name = os.getenv('FLASK_ENV', 'default')
    # Create the app instance using the factory
    app = create_app(config_name)

    # Determine debug mode based on environment (or app.config['DEBUG'])
    debug = app.config.get('DEBUG', False) # Get debug status from loaded config
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug, host='0.0.0.0', port=port)
