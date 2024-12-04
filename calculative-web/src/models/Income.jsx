// src/models/simulation/Income.js
import { v4 as uuidv4 } from 'uuid';
import { INCOME_AMOUNT_TYPES, INCOME_END_AGE_OPTIONS, INCOME_START_OPTIONS } from './Constants';

class Income {
  constructor() {
    this.reset();
  }

  reset() {
    this.id = uuidv4();
    this.name = "";
    this.amount = "";
    this.amountType = "future";
    this.growth = "";
    this.startAgeOption = INCOME_START_OPTIONS.STARTING_TODAY;
    this.startAgeValue = "";
    this.endAgeOption = INCOME_END_AGE_OPTIONS.FOREVER;
    this.endAgeValue = "";
    this.growthOption = "O";
    this.sequenceNumberCreate = 0;
    this.sequenceNumberUpdate = 0;
  }


  displayDetails() {
    return `Income:
      ID: ${this.id}
      Name: ${this.name}
      Amount: ${this.amount}
      Amount Type: ${this.amountType}
      Growth: ${this.growth}
      Start Age: ${this.startAge}
      Start Age Value: ${this.startAgeValue}
      End Age: ${this.endAgeOption}
      End Age Value: ${this.endAgeValue}
      Growth Option: ${this.growthOption}
      Sequence Number: ${this.sequenceNumberCreate}
      Sequence Number: ${this.sequenceNumberUpdate}
    `;
  }
}

export default Income;
