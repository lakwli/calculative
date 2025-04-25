import pytest
from app.app import app
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['CORS_ORIGINS'] = ['http://localhost:3000']
    with app.test_client() as client:
        yield client

def test_home_route(client):
    """Test the home route"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello, Flask! 123' in response.data

def test_test1_route(client):
    """Test the test1 route"""
    response = client.get('/test1')
    assert response.status_code == 200
    assert b'test1' in response.data

def test_getCal_options_allowed_origin(client):
    """Test the OPTIONS preflight request for getCal with allowed origin"""
    headers = {
        'Origin': 'http://localhost:3000'
    }
    response = client.options('/getCal', headers=headers)
    assert response.status_code == 200
    assert response.headers['Access-Control-Allow-Origin'] == 'http://localhost:3000'
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers

def test_getCal_options_disallowed_origin(client):
    """Test the OPTIONS preflight request for getCal with disallowed origin"""
    headers = {
        'Origin': 'http://malicious-site.com'
    }
    response = client.options('/getCal', headers=headers)
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' not in response.headers
    assert 'Access-Control-Allow-Methods' in response.headers
    assert 'Access-Control-Allow-Headers' in response.headers

def test_getCal_post_cors(client):
    """Test CORS headers in POST response"""
    headers = {
        'Origin': 'http://localhost:3000'
    }
    data = {
        'age': 30,
        'initialCapital': 100000,
        'yearlyWithdraw': 5000,
        'inflation': 2,
        'returnType': 'S',
        'backTestYear': 2020,
        'fixReturn': 5
    }
    response = client.post('/getCal', 
                        headers=headers,
                        json=data)
    assert response.status_code == 200
    assert response.headers['Access-Control-Allow-Origin'] == 'http://localhost:3000'

def test_getCal_error_cors(client):
    """Test CORS headers in error response"""
    headers = {
        'Origin': 'http://localhost:3000'
    }
    data = {'age': 30}  # Missing required fields
    response = client.post('/getCal', 
                        headers=headers,
                        json=data)
    assert response.status_code == 400
    assert response.headers['Access-Control-Allow-Origin'] == 'http://localhost:3000'

def test_getCal_simple_return(client):
    """Test getCal with simple return type"""
    data = {
        'age': 30,
        'initialCapital': 100000,
        'yearlyWithdraw': 5000,
        'inflation': 2,
        'returnType': 'S',
        'backTestYear': 2020,
        'fixReturn': 5,
        'divWithholdTax': 0
    }
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    assert response.status_code == 200

def test_getCal_market_index(client):
    """Test getCal with market index return type"""
    data = {
        'age': 30,
        'initialCapital': 100000,
        'yearlyWithdraw': 5000,
        'inflation': 2,
        'returnType': 'M',
        'backTestYear': 2020,
        'index': '^GSPC',
        'divWithholdTax': 30
    }
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    assert response.status_code == 200

def test_getCal_investment(client):
    """Test getCal with investment portfolio"""
    data = {
        'age': 30,
        'initialCapital': 100000,
        'yearlyWithdraw': 5000,
        'inflation': 2,
        'returnType': 'I',
        'backTestYear': 2020,
        'portfolio': {'^GSPC': 0.6, '^IRX': 0.4},
        'divWithholdTax': 30
    }
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    assert response.status_code == 200

def test_getCal_missing_data(client):
    """Test getCal with missing required data"""
    data = {
        'age': 30  # Missing other required fields
    }
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    # Since the app doesn't have explicit error handling for missing fields,
    # we expect it to fail when trying to process the data
    assert response.status_code != 200
