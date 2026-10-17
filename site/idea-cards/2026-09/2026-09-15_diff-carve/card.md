---
title: DiffCarve
slug: diff-carve
date: 2026-09-15
category: GitHub Repo
form_factor: CLI
monetization: freemium
tags: [code-review, stacked-prs, developer-tools, cli, github-actions]
status: idea
cover_image_model: codex gpt-image-2
cover_image_prompt: "A single oversized, overloaded slab of stacked translucent glass panels sits at the left, glowing with dense, tangled internal light; a clean beam of light cuts down through it from above, carving it into a rising staircase of smaller, evenly sized glowing blocks that ascend toward the right in orderly sequence. Modern editorial-tech illustration, soft gradients, clean vector-influenced shapes, subtle depth. Color palette: deep slate blue (#2B3A55), teal (#2BB8A6), warm amber (#F2A93B), off-white (#F5F3EE), used consistently throughout. Composition: the carving beam and staircase are centered and slightly above center, generous negative space on all sides, 16:10 framing, the original overloaded slab smaller and subordinate at the left edge. Mood: precise, clarifying, orderly.\n\nSTRICT: no text, letters, words, numbers, captions, titles, labels, banners, credits, stat blocks, logos, watermarks, signatures, UI chrome, or borders anywhere in the image. No real brand marks or company names. No screenshots, app mockups, charts, or device frames (phones, laptops, tablets). No people or recognisable faces."
---

# DiffCarve

> A CLI and GitHub Action that carves an oversized AI-authored pull request into a dependency-ordered stack of sub-200-line pull requests, each gated by a reviewability score.

## Problem

AI coding agents write whole features in one pass, so pull requests are landing 3.5x bigger than they used to, and the humans reviewing them haven't gotten any faster. GitHub shipped Stacked Pull Requests into public preview on August 18, 2026 specifically to give reviewers a way to split large changes into dependent, independently reviewable chunks, but it's a manual workflow. Someone still has to decide where to cut the branch, and nothing stops a 1,400-line "add feature X" commit from landing as a single PR in the first place.

## Target user

A tech lead or staff engineer at a 20-to-200-person engineering org where most of the team uses Claude Code, Cursor, or Copilot to generate large chunks of a feature at once. They've watched PR size creep up and review comments thin out, and they don't want to run a training session teaching every engineer to manually stack commits before opening a PR. What they want: when someone opens a giant AI-generated PR, it gets broken into a reviewable stack before a human ever has to scroll through the full diff.

## MVP scope

- CLI (`diffcarve analyze <branch>`) that partitions a diff into dependency-ordered logical layers (schema migration, then data-access layer, then API route, then UI) using file and module boundaries plus import-graph analysis, rather than blind line-count buckets.
- GitHub Action that runs on PR open and, when the diff crosses a configurable line or file threshold, opens the partitioned layers as a native GitHub Stacked Pull Request chain instead of the original monolith.
- A per-layer reviewability score (lines changed, files touched, cyclomatic complexity delta, reverse-dependency count) posted as a PR check; any layer over the configured threshold fails the check and blocks merge until it's split further or a second reviewer explicitly overrides it.
- Repo-level config file (`diffcarve.yml`) for line budget, complexity threshold, and file-boundary rules per language.
- Two supported stacks at launch, TypeScript/JavaScript via ts-morph's import graph and Python via the standard `ast` module, since those cover most AI-agent-authored repos today.
- `--dry-run` mode that posts the proposed stack layout as a PR comment without blocking merge, so a team can see what it would do before turning on enforcement.

## Monetization

Freemium. The CLI and GitHub Action are MIT-licensed and free for any repo under a 10-seat cap per organization. A paid tier ($15–25 per developer per month) adds org-wide reviewability trend dashboards, Slack/Teams alerts on repeat offenders, and one config that enforces the same policy across every repo: the thing a platform or DevEx team wants once a single team's pilot has already worked.

## Why now

GitHub's Stacked Pull Requests moved to public preview on August 18, 2026, which gives DiffCarve a native format to target instead of building a proprietary UI. At the same time, Cortex's 2026 engineering benchmark report found incidents per pull request up 23.5% and change failure rates up roughly 30% year over year, driven by AI acting as what the report calls an "indiscriminate amplifier" of whatever review discipline a team already had. The primitive for splitting a diff now exists on the platform teams already use; nothing yet decides where to make the cuts automatically.

## Risks & open questions

- Will an engineering lead actually leave a merge-blocking check turned on, or click past it the first time it holds up a release? The `--dry-run` advisory mode needs to be the real on-ramp, not a footnote.
- Reliable dependency-ordered splitting is the hard part. Import-graph analysis handles clean layered changes well; an AI agent's PR with tangled, cross-cutting edits may not partition cleanly at all.
- GitHub's Stacked PR API is still in public preview, and the programmatic surface for opening a stack from an Action may change or be missing pieces this MVP needs.
- Graphite already owns stacked-diff tooling, and GitHub itself could ship auto-splitting as a first-party feature, since both control the underlying primitive DiffCarve depends on.
- The reviewability score is a proxy for "will a human actually read this," not a measurement of it, and could be gamed by an agent padding a layer with boilerplate to duck under the line budget.

## Next step

Build the TypeScript-only CLI against ten real oversized PRs (a mix of the founder's own repos and public open-source PRs) and check whether the auto-partitioned layers make sense to a reviewer before touching the GitHub Action or the merge gate.

## Sources

- https://www.infoq.com/news/2026/08/github-stacked-pull-requests/ — GitHub Stacked Pull Requests reached public preview on August 18, 2026, giving teams a native way to split large changes into dependent, independently reviewable PRs
- https://www.cortex.io/post/ai-is-making-engineering-faster-but-not-better-state-of-ai-benchmark-2026 — Cortex's 2026 benchmark report: incidents per pull request up 23.5% and change failure rates up roughly 30% as AI adoption grew, with the effect concentrated at teams lacking prior review discipline
