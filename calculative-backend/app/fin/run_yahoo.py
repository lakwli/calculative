import yfinance as yf
import pandas as pd
import json
from datetime import datetime

class StockCal:
    def download_stock_data(self, ticker):
        data = yf.download(ticker, start='1900-01-01', end='2023-12-31')
        dividends = yf.Ticker(ticker).dividends
        data.index = data.index.tz_localize(None)
        dividends.index = dividends.index.tz_localize(None)
        earliest_year = data.index.min().year
        return data, dividends, earliest_year

    def prepare_yearly_data(self, data, dividends, start_year):
        data = data[data.index.year >= start_year]
        dividends = dividends[dividends.index.year >= start_year]
        yearly_data = data.resample('YE').agg({'Open': 'first', 'Close': 'last'})
        if not dividends.empty:
            yearly_dividends = dividends.resample('YE').sum()
            yearly_data = yearly_data.join(yearly_dividends)
            yearly_data['Dividends'] = yearly_data['Dividends'].fillna(0)
        else:
            yearly_data['Dividends'] = 0
        yearly_data['Price Return (%)'] = (yearly_data['Close'] - yearly_data['Open']) / yearly_data['Open'] * 100
        yearly_data['Total Return (%)'] = ((yearly_data['Close'] + yearly_data['Dividends']) - yearly_data['Open']) / yearly_data['Open'] * 100
        result = yearly_data.reset_index()
        result['Year'] = result['Date'].dt.year
        result = result[['Year', 'Open', 'Close', 'Price Return (%)', 'Dividends', 'Total Return (%)']]
        result.columns = ['Year', 'Starting Price', 'Ending Price', 'Price Return (%)', 'Total Dividend per Share ($)', 'Total Return including Dividend (%)']
        return result

    def get_yearly_investment_return(self, portfolio, initial_investment=2000000, initial_withdrawal=60000, withdrawal_inflation_rate=0.03, dividend_tax_rate=0.30, start_year=2010, starting_age=55, expected_return=0.05, return_type='I', initial_dividend_yield=0, dividend_growth=0.00):
        
        """
        Calculate yearly investment return based on return type.
        
        Parameters:
        - portfolio: Dictionary of stock tickers and their allocations.
        - initial_investment: The initial investment amount.
        - initial_withdrawal: The initial withdrawal amount.
        - withdrawal_inflation_rate: Yearly inflation rate for withdrawals.
        - dividend_tax_rate: Tax rate on dividends.
        - start_year: The starting year for the projection.
        - starting_age: The starting age of the investor.
        - expected_return: Expected yearly return (for return_type='D').
        - return_type: 'I' for index-based calculation, 'D' for dividend-based calculation.
        - initial_dividend_yield: Initial dividend yield (percentage, for return_type='D').
        - dividend_growth: Yearly dividend growth rate (for return_type='D').
        
        Returns:
        - A JSON string with yearly projected data.
        """
        json_data = []

        if return_type == 'I':
            stock_data = {ticker: self.download_stock_data(ticker) for ticker in portfolio.keys()}
            earliest_year = max(start_year, max([data[2] for data in stock_data.values()]))
            beginning_capital = initial_investment
            withdrawal_amount = initial_withdrawal
            current_age = starting_age

            for year in range(earliest_year, 2023 + 1):
                beginning_capital_after_withdrawal = beginning_capital - withdrawal_amount
                if beginning_capital_after_withdrawal <= 0:
                    beginning_capital_after_withdrawal = 0  # Ensure no negative capital after withdrawal
                    break

                total_dividends = 0
                total_capital_gain = 0

                for ticker, allocation in portfolio.items():
                    data, dividends, _ = stock_data[ticker]
                    result = self.prepare_yearly_data(data, dividends, earliest_year)
                    for index, row in result.iterrows():
                        if row['Year'] == year:
                            starting_price = row['Starting Price']
                            shares_held = (beginning_capital_after_withdrawal * allocation) / starting_price
                            ending_price = row['Ending Price']
                            price_return = row['Price Return (%)']
                            total_dividend_per_share = row['Total Dividend per Share ($)']
                            total_dividends += shares_held * total_dividend_per_share
                            total_capital_gain += shares_held * starting_price * (price_return / 100)

                net_dividends = total_dividends * (1 - dividend_tax_rate)
                effective_return = total_capital_gain + net_dividends
                effective_return_percentage = (effective_return / beginning_capital_after_withdrawal) * 100
                end_of_year_capital = beginning_capital_after_withdrawal + effective_return

                if end_of_year_capital <= 0:
                    end_of_year_capital = 0  # Ensure no negative end-of-year capital
                    break

                json_data.append({
                    "Age": current_age,
                    "Year": year,
                    "Beginning Capital ($)": f"{beginning_capital:,.0f}",
                    "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                    "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                    "End of Year Capital ($)": f"{end_of_year_capital:,.0f}",
                    "Price Return (%)": f"{price_return:.2f}",
                    "Capital Gain ($)": f"{total_capital_gain:,.0f}",
                    "Total Dividends ($)": f"{total_dividends:,.0f}",
                    "Net Dividend ($)": f"{net_dividends:,.0f}",
                    "Effective Return (%)": f"{effective_return_percentage:.2f}",
                    "Effective Return ($)": f"{effective_return:,.0f}"
                })

                beginning_capital = end_of_year_capital
                withdrawal_amount *= (1 + withdrawal_inflation_rate)
                current_age += 1
    
        elif return_type == 'S':
            from datetime import datetime
            current_year = datetime.now().year
            total_investment = initial_investment
            withdrawal_amount = initial_withdrawal
            current_age = starting_age
            dividend_yield = initial_dividend_yield

            for year in range(current_year + 1, current_year + (120 - starting_age)):
                beginning_capital_before_withdrawal = total_investment
                beginning_capital_after_withdrawal = beginning_capital_before_withdrawal - withdrawal_amount
                if beginning_capital_after_withdrawal <= 0:
                    beginning_capital_after_withdrawal = 0
                    total_investment = 0
                    investment_return = 0
                    dividend_amount = 0
                    net_dividends = 0
                    effective_return_percentage = 0
                    total_dividends = 0
                    total_capital_gain = 0
                    json_data.append({
                        "Age": current_age,
                        "Year": year,
                        "Beginning Capital ($)": f"{beginning_capital_before_withdrawal:,.0f}",
                        "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                        "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                        "End of Year Capital ($)": f"{total_investment:,.0f}",
                        "Price Return (%)": f"{expected_return * 100:.2f}",
                        "Capital Gain ($)": f"{total_capital_gain:,.0f}",
                        "Total Dividends ($)": f"{total_dividends:,.0f}",
                        "Net Dividend ($)": f"{net_dividends:,.0f}",
                        "Effective Return (%)": f"{effective_return_percentage:.2f}",
                        "Effective Return ($)": f"{investment_return + net_dividends:,.0f}"
                    })
                    break
                else:
                    investment_return = beginning_capital_after_withdrawal * expected_return
                    if current_age == starting_age:
                        dividend_amount = beginning_capital_after_withdrawal * (initial_dividend_yield / 100)
                    else:
                        dividend_amount *= (1 + dividend_growth / 100)
                    net_dividends = dividend_amount * (1 - dividend_tax_rate)
                    end_of_year_capital = beginning_capital_after_withdrawal + investment_return + net_dividends
                    total_investment = end_of_year_capital
                    effective_return_percentage = ((investment_return + net_dividends) / beginning_capital_after_withdrawal) * 100
                    total_dividends = dividend_amount
                    total_capital_gain = investment_return

                    json_data.append({
                        "Age": current_age,
                        "Year": year,
                        "Beginning Capital ($)": f"{beginning_capital_before_withdrawal:,.0f}",
                        "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                        "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                        "End of Year Capital ($)": f"{end_of_year_capital:,.0f}",
                        "Price Return (%)": f"{expected_return * 100:.2f}",
                        "Capital Gain ($)": f"{total_capital_gain:,.0f}",
                        "Total Dividends ($)": f"{total_dividends:,.0f}",
                        "Net Dividend ($)": f"{net_dividends:,.0f}",
                        "Effective Return (%)": f"{effective_return_percentage:.2f}",
                        "Effective Return ($)": f"{investment_return + net_dividends:,.0f}"
                    })


                withdrawal_amount *= (1 + withdrawal_inflation_rate)
                current_age += 1

                if end_of_year_capital <= 0 or end_of_year_capital <withdrawal_amount :
                    break

        json_output = json.dumps(json_data, indent=4)
        print(json_output)
        return json_output






# Example usage
def test():
    s = StockCal()
    portfolio = {'SPY': 0.6, 'SCHD': 0.4}
    #portfolio = {'^GSPC': 1.0}
    #s.get_yearly_investment_return(portfolio, starting_age=55,start_year=2000)
    #s.get_yearly_investment_return(portfolio=None,starting_age=55, return_type='D', expected_return=0.07, initial_dividend_yield=2.4, dividend_growth=0.024)
    #s.get_yearly_investment_return(portfolio, start_year=2000, starting_age=55, return_type='I', expected_return=0.07, initial_dividend_yield=2, dividend_growth=0.02)
    #s.get_yearly_investment_return('SPY', start_year=2017, starting_age=55, return_type='F', expected_return=0.07, initial_dividend_amount=20000, dividend_growth=0.02)
    s.get_yearly_investment_return(None, start_year=1999, starting_age=55, return_type='S', expected_return=0.07, initial_dividend_yield=2, dividend_growth=0.02)
    
#test()
