---
title: TapCheck
date: 2026-10-14
category: Browser Extension
form_factor: browser extension
monetization: freemium
tags: [privacy, ai-chat, extension-security]
status: idea
---

# TapCheck

> A browser extension that tells you, on the ChatGPT, Claude or Gemini page itself, when another extension is wiretapping your chat.

## Problem

Extensions that harvest AI chat histories have shipped through the Chrome Web Store, including one with a Featured badge. They hook the page's `fetch` and `XMLHttpRequest` to copy prompts and replies. Store reviews missed them, and users have no way to see what an extension is doing on a given page.

## Target user

Professionals who paste client documents, code or internal plans into AI chat in a personal browser profile, plus the small-team IT lead who cannot buy a full enterprise browser-security suite. Existing extension scanners rate an extension's permissions at install time. They do not watch runtime behavior on the chat page.

## MVP scope

- Runs a main-world content script on a short list of chat sites at document start, before other scripts, and snapshots `fetch`, `XMLHttpRequest` and `WebSocket` prototypes.
- Flags a page when those natives are wrapped after load, using function-source checks and prototype comparison, and shows a toolbar badge.
- Lists unexpected `chrome-extension://` resource loads and injected DOM nodes on the chat page, via `PerformanceObserver` and `MutationObserver`.
- Matches the extension ID to a local copy of the installed-extension list (`chrome.management`) and names the likely culprit with a one-click link to disable it.
- Keeps a local per-site log of detections. Nothing leaves the browser.
- Ships as MV3 for Chrome and Edge, with a Firefox build as the second target.

## Monetization

Freemium. Free: detection and badge on three chat sites. Pro at $4/mo or $36/yr: all chat sites and custom domains, detection history export, and a community-fed list of known-bad extension IDs. A later team tier at about $3 per seat per month adds a shared policy file.

## Why now

Microsoft reported on March 5, 2026 that malicious extensions posing as AI assistants harvested LLM chat histories, with activity across more than 20,000 enterprise tenants. Earlier coverage described an extension with about 8 million users that captured chats from several chatbots, and two impersonator extensions with roughly 900,000 users. This is a live, documented threat that existing blockers do not address.

## Risks & open questions

- Demand: most people do not think their AI chats are a target, and security tools sell poorly to individuals until they are hit. The free tier may never convert.
- Build: a harvester can wrap natives from an isolated world and read the DOM instead, which TapCheck cannot see. Detection covers only the fetch/XHR hooking pattern reported so far, and attackers can adapt once it ships.
- Build: hooks must run before any other extension's, and Chrome gives no ordering guarantee. A malicious script that loads first can hide its patch.
- Chat sites change their DOM and network layers often, so false positives from the sites' own wrappers will need tuning.
- Chrome Web Store policy on `management` permission and main-world injection needs a review check before building.

## Next step

Build a one-day proof of concept that flags a deliberately fetch-wrapping test extension on one chat site, then run a landing-page test.

## Sources

- https://www.microsoft.com/en-us/security/blog/2026/03/05/malicious-ai-assistant-extensions-harvest-llm-chat-histories/ — Microsoft's March 5, 2026 report on extensions harvesting LLM chat histories
- https://www.darkreading.com/endpoint-security/chrome-extension-harvests-ai-chatbot-data — extension with about 8M users harvesting chatbot data
- https://www.securityweek.com/chrome-extensions-with-900000-downloads-caught-stealing-ai-chats/ — impersonator extensions with 900,000 downloads stealing AI chats
