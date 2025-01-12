import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def get_stock_data(ticker, period="1mo", interval="1d"):
    """Fetch historical data for the stock."""
    return yf.download(ticker, period=period, interval=interval)

def detect_hot_stocks(stock_list, threshold=10):
    """Identify hot stocks based on percentage change in the past week."""
    hot_stocks = []
    for ticker in stock_list:
        data = get_stock_data(ticker, period="5d")
        if data.empty:
            continue
        price_change = (data['Close'].iloc[-1] - data['Close'].iloc[0]) / data['Close'].iloc[0] * 100
        print(f"Price change for {ticker}: {price_change:.2f}%")
        if price_change >= threshold:
            hot_stocks.append((ticker, price_change))
    return hot_stocks

def monitor_stock_trend(ticker):
    """Analyze trend sustainability for the detected hot stock."""
    data = get_stock_data(ticker, period="1mo")
    if data.empty:
        print(f"No data for {ticker}")
        return
    
    # Calculate moving averages
    data['SMA5'] = data['Close'].rolling(window=5).mean()
    data['Volume_Change'] = data['Volume'].pct_change()
    
    # Plot price and trend
    plt.figure(figsize=(12, 6))
    plt.plot(data['Close'], label="Close Price", color="blue")
    plt.plot(data['SMA5'], label="5-Day SMA", color="orange", linestyle="--")
    plt.title(f"{ticker} Trend Analysis")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.legend()
    plt.grid()
    plt.show()
    
    # Check for weakening trend
    recent_volume_change = data['Volume_Change'][-7:].mean()
    if recent_volume_change < 0:
        print(f"Warning: {ticker}'s volume is declining.")
    else:
        print(f"{ticker} is maintaining momentum.")

# Main Function
def main():
    stock_list = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'META']  # Add more tickers
    hot_stocks = detect_hot_stocks(stock_list)
    
    print("Hot Stocks Detected:")
    for ticker, change in hot_stocks:
        print(f"{ticker}: {change:.2f}% increase in the past week")
    
    if hot_stocks:
        print("\nMonitoring Trends for Hot Stocks:")
        for ticker, _ in hot_stocks:
            monitor_stock_trend(ticker)

if __name__ == "__main__":
    main()