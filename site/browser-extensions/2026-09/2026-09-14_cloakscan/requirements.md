# CloakScan — Requirements

## Goals

- Detect the common ways a web page hides text from a human reader while leaving it readable to a script or an AI agent.
- Surface findings on the page itself, not just in a popup list, so the user can see exactly where the hidden content sits.
- Give the user a way to extract only the human-visible text of a page, for safely pasting into a chatbot.
- Request the minimum permissions the detection actually needs — no standing access to browsing history or page content.

## Primary user

Someone who hands pages to an AI browsing agent (Comet, Atlas, Gemini-in-Chrome) or copy-pastes page content into a chatbot for summarizing, comparing, or acting on their behalf. They are not a security researcher; they want a plain answer to "is there something on this page trying to steer whatever's reading it," triggered on demand rather than running continuously in the background.

## Functional requirements

- FR1: The toolbar popup has a single primary control: a "Scan this page" button.
- FR2: On click, the extension injects a scan into the active tab using `activeTab` + `scripting`, with no persistent content script and no `host_permissions`.
- FR3: The scan detects text where the computed foreground and background colors are within a near-zero contrast ratio.
- FR4: The scan detects text in elements positioned off-screen via absolute or fixed positioning.
- FR5: The scan detects text in elements shrunk to 1px font size, or to a 1x1px box with overflow hidden.
- FR6: The scan detects elements marked `aria-hidden="true"` whose text matches a list of instruction-like phrases.
- FR7: The scan detects HTML comments whose content matches the same instruction-like phrase list.
- FR8: The scan detects zero-width Unicode characters (U+200B, U+200C, U+200D, U+FEFF, U+2060) embedded in visible text.
- FR9: Each finding records a type, a confidence level, and a short snippet of the flagged text.
- FR10: The extension outlines each flagged element on the live page and labels it with a numbered badge.
- FR11: Re-running a scan on the same tab clears the previous run's outlines and badges before drawing new ones.
- FR12: The popup lists every finding with a human-readable label and its snippet.
- FR13: The popup offers a "copy visible-only text" action that reconstructs the page's text with all flagged content excluded.
- FR14: The last scan result for the current tab persists in `chrome.storage.local` so reopening the popup doesn't lose it.
- FR15: The popup works identically, using the same markup, styles, and script, whether it's the real `extension/popup.html` or the demo harness's embedded copy.

## User stories

- As someone about to ask an AI agent to summarize a page, I want to check it for hidden instructions first, so I know the agent is acting on what I read, not on something planted for it.
- As someone who just had a chatbot give a suspiciously confident answer about a product, I want to see if the source page had text steering that answer, so I can tell whether to trust it.
- As a user of an AI browsing agent, I want to know before granting it a task whether the current page is trying to manipulate it, so I can cancel before it acts.
- As a privacy-conscious user, I want the extension to run only when I click it, so I'm not trading "protect me from hidden text" for "read everything I browse."
- As someone who wants to paste an article into a chatbot myself, I want a clean, hidden-text-free copy of the visible content, so I'm not accidentally pasting an injected instruction along with it.

## Extension surfaces

- Toolbar popup (`action.default_popup`) — the only UI; hosts the scan button, findings list, and copy-clean-text control.
- On-demand content script (`chrome.scripting.executeScript`, `content.js`) — runs the detection and page annotation inside the active tab, invoked from the popup rather than declared as a persistent content script.
- `chrome.storage.local` — persists the most recent scan result.

## Non-functional requirements

- No `host_permissions` or `<all_urls>` — every scan requires an explicit user click via `activeTab`.
- Detection runs client-side only; no page content is ever sent to a server.
- The popup renders correctly at the 360px width used in this prototype, without horizontal scrolling.
- A scan on a typical article-length page completes without a visible delay (under roughly one second).
- The heuristics err toward flagging borderline cases rather than missing an actual hidden-text pattern, since a false positive costs a glance and a false negative costs the whole point of the tool.

## Out of scope (for the prototype)

- Continuous, always-on scanning as you browse (the paid-tier idea in the README).
- Any mechanism to actually pause or intercept an AI browsing agent's actions — no such hook exists in any shipped agentic browser today.
- Cross-device sync of scan history.
- Detection of prompt injection delivered through images, audio, or PDF content rather than page text.
- A custom extension icon; this prototype ships with Chrome's default toolbar badge.

## Open questions

- Which instruction-like phrases produce the fewest false positives on ordinary marketing or legal boilerplate, which also uses phrases like "do not" and "as a reminder"?
- Should the color-contrast and off-screen heuristics have adjustable sensitivity, given legitimate accessibility patterns (skip links, visually-hidden labels) can resemble the attack patterns being flagged?
- Is there a monetizable version of the B2B "publish hygiene" audit that doesn't require the extension to also work as a crawler, which is a different product?
