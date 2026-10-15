#!/usr/bin/env python3
# requires: python>=3.10, no third-party dependencies

"""IIQ Zombie Task Guard.

Flags IdentityIQ TaskResult rows still marked "running" long past their
TaskDefinition's average duration, and ranks them by whether the owning
TaskDefinition's Allow Concurrency setting means the next scheduled
launch will be silently canceled rather than merely duplicated.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

# Fixed "extract" instant this sample run pretends to execute at: a daily
# 06:00 pre-flight guard, timed to run just ahead of the 07:30-10:00
# window where most of this org's daily delta aggregations launch.
_NOW = datetime(2026, 8, 17, 6, 0, 0)


@dataclass(frozen=True)
class TaskDefinition:
    name: str
    allow_concurrency: bool
    avg_duration_minutes: float
    next_scheduled_launch: datetime
    schedule: str


@dataclass(frozen=True)
class TaskResult:
    task_definition_name: str
    host: str
    launched: datetime
    completed: datetime | None  # None means still running as of the extract time
    percent_complete: int


# The rows below mirror what IdentityIQ's REST API returns for running
# TaskResults and their owning TaskDefinitions. In production,
# load_task_results() and load_task_definitions() call
# GET /identityiq/rest/taskResults (filtered to completed == null) and
# GET /identityiq/rest/taskDefinitions instead of returning these
# constants.
_SAMPLE_TASK_DEFINITIONS: list[TaskDefinition] = [
    TaskDefinition("Active Directory Delta Aggregation", False, 18, datetime(2026, 8, 17, 8, 0), "Daily 08:00"),
    TaskDefinition("SAP ECC Full Aggregation", False, 145, datetime(2026, 8, 24, 2, 0), "Weekly Sun 02:00"),
    TaskDefinition("Workday Delta Aggregation", False, 22, datetime(2026, 8, 17, 9, 0), "Daily 09:00"),
    TaskDefinition("Manager Access Review Certification Generation", False, 95, datetime(2026, 9, 1, 4, 0), "Monthly 1st 04:00"),
    TaskDefinition("ServiceNow Account Group Aggregation", False, 12, datetime(2026, 8, 17, 7, 30), "Daily 07:30"),
    TaskDefinition("Perform Maintenance", False, 35, datetime(2026, 8, 18, 1, 0), "Daily 01:00"),
    TaskDefinition("GitHub Enterprise Aggregation", True, 8, datetime(2026, 8, 17, 10, 0), "Daily 10:00"),
    TaskDefinition("AWS IAM Aggregation", False, 15, datetime(2026, 8, 17, 23, 0), "Daily 23:00"),
]

_SAMPLE_TASK_RESULTS: list[TaskResult] = [
    TaskResult("Active Directory Delta Aggregation", "iiq-app02", datetime(2026, 8, 15, 8, 0), None, 100),
    TaskResult("SAP ECC Full Aggregation", "iiq-app01", datetime(2026, 8, 17, 2, 0), None, 61),
    TaskResult("Workday Delta Aggregation", "iiq-app02", datetime(2026, 8, 16, 9, 5), None, 100),
    TaskResult("Manager Access Review Certification Generation", "iiq-app01", datetime(2026, 8, 16, 4, 10), None, 88),
    TaskResult("ServiceNow Account Group Aggregation", "iiq-app03", datetime(2026, 8, 17, 5, 50), None, 40),
    TaskResult("Perform Maintenance", "iiq-app01", datetime(2026, 8, 14, 1, 0), None, 100),
    TaskResult("GitHub Enterprise Aggregation", "iiq-app02", datetime(2026, 8, 16, 10, 0), None, 100),
    TaskResult("AWS IAM Aggregation", "iiq-app03", datetime(2026, 8, 17, 5, 45), None, 22),
]

_DEFINITIONS_BY_NAME: dict[str, TaskDefinition] = {d.name: d for d in _SAMPLE_TASK_DEFINITIONS}


def load_task_results() -> list[TaskResult]:
    # In production: GET /identityiq/rest/taskResults, filtered to rows
    # with no completed timestamp (still "Pending"/running on the Task
    # Results page).
    return list(_SAMPLE_TASK_RESULTS)


def load_task_definitions() -> dict[str, TaskDefinition]:
    # In production: GET /identityiq/rest/taskDefinitions, joined on
    # each running result's task definition name for allowConcurrency,
    # averageDuration, and the next TaskSchedule launch time.
    return dict(_DEFINITIONS_BY_NAME)


def classify_severity(
    stuck: bool,
    allow_concurrency: bool,
    hours_until_next_launch: float,
    concurrency_lookahead_hours: float,
) -> str | None:
    if not stuck:
        return None
    if allow_concurrency:
        # IdentityIQ documentation: "If enabled, allow concurrency
        # appends a numeric value to the name of the task that started
        # second." A duplicate run, not a silent cancellation.
        return "LOW"
    if hours_until_next_launch <= concurrency_lookahead_hours:
        # "If disabled, the second task is canceled and an exception
        # sent to the requestor." The next launch will be silently
        # swallowed unless this result is cleared first.
        return "HIGH"
    return "MEDIUM"


def find_zombies(
    results: list[TaskResult],
    definitions: dict[str, TaskDefinition],
    extract_time: datetime,
    stuck_threshold_multiplier: float,
    concurrency_lookahead_hours: float,
) -> list[dict[str, Any]]:
    findings: list[dict[str, Any]] = []
    for r in results:
        if r.completed is not None:
            continue  # already finished, nothing to guard against
        definition = definitions[r.task_definition_name]
        elapsed_minutes = (extract_time - r.launched).total_seconds() / 60
        threshold_minutes = definition.avg_duration_minutes * stuck_threshold_multiplier
        stuck = elapsed_minutes > threshold_minutes
        hours_until_next = (definition.next_scheduled_launch - extract_time).total_seconds() / 3600
        severity = classify_severity(stuck, definition.allow_concurrency, hours_until_next, concurrency_lookahead_hours)
        if severity is None:
            continue
        findings.append({
            "task_definition": r.task_definition_name,
            "host": r.host,
            "launched": r.launched.isoformat(),
            "percent_complete": r.percent_complete,
            "elapsed_hours": round(elapsed_minutes / 60, 1),
            "avg_duration_minutes": definition.avg_duration_minutes,
            "allow_concurrency": definition.allow_concurrency,
            "next_scheduled_launch": definition.next_scheduled_launch.isoformat(),
            "hours_until_next_launch": round(hours_until_next, 1),
            "schedule": definition.schedule,
            "severity": severity,
        })
    findings.sort(key=lambda f: (-{"HIGH": 2, "MEDIUM": 1, "LOW": 0}[f["severity"]], f["hours_until_next_launch"]))
    return findings


def print_report(findings: list[dict[str, Any]], results_scanned: int) -> None:
    print("IIQ Zombie Task Guard")
    print(f"Running TaskResults scanned: {results_scanned}")
    print(f"Zombie findings: {len(findings)}")
    print()
    by_severity: dict[str, int] = {}
    for f in findings:
        by_severity[f["severity"]] = by_severity.get(f["severity"], 0) + 1
    for sev in ("HIGH", "MEDIUM", "LOW"):
        if sev in by_severity:
            print(f"  {sev}: {by_severity[sev]}")
    print()
    print(f"{'TASK DEFINITION':<48} {'HOST':<11} {'SEV':<7} {'ELAPSED':<9} {'AVG':<6} {'CONCUR':<7} {'NEXT LAUNCH IN'}")
    print("-" * 116)
    for f in findings:
        print(
            f"{f['task_definition']:<48} {f['host']:<11} {f['severity']:<7} "
            f"{str(f['elapsed_hours']) + 'h':<9} {str(f['avg_duration_minutes']) + 'm':<6} "
            f"{'yes' if f['allow_concurrency'] else 'no':<7} {f['hours_until_next_launch']}h ({f['schedule']})"
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect stuck IdentityIQ TaskResults that will silently cancel their next scheduled launch.")
    parser.add_argument("--config", required=True, help="Path to config JSON (see sample-config.json).")
    parser.add_argument("--dry-run", action="store_true", help="Print findings without writing the output JSON file.")
    args = parser.parse_args()

    try:
        with open(args.config, "r", encoding="utf-8") as fh:
            config = json.load(fh)
    except OSError as exc:
        print(f"ERROR: could not read config file '{args.config}': {exc}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as exc:
        print(f"ERROR: config file '{args.config}' is not valid JSON: {exc}", file=sys.stderr)
        return 1

    try:
        stuck_threshold_multiplier = float(config["stuck_threshold_multiplier"])
        concurrency_lookahead_hours = float(config["concurrency_lookahead_hours"])
        output_path = config["output_path"]
    except KeyError as exc:
        print(f"ERROR: config file is missing required key: {exc}", file=sys.stderr)
        return 1

    results = load_task_results()
    definitions = load_task_definitions()
    findings = find_zombies(results, definitions, _NOW, stuck_threshold_multiplier, concurrency_lookahead_hours)

    print_report(findings, len(results))

    if not args.dry_run:
        with open(output_path, "w", encoding="utf-8") as fh:
            json.dump({"extract_time": _NOW.isoformat(), "findings": findings}, fh, indent=2)
        print()
        print(f"Wrote {len(findings)} findings to {output_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
