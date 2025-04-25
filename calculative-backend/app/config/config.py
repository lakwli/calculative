"""Configuration settings for different environments."""
from os import environ

class Config:
    """Base configuration."""
    TESTING = False
    SECRET_KEY = environ.get('SECRET_KEY', 'dev-key-change-in-production')
    CORS_ORIGINS = environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',')
    RATE_LIMIT = environ.get('RATE_LIMIT', '100 per minute')

class ProductionConfig(Config):
    """Production configuration."""
    FLASK_ENV = 'production'
    LOG_LEVEL = 'INFO'
    # Ensure these are set in production environment
    def __init__(self):
        if not environ.get('SECRET_KEY'):
            raise ValueError("SECRET_KEY must be set in production")
        if environ.get('CORS_ORIGINS') == 'http://localhost:3000':
            raise ValueError("CORS_ORIGINS must be set in production")

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
