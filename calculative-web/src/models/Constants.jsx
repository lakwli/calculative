export const RETURN_TYPES = {
  PORTFOLIO: "P",
  STOCK: "S",
  MARKETINDEX: "I",
  BASIC: "B",
};

export const WITHDRAW_START_AGE_OPTIONS = {
  FOLLOW_PLAN_START_AGE: "S",
  LATER_AGE: "L",
  NO_WITHDRAWALS: "N",
};
// Mapping object for localization keys
export const withdrawStartAgeOptionsMapping = {
  [WITHDRAW_START_AGE_OPTIONS.FOLLOW_PLAN_START_AGE]:
    "options.followPlanStartAge",
  [WITHDRAW_START_AGE_OPTIONS.LATER_AGE]: "options.laterAge",
  [WITHDRAW_START_AGE_OPTIONS.NO_WITHDRAWALS]: "options.noWithdrawals",
};

// Mapping object for messages
export const withdrawStartAgeMessagesMapping = {
  [WITHDRAW_START_AGE_OPTIONS.FOLLOW_PLAN_START_AGE]:
    "optionMessage.followPlanStartAge",
  [WITHDRAW_START_AGE_OPTIONS.LATER_AGE]: "optionMessage.laterAge",
  [WITHDRAW_START_AGE_OPTIONS.NO_WITHDRAWALS]: "optionMessage.noWithdrawals",
};

// Function to return the array of withdraw start age options with localized labels
export const getWithdrawStartAgeOptions = (t) => {
  return Object.keys(withdrawStartAgeOptionsMapping).map((key) => ({
    value: key,
    label: t(withdrawStartAgeOptionsMapping[key]),
  }));
};

export const CHOICES = {
  YES: "Y",
  NO: "N",
};

export const REBALANCE_OPTIONS = {
  NO: "N",
  ANNUALLY: "A",
};

export const FUND_TYPES = {
  CASH: "C",
  PENSION: "P",
  MARKET: "M",
  TICKER: "T",
};

// Function to return the array of fund types
export const getFundTypes = (t) => {
  return [
    { value: FUND_TYPES.CASH, label: t("fundTypeOptions.cash") },
    { value: FUND_TYPES.PENSION, label: t("fundTypeOptions.pension") },
    { value: FUND_TYPES.MARKET, label: t("fundTypeOptions.market") },
    { value: FUND_TYPES.TICKER, label: t("fundTypeOptions.ticker") },
  ];
};

export const INCOME_END_AGE_OPTIONS = {
  ONETIME: "onetime",
  FOREVER: "forever",
  RETIREMENT: "retirement",
  UNTIL: "until",
};

// Mapping object for localization keys
export const incomeEndAgeOptionsMapping = {
  [INCOME_END_AGE_OPTIONS.FOREVER]: "incomeEndAgeOptions.forever",
  [INCOME_END_AGE_OPTIONS.RETIREMENT]: "incomeEndAgeOptions.retirement",
  [INCOME_END_AGE_OPTIONS.UNTIL]: "incomeEndAgeOptions.until",
  [INCOME_END_AGE_OPTIONS.ONETIME]: "incomeEndAgeOptions.onetime",
};

// Function to return the array of end age options with localized labels
export const getIncomeEndAgeOptions = (t, startAgeOption) => {
  const options = Object.keys(incomeEndAgeOptionsMapping).map((key) => ({
    value: key,
    label: t(incomeEndAgeOptionsMapping[key]),
  }));

  // Remove "One-Time Income" option if the start age is "Starting Today"
  if (startAgeOption === INCOME_START_OPTIONS.STARTING_TODAY) {
    return options.filter(
      (option) => option.value !== INCOME_END_AGE_OPTIONS.ONETIME
    );
  }

  return options;
};

export const INCOME_AMOUNT_TYPES = {
  FUTURE: "future",
  TODAY_ADJUST_INFLATION: "today_adjust_inflation",
  TODAY_ADJUST_GROWTH: "today_adjust_growth",
};

// Mapping object for localization keys
export const incomeAmountTypesMapping = {
  [INCOME_AMOUNT_TYPES.FUTURE]: "incomeAmountTypes.future",
  [INCOME_AMOUNT_TYPES.TODAY_ADJUST_INFLATION]:
    "incomeAmountTypes.today_adjust_inflation",
  [INCOME_AMOUNT_TYPES.TODAY_ADJUST_GROWTH]:
    "incomeAmountTypes.today_adjust_growth",
};

// Function to return the array of income amount types with localized labels and descriptions
export const getIncomeAmountTypes = (t) => {
  return Object.keys(incomeAmountTypesMapping).map((key) => ({
    value: key,
    label: t(incomeAmountTypesMapping[key]),
    description: t(`${incomeAmountTypesMapping[key]}_description`),
  }));
};

export const INCOME_START_OPTIONS = {
  STARTING_TODAY: "starting_today",
  STARTING_LATER: "starting_later",
};

// Mapping object for localization keys
export const incomeStartOptionsMapping = {
  [INCOME_START_OPTIONS.STARTING_TODAY]: "incomeStartOptions.starting_today",
  [INCOME_START_OPTIONS.STARTING_LATER]: "incomeStartOptions.starting_later",
};

// Function to return the array of income start options with localized labels
export const getIncomeStartOptions = (t) => {
  return Object.keys(incomeStartOptionsMapping).map((key) => ({
    value: key,
    label: t(incomeStartOptionsMapping[key]),
  }));
};


export const PENSION_WITHDRAW_OPTION = {
  NOW: 'now',
  //WITHDRAW_AGE: 'withdrawAge',
  UPON: 'upon',
};

// Mapping object for localization keys
export const pensionWithdrawOptionMapping = {
  [PENSION_WITHDRAW_OPTION.NOW]: 'pensionWithdrawOption.now',
  //[PENSION_WITHDRAW_OPTION.WITHDRAW_AGE]: 'pensionWithdrawOption.withdrawAge',
  [PENSION_WITHDRAW_OPTION.UPON]: 'pensionWithdrawOption.upon',
};

// Function to return the array of pension withdraw options with localized labels
export const getPensionWithdrawOptions = (t) => {
  return Object.keys(pensionWithdrawOptionMapping).map((key) => ({
    value: key,
    label: t(pensionWithdrawOptionMapping[key]),
  }));
};


export const FUND_WITHDRAW_OPTION = {
  ALLOCATION: 'A',
  BEST_PERFORMANCE: 'B',
  RETURN_EXCEED: 'R',
};

// Mapping object for localization keys
export const fundWithdrawOptionMapping = {
  [FUND_WITHDRAW_OPTION.ALLOCATION]: 'fundWithdrawOption.allocation',
  [FUND_WITHDRAW_OPTION.BEST_PERFORMANCE]: 'fundWithdrawOption.bestPerformance',
  [FUND_WITHDRAW_OPTION.RETURN_EXCEED]: 'fundWithdrawOption.returnExceed',
};

// Function to return the array of fund withdraw options with localized labels
export const getFundWithdrawOptions = (t) => {
  return Object.keys(fundWithdrawOptionMapping).map((key) => ({
    value: key,
    label: t(fundWithdrawOptionMapping[key]),
  }));
};

export const INDEX_OPTIONS = {
  SP500: '^GSPC',
  NASDAQ: '^DJI',
  DOW_JONES: '^IXIC',
  SMALL_CAP_2000: '^RUT',
  MSCI_WORLD: '^NYA',
};

// Mapping object for localization keys
export const indexOptionsMapping = {
  [INDEX_OPTIONS.SP500]: 'indexOptions.sp500',
  [INDEX_OPTIONS.NASDAQ]: 'indexOptions.nasdaq',
  [INDEX_OPTIONS.DOW_JONES]: 'indexOptions.dowJones',
  [INDEX_OPTIONS.SMALL_CAP_2000]: 'indexOptions.smallCap2000',
  [INDEX_OPTIONS.MSCI_WORLD]: 'indexOptions.msciWorld',
};

// Function to return the array of index options with localized labels
export const getIndexOptions = (t) => {
  return Object.keys(INDEX_OPTIONS).map((key) => ({
    value: INDEX_OPTIONS[key],
    label: t(indexOptionsMapping[INDEX_OPTIONS[key]]),
  }));
};