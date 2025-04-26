import json
from datetime import datetime
from app.fin.history_data import get_index_data

class StockCal:
    def download_stock_data(self, ticker):
        index_data = get_index_data(ticker)
        if index_data is None:
            print(f"Warning: No data found for ticker {ticker}")
            return [], [], 2020
            
        annual_perf = index_data['annual_performance']
        earliest_year = min(int(item['Year']) for item in annual_perf)
        
        return annual_perf, annual_perf, earliest_year

    def prepare_yearly_data(self, annual_data, dividend_data, start_year):
        try:
            if not annual_data:
                last_complete_year = datetime.now().year - 1  # Use previous year for complete data
                years = range(start_year, last_complete_year + 1)
                return [{
                    'Year': year,
                    'Starting Price': 100,
                    'Ending Price': 100,
                    'Price Return (%)': 0,
                    'Dividend Yield (%)': 0,
                    'Total Return (%)': 0
                } for year in years]
                
            # Convert the annual data into our expected format
            result = []
            for data in annual_data:
                year = int(data['Year'])
                if year >= start_year:
                    price_return = data['Return'] * 100  # Convert to percentage
                    dividend_yield = data['Dividend Yield (%)']  # Already in percentage
                    result.append({
                        'Year': year,
                        'Starting Price': 100,  # Base price for percentage calculations
                        'Ending Price': 100 * (1 + data['Return']),
                        'Price Return (%)': price_return,
                        'Dividend Yield (%)': dividend_yield,
                        'Total Return (%)': price_return + dividend_yield
                    })
            
            return result
            
        except Exception as e:
            print(f"Warning: Error in prepare_yearly_data: {e}")
            return [{
                'Year': start_year,
                'Starting Price': 100,
                'Ending Price': 100,
                'Price Return (%)': 0,
                'Dividend Yield (%)': 0,
                'Total Return (%)': 0
            }]

    def get_yearly_investment_return(self, portfolio, initial_investment=2000000, initial_withdrawal=60000, withdrawal_inflation_rate=0.03, dividend_tax_rate=0.30, start_year=2010, starting_age=55, expected_return=0.05, return_type='I', initial_dividend_yield=0, dividend_growth=0.00):
        json_data = []

        if return_type == 'I':
            stock_data = {ticker: self.download_stock_data(ticker) for ticker in portfolio.keys()}
            earliest_year = max(start_year, max([data[2] for data in stock_data.values()]))
            beginning_capital = initial_investment
            withdrawal_amount = initial_withdrawal
            current_age = starting_age

            last_complete_year = datetime.now().year - 1  # Use previous year for complete data
            for year in range(earliest_year, last_complete_year + 1):
                beginning_capital_after_withdrawal = beginning_capital - withdrawal_amount
                if beginning_capital_after_withdrawal <= 0:
                    beginning_capital_after_withdrawal = 0
                    break

                total_capital_gain = 0
                total_dividend_income = 0

                for ticker, allocation in portfolio.items():
                    annual_data, dividend_data, _ = stock_data[ticker]
                    yearly_results = self.prepare_yearly_data(annual_data, dividend_data, earliest_year)
                    
                    for row in yearly_results:
                        if row['Year'] == year:
                            allocated_capital = beginning_capital_after_withdrawal * allocation
                            # Calculate capital gain based on price return percentage
                            price_return_pct = row['Price Return (%)']
                            total_capital_gain += allocated_capital * (price_return_pct / 100)
                            
                            # Calculate dividend income based on dividend yield percentage
                            dividend_yield_pct = row['Dividend Yield (%)']
                            total_dividend_income += allocated_capital * (dividend_yield_pct / 100)

                # Apply dividend tax
                net_dividend_income = total_dividend_income * (1 - dividend_tax_rate)
                portfolio_return = total_capital_gain + net_dividend_income
                portfolio_return_pct = (portfolio_return / beginning_capital_after_withdrawal) * 100 if beginning_capital_after_withdrawal > 0 else 0
                end_of_year_capital = beginning_capital_after_withdrawal + portfolio_return

                if end_of_year_capital <= 0:
                    end_of_year_capital = 0
                    break

                json_data.append({
                    "Age": current_age,
                    "Year": year,
                    "Beginning Capital ($)": f"{beginning_capital:,.0f}",
                    "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                    "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                    "End of Year Capital ($)": f"{end_of_year_capital:,.0f}",
                    "Price Return (%)": f"{price_return_pct:.2f}",
                    "Capital Gain ($)": f"{total_capital_gain:,.0f}",
                    "Gross Dividend ($)": f"{total_dividend_income:,.0f}",
                    "Net Dividend ($)": f"{net_dividend_income:,.0f}",
                    "Portfolio Return (%)": f"{portfolio_return_pct:.2f}",
                    "Portfolio Return ($)": f"{portfolio_return:,.0f}"
                })

                beginning_capital = end_of_year_capital
                withdrawal_amount *= (1 + withdrawal_inflation_rate)
                current_age += 1
    
        elif return_type == 'S':
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
                    capital_gain = 0
                    gross_dividend = 0
                    net_dividend = 0
                    portfolio_return_pct = 0
                    portfolio_return = 0
                    json_data.append({
                        "Age": current_age,
                        "Year": year,
                        "Beginning Capital ($)": f"{beginning_capital_before_withdrawal:,.0f}",
                        "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                        "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                        "End of Year Capital ($)": f"{total_investment:,.0f}",
                        "Price Return (%)": f"{expected_return * 100:.2f}",
                        "Capital Gain ($)": f"{capital_gain:,.0f}",
                        "Gross Dividend ($)": f"{gross_dividend:,.0f}",
                        "Net Dividend ($)": f"{net_dividend:,.0f}",
                        "Portfolio Return (%)": f"{portfolio_return_pct:.2f}",
                        "Portfolio Return ($)": f"{portfolio_return:,.0f}"
                    })
                    break
                else:
                    capital_gain = beginning_capital_after_withdrawal * expected_return
                    if current_age == starting_age:
                        gross_dividend = beginning_capital_after_withdrawal * (initial_dividend_yield / 100)
                    else:
                        gross_dividend *= (1 + dividend_growth / 100)
                    net_dividend = gross_dividend * (1 - dividend_tax_rate)
                    portfolio_return = capital_gain + net_dividend
                    end_of_year_capital = beginning_capital_after_withdrawal + portfolio_return
                    total_investment = end_of_year_capital
                    portfolio_return_pct = (portfolio_return / beginning_capital_after_withdrawal) * 100

                    json_data.append({
                        "Age": current_age,
                        "Year": year,
                        "Beginning Capital ($)": f"{beginning_capital_before_withdrawal:,.0f}",
                        "Withdrawal ($)": f"{withdrawal_amount:,.0f}",
                        "Capital After Withdrawal ($)": f"{beginning_capital_after_withdrawal:,.0f}",
                        "End of Year Capital ($)": f"{end_of_year_capital:,.0f}",
                        "Price Return (%)": f"{expected_return * 100:.2f}",
                        "Capital Gain ($)": f"{capital_gain:,.0f}",
                        "Gross Dividend ($)": f"{gross_dividend:,.0f}",
                        "Net Dividend ($)": f"{net_dividend:,.0f}",
                        "Portfolio Return (%)": f"{portfolio_return_pct:.2f}",
                        "Portfolio Return ($)": f"{portfolio_return:,.0f}"
                    })

                withdrawal_amount *= (1 + withdrawal_inflation_rate)
                current_age += 1

                if end_of_year_capital <= 0 or end_of_year_capital < withdrawal_amount:
                    break

        json_output = json.dumps(json_data, indent=4)
        return json_output

# Example usage
def test():
    s = StockCal()
    print("\nTesting with app.py parameters (VIG):")
    portfolio = {'VIG': 1.0}
    s.get_yearly_investment_return(
        portfolio=portfolio,
        initial_investment=100000,  # $100,000
        initial_withdrawal=5000,    # $5,000
        withdrawal_inflation_rate=0.02,  # 2%
        dividend_tax_rate=0.30,     # 30%
        start_year=2020,           # backtest year
        starting_age=30,           # age
        return_type='I'
    )

if __name__ == "__main__":
    test()
