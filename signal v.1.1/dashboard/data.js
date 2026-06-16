window.signalPortfolio = {
  householdName: "Franco household",
  asOf: "2026-05-05",
  baseCurrency: "EUR",
  fxRatesToBase: {
    EUR: 1,
    USD: 0.88,
    UYU: 0.021
  },
  notes: [
    "FX conversion is approximate and should be replaced with an explicit daily FX table.",
    "Investment values are loaded from the sheet note 'Solo valor gasto, plusvalías en otro doc'.",
    "A few investment owners are inferred or still unassigned; confirm before using this for decisions."
  ],
  cashAccounts: [
    { account: "Santander Ana PESOS UY", institution: "Santander", owner: "Ana", currency: "UYU", balance: 26426, accountType: "bank cash" },
    { account: "Santander Ana USD", institution: "Santander", owner: "Ana", currency: "USD", balance: 128, accountType: "bank cash" },
    { account: "Brou Ana PESOS UY", institution: "BROU", owner: "Ana", currency: "UYU", balance: 905, accountType: "bank cash" },
    { account: "ING Estela", institution: "ING", owner: "Estela", currency: "EUR", balance: 22, accountType: "bank cash" },
    { account: "BBVA Ana", institution: "BBVA", owner: "Ana", currency: "EUR", balance: 4155, accountType: "bank cash" },
    { account: "Trade Republic Ana (Remunerada)", institution: "Trade Republic", owner: "Ana", currency: "EUR", balance: 14798, accountType: "remunerated cash" },
    { account: "Revolut Ana", institution: "Revolut", owner: "Ana", currency: "EUR", balance: 1139, accountType: "bank cash" },
    { account: "Santander Juan PESOS UY", institution: "Santander", owner: "Juan", currency: "UYU", balance: 2902, accountType: "bank cash" },
    { account: "Santander Juan USD", institution: "Santander", owner: "Juan", currency: "USD", balance: 438, accountType: "bank cash" },
    { account: "Santander Juan SAS", institution: "Santander", owner: "Juan", currency: "USD", balance: 2836, accountType: "broker cash" },
    { account: "ING Juan EUR", institution: "ING", owner: "Juan", currency: "EUR", balance: 2394, accountType: "bank cash" },
    { account: "Wise Juan EUR", institution: "Wise", owner: "Juan", currency: "EUR", balance: 3037, accountType: "multicurrency cash" },
    { account: "Revolut EUR (Remunerada)", institution: "Revolut", owner: "Juan", currency: "EUR", balance: 18243, accountType: "remunerated cash" },
    { account: "Brou Juan USD", institution: "BROU", owner: "Juan", currency: "USD", balance: 1767, accountType: "bank cash" },
    { account: "Brou Juan PESOS UY", institution: "BROU", owner: "Juan", currency: "UYU", balance: 41292, accountType: "bank cash" }
  ],
  investments: [
    { name: "BSE Renta personal", institution: "BSE", owner: "Unassigned", currency: "EUR", value: 20000, type: "fixed income", liquidity: "semi-liquid", notes: "Renta fija" },
    { name: "Revolut", institution: "Revolut", owner: "Unassigned", currency: "EUR", value: 358, type: "investment", liquidity: "liquid", notes: "Needs categorization" },
    { name: "Trade Republic", institution: "Trade Republic", owner: "Ana", currency: "EUR", value: 500, type: "investment", liquidity: "liquid", notes: "Owner inferred from account naming" },
    { name: "ING Plan pensión Juan", institution: "ING", owner: "Juan", currency: "EUR", value: 500, type: "mixed pension", liquidity: "locked", notes: "Renta mixta" },
    { name: "BBVA Plan pensión Ana", institution: "BBVA", owner: "Ana", currency: "EUR", value: 500, type: "mixed pension", liquidity: "locked", notes: "Renta mixta" },
    { name: "Interactive Brokers", institution: "Interactive Brokers", owner: "Unassigned", currency: "EUR", value: 50, type: "brokerage", liquidity: "liquid", notes: "Needs categorization" }
  ]
};