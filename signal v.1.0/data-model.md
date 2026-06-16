# Signal Canonical Data Model (Draft)

This document defines the first draft of the canonical data structure for Signal.

The goal is simple: every spreadsheet, broker export, manual entry, and dashboard view should map into one consistent model.

This draft is based on the current dashboard requirements and prototype.

---

## 1. Purpose

Signal needs a single source of truth for family investment data.

The canonical model should:
- unify data from multiple sources
- support dashboard calculations reliably
- preserve history over time
- support manual corrections and mappings
- make imports repeatable instead of ad hoc

This model is intentionally practical, not academic.

---

## 2. Modeling principles

1. **Canonical before pretty**
   - Raw source data can be messy.
   - Signal should normalize it into one clean internal structure.

2. **Snapshots matter**
   - Portfolio reporting is time-based.
   - We need explicit as-of dates for valuations and positions.

3. **Mappings are first-class**
   - Raw labels from spreadsheets and brokers will vary.
   - Signal must explicitly map those raw labels to canonical entities.

4. **Manual-first is acceptable**
   - v1 can rely on CSVs and manual updates.
   - The structure should still be strong enough to scale later.

5. **Household-level, not trader-level**
   - This is for understanding family wealth.
   - We optimize for clarity, not trading-system complexity.

---

## 3. Core entities

The current dashboard implies the following core entities.

### 3.1 Household

Represents the top-level portfolio boundary shown in the dashboard.

#### Required fields
- `id`
- `name`
- `base_currency`
- `timezone`
- `created_at`
- `updated_at`

#### Notes
- A household may contain multiple owners/entities.
- v1 likely starts with a single household.

---

### 3.2 Owner / Entity

Represents a family member or legal structure that owns assets.

Examples:
- Juan
- spouse
- family trust
- LLC

#### Required fields
- `id`
- `household_id`
- `name`
- `type` — e.g. `individual`, `trust`, `company`, `joint`, `other`
- `status` — `active`, `inactive`
- `notes` (optional)
- `created_at`
- `updated_at`

#### Notes
- Dashboard ownership split should roll up by this entity.
- “Owner” in the UI should likely be backed by this entity model.

---

### 3.3 Account

Represents a container where assets are held.

Examples:
- Fidelity brokerage
- Coinbase
- bank savings account
- private fund subscription ledger

#### Required fields
- `id`
- `household_id`
- `owner_entity_id`
- `institution_name`
- `account_name`
- `account_type` — e.g. `brokerage`, `bank`, `crypto_wallet`, `retirement`, `private_fund`, `other`
- `currency`
- `status` — `open`, `closed`, `inactive`
- `is_manual` — boolean
- `created_at`
- `updated_at`

#### Optional fields
- `account_number_masked`
- `jurisdiction`
- `notes`

#### Notes
- A household can have many accounts.
- Each account belongs to one owner/entity in v1.
- Later versions may support shared ownership rules if needed.

---

### 3.4 Asset

Represents the canonical thing being owned.

Examples:
- Apple stock
- Bitcoin
- Sequoia Fund VIII
- money market cash
- REIT fund

#### Required fields
- `id`
- `canonical_name`
- `display_name`
- `asset_class_id`
- `asset_type` — e.g. `stock`, `etf`, `fund`, `cash`, `crypto`, `bond`, `private_equity`, `real_estate_fund`, `other`
- `currency`
- `status` — `active`, `inactive`
- `created_at`
- `updated_at`

#### Optional fields
- `ticker`
- `isin`
- `cusip`
- `external_id`
- `description`
- `liquidity_profile`
- `risk_notes`

#### Notes
- `canonical_name` is the internal source of truth.
- `display_name` is what the dashboard shows.
- Multiple raw source labels may map to one canonical asset.

---

### 3.5 Asset Class

Represents the taxonomy used for allocation views.

#### Required fields
- `id`
- `name`
- `code`
- `parent_asset_class_id` (optional)
- `sort_order`
- `status`

#### Seed categories from current dashboard
- public equities
- private equity
- crypto
- cash
- real estate funds
- other

#### Notes
- These are provisional and should later become a formal taxonomy.
- Parent-child support is useful if later you want subcategories.

---

### 3.6 Holding

Represents a canonical position in an asset within an account.

This is the position-level object that powers the holdings table.

#### Required fields
- `id`
- `household_id`
- `owner_entity_id`
- `account_id`
- `asset_id`
- `conviction_label` — e.g. `core`, `high conviction`, `watch`, `exit`, `unknown`
- `source_method` — `imported`, `manual`, `derived`
- `status` — `open`, `closed`, `inactive`
- `opened_at` (optional)
- `closed_at` (optional)
- `created_at`
- `updated_at`

#### Notes
- A holding does **not** store just one current value permanently.
- Time-varying values should live in snapshots.
- One holding can have many historical snapshots.

---

### 3.7 Holding Snapshot

Represents the state of a holding at a specific point in time.

This is the most important table for history and calculations.

#### Required fields
- `id`
- `holding_id`
- `as_of`
- `quantity` (nullable for assets where quantity is not meaningful)
- `price` (nullable)
- `market_value`
- `cost_basis` (nullable)
- `unrealized_gain` (nullable or derived)
- `currency`
- `data_source_id` (optional)
- `is_estimate` — boolean
- `created_at`

#### Notes
- `market_value` is required because some private assets won’t have clean quantity × market price logic.
- `cost_basis` supports unrealized gain calculations.
- `unrealized_gain` can be stored or derived.
- This table enables performance-over-time and as-of reporting.

---

### 3.8 Cash Flow

Represents expected or realized portfolio cash movements.

Examples:
- dividend
- interest
- fund distribution
- staking reward
- contribution
- withdrawal
- fee

#### Required fields
- `id`
- `household_id`
- `owner_entity_id` (optional)
- `account_id` (optional)
- `asset_id` (optional)
- `holding_id` (optional)
- `flow_type` — `dividend`, `interest`, `distribution`, `contribution`, `withdrawal`, `fee`, `tax`, `other`
- `direction` — `inflow`, `outflow`
- `amount`
- `currency`
- `effective_date`
- `status` — `expected`, `projected`, `settled`, `cancelled`
- `notes` (optional)
- `created_at`
- `updated_at`

#### Notes
- Forward cash flow on the dashboard will likely come from `expected` or `projected` rows over the next 12 months.
- Realized and expected cash flows should share one model where possible.

---

### 3.9 Portfolio Snapshot

Represents a household-level summarized portfolio state at a specific time.

#### Required fields
- `id`
- `household_id`
- `as_of`
- `total_market_value`
- `total_cost_basis` (nullable)
- `total_unrealized_gain` (nullable)
- `yearly_change_pct` (nullable)
- `forward_cash_flow_12m` (nullable)
- `risk_score` (nullable)
- `created_at`

#### Notes
- This can be fully derived from holding snapshots plus cash flow data.
- Still useful as a cached/materialized layer for dashboard performance.

---

### 3.10 Data Source

Represents the provenance of imported or manually created data.

#### Required fields
- `id`
- `source_type` — `csv`, `broker_export`, `manual`, `spreadsheet`, `api`, `other`
- `source_name`
- `imported_at`
- `as_of`
- `notes` (optional)
- `raw_reference` (optional)

#### Notes
- Important for trust, debugging, and re-import workflows.

---

### 3.11 Mapping Tables

These are essential, not optional.

They connect messy source labels to canonical records.

#### Suggested mapping entities
- `source_owner_mapping`
- `source_account_mapping`
- `source_asset_mapping`
- `source_asset_class_mapping`

#### Common fields
- `id`
- `data_source_id`
- `raw_label`
- `canonical_target_type`
- `canonical_target_id`
- `confidence` (optional)
- `review_status` — `pending`, `accepted`, `rejected`
- `created_at`
- `updated_at`

#### Notes
- If mappings are hidden in code, the system becomes brittle.
- If mappings live in data, imports become maintainable.

---

## 4. Core relationships

High-level relationship model:

- one `household` has many `owner_entities`
- one `household` has many `accounts`
- one `owner_entity` has many `accounts`
- one `account` has many `holdings`
- one `asset` can appear in many `holdings`
- one `holding` has many `holding_snapshots`
- one `household` has many `cash_flows`
- one `household` has many `portfolio_snapshots`
- one `data_source` can produce many snapshots, mappings, and records

---

## 5. Dashboard-to-model mapping

This section maps current dashboard requirements to the canonical model.

### 5.1 Header
- `project name` → app-level constant
- `household name` → `household.name`
- `as-of date` → latest `portfolio_snapshot.as_of` or selected reporting date

### 5.2 Summary cards

#### Total portfolio value
Derived from:
- sum of `holding_snapshot.market_value` for selected `as_of`
or
- cached `portfolio_snapshot.total_market_value`

#### Net unrealized gain
Derived from:
- sum of `holding_snapshot.market_value - holding_snapshot.cost_basis`
or
- cached `portfolio_snapshot.total_unrealized_gain`

#### Forward cash flow
Derived from:
- sum of `cash_flow.amount`
where:
- `status in (expected, projected)`
- `effective_date` falls within next 12 months
- `direction = inflow`

### 5.3 Portfolio trajectory
Derived from:
- `portfolio_snapshot` time series
or
- aggregated `holding_snapshot` values by period

### 5.4 Risk signal
Derived from:
- current asset allocation by `asset_class`
- household-level heuristic formula

### 5.5 Asset allocation
Derived from:
- grouped `holding_snapshot.market_value`
by `asset.asset_class_id`

### 5.6 Ownership split
Derived from:
- grouped `holding_snapshot.market_value`
by `holding.owner_entity_id`

### 5.7 Top holdings table
Derived from joined records across:
- `holding`
- `asset`
- `account`
- `owner_entity`
- latest `holding_snapshot`

---

## 6. Required v1 calculations

Signal v1 needs these derived calculations at minimum.

### 6.1 Total portfolio value
- Sum latest market values across included holdings for a selected `as_of`

### 6.2 Total cost basis
- Sum latest cost basis across included holdings where available

### 6.3 Net unrealized gain
- `total portfolio value - total cost basis`

### 6.4 Net unrealized gain %
- `(net unrealized gain / total cost basis) * 100`

### 6.5 Allocation by asset class
- grouped market value / total portfolio value

### 6.6 Allocation by owner/entity
- grouped market value / total portfolio value

### 6.7 Forward cash flow (12m)
- sum of expected inflow cash flows over next 12 months

### 6.8 Risk score
- calculated from allocation percentages using the current dashboard heuristic

---

## 7. Open design decisions

These still need to be finalized.

### 7.1 Holding identity rules
Questions:
- Is a holding uniquely defined by `account + asset`?
- Do we need separate holdings for different tax lots?
- How do we represent private funds with irregular valuation logic?

### 7.2 Cost basis rules
Questions:
- Should cost basis always be imported, or sometimes manually entered?
- Do we support partial basis availability?
- How do we handle basis for private/illiquid assets?

### 7.3 Multi-currency support
Questions:
- Is base reporting always in one household currency?
- Do we store FX rates separately?
- Should snapshots store both native value and base-currency value?

### 7.4 Joint/shared ownership
Questions:
- Is account ownership always singular in v1?
- Do we need percentage ownership splits later?

### 7.5 Private asset valuation rules
Questions:
- How often are private valuations updated?
- What counts as official vs estimated?
- How do we tag stale valuations?

---

## 8. Suggested v1 implementation shape

For v1, keep the system simple.

### Storage
- SQLite

### Main tables
- `households`
- `owner_entities`
- `accounts`
- `asset_classes`
- `assets`
- `holdings`
- `holding_snapshots`
- `cash_flows`
- `portfolio_snapshots`
- `data_sources`
- mapping tables

### Ingestion approach
- normalized CSV import first
- raw source mapping second
- later: broker-specific adapters

---

## 9. Minimum normalized import shape

A first normalized import format should probably include rows with:
- `as_of`
- `household`
- `owner`
- `account`
- `institution`
- `asset_name`
- `ticker` (optional)
- `asset_type`
- `asset_class`
- `quantity` (optional)
- `price` (optional)
- `market_value`
- `cost_basis` (optional)
- `currency`
- `conviction_label` (optional)
- `source_file`

This should be defined more formally in a separate import spec.

---

## 10. Recommended next documents

After this draft, the next docs should be:

1. `import-spec.md`
   - exact CSV columns
   - validation rules
   - mapping workflow

2. `taxonomy.md`
   - asset classes
   - owner/entity rules
   - account-type rules
   - naming conventions

3. `architecture.md`
   - local app structure
   - DB layer
   - importer flow
   - dashboard query layer

---

## 11. Current recommendation

Before building more UI, finalize:
- the entity list
- field definitions
- relationship rules
- import shape
- valuation snapshot rules

That is the foundation that turns Signal from a mockup into a system.
