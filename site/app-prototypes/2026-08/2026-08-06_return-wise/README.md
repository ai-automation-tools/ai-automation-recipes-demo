# ReturnWise

> See what a return actually costs before you buy, or before the window closes on something you already own.

**Date**: 2026-08-06
**Form factor**: web app
**Status**: Prototype

## What it is

ReturnWise is a return-cost calculator and deadline tracker for online shoppers. Pick a retailer, an item price, and how you're sending it back, and it shows the refund you'll actually receive after mail fees and restocking charges, not the sticker price. A second view tracks purchases against each retailer's return window so nothing expires quietly in a drawer.

## Who it serves

Online shoppers who've been burned by a return costing more than they expected: someone who mailed back a coat and got $20 less than the tag said, or missed a 15-day electronics window because nothing reminded them. It's aimed at people who buy from several retailers with different, unposted rules, not any single store's loyal customer.

## Why it could be profitable

The free tier is the calculator and tracker; a paid tier ($3–5/month) would add a browser extension that flags return costs automatically at checkout and pushes deadline reminders, plus affiliate links to the retailers with the friendliest policies when a comparison surfaces one. A retailer-facing angle is plausible too: license the return-cost API to comparison-shopping and browser-agent tools that need to factor total cost of ownership into a recommendation, not just price.

The trend is real: 75% of retailers now charge some kind of return fee, and specific charges have gotten steep enough to notice. Marshalls and TJ Maxx take $11.99 off a mailed refund, Best Buy keeps 15% of an opened electronics return, Dillard's stacks a $9.95 label fee on top of a 10% restocking charge. Whether shoppers will pay a subscription to avoid a $10 surprise is the open question. The free calculator has to prove people actually check before they buy, or before they mail something back, before a paid tier is worth building.

## Form factor & scope

Lives as a web app today; the natural next surface is a browser extension that reads the retailer at checkout and shows the same math inline. This prototype demonstrates the calculator and the deadline tracker on a hand-curated set of 14 retailers, enough to compare, not a live policy feed.

## How to run it

1. Open `index.html` in any modern browser.
2. On the **Cost calculator** tab, pick a retailer, enter a price, toggle "opened," and switch between mail and in-store to see the refund change.
3. Switch to **My returns** to see four sample purchases sorted by how many days are left in their return window, color-coded by urgency. Click "+ Track a purchase" to add your own.
4. Switch to **Compare retailers** to see which of the 14 sample retailers keep the most of a $100 refund on a mailed, opened return.

## What's in this prototype

- A return-cost calculator covering flat mail fees, percentage restocking fees, and opened-vs-unopened conditions, sourced from real 2025–2026 retailer policies.
- A return-deadline tracker with four seeded purchases, urgency color-coding, an add-purchase dialog, and a remove action.
- A retailer comparison view ranking all 14 sample retailers by fee on an identical $100 return.
- `sample-data.json` with policy details (fee type, amount, condition, return window, loyalty waivers) for 14 major retailers plus four tracked sample purchases.

## Roadmap

- Browser extension that detects the retailer at checkout and shows the same calculation inline.
- Real policy data via a maintained feed instead of a hand-curated sample, since retailers change fees without much notice.
- Push/email reminders a few days before a tracked return's deadline.
- Photo-based receipt import so tracked purchases don't have to be entered by hand.
- A "worth it" flag comparing return cost against the price difference at a competing retailer.

## Sources

- [Which retail stores are now charging fees for returns? About 75% of them. — KGUN9](https://www.kgun9.com/news/local-news/which-retail-stores-are-now-charging-fees-for-returns-about-75-of-them) — the 75%-of-retailers stat and specific fee amounts for Marshalls, TJ Maxx, Macy's, JCPenney, J.Crew, Dillard's, Urban Outfitters, and Best Buy.
- [What Is a Restocking Fee? A 2026 Guide for Ecommerce Brands — Redo](https://redo.com/blogs/what-is-restocking-fee) — typical restocking fee ranges by category and the per-return processing cost retailers are trying to recover.
- [The Top 12 Customer Pain Points Costing You Money in 2026 — Chargebacks911](https://chargebacks911.com/customer-pain-points/) — complex return policies and restocking fees named as a purchase-anxiety driver.
