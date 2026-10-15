---
title: FleetJudge
slug: fleet-judge
date: 2026-07-14
category: GitHub Repo
form_factor: CLI
monetization: freemium
tags: [ai-agents, parallel-agents, developer-tools, cli, code-quality, evaluation]
status: idea
---

# FleetJudge

> A single-binary CLI that scores and ranks outputs from parallel AI coding agents — so the verification bottleneck doesn't undo the speed gains of running a fleet.

## Problem

Running 2–5 AI coding agents in parallel on the same task (via GitHub Copilot /fleet, construct, Bernstein, Claude Code multi-agent) returns N git branches. Today the comparison is manual: open each branch, scan the diff, run the test suite, pick a winner. With four agents and ten tasks a day that is forty manual comparisons — pushing the bottleneck from generation to verification and erasing the time savings the fleet was meant to create. No existing orchestration tool answers the question "which agent produced the better result" automatically; they route work and merge branches, but the evaluation step is left to the developer.

## Target user

A developer or tech lead running parallel AI coding agent fleets daily — Claude Code, Codex, Cursor, Aider — who has adopted an orchestrator (GitHub Copilot /fleet, construct, or Bernstein) but spends 20–40 minutes per task hand-evaluating N branches before picking a merge target. They want a sub-60-second verdict so they can move to the next task immediately.

## MVP scope

- Accept a task spec file (markdown or plain text) and N git branch names as positional CLI arguments
- Checkout each branch into a temp worktree, run the project's configured test command (`pytest`, `npm test`, `go test`, or a custom shell command in `.fleetjudge.yml`)
- Score each branch on four axes: test pass rate, diff line count relative to task scope, lint/type-check pass, compile success
- Output a ranked comparison table to the terminal and an optional `--json` report file
- `--lm-judge` flag: call a configurable LLM endpoint (Anthropic, OpenAI, or local Ollama) with the task spec and each branch's diff to produce a semantic quality score appended to the table
- `--comment` flag: post the comparison table as a GitHub PR comment via the `gh` CLI

## Monetization

Freemium. OSS core (all scoring, terminal output, JSON export) free under MIT license. Paid team tier at $29/month or $199/seat/year: persistent run history, per-author cost and quality tracking, Slack and GitHub notifications, and a cloud-hosted scoring API for teams with strict local-install policies. Target conversion: 1–2% of GitHub stars, which breaks even at roughly 2,000 stars and 20 paid teams.

## Why now

GitHub Copilot /fleet (launched April 2026) made parallel agent execution mainstream, and the Orca agent development environment gained 466 GitHub stars in a single day on July 12, 2026 — signaling that developer appetite for fleet-level tooling is at a peak. Addy Osmani published an in-depth analysis on July 10, 2026 stating: "The bottleneck is no longer generation — it's verification." A July 2026 multi-agent orchestration guide from Scopir documents the same gap explicitly: "An orchestration layer can direct agents and compare their outputs, but it can't automatically know which agent produced the better solution." The infrastructure to run the fleet exists; the infrastructure to judge its output does not.

## Risks & open questions

- Test suites are project-specific — `fleet-judge` needs a configurable test command, which adds setup friction for projects with non-standard builds
- LLM judge scores are non-deterministic; teams could learn to prompt-optimize for the judge rather than for real code quality
- GitHub Copilot /fleet and similar orchestrators may ship winner-selection natively within 6–12 months, compressing the standalone TAM
- Freemium-CLI conversion rates are typically below 1%, requiring a large open-source star count to reach viable paid revenue
- Cross-platform worktree management (Windows, macOS, Linux path normalization) is non-trivial for a first solo build

## Next step

Build a 1-weekend prototype: test-runner scoring only (no LLM judge), supporting `pytest` and `npm test`, outputting a ranked terminal table. Ship to GitHub with a README and a 60-second demo GIF comparing three Claude Code branches.

## Sources

- https://addyosmani.com/blog/code-agent-orchestra/ — "The bottleneck is no longer generation — it's verification" (Addy Osmani, July 2026)
- https://scopir.com/posts/multi-agent-orchestration-parallel-coding-2026/ — documents the gap: orchestrators can route tasks but cannot automatically determine which agent produced the better output
- https://startupcorners.com/digest/devtools-digest-2026-07-12 — Orca (+466 stars on July 12, 2026) and parallel agent fleet tools as the dominant trend
- https://kalinga.ai/github-copilot-fleet-parallel-agents-guide/ — GitHub Copilot /fleet (launched April 2026) and parallel agent execution becoming routine in developer workflows
