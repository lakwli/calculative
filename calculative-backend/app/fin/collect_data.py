import yfinance as yf
import pandas as pd

# List of stock tickers
tickers = ["AAPL", "MSFT", "GOOGL"]

# Set the start and end dates for the data
start_date = "1990-01-01"
end_date = "2020-12-31"

# Download the historical data for each ticker
for ticker in tickers:
    try:
        data = yf.download(ticker, start=start_date, end=end_date)
        if data.empty:
            print(f"Failed to get data for {ticker}")
            continue
        
        # Log the columns to check what's available
        print(f"Columns in {ticker} data: {data.columns.tolist()}")

        # Ensure the necessary columns exist before processing
        if 'Open' in data.columns and 'Close' in data.columns and 'Dividends' in data.columns:
            data['Year'] = data.index.year
            yearly_data = data.groupby('Year').agg({
                'Open': 'first',
                'Close': 'last',
                'Dividends': 'sum'
            })
            yearly_data['Return'] = (yearly_data['Close'] - yearly_data['Open']) / yearly_data['Open'] * 100
            yearly_data.to_csv(f"{ticker}_yearly_data.csv")
        else:
            print(f"Necessary columns are missing for {ticker}")
    except Exception as e:
        print(f"An error occurred for {ticker}: {e}")

print("Historical data downloaded and processed!")
