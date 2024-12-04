import { v4 as uuidv4 } from 'uuid';
class Fund {
  constructor(id=uuidv4(), fundType, portfolio1Allocation, portfolio2Allocation, portfolio3Allocation, returnAmount, withdrawAge, index = '^GSPC', ticker) {
    this.id = id;
    this.fundType = fundType;
    this.portfolio1Allocation = portfolio1Allocation;
    this.portfolio2Allocation = portfolio2Allocation;
    this.portfolio3Allocation = portfolio3Allocation;
    this.return = returnAmount;
    this.withdrawAge = withdrawAge;
    this.index = index;
    this.ticker = ticker;
  }

  displayDetails() {
    return `Fund:
      ID: ${this.id}
      Fund Type: ${this.fundType}
      Portfolio 1 Allocation: ${this.portfolio1Allocation}
      Portfolio 2 Allocation: ${this.portfolio2Allocation}
      Portfolio 3 Allocation: ${this.portfolio3Allocation}
      Return: ${this.return}
      Withdraw Age: ${this.withdrawAge}
      Index: ${this.index}
      Ticker: ${this.ticker}
    `;
  }
}

export default Fund;
