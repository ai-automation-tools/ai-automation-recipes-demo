// Pure logic first, DOM wiring below. Keeping these free of DOM references
// means they can be lifted into a unit test file later without touching the UI.

const SIMILARITY_DUPLICATE = 0.75;
const SIMILARITY_EXTEND = 0.40;
const MATCH_FLOOR = 0.05;
const STORAGE_KEY = "iiq-role-mining-triage-decisions";

function jaccard(setA, setB) {
  const a = new Set(setA);
  const b = new Set(setB);
  const shared = [...a].filter((x) => b.has(x));
  const unionSize = new Set([...a, ...b]).size;
  return {
    score: unionSize === 0 ? 0 : shared.length / unionSize,
    shared,
    onlyA: [...a].filter((x) => !b.has(x)),
    onlyB: [...b].filter((x) => !a.has(x)),
  };
}

function findBestMatch(candidate, existingRoles) {
  let best = null;
  for (const role of existingRoles) {
    if (role.application !== candidate.application) continue;
    const cmp = jaccard(candidate.entitlements, role.entitlements);
    if (!best || cmp.score > best.score) {
      best = { role, ...cmp };
    }
  }
  return best;
}

function classify(candidate, bestMatch, minIdentitiesPerRole) {
  const score = bestMatch ? bestMatch.score : 0;
  if (score >= SIMILARITY_DUPLICATE) return "Duplicate";
  if (score >= SIMILARITY_EXTEND) return "Extend";
  if (candidate.population >= minIdentitiesPerRole) return "Create";
  return "Discard";
}

function buildRows(data, minIdentitiesPerRole) {
  return data.candidates.map((candidate) => {
    const bestMatch = findBestMatch(candidate, data.existingRoles);
    const usableMatch = bestMatch && bestMatch.score >= MATCH_FLOOR ? bestMatch : null;
    const recommendation = classify(candidate, usableMatch, minIdentitiesPerRole);
    return {
      id: candidate.id,
      application: candidate.application,
      population: candidate.population,
      populationPct: candidate.populationPct,
      entitlementCount: candidate.entitlements.length,
      entitlements: candidate.entitlements,
      bestMatch: usableMatch,
      bestMatchName: usableMatch ? usableMatch.role.name : "none",
      similarity: usableMatch ? usableMatch.score : 0,
      recommendation,
    };
  });
}

function countSurvivors(data, minIdentitiesPerRole) {
  return data.candidates.filter((c) => c.population >= minIdentitiesPerRole).length;
}

// ---- DOM wiring ----

let DATA = null;
let ROWS = [];
let sortKey = "similarity";
let sortDir = -1;
let selectedId = null;
let decisions = {};

function loadDecisions() {
  try {
    decisions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    decisions = {};
  }
}

function saveDecisions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

function recBadge(rec) {
  const cls = "rec-" + rec.toLowerCase();
  return `<span class="rec-badge ${cls}">${rec}</span>`;
}

function renderTaskMeta() {
  const t = DATA.miningTask;
  document.getElementById("task-meta").innerHTML =
    `${t.name}<br>${t.application.join(" + ")} &middot; completed ${t.dateComplete}`;
}

function renderTable() {
  const filter = document.getElementById("filter-input").value.trim().toLowerCase();
  const filtered = ROWS.filter((r) =>
    !filter || r.application.toLowerCase().includes(filter) || r.bestMatchName.toLowerCase().includes(filter)
  );
  filtered.sort((a, b) => {
    const va = a[sortKey], vb = b[sortKey];
    if (typeof va === "string") return sortDir * va.localeCompare(vb);
    return sortDir * (va - vb);
  });

  const tbody = document.getElementById("candidate-tbody");
  tbody.innerHTML = filtered.map((r) => `
    <tr data-id="${r.id}" class="${r.id === selectedId ? "selected" : ""}">
      <td>${r.id}</td>
      <td>${r.application}</td>
      <td>${r.population} (${Math.round(r.populationPct * 100)}%)</td>
      <td>${r.entitlementCount}</td>
      <td>${r.bestMatchName}</td>
      <td>${(r.similarity * 100).toFixed(0)}%</td>
      <td>${recBadge(r.recommendation)}</td>
    </tr>
  `).join("");

  tbody.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", () => {
      selectedId = tr.dataset.id;
      renderTable();
      renderDetail();
    });
  });
}

function renderDetail() {
  const row = ROWS.find((r) => r.id === selectedId);
  const empty = document.getElementById("detail-empty");
  const content = document.getElementById("detail-content");

  if (!row) {
    empty.hidden = false;
    content.hidden = true;
    return;
  }

  empty.hidden = true;
  content.hidden = false;

  const list = (items) => items.length
    ? items.map((e) => `<li>${e}</li>`).join("")
    : `<li style="opacity:0.4">&mdash;</li>`;

  if (row.bestMatch) {
    document.getElementById("detail-candidate-title").textContent = `${row.id} only`;
    document.getElementById("detail-role-title").textContent = `${row.bestMatch.role.name} only`;
    document.getElementById("detail-candidate-only").innerHTML = list(row.bestMatch.onlyA);
    document.getElementById("detail-shared").innerHTML = list(row.bestMatch.shared);
    document.getElementById("detail-role-only").innerHTML = list(row.bestMatch.onlyB);
  } else {
    document.getElementById("detail-candidate-title").textContent = `${row.id} entitlements`;
    document.getElementById("detail-role-title").textContent = "No match above 5% similarity";
    document.getElementById("detail-candidate-only").innerHTML = list(row.entitlements);
    document.getElementById("detail-shared").innerHTML = list([]);
    document.getElementById("detail-role-only").innerHTML = list([]);
  }

  const saved = decisions[row.id] || { decision: "", note: "" };
  document.getElementById("decision-select").value = saved.decision;
  document.getElementById("decision-note").value = saved.note;
}

function renderDecisionLog() {
  const tbody = document.getElementById("decision-tbody");
  const entries = ROWS.filter((r) => decisions[r.id] && decisions[r.id].decision);
  tbody.innerHTML = entries.length
    ? entries.map((r) => {
        const d = decisions[r.id];
        return `<tr>
          <td>${r.id}</td>
          <td>${r.application}</td>
          <td>${recBadge(r.recommendation)}</td>
          <td>${d.decision}</td>
          <td>${d.note ? d.note.replace(/</g, "&lt;") : ""}</td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="5" style="color:var(--slate)">No decisions recorded yet &mdash; select a candidate above and set one.</td></tr>`;
}

function renderSimulator() {
  const minIdentities = Number(document.getElementById("min-identities").value);
  const maxGroups = Number(document.getElementById("max-groups").value);
  document.getElementById("min-identities-value").textContent = minIdentities;
  document.getElementById("max-groups-value").textContent = maxGroups;

  const survivors = countSurvivors(DATA, minIdentities);
  const box = document.getElementById("simulator-result");
  if (survivors > maxGroups) {
    box.className = "simulator-result fail";
    box.innerHTML = `${survivors} candidates clear the population floor, above the "Max groups to mine" cap of ${maxGroups}. At these settings the real IdentityIQ task would fail outright &mdash; raise the floor or the cap before re-running it.`;
  } else {
    box.className = "simulator-result ok";
    box.innerHTML = `${survivors} of ${DATA.candidates.length} candidates clear the population floor &mdash; within the cap of ${maxGroups}. Safe to re-run the mining task at these settings.`;
  }

  ROWS = buildRows(DATA, minIdentities);
  renderTable();
  renderDetail();
  renderDecisionLog();
}

function exportCsv() {
  const header = ["id", "application", "recommendation", "decision", "note"];
  const lines = [header.join(",")];
  ROWS.forEach((r) => {
    const d = decisions[r.id] || { decision: "", note: "" };
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    lines.push([r.id, r.application, r.recommendation, d.decision, d.note].map(escape).join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "role-mining-triage-decisions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function wireEvents() {
  document.getElementById("min-identities").addEventListener("input", renderSimulator);
  document.getElementById("max-groups").addEventListener("input", renderSimulator);
  document.getElementById("filter-input").addEventListener("input", renderTable);
  document.getElementById("export-csv").addEventListener("click", exportCsv);

  document.querySelectorAll("#candidate-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      sortDir = sortKey === key ? -sortDir : -1;
      sortKey = key;
      renderTable();
    });
  });

  document.getElementById("decision-select").addEventListener("change", (e) => {
    if (!selectedId) return;
    decisions[selectedId] = decisions[selectedId] || { decision: "", note: "" };
    decisions[selectedId].decision = e.target.value;
    saveDecisions();
    renderDecisionLog();
  });

  document.getElementById("decision-note").addEventListener("input", (e) => {
    if (!selectedId) return;
    decisions[selectedId] = decisions[selectedId] || { decision: "", note: "" };
    decisions[selectedId].note = e.target.value;
    saveDecisions();
  });
}

async function init() {
  const res = await fetch("sample-data.json");
  DATA = await res.json();
  loadDecisions();
  renderTaskMeta();
  wireEvents();
  renderSimulator();
}

init();
