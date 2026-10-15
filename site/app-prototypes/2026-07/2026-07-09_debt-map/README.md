# DebtMap

> See exactly when you'll be debt-free — and how much you'll save by going faster.

**Date**: 2026-07-09
**Form factor**: web app
**Status**: Prototype

## What it is

DebtMap is an interactive debt payoff planner that lets you input all your debts, choose a payoff strategy, and instantly see a timeline to zero. It compares the Avalanche method (highest APR first, minimizes total interest) against the Snowball method (lowest balance first, maximizes psychological momentum), showing you the exact debt-free date and interest saved versus paying minimums only. Adjust your extra monthly payment with a single input and watch the chart and projections update in real time.

## Who it serves

Anyone carrying consumer debt — credit cards, student loans, auto loans, personal loans — who wants a clear, motivating picture of their path out. The primary persona is a 28–42-year-old professional with $20K–$80K in mixed debt who has tried budgeting apps but never visualized the actual payoff timeline. They feel stuck; DebtMap makes the finish line visible.

## Why it could be profitable

US household debt hit a record **$18.8 trillion in Q1 2026**, with credit card balances at **$1.252 trillion** and credit card delinquency rates at **13.1%** — a 16-year high. Record debt paired with high-interest-rate anxiety creates intense demand for tools that translate raw balances into actionable plans. The personal finance app market is projected to grow at 6.2% CAGR through 2033.

Monetization: freemium with a hard-to-miss upgrade moment — the free tier shows the payoff plan; the **$5.99/month Pro tier** unlocks PDF payoff schedules, push-alert milestones, custom debt priorities, and multi-scenario comparisons ("What if I got a raise of $400/month?"). A **B2B channel** exists via credit unions and nonprofit credit counselors who want a branded, embeddable version for their clients.

Sources:
- https://www.prnewswire.com/news-releases/us-consumer-debt-hits-18-19-trillion-in-q1-2026--302783707.html — US consumer debt $18.8T record
- https://protectborrowers.org/american-families-hit-record-levels-of-financial-distress-as-millions-fall-behind/ — delinquency crisis

## Form factor & scope

A single-page web app. The demo shows debt list management, a real-time stacked area chart, and a payoff schedule table. No login, no backend, no API keys — runs from `file://` or any static server.

## How to run it

1. Open `index.html` in any modern browser.
2. The sample debts load automatically. Adjust the **Extra Monthly Payment** field or toggle **Avalanche / Snowball** to see projections update live.
3. Click **+ Add a Debt** to add your own accounts.

## What's in this prototype

- **Debt list panel** — displays all debts with color-coded bars, balance, and APR; debts can be added or removed
- **Extra payment input** — adjustable dollar amount applied on top of minimums each month
- **Strategy toggle** — Avalanche vs Snowball with a live insight comparing months saved and interest saved between both methods
- **Three summary cards** — debt-free date, interest saved vs minimum-only, total debt balance
- **Stacked area chart** — remaining balance per debt over the payoff timeline (Chart.js)
- **Payoff schedule table** — per-account payoff date and estimated interest cost in the chosen strategy
- **Add Debt modal** — form to add any new debt account with name, type, balance, APR, and minimum payment

## Roadmap

- PDF/CSV export of the month-by-month payment schedule
- "What-if" scenario comparisons (raise, side-hustle income, windfall paydown)
- Push notifications for upcoming milestone payoffs
- Bank sync via Plaid to auto-populate current balances
- Budget integration showing how the extra payment fits your monthly spend
- Credit-score impact projections as utilization drops

## Sources

- https://www.prnewswire.com/news-releases/us-consumer-debt-hits-18-19-trillion-in-q1-2026--302783707.html — US consumer debt hit $18.8T record in Q1 2026
- https://protectborrowers.org/american-families-hit-record-levels-of-financial-distress-as-millions-fall-behind/ — credit card delinquency at 13.1%, 16-year high
- https://www.lendingtree.com/credit-cards/study/credit-card-debt-statistics/ — credit card debt statistics 2026
- https://techbullion.com/personal-finance-apps-in-the-us-in-2026-how-budgeting-saving-and-credit-building-tools-are-actually-used/ — personal finance app market 2026
