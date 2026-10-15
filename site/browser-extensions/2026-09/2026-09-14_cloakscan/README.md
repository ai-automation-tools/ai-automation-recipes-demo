# CloakScan

> Scans the page you're on for text hidden from view, so you know whether it was written for you or for the AI agent reading over your shoulder.

**Date**: 2026-09-14
**Form factor**: Browser extension (Manifest V3)
**Browser surface**: toolbar popup, on-demand content script (via `activeTab` + `scripting`)
**Status**: Prototype

## What it is

CloakScan checks whatever page you're currently viewing for text a person would never notice: white-on-white spans, elements shoved off-screen, font sizes rounded down to nothing, HTML comments, and zero-width characters spliced into ordinary sentences. Click the toolbar icon, click Scan, and it outlines each one directly on the page and lists what it found in plain language, not a jargon score.

## Why it has to be an extension

Every technique CloakScan looks for exploits the gap between what a browser renders and what a script or an AI agent reads off the raw DOM. Catching that gap means reading the fully computed styles and the complete HTML of the tab you're actually on, then drawing outlines and badges directly onto that page. A page has no reason to report its own hidden text, and a separate website you visit can't see another site's DOM at all — only a content script running inside the tab itself can do this.

## Who it serves

Anyone who now routinely hands a page to an AI agent or browsing assistant: asking Comet or Atlas to "check reviews and buy the best one," or pasting an article into a chatbot to summarize. The specific risk is text on the page telling that agent something different from what you'd tell it yourself, and doing so without your knowledge. This isn't hypothetical: Brave documented attackers hiding instructions in white-on-white text and HTML comments to make Comet fetch one-time passwords and access banking portals, and in March 2026 researchers disclosed a flaw ("ShadowPrompt") letting any website silently inject prompts into Anthropic's Claude Chrome extension.

## Why it could be profitable

Free tier: manual, per-tab scans — everything in this prototype. Paid tier ($3–5/month): scanning that runs automatically as you browse instead of waiting for a click, and scan history synced across devices. A further "pause the agent when this page scores high risk" feature is worth naming honestly as aspirational — today's agentic browsers don't expose a general hook that lets a third-party extension halt their action queue, so that piece depends on a browser API that doesn't exist yet. A second, maybe steadier, revenue line is B2B: content and marketing teams auditing their own pages before publish, in case a compromised CMS plugin or a user-generated comment section slipped hidden text past them.

The demand case rests on prompt injection being an active, unresolved threat rather than a theoretical one — OWASP's Top 10 for LLM Applications has ranked it the #1 risk for three years running as of its August 2026 edition, and named incidents (Comet, Claude's ShadowPrompt flaw, Brave's later screenshot-injection research) keep landing every few months. What's unproven is whether a consumer will pay for a scanner rather than just trusting the AI vendor to fix it — no comparable product has demonstrated that conversion yet, and every vendor involved has said publicly that prompt injection has no reliable fix.

## How to load it in Chrome

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder's `extension/` directory.
3. Visit any page, click the CloakScan icon in the toolbar, and click **Scan this page**. (This prototype ships without a custom icon, so Chrome shows its default puzzle-piece badge for the toolbar button.)

## How to try the demo

1. Open `index.html` directly in a browser — the sample article is embedded inline in the page, so it works straight from `file://` with no server.
2. Click the CloakScan icon in the mock toolbar, then click **Scan this page** in the popup.

The demo simulates content.js's on-page annotation step (`script.js` draws the outlines and badges onto the mock article, since there's no live tab for `chrome.scripting` to inject into). The popup's scan, summarize, and copy logic is the same `extension/popup.js` that ships in the real extension.

## Permissions, and why each one

| Permission | Why it's needed |
|:--|:--|
| `activeTab` | Lets the popup ask for the tab you're currently viewing, but only for the instant after you click the icon — no standing access to your browsing. |
| `scripting` | Injects `content.js` into that one tab, on that one click, to run the scan. |
| `storage` | Keeps the last scan result locally so reopening the popup on the same tab doesn't lose it. |

There's no `host_permissions` entry and no `<all_urls>`. CloakScan never touches a page until you click it there.

## What's in this prototype

- Six detection heuristics: color-matched text, off-screen positioning, shrunk-to-invisible sizing, aria-hidden elements carrying instruction-like phrasing, HTML comments, and zero-width Unicode characters.
- On-page outlining and numbered badges pointing at each finding, in the real extension.
- A "copy visible-only text" button that strips the flagged content so you can safely hand the rest to a chatbot.
- The last scan result kept per session via `chrome.storage.local`.
- A demo harness with a fabricated gear-review article carrying one planted example of each hidden-text technique.

## Roadmap

- Continuous background scanning as a paid tier
- Cross-device scan history sync
- A shareable "page hygiene" report link for the B2B audit use case
- A larger keyword/heuristic library built from real reported cases instead of a hand-written list
- A Firefox-compatible build

## Sources

- [Brave: Agentic Browser Security — Indirect Prompt Injection in Perplexity Comet](https://brave.com/blog/comet-prompt-injection/) — the white-on-white-text and HTML-comment attacks this extension is built to catch
- [The Hacker News: Claude Extension Flaw Enabled Zero-Click XSS Prompt Injection via Any Website](https://thehackernews.com/2026/03/claude-extension-flaw-enabled-zero.html) — the March 2026 "ShadowPrompt" disclosure
- [Brave: Unseeable Prompt Injections in Screenshots](https://brave.com/blog/unseeable-prompt-injections/) — follow-up research showing the problem spans multiple AI browsers, not just one
