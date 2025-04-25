import yfinance as yf
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
import joblib

# Fetch stock data from Yahoo Finance
symbol = 'AAPL'
data = yf.download(symbol, period='1y', interval='1d')

# Preprocess data
data['Return'] = data['Close'].pct_change().dropna()
data = data.dropna()

# Feature engineering
data['Open-Close'] = data['Open'] - data['Close']
data['High-Low'] = data['High'] - data['Low']

# Feature selection
X = data[['Open', 'High', 'Low', 'Close', 'Volume', 'Open-Close', 'High-Low']]
y = data['Return']

# Normalize the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train a Gradient Boosting model
model = GradientBoostingRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')

# Save the model and the scaler
joblib.dump(model, 'stock_model.pkl')
joblib.dump(scaler, 'scaler.pkl')