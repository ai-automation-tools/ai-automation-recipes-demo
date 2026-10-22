# Portfolio Fee Drag Report

**{{person.display_name}}** — {{report_period.label}} (holdings as of {{report_period.as_of_date}})
Generated {{generated_date}}

## Executive summary

| Metric | Value |
|---|---|
| Total invested balance | {{summary.total_balance_formatted}} |
| Portfolio-weighted average expense ratio | {{summary.current_weighted_er_formatted}} |
| Annual dollar cost in fees, current holdings | {{summary.current_annual_fee_formatted}} |
| Weighted expense ratio, low-cost index alternative | {{summary.alt_weighted_er_formatted}} |
| Annual dollar cost, low-cost index alternative | {{summary.alt_annual_fee_formatted}} |
| **Annual savings potential** | **{{summary.annual_savings_formatted}}** |
| Projected cost of the fee gap over 10 years | {{projection.ten_year_diff_formatted}} |
| Projected cost of the fee gap over 20 years | {{projection.twenty_year_diff_formatted}} |

{{executive_summary_note}}

## Holdings & annual fee cost

| Holding | Account | Category | Balance | Expense ratio | Annual fee cost |
|---|---|---|---:|---:|---:|
{{#each holdings}}
| {{this.name}} | {{this.account}} | {{this.category}} | {{this.balance_formatted}} | {{this.expense_ratio_formatted}} | {{this.annual_fee_formatted}} |
{{/each}}
| **Total** | | | **{{summary.total_balance_formatted}}** | **{{summary.current_weighted_er_formatted}}** | **{{summary.current_annual_fee_formatted}}** |

## Where the fee dollars are going

| Holding | Annual fee cost | |
|---|---:|---|
{{#each holdings_by_fee_desc}}
| {{this.name}} | {{this.annual_fee_formatted}} | {{this.bar}} |
{{/each}}

{{fee_distribution_note}}

## Low-cost index alternative comparison

Same market exposure, swapped for a comparable index fund in the same category. Category-level index expense ratios reflect typical total-market and total-international index fund pricing, and typical index bond/target-date fund pricing (see Sources) — not a specific fund recommendation.

| Category | Current (active) | Current ER | Alternative (index) | Alternative ER | Current annual cost | Alternative annual cost | Annual savings |
|---|---|---:|---|---:|---:|---:|---:|
{{#each category_comparison}}
| {{this.category}} | {{this.current_name}} | {{this.current_er_formatted}} | {{this.alt_name}} | {{this.alt_er_formatted}} | {{this.current_cost_formatted}} | {{this.alt_cost_formatted}} | {{this.savings_formatted}} |
{{/each}}
| **Total** | | | | | **{{summary.current_annual_fee_formatted}}** | **{{summary.alt_annual_fee_formatted}}** | **{{summary.annual_savings_formatted}}** |

{{category_comparison_note}}

## How the fee gap compounds

Expense ratios are charged as a percentage of assets every year, which means the dollar cost grows as the balance grows, and the gap between two fee levels compounds like a negative return. This report uses the same projection method the Department of Labor uses in its own 401(k) fee illustration: future value = balance × (1 + assumed return − expense ratio)^years (see Sources). The DOL's own worked example — a $25,000 balance, 35 years, 7% assumed return — shows a 1-percentage-point fee difference cutting the ending balance by 28% ($227,000 vs. $163,000).

Applying the same method to this {{summary.total_balance_formatted}} portfolio, assuming a flat {{projection.assumed_return_formatted}} nominal annual return and no further contributions or withdrawals (a simplification — real portfolios add money and returns vary year to year):

| Horizon | Value at current {{summary.current_weighted_er_formatted}} weighted fee | Value at {{summary.alt_weighted_er_formatted}} low-cost alternative | Difference | Share of the alternative's value lost to the fee gap |
|---|---:|---:|---:|---:|
| 10 years | {{projection.ten_year_current_formatted}} | {{projection.ten_year_alt_formatted}} | {{projection.ten_year_diff_formatted}} | {{projection.ten_year_pct_lost_formatted}} |
| 20 years | {{projection.twenty_year_current_formatted}} | {{projection.twenty_year_alt_formatted}} | {{projection.twenty_year_diff_formatted}} | {{projection.twenty_year_pct_lost_formatted}} |

{{projection_note}}

## How this portfolio compares to national averages

- This portfolio's actively managed holdings (everything except {{summary.index_holding_name}}) average **{{summary.active_only_weighted_er_formatted}}**, {{summary.active_vs_benchmark_note}} the {{benchmarks.benchmark_year}} U.S. asset-weighted average for actively managed equity funds of **{{benchmarks.active_equity_er_formatted}}** ({{benchmarks.active_equity_source_label}}).
- {{summary.index_holding_name}}'s {{summary.index_holding_er_formatted}} expense ratio is in line with the cheapest total-market index funds on the market — {{benchmarks.index_fund_examples}} (see Sources).
- Passive (index) funds broadly averaged an asset-weighted **{{benchmarks.passive_er_formatted}}** in {{benchmarks.benchmark_year}}, versus {{benchmarks.active_equity_er_formatted}} for active funds — a nearly {{benchmarks.active_to_passive_multiple}}x gap ({{benchmarks.active_equity_source_label}}).

## Methodology notes

- Expense ratio = the fund's annual operating cost as a percentage of assets, deducted automatically from the fund's daily net asset value. It never appears as a line-item charge, which is exactly why it's easy to lose track of (see Investopedia, Sources).
- Annual fee cost = balance × expense ratio, computed per holding then summed. This report doesn't account for sales loads, 12b-1 fees, or account-level advisory fees, which some of these fund types can carry in addition to the expense ratio.
- The compounding projection assumes a constant {{projection.assumed_return_formatted}} nominal return and no additional contributions or withdrawals, matching the DOL's own illustrative method — it is a simplification for comparing two fee levels, not a return forecast.
- A workplace 401(k) is usually limited to a fixed fund menu chosen by the plan administrator; swapping a 401(k) holding for a specific low-cost index fund may not be possible without a plan-specific fund-menu lookup, which this report doesn't have.
- Nothing in this report is a recommendation to buy, sell, or hold any specific security — it compares category-level pricing, not products.

## Sources

- [A Look at 401(k) Plan Fees — U.S. Department of Labor, EBSA](https://www.dol.gov/sites/dolgov/files/ebsa/about-ebsa/our-activities/resource-center/publications/401k-plan-fees.pdf) — the fee-drag worked example (7% return, 35 years, 1-point fee difference = 28% lower balance) that this report's compounding method mirrors.
- [How Fund Fees Are Evolving in the US — Morningstar](https://www.morningstar.com/business/insights/blog/funds/us-fund-fee-study) — {{benchmarks.benchmark_year}} U.S. Fund Fee Study: {{benchmarks.data_year}} asset-weighted average expense ratios ({{benchmarks.active_equity_er_formatted}} active U.S. equity funds, ~{{benchmarks.passive_er_formatted}} passive funds).
- [Mutual Fund and ETF Fees Remained Near Historic Lows in 2025 — Investment Company Institute](https://www.ici.org/news-release/mutual-fund-and-etf-fees-remained-near-historic-lows-in-2025) — {{benchmarks.data_year}} average expense ratios for index equity mutual funds (0.40%) and index bond mutual funds (0.36%).
- [Charles Schwab vs Fidelity vs Vanguard: Total Stock Market Index Funds Compare in July 2026 — Forbes](https://www.forbes.com/sites/investor-hub/article/charles-schwab-vs-fidelity-vs-vanguard-total-stock-market-funds/) — current total-market index fund expense ratios (Fidelity 0.015%, Vanguard 0.03%, Schwab 0.03%).
- [What Is the Expense Ratio of a Mutual Fund? — Financer](https://financer.com/invest/what-is-the-expense-ratio-of-mutual-fund/) — plain-language definition of how an expense ratio is charged.
