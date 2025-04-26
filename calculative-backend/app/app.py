"""
Main application file.
This file is now primarily responsible for creating the app instance via the factory.
Route definitions and handlers are moved to app/routes.py.
"""
import os
from . import create_app

# Note: The app instance is now created in run.py using the create_app factory
# No routes or handlers should be defined directly in this file anymore.

# Example of how the app might be created if needed elsewhere (but typically done in run.py):
# if __name__ != '__main__': # Avoid creating app when run directly if run.py is entry point
#     app = create_app(os.getenv('FLASK_ENV', 'default'))
