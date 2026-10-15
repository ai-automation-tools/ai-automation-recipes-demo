# HumanMark

> Scan a draft for the phrasing that reads as AI before you publish it, then issue a certificate your audience can check.

**Date**: 2026-08-20
**Form factor**: web app
**Status**: Prototype

## What it is

HumanMark is a pre-publish scanner for creators and small brands. Paste a draft in and it flags the specific phrasing patterns that make writing read as AI-generated — promotional filler, vague "experts say" attributions, forced rule-of-three lists, and a handful of others — then scores the piece. Below a threshold, the piece can be issued a Human-Made certificate: a badge with an ID, a timestamp, and a public verification page a reader can check against.

## Who it serves

Solo creators, newsletter writers, and small marketing teams who've started hearing "this feels like AI" from their own audience and don't have a way to check a draft before it goes out, or to prove after the fact that a piece was actually theirs.

## Why it could be profitable

Freemium: a handful of free scans a month, then a subscription for unlimited scans, certificate issuance, and an embeddable badge widget. An agency tier adds seats and a client dashboard, since agencies are the ones fielding "did you use AI for this?" from their own clients.

The demand signal here is real but indirect. Consumer preference for AI-generated creator content dropped from 60% in 2023 to 26% now, and 55% of people say they're more likely to trust a brand that publishes human-generated content (getboldmarketing.com, citing 2025–2026 survey data). By Q4 2025, "more human-generated content" was the top thing consumers said they wanted from brands in 2026. High-profile misses — Coca-Cola's AI holiday ad, McDonald's Netherlands pulling its AI Christmas spot — show what happens when a brand gets caught on the wrong side of that shift.

What's less proven is that creators want a *badge* for it specifically. The AI-detection tools that already have paying customers — Channel Factory's AI Slop Detection, DoubleVerify's AI SlopStopper — sell to media buyers and ad platforms, not to the people writing the content. Nobody's shown yet that a solo creator will pay for a certificate the way a Fortune 500 ad buyer pays for a compliance report. That's the open bet this prototype is testing, not a settled one.

## Form factor & scope

Single-page web app. This prototype demonstrates the scan-score-certify-verify loop end to end, running entirely client-side against a small pattern library and a mock certificate registry — no real AI-detection model, no server, no accounts.

## How to run it

1. Open `index.html` in any modern browser.
2. Paste a draft into the scanner (or click "Load a sample draft") and click **Scan for AI tells**.
3. Review the flagged phrases, then click **Issue Human-Made Certificate** if the score clears the threshold.
4. Switch to the **Certificates** tab to see previously issued badges, or paste a certificate ID into the verify box to check one.

## What's in this prototype

- A pattern-matching scanner covering seven AI-tell categories (promotional language, vague attribution, rule-of-three padding, inflated significance, filler/hedging, negative parallelism, em dash overuse), each with inline highlighting on the draft text.
- A 0–100 AI-tell score with a pass/fail certification threshold.
- A certificate registry seeded with 12 sample brands and past scores, browsable and sortable.
- A certificate verification lookup by ID, returning issuer, score, and issue date.
- A copyable embed snippet for a passing certificate.

## Roadmap

- Swap the regex pattern library for a real classifier trained on labeled AI/human text pairs.
- Real accounts, real badge hosting, and a public verification URL instead of a client-side lookup.
- Version history per piece, so a certificate can point to the actual edit trail instead of a single snapshot.
- Slack/CMS integrations so the scan runs where drafts already live (Google Docs, WordPress, Ghost).
- Team plans with per-seat scan quotas and a shared brand style guide the scanner checks against.

## Sources

- [Human-Made is the New Premium](https://getboldmarketing.com/human-made-is-the-new-premium/) — consumer preference stats (60%→26% AI-content preference drop, 55% trust-human-content figure, Q4 2025 "more human content" demand data)
- [The AI Marketing Backlash: Why 'AI-First' Brands Are Starting to Fall Flat](https://www.breef.com/breefingroom/articles/the-ai-marketing-backlash-why-ai-first-brands-are-starting-to-fall-flat) — Coca-Cola, McDonald's Netherlands examples and research on how labeling content as AI-generated reduces perceived authenticity
- [Channel Factory Announces the Launch of AI Slop Detection](https://www.martechcube.com/channel-factory-announces-the-launch-of-ai-slop-detection/) — existing paid AI-slop detection product, sold to media buyers rather than creators
