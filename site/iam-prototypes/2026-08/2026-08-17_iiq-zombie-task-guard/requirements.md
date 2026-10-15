# Requirements — IIQ Zombie Task Guard

## Purpose

Detect IdentityIQ TaskResult rows that are still marked "running" (no `completed` timestamp) far past their TaskDefinition's historical average duration, and flag which of those zombie results are about to silently cancel their task's next scheduled launch — because the owning TaskDefinition has Allow Concurrency disabled.

## Functional requirements

- FR1: The script MUST accept a `--config <path>` argument pointing to a JSON config file matching the shape of `sample-config.json`.
- FR2: The script MUST read `stuck_threshold_multiplier`, `concurrency_lookahead_hours`, and `output_path` from the config file and fail with a non-zero exit code and a descriptive `stderr` message if any is missing.
- FR3: The script MUST treat any TaskResult with no `completed` timestamp as currently running, and MUST compute its elapsed runtime against the extract time.
- FR4: A running TaskResult MUST be classified "stuck" when its elapsed runtime exceeds its TaskDefinition's `avg_duration_minutes` multiplied by `stuck_threshold_multiplier`. This margin exists so a legitimately long full aggregation is not flagged next to a stuck delta aggregation that normally finishes in minutes.
- FR5: For each stuck result, the script MUST read the owning TaskDefinition's `allow_concurrency` flag and `next_scheduled_launch`, and MUST classify severity as:
  - `HIGH` — `allow_concurrency` is `false` and the next scheduled launch is within `concurrency_lookahead_hours`. IdentityIQ's documented behavior is that the second launch attempt is canceled outright when concurrency is disabled, so this stuck result is about to silently swallow the next run.
  - `MEDIUM` — `allow_concurrency` is `false` but the next scheduled launch is beyond `concurrency_lookahead_hours`. Still a problem, not an imminent one.
  - `LOW` — `allow_concurrency` is `true`. IdentityIQ appends a numeric suffix and runs a duplicate instead of canceling, so nothing is silently skipped, but the zombie result is still wasting a worker thread and should be cleared.
- FR6: The script MUST print a summary (results scanned, zombie count, severity breakdown) and a findings table to stdout on every run.
- FR7: Unless `--dry-run` is passed, the script MUST write all findings to the JSON file named in `output_path`.
- FR8: The script MUST run against the bundled synthetic dataset with no network access and no credentials, using `sample-config.json` as-is.

## Non-functional requirements

- NFR1: No third-party dependencies — standard library only (`argparse`, `json`, `dataclasses`, `datetime`).
- NFR2: Python 3.10+ (uses `X | None` union syntax and `dataclass(frozen=True)`).
- NFR3: Every function signature is type-hinted.
- NFR4: The script must never write to `output_path` when `--dry-run` is set.
- NFR5: Runtime for the bundled sample dataset (8 running TaskResults, 8 TaskDefinitions) must stay under 1 second.

## Security requirements

- SR1: No hard-coded credentials anywhere in `script.py` or `sample-config.json`.
- SR2: `sample-config.json` MUST reference the API bearer token only via an environment-variable name (`auth_token_env`), never a literal value.
- SR3: All illustrative hostnames MUST use the `.invalid` TLD.
- SR4: The script is read-only against IIQ. It does not call Terminate on any TaskResult and does not modify any TaskDefinition. Clearing a flagged zombie result (via the Task Results page's Terminate action, or the IIQ Console) is a human decision this script hands off to, not an action it performs — a script auto-terminating a task that turns out not to be truly dead would be worse than the problem it's solving.

## Production data-source note

`load_task_results()` and `load_task_definitions()` are stubbed to return an embedded synthetic dataset when `task_api.mode` is `"sample"`. In production, `mode` is `"live"` and both functions instead call IdentityIQ's REST API — `GET /identityiq/rest/taskResults` for running results (`completed` absent) and `GET /identityiq/rest/taskDefinitions` for each result's owning definition's `allowConcurrency` flag, `averageDuration`, and next `TaskSchedule` launch time. This script does not attempt a live HTTP call in the sample artifact; wiring the real calls, and their bearer-token auth, is a follow-on implementation task, not part of this idea's scope.

## Out of scope

- Terminating or otherwise remediating stuck TaskResults.
- Diagnosing *why* a task got stuck (JVM crash mid-run, exception swallowed by a custom Rule, connector timeout, etc.) — this script only detects the symptom on the Task Results page.
- Tracking Workflow Case (BPM) states — a separate concern from Task Scheduler / TaskResult state, and already covered by a different idea in this collection.
- Cross-platform variants (Identity Security Cloud / IdentityNow schedule jobs differently and do not expose Allow Concurrency the same way).
