"""Integration tests for the API endpoints."""
import pytest
import json
from app.app import app
from app.fin.stock_cal import StockCal

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_full_calculation_workflow(client):
    """Test a complete calculation workflow with real data."""
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
    
    # Test the calculation endpoint
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    
    assert response.status_code == 200
    result = response.get_data()
    assert result is not None

def test_error_handling(client):
    """Test error handling for invalid inputs."""
    # Test with missing required fields
    data = {'age': 30}
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    assert response.status_code != 200

    # Test with invalid data types
    data = {
        'age': 'invalid',
        'initialCapital': 'invalid',
        'yearlyWithdraw': 5000,
        'inflation': 2,
        'returnType': 'M',
        'backTestYear': 2020
    }
    response = client.post('/getCal',
                         data=json.dumps(data),
                         content_type='application/json')
    assert response.status_code != 200
