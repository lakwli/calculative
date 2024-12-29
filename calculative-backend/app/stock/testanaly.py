import yfinance as yf
import numpy as np
import pandas as pd

def calculate_support_resistance(data):
    support = data['Low'].min()
    resistance = data['High'].max()
    return support, resistance

def calculate_probabilities(data, threshold=0.001):
    returns = data['Close'].pct_change().dropna()
    up_prob = (returns > threshold).mean()
    down_prob = (returns < -threshold).mean()
    return up_prob, down_prob

# Fetch stock data from Yahoo Finance
symbol = 'AAPL'
data = yf.download(symbol, period='1y', interval='1d')

# Calculate support and resistance lines
support, resistance = calculate_support_resistance(data)


# Calculate probabilities of price movements
up_prob_0_1, down_prob_0_1 = calculate_probabilities(data, threshold=0.001)
up_prob_0_2, down_prob_0_2 = calculate_probabilities(data, threshold=0.002)

# Assuming support and resistance are scalar values, not Series
print(f"Support Line: {support}")
print(f"Resistance Line: {resistance}")
print(f"Probability of price going up by 0.1%: {up_prob_0_1.iloc[0] * 100:.2f}%")
print(f"Probability of price going down by 0.1%: {down_prob_0_1.iloc[0] * 100:.2f}%")
print(f"Probability of price going up by 0.2%: {up_prob_0_2.iloc[0] * 100:.2f}%")
print(f"Probability of price going down by 0.2%: {down_prob_0_2.iloc[0] * 100:.2f}%")