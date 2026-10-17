# IIQ Role Mining Overlap Triage

> Runs a Role Mining task's output against your existing Bundle catalog before anyone commits a new role: flags duplicates, suggests which existing role to extend, and previews whether a threshold change will make the next mining run fail.

**Date**: 2026-09-05
**Theme**: Identify + Automation
**Platform**: SailPoint IdentityIQ
**Status**: Prototype

## What it is

A single-page triage console for the output of an IdentityIQ IT Role Mining task. It loads a mined candidate set alongside the current role catalog, scores every candidate against the closest existing role by entitlement overlap, and gives a role administrator a decision to make (extend, create, or throw away) before the candidate ever becomes a Bundle.

## Who it serves

The IAM engineer or role administrator who owns the Bundle catalog and runs periodic IT Role Mining tasks, usually after onboarding a new application or ahead of a role certification cycle.

## The IIQ pain it addresses

IT Role Mining generates candidate IT roles from access patterns: pick a population (by IPOP or attribute filter), pick the target applications, set a minimum-identities and minimum-entitlements threshold, and the task groups entitlements that a large enough share of the population holds in common. The Role Mining Results screen lists what came out: name, date, owner, result. It lets you drill into a candidate's group summary and matching population. What the documented interface does not do is tell you whether a candidate already exists in some other form. That comparison is left to the administrator, reading two entitlement lists side by side, once per candidate, every time the task runs.

At 500+ connectors this is where role catalogs rot. A candidate that's 90% identical to a role from eighteen months ago gets minted as new because nobody had the CSV open next to the Bundle export. SailPoint's own role-management guidance warns against exactly this pattern: role proliferation from mining without checking against what's already there. A developer.sailpoint.com thread on role mining and ongoing management describes the harder version of the same problem. Without a production-like lower environment, teams can't dry-run the mining task at all, so every decision about whether to extend an existing role or spin up a new one gets made live, on real output, under time pressure.

There's a second failure mode buried in the setup screen: the task fails outright if the number of candidates it finds exceeds the "Maximum Groups to Mine" you configured. Loosen your thresholds enough to find real signal and you risk a hard failure instead of a result set. Nobody previews that math before hitting run.

## How it works

1. **Candidates panel.** One row per mined candidate: application, population count and percent, entitlement count, best-matching existing role, similarity score, and a computed recommendation (Duplicate, Extend, Create, or Discard). Sort by any column, filter by application or role name.
2. **Entitlement diff.** Click a candidate to see a three-column breakdown against its best match: what's unique to the candidate, what's unique to the existing role, and what's shared. This is the side-by-side comparison the native screen doesn't give you.
3. **Threshold simulator.** Two sliders mirror the setup screen's population and volume controls. Move them and watch, live, how many candidates in the current result set would survive the population floor, and whether that count would blow past your "Maximum Groups to Mine" cap and fail the task. It's a pre-flight check against a result set you already have, not a prediction of what a re-run would discover.
4. **Decision log.** Record a decision and a note per candidate, independent of the computed recommendation. The tool suggests; the administrator decides. Decisions persist in the browser (`localStorage`) and export to CSV for a change ticket.

Similarity is a plain Jaccard index: shared entitlements divided by the union of both sets, computed only between a candidate and existing roles on the same application. The cutoffs that turn a score into a recommendation (75% for "duplicate," 40% for "extend") are this prototype's judgment call, not a documented IIQ threshold; they're constants at the top of `script.js` so a real deployment retunes them to its own tolerance for role sprawl.

## What's in this folder

- `README.md`: this file.
- `metadata.md`: provenance (theme, model, sources, assumptions).
- `cover.jpg`: card cover art.
- `requirements.md`: functional and non-functional requirements, plus the explicit design assumptions behind the sample data shape and the similarity cutoffs.
- `index.html`: the single-page app.
- `style.css`: dark ops-console styling, consistent with the rest of this collection.
- `script.js`: the Jaccard similarity, classification, and threshold-simulation logic (pure functions, no DOM dependency), plus the DOM wiring.
- `sample-data.json`: one synthetic Finance/AD role-mining run with 6 existing Bundles and 14 mined candidates, entitlement-shaped like SAP ECC and Active Directory access.

## How to run / read it

Open `index.html` in any modern browser. If your browser blocks `fetch('sample-data.json')` from a `file://` path, serve the folder instead:

```bash
python3 -m http.server 8765
# then visit http://localhost:8765
```

No build step, no login, no API keys.

## Estimated impact

At the default thresholds in the sample data, 6 of 14 candidates are near-duplicates of roles that already exist. The tool catches those in the time it takes to load the page, instead of during a manual side-by-side read that a busy role administrator might skip under deadline. I don't have a shop-specific hours figure to attach to that; the honest claim is what the tool actually demonstrates: turning "read two entitlement lists and decide" into "sort by similarity and confirm."

## Why this fits an IIQ shop with 500+ connectors

Every new connector, every reorganized department, every application migration is a fresh reason to re-run IT Role Mining, and each run produces more candidates for someone to eyeball against a catalog that may already have hundreds of Bundles in it. A triage layer that scores overlap and previews the "Maximum Groups to Mine" failure condition before the real task runs scales with that volume in a way manual comparison doesn't. It works from a CSV-shaped export, which matters because, per the community thread cited below, many IIQ shops can't mirror production access data into a lower environment to test mining runs safely in the first place.

## Sources

1. **Official documentation**:
   - `https://documentation.sailpoint.com/identityiq_84/help/rolemgmt/role_mining.html` — IT Role Mining setup fields (population, application selection, minimum identities/entitlements, threshold percent, Maximum Groups to Mine) and the documented failure condition when candidates exceed that cap.
   - `https://documentation.sailpoint.com/identityiq_84/help/rolemgmt/role_mining_results.html` — Role Mining Results screen fields and actions (view group summary, view population, export to CSV, delete); confirms no documented overlap comparison against existing roles.
2. **Community / current discussion**:
   - `https://developer.sailpoint.com/discuss/t/role-mining-definitions-and-on-going-managment/90579` — practitioner thread on the difficulty of running role mining without production-like lower environments, and the recurring decision of whether to extend an existing role or create a new one as applications onboard.
