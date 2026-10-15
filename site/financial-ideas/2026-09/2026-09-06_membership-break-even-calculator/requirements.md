# Requirements — Membership Break-Even Calculator

## Functional Requirements

- **FR-1** App ships four retailer panels: Costco (Gold Star / Executive), Sam's Club (Club / Plus), BJ's Wholesale (Club Card / Club+), and Amazon (Prime). Fee, reward rate, and reward cap for each tier come from `sample-data.json`.
- **FR-2** For each warehouse-club retailer (Costco, Sam's Club, BJ's), the user enters one number: their own estimated annual spend at that retailer. The same spend figure applies to both tiers, since the tier doesn't change what you buy.
- **FR-3** For Amazon, the user enters a different number: their own estimate of what free/fast shipping plus Prime Video are worth to them per year. There is no purchase-based reward to compute, so this retailer is value-based rather than spend-based.
- **FR-4** A "Load a demo profile" dropdown fills all four inputs at once from one of three presets in `sample-data.json` (`family-of-four`, `single-professional`, `small-business-owner`). Loaded values remain editable afterward.
- **FR-5** On calculate, for each warehouse retailer the app computes: reward earned per tier (`min(spend × rewardRate, rewardCap)`), net annual cost per tier (`fee − reward`), which tier is cheaper at the entered spend, and the break-even spend needed for the upgrade tier's reward alone to fully offset the extra fee versus the base tier (`(upgradeFee − baseFee) / rewardRate`, capped by `rewardCap / rewardRate` — if the reward cap is lower than the fee difference, the app states the upgrade can never fully pay for itself from rewards alone regardless of spend, rather than showing a number).
- **FR-6** For Amazon, the app shows net value (`estimated value − annual fee`) and a plain-language verdict ("worth it at your estimate" / "not worth it at your estimate") rather than a break-even spend, since there's no reward rate to invert.
- **FR-7** A summary panel totals, across every retailer with spend or value entered greater than zero: total fees for the recommended tier per retailer, total rewards earned, total net annual cost, and the monthly-equivalent of that net cost.
- **FR-8** Each retailer panel renders a simple CSS bar comparing the two tiers' net annual cost side by side, with the cheaper option visually marked.
- **FR-9** Zero spend at a retailer is valid (some households don't shop every club) and is excluded from the summary totals rather than shown as a $0 "win."
- **FR-10** Negative or non-numeric input is rejected inline (the field is marked invalid and calculation is blocked) rather than silently coerced to zero.

## Technical Requirements

- **TR-1** Single-page app — `index.html` opens directly from `file://` in any modern browser, no build step, no server, no API keys.
- **TR-2** All monetary arithmetic uses **integer cents** (dollar inputs multiplied by 100 and rounded) to avoid binary-floating-point drift. Dollar display is formatted at output only.
- **TR-3** `sample-data.json` values are embedded directly in `script.js` (not fetched), since `fetch()` of a local JSON file is blocked by CORS under the `file://` protocol in most browsers.
- **TR-4** Reward-rate math (`rewardRate`) is stored as a decimal (`0.02`) and only ever multiplied against integer cents, then rounded to the nearest cent.
- **TR-5** Vanilla JS only — no external CDN dependency. A chart library isn't warranted for a same-page bar comparison across two tiers per retailer.
- **TR-6** No cross-tab persistence — session-only state, cleared on reload.

## Non-Requirements

- No real account connections, membership sign-up flows, or retailer API calls.
- No modeling of warehouse gas-station discounts, travel booking credits, or other perks beyond the cited reward rate/cap — those vary too much by location and use pattern to estimate responsibly here.
- No personalized recommendation to join or cancel a specific membership; the app reports the arithmetic, not a directive.
- Does not model membership price changes mid-cycle or promotional first-year discounts.
