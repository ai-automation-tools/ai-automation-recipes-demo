# Requirements — IIQ SOD Exception Tracker

## Purpose

A single-page browser app that surfaces all IIQ `PolicyViolation` records in one interactive dashboard — tracking violation age, exception (allow) status, expiry dates, and compensating controls — so an IAM engineer or compliance officer can monitor the full SOD exception register without digging through IIQ's per-identity view.

---

## Functional Requirements

### FR-01 Summary cards
- Display six clickable summary cards: Total, Open, Allowed (Exception), Expiring <30 Days, Delegated, Complete.
- Clicking a card filters the table to that status subset.
- Card counts are derived from the loaded violation dataset, not hard-coded.

### FR-02 Expiry alert banner
- Show a dismissible amber alert banner when any Allowed violation expires within 14 days.
- Banner lists each impacted identity name, policy short-name, and expiry date.
- Banner is hidden when no violations meet the 14-day threshold.

### FR-03 Filterable / sortable table
- Columns: Identity, Policy/Rule, Applications, Risk Score, Age, Status, Exception Expiry, Detail button.
- Filters: free-text search (identity name, identity ID, department, policy, rule, application, owner), Status dropdown, Policy dropdown (auto-populated), Age bucket (>90 days / 30-90 days / <30 days).
- Sort options: Risk descending (default), Risk ascending, Oldest first, Newest first, Expiry soonest.
- Age colouring: green < 30 days, amber 30–90 days, red > 90 days.
- Expiry colouring: amber if ≤14 days, red if already expired, slate otherwise.

### FR-04 Detail panel
- Clicking any row or the "View ›" button opens a slide-in panel.
- Panel shows: identity detail, violation detail (policy, rule, status, owner, detected date, last-refreshed date), conflicting entitlements (application + entitlement name + description), and a status-specific section:
  - **Allowed**: allowed-by, expiry date with day count, business justification comment, compensating control.
  - **Delegated**: delegated-to party.
  - **Complete**: resolved date and resolution note.
- Panel closes on Escape key, overlay click, or ✕ button.

### FR-05 Data loading
- App loads `sample-data.json` via `fetch()`.
- All counts, filters, and display values are derived dynamically from loaded data.
- On fetch failure, table body shows a user-readable error.

### FR-06 Accessibility
- Table rows are keyboard-focusable (tabindex="0") and respond to Enter key.
- Detail panel is a `role="dialog"` with `aria-modal="true"`.
- Close button has an `aria-label`.

---

## Non-Functional Requirements

- **No build step.** `index.html` opens in any modern browser via `file://` URL or a local HTTP server.
- **No external dependencies.** Vanilla JS (ES2020+), no npm, no CDN, no authentication.
- **No hard-coded secrets.** `sample-data.json` uses synthetic identities, synthetic application names, and placeholder IIQ object IDs.
- **Today's date is pinned** in `script.js` (`const TODAY = new Date('2026-07-13')`) so age and expiry calculations remain accurate against the sample data when the app is opened in any future date. In a production integration, replace `TODAY` with `new Date()`.

---

## IIQ Integration Notes (Production Path)

The sample data mirrors the shape of IIQ's `PolicyViolation` object. To populate this app from a live IIQ 8.4 instance:

1. **REST endpoint**: `GET /identityiq/rest/policyViolations` — returns the current user's visible violations. For an admin view, query the `spt_policy_violation` table directly via an IIQ Report task or JDBC export.
2. **Key fields**:
   - `status` → maps to `Open` / `Allowed` / `Delegated` / `Complete` in the UI.
   - `allowedUntil` → date field set when a reviewer clicks "Allow" with an end date (requires "Enable Allow Exceptions Popup" in Compliance Manager global settings).
   - `allowedBy` → the identity name of the reviewer who granted the exception.
   - `allowComments` → the text entered when the exception was granted.
   - `entitlementsToRemediate` / `relevantEntitlements` → the conflicting entitlement pairs.
3. **Refresh Identities task**: violations are re-evaluated every time this task runs. `lastRefreshedDate` in the sample data corresponds to the task's last-run timestamp from `spt_task_result`.
4. **Compensating controls** are not a native IIQ field — they must be stored in a custom Identity or Application extended attribute and joined at query time.

---

## Acceptance Criteria

- [ ] Opening `index.html` renders the full app with no console errors.
- [ ] Summary card counts match the breakdown in `sample-data.json`.
- [ ] Filtering by Status "Open" shows only open violations.
- [ ] Sorting by "Expiry Soonest" places violations with the nearest `allowedUntilDate` first; violations with no expiry appear last.
- [ ] Clicking a row opens the detail panel; Escape closes it.
- [ ] The expiry alert banner appears (pv-006 and pv-016 both expire within 14 days of 2026-07-13).
- [ ] Free-text search for "SAP ECC" returns only rows where SAP ECC appears in an entitlement.
