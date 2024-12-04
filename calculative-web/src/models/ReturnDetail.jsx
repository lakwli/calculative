
import { RETURN_TYPES, REBALANCE_OPTIONS, FUND_WITHDRAW_OPTION } from './Constants';

class ReturnDetail {
  constructor(returnType = RETURN_TYPES.BASIC, expectedReturn, index, ticker, rebalanceOption = REBALANCE_OPTIONS.ANNUALLY, fundWithdrawOption =FUND_WITHDRAW_OPTION.ALLOCATION, fundWithdrawAnnualizedReturn, backTestYear, divTax, funds = []) {
    this.returnType = returnType;
    this.expectedReturn = expectedReturn;
    this.index = index;
    this.ticker = ticker;
    this.rebalanceOption = rebalanceOption;
    this.fundWithdrawOption = fundWithdrawOption;
    this.fundWithdrawAnnualizedReturn = fundWithdrawAnnualizedReturn;
    this.backTestYear = backTestYear;
    this.divTax = divTax;
    this.funds = funds;
  }

  addFund(fund) {
    this.funds.push(fund);
  }

  displayDetails() {
    return `Return Detail:
      Return Type: ${this.returnType}
      Expected Return: ${this.expectedReturn}
      Index: ${this.index}
      Ticker: ${this.ticker}
      Rebalance Option: ${this.rebalanceOption}
      Withdraw Option: ${this.fundWithdrawOption}
      Withdraw Annualized Return: ${this.fundWithdrawAnnualizedReturn}
      Back Test Year: ${this.backTestYear}
      Dividend Tax: ${this.divTax}
      Funds: ${JSON.stringify(this.funds, null, 2)}
    `;
  }
}

export default ReturnDetail;
