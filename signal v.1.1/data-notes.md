# Signal v1.1 Data Notes

This prototype was derived from the spreadsheet image shared for the Signal project.

## Source sections interpreted

### Cash / account balances
Source heading:
- `SALDO CUENTA 05/05/2026`

Extracted account balances included rows like:
- Santander Ana PESOS UY
- Santander Ana USD
- Brou Ana PESOS UY
- ING Estela
- BBVA Ana
- Trade Republic Ana (Remunerada)
- Revolut Ana
- Santander Juan PESOS UY
- Santander Juan USD
- Santander Juan SAS
- ING Juan EUR
- Wise Juan EUR
- Revolut EUR (Remunerada)
- Brou Juan USD
- Brou Juan PESOS UY

### Investments
Source heading:
- `INVERSIONES`

Visible rows included:
- BSE Renta personal
- Revolut
- Trade Republic
- ING Plan pensión Juan
- BBVA Plan pensión Ana
- Interactive Brokers

## Important caveats

- Some investment rows did not clearly show the currency inline, so the prototype assumes EUR where the sheet context strongly suggested it.
- Some investment ownership was explicit (`Juan`, `Ana`), some had to remain `Unassigned`.
- The note `Solo valor gasto, plusvalias en otro doc` means this prototype should not pretend to know gains.
- FX conversions in the prototype are placeholders for layout and structure, not authoritative valuation.

## Implication for the product

Signal needs separate normalized inputs for:

1. `cash_accounts`
2. `investment_positions`
3. later: `fx_rates`, `performance`, and `plusvalias`

Trying to force this sheet into one generic holdings table would be the wrong abstraction.
