"""Configuration settings for different environments."""
from os import environ
from dotenv import load_dotenv

# Load .env file if it exists (development)
load_dotenv()

class Config:
    """Base configuration."""
    TESTING = False
    SECRET_KEY = environ.get('SECRET_KEY')
    _cors_origins_raw = environ.get('CORS_ORIGINS', '').split(',') if environ.get('CORS_ORIGINS') else []
    CORS_ORIGINS = [origin.strip() for origin in _cors_origins_raw if origin.strip()]
    RATE_LIMIT = environ.get('RATE_LIMIT', '100 per minute')

    @staticmethod
    def is_valid_origin(origin):
        """Validate if an origin matches the allowed patterns, including wildcards."""
        if not origin:
            return False
        
        allowed_origins = Config.CORS_ORIGINS
        if not allowed_origins:
            return False

        try:
            for pattern in allowed_origins:
                # Handle wildcard subdomains
                if pattern.startswith('https://*.'):
                    domain = pattern.replace('https://*.', '')
                    if origin.endswith(domain) and origin.startswith('https://'):
                        return True
                # Handle exact matches
                elif pattern == origin:
                    return True
            return False
        except Exception:
            return False

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
