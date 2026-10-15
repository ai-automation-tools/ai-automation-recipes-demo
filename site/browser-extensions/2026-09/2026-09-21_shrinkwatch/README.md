# ShrinkWatch

> Same price, smaller box? You'll know, because your browser remembers what you saw last time.

**Date**: 2026-09-21
**Form factor**: Browser extension (Manifest V3)
**Browser surface**: content script, toolbar popup, `chrome.storage.local`
**Status**: Prototype

## What it is

ShrinkWatch sits quietly on Amazon product pages and reads the price and package size every time you visit one. If you come back later and the box is smaller but the price didn't move, it says so, right on the page, with the unit price spelled out. No account, no upload, no guessing whether the cereal box really did get thinner.

## Why it has to be an extension

A website can only ever show you what's on the page right now. It has no memory of what you looked at three weeks ago on a different visit, in a different tab, with no login involved. ShrinkWatch's whole premise depends on comparing today's package against a snapshot it saved locally the last time you were on that exact product page — that snapshot lives in `chrome.storage.local`, tied to your browser, not to Amazon's account system or anyone's server.

## Who it serves

Shoppers who buy the same brands on repeat and have started doing the mental math themselves: is this box actually smaller than last month, or does it just feel that way? A 2026 Capgemini Research Institute survey found 64% of consumers call shrinkflation "unfair" or "very unfair," and a UMass Amherst analysis of packaged food sizes found average reductions of 14.6% across the products it tracked. People are already suspicious. ShrinkWatch just gives them the receipt.

## Why it could be profitable

Free tier: track up to 8 products locally, no account required. Paid tier: unlimited tracking plus cross-device sync, so a size change you catch on your laptop shows up when you're back on your phone — that sync layer needs a real backend, which this prototype stubs out rather than builds. A subscription in the $2–4/month range is plausible if retention holds, though that's the part I can't verify from a prototype: shrinkflation anger is well documented, but whether people pay monthly for a tool that mostly confirms a suspicion they already had is a real open question, not a given. The honest comparison is to browser price-history tools like Camelizer and Keepa, which monetize a similar "I want to know if this changed since I last looked" itch and have stayed around for years.

## How to load it in Chrome

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder's `extension/` directory.
3. Visit any Amazon.com product page. The badge appears under the price on the first visit (just the unit price) and flags a shrink only once ShrinkWatch has a prior visit to compare against.

## How to try the demo

1. Open `index.html` in any modern browser. It loads `sample-data.json` over `fetch`, so serve the folder locally (e.g. `python3 -m http.server`) rather than opening it as a bare `file://` path, since some browsers block `fetch` on `file://`.
2. Click the **ShrinkWatch** button in the mock toolbar to open the popup.

The mock page simulates a return visit to a cereal box that shrank from 16 oz to 14 oz at the same price — the badge and popup both reflect that comparison. On the real extension, `content.js` does this comparison live against your actual browsing history; here, `script.js` recreates just that one comparison from the sample data, since there's no real page to read.

## Permissions, and why each one

| Permission | Why it's needed |
|:--|:--|
| `storage` | Saves each tracked product's price/size history locally so the next visit has something to compare against. |
| `activeTab` | Lets the popup identify the tab you're on and ask its content script for that page's current reading. |

## What's in this prototype

- A content script that parses title, price, and package size on Amazon product pages and computes a normalized unit price.
- Local, per-ASIN history (up to 6 snapshots) stored in `chrome.storage.local`, with shrink detection based on quantity down / price flat-or-up.
- An on-page badge showing the unit price, and the shrink comparison when one applies.
- A popup with an "on this page" card and a scrollable list of everything tracked, including a free-tier cap at 8 products with an upgrade prompt.
- A demo harness with 12 sample tracked products covering shrinks, plain price increases, and untouched products, so the popup has something to show beyond the live page.

## Roadmap

- Extend content-script matching to Walmart, Target, and Kroger product pages.
- Add a manual "compare this size against the one I'm looking at" mode for products Amazon lists under different ASINs per pack size.
- Build the cross-device sync backend the paid tier depends on.
- Let users export their tracked history as CSV.
- Surface a "better unit price nearby" suggestion when a tracked product's shrink pushes it above a same-aisle alternative.

## Sources

- [Shrinkflation isn't slowing down — it's just getting harder to spot](https://www.consumeraffairs.com/news/shrinkflation-isnt-slowing-down-its-just-getting-harder-to-spot-011326.html) — Capgemini's January 2026 finding that 64% of consumers call shrinkflation unfair, and how brands are disguising it with redesigns and formula tweaks instead of obvious size cuts.
- [Study reveals shrinking package sizes hide significant food inflation](https://phys.org/news/2026-01-reveals-package-sizes-significant-food.html) — the UMass Amherst analysis behind the 14.6% average package-size reduction figure.
