---
title: "Trending Movers — 2026-10-14"
date: 2026-10-14
type: trending-movers
site_count: 22
categories: [AI/ML, Dev Tools, Security, Infra/DevOps, Other]
tags: [github, trending, open-source, stars, momentum]
---

# Trending Movers — 2026-10-14
**As of:** 2026-10-14
**Focus:** The GitHub repos gaining the most stars this week — momentum and breakouts across open source.
**Method:** Ranked by stars gained over the past week, scraped from GitHub's weekly trending pages.

---

## Overview

One repo ate the week. morluto/rea gained +183,758 stars, more than six times the runner-up and more than the other fourteen leaderboard entries combined. Below it the field is mostly agent tooling: skill packs, memory layers, a headless browser, a test framework, an auditor. Reverse engineering shows up twice, once as an agent project at the top and once as a veteran, Ghidra, in ninth. All six scraped pages fetched without failures. GitHub's pages did not state a cause for any surge, so the entries below describe what each project is and leave the why open.

---

## The Leaderboard

### 1. [morluto/rea](https://github.com/morluto/rea)
- **Stars this week:** +183,758
- **Category:** Security
- **Stars:** 232,387

REA is an MCP server and CLI that lets an AI agent take apart software: native binaries through Hopper, Ghidra or IDA, plus Electron apps, .NET assemblies, APKs, websites and packet captures. The README says analysis runs locally and shows case studies on DX-Ball, Notion and TH04. It also celebrates passing 200,000 stars and warns that look-alike repos and copied READMEs are not official. A gain this size is out of scale with everything else on the list, and I couldn't find what drove it.

### 2. [boykopovar/AnyPS5](https://github.com/boykopovar/AnyPS5)
- **Stars this week:** +28,663
- **Category:** Dev Tools
- **Stars:** 36,540

AnyPS5 converts PS5 executables so they run natively on Linux and Windows, with no emulation layer or separate runtime process. It does this with a relinker, reimplemented system libraries and a shader recompiler that outputs SPIR-V. There is also a browser converter that keeps the files on your machine. The repo shows 7,920 commits and a large open pull request queue.

### 3. [storytold/artcraft](https://github.com/storytold/artcraft)
- **Stars this week:** +21,868
- **Category:** AI/ML
- **Stars:** 27,363

Artists compose a shot in 2D, stage it in 3D, then hand it to one of 62 image, video, music or mesh models listed in the README. ArtCraft covers character posing, background removal and image-to-3D conversion in a desktop app for Windows and macOS. The Rust codebase has only 26 commits on the main branch, which is thin next to its star count.

### 4. [mattpocock/skills](https://github.com/mattpocock/skills)
- **Stars this week:** +11,955
- **Category:** Dev Tools
- **Stars:** 290,782

Matt Pocock's own `.agents` directory, published: slash commands such as `/grill-me`, `/triage` and `/implement`, and skills the model picks up itself, like `tdd` and `diagnosing-bugs`. The README pitches them as small and composable, a deliberate counterweight to vibe coding. At 290k stars it is by far the largest repo in the top five, so +11,955 is a small percentage on a very big base.

### 5. [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)
- **Stars this week:** +9,867
- **Category:** Dev Tools
- **Stars:** 55,128

A skill that makes an agent draw diagrams as one self-contained HTML and SVG file, in an editorial style with no shadows. It can redraw existing draw.io, Mermaid and Excalidraw files and pick up a site's brand colors. The README says 45 diagram types where the repo description says 44.

### 6. [lexmount/moli](https://github.com/lexmount/moli)
- **Stars this week:** +7,396
- **Category:** Dev Tools
- **Stars:** 18,313

Moli is a headless browser written in Rust, not a Chromium wrapper, and it skips layout and painting unless a request needs them. Agents reach it over a CLI, CDP, WebDriver Classic or BiDi, including a Playwright-compatible endpoint. The README benchmarks it against Chrome, Lightpanda and Obscura, and the page carries Trendshift badges for trending Rust repos.

### 7. [ifixai-ai/iFixAi](https://github.com/ifixai-ai/iFixAi)
- **Stars this week:** +5,547
- **Category:** AI/ML
- **Stars:** 26,845

iFixAi runs about 60 inspections against an AI agent and grades five core areas (fabrication, manipulation, deception, unpredictability, opacity) from A to F. You can run it from a CLI or from inside Claude Code and Codex, so the agent can audit itself. Its README carries a Product Hunt badge and a Trendshift "#1 Python repository of the week" badge.

### 8. [DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym)
- **Stars this week:** +5,446
- **Category:** Other
- **Stars:** 11,641

The odd one out: a self-hosted workout tracker with supersets, warm-ups and cardio, a view of which muscles are trained or detrained, and imports from FitNotes, Strong and Hevy. Login is by passkey and it runs under Docker Compose. The author says it is built with Claude Code, and the roadmap lists v1.3.10 as released in October 2026.

### 9. [NationalSecurityAgency/ghidra](https://github.com/NationalSecurityAgency/ghidra)
- **Stars this week:** +4,986
- **Category:** Security
- **Stars:** 87,034

The NSA's open-source reverse engineering framework, with 18,739 commits behind it. It is also one of the back ends REA drives, so the two entries at positions 1 and 9 may be connected, though nothing on the page says so.

### 10. [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)
- **Stars this week:** +4,732
- **Category:** Dev Tools
- **Stars:** 63,434

You write HTML, CSS and seekable animations; HyperFrames renders them to deterministic MP4 using Puppeteer and FFmpeg. It ships a CLI, a component catalog and skills for Claude Code and Codex. Apache 2.0 licensed.

### 11. [tester-army/e2e](https://github.com/tester-army/e2e)
- **Stars this week:** +4,426
- **Category:** Dev Tools
- **Stars:** 10,401

Tests are TypeScript, but a step can be a plain-language goal that an agent carries out, followed by ordinary assertions. Agent steps that a later assertion verifies are recorded and replayed without model calls until the app changes. It covers web through Playwright and mobile on iOS and Android, and is marked as heading toward 1.0.

### 12. [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)
- **Stars this week:** +4,302
- **Category:** Dev Tools
- **Stars:** 106,539

Addy Osmani's pack of 25 skills that walk an agent through define, plan, build, verify, review and ship, with 9 slash commands, 4 personas and 7 checklists. It works with Claude Code, Cursor, Gemini CLI, Codex and Copilot. Second skills pack in the top twelve, after Pocock's.

### 13. [farion1231/cc-switch](https://github.com/farion1231/cc-switch)
- **Stars this week:** +3,955
- **Category:** Dev Tools
- **Stars:** 144,217

A desktop app in Rust that manages configuration for Claude Code, Codex, OpenCode, OpenClaw, Grok Build and Hermes Agent from one place. The description insists ccswitch.io is the only official site, which suggests impersonators have been a problem. The repo has 1.4k open issues.

### 14. [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- **Stars this week:** +3,587
- **Category:** AI/ML
- **Stars:** 100,675

Records what an agent does in a session, compresses it with AI, and injects the relevant parts into later sessions. The page shows a 13.39.0 version badge and 3,361 commits.

### 15. [Alishahryar1/free-claude-code](https://github.com/Alishahryar1/free-claude-code)
- **Stars this week:** +3,413
- **Category:** AI/ML
- **Stars:** 60,473

Routes Claude Code, Codex, Pi, OpenCode and other harnesses through free model providers, and the README claims over 1.3 billion free tokens. It now adds native browser sessions. I haven't tested the free-token claim.

---

## Also Climbing

- [tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi) — +3,412 this week — one `/v1` endpoint in front of dozens of free LLM providers, with routing and failover.
- [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) — +3,401 this week — turns an AI coding assistant into a video production pipeline, from research to render.
- [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — +3,227 this week — role-specific plugins (sales, legal, finance) for Claude Cowork and Claude Code.
- [mksglu/context-mode](https://github.com/mksglu/context-mode) — +3,121 this week — MCP server and hooks that keep raw tool output out of the agent's context window.
- [vxcontrol/pentagi](https://github.com/vxcontrol/pentagi) — +2,697 this week — autonomous multi-agent system for penetration testing.
- [chthollyphile/folia-major](https://github.com/chthollyphile/folia-major) — +2,387 this week — full-screen music player with animated lyrics for local files, Navidrome and online services.
- [666ghj/MiroFish](https://github.com/666ghj/MiroFish) — +2,222 this week — builds a simulated world from seed material such as news to predict outcomes.

---

## Sources

- GitHub Trending (weekly) — https://github.com/trending?since=weekly
- GitHub Trending, Python — https://github.com/trending/python?since=weekly
- GitHub Trending, TypeScript — https://github.com/trending/typescript?since=weekly
- GitHub Trending, JavaScript — https://github.com/trending/javascript?since=weekly
- GitHub Trending, Rust — https://github.com/trending/rust?since=weekly
- GitHub Trending, Go — https://github.com/trending/go?since=weekly
- Each repository page linked above, fetched 2026-10-14
