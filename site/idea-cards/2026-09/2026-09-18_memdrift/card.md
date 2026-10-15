---
title: MemDrift
slug: memdrift
date: 2026-09-18
category: AI Tool / AI Automation Tool
form_factor: web app
monetization: B2B SaaS
tags: [agent-memory, ai-governance, memory-audit, llm-agents]
status: idea
cover_image_model: codex gpt-image-2
cover_image_prompt: "A luminous archive of translucent memory-crystal shards arranged on floating shelves; one shard is dim and faintly cracked while a brighter, sharper twin shard hovers beside it, a soft beam of light singling out the correct one. Modern editorial-tech illustration, soft gradients, clean vector-influenced shapes, subtle depth, in the style of Stripe or Linear marketing art. Palette: deep indigo, electric cyan, warm amber, soft off-white. Centered composition, 16:10 framing, subject slightly above center, generous negative space around the shelving for card-grid cropping. Quietly precise, contemplative mood. STRICT: no text, letters, words, numbers, captions, titles, labels, banners, credits, stat blocks, logos, watermarks, signatures, UI chrome, or borders anywhere in the image. No screenshots, app mockups, charts, or device frames. No people or recognizable faces."
---

# MemDrift

> Reads your AI agent's persistent memory store, finds the facts that contradict each other or went stale, and lets you roll one back before it steers a real conversation wrong.

## Problem

Claude Managed Agents, Google's Memory Bank, and Mem0 all now keep memory across sessions by default. None of them tell you when two saved facts disagree, or when a fact from March is still outranking a June correction because its embedding happens to be denser. A support agent that quotes an old shipping address, or a sales agent that repeats a discontinued price, fails silently: retrieval worked exactly as designed, it just retrieved the wrong version of the truth.

## Target user

An engineer running a Claude Managed Agents (or Mem0-backed) deployment in production, most likely support, sales-ops, or an internal tool, who turned on persistent memory for the accuracy gains and now has no visibility into what actually got stored. Today they find out about a bad memory when a customer complains about it.

## MVP scope

- Read-only connector to a memory store: Claude's `managed-agents-2026-04-01` memory API first, Mem0 export second.
- Pull memory entries on a schedule and diff each pull against the last one.
- Flag contradictions: two entries about the same subject with conflicting values, shown with both timestamps and originating sessions.
- Score staleness per entry, weighted by how often the agent actually retrieves it, not just how old it is.
- One-click resolution that calls the platform's own redact or rollback endpoint. MemDrift never writes to memory directly.
- Weekly digest by Slack or email: contradictions found, resolved, still open.

## Monetization

B2B SaaS, priced per connected memory store: free for one store under 5,000 entries, then plans starting around $49/month per store for teams running several agents. The billing unit is stores connected, not seats.

## Why now

Anthropic shipped persistent memory for Claude Managed Agents in public beta on April 23, 2026, with a redact/rollback API and a full audit log. On May 6 it added "Dreaming," a scheduled process that reviews sessions and rewrites memory between them, explicitly modeled on how sleep consolidates human memory. Neither flags a contradiction for a human to see; Dreaming merges duplicates, but it doesn't adjudicate between them. A survey published June 29, 2026 found the research and tooling around agent memory covers accumulation and retrieval far more than governance, recovery, or forgetting. A separate paper from May 7, 2026 tested whether agents can tell when their own stored memories are stale and found the best model topped out at 55.2% accuracy. On August 25, Anthropic extended topic-level memory editing to consumer Claude too, a sign the pressure to make memory visible and correctable isn't confined to the enterprise agent stack.

## Risks & open questions

- Demand risk: teams may not notice memory drift is a problem until it costs them a customer, and by then the ask is "why didn't you catch this," not "we'd like to buy a tool."
- Vendor risk: Anthropic's own memory API already exposes redact and rollback; a native contradiction detector would fold MemDrift's core feature into the platform for free.
- Competitive risk: agent-observability platforms could add memory-contradiction detection as one more panel instead of a dedicated product.
- Build risk: judging whether two free-text memory entries actually contradict is a fuzzy call for an LLM; too many false positives and the weekly digest becomes noise nobody reads.
- Scope risk: an MVP built against one vendor's API is only useful to teams on that stack until Mem0 and Memory Bank connectors exist.

## Next step

Promote to weekly prototype: build the read-only connector against a sandboxed Claude Managed Agents memory store and measure how often it correctly flags contradictions planted on purpose.

## Sources

- https://claude.com/blog/claude-managed-agents-memory — Anthropic's April 23, 2026 persistent memory beta, including the redact/rollback API and audit log.
- https://claude.com/blog/new-in-claude-managed-agents — the May 6, 2026 "Dreaming" memory-consolidation feature.
- https://arxiv.org/abs/2606.30306 — "Always-On Agents" survey (June 29, 2026) on the gap between memory accumulation/retrieval research and governance.
- https://arxiv.org/abs/2605.06527 — "STALE" paper (May 7, 2026) measuring how well agents detect their own stale memories (55.2% best-model accuracy).
- https://siliconangle.com/2026/08/25/anthropic-updates-claudes-memory-to-enhance-customization-and-protect-sensitive-topics/ — August 25, 2026 update extending topic-level memory editing to consumer Claude.
