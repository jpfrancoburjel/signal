window.signalPortfolio = {
  householdName: "Family Investments",
  asOf: "2026-06-03",
  summary: {
    totalValue: 2845000,
    totalCost: 2368000,
    totalGain: 477000,
    monthlyChange: 38200,
    yearlyChangePct: 14.8,
    cashFlowForward: 6400
  },
  owners: [
    { name: "Juan", value: 1212000, pct: 42.6 },
    { name: "Analía", value: 983000, pct: 34.6 },
    { name: "Kids / Trust", value: 650000, pct: 22.8 }
  ],
  allocations: [
    { label: "Public equities", value: 1180000, pct: 41.5 },
    { label: "Private equity", value: 540000, pct: 19.0 },
    { label: "Crypto", value: 295000, pct: 10.4 },
    { label: "Cash", value: 410000, pct: 14.4 },
    { label: "Real estate funds", value: 320000, pct: 11.2 },
    { label: "Other", value: 100000, pct: 3.5 }
  ],
  holdings: [
    { name: "Vanguard Global ETF", type: "Public equities", owner: "Juan", account: "IBKR", value: 420000, cost: 336000, changePct: 25.0, conviction: "Core" },
    { name: "Sequoia Fund III", type: "Private equity", owner: "Analía", account: "Private", value: 310000, cost: 250000, changePct: 24.0, conviction: "Long-term" },
    { name: "Bitcoin", type: "Crypto", owner: "Juan", account: "Cold storage", value: 180000, cost: 92000, changePct: 95.7, conviction: "Asymmetric" },
    { name: "Treasury ladder", type: "Cash", owner: "Kids / Trust", account: "Schwab", value: 275000, cost: 275000, changePct: 0.0, conviction: "Defensive" },
    { name: "Blackstone REIT", type: "Real estate funds", owner: "Analía", account: "Private bank", value: 210000, cost: 198000, changePct: 6.1, conviction: "Income" },
    { name: "Operator SPV", type: "Other", owner: "Juan", account: "Angel", value: 90000, cost: 115000, changePct: -21.7, conviction: "Venture" }
  ],
  timeline: {
    years: [
      { label: "2024", value: 2150000 },
      { label: "2025", value: 2685000 },
      { label: "2026 (YTD)", value: 2845000 }
    ],
    quarters: [
      { label: "Q1 25", value: 2610000 },
      { label: "Q2 25", value: 2660000 },
      { label: "Q3 25", value: 2710000 },
      { label: "Q4 25", value: 2685000 },
      { label: "Q1 26", value: 2790000 },
      { label: "Q2 26 (YTD)", value: 2845000 }
    ],
    months: [
      { label: "Jan", value: 2520000 },
      { label: "Feb", value: 2575000 },
      { label: "Mar", value: 2610000 },
      { label: "Apr", value: 2685000 },
      { label: "May", value: 2802000 },
      { label: "Jun", value: 2845000 }
    ]
  },
  watchlist: [
    "Review private equity valuations before quarter-end",
    "Decide target crypto exposure cap",
    "Consolidate cash accounts and map emergency reserve",
    "Add recurring contribution tracking"
  ]
};