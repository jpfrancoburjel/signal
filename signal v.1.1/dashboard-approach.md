# Signal v1.1 Dashboard Approach

## Core idea

The old dashboard was built like a classic portfolio view: total value, unrealized gain, forward cash flow, holdings, allocation.

That structure is fine for a brokerage account. It is weaker for family money spread across banks, currencies, pensions, broker cash, and a few investment buckets.

The new structure starts from the more useful operating question:

> Where is the money, in what currency, under whose name, and how liquid is it?

## Proposed dashboard structure

### 1. Summary row
- Total tracked wealth
- Liquid cash
- Invested assets
- Largest institution exposure

### 2. FX exposure
Show:
- native balances by currency
- converted value in base currency
- share of total tracked wealth

This matters because a single rolled-up total can be misleading when money is split across UYU, USD, and EUR.

### 3. Ownership split
Roll up all tracked cash and investments by owner:
- Juan
- Ana
- Estela
- Unassigned / family buckets when still unresolved

### 4. Institution exposure
Group money by institution to make concentration obvious:
- Santander
- BROU
- ING
- BBVA
- Revolut
- Trade Republic
- Wise
- BSE
- Interactive Brokers

### 5. Location of money
Use a hierarchical view:
- owner
  - institution
    - account / vehicle

This is the cleanest answer to “where is the money?”

### 6. Cash accounts table
Columns:
- account
- owner
- institution
- currency
- native balance
- base-currency equivalent
- account type

### 7. Investments table
Columns:
- vehicle
- owner
- institution
- type
- currency
- value
- liquidity

### 8. Concentration & liquidity signals
Surface a few fast-reading alerts:
- largest cash account
- largest currency exposure
- locked retirement / pension amount
- liquid investments

## Why this is better

Because it reflects how households actually manage money.

People do not usually ask:
- “what is my forward cash flow heuristic?”

They ask:
- “how much cash do we really have?”
- “how much is in each currency?”
- “what is exposed to one bank?”
- “what is locked vs liquid?”
- “under whose name is each pile?”

That is the v1.1 philosophy.
