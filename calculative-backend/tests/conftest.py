"""
pytest configuration file.
This file contains shared fixtures and settings for tests.
"""

import os
import sys
from pathlib import Path

# Get the project root directory (calculative-backend)
ROOT_DIR = Path(__file__).parent.parent.absolute()

# Add the root directory to Python path
sys.path.insert(0, str(ROOT_DIR))

# Add the app directory to Python path
APP_DIR = ROOT_DIR / 'app'
sys.path.insert(0, str(APP_DIR))
