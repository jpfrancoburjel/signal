# Signal Requirements

This file is the source of truth for product requirements in the Signal project.

## 1. Project goal

Signal is a project for tracking and understanding family investments.

The first product is a dashboard that gives the family a clear, unified view of household investments without relying on scattered spreadsheets.

## 2. First milestone: family investments dashboard

The dashboard must provide a clear view of:

- total net worth across accounts
- allocation by asset class
- allocation by family member
- performance over time
- upcoming actions / watchlist items

## 3. Current dashboard scope

The current prototype establishes the required v1 dashboard sections.

### 3.1 Header

The dashboard should display:

- project/product name: Signal
- household name
- as-of date for the displayed data

### 3.2 Summary cards

The dashboard should show top-level metrics as summary cards.

Requirements:
- Each card should display a tooltip containing its **Conceptual Meaning** when hovered or tapped.

Required cards:

1. **Total portfolio value**
   - total current value across all included accounts and holdings
   - should include a secondary indicator for yearly change

2. **Net unrealized gain**
   - total current gain relative to cost basis
   - should include a secondary indicator showing gain percentage over cost basis
   - **Conceptual Meaning:** Represents the aggregate "paper profit/loss" of the current portfolio holdings. It sums up all gains and losses across all accounts and individual assets relative to their original cost basis.
   - **Mathematical Definition:**
     - *Net Unrealized Gain (G)* = Current Portfolio Value (V) - Cost Basis (C)
     - *Gain Percentage (P)* = (Net Unrealized Gain (G) / Cost Basis (C)) * 100
   - **Concrete Example (from prototype data):**
     - Current Value (V) = $2,845,000
     - Cost Basis (C) = $2,368,000
     - Net Unrealized Gain (G) = $477,000
     - Gain Percentage (P) = ($477,000 / $2,368,000) * 100 = ~20.1% over cost basis

3. **Forward cash flow**
   - estimated annual distributions / yield signal
   - **Conceptual Meaning:** Represents the expected passive cash distributions (dividends, interest, staking rewards, REIT/PE distributions) the portfolio is expected to generate over the next 12 months.
   - **Mathematical Definition:**
     - *Expected Payout (per holding)* = Current Value * Expected Annual Yield %
     - *Forward Cash Flow* = Sum of Expected Payouts across all holdings
   - **Concrete Example (from prototype data):**
     - Expected Forward Cash Flow = $6,400
     - Total Portfolio Value = $2,845,000
     - Implied Forward Portfolio Yield = ($6,400 / $2,845,000) * 100 = ~0.225%

### 3.3 Portfolio trajectory

The dashboard should include a portfolio trajectory view that shows value over time.

Requirements:

- show historical portfolio values by period
- support filtering/toggling the trajectory view by different time horizons: years, quarters, and months
- clearly communicate trend / momentum at a glance
- support an associated household risk signal in the same section
- should span the full horizontal width of the dashboard layout

#### Risk signal widget

The portfolio trajectory section includes a **Risk** badge that displays a household-level risk score on a 1–10 scale.

- **Purpose:** Provides a quick, at-a-glance sense of how much risk the portfolio carries based on its current asset allocation. Higher scores indicate more exposure to volatile/growth asset classes.
 - **Conceptual Meaning:** Summarizes how exposed the household is to volatile or growth-oriented assets. It combines the percent allocated to non-cash (riskier) assets and the percent held in cash (safer) using fixed weights, then scales the result to a 1–10 range. Concretely: non-cash allocations are multiplied by 0.72, cash allocation is multiplied by 0.18, the two results are summed, and the sum is divided by 10 and rounded to the nearest integer to produce the displayed score. Higher values mean greater exposure to volatile asset classes.
- **Current formula (v1 heuristic):**
  - Sum the allocation percentages of all non-cash asset classes, weighted by `0.72`
  - Add the cash allocation percentage, weighted by `0.18`
  - Divide the result by `10` and round to the nearest integer
  - *Risk Score* = round(((non-cash allocation % × 0.72) + (cash allocation % × 0.18)) / 10)
- **Interpretation:**
  - 1–3: Conservative (high cash, low equity/crypto exposure)
  - 4–6: Balanced
  - 7–10: Aggressive (high equity/crypto/PE exposure, low cash)
- **Concrete example (from prototype data):**
  - Non-cash allocation = 85.6% (public equities 41.5% + private equity 19.0% + crypto 10.4% + real estate funds 11.2% + other 3.5%)
  - Cash allocation = 14.4%
  - Risk Score = round(((85.6 × 0.72) + (14.4 × 0.18)) / 10) = round((61.6 + 2.6) / 10) = round(6.4) = **6/10**
- **Note:** This is a simplified heuristic for v1. A more sophisticated risk model (e.g., volatility-weighted, drawdown-aware) should replace it in future iterations.

### 3.4 Asset allocation

The dashboard should include an allocation-by-asset-class section.

Requirements:

- show each asset class with:
  - label
  - current value
  - percentage of total portfolio
- visually communicate proportional exposure
- support at least the following example categories from the prototype:
  - public equities
  - private equity
  - crypto
  - cash
  - real estate funds
  - other

Note: these categories are provisional and should become a formal taxonomy later.

### 3.5 Ownership split

The dashboard should include a view of ownership allocation across the household.

Requirements:

- show each owner / family entity with:
  - owner name
  - current value
  - percentage of total portfolio
- owners may include individuals and legal/family structures such as trusts

### 3.6 Watchlist

The dashboard should include a watchlist / next-actions section.

Requirements:

- show a list of important follow-ups, decisions, or open questions
- items can be manual at first
- examples from the prototype:
  - reviewing private equity valuations
  - deciding crypto exposure limits
  - consolidating cash accounts
  - tracking recurring contributions

### 3.7 Top holdings table

The dashboard should include a holdings table showing the most important positions.

Required columns:

- holding name
- asset type / asset class
- owner
- account
- current value
- performance change
- stance / conviction label

Notes:

- the table should support positive and negative performance values
- the stance / conviction label is useful and should remain in requirements for now
- mobile layouts may hide lower-priority columns, but desktop should show the full table

## 4. Data requirements implied by the current dashboard

To support the current dashboard, the underlying data model must support the following entities and fields.

### 4.1 Portfolio-level data

Required fields:

- householdName
- asOf
- totalValue
- totalCost
- totalGain
- yearlyChangePct
- cashFlowForward

### 4.2 Owners

Required fields per owner:

- name
- value
- pct

### 4.3 Asset allocations

Required fields per asset class:

- label
- value
- pct

### 4.4 Holdings

Required fields per holding:

- name
- type
- owner
- account
- value
- cost
- changePct
- conviction

### 4.5 Timeline series

Required fields per time point:

- period label (currently month)
- portfolio value

### 4.6 Watchlist items

Required fields per item:

- text / description

## 5. Non-functional requirements for v1

- must be easy to understand at a glance
- must feel household-level, not trader-level
- must work locally without a complicated setup
- must be able to start with mock or manually entered data
- should be designed so mock data can later be replaced by a canonical dataset
- should remain visually clean and readable on desktop and usable on mobile

## 6. Current implementation status

A lightweight local prototype exists in `dashboard/`.

Open `dashboard/index.html` in a browser to preview it.

Current implementation characteristics:

- plain HTML/CSS/JavaScript
- local-only prototype
- mock data in `dashboard/data.js`
- no backend yet
- no authentication yet

## 7. Platform integration requirement

Signal should support integration with existing financial platforms used by the household.

Priority platforms currently identified:
- My Investor
- Interactive Brokers
- Republic
- Revolut
- BBVA
- Wise
- ING

### 7.1 Integration expectations

For each supported platform, Signal should be designed to ingest or synchronize relevant financial data such as:
- account balances
- holdings / positions
- cash balances
- transaction history, where available
- valuation-relevant data needed for portfolio reporting

### 7.2 v1 implementation note

These integrations do not all need to be fully automated in v1.

Acceptable v1 approaches may include:
- CSV import from platform exports
- manual normalized imports derived from platform statements
- partially automated connectors where practical

The important requirement is that the canonical data model and import layer must be designed with these platforms in mind from the start.

## 8. Next requirements to define after this document

These are the next requirement areas that should be specified after the dashboard structure:

1. canonical investment data model
2. owner, account, and asset taxonomy
3. import flow from spreadsheets / broker exports and platform integrations
4. valuation update rules
5. watchlist / task ownership rules
6. authentication and sharing model, if the dashboard becomes multi-user
