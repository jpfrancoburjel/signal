# Signal Taxonomy (Draft)

This document defines the first working taxonomy for Signal.

The goal is not to invent a perfect ontology. The goal is to make imports consistent, dashboard groupings reliable, and naming sane.

This is a v1 operating taxonomy for a family-investment system.

---

## 1. Purpose

Signal needs standard rules for:
- asset classes
- owner/entity naming
- account naming
- account types
- canonical labels used across imports and dashboard views

If these rules are loose, the same thing will appear under three names and the dashboard will lie with a straight face.

---

## 2. Taxonomy principles

1. **Canonical names win**
   - Raw source labels are input, not truth.
   - Signal stores one canonical label per real-world thing.

2. **Stable over clever**
   - Prefer boring, durable labels over source-specific jargon.

3. **Human-readable first**
   - Names should be understandable to a household, not just an engineer.

4. **Separate display from internal identity**
   - A system may store both a canonical key and a display label.

5. **Mappings are expected**
   - Source names will differ.
   - Mapping raw labels to canonical labels is normal behavior, not an edge case.

---

## 3. Asset class taxonomy

### 3.1 v1 top-level asset classes

These are the required top-level classes for the current dashboard.

| Code | Canonical label | Description |
|---|---|---|
| `public_equities` | Public Equities | Publicly traded stocks, equity ETFs, equity mutual funds, ADRs |
| `private_equity` | Private Equity | Venture funds, buyout funds, direct private-company positions, SPVs |
| `crypto` | Crypto | Cryptocurrencies, tokens, liquid crypto funds, staking positions |
| `cash` | Cash | Bank cash, checking, savings, money market cash equivalents |
| `real_estate_funds` | Real Estate Funds | REIT funds, real-estate syndications, real-estate vehicles |
| `other` | Other | Anything real but not yet properly classified |

These should match the dashboard allocation buckets for v1.

### 3.2 Suggested v2 subcategories

These do not need to appear in the dashboard yet, but they are worth reserving.

#### Public Equities
- `single_stocks`
- `equity_etfs`
- `equity_mutual_funds`
- `index_funds`

#### Private Equity
- `venture_funds`
- `buyout_funds`
- `spvs`
- `direct_private_company`

#### Crypto
- `layer1_tokens`
- `stablecoins`
- `defi_tokens`
- `staking_positions`
- `crypto_funds`

#### Cash
- `checking`
- `savings`
- `money_market`
- `brokerage_cash`
- `treasury_cash_equivalents`

#### Real Estate Funds
- `reit`
- `private_real_estate_fund`
- `real_estate_syndication`

#### Other
- `collectibles`
- `structured_products`
- `miscellaneous`

### 3.3 Asset classification rules

Use these rules when classifying an asset:

1. If the instrument is publicly traded equity exposure, classify as `public_equities`.
2. If the instrument represents private-company or private-fund exposure, classify as `private_equity`.
3. If the instrument is a blockchain-native asset or tokenized crypto exposure, classify as `crypto`.
4. If the instrument is immediately liquid cash or cash-equivalent balance, classify as `cash`.
5. If the instrument is a real-estate pooled vehicle, classify as `real_estate_funds`.
6. If classification is unclear, temporarily classify as `other` and flag for review.

### 3.4 “Other” rules

`other` is allowed, but it is not a junk drawer forever.

Rules:
- `other` can be used temporarily during import.
- Every recurring `other` asset should later be reclassified.
- If `other` exceeds a meaningful portfolio share, taxonomy work is overdue.

---

## 4. Asset naming rules

### 4.1 Canonical asset fields

Each asset should have:
- `canonical_name`
- `display_name`
- `asset_class`
- `asset_type`
- optional identifiers like `ticker`, `isin`, `cusip`

### 4.2 Canonical asset naming rules

1. Use the most widely recognized formal name where possible.
   - Example: `Apple Inc.` not `Apple stock`
2. For funds, use the legal or standard market-facing fund name.
   - Example: `Sequoia Capital Fund VIII`
3. For crypto, use the standard asset name and ticker if available.
   - Example: `Bitcoin` with ticker `BTC`
4. Avoid account-specific decoration in asset names.
   - Wrong: `Bitcoin Coinbase`
   - Correct: asset = `Bitcoin`, account = `Coinbase Main`
5. Avoid owner-specific decoration in asset names.
   - Wrong: `Juan AAPL`
   - Correct: owner and asset are separate dimensions

### 4.3 Display name rules

Display names can be shorter than canonical names if readability improves.

Examples:
- canonical: `Vanguard Total Stock Market Index Fund Admiral Shares`
- display: `Vanguard Total Stock Market`

### 4.4 Duplicate asset rules

Multiple raw source labels may map to one canonical asset.

Examples:
- `BTC`
- `Bitcoin`
- `XBT`

All may resolve to one canonical asset record if they represent the same underlying asset.

---

## 5. Owner / entity taxonomy

### 5.1 Purpose

The owner/entity dimension answers: who economically owns this asset?

It is not the same thing as account label, source file label, or beneficiary note.

### 5.2 Allowed v1 owner/entity types

| Code | Label | Use case |
|---|---|---|
| `individual` | Individual | A specific person |
| `joint` | Joint | Joint ownership bucket when singular allocation is not practical |
| `trust` | Trust | Family trust or similar structure |
| `company` | Company | LLC, corporation, SPV manager entity |
| `other` | Other | Temporary fallback |

### 5.3 Owner/entity naming rules

1. Use real canonical names, not shorthand that changes by file.
2. Keep one stable record per true owner/entity.
3. Do not encode account or asset info into the owner name.
4. Use title case for display names.
5. Avoid ambiguous aliases once canonicalized.

Examples:
- canonical: `Juan Franco`
- canonical: `Analia Semblat`
- canonical: `Franco Family Trust`
- canonical: `Juan + Analia Joint`

### 5.4 Raw-label mapping examples

| Raw source label | Canonical owner/entity |
|---|---|
| `Juan` | `Juan Franco` |
| `J Franco` | `Juan Franco` |
| `JP` | `Juan Franco` |
| `Joint` | `Juan + Analia Joint` |
| `Family Trust` | `Franco Family Trust` |

### 5.5 Joint ownership rule for v1

For v1:
- allow a single `joint` owner/entity record when a position is jointly held
- do not force split percentages yet unless the source data truly requires them

This keeps imports simple.

### 5.6 When to create a new owner/entity

Create a new canonical owner/entity only when one of these is true:
- it is a legally distinct structure
- it has materially distinct economic ownership
- reporting should separate it in the ownership split

Do **not** create separate owner/entities just because a spreadsheet uses a different nickname.

---

## 6. Account taxonomy

### 6.1 Purpose

An account is the container where the asset is held.

Examples:
- brokerage account
- checking account
- Coinbase wallet/account
- private fund capital account

### 6.2 Allowed v1 account types

| Code | Label | Use case |
|---|---|---|
| `brokerage` | Brokerage | Taxable broker accounts |
| `bank` | Bank | Checking, savings, cash accounts |
| `crypto_wallet` | Crypto Wallet | Exchange accounts or on-chain wallets |
| `retirement` | Retirement | IRA, 401(k), pension-style holdings |
| `private_fund` | Private Fund | Fund subscription or capital-account-like positions |
| `other` | Other | Temporary fallback |

### 6.3 Canonical account naming format

Use:

`<Institution> - <Owner/Entity Short Name> - <Account Purpose>`

Examples:
- `Fidelity - Juan - Brokerage`
- `Chase - Joint - Savings`
- `Coinbase - Juan - Primary`
- `Sequoia - Family Trust - Fund VIII`

This format is intentionally boring. Boring is good.

### 6.4 Account naming rules

1. Always include institution name first.
2. Include owner/entity short name second.
3. Include functional account label third.
4. Do not include full account numbers.
5. If needed, include only a masked suffix.
   - Example: `Fidelity - Juan - Brokerage (…4821)`
6. Keep names stable even if the import source changes.
7. Do not use one-off spreadsheet nicknames as canonical account names.

### 6.5 Institution naming rules

Use one canonical institution name per provider.

Examples:
- `Fidelity`
- `Charles Schwab`
- `JPMorgan Chase`
- `Coinbase`
- `Bank of America`

Do not allow drift like:
- `Chase`
- `JP Morgan`
- `JPM`

Pick one and map everything to it.

### 6.6 Account deduplication rules

Treat accounts as the same canonical account when:
- institution matches
- owner/entity matches
- masked account identity matches or account purpose clearly matches

Treat them as different accounts when:
- legal ownership differs
- institution differs
- they are operationally different pools of assets

---

## 7. Mapping rules

### 7.1 General rule

Raw labels are never trusted blindly.

Every import should be able to map:
- raw owner labels → canonical owners/entities
- raw account labels → canonical accounts
- raw asset labels → canonical assets
- raw asset class labels → canonical asset classes

### 7.2 Mapping precedence

Use this priority order:
1. explicit user-approved mapping
2. exact canonical name match
3. exact alias match
4. deterministic rule-based normalization
5. unresolved → flag for review

### 7.3 Normalization rules before matching

Before matching raw labels:
- trim whitespace
- collapse repeated spaces
- standardize case for matching
- remove obvious punctuation noise where safe
- preserve original raw value for audit

### 7.4 Unsafe auto-mapping rule

Do **not** auto-merge two labels when ambiguity is material.

Examples:
- `Growth Fund` is too vague
- `Main Account` is too vague
- `Joint` may be too vague without household context

When ambiguous, force review.

---

## 8. Recommended canonical seed sets

### 8.1 Seed asset classes
- Public Equities
- Private Equity
- Crypto
- Cash
- Real Estate Funds
- Other

### 8.2 Seed owner/entity records
This will depend on the household, but likely starts with:
- Juan Franco
- spouse / partner if applicable
- Joint household entity if needed
- any trust/legal structure actually used

### 8.3 Seed account records
Seed accounts should come from real current sources, not imagined completeness.

Start with only the accounts that appear in the first live import.

---

## 9. Governance rules for taxonomy changes

1. New asset classes should be rare.
2. New subcategories are easier than new top-level classes.
3. New owner/entity records should reflect real ownership structure, not import noise.
4. New account records should reflect real containers, not temporary spreadsheet formatting.
5. Every taxonomy change should preserve backward mapping for past imports.

---

## 10. Current recommendation

For v1, lock these down first:
- top-level asset classes
- canonical owner/entity names
- canonical institution names
- canonical account naming format
- mapping review workflow

That is enough to stop import chaos and make the dashboard trustworthy.
