import ReturnDetail from './ReturnDetail'; // Ensure you import ReturnDetail

class Simul {
  constructor(age = '', initialCapital = '', withdrawAgeOption = 'S', withdrawAge = '', yearlyWithdraw = '', inflation = '', incomes = [], returnDetail = new ReturnDetail()) {
    this.age = age;
    this.initialCapital = initialCapital;
    this.withdrawAgeOption = withdrawAgeOption;
    this.withdrawAge = withdrawAge;
    this.yearlyWithdraw = yearlyWithdraw;
    this.inflation = inflation;
    this.incomes = incomes;
    this.returnDetail = returnDetail;
  }

  addIncome(income) {
    this.incomes.push(income);
  }

  displayDetails() {
    return `Simul:
      Age: ${this.age}
      Initial Capital: ${this.initialCapital}
      Withdraw Age Option: ${this.withdrawAgeOption}
      Withdraw Age: ${this.withdrawAge}
      Yearly Withdraw: ${this.yearlyWithdraw}
      Inflation: ${this.inflation}
      Incomes: ${JSON.stringify(this.incomes, null, 2)}
      Return Detail: ${this.returnDetail.displayDetails()}
    `;
  }
}

export default Simul;
