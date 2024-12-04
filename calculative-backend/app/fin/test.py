import yfinance as yf
import pandas as pd
from flask import jsonify
from datetime import datetime
import json


def simulate_retirement(indexe, start_year, initial_age, initial_capital, annual_withdrawal, inflation_rate, return_type, expected_return=None, dividend_tax_rate=0.30):
    if return_type == "I":
        sp500 = yf.Ticker(indexe)
        end_year = '2023-12-31'
        historical_data = sp500.history(start=str(start_year)+'-01-01', end=end_year, interval='1d')[['Close']]
        historical_dividends = sp500.dividends.resample('Y').sum()  # Annual dividends
        print(historical_dividends)
        
        start_prices = historical_data.resample('Y').first()
        end_prices = historical_data.resample('Y').last()
        
        historical_data_yearly = end_prices  # This already gives us yearly data
        print("Historical Data Yearly:", historical_data_yearly)
    else:
        start_year_str = str(start_year)+'-01-01'
        end_year = str(start_year+50)+'-12-31'
        historical_data_yearly = pd.DataFrame({"Date": pd.date_range(start=start_year_str, periods=(50), freq='Y')})
        historical_data_yearly.set_index("Date", inplace=True)
        historical_data_yearly["Close"] = 0  # Dummy data to fit the structure

    capital = initial_capital
    age = initial_age
    results = []

    for i, (date, row) in enumerate(historical_data_yearly.iterrows()):
        year = date.year
        print(f"Processing year: {year}, Close: {row['Close']}")
        withdrawal = annual_withdrawal * ((1 + inflation_rate) ** i)
        capital_after_withdrawal = capital - withdrawal

        if return_type == "F":
            yearly_return_percent = expected_return
        else:
            start_price = start_prices.iloc[i]['Close'] if i > 0 else start_prices.iloc[0]['Close']
            end_price = end_prices.iloc[i]['Close']
            print(f"Start Price: {start_price}, End Price: {end_price}")
            yearly_return_percent = (end_price - start_price) / start_price * 100
            print(f"Calculated Yearly Return Percent: {yearly_return_percent}")

        price_return = yearly_return_percent
        num_shares = capital_after_withdrawal / start_price  # Calculate number of shares at the start price
        total_dividends = historical_dividends.loc[historical_dividends.index.year == year].sum() * num_shares
        net_dividend = total_dividends * (1 - dividend_tax_rate)
        effective_return = price_return + (net_dividend / capital_after_withdrawal) * 100
        yearly_return_money = capital_after_withdrawal * effective_return / 100
        end_of_year_capital = capital_after_withdrawal + yearly_return_money

        results.append({
            'Age': age,
            'Year': year,
            'Beginning Capital ($)': capital,
            'Withdrawal ($)': withdrawal,
            'Capital After Withdrawal ($)': capital_after_withdrawal,
            'End of Year Capital ($)': end_of_year_capital,
            'Price Return (%)': price_return,
            'Total Dividends ($)': total_dividends,
            'Net Dividend ($)': net_dividend,
            'Effective Return (%)': effective_return,
            'Yearly Return ($)': yearly_return_money
        })

        if capital_after_withdrawal <= 0:
            break

        capital = end_of_year_capital
        age += 1

    df = pd.DataFrame(results)
    pretty_json = json.dumps(df.to_dict(orient='records'), indent=4)
    print(pretty_json)
    return df





def test_run_Index():
    df=simulate_retirement(
        #indexe="^GSPC",  # S&P 500 Index
        indexe="SPY",  # S&P 500 Index
        start_year=1999,
        initial_age=56,
        initial_capital=1000000,
        annual_withdrawal=60000,
        inflation_rate=0.03,
        return_type="I",
        expected_return=None  # Not used in index based return
    )
    json_data = df.to_dict(orient='records')
    pretty_json = json.dumps(json_data, indent=4)
    print(pretty_json)
    return df


test_run_Index()