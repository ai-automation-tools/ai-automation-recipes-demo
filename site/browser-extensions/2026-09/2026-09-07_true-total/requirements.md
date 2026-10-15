# TrueTotal — Requirements

## Goals

- Detect the price a checkout flow first advertises and every fee added after that point, on ticket and short-term rental sites.
- Show the running total on the page itself, without requiring the user to open the popup.
- Give the user a breakdown they can act on: which line items were disclosed up front versus added later, and a way to export that as evidence.
- Keep the free tier genuinely useful on its own, so the paid tier is an upsell, not a paywall.

## Primary user

Someone actively buying event tickets or booking a short-term rental — mid-checkout, comparing what they were quoted against what they're now being asked to pay. They're not researching in the abstract; they're on the page, fees are appearing in real time, and they want the total to stop moving on them.

## Functional requirements

- FR1: The content script SHALL detect a base advertised price on ticketmaster.com and airbnb.com checkout pages using DOM heuristics (elements with "total"-like class/testid attributes).
- FR2: The content script SHALL detect fee line items by matching known fee keywords (service fee, facility fee, processing fee, etc.) against text near a currency amount.
- FR3: The content script SHALL mark each detected fee as `revealedAfterBase: true` if it was found after the base price was already known.
- FR4: The content script SHALL re-scan the page on DOM mutations, debounced to avoid excessive rescans.
- FR5: The content script SHALL inject a floating badge (via shadow DOM) showing the current running total and the percentage added in fees.
- FR6: The content script SHALL guard against double injection on the same page.
- FR7: The content script SHALL respond to a `TRUETOTAL_GET_STATE` runtime message with its current state.
- FR8: The content script SHALL persist the latest snapshot per site to `chrome.storage.local`.
- FR9: The popup SHALL query the active tab's content script for state when opened, and show a "not supported" message if no content script responds.
- FR10: The popup SHALL render the advertised price, each fee line item (flagging late-added ones), and the computed total.
- FR11: The popup SHALL let the user export the current breakdown as a downloadable evidence report referencing the FTC Junk Fees Rule.
- FR12: The popup SHALL preview locked "TrueTotal Plus" features without implementing them, and clicking the upgrade button SHALL make clear the tier isn't wired up in this build.
- FR13: Every `chrome.*` call in the popup SHALL be feature-detected so the same file runs unmodified in the demo harness.
- FR14: The demo harness SHALL simulate a multi-step checkout using `sample-data.json`, updating the same popup and a simulated badge as steps advance.

## User stories

- As a ticket buyer, I want to see the total price update as fees appear, so that I know before I pay whether the price has moved from what I was first shown.
- As a short-term rental guest, I want to know which charges were hidden until the last checkout step, so that I can decide whether to keep going or back out.
- As a user who wants to file a complaint, I want a plain-text report with dates and amounts, so that I don't have to reconstruct the checkout from memory or screenshots.
- As a privacy-conscious user, I want my checkout data to stay on my device, so that I don't have to trust a third-party server with my browsing.
- As a first-time user, I want the popup to tell me clearly when I'm not on a supported page, so that I don't think the extension is broken.
- As a returning user, I want my last snapshot for a site saved locally, so that a future version can show me whether prices crept up since my last visit.

## Extension surfaces

- Content script (ticketmaster.com, airbnb.com) — reads live checkout DOM, tracks state, injects the floating total badge.
- Toolbar popup — shows the current tab's breakdown, exports the evidence report, previews the paid tier.
- `chrome.storage.local` — persists the latest per-site snapshot for a future price-history feature.

## Non-functional requirements

- Privacy: all computation and storage stays on-device; nothing is transmitted anywhere.
- Permission minimalism: the manifest declares only permissions the code calls (`storage`); content script matches are scoped to named hosts, not `<all_urls>`.
- Performance: DOM rescans are debounced (400ms) so the mutation observer doesn't thrash on rapidly-changing checkout pages.
- Resilience: fee detection is heuristic and best-effort; a missed or misclassified fee should degrade to "not shown" rather than throwing an error.
- Accessibility: popup text meets standard contrast ratios against its backgrounds; interactive elements are native `<button>` elements.

## Out of scope (for the prototype)

- Real integration with StubHub, Vrbo, Booking.com, or any site beyond the two demonstrated.
- Any backend service, account system, or payment processing for TrueTotal Plus.
- Actual submission of a complaint to the FTC or a state attorney general — the export is a local file only.
- Cross-device sync of saved snapshots.

## Open questions

- Do Ticketmaster's and Airbnb's actual DOM structures match the class/testid heuristics used here closely enough to work without per-site adapters?
- Would users pay for price history and complaint export, or does the free badge alone satisfy most of the underlying frustration?
- Should the evidence report format follow a specific FTC or state AG complaint template rather than a generic plain-text summary?
