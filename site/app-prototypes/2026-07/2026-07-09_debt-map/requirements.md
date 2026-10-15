# DebtMap — Requirements

## Goals

- Show users exactly when each debt will be paid off and the total interest cost, given their chosen strategy and extra payment amount.
- Let users instantly compare the Avalanche vs Snowball payoff methods with a quantified trade-off (months saved vs interest saved).
- Visualize debt reduction over time in a chart that updates in real time as inputs change.
- Make adding, editing, and removing debts fast and frictionless.
- Run fully in-browser with no backend, no login, and no API keys.

## Primary user

A professional in their late 20s–early 40s carrying $20K–$80K in mixed consumer debt (credit cards, student loans, auto loan). They check budgeting apps occasionally but have never seen their actual payoff timeline. They are motivated but overwhelmed; they need the plan to feel achievable. Accessed on desktop or tablet, occasionally on mobile.

## Functional requirements

- FR1: Load debts from `sample-data.json` on startup so the demo is immediately populated with realistic data.
- FR2: Display each debt as a list item with name, type badge, balance, and APR; color-code each by a unique accent color.
- FR3: Provide a numeric input for extra monthly payment amount; recalculate all projections on every change.
- FR4: Provide a two-option strategy toggle (Avalanche / Snowball); recalculate and re-render on switch.
- FR5: Simulate the full payoff month-by-month using compound interest math (monthly rate = APR / 12), applying minimum payments to all debts and extra payment to the priority debt per strategy.
- FR6: Display three summary cards: debt-free date (month + year), interest saved vs minimum-only baseline, and total current debt balance with account count.
- FR7: Render a stacked area Chart.js chart showing remaining balance per debt across the payoff timeline; update chart on every recalculation.
- FR8: Show a strategy comparison insight explaining how many months and dollars one method saves over the other.
- FR9: Provide an "Add Debt" modal with fields: name, type (select), balance, APR, minimum payment; validate all fields before adding.
- FR10: Allow removal of any debt via a remove button; update all projections immediately after removal.
- FR11: Render a payoff schedule table listing each debt with its payoff date, balance, APR, and estimated interest cost in the chosen strategy, ordered by payoff date.
- FR12: Handle edge case of zero or no debts gracefully — show placeholder text, do not crash or render a broken chart.

## User stories

- As a user with multiple debts, I want to see all my debts in one place so I understand my total debt picture at a glance.
- As a user, I want to toggle between Avalanche and Snowball strategies so I can choose the method that best fits my psychology and goals.
- As a user, I want to adjust my extra monthly payment and immediately see how it changes my debt-free date and total interest.
- As a user, I want a visual chart of my debt declining over time so the payoff journey feels tangible and motivating.
- As a user, I want to know when each specific debt will be paid off so I can plan future cash flow.
- As a user, I want to add a new debt account so I can keep the plan accurate as my situation changes.
- As a user, I want to see the difference in total interest between paying the minimum only vs my current plan so I understand what my extra payment is actually worth.
- As a user on mobile, I want the layout to reflow cleanly so I can check my plan on my phone.

## Non-functional requirements

- Runs entirely in the browser — no server, no API calls, no authentication.
- Loads sample data via `fetch('sample-data.json')` — works on a local server or any static host; does not require `file://` protocol handling.
- Payoff simulation must handle up to 480 months (40 years) without hanging the browser.
- Chart updates must feel instantaneous (< 100ms perceived re-render) for typical debt counts (≤ 15 debts).
- Responsive layout: sidebar collapses below chart panel on viewports narrower than 900px; single-column on mobile.
- Accessible: form inputs have labels, modal is focusable, remove buttons have descriptive context.
- No third-party dependencies beyond Chart.js (loaded from CDN) — no CSS frameworks, no component libraries.

## Out of scope (for the prototype)

- Bank account sync (Plaid or open banking integrations)
- User accounts, login, or data persistence across sessions
- Push / email notifications for payoff milestones
- PDF or CSV export
- Scenario comparisons (e.g. income increase, lump-sum paydown)
- Credit-score impact projections
- Currency localization (USD only in prototype)

## Open questions

- Should the Snowball strategy redirect freed minimums immediately to the next target debt within the same month, or defer to the following month? (Current implementation: defers.)
- Is a month-by-month payment table (row per month) more useful than the schedule-by-debt table, or should both be offered?
- What is the right upgrade prompt moment — immediately on load, after the user adjusts extra payment, or after they view the schedule table?
