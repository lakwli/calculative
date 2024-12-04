def getNegativeReturns(self):
        ticker = yf.Ticker('VOO')

        # Fetch historical data
        hist = ticker.history(period="max")

        # Calculate yearly returns
        hist['Year'] = hist.index.year
        yearly_data = hist.groupby('Year')['Close'].last()  # Get last close price of each year
        yearly_returns = yearly_data.pct_change()

        # Filter for negative returns in the last 20 years
        last_20_years = yearly_returns[yearly_returns.index > yearly_returns.index.max() - 20]
        negative_returns = last_20_years[last_20_years < 0]

        # Print negative returns
        print(negative_returns)


def getAnnulizedReturn(self):
        ticker = yf.Ticker('VOO')

        # Fetch historical data
        hist = ticker.history(period="max")

        # Calculate yearly returns starting from 2012
        hist['Year'] = hist.index.year
        yearly_data = hist.groupby('Year')['Close'].last()  # Get last close price of each year

        # Calculate cumulative returns and annualized returns
        start_year = 2012
        start_price = yearly_data[start_year]
        annualized_returns = {}

        for year in range(start_year + 1, yearly_data.index.max() + 1):
            end_price = yearly_data[year]
            total_return = (end_price / start_price) - 1
            num_years = year - start_year
            annualized_return = (1 + total_return) ** (1 / num_years) - 1
            annualized_returns[year] = annualized_return

        # Display the results
        for year, ann_return in annualized_returns.items():
            print(f'The annualized return from {start_year} to {year} is: {ann_return:.2%}')


def getWithdrawalAgainstETF(self):
        ticker = yf.Ticker('VOO')

        # Fetch historical data
        hist = ticker.history(period="max")

        # Find the first available year of data
        first_available_year = hist.index.year.min()

        # Initialize variables
        start_year = max(1998, first_available_year)
        start_price = hist.loc[hist.index.year == start_year, 'Close'].values[0]
        capital = 1000000
        annual_withdrawal = 60000
        annual_increase_rate = 0.03

        annualized_returns = {}
        capital_remaining = {}
        detailed_tracking = []

        for year in range(start_year + 1, hist.index.year.max() + 1):
            beginning_capital = capital
            expenses = annual_withdrawal
            capital -= annual_withdrawal
            
            # End the calculation if capital is negative
            if capital < 0:
                break
            
            capital_after_expenses = capital
            end_price = hist.loc[hist.index.year == year, 'Close'].values[0]
            return_of_the_year = (end_price / start_price) - 1
            return_in_money = capital_after_expenses * return_of_the_year
            num_years = year - start_year
            annualized_return = (1 + return_of_the_year) ** (1 / num_years) - 1
            annualized_returns[year] = annualized_return
            capital = capital_after_expenses * (1 + return_of_the_year)
            capital_remaining[year] = capital
            
            # Record the detailed tracking
            detailed_tracking.append({
                'Year': year,
                'Beginning Capital': beginning_capital,
                'Expenses of the Year': expenses,
                'Capital After Expenses': capital_after_expenses,
                'Return of the Year': return_of_the_year,
                'Return in Money': return_in_money,
                'Capital End of Year': capital,
                'Annualized Return So Far': annualized_return
            })
            
            # Increase the annual withdrawal
            annual_withdrawal *= (1 + annual_increase_rate)

        # Display all columns
        pd.set_option('display.max_columns', None)

        # Display the results
        df = pd.DataFrame(detailed_tracking)
        print(df[['Year', 'Beginning Capital', 'Expenses of the Year', 'Capital After Expenses', 'Return of the Year', 'Return in Money', 'Capital End of Year', 'Annualized Return So Far']])

    #doesn't work
def getWithdrawalAgainstIndices(self):
        # Fetch historical data for S&P 500
        symbol = '^GSPC'
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="max")

        # Initialize variables
        start_year = 1998
        capital = 1000000
        annual_withdrawal = 60000
        annual_increase_rate = 0.03

        annualized_returns = {}
        capital_remaining = {}
        detailed_tracking = []

        for year in range(start_year, hist.index.year.max()):
            beginning_capital = capital
            expenses = annual_withdrawal
            capital -= annual_withdrawal

            # End the calculation if capital is negative
            if capital < 0:
                break

            capital_after_expenses = capital
            start_price = hist.loc[hist.index.year == year, 'Close'].values[0]
            end_price = hist.loc[hist.index.year == (year + 1), 'Close'].values[0]
            return_of_the_year = (end_price - start_price) / start_price
            return_in_money = capital_after_expenses * return_of_the_year
            num_years = year - start_year + 1
            total_return = (capital_after_expenses / 1000000) - 1
            annualized_return = (1 + total_return) ** (1 / num_years) - 1

            annualized_returns[year + 1] = annualized_return
            capital = capital_after_expenses + return_in_money
            capital_remaining[year + 1] = capital

            # Record the detailed tracking
            detailed_tracking.append({
                'Year': year + 1,
                'Beginning Capital': beginning_capital,
                'Expenses of the Year': expenses,
                'Capital After Expenses': capital_after_expenses,
                'Return of the Year': return_of_the_year,
                'Return in Money': return_in_money,
                'Capital End of Year': capital,
                'Annualized Return So Far': annualized_return
            })

            # Increase the annual withdrawal
            annual_withdrawal *= (1 + annual_increase_rate)

        # Display all columns
        pd.set_option('display.max_columns', None)

        # Display the results
        df = pd.DataFrame(detailed_tracking)
        print(df[['Year', 'Beginning Capital', 'Expenses of the Year', 'Capital After Expenses', 'Return of the Year', 'Return in Money', 'Capital End of Year', 'Annualized Return So Far']])
