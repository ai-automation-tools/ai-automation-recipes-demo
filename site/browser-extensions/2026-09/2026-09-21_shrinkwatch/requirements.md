# ShrinkWatch — Requirements

## Goals

- Detect when a product's package size drops between two visits to the same Amazon product page, without the price dropping to match.
- Compute and display a normalized unit price ($/oz, $/ct, $/fl oz, etc.) on every visit, not just when a shrink is detected.
- Keep a local, per-browser history of tracked products so the comparison works without an account or a server.
- Give the user a single popup view of what changed on the page they're on, plus everything else they've tracked.

## Primary user

A price-conscious grocery and household-goods shopper who buys the same handful of brands repeatedly on Amazon and suspects, correctly or not, that package sizes have quietly shrunk. They don't want to screenshot receipts or keep a spreadsheet; they want the browser to remember for them.

## Functional requirements

- FR1: The content script parses product title, price, and package size from the DOM on `amazon.com` product pages.
- FR2: The content script extracts a quantity and unit from the title or detail bullets using a size-pattern match (oz, fl oz, lb, ct, g, kg, ml, l).
- FR3: The extension computes unit price as price divided by quantity and rounds to four decimal places for storage, two for display.
- FR4: On each visit, the extension looks up the product's ASIN in local storage and compares the new quantity and price against the last stored record for that ASIN.
- FR5: A product is flagged as shrinkflation when quantity has decreased and price has stayed flat or increased, for the same unit.
- FR6: The extension injects a badge on the page showing the current unit price and, when applicable, the shrink and price-change percentages.
- FR7: The popup shows an "on this page" card for the active tab, built by messaging the content script.
- FR8: The popup shows a scrollable list of every tracked product with its current unit price and a shrink flag where applicable.
- FR9: Local storage caps history at the six most recent size/price snapshots per product.
- FR10: The free tier caps active tracking at 8 distinct products; once at the cap, new products display a live unit price but are not added to the tracked list.
- FR11: The popup shows an upgrade prompt once the free-tier cap is reached.
- FR12: The content script guards against double injection on pages that reload content dynamically.
- FR13: The demo harness renders the same popup markup, CSS, and JS as the real extension, sourcing its data from `sample-data.json` instead of `chrome.storage`/`chrome.tabs`.

## User stories

- As a shopper, I want to see a product's unit price on the page without doing the math myself, so that I can compare it to a different size or brand at a glance.
- As a repeat buyer, I want to be told when a package got smaller since my last visit, so that I don't have to remember what the box looked like three months ago.
- As a budget-conscious user, I want a free tier that still gives me real value, so that I can try the extension before deciding to pay for unlimited tracking.
- As a privacy-conscious user, I want my browsing and purchase history to stay on my device, so that I'm not creating a new account or sending my shopping habits to a server.
- As a first-time visitor, I want the popup to say clearly why nothing is flagged yet, so that I understand the extension needs a second visit to compare against.

## Extension surfaces

- Content script (`amazon.com` product pages) — parses product data, computes unit price, compares against stored history, injects the on-page badge.
- Toolbar popup — shows the current tab's product and the full tracked-product list; queries the active tab and messages the content script.
- `chrome.storage.local` — persists tracked-product history across sessions, the mechanism a plain website has no access to.

## Non-functional requirements

- Permissions are limited to `storage` and `activeTab`; no `<all_urls>`, no network requests, no remote code.
- The content script only touches DOM it explicitly targets, and scopes its injected styles under a `shrinkwatch-` class prefix to avoid clashing with the host page.
- All computation happens locally; the manifest declares no host permissions beyond the one content-script match.
- The popup must render a useful state even with zero tracked products and even when the active tab isn't an Amazon product page.
- History parsing must not throw on a page missing a title, price, or size string; the content script should exit quietly instead of injecting a broken badge.

## Out of scope (for the prototype)

- Retailers other than Amazon (Walmart, Target, Kroger, Instacart are listed as roadmap items).
- The paid tier's cross-device sync backend — the prototype notes where it would plug in but doesn't implement a server.
- Any UI for manually removing or editing a tracked product; the popup is read-only.
- Currency or locale handling beyond USD and the units already listed.

## Open questions

- Amazon's product-page DOM changes frequently; a production version would need a more resilient parsing strategy (structured data, multiple selector fallbacks) than the regex approach here.
- Whether "same ASIN, different pack configuration" (e.g., single unit vs. multi-pack) should be tracked as the same product or split out — the prototype treats each ASIN as one line, which can misfire if Amazon reuses an ASIN across pack sizes.
- What the actual cross-device sync backend would need to be, and how much it would cost to run at a subscriber base large enough to be worth the engineering.
