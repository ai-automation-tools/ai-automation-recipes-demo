# Requirements — IIQ Role Mining Overlap Triage

## Purpose

Give a role administrator a working surface for reviewing the output of an IdentityIQ IT Role Mining task before any candidate becomes a Bundle. The IT Role Mining Results screen lists task metadata (name, date, owner, result) and lets an admin drill into a candidate's group summary and matching population, but the public 8.4 documentation does not describe it computing overlap against the existing role catalog or previewing how a threshold change would affect the candidate count. This prototype fills that specific gap using data shaped like a Role Mining Results CSV export plus the current Bundle catalog.

## Functional requirements

1. **Load two record sets** from `sample-data.json`: `existingRoles` (current IT Role Bundles with their entitlement lists) and `candidates` (mined role candidates from one IT Role Mining task run, matching the parameters — application, population, threshold — the mining task page collects).
2. **Compute similarity** for every candidate against every existing role on the same application: Jaccard index = `|shared entitlements| / |union of entitlements|`. Store the best-matching existing role and its score per candidate.
3. **Classify each candidate** into one of four recommendations, computed client-side and re-run whenever the threshold controls change:
   - `similarity >= 0.75` → **Duplicate** (already covered by the matched role; discard the candidate)
   - `0.40 <= similarity < 0.75` → **Extend** (fold the new entitlements into the matched role rather than mint a new one)
   - `similarity < 0.40` and `population >= minIdentitiesPerRole` → **Create new role**
   - `similarity < 0.40` and `population < minIdentitiesPerRole` → **Discard as noise**
4. **Candidate table** — one row per candidate: application, population count + percent, entitlement count, best-match role (or "none"), similarity score, recommendation badge. Sortable by similarity and population. Free-text filter by application or role name.
5. **Detail panel** — selecting a candidate shows a three-column entitlement diff against its best match: entitlements unique to the candidate, entitlements unique to the existing role, and shared entitlements. Empty state when there is no match above a 0.05 similarity floor.
6. **Threshold simulator** — two live controls, `Min identities per role` and `Max groups to mine`, mirroring the fields IT Role Mining exposes on its setup screen. Moving them recomputes, in the browser, how many candidates in the current result set would survive the population floor, and flags in red when that count exceeds `Max groups to mine` — the documented condition under which the mining task itself fails. This is a pre-flight check against a result set already in hand; it does not call IdentityIQ or predict what a re-run with different parameters would discover.
7. **Decision log** — a reviewer can set a decision (`Extend`, `Create`, `Discard`, `Needs review`) and an optional note per candidate, independent of the computed recommendation. Persist decisions in `localStorage` keyed by candidate ID so a reload doesn't lose review progress. Provide an "Export decisions as CSV" button that generates a client-side download (id, application, recommendation, decision, note).
8. **No network calls.** Everything reads from the bundled `sample-data.json` and runs from `file://` or a static file server.

## Non-functional requirements

- Vanilla HTML/CSS/JS. No build step, no framework, no external CDN dependency (the diff and table views don't need charting).
- Must render correctly in a single `index.html` load with no console errors.
- Similarity, classification, and threshold-simulator logic must live in pure functions in `script.js` that operate on plain objects, so they can be unit-tested independently of the DOM in a later iteration.
- Dark, ops-console visual style consistent with the other prototypes in this collection.

## Explicit design assumptions (not confirmed against a fetched page)

- The exact column layout of an IT Role Mining CSV export is not documented on the pages this run fetched; `sample-data.json`'s candidate shape (application, population, population percent, entitlement list) is a reasonable reconstruction from the setup-screen fields and group-summary view that are documented, not a verified export schema.
- The 0.75 / 0.40 similarity cutoffs and the "population < minIdentitiesPerRole → noise" rule are this prototype's judgment call, not an IIQ-documented threshold. They are exposed as constants in `script.js` (`SIMILARITY_DUPLICATE`, `SIMILARITY_EXTEND`) so a real deployment can retune them against its own role-proliferation tolerance.

## Out of scope

- Writing decisions back into IdentityIQ (creating or modifying Bundles). This is a read-and-decide triage layer, not a provisioning tool.
- Business role mining (grouping IT roles by job function) — this prototype covers IT Role Mining only, per the sample data's scope.
- Re-running the actual IdentityIQ mining task with adjusted parameters — the simulator previews against the *current* result set only.
