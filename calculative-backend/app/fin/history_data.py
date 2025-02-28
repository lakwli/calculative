import yfinance as yf
import pandas as pd


market_indices = [
    "^GSPC",  # S&P 500
    "^DJI",   # Dow Jones Industrial Average
    "^IXIC",  # NASDAQ Composite
    "^FTSE",  # FTSE 100
    "^N225",  # Nikkei 225
    "^GDAXI", # DAX Performance Index
    "^FCHI",  # CAC 40
    "^HSI",   # Hang Seng Index
    "^BSESN", # BSE Sensex
    "^STOXX50E"  # EURO STOXX 50
]



def get_stock_data(ticker):
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

def main():
    ticker = input("Enter stock ticker (e.g., SCHD): ").upper().strip()
    
    try:
        hist = get_stock_data(ticker)
        if hist.empty:
            print("No data found for the specified stock.")
            return

        # Determine the full date range available
        start_date = hist.index.min().strftime("%Y-%m-%d")
        end_date = hist.index.max().strftime("%Y-%m-%d")
        print(f"Data available from {start_date} to {end_date}")

        annual_df = calculate_annual_returns(hist)
        print("\nAnnual Performance:")
        print(annual_df.to_string(index=False, formatters={
            'Return': '{:.2%}'.format,
            'Dividend Yield (%)': '{:.2f}%'.format
        }))
    except Exception as e:
        print("An error occurred:", e)

if __name__ == "__main__":
    main()
