---
title: HireGuard
slug: hire-guard
date: 2026-08-04
category: Browser Extension
form_factor: browser extension
monetization: freemium
tags: [job-scams, ai-security, browser-extension, career, consumer-protection]
status: idea
cover_image_model: codex gpt-image-2
cover_image_prompt: "A stylised handshake centered in frame: one hand rendered in warm, solid gradients representing a real person, meeting a second hand composed of fractured, glitching pixels of light that dissolve into scattered fragments at the fingertips, representing an AI-generated impostor. Modern editorial-tech illustration, soft gradients, clean vector-influenced shapes, subtle depth. Color palette: deep indigo, electric violet, warm amber for the human hand, soft off-white background. Centered composition, 16:10 framing, ample negative space above and below the handshake, soft directional lighting from the upper left, quietly unsettling mood beneath a clean surface. STRICT: no text, letters, words, numbers, captions, titles, labels, banners, credits, stat blocks, logos, watermarks, signatures, UI chrome, or borders anywhere in the image. No screenshots, app mockups, charts, or device frames. No real people or recognizable faces, no full human figures — stylised hand shapes only, subordinate to the composition."
---

# HireGuard

> A browser extension that reads your LinkedIn DMs, Indeed messages, and recruiter emails as they arrive and flags the specific patterns of AI-run job scams before you hand over an SSN or a WhatsApp number.

## Problem

Recruiter scams used to be easy to spot: bad grammar, a Gmail address pretending to be a Fortune 500 HR department, a "$45/hour, no experience needed" subject line. That's gone. Scammers now feed a candidate's own LinkedIn profile into an LLM and get back outreach that quotes real job titles, real former employers, and a plausible "confidential opportunity" pitch, then move the conversation to WhatsApp or Telegram once trust is built. Some go further and stage a live video interview using face-swapped footage and stolen credentials to interview a fake candidate, or a fabricated recruiter to interview a real one. A job seeker fielding a dozen cold DMs a week has no way to check any of this in the moment the message lands.

## Target user

A mid-career professional actively job hunting in the 2026 layoff-heavy market, applying across LinkedIn, Indeed, and email, and fielding several unsolicited "recruiter" messages a week with no time to manually vet each one against a checklist. They're not naive; they're just outnumbered. The job is to get a read on a message in the five seconds after it arrives, not after they've already given up an address or a bank routing number.

## MVP scope

- Content script on LinkedIn messaging, Indeed, ZipRecruiter, and Gmail/Outlook web that scans incoming recruiter messages against known scam patterns as they load.
- Off-platform pivot detector: flags the first mention of WhatsApp, Telegram, or Signal paired with urgency language like "confidential," "act fast," or "equipment stipend."
- Domain cross-check: compares the sender's email or message domain against the company's official careers-page domain, and flags mismatches or domains registered in the last 90 days via a WHOIS lookup.
- Company-site fingerprint: flags careers pages built from AI boilerplate, including stock photography that reverse-image-searches to public marketing libraries and generic placeholder copy with no specific role detail.
- Inline risk badge on the message thread with a one-click breakdown of which signals fired.
- Manual paste-and-check mode for postings or messages copied from a site the extension doesn't run on natively.

## Monetization

Freemium. Free tier covers pattern-matching flags on LinkedIn and email, capped at 25 checks a month. $6.99/mo unlocks unlimited checks, the domain and WHOIS verification, and, as a later add-on rather than MVP, deepfake artifact flagging (lip-sync delay, frame inconsistency) during browser-based interview calls on Zoom or Meet's web clients.

## Why now

The scam has changed shape faster than the advice around it. Reporting collected in an April 30, 2026 roundup documents AI-personalized outreach that quotes a candidate's real work history verbatim, plus the WhatsApp/Telegram escalation pattern and deepfake interview cases using stolen credentials and manipulated video. A red-flag guide updated in July 2026 adds two more AI-era tells: deepfake video interviews and careers pages built from AI-generated boilerplate. The existing tooling in this space, JobScamScore among them, works by pasting a posting in for a one-time check. HireGuard's bet is that the scam happens inside a DM thread in real time, so the check should live there too, not in a separate tab you have to remember to open.

## Risks & open questions

- Will someone mid-job-search pay a monthly subscription for this, or expect it bundled free into a job board they already use?
- False positives are the real engineering problem: plenty of legitimate small-company recruiters email from a personal Gmail address that won't match any careers-page domain, and crying wolf on real opportunities kills trust in the tool fast.
- WHOIS and domain-age data isn't free at volume — the free tier's unit economics depend on finding a lookup provider cheap enough to not lose money on casual users.
- Deepfake video-call detection is a much heavier lift than the text and domain heuristics and realistically ships well after MVP, if at all, as a solo build.
- The extension is blind to scams that never leave LinkedIn's native messaging: no off-platform pivot means the strongest single heuristic never fires.

## Next step

Interview 5 people currently job hunting about how many "confidential opportunity" DMs they get per week and whether they'd install an extension for this before validating anything else.

## Sources

- https://markanthonydyson.substack.com/p/ai-fake-recruiters-task-scams-and — Guardian-sourced reporting (published 2026-04-30) on AI-personalized recruiter outreach, WhatsApp/Telegram pivots, and deepfake interview scams.
- https://jobscamscore.com/guides/job-scam-red-flags — Red-flag guide (updated July 2026) documenting deepfake video interviews and AI-generated boilerplate careers pages as 2026-specific scam tells.
