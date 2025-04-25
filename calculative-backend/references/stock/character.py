import yfinance as yf
import pandas as pd
import numpy as np

def stock_characteristics(ticker, period="1y"):
    # Fetch historical data
    data = yf.download(ticker, period=period)
    
    # Calculate metrics
    data['Daily_Return'] = data['Close'].pct_change()
    data['Volatility'] = data['Daily_Return'].rolling(window=20).std() * np.sqrt(252)  # Annualized volatility
    data['50_MA'] = data['Close'].rolling(window=50).mean()
    data['200_MA'] = data['Close'].rolling(window=200).mean()
    
    # Classification
    volatility = data['Volatility'].mean()
    trend_strength = data['50_MA'][-1] > data['200_MA'][-1]
    
    if volatility > 0.4:
        category = "Hot and Volatile"
    elif trend_strength:
        category = "Resilient Growth"
    else:
        category = "Mean-Reverting or Weak Trend"
    
    return {
        "Ticker": ticker,
        "Volatility": volatility,
        "Trend Strength": trend_strength,
        "Category": category
    }

# Test the function
stocks = ["AAPL", "TSLA", "NVDA", "XOM", "UAL"]
for stock in stocks:
    print(stock_characteristics(stock))