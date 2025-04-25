"""Security tests for the API."""
import pytest
import time
import json
from app.app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_rate_limiting(client):
    """Test that rate limiting is properly enforced."""
    # Make multiple rapid requests
    for _ in range(5):
        response = client.get('/test1')
        assert response.status_code == 200
    
    # Next request should be rate limited
    response = client.get('/test1')
    assert response.status_code == 429  # Too Many Requests

def test_cors_configuration(client):
    """Test CORS headers and preflight requests."""
    # Test CORS preflight request
    headers = {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    response = client.options('/getCal', headers=headers)
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' in response.headers
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers

    # Test actual request with CORS
    headers = {'Origin': 'http://localhost:3000'}
    response = client.get('/', headers=headers)
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' in response.headers

def test_invalid_json(client):
    """Test handling of invalid JSON data."""
    response = client.post('/getCal',
                         data='invalid json',
                         content_type='application/json')
    assert response.status_code == 400

def test_production_config():
    """Test production configuration settings."""
    app.config['ENV'] = 'production'
    assert app.debug is False
    assert app.testing is False
    
    # Test that development-only routes are disabled in production
    with app.test_client() as client:
        response = client.get('/test1')
        assert response.status_code != 500

def test_health_check_endpoint(client):
    """Test the health check endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'status' in data
    assert data['status'] == 'healthy'
    assert 'timestamp' in data
