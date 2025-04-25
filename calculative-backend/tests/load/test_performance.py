"""Load testing for API endpoints."""
import multiprocessing
import time
import requests
import json
from concurrent.futures import ThreadPoolExecutor
import statistics

def make_request():
    """Make a single request to the API."""
    url = 'http://localhost:5000/getCal'
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
    
    start_time = time.time()
    try:
        response = requests.post(url, json=data)
        response_time = time.time() - start_time
        return response.status_code, response_time
    except Exception as e:
        return 500, 0

def run_load_test(num_requests=100, concurrent_users=10):
    """Run a load test with specified number of concurrent users."""
    results = []
    successful_requests = 0
    
    with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
        futures = [executor.submit(make_request) for _ in range(num_requests)]
        for future in futures:
            status_code, response_time = future.result()
            if status_code == 200:
                successful_requests += 1
                results.append(response_time)
    
    if results:
        avg_response_time = statistics.mean(results)
        p95_response_time = statistics.quantiles(results, n=20)[18]  # 95th percentile
        
        return {
            'total_requests': num_requests,
            'successful_requests': successful_requests,
            'success_rate': (successful_requests / num_requests) * 100,
            'average_response_time': avg_response_time,
            'p95_response_time': p95_response_time
        }
    return None

def test_api_performance():
    """Test API performance under load."""
    results = run_load_test()
    assert results is not None
    assert results['success_rate'] > 95  # Expect 95% success rate
    assert results['average_response_time'] < 2  # Expect average response time under 2 seconds
    assert results['p95_response_time'] < 5  # Expect 95th percentile response time under 5 seconds

if __name__ == '__main__':
    # Run manual load test
    print("Running load test...")
    results = run_load_test()
    if results:
        print(f"Total Requests: {results['total_requests']}")
        print(f"Success Rate: {results['success_rate']}%")
        print(f"Average Response Time: {results['average_response_time']:.2f}s")
        print(f"95th Percentile Response Time: {results['p95_response_time']:.2f}s")
