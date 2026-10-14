# Exit Ramp: requirements

## Goals
- Make the control that actually cancels a subscription obvious on the page where it lives.
- Name the retention patterns a user passes on the way, so they can recognise and skip them.
- Produce a timestamped, plain-text record of the cancellation that holds up in a chargeback or complaint.
- Do all of it locally, with the narrowest permissions that work.

## Primary user
An adult cancelling a consumer subscription (streaming, news, fitness, software) through a multi-screen web flow. They are probably irritated, may be on their second attempt, and may later need to prove they cancelled.

## Functional requirements
- FR1. On matched hosts, the content script scans links, buttons and short text blocks after load and classifies them as `exit`, `hidden`, `offer`, `shame`, `prechecked` or `done`.
- FR2. A clickable control whose text matches a cancel intent ("cancel membership", "continue to cancel", "yes, cancel") is `exit`. If it renders under 13px or below 0.7 opacity, it is `hidden`.
- FR3. Discounts, free months, pause and downgrade offers, and "keep my benefits" controls are `offer`.
- FR4. Loss-framing and confirmshaming copy ("you'll lose", "are you sure", "no thanks, I…") is `shame`.
- FR5. Checked checkboxes inside the scanned area are `prechecked`.
- FR6. Confirmation copy ("membership has been cancelled", "plan ends on", "confirmation number") is `done` and closes the journey with that text as the outcome.
- FR7. Each finding is marked in place with an outline and a short label, using `data-xr-*` attributes and one injected stylesheet with the `xr-` prefix.
- FR8. The script rescans 800 ms after DOM changes settle, so retention modals that load late are caught.
- FR9. Each scanned page with findings becomes a step in a per-host journey in `chrome.storage.local`. A rescan of the same URL replaces the last step and keeps its first timestamp.
- FR10. The popup requests a fresh scan from the active tab with `chrome.tabs.sendMessage`, then shows findings for this page, the journey so far, and a status line.
- FR11. **Copy evidence log** writes a plain-text log with UTC timestamps, URLs, titles, findings and outcome to the clipboard.
- FR12. **Clear this site** deletes the journey for the current host.
- FR13. The popup lists other hosts with a logged journey and their status.
- FR14. The script guards against double injection and makes no network requests.

## User stories
- As a subscriber, I want the real cancel link outlined so I don't have to hunt through the footer.
- As a subscriber, I want "Claim 50% off" labelled as an offer so I know it isn't the way out.
- As a subscriber, I want pre-ticked marketing boxes flagged before I submit.
- As someone charged after cancelling, I want a timestamped log of every screen I passed so I can send it to my bank.
- As a privacy-conscious user, I want the extension to run only on the account sites I chose.
- As a user, I want to clear a site's log once I no longer need it.
- As a consumer-advice volunteer, I want the same log format from everyone I help, so complaints are quicker to file.

## Extension surfaces
- Content script: scans and marks matched account pages, rescans on DOM change, writes journey steps to storage, answers `exitramp:scan` messages.
- Toolbar popup: shows current-page findings, the journey, status, copy and clear controls.
- `chrome.storage.local`: holds `state.journeys[host]` with `started`, `status`, `confirmation` and `steps[]`.
- `chrome.tabs`: `query` for the active tab and `sendMessage` to its content script. No `tabs` permission needed.

## Non-functional requirements
- Permission minimalism: `storage` plus content-script matches for named hosts only. No `<all_urls>`, `tabs`, `scripting` or `activeTab` until a feature needs them.
- MV3 only: no remote code, no `eval` or `new Function`, no CSP changes. Any future rule updates ship as JSON data.
- Privacy: logs stay in local storage. Step findings are capped at 8 per page and 120 characters per item, so whole pages are never stored.
- Host page safety: no layout-changing DOM insertion, only data attributes and a prefixed stylesheet. Marks are cleared before each rescan.
- Popup width 360px, keyboard reachable, visible focus, copy and clear feedback announced through a `role="status"` region.
- The popup code runs unchanged in the extension and in the demo harness, with every `chrome.*` call feature-detected.

## Out of scope
- Clicking through flows automatically on the user's behalf.
- Non-English detection.
- Mobile browsers.
- Filing complaints or chargebacks directly.
- Any server component in this prototype.

## Open questions
- Will strict page CSPs block the injected `<style>`? If they do, move to a manifest `css` file.
- How should users add sites? Optional host permissions per site seem right, but the prompt friction needs testing.
- Would banks and consumer agencies accept a plain-text log, or will screenshots be required for it to count?
- What false-positive rate will regex rules have on real account pages, and is per-site tuning needed from day one?
- Does a free tier with local-only logs leave enough reason to pay for Pro?
