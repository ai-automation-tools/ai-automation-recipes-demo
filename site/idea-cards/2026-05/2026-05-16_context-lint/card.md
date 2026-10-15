---
title: ContextLint
slug: context-lint
date: 2026-05-16
category: AI Tool / AI Automation Tool
form_factor: CLI
monetization: freemium
tags: [ai-agents, devtools, context-rot, llm-ops, claude-code, cursor, aider, codex, observability]
status: idea
---

# ContextLint

> A live "rot meter" for AI coding agents — wraps Claude Code, Cursor, Aider, and Codex CLI, scores every context window for stale file re-reads, dead tool calls, and abandoned plans, and surgically prunes the worst spans **before** the next model call instead of waiting for an emergency compaction.

## Problem

Chroma's May 2026 context-rot study put numbers on a thing every long-running-agent user already felt: across 18 frontier models (GPT-4.1, Claude 4, Gemini 2.5, Qwen3 and friends), output quality degrades monotonically as input length grows — and the U-shaped attention curve flips into pure recency bias once the context passes ~50% full. For coding agents this is the *primary* failure mode: an agent on a 4-hour refactor accumulates noise from search, exploration, and backtracking, and that noise quietly poisons every subsequent decision. The current defenses are all opaque and lossy — Anthropic's first-party compaction API, Claude Code's "Auto-Dream Memory" background pruner, Cursor's silent internal truncation from 200K down to a usable 70K–120K — and once a session has been compacted twice, even the vendors are now shipping warnings like *"Long sessions with multiple compressions may cause accuracy loss."* Devs have spend dashboards. They have no quality dashboard.

## Target user

Indie devs and small AI-engineering teams running long-horizon coding agents — Claude Code on the new 1M Opus 4.6 window, Cursor 3 in agent mode, Aider on multi-file migrations, OpenAI Codex CLI on overnight cleanup runs. The Active Optimizer here is someone who has already eaten one "the agent got dumber an hour in and made the wrong call" incident and now wants the same observability for *context quality* that they already have for token spend. Secondary persona: AI-eng leads running internal agent fleets who need to prove to a skeptical CTO that their agent's degradation is bounded.

## MVP scope

- Sidecar CLI that wraps a supported agent (Claude Code, Cursor agent, Aider, Codex CLI) by spawning it as a subprocess and tee-ing its model traffic through a local proxy.
- Per-message **rot score** combining four signals: token age × position-in-window × redundancy (Levenshtein/embedding hash of prior content) × error/abort density of nearby tool calls.
- Real-time TUI dashboard: a single rot meter + a per-span heatmap so the user can see *which* file reads, tool outputs, and reasoning blocks are dragging quality down.
- Three pruning actions, all reversible: **drop** (remove span entirely), **dedupe** (replace earlier copy of a re-read file with a stub pointing to the latest), **summarize** (one-line LLM summary replacing the original span).
- Manual mode (suggests, waits for keypress) and auto mode (applies at a user-set threshold, logs every decision).
- Local SQLite timeline so post-mortem analysis can correlate quality dips with task failures.

## Monetization

Freemium. Free CLI for solo devs — full rot meter, manual pruning, single-machine SQLite. Paid tier ($12/dev/mo) unlocks: cross-session quality history with team dashboards, a community rules library ("when Aider re-reads `package.json` 3+ times, dedupe"), Slack/Discord alerts when a long-running agent's rot score crosses threshold, and CI hooks for the agent-driven test-and-fix pattern. Enterprise tier for fleets with SOC2, SSO, and the export pipeline finance teams want for AI ops reporting.

## Why now

Context rot graduated from anecdote to benchmark in the last 30 days — Chroma's 18-model study put a number on the U-shaped attention curve and the >50%-full inflection point, and Fiddler's reliability work now pegs production AI-agent failure rates at 70–95%, with industry analyses attributing roughly 65% of those failures to context drift and memory loss rather than raw context exhaustion. At the same time, Anthropic shipped its compaction API on Claude, Bedrock, Vertex, and Foundry, Claude Code rolled out Auto-Dream Memory in March, and Cursor 3 launched its agent-first interface in April — three opaque, vendor-controlled mechanisms with no shared instrumentation surface. The result: every long-running-agent user is now running on a quality-degrading stack with no visibility, and the first tool to give them a meter and a scalpel wins the niche before the providers paper over it.

## Risks & open questions

- Provider lock-in: Cursor and Claude Code do compaction inside their own boundaries; intercepting their actual model calls may require running them against a configurable endpoint (DIY proxy) or a future hook API neither vendor has committed to.
- The rot score is a heuristic — it needs validation against real task-success deltas across several agents and tasks before users will trust auto-prune.
- Surgical pruning can remove load-bearing context (a `CLAUDE.md` snippet that *looks* stale but is the only place a constraint is stated); the undo path and per-pattern allowlists have to be airtight.
- First-party compaction (Anthropic's compaction API, Claude Code's Auto-Dream Memory) is the obvious competitor and is improving fast; the durable moat is *observability and control*, not the pruning algorithm itself.
- Privacy: any tool that proxies model traffic sees source code in flight — local-first is non-negotiable and the marketing has to lead with it.

## Next step

Promote to a weekly prototype: build a runnable harness that replays a captured Claude Code transcript through the rot meter and the TUI, and pair it with a 100-task agent benchmark comparing task success rate with and without ContextLint enabled past the 50%-full mark.

## Sources

- https://research.trychroma.com/context-rot — Chroma's 18-model context-rot benchmark, position-effect and U-shaped attention curve findings.
- https://www.fiddler.ai/blog/ai-agent-failure-rate — 70–95% production agent failure rates, multi-agent chain failure math, context-drift attribution.
- https://medium.com/the-ai-forum/automatic-context-compression-in-llm-agents-why-agents-need-to-forget-and-how-to-help-them-do-it-43bff14c341d — March 2026 survey of automatic context-compression strategies in agent frameworks.
- https://gist.github.com/badlogic/cd2ef65b0697c4dbe2d13fbecb0a0a5f — comparison of context-compaction implementations in Claude Code, Codex CLI, OpenCode, and Amp.
- https://www.understandingai.org/p/context-rot-the-emerging-challenge — May 2026 framing of context rot as the next reliability bottleneck for LLM agents.
