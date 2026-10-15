# IIQ Zombie Task Guard

> Finds IdentityIQ TaskResults stuck in "running" long enough to silently cancel the next scheduled aggregation, cert generation, or maintenance run, for the engineer who finds out a connector went stale only when a certifier asks why.

**Date**: 2026-08-17
**Type**: Utility
**Theme**: Automation + Observability
**Platform**: SailPoint IdentityIQ
**Status**: Idea

## What it is

A Python utility that scans currently-running TaskResults, flags the ones stuck well past their task's normal duration, and checks each one against its TaskDefinition's Allow Concurrency setting. When concurrency is disabled and the next scheduled launch is close, it says so plainly: that launch is about to be silently canceled unless someone clears the stuck result first. It's read-only. It reports; it doesn't terminate anything.

## Who it serves

The IAM engineer who owns the nightly aggregation and certification-generation schedule, plus whoever gets paged when an app's entitlement data turns out to be three days stale and nobody noticed.

## The IIQ pain it addresses

IdentityIQ's Task Results page marks a running task "Pending" and leaves it there until it finishes, fails, or someone terminates it by hand. If the app server dies mid-run (a Tomcat restart during patching, an OOM kill, a hung connector call that never returns) the TaskResult can sit in that state indefinitely. Community threads on this are full of people describing exactly that: a result that "is just a zombie and nothing is actually running and consuming processor or memory," with no automatic recovery.

The part that turns an annoyance into an outage is Allow Concurrency. It's the common setting for aggregation and certification-generation tasks, since running two aggregations against the same application at once can corrupt account data, and IdentityIQ's own documentation is explicit about what happens when it's turned off: "the second task is canceled and an exception sent to the requestor." A zombie TaskResult counts as the first task from the scheduler's point of view. The next nightly run doesn't fail loudly. It just never happens, and nothing in the UI calls that out as different from a normal skip.

At 500+ connectors, most of them on their own daily or weekly aggregation schedule, the odds that at least one TaskResult is quietly zombied on any given morning aren't low. Nobody notices until the drift between IIQ and the source system shows up in a certification, or an auditor asks why an entitlement that was revoked last week still appears active.

## How it works

1. **Pull running TaskResults.** The utility reads every TaskResult with no completion timestamp, the same set the Task Results page shows as "Pending."
2. **Check elapsed time against the task's own history.** Each TaskDefinition carries an average duration. A result running more than `stuck_threshold_multiplier` times that average (3x by default) gets flagged as stuck. This margin exists so a legitimately long-running full aggregation doesn't get flagged next to a delta aggregation that's stuck at ten minutes.
3. **Cross-reference Allow Concurrency and the next scheduled launch.** Stuck results get one of three severities. `HIGH` means concurrency is disabled and the next launch is within `concurrency_lookahead_hours` (24 by default), so that run is about to be silently canceled. `MEDIUM` means concurrency is disabled but the next launch is further out: still broken, just not urgent. `LOW` means concurrency is enabled, so IdentityIQ will just append a numeric suffix and run a duplicate instead of canceling anything.
4. **Report.** Prints a summary and a findings table to stdout; writes `zombie-task-findings.json` unless `--dry-run` is set. The script doesn't terminate anything itself. Clearing a flagged result is still a human call, made from the Task Results page or the IIQ Console.

## What's in this folder

- `README.md` — this file
- `requirements.md` — functional, non-functional, and security requirements
- `script.py` — Python 3.10+ utility, standard library only
- `sample-config.json` — illustrative configuration (`.invalid` host, bearer token sourced from an env var name, not a literal value)
- `sample-output.txt` — stdout from four sample runs: a full run, a `--dry-run`, and two failure cases (missing config file, missing required key)

## How to run / read it

```bash
python3 script.py --config sample-config.json
```

Add `--dry-run` to see the findings without writing `zombie-task-findings.json`. No dependencies to install, standard library only. `task_api.mode` is set to `"sample"` in the shipped config, so the script runs against an embedded synthetic dataset with no HTTP call or credentials involved.

Read `sample-output.txt` for all four runs, including what the two failure modes print to stderr and their exit codes.

## Estimated impact

The bundled sample (8 running TaskResults across 8 TaskDefinitions) surfaces 5 zombies, 3 of them about to cancel a same-day launch. Run once a day, ahead of the morning aggregation window, this turns "why is the AD data three days old" from a question a certifier asks into a two-line alert someone clears before their coffee gets cold. It doesn't save hours by itself; clearing a stuck TaskResult takes thirty seconds once you know it's there. What it saves is the days-long gap between a task silently going dark and someone noticing the data drift downstream.

## Why this fits an IIQ shop with 500+ connectors

Every one of those connectors has its own aggregation schedule, and most large shops disable Allow Concurrency on aggregation and cert-generation tasks on purpose, to keep two runs from corrupting the same application's data. That's the correct setting, and it's also exactly the setting that turns one stuck TaskResult into a silently skipped run. A shop with a handful of connectors might go months without hitting this. A shop with 500 is running the dice every night across hundreds of independently scheduled tasks, any one of which can zombie after a server restart nobody scheduled around a task's runtime.

## Sources

1. **Official documentation**:
   - https://documentation.sailpoint.com/identityiq/help/tasks/working_with_tasks.html — confirms the Allow Concurrency option and its exact behavior: "If enabled, allow concurrency appends a numeric value to the name of the task that started second. If disabled, the second task is canceled and an exception sent to the requestor."
   - https://documentation.sailpoint.com/identityiq/help/tasks/task_results_page.html — confirms "Pending" as the status shown for a currently running task, and that termination happens manually from the Task Results page
   - https://documentation.sailpoint.com/identityiq/help/tasks/task_types/system_maintenance.html — confirms the Perform Maintenance task's scope: "It prunes identity snapshots, task results, and certifications, escalates orphaned work items, and performs other background maintenance tasks," used as one of the sample dataset's task definitions
2. **Community / current research**:
   - https://developer.sailpoint.com/discuss/t/ad-aggregation-task-is-stuck-and-wont-terminate/38400/3 — practitioner thread on a stuck AD aggregation task, including the description of a stuck TaskResult as "just a zombie and nothing is actually running and consuming processor or memory"
   - https://developer.sailpoint.com/discuss/t/tasks-stuck-in-task-result-page/153243 — IIQ 8.4 thread on tasks stuck in "running" state indefinitely, confirming this is a recurring, current operational issue rather than a one-off report
   - https://developer.sailpoint.com/docs/api/iiq/task-results-get/ — confirms the `TaskResult` resource shape exposed by IdentityIQ's REST API, the interface `load_task_results()` stubs for this utility's production version

**Unverified assumption:** no fetched page states outright that a stuck "Pending" TaskResult is treated by the scheduler as an in-progress instance of its TaskDefinition for Allow Concurrency purposes. That's a direct reading of the documented behavior (the scheduler has no way to distinguish a genuinely running task from a zombie one), but it's inference, not a quoted claim, and is called out in `metadata.md` accordingly.
