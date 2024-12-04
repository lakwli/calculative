import yfinance as yf
import pandas as pd
import json

class StockCal:
    
    def get_yearly_investment_return(self, ticker, initial_investment=1000000, initial_withdrawal=60000, withdrawal_inflation_rate=0.00,
                                    dividend_tax_rate=0.30, start_year=2010, starting_age=55, return_type='I',
                                    expected_return=0.07, initial_dividend_amount=20000, expected_dividend_growth_rate=0.02):
        # Download historical price and dividend data if using real data
        if return_type == 'I':
            data = yf.download(ticker, start='1900-01-01', end='2023-12-31')
            dividends = yf.Ticker(ticker).dividends
            # Ensure both datasets have the same timezone
            data.index = data.index.tz_localize(None)
            dividends.index = dividends.index.tz_localize(None)
            # Find the earliest available year in the data
            earliest_year = data.index.min().year
            start_year = max(start_year, earliest_year)
            # Filter data to start from the given start year
            data = data[data.index.year >= start_year]
            dividends = dividends[dividends.index.year >= start_year]
            # Resample price data to get yearly data
            yearly_data = data.resample('Y').agg({
                'Open': 'first',
                'Close': 'last',
            })
            # Add dividends data and resample to yearly data
            if not dividends.empty:
                yearly_dividends = dividends.resample('Y').sum()
                yearly_data = yearly_data.join(yearly_dividends)
                yearly_data['Dividends'] = yearly_data['Dividends'].fillna(0)
            else:
                yearly_data['Dividends'] = 0
            # Calculate price return and total return including dividends
            yearly_data['Price Return (%)'] = (yearly_data['Close'] - yearly_data['Open']) / yearly_data['Open'] * 100
            yearly_data['Total Return (%)'] = ((yearly_data['Close'] + yearly_data['Dividends']) - yearly_data['Open']) / yearly_data['Open'] * 100
        
        # Initialize variables for calculation
        beginning_capital = initial_investment
        withdrawal_amount = initial_withdrawal
        current_age = starting_age
        json_data = []

        # Prepare the data
        if return_type == 'I':
            result = yearly_data.reset_index()
            result['Year'] = result['Date'].dt.year
            result = result[['Year', 'Open', 'Close', 'Price Return (%)', 'Dividends', 'Total Return (%)']]
            result.columns = ['Year', 'Starting Price', 'Ending Price', 'Price Return (%)', 'Total Dividend per Share ($)', 'Total Return including Dividend (%)']
        else:
            result = pd.DataFrame({'Year': range(start_year, start_year + (120 - starting_age))})
            result['Starting Price'] = None
            result['Ending Price'] = None
            result['Price Return (%)'] = expected_return * 100
            result['Total Dividend ($)'] = initial_dividend_amount
            result['Total Return including Dividend (%)'] = None
        
        for index, row in result.iterrows():
            year = row['Year']
            if return_type == 'I':
                starting_price = row['Starting Price']
                ending_price = row['Ending Price']
                price_return = row['Price Return (%)']
                total_dividend_per_share = row['Total Dividend per Share ($)']
                total_return = row['Total Return including Dividend (%)']
            else:
                starting_price = None
                ending_price = None
                price_return = expected_return * 100
                if index == 0:
                    total_dividend_per_share = initial_dividend_amount
                else:
                    total_dividend_per_share = result.at[index-1, 'Total Dividend ($)'] * (1 + expected_dividend_growth_rate)
                # Calculate beginning capital after withdrawal for 'F' type to ensure correct total return calculation
                beginning_capital_after_withdrawal = beginning_capital - withdrawal_amount
                total_return = price_return + (total_dividend_per_share / beginning_capital_after_withdrawal) * 100

            # Calculate beginning capital after withdrawal
            beginning_capital_after_withdrawal = beginning_capital - withdrawal_amount
            
            if beginning_capital_after_withdrawal < 0:
                break

            # Calculate the number of shares held at the beginning of the year
            if return_type == 'I':
                shares_held = beginning_capital_after_withdrawal / starting_price
            else:
                shares_held = beginning_capital_after_withdrawal / 100  # Assuming a fixed price of 100 for simplicity

            # Calculate dividends received for return type 'I' based on number of shares
            if return_type == 'I':
                dividends_received = shares_held * total_dividend_per_share
            else:
                dividends_received = total_dividend_per_share  # For return type 'F'

            # Apply dividend tax
            net_dividends = dividends_received * (1 - dividend_tax_rate)

            # Calculate capital gain
            capital_gain = beginning_capital_after_withdrawal * (price_return / 100)

            # Calculate effective return
            effective_return = capital_gain + net_dividends
            effective_return_percentage = (effective_return / beginning_capital_after_withdrawal) * 100
            
            # Simulate end of year capital
            end_of_year_capital = beginning_capital_after_withdrawal + effective_return

            if end_of_year_capital < 0:
                break

            # Append to JSON data
            json_data.append({
                "Age": current_age,
                "Year": year,
                "Beginning Capital ($)": f"{beginning_capital:,.0f}",
                "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                "End of Year Capital ($)": f"{end_of_year_capital:,.0f}",
                "Price Return (%)": f"{price_return:.2f}",
                "Capital Gain ($)": f"{capital_gain:,.0f}",
                "Total Dividends ($)": f"{dividends_received:,.0f}",
                "Net Dividend ($)": f"{net_dividends:,.0f}",
                "Effective Return (%)": f"{effective_return_percentage:.2f}",
                "Effective Return ($)": f"{effective_return:,.0f}"
            })

            # Update beginning capital and withdrawal amount for next year
            beginning_capital = end_of_year_capital
            withdrawal_amount *= (1 + withdrawal_inflation_rate)
            current_age += 1

        # Convert to JSON
        json_output = json.dumps(json_data, indent=4)
        print(json_output)
        return json_output

    #parsed_stocks = stock_cal.parse_stocks("AAPL,MSFT,GOOGL")
    def parse_stocks_even(self, stocks_input):
        allocation = 100 / len(stocks_input.split(','))
        stocks_list = [{'ticker': ticker.strip(), 'allocation': allocation} for ticker in stocks_input.split(',')]
        return stocks_list

def test():
    s = StockCal()
    s.get_yearly_investment_return('^GSPC', start_year=2000, starting_age=55, return_type='I', expected_return=0.07, initial_dividend_amount=20000, expected_dividend_growth_rate=0.02)
    #s.get_yearly_investment_return('SPY', start_year=2017, starting_age=55, return_type='F', expected_return=0.07, initial_dividend_amount=20000, expected_dividend_growth_rate=0.02)

test()