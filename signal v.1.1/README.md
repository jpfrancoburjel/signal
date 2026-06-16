# Signal v1.1

This folder holds the new dashboard direction without touching the original Signal prototype.

## What changed in v1.1

Instead of forcing everything into a traditional investments dashboard, v1.1 starts from the real question:

**Where is the money?**

That means the dashboard is reorganized around:

1. **Total tracked wealth**
2. **Cash vs invested split**
3. **Currency exposure (UYU / USD / EUR)**
4. **Institution exposure**
5. **Ownership split**
6. **Location of money** (`owner → institution → account`)
7. **Liquidity and concentration signals**

## Folder contents

- `dashboard/` — standalone HTML/CSS/JS prototype for the v1.1 approach
- `dashboard-approach.md` — product/UI rationale for the new structure
- `data-notes.md` — how the spreadsheet rows were interpreted for this prototype

## Notes

- This is intentionally separated from the original `signal/dashboard/` prototype.
- FX conversions are approximate in the prototype and should move to an explicit FX source later.
- Some investment owners are still inferred or unassigned and should be confirmed before this becomes canonical.
