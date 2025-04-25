"""Run the Flask application."""
#/app$ python run.py
import os
import sys

# Add the application to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.app import app

if __name__ == '__main__':
    # In production, debug should be False
    debug = os.getenv('FLASK_ENV') != 'production'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug, host='0.0.0.0', port=port)
