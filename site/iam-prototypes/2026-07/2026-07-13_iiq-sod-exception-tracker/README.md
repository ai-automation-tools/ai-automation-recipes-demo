# IIQ SOD Exception Tracker

> A browser-runnable dashboard that turns IIQ's flat policy-violation list into a full exception register — surfacing open violations, allowed exceptions with expiry countdowns, and delegated decisions in one filterable view.

**Date**: 2026-07-13
**Type**: App
**Theme**: Detect + Protect
**Platform**: SailPoint IdentityIQ
**Status**: Idea

## What it is

A single-page HTML/JS/CSS application (no build step, no auth, no CDN) that loads IIQ `PolicyViolation` records from a JSON feed and presents them as an exception register. The app shows every violation's current status (Open, Allowed, Delegated, Complete), the age of each violation since it was first detected by the Refresh Identities task, and — critically — a countdown to the expiry date of any allowed exception. Violations whose exception windows close within 14 days trigger an amber alert banner. Clicking any row opens a slide-in detail panel with the conflicting entitlements, the business justification comment, and the compensating control on record.

## Who it serves

IAM engineers and GRC/compliance officers who run quarterly SOX access reviews against an IIQ environment with 50k+ identities and dozens of active SOD policies. They need to answer two questions at the start of every audit cycle: "Which violations are still open and unaddressed?" and "Which allowed exceptions are about to expire and need renewal or remediation?" Today they piece this together by exporting the policy violations report and building a spreadsheet. This app replaces that manual step.

## The IIQ pain it addresses

IIQ's native Policy Violations page (accessible via the MyWork menu and via Quicklinks) surfaces only the violations for which the logged-in user is the violation owner. Administrators can see the full set, but only through a paginated flat list — there is no view that simultaneously shows age, expiry status, and compensating control for all violations across all policies. The "Allow" action lets a reviewer set an `allowedUntil` date (configurable in Compliance Manager global settings under Default Duration for Exceptions), but once that date is set, there is no dashboard that aggregates all upcoming expiration deadlines and alerts the team before exceptions lapse silently. At scale — 20+ active SOD policies, 500+ applications, violations re-evaluated every Refresh Identities run — exceptions expire unnoticed, violations re-appear in the open queue, and auditors ask why the team didn't track them.

## How it works

1. **Load**: The app fetches `sample-data.json` on startup. In production, this feed is produced by a scheduled IIQ Report task querying `spt_policy_violation`, `spt_identity`, and a custom extended-attribute for compensating controls, then emitting the JSON to a static export path.
2. **Summary bar**: Six clickable cards (Total, Open, Allowed, Expiring <30 Days, Delegated, Complete) filter the table and are computed dynamically from the loaded dataset.
3. **Expiry alert**: A banner appears automatically if any Allowed violation's `allowedUntil` date is within 14 days of today. It names each impacted identity and policy so the team can act before the exception lapses.
4. **Table**: Violations are shown in a sortable, filterable table. Age is colour-coded (green < 30 days / amber 30–90 days / red > 90 days). Expiry dates colour-code as amber (≤14 days) or red (already expired). Free-text search covers identity name, ID, department, policy, rule name, application, and owner.
5. **Detail panel**: Clicking any row slides in a full-detail panel showing the conflicting entitlement pair (application + entitlement name), the decision history (who allowed it and what justification was entered), and the compensating control on record.

## What's in this folder

- `README.md` — this file
- `cover.jpg` — card cover illustration
- `metadata.md` — workflow metadata sidecar
- `requirements.md` — functional requirements and IIQ integration notes
- `index.html` — single-page entry point, opens in any modern browser via `file://`
- `style.css` — dark-theme styles
- `script.js` — data loading, filtering, sorting, and panel logic (vanilla JS, no dependencies)
- `sample-data.json` — 20 synthetic IIQ-shaped `PolicyViolation` records across Finance, IT, HR, and Cloud policies

## How to run / read it

Open `index.html` in any modern browser. No server, no auth, no npm.

```
# If fetch() is blocked by browser security on file:// URLs, start a minimal server:
python3 -m http.server 8080
# then visit http://localhost:8080
```

The app's date calculations are pinned to 2026-07-13 so age and expiry values are stable against the sample data. Two violations (pv-006 and pv-016) expire within 14 days of that date, so the amber expiry alert banner should be visible on load.

## Estimated impact

At a 500-connector IIQ shop managing 30+ active SOD policies, a compliance analyst typically spends 2–3 hours per audit cycle manually exporting violation data, building an exception register in Excel, and cross-checking which allowed exceptions are still within their approved window. This app reduces that to a 10-minute scan, saving roughly 4–6 hours per quarter per compliance analyst — and eliminates the class of audit finding caused by an exception expiring silently.

## Why this fits an IIQ shop with 500+ connectors

At 500+ connectors, the number of entitlement-level SOD policies grows non-linearly: Finance policies conflict across SAP ECC, Workday, and Citibank Treasury; Cloud policies conflict across AWS IAM and GitHub; Security policies conflict across AD and firewall management tools. The flat list of violations is unmanageable without aggregation. The allowed-exception workflow is explicitly designed for large shops where some violations are structurally unavoidable (single approver in a regional team, staffing gap during a project) — but those shops also need the most disciplined expiry tracking. This app addresses the scale problem directly: it sorts by expiry soonest, colour-codes by age, and gives auditors a printable view of the full exception register without requiring access to the IIQ UI.

## Sources

- [Working with Policy Violations — SailPoint IdentityIQ 8.4](https://documentation.sailpoint.com/identityiq/help/policies/working_with_policy_violations.html) — violation lifecycle states (Open / Allowed / Delegated / Complete), the Allow action, configurable end dates, and re-appearance behaviour after exception expiry
- [About Policies and Policy Violations — SailPoint IdentityIQ 8.4](https://documentation.sailpoint.com/identityiq_84/help/policy/policy_violation.html) — PolicyViolation object, violation owner resolution, and the policy evaluation triggered by Refresh Identities
- [Policy Violation Work Items — SailPoint IdentityIQ](https://documentation.sailpoint.com/identityiq/help/policies/policy_violation_work_items.html) — work item generation for violation decisions, delegation mechanics
- [Compliance Manager — SailPoint IdentityIQ](https://documentation.sailpoint.com/identityiq/help/system_configuration/compliance_manager.html) — Default Duration for Exceptions setting, Deprovision Items When Exception Expires option, and the Enable Allow Exceptions Popup flag that makes `allowedUntil` configurable per reviewer
- [Enhancement: SOD Policy Audit Events — SailPoint Developer Community](https://developer.sailpoint.com/discuss/t/enhancement-sod-policy-audit-events/195939) — community surfacing of the gap between what SOD audit events record and what compliance teams need (before/after values, material change tracking); grounded the motivation for a complementary exception-register view
- [Policy Violations Not Detecting After Remediation Period — SailPoint Developer Community](https://developer.sailpoint.com/discuss/t/policy-violations-are-not-detecting-after-remediation-period-over/94420) — confirmed community pain around violation lifecycle state management after Refresh Identities re-evaluates completed violations
