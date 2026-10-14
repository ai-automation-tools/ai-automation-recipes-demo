<h1 align="center">🍳 AI Recipes: Live Samples</h1>

<p align="center">
  <em>Real output from the <a href="https://github.com/ai-automation-tools/ai-automation-recipes">ai-automation-recipes</a> runner, published as a browsable site.</em>
</p>

<p align="center">
  <a href="https://ai-automation-recipes-demo.ai-automation-tools.dev"><img src="https://img.shields.io/badge/open-the_demo-818cf8?style=for-the-badge" alt="Open the demo"></a>
  <a href="https://github.com/ai-automation-tools/ai-automation-recipes"><img src="https://img.shields.io/badge/recipes-ai--automation--recipes-6B7280?style=for-the-badge" alt="The recipes"></a>
  <a href="https://ai-automation-tools.dev"><img src="https://img.shields.io/badge/↩-ai--automation--tools.dev-6B7280?style=for-the-badge" alt="Org home"></a>
</p>

---

Every item on the site is the unedited folder one recipe run published: a story, a playable game, a
comic, a song, a narrated short, a podcast episode. Each one links back to the recipe that made it
and to the Cronsole template that schedules it.

Nothing here is hand-written. What you see is what the runner wrote on its first live run, so the
rough edges are left in on purpose.

## How it's built

```text
site/                 what GitHub Pages serves
├── index.html        the viewer, copied from ai-automation-recipes/viewer/
├── catalog.js        generated: every artifact, its media and its rendered markdown
└── <collection>/<YYYY-MM>/<date>_<slug>/   one folder per run, with its artifact.json
scripts/check_public.py   the recipes repo's leak scan, run over this repo's history on every push
```

To add a run: copy its folder into `site/` under the same layout, then rebuild the catalog from a
recipes checkout:

```bash
python scripts/build_viewer.py --output-dir ../ai-automation-recipes-demo/site \
  --title "AI Recipes: Live Samples" \
  --repo-url https://github.com/ai-automation-tools/ai-automation-recipes
```

Run `python scripts/check_public.py` here before you commit, and keep each file under GitHub's
100 MB limit. Pushing to `main` deploys.

## License

[MIT](LICENSE).
