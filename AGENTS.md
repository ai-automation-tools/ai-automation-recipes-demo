# AGENTS.md: ai-automation-recipes-demo

Real output from the [ai-automation-recipes](https://github.com/ai-automation-tools/ai-automation-recipes) runner,
served at [ai-automation-recipes-demo.ai-automation-tools.dev](https://ai-automation-recipes-demo.ai-automation-tools.dev). Read by every agent CLI (Claude Code, Codex, Antigravity).
[`README.md`](README.md) has the layout and the rebuild command.

- **Nothing here is hand-written.** Each folder under `site/` is one run's unedited output; don't tidy it.
- **Never hand-edit `site/index.html` or `site/catalog.js`.** The viewer is copied from the recipes repo and the
  catalog is rebuilt with its `scripts/build_viewer.py` (command in the README).
- **This repo is public.** Run `python scripts/check_public.py` before pushing; CI runs it over the history.
- **Ship by PR to `main`**; `.github/workflows/pages.yml` republishes on merge.
