# TrueTotal

> Watches ticket and short-term rental checkouts and keeps a running total as fees get added after the price you were first shown.

**Date**: 2026-09-07
**Form factor**: Browser extension (Manifest V3)
**Browser surface**: content script (ticketmaster.com, airbnb.com), toolbar popup, `chrome.storage`
**Status**: Prototype

## What it is

TrueTotal sits on ticket and short-term rental checkout pages and tracks two numbers as you click through: the price you were shown when you landed, and the price you're actually about to pay. A badge in the corner of the page updates with every fee that shows up along the way, and the popup breaks down exactly which line items were added after the fact.

## Why it has to be an extension

The gap between an advertised price and a checkout total only exists inside a live checkout flow — service fees, facility fees, and cleaning fees get revealed step by step as you select seats, pick a delivery method, or confirm dates, and they're gone the moment you land on a receipt page. A companion site can't see any of that; it would need you to paste in numbers by hand, by which point the whole point of catching the bait-and-switch in real time is lost. A content script watching the live DOM as it changes is the only way to catch a fee before checkout is over.

## Who it serves

Anyone buying event tickets or booking a short-term rental who's tired of a $79 seat turning into $118 by the payment screen. It's aimed at the same person who already screenshots a checkout page before hitting "buy" to prove what they saw — TrueTotal just does that automatically and keeps the receipt.

## Why it could be profitable

The free tier is the badge and the per-page breakdown — useful on its own, and it's what gets someone to install the thing. The paid tier, TrueTotal Plus ($4.99/mo), is where the money is: price history across visits to the same listing, alerts when a saved listing's fees change, and a one-click complaint export formatted for the FTC or a state attorney general.

The regulatory timing helps make the case. The FTC's Junk Fees Rule took effect May 12, 2025 and requires the total price to be displayed more prominently than any other pricing information for live-event tickets and short-term lodging — the exact two categories this extension targets. State attorneys general are still actively enforcing the underlying deceptive-pricing standard in 2026, and civil penalties can run over $51,000 per violation, which is real leverage for a user who wants a complaint taken seriously. I'd call the demand real but unproven at scale, though: nobody's shown that "here's your evidence report" actually converts browsing into paid subscriptions, and that's the open question before building past this prototype.

## How to load it in Chrome

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder's `extension/` directory.
3. Visit a Ticketmaster or Airbnb page with a price shown, then start a checkout — TrueTotal only has line items to report once fee text actually appears on the page. Click the toolbar icon to see the breakdown.

## How to try the demo

1. Open `index.html` in any modern browser — no server required, everything loads from a local JSON file.
2. Click **Next step →** in the mock checkout to reveal the ticket price and each fee in turn, watching the corner badge update live.
3. Click the toolbar icon to open the popup and see the same breakdown, plus the export button.

The demo simulates the content script's page-reading and badge injection directly in JavaScript, since there's no real Ticketmaster or Airbnb page to attach to — `script.js` says exactly where it's standing in.

## Permissions, and why each one

| Permission | Why it's needed |
|:--|:--|
| `storage` | Saves the latest price snapshot per site locally, the foundation for the Plus price-history feature. Nothing leaves the device. |

`content_scripts` matches are scoped to `ticketmaster.com` and `airbnb.com` — the two sites this prototype targets, standing in for the two categories the Junk Fees Rule actually covers (live-event tickets, short-term lodging). A production version would add StubHub, Vrbo, and Booking.com the same way.

## What's in this prototype

- A content script that reads live checkout DOM for a base price and known fee labels, tracks which fees were revealed after the base price, and injects a shadow-DOM badge showing the running total
- A popup that pulls the current tab's checkout state, shows the full breakdown, flags every late-added fee, and exports a plain-text evidence report citing the Junk Fees Rule
- Local storage of the latest snapshot per site (read by nothing yet — it's there for the history feature below)
- A locked "TrueTotal Plus" section in the popup previewing price history, complaint export, and fee-change alerts, none of which are wired up in this build

## Roadmap

- Price-history charting per listing, built on the snapshots already being saved
- Per-site fee-line adapters, since the current keyword-and-price-proximity heuristic will miss sites with unusual markup
- A hosted backend for TrueTotal Plus subscriptions and cross-device sync
- StubHub, Vrbo, and Booking.com support
- A structured, downloadable PDF version of the evidence report

## Sources

- [FTC Finalizes "Junk Fees" Rule: New Pricing Disclosure Requirements Take Effect May 12, 2025](https://natlawreview.com/article/ftc-finalizes-junk-fees-rule-new-pricing-disclosure-requirements-take-effect-may-12) — confirms the total-price requirement and its scope (live-event tickets, short-term lodging)
- [State Attorneys General and Continued Enforcement Against "Junk Fees" in 2026](https://www.regulatoryoversight.com/2026/04/state-attorneys-general-and-continued-enforcement-against-junk-fees-in-2026/) — confirms state-level enforcement is still active in 2026 even after federal rule challenges
