# Exit Ramp

> Marks the real cancel button on a subscription page, labels the retention tricks around it, and keeps a timestamped log you can paste into a complaint.

**Date**: 2026-10-14
**Form factor**: Browser extension (Manifest V3)
**Browser surface**: content script, toolbar popup, `chrome.storage`, `chrome.tabs` messaging
**Status**: Prototype

## What it is
You open your account page to cancel something. Exit Ramp outlines the control that actually cancels, even when it's an 11px grey link in the footer. It also labels the discount offers, "pause instead" buttons, pre-ticked boxes and "are you sure? you'll lose everything" screens in between. Each page of the flow goes into a log with the time and URL, so if the charge keeps coming you have a record of what you clicked and what the site showed you.

## Why it has to be an extension
The cancel flow lives on the merchant's site, behind your login. A website can't see that page. An extension's content script can read it as it renders, mark elements in place, and notice when a retention modal shows up halfway through. The log also builds up across several page loads while you click through, which a copy-paste tool would miss.

## Who it serves
People cancelling a subscription that doesn't want to be cancelled: streaming, news, fitness and software plans with three or four screens between "Cancel" and "Cancelled". The first problem is finding the button. The second turns up a month later, when the card gets charged anyway and the support agent asks for proof you cancelled. Most people don't have any, because nobody screenshots a cancel flow.

## Why it could be profitable
Freemium. Highlighting and the plain-text log stay free. Pro would be about $3 a month or a $19 one-time unlock, with a PDF evidence export that includes page snapshots, a renewal-date reminder, and complaint templates for card chargebacks and consumer agencies. A second route is per-seat licensing to consumer-advice organisations and credit-union member services, whose staff walk people through cancellations.

The case rests on regulation that hasn't settled, and that cuts both ways. In the US, a federal appeals court vacated the FTC's 2024 click-to-cancel rule in July 2025. The FTC reopened work on its Negative Option Rule in 2026, and consumer groups filed comments in April asking that cancelling be as easy as signing up. In the EU, the Commission's Digital Fairness Act proposal is expected to target burdensome cancellations, and lawyers advising companies already point to DSA Article 25's ban on manipulative interface design. A strong rule could make Exit Ramp less needed, though a public log of which sites still ignore it might then become the product. I have no data on willingness to pay. The one solid signal is that cancellation friction keeps returning as a regulatory topic on both sides of the Atlantic.

## How to load it in Chrome
1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder's `extension/` directory.
3. Sign in to one of the two sites in the manifest (`myaccount.nytimes.com` or `account.adobe.com`) and open the subscription page. Marks appear on the page, and the toolbar popup shows what it found plus the steps logged so far. To try another site, add its account host to `content_scripts.matches` and reload the extension.

## How to try the demo
1. Open `index.html` in any modern browser.
2. Click the green **ER** button in the mock toolbar to open the popup.
3. On the fictional Streamly account page, find the outlined "Cancel membership" link in the footer and click it. Follow the green outlines through the offer page and the "Are you sure?" page until you reach the confirmation. The popup can stay open while you click, and the log grows with each page. At the end, click **Copy evidence log**.

The demo runs the real `content.js` scanner and the real popup against a mock page. Its storage is an in-memory copy of `sample-data.json`, and the logged history for three other sites is sample data.

## Permissions, and why each one
| Permission | Why it's needed |
|:--|:--|
| `storage` | Keeps the per-site cancellation log in `chrome.storage.local`, so steps survive page loads and browser restarts. |
| Content script on `myaccount.nytimes.com`, `account.adobe.com` | Reads and marks the account pages where cancellation happens. This is a starter list; it stays narrow on purpose. |

No `tabs`, `activeTab`, `scripting` or `<all_urls>`. The popup reaches the content script with `chrome.tabs.query` and `chrome.tabs.sendMessage`, which need no extra permission.

## What's in this prototype
- A content script that classifies controls and short text blocks into real exit, exit made hard to see (under 13px or faded), retention offer, pressure copy, pre-ticked box and cancellation confirmed. It marks each one on the page, rescans when the DOM changes, and appends a step to a per-host journey in `chrome.storage.local`.
- A popup showing what's on the current page, the steps so far, a status line, a **Copy evidence log** button (plain text with UTC timestamps) and a per-site clear.
- A harness in a mock browser window with a four-screen fictional cancel flow.

Stubbed or missing: per-site rules (detection is English-language regex only), page snapshots, the Pro tier, and any sync. Nothing leaves the browser. Pro would need a small backend for licensing and optional encrypted sync; this prototype has none.

## Roadmap
- Optional capture of each step with `chrome.tabs.captureVisibleTab`, added to the log, behind a per-site prompt.
- A host picker that requests one optional host permission at a time, so users can add sites without the extension asking for every page.
- Detection rules shipped as data (JSON, never code), with per-site overrides for known flows.
- A renewal-date reminder through `chrome.alarms`, so you can cancel before the next charge.
- PDF export and complaint templates (Pro).

## Sources
- https://nclnet.org/ncl-urges-ftc-to-revive-click-to-cancel-in-new-proceeding/ — National Consumers League, April 14, 2026: comments in the FTC's renewed Negative Option Rule proceeding after the 2024 rule was struck down.
- https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-quietly-reopens-click-to-cancel-rulemaking-in-response-to-petition — Kelley Drye, December 8, 2025: the FTC published a petition to reopen click-to-cancel rulemaking.
- https://www.heuking.de/en/news-events/newsletter-articles/detail/digital-fairness-act-implementation-obligations-companies-need-to-prepare-for.html — Heuking, August 5, 2026: the Digital Fairness Act's expected cancellation requirements and DSA Article 25.
- https://connectontech.bakermckenzie.com/?p=5861 — Baker McKenzie, February 26, 2026: consultation points to multi-step or confusing cancellations as a likely dark-pattern prohibition; proposal expected Q4 2026.
