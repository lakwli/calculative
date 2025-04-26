"""Configuration settings for different environments."""
from os import environ
from dotenv import load_dotenv

# Load .env file if it exists (development)
load_dotenv()

class Config:
    """Base configuration."""
    TESTING = False
    SECRET_KEY = environ.get('SECRET_KEY')
    CORS_ORIGINS = environ.get('CORS_ORIGINS').split(',') if environ.get('CORS_ORIGINS') else None
    RATE_LIMIT = environ.get('RATE_LIMIT', '100 per minute')

class ProductionConfig(Config):
    """Production configuration."""
    FLASK_ENV = 'production'
    LOG_LEVEL = 'INFO'
    # Ensure these are set in production environment
    def __init__(self):
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY must be set in environment")
        if not self.CORS_ORIGINS:
            raise ValueError("CORS_ORIGINS must be set in environment")

class DevelopmentConfig(Config):
    """Development configuration."""
    FLASK_ENV = 'development'
    LOG_LEVEL = 'DEBUG'

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    LOG_LEVEL = 'DEBUG'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
