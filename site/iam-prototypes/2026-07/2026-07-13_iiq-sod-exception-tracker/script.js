'use strict';

// TODAY is fixed at 2026-07-13 so sample data stays accurate when run offline
const TODAY = new Date('2026-07-13');

let allViolations = [];
let activeStatusFilter = 'all';

// ---- Bootstrap ----
fetch('sample-data.json')
  .then(r => r.json())
  .then(data => init(data))
  .catch(() => {
    document.getElementById('tableBody').innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:40px">Could not load sample-data.json — open via a local HTTP server or file:// URL.</td></tr>';
  });

function init(data) {
  allViolations = data.violations;

  // Environment meta
  const meta = document.getElementById('envMeta');
  meta.innerHTML = `<strong>${data.environment}</strong><br>${data.totalIdentities.toLocaleString()} identities &middot; ${data.totalApplications} applications`;

  populatePolicyFilter();
  renderSummary();
  renderExpiryAlert();
  renderTable();
  wireEvents();
}

// ---- Filters & sort ----
function getFiltered() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  const statusSel = document.getElementById('statusFilter').value;
  const policySel = document.getElementById('policyFilter').value;
  const ageSel = document.getElementById('ageFilter').value;
  const sortSel = document.getElementById('sortFilter').value;

  // status card filter overrides the dropdown when set from card click
  const statusFilter = activeStatusFilter !== 'all' ? activeStatusFilter : statusSel;

  let list = allViolations.filter(v => {
    if (statusFilter === 'Expiring') {
      if (v.status !== 'Allowed') return false;
      const days = daysUntilExpiry(v.allowedUntilDate);
      if (days === null || days < 0 || days > 30) return false;
    } else if (statusFilter !== 'all') {
      if (v.status !== statusFilter) return false;
    }

    if (policySel !== 'all' && v.policyName !== policySel) return false;

    const age = daysSince(v.detectedDate);
    if (ageSel === 'critical' && age <= 90) return false;
    if (ageSel === 'warning' && (age < 30 || age > 90)) return false;
    if (ageSel === 'recent' && age >= 30) return false;

    if (search) {
      const haystack = [
        v.identityDisplayName, v.identityId, v.department,
        v.policyName, v.ruleName,
        ...v.conflictingEntitlements.map(e => e.application + ' ' + e.entitlement),
        v.violationOwner || '', v.delegatedTo || ''
      ].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  list = list.slice().sort((a, b) => {
    switch (sortSel) {
      case 'risk-asc': return a.riskScore - b.riskScore;
      case 'risk-desc': return b.riskScore - a.riskScore;
      case 'age-desc': return daysSince(b.detectedDate) - daysSince(a.detectedDate);
      case 'age-asc': return daysSince(a.detectedDate) - daysSince(b.detectedDate);
      case 'expiry-asc': {
        const da = daysUntilExpiry(a.allowedUntilDate) ?? 99999;
        const db = daysUntilExpiry(b.allowedUntilDate) ?? 99999;
        return da - db;
      }
      default: return 0;
    }
  });

  return list;
}

// ---- Summary ----
function renderSummary() {
  const total = allViolations.length;
  const open = allViolations.filter(v => v.status === 'Open').length;
  const allowed = allViolations.filter(v => v.status === 'Allowed').length;
  const expiring = allViolations.filter(v => {
    if (v.status !== 'Allowed') return false;
    const d = daysUntilExpiry(v.allowedUntilDate);
    return d !== null && d >= 0 && d <= 30;
  }).length;
  const delegated = allViolations.filter(v => v.status === 'Delegated').length;
  const complete = allViolations.filter(v => v.status === 'Complete').length;

  document.getElementById('countAll').textContent = total;
  document.getElementById('countOpen').textContent = open;
  document.getElementById('countAllowed').textContent = allowed;
  document.getElementById('countExpiring').textContent = expiring;
  document.getElementById('countDelegated').textContent = delegated;
  document.getElementById('countComplete').textContent = complete;
}

// ---- Expiry alert banner ----
function renderExpiryAlert() {
  const soon = allViolations.filter(v => {
    if (v.status !== 'Allowed') return false;
    const d = daysUntilExpiry(v.allowedUntilDate);
    return d !== null && d >= 0 && d <= 14;
  });

  const alert = document.getElementById('expiryAlert');
  if (soon.length === 0) { alert.style.display = 'none'; return; }

  alert.style.display = 'flex';
  const names = soon.map(v => `<strong>${v.identityDisplayName}</strong> (${v.policyName.split(' — ')[0]}, expires ${fmt(v.allowedUntilDate)})`);
  document.getElementById('alertText').innerHTML =
    `${soon.length} allowed exception${soon.length > 1 ? 's' : ''} expire within 14 days: ${names.join('; ')}.  Renew or remediate before expiry to avoid violations re-entering the open queue.`;
}

// ---- Table ----
function renderTable() {
  const list = getFiltered();
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');

  document.getElementById('resultCount').textContent = `${list.length} of ${allViolations.length} violation${allViolations.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = list.map(v => {
    const age = daysSince(v.detectedDate);
    const ageClass = age > 90 ? 'age-critical' : age > 30 ? 'age-warning' : 'age-ok';
    const ageLabel = age === 0 ? 'Today' : age === 1 ? '1 day' : `${age} days`;

    const risk = v.riskScore;
    const riskClass = risk >= 90 ? 'risk-critical' : risk >= 75 ? 'risk-high' : 'risk-medium';

    const statusClass = {
      Open: 'pill-open', Allowed: 'pill-allowed', Delegated: 'pill-delegated', Complete: 'pill-complete'
    }[v.status] || 'pill-open';

    const apps = [...new Set(v.conflictingEntitlements.map(e => e.application))].join(', ');

    let expiryCell = '<span class="expiry-none">—</span>';
    if (v.allowedUntilDate) {
      const days = daysUntilExpiry(v.allowedUntilDate);
      if (days < 0) {
        expiryCell = `<span class="expiry-expired">Expired ${fmt(v.allowedUntilDate)}</span>`;
      } else if (days <= 14) {
        expiryCell = `<span class="expiry-soon">&#9888; ${fmt(v.allowedUntilDate)} (${days}d)</span>`;
      } else {
        expiryCell = `<span class="expiry-ok">${fmt(v.allowedUntilDate)} (${days}d)</span>`;
      }
    }

    return `<tr data-id="${v.id}" tabindex="0" aria-label="View violation for ${v.identityDisplayName}">
      <td>
        <div class="cell-identity">${esc(v.identityDisplayName)}</div>
        <div class="cell-dept">${esc(v.department)} &middot; ${esc(v.identityId)}</div>
      </td>
      <td>
        <div class="cell-policy">${esc(v.policyName)}</div>
        <div class="cell-rule">${esc(v.ruleName)}</div>
      </td>
      <td><div class="cell-apps">${esc(apps)}</div></td>
      <td><span class="risk-badge ${riskClass}">${risk}</span></td>
      <td><span class="age-badge ${ageClass}">${ageLabel}</span></td>
      <td><span class="status-pill ${statusClass}">${v.status}</span></td>
      <td class="expiry-cell">${expiryCell}</td>
      <td><button class="detail-btn" data-id="${v.id}">View &rsaquo;</button></td>
    </tr>`;
  }).join('');
}

// ---- Detail panel ----
function openPanel(id) {
  const v = allViolations.find(x => x.id === id);
  if (!v) return;

  const overlay = document.getElementById('overlay');
  const content = document.getElementById('panelContent');

  const age = daysSince(v.detectedDate);
  const risk = v.riskScore;
  const ringClass = risk >= 90 ? 'ring-critical' : risk >= 75 ? 'ring-high' : 'ring-medium';

  let expiryInfo = '—';
  if (v.allowedUntilDate) {
    const days = daysUntilExpiry(v.allowedUntilDate);
    const label = days < 0 ? 'EXPIRED' : days === 0 ? 'Today' : `${days} days remaining`;
    expiryInfo = `${fmt(v.allowedUntilDate)} &mdash; <strong>${label}</strong>`;
  }

  const entHtml = v.conflictingEntitlements.map(e =>
    `<div class="entitlement-block">
      <div class="ent-app">${esc(e.application)}</div>
      <div class="ent-name">${esc(e.entitlement)}</div>
      <div class="ent-desc">${esc(e.description)}</div>
    </div>`
  ).join('');

  let decisionSection = '';
  if (v.status === 'Allowed') {
    decisionSection = `
      <div class="panel-section">
        <h3>Exception Detail</h3>
        <div class="panel-row"><span class="panel-key">Allowed by</span><span class="panel-val">${esc(v.allowedBy)}</span></div>
        <div class="panel-row"><span class="panel-key">Expires</span><span class="panel-val">${expiryInfo}</span></div>
        <div class="panel-row"><span class="panel-key">Justification</span></div>
        <div class="comment-block">${esc(v.allowedComment)}</div>
        ${v.compensatingControl ? `<div class="panel-row" style="margin-top:10px"><span class="panel-key">Compensating control</span></div><div class="control-block">${esc(v.compensatingControl)}</div>` : ''}
      </div>`;
  } else if (v.status === 'Delegated') {
    decisionSection = `
      <div class="panel-section">
        <h3>Delegation</h3>
        <div class="panel-row"><span class="panel-key">Delegated to</span><span class="panel-val">${esc(v.delegatedTo)}</span></div>
      </div>`;
  } else if (v.status === 'Complete') {
    decisionSection = `
      <div class="panel-section">
        <h3>Resolution</h3>
        <div class="panel-row"><span class="panel-key">Resolved</span><span class="panel-val">${v.resolvedDate ? fmt(v.resolvedDate) : '—'}</span></div>
        <div class="resolution-block">${esc(v.resolutionNote || 'No resolution note recorded.')}</div>
      </div>`;
  }

  content.innerHTML = `
    <div class="panel-title-row">
      <div>
        <div class="panel-title">${esc(v.identityDisplayName)}</div>
        <div class="panel-id">${v.id} &middot; ${esc(v.identityId)}</div>
      </div>
      <div class="risk-ring ${ringClass}">${risk}</div>
    </div>

    <div class="panel-section">
      <h3>Identity</h3>
      <div class="panel-row"><span class="panel-key">Department</span><span class="panel-val">${esc(v.department)}</span></div>
      <div class="panel-row"><span class="panel-key">Manager</span><span class="panel-val">${esc(v.identityManager)}</span></div>
    </div>

    <div class="panel-section">
      <h3>Violation</h3>
      <div class="panel-row"><span class="panel-key">Policy</span><span class="panel-val">${esc(v.policyName)}</span></div>
      <div class="panel-row"><span class="panel-key">Rule</span><span class="panel-val">${esc(v.ruleName)}</span></div>
      <div class="panel-row"><span class="panel-key">Status</span><span class="panel-val"><span class="status-pill ${{Open:'pill-open',Allowed:'pill-allowed',Delegated:'pill-delegated',Complete:'pill-complete'}[v.status]}">${v.status}</span></span></div>
      <div class="panel-row"><span class="panel-key">Violation owner</span><span class="panel-val">${esc(v.violationOwner)}</span></div>
      <div class="panel-row"><span class="panel-key">Detected</span><span class="panel-val">${fmt(v.detectedDate)} (${age} day${age !== 1 ? 's' : ''} ago)</span></div>
      <div class="panel-row"><span class="panel-key">Last refreshed</span><span class="panel-val">${fmt(v.lastRefreshedDate)}</span></div>
    </div>

    <div class="panel-section">
      <h3>Conflicting Entitlements</h3>
      ${entHtml}
    </div>

    ${decisionSection}
  `;

  overlay.style.display = 'flex';
  document.getElementById('closePanel').focus();
}

function closePanel() {
  document.getElementById('overlay').style.display = 'none';
}

// ---- Policy filter population ----
function populatePolicyFilter() {
  const sel = document.getElementById('policyFilter');
  const policies = [...new Set(allViolations.map(v => v.policyName))].sort();
  policies.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    sel.appendChild(opt);
  });
}

// ---- Events ----
function wireEvents() {
  // Summary card clicks
  document.getElementById('summaryBar').addEventListener('click', e => {
    const card = e.target.closest('.summary-card[data-filter]');
    if (!card) return;
    activeStatusFilter = card.dataset.filter;
    document.querySelectorAll('.summary-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    document.getElementById('statusFilter').value = 'all';
    renderTable();
  });

  // Filters
  ['searchInput', 'statusFilter', 'policyFilter', 'ageFilter', 'sortFilter'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      if (id === 'statusFilter') activeStatusFilter = 'all';
      renderTable();
    });
  });

  // Row / button clicks → detail panel
  document.getElementById('tableBody').addEventListener('click', e => {
    const btn = e.target.closest('.detail-btn[data-id]');
    if (btn) { e.stopPropagation(); openPanel(btn.dataset.id); return; }
    const row = e.target.closest('tr[data-id]');
    if (row) openPanel(row.dataset.id);
  });
  document.getElementById('tableBody').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const row = e.target.closest('tr[data-id]');
      if (row) openPanel(row.dataset.id);
    }
  });

  // Close panel
  document.getElementById('closePanel').addEventListener('click', closePanel);
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) closePanel();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });
}

// ---- Helpers ----
function daysSince(dateStr) {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  return Math.floor((TODAY - d) / 86400000);
}

function daysUntilExpiry(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Math.floor((d - TODAY) / 86400000);
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
