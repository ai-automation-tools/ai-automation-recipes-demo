# Requirements — Refinance Break-Even Calculator

## Functional Requirements

- **FR-1** User enters a current loan: loan type (Mortgage / Auto / Personal / Student, label only), current balance ($), current APR (%), and remaining term (months).
- **FR-2** User enters a refinance offer: new APR (%), new term (months), and closing costs ($). A helper button fills closing costs to 3% of the current balance (midpoint of the typical 2%–5% range) as a starting estimate.
- **FR-3** User enters how many months they plan to keep the loan (the "plan to stay" horizon) before selling, paying it off early, or refinancing again.
- **FR-4** App computes the new loan's amortized monthly payment from balance, new APR, and new term using the standard amortization formula, and reports the monthly payment difference against the current loan.
- **FR-5** App reports two break-even figures:
  - **Simple break-even** — closing costs ÷ monthly savings (the standard industry rule of thumb).
  - **Term-adjusted break-even** — the month at which cumulative true cost (payments made so far + upfront closing costs + remaining balance still owed) for the new loan first drops below the current loan's, found by simulating both loans month-by-month. This can diverge from the simple break-even even when the term doesn't change, because it accounts for how much faster the new (lower) rate pays down principal each month rather than just the flat monthly-payment difference. The gap is largest when the new term also resets longer or shorter than the current loan's remaining term.
- **FR-6** A verdict banner compares true cost for both loans at the user's "plan to stay" horizon and states which loan is cheaper and by how much, or flags a "resets your term" warning when the new loan's remaining balance at the horizon is meaningfully higher than the current loan's despite a lower rate.
- **FR-7** A Chart.js line chart plots cumulative true cost (payments made + remaining balance owed, with closing costs added upfront for the new loan) for both loans over time, so the crossover point is visible.
- **FR-8** A "Load sample scenario" control cycles through 10 preset scenarios (`sample-data.json`) spanning mortgage, auto, personal loan, and student loan refinances, including at least one scenario where refinancing does not pay off within the planned stay.
- **FR-9** A rule-of-thumb note states that a rate drop of at least 0.75–1.0 percentage points is generally needed to offset closing costs within about two years (sourced from Bankrate — see README Sources).
- **FR-10** Invalid or missing inputs (non-positive balance, non-positive term, non-positive APR bound, monthly savings ≤ 0 for break-even math) are handled without throwing: break-even shows "Never — payment doesn't decrease" instead of a bogus number.

## Technical Requirements

- **TR-1** Single-page app — `index.html` opens directly from `file://` in any modern browser with no build step, server, or API keys.
- **TR-2** All monetary arithmetic uses **integer cents** (dollar inputs multiplied by 100 and rounded) to avoid binary-floating-point drift. Dollar display is formatted at output only via `toLocaleString`.
- **TR-3** External CDN dependency: `chart.js@4.4.7` via `https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js`. No other third-party libraries.
- **TR-4** Month-by-month amortization simulation includes a hard safety cap of **480 months** (40 years).
- **TR-5** Existing Chart.js instance is destroyed before re-rendering to prevent canvas memory accumulation.
- **TR-6** No cash-out modeling — the new loan's principal always equals the current loan's balance (rate-and-term refinance only), matching how the standard break-even rule of thumb is defined.
- **TR-7** Closing costs are modeled as paid out of pocket at closing, not rolled into the new loan balance.

## Non-Requirements

- No real account connections, OAuth flows, or third-party rate-quote API calls.
- No persistent storage — session-only state.
- No server-side computation.
- No personalized financial, investment, or tax advice output; no recommendation to use a specific lender.
- Does not model tax deductibility of mortgage interest, PMI removal/addition, or escrow changes.
