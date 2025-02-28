import requests
import pandas as pd
import io  # Use Python's built-in io module instead of pandas.compat

# Replace with your Alpha Vantage API key
API_KEY = "I6IH71U9XSJ7IW2A"

def fetch_market_indices(api_key):
    """
    Fetches a list of market indices dynamically using Alpha Vantage's LISTING_STATUS endpoint.
    
    :param api_key: Your Alpha Vantage API key
    :return: List of market indices
    """
    # Alpha Vantage LISTING_STATUS endpoint
    url = f"https://www.alphavantage.co/query?function=LISTING_STATUS&apikey={api_key}"
    
    try:
        # Fetch the data
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error fetching data: {response.status_code}")
            return []
        
        # Parse the CSV data into a DataFrame using io.StringIO
        data = pd.read_csv(io.StringIO(response.text))
        
        # Filter rows where 'assetType' is 'Index'
        indices = data[data['assetType'] == 'Index']
        return indices['symbol'].tolist()
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    # Fetch the list of market indices
    indices = fetch_market_indices(API_KEY)
    
    # Print the results
    print("List of Market Indices:")
    for index in indices:
        print(index)