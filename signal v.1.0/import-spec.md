# Signal Import Specification (Draft)

This document defines the normalized CSV format and mapping rules for Signal v1.

The point of this spec is simple: every messy source file should be transformed into one clean import shape before it reaches the canonical data model.

If this layer is sloppy, everything upstream is bullshit.

---

## 1. Purpose

Signal needs an import contract that:
- accepts data from spreadsheets, broker exports, and manual files
- normalizes that data into one standard row shape
- makes mapping explicit
- supports validation before data is committed
- keeps imports repeatable and auditable

This is the v1 normalized import format, not the raw-source format.

---

## 2. Import pipeline model

Signal v1 should conceptually support three stages.

### Stage 1 — Raw source file
Examples:
- broker CSV export
- spreadsheet maintained by hand
- custom ledger export

This file is source-specific and can be ugly.

### Stage 2 — Normalized CSV
The raw file is transformed into the Signal normalized format defined here.

This is the first stable import contract.

### Stage 3 — Canonical ingest
The normalized CSV is validated, mapped to canonical entities, and written into:
- holdings
- holding snapshots
- cash flows (when supported)
- portfolio-level derived records
- data source + mapping tables

---

## 3. Import modes

### 3.1 Holdings snapshot import
This is the primary v1 import mode.

Use it for files that represent portfolio positions as of a given date.

Examples:
- account balances
- brokerage positions
- crypto balances
- private fund estimated values

### 3.2 Cash flow import
This should be supported soon after holdings import, but can be a second step.

Use it for:
- dividends
- interest
- distributions
- contributions
- withdrawals
- fees

This spec focuses first on the holdings snapshot import.

---

## 4. Normalized holdings CSV format

Each row represents one holding snapshot for one asset in one account as of one date.

### 4.1 Required columns

| Column | Type | Required | Description |
|---|---|---|---|
| `as_of` | date | yes | Snapshot date in ISO format `YYYY-MM-DD` |
| `household` | string | yes | Canonical household name or household key |
| `owner` | string | yes | Raw or canonical owner/entity label from source |
| `institution` | string | yes | Institution/provider label |
| `account` | string | yes | Account label from source |
| `asset_name` | string | yes | Asset label from source |
| `asset_type` | string | yes | Normalized asset type |
| `asset_class` | string | yes | Normalized or raw asset class label |
| `market_value` | decimal | yes | Holding market value as of the snapshot date |
| `currency` | string | yes | Native currency code, e.g. `USD`, `EUR` |
| `source_file` | string | yes | Source file identifier for audit/debug |

### 4.2 Optional columns

| Column | Type | Required | Description |
|---|---|---|---|
| `quantity` | decimal | no | Quantity held |
| `price` | decimal | no | Unit price |
| `cost_basis` | decimal | no | Position cost basis |
| `ticker` | string | no | Market ticker if applicable |
| `isin` | string | no | ISIN if known |
| `cusip` | string | no | CUSIP if known |
| `account_type` | string | no | Source or normalized account type |
| `account_number_masked` | string | no | Masked account suffix only |
| `conviction_label` | string | no | Optional portfolio stance label |
| `is_estimate` | boolean | no | `true` if valuation is estimated rather than official |
| `notes` | string | no | Free-text import notes |
| `source_row_id` | string | no | Stable row id from source if available |
| `asset_identifier` | string | no | Any external id not covered above |

### 4.3 Boolean conventions

Use:
- `true`
- `false`

Do not rely on:
- `yes/no`
- `Y/N`
- `1/0`

Convert those during normalization.

### 4.4 Decimal conventions

Use:
- period `.` as decimal separator
- no thousands separators

Examples:
- `1234.56`
- `2500000`

Not:
- `1,234.56`
- `2.500.000,00`

Normalize before ingest.

---

## 5. Normalized holdings CSV example

```csv
as_of,household,owner,institution,account,asset_name,asset_type,asset_class,market_value,currency,source_file,quantity,price,cost_basis,ticker,account_type,account_number_masked,conviction_label,is_estimate,notes
2026-06-01,Franco Household,Juan Franco,Fidelity,Fidelity - Juan - Brokerage,Apple Inc.,stock,public_equities,145000,USD,fidelity_positions_2026-06-01.csv,650,223.08,98000,AAPL,brokerage,4821,core,false,
2026-06-01,Franco Household,Juan Franco,Coinbase,Coinbase - Juan - Primary,Bitcoin,crypto,crypto,82000,USD,coinbase_balances_2026-06-01.csv,1.15,71304.35,54000,BTC,crypto_wallet,,high conviction,false,
2026-06-01,Franco Household,Franco Family Trust,Sequoia,Sequoia - Family Trust - Fund VIII,Sequoia Capital Fund VIII,private_equity,private_equity,320000,USD,manual_private_funds_2026-06-01.csv,,,250000,,private_fund,,core,true,Q1 estimate
```

---

## 6. Column semantics and rules

### 6.1 `as_of`
- required on every row
- must reflect the valuation date, not import date
- must use ISO format `YYYY-MM-DD`

### 6.2 `household`
- should usually be the canonical household label
- v1 may support only one household, but the column stays for future sanity

### 6.3 `owner`
- may arrive raw from source
- must be mapped to one canonical owner/entity during ingest

### 6.4 `institution`
- should represent the provider or venue where the account exists
- examples: `Fidelity`, `Coinbase`, `Chase`

### 6.5 `account`
- should represent the account container, not just a nickname if avoidable
- ideally already normalized using the taxonomy naming scheme

### 6.6 `asset_name`
- raw source asset label is acceptable in the normalized file if preserved consistently
- ingest must map it to canonical asset identity

### 6.7 `asset_type`
Expected v1 values:
- `stock`
- `etf`
- `fund`
- `cash`
- `crypto`
- `bond`
- `private_equity`
- `real_estate_fund`
- `other`

### 6.8 `asset_class`
Expected v1 values:
- `public_equities`
- `private_equity`
- `crypto`
- `cash`
- `real_estate_funds`
- `other`

### 6.9 `market_value`
- required
- must be the full current position value in the row currency
- must not be negative for normal holdings rows unless explicitly representing a short or liability case, which v1 should probably reject or quarantine

### 6.10 `currency`
- must be ISO-style currency code, uppercase
- examples: `USD`, `EUR`, `GBP`

### 6.11 `cost_basis`
- optional in v1
- strongly recommended where available
- if blank, downstream gain calculations may be partial

### 6.12 `quantity` and `price`
- optional because some private assets do not have meaningful units or observable market prices
- if both are present, `quantity * price` should roughly reconcile to `market_value`

---

## 7. Validation rules

### 7.1 File-level validation

A normalized holdings file must:
- include all required columns
- contain at least one data row
- use UTF-8 encoding
- use a comma delimiter unless explicitly configured otherwise

### 7.2 Row-level required-field validation

Reject the row if any of these are missing:
- `as_of`
- `household`
- `owner`
- `institution`
- `account`
- `asset_name`
- `asset_type`
- `asset_class`
- `market_value`
- `currency`
- `source_file`

### 7.3 Type validation

Reject or quarantine rows when:
- `as_of` is not a valid ISO date
- `market_value` is not numeric
- `quantity` is present but not numeric
- `price` is present but not numeric
- `cost_basis` is present but not numeric
- `is_estimate` is present but not `true` or `false`

### 7.4 Domain validation

Flag for review when:
- `asset_class` is unknown
- `asset_type` is unknown
- `currency` is unknown or malformed
- `market_value` is zero for a supposedly active position
- `cost_basis` is negative
- `quantity * price` materially disagrees with `market_value`

### 7.5 Duplicate-row validation

Potential duplicate if these all match:
- `as_of`
- `owner`
- `institution`
- `account`
- `asset_name`
- `market_value`

Potential duplicates should be flagged, not silently merged.

---

## 8. Mapping rules

### 8.1 What gets mapped

The ingest layer must map:
- `owner` → canonical owner/entity
- `institution` → canonical institution label
- `account` → canonical account
- `asset_name` / `ticker` / identifiers → canonical asset
- `asset_class` → canonical asset class
- `asset_type` → canonical asset type

### 8.2 Mapping precedence

Use this priority:
1. explicit approved mapping table
2. exact canonical match
3. exact known alias match
4. deterministic normalization rule
5. unresolved → review queue

### 8.3 Mapping output behavior

A row should not become canonical until required mappings are resolved.

Required resolved mappings for commit:
- owner/entity
- account
- asset
- asset class

### 8.4 Mapping audit requirement

For each imported row, Signal should preserve:
- raw input values
- canonical mapped targets
- mapping method used
- review status where applicable

That makes imports debuggable instead of mystical.

---

## 9. Unresolved mapping policy

### 9.1 Hard-block cases

Do not ingest the row when:
- owner cannot be resolved
- account cannot be resolved
- asset cannot be resolved
- asset class cannot be resolved
- market value is invalid

### 9.2 Soft-warning cases

Allow ingest with warning when:
- `cost_basis` is missing
- `ticker` is missing
- `quantity` and `price` are missing for a private asset
- `notes` is empty

### 9.3 Review queue examples

Examples that should go to review:
- account = `Main`
- owner = `J`
- asset = `Growth Fund`
- asset class = `alts`

Those are not trustworthy enough for auto-commit.

---

## 10. Cash flow import extension (next step)

Signal should later support a separate normalized cash flow CSV.

Suggested columns:
- `effective_date`
- `household`
- `owner`
- `institution`
- `account`
- `asset_name` (optional)
- `flow_type`
- `direction`
- `amount`
- `currency`
- `status`
- `source_file`
- `notes` (optional)

This should be implemented after holdings import is stable.

---

## 11. Import result expectations

Each import run should produce:
- total rows processed
- rows accepted
- rows rejected
- rows flagged for review
- unresolved mappings by type
- source file metadata
- import timestamp

That summary should be stored with the `data_source` record.

---

## 12. Recommended v1 operating rules

1. Start with holdings snapshot import only.
2. Require one normalized CSV contract.
3. Preserve raw source values for audit.
4. Make mapping tables first-class data.
5. Block unresolved critical mappings.
6. Prefer a visible review queue over clever auto-magic.

That is how you keep Signal clean as it grows.
