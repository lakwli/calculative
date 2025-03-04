import yfinance as yf
import pandas as pd


import os
import json
from app.config.market_indices import MARKET_INDICES

def get_stock_data(ticker, start_date=None, end_date=None):

    """
    Fetch full available historical stock data using period="max".
    """
    stock = yf.Ticker(ticker)
    hist = stock.history(period="max")
    return hist

def calculate_annual_returns(hist):
    """
    Calculates annual returns and dividend yield.
    
    For each year:
      - The starting price is the first adjusted (or closing) price of that year.
      - The ending price is the last adjusted (or closing) price of that year.
      - Dividends for the year are summed.
      
    Total Return = (End Price + Total Dividends - Start Price) / Start Price  
    Dividend Yield = Total Dividends / Start Price
    
    Returns a DataFrame with columns: Year, Return, Dividend Yield (%).
    """
    # Use a copy of the DataFrame and extract the year
    hist = hist.copy()
    hist['Year'] = hist.index.year

    # Use "Adj Close" if available; otherwise, fallback to "Close"
    price_column = 'Adj Close' if 'Adj Close' in hist.columns else 'Close'
    
    annual_data = []
    for year, group in hist.groupby('Year'):
        group = group.sort_index()  # ensure chronological order
        start_price = group[price_column].iloc[0]
        end_price = group[price_column].iloc[-1]
        dividends_sum = group['Dividends'].sum()
        
        total_return = (end_price + dividends_sum - start_price) / start_price
        dividend_yield = dividends_sum / start_price
        
        annual_data.append({
            'Year': year,
            'Return': total_return,
            'Dividend Yield (%)': dividend_yield * 100
        })
        
    return pd.DataFrame(annual_data)

def get_index_data(ticker):
    indices_dir = "app/data/indices"
    cleaned_ticker = ticker.replace("^", "").replace("=", "")
    filepath = os.path.join(indices_dir, f"{cleaned_ticker}.json")

    try:
        with open(filepath, 'r') as f:
            index_data = json.load(f)
            return index_data
    except FileNotFoundError:
        print(f"Error: Data for {ticker} not found.")
        return None


def main():
    indices_dir = "app/data/indices"
    os.makedirs(indices_dir, exist_ok=True)

    for ticker, data in MARKET_INDICES.items():
        try:
            hist = get_stock_data(ticker)
            if hist.empty:
                print(f"No data found for {ticker}")
                continue  # Skip to the next ticker if no data

            annual_df = calculate_annual_returns(hist)

            # Create JSON output
            output_data = {
                "index": ticker,
                "name": data["name"],
                "description": data.get("description", ""), # Include description if available
                "annual_performance": annual_df.to_dict('records')
            }

            #Remove special characters from ticker for filename
            cleaned_ticker = ticker.replace("^", "").replace("=", "")

            output_filename = os.path.join(indices_dir, f"{cleaned_ticker}.json")
            with open(output_filename, "w") as f:
                json.dump(output_data, f, indent=4)
            print(f"JSON data for {ticker} saved to {output_filename}")

        except Exception as e:
            print(f"An error occurred processing {ticker}:", e)

if __name__ == "__main__":
    main()
    #print(get_index_data("GSPC"))
