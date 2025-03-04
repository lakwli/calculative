import requests
import pandas as pd

# Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
API_KEY = '5K75C2AXLV1CVKC1'
symbol = 'SCHD'  # Replace with your desired stock symbol

def getPrice():
    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}'
    response = requests.get(url)
    data = response.json()

    # Extract the latest price
    latest_price = data['Global Quote']['05. price']
    print(f'The latest price of {symbol} is: ${latest_price}')

def getWorseReturn():
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol={symbol}&apikey={API_KEY}'

    response = requests.get(url)
    data = response.json()

    # Convert data to DataFrame
    time_series = data['Monthly Time Series']
    df = pd.DataFrame.from_dict(time_series, orient='index', dtype=float)

    # Calculate yearly returns
    df['year'] = pd.to_datetime(df.index).year
    df['monthly_return'] = df['4. close'].pct_change()
    yearly_returns = df.groupby('year')['monthly_return'].apply(lambda x: (1 + x).prod() - 1)

    # Find the year with the worst return
    worst_year = yearly_returns.idxmin()
    worst_return = yearly_returns.min()

    print(f'The worst return for {symbol} was {worst_return:.2%} in the year {worst_year}.')

def getNegativeReturns():
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol={symbol}&apikey={API_KEY}'

    response = requests.get(url)
    data = response.json()

    # Convert data to DataFrame
    time_series = data['Monthly Time Series']
    df = pd.DataFrame.from_dict(time_series, orient='index', dtype=float)

    # Limit to the last 20 years
    df.index = pd.to_datetime(df.index)
    df = df[df.index > pd.Timestamp.now() - pd.DateOffset(years=20)]

    # Calculate yearly returns
    df['year'] = df.index.year
    df['monthly_return'] = df['4. close'].pct_change()
    yearly_returns = df.groupby('year')['monthly_return'].apply(lambda x: (1 + x).prod() - 1)

    # Filter for years with negative returns
    negative_returns = yearly_returns[yearly_returns < 0]

    # Print the years and their respective negative returns
    for year, ret in negative_returns.items():
        print(f'The return for {symbol} was {ret:.2%} in the year {year}.')



getNegativeReturns()
