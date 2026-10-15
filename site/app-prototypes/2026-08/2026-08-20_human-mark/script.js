const PATTERN_LIBRARY = [
  { key: 'promo', label: 'Promotional language', weight: 3, phrases: [
    'game-changing', 'groundbreaking', 'revolutionary', 'cutting-edge', 'world-class',
    'best-in-class', 'unparalleled', 'seamlessly', 'seamless', 'breathtaking', 'stunning',
    'must-visit', 'renowned', 'vibrant', 'boasts', 'boasting', 'showcases', 'showcasing',
    'unwavering', 'empowering', 'unlock their full potential', 'unlock its full potential',
    'unlock your full potential', 'exemplifies', 'nestled'
  ]},
  { key: 'vagueAttribution', label: 'Vague attribution', weight: 4, phrases: [
    'industry experts believe', 'experts believe', 'experts say', 'experts argue',
    'studies show', 'research shows', 'many believe', 'observers have noted',
    'observers have cited', 'some critics argue', 'it is widely believed'
  ]},
  { key: 'ruleOfThree', label: 'Rule-of-three padding', weight: 3, regex:
    /\b([a-z][\w'-]*(?:\s+[a-z][\w'-]*){0,2}),\s+([a-z][\w'-]*(?:\s+[a-z][\w'-]*){0,2}),\s+and\s+([a-z][\w'-]*(?:\s+[a-z][\w'-]*){0,2})\b/gi
  },
  { key: 'inflatedSignificance', label: 'Inflated significance', weight: 4, phrases: [
    'stands as a testament', 'serves as a testament', 'stands as a foundation',
    'serves as a foundation', 'marks a pivotal moment', 'pivotal moment',
    'evolving landscape', 'represents a shift', 'represents a milestone',
    'underscores the importance', 'underscores its importance', 'underscores the value',
    'highlighting the value', 'highlights the importance', 'deeply rooted',
    'indelible mark', 'key turning point', 'focal point', 'ensuring smoother',
    'fosters alignment', 'fostering alignment', 'reflects our commitment',
    'reflecting our dedication'
  ]},
  { key: 'fillerHedging', label: 'Filler & hedging', weight: 2, phrases: [
    'in order to', 'due to the fact that', 'at this point in time',
    'it is important to note that', 'could potentially be argued', 'in conclusion',
    'moving forward,', 'additionally,', 'the future looks bright',
    'exciting times lie ahead'
  ]},
  { key: 'negativeParallelism', label: 'Negative parallelism', weight: 5, regex:
    /\bit'?s not (?:just|only)\s+[^,]+,\s*it'?s\s+/gi
  },
];

const EM_DASH_LABEL = 'Em dash overuse';
const SCORE_MULTIPLIER = 1.5;

const state = {
  data: null,
  sessionCertificates: [],
  lastScan: null,
  sortKey: 'date',
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function findMatches(text) {
  const matches = [];
  for (const cat of PATTERN_LIBRARY) {
    if (cat.phrases) {
      for (const phrase of cat.phrases) {
        const re = new RegExp(escapeRegExp(phrase), 'gi');
        let m;
        while ((m = re.exec(text))) {
          matches.push({ start: m.index, end: m.index + m[0].length, key: cat.key, label: cat.label, weight: cat.weight, text: m[0] });
        }
      }
    } else if (cat.regex) {
      const re = new RegExp(cat.regex.source, cat.regex.flags);
      let m;
      while ((m = re.exec(text))) {
        matches.push({ start: m.index, end: m.index + m[0].length, key: cat.key, label: cat.label, weight: cat.weight, text: m[0] });
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
  }
  const emDashCount = (text.match(/—/g) || []).length;
  return { matches, emDashCount };
}

function resolveOverlaps(matches) {
  const sorted = [...matches].sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const kept = [];
  let lastEnd = -1;
  for (const m of sorted) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }
  return kept;
}

function scoreDraft(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length || 1;
  const { matches, emDashCount } = findMatches(text);
  let raw = matches.reduce((sum, m) => sum + m.weight, 0);
  const emRate = emDashCount / (words / 100);
  if (emRate > 1) raw += emDashCount * 2;
  const perHundred = raw / (words / 100);
  const finalScore = Math.max(0, Math.min(100, Math.round(perHundred * SCORE_MULTIPLIER)));
  return { words, matches: resolveOverlaps(matches), emDashCount, finalScore };
}

function buildHighlightedHTML(text, matches) {
  let html = '';
  let cursor = 0;
  for (const m of matches) {
    html += escapeHtml(text.slice(cursor, m.start));
    html += `<mark class="tell" title="${escapeHtml(m.label)}">${escapeHtml(text.slice(m.start, m.end))}</mark>`;
    cursor = m.end;
  }
  html += escapeHtml(text.slice(cursor));
  return html || '<span class="hint">Nothing flagged.</span>';
}

function categoryBreakdown(matches, emDashCount) {
  const counts = new Map();
  for (const m of matches) {
    counts.set(m.label, (counts.get(m.label) || 0) + 1);
  }
  if (emDashCount > 0) counts.set(EM_DASH_LABEL, emDashCount);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function renderScan(text) {
  const result = scoreDraft(text);
  state.lastScan = { text, result };

  const panel = document.getElementById('results-panel');
  panel.classList.remove('is-hidden');

  const threshold = state.data.certificationThreshold;
  const ring = document.getElementById('score-ring');
  const passed = result.finalScore < threshold;
  ring.classList.toggle('is-fail', !passed);
  document.getElementById('score-value').textContent = result.finalScore;

  const verdict = document.getElementById('score-verdict');
  const detail = document.getElementById('score-detail');
  if (passed) {
    verdict.textContent = `Clears the Human-Made threshold (under ${threshold}).`;
    detail.textContent = `${result.matches.length} flagged phrase${result.matches.length === 1 ? '' : 's'} across ${result.words} words.`;
  } else {
    verdict.textContent = `Above the Human-Made threshold (${threshold}) — not ready to certify.`;
    detail.textContent = `${result.matches.length} flagged phrase${result.matches.length === 1 ? '' : 's'} across ${result.words} words. Address these and rescan.`;
  }

  document.getElementById('highlighted-text').innerHTML = buildHighlightedHTML(text, result.matches);

  const breakdown = categoryBreakdown(result.matches, result.emDashCount);
  const list = document.getElementById('category-list');
  list.innerHTML = breakdown.length
    ? breakdown.map(([label, count]) => `<li><span>${escapeHtml(label)}</span><span class="category-count">${count}</span></li>`).join('')
    : '<li><span class="hint">No AI-tell patterns found.</span></li>';

  const certifyBtn = document.getElementById('certify-btn');
  certifyBtn.disabled = !passed;

  document.getElementById('certificate-issued').classList.add('is-hidden');
}

function nextCertificateId() {
  const all = [...state.data.certificates, ...state.sessionCertificates];
  const max = all.reduce((m, c) => {
    const n = parseInt(c.id.split('-').pop(), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 800);
  return `HM-2026-${String(max + 1).padStart(4, '0')}`;
}

function issueCertificate() {
  if (!state.lastScan) return;
  const title = document.getElementById('cert-title').value.trim() || 'Untitled draft';
  const issuer = document.getElementById('cert-issuer').value.trim() || 'You';
  const cert = {
    id: nextCertificateId(),
    title,
    issuer,
    category: 'Draft',
    score: state.lastScan.result.finalScore,
    issuedDate: new Date().toISOString().slice(0, 10),
    status: 'Verified',
  };
  state.sessionCertificates.unshift(cert);

  const card = document.getElementById('issued-cert-card');
  card.innerHTML = `
    <span class="cert-id">${escapeHtml(cert.id)}</span>
    <h3>${escapeHtml(cert.title)}</h3>
    <p class="cert-meta">Issued to ${escapeHtml(cert.issuer)} on ${escapeHtml(cert.issuedDate)} · score ${cert.score}</p>
  `;
  const snippet = `<a href="#verify=${cert.id}" title="Verify this Human-Made certificate">\n  <img src="humanmark-badge.svg" alt="Human-Made, certified by HumanMark — ${cert.id}">\n</a>`;
  document.getElementById('embed-snippet').value = snippet;
  document.getElementById('certificate-issued').classList.remove('is-hidden');

  renderRegistry();
}

function renderRegistry() {
  const all = [...state.sessionCertificates, ...state.data.certificates];
  const sorted = [...all].sort((a, b) => {
    if (state.sortKey === 'score') return a.score - b.score;
    return b.issuedDate.localeCompare(a.issuedDate);
  });
  const body = document.getElementById('registry-body');
  body.innerHTML = sorted.map(c => `
    <tr>
      <td>${escapeHtml(c.id)}</td>
      <td>${escapeHtml(c.title)}</td>
      <td>${escapeHtml(c.issuer)}</td>
      <td>${escapeHtml(c.category)}</td>
      <td>${c.score}</td>
      <td><span class="status-pill ${c.status === 'Verified' ? 'verified' : 'needs-rescan'}">${escapeHtml(c.status)}</span></td>
      <td>${escapeHtml(c.issuedDate)}</td>
    </tr>
  `).join('');
}

function verifyCertificate(id) {
  const all = [...state.sessionCertificates, ...state.data.certificates];
  const cert = all.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
  const box = document.getElementById('verify-result');
  if (!cert) {
    box.innerHTML = `<div class="verify-card not-found">No certificate found for "${escapeHtml(id.trim())}".</div>`;
    return;
  }
  box.innerHTML = `
    <div class="verify-card">
      <strong>${escapeHtml(cert.title)}</strong><br>
      Issued to ${escapeHtml(cert.issuer)} on ${escapeHtml(cert.issuedDate)} · score ${cert.score} ·
      <span class="status-pill ${cert.status === 'Verified' ? 'verified' : 'needs-rescan'}">${escapeHtml(cert.status)}</span>
    </div>
  `;
}

function wireTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
      btn.classList.add('is-active');
      document.getElementById(`${btn.dataset.view}-view`).classList.add('is-active');
    });
  });
}

function wireScanner() {
  const textarea = document.getElementById('draft-input');
  const wordCount = document.getElementById('word-count');
  textarea.addEventListener('input', () => {
    const n = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    wordCount.textContent = `${n} word${n === 1 ? '' : 's'}`;
  });

  document.getElementById('load-sample-btn').addEventListener('click', () => {
    const idx = document.getElementById('sample-select').value;
    if (idx === '') return;
    textarea.value = state.data.sampleDrafts[idx].text;
    textarea.dispatchEvent(new Event('input'));
  });

  document.getElementById('scan-btn').addEventListener('click', () => {
    const text = textarea.value.trim();
    if (text.split(/\s+/).filter(Boolean).length < 20) {
      alert('Paste at least 20 words for a meaningful scan.');
      return;
    }
    renderScan(text);
  });

  document.getElementById('certify-btn').addEventListener('click', issueCertificate);

  document.getElementById('copy-embed-btn').addEventListener('click', () => {
    const field = document.getElementById('embed-snippet');
    field.select();
    navigator.clipboard?.writeText(field.value).catch(() => {});
  });
}

function wireCertificates() {
  document.getElementById('verify-btn').addEventListener('click', () => {
    verifyCertificate(document.getElementById('verify-input').value);
  });
  document.getElementById('verify-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') verifyCertificate(e.target.value);
  });
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.sortKey = btn.dataset.sort;
      renderRegistry();
    });
  });
}

async function init() {
  const res = await fetch('sample-data.json');
  state.data = await res.json();

  const select = document.getElementById('sample-select');
  state.data.sampleDrafts.forEach((draft, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = draft.label;
    select.appendChild(opt);
  });

  wireTabs();
  wireScanner();
  wireCertificates();
  renderRegistry();
}

init();
