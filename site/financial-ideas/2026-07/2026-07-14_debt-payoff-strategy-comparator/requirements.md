# Requirements — Debt Payoff Strategy Comparator

## Functional Requirements

- **FR-1** User can enter any number of debts via an editable table. Each row requires: account name (text), current balance (dollars), APR (%), and minimum monthly payment (dollars).
- **FR-2** User can specify an extra monthly payment (dollars) applied beyond the sum of all minimums.
- **FR-3** App computes the **Avalanche** payoff schedule: each month, after applying minimum payments to all active debts, the extra payment pool (user extra + freed minimums from fully paid debts) is directed to the debt with the highest current APR.
- **FR-4** App computes the **Snowball** payoff schedule: same pool directed to the debt with the lowest current remaining balance.
- **FR-5** Side-by-side summary cards display for each strategy: total interest paid, months to debt-free (formatted as years + months when ≥12), and total amount paid.
- **FR-6** A verdict banner names which strategy saves more interest, states the dollar difference, and notes the month difference in payoff timeline.
- **FR-7** A Chart.js line chart renders total remaining balance over time for both strategies on the same axes, with shared tooltip.
- **FR-8** A payoff-order section lists debts in the order each strategy eliminates them, with the month number of elimination.
- **FR-9** Sample data (five synthetic debts) is pre-loaded on first render. A "Load sample data" button resets all inputs to defaults.
- **FR-10** User can add debt rows (blank) and remove any row. Rows missing any required field are silently skipped during computation.

## Technical Requirements

- **TR-1** Single-page app — `index.html` opens directly from `file://` in any modern browser with no build step, server, or API keys.
- **TR-2** All monetary arithmetic uses **integer cents** (inputs multiplied by 100 and rounded) to avoid binary-floating-point drift. Dollar display is formatted at output only via `toLocaleString`.
- **TR-3** External CDN dependency: `chart.js@4.4.7` via `https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js`. No other third-party libraries.
- **TR-4** Payoff simulation loop includes a hard safety cap of **720 months** (60 years) to prevent infinite loops when monthly payment cannot cover accruing interest.
- **TR-5** Existing Chart.js instance is destroyed before re-rendering to prevent canvas memory accumulation.
- **TR-6** Input validation: non-positive balance, non-positive APR, non-positive minimum, or empty name causes that row to be skipped silently; an alert fires only when zero valid rows remain after filtering.
- **TR-7** HTML output in `renderPayoffOrder` is constructed with string templates; user-supplied debt names are not injected into `innerHTML` directly — they are injected into text-only `<li>` content to avoid XSS.

## Non-Requirements

- No real account connections, OAuth flows, or third-party API calls.
- No persistent storage — session-only state.
- No server-side computation.
- No personalized financial, investment, or tax advice output.
- Does not model variable minimum payments (percentage-of-balance minimums used by some issuers).
