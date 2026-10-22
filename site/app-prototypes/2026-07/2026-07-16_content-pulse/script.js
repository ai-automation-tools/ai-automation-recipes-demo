/* Content Pulse — script.js */

let data = null;
let activePlatform = 'all';
let growthChart = null;
let sortCol = 'views';
let sortAsc = false;

async function init() {
  try {
    const res = await fetch('sample-data.json');
    data = await res.json();
  } catch {
    // Inline fallback for file:// — minimal stub so the page isn't blank
    document.querySelector('.dashboard').innerHTML =
      '<p style="padding:40px;color:#8892a4">Please serve this folder via a local HTTP server to load sample data.<br>Run: <code>python3 -m http.server 8000</code></p>';
    return;
  }

  document.getElementById('creatorHandle').textContent =
    `${data.creator.name} · ${data.creator.niche}`;

  buildFilterPills();
  renderSummary();
  renderGrowthChart();
  renderRevenueBars();
  renderPlatformCards();
  renderPostsTable();
}

// ── Helpers ──────────────────────────────────────────────────

function getPlatformMeta(id) {
  return data.platforms.find(p => p.id === id) || { name: id, color: '#888', icon: '?' };
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

function fmtDollar(n) {
  return '$' + n.toLocaleString('en-US');
}

function getActivePlatformStats() {
  if (activePlatform === 'all') return data.platformStats;
  return data.platformStats.filter(s => s.platform === activePlatform);
}

// ── Filter pills ─────────────────────────────────────────────

function buildFilterPills() {
  const container = document.getElementById('filterPills');
  data.platforms.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'pill';
    btn.dataset.platform = p.id;
    btn.style.setProperty('--pill-color', p.color);
    btn.textContent = p.name;
    btn.onclick = () => selectPlatform(p.id);
    container.appendChild(btn);
  });
}

function selectPlatform(id) {
  activePlatform = id;
  document.querySelectorAll('.pill').forEach(b => {
    b.classList.toggle('active', b.dataset.platform === id);
  });
  renderSummary();
  updateGrowthChart();
  renderRevenueBars();
  renderPlatformCards();
  renderPostsTable();
}

// ── Summary bar ───────────────────────────────────────────────

function renderSummary() {
  const stats = getActivePlatformStats();

  const followers = stats.reduce((s, p) => s + p.followers, 0);
  const change    = stats.reduce((s, p) => s + p.followersChange, 0);
  const views     = stats.reduce((s, p) => s + p.viewsThisMonth, 0);
  const revenue   = stats.reduce((s, p) => s + p.revenue, 0);
  const eng       = stats.length
    ? (stats.reduce((s, p) => s + p.avgEngagement, 0) / stats.length).toFixed(1)
    : '—';

  document.getElementById('sumFollowers').textContent    = fmt(followers);
  document.getElementById('sumFollowersSub').textContent = `+${fmt(change)} this week`;
  document.getElementById('sumViews').textContent        = fmt(views);
  document.getElementById('sumEngagement').textContent   = eng + '%';
  document.getElementById('sumRevenue').textContent      = fmtDollar(revenue);
}

// ── Growth chart ──────────────────────────────────────────────

function buildChartDatasets() {
  const weeks = data.followerGrowth.map(w => w.week);
  const platforms = activePlatform === 'all'
    ? data.platforms
    : data.platforms.filter(p => p.id === activePlatform);

  const datasets = platforms.map(p => ({
    label: p.name,
    data: data.followerGrowth.map(w => w[p.id] || 0),
    borderColor: p.color,
    backgroundColor: p.color + '18',
    borderWidth: 2,
    pointRadius: 3,
    pointHoverRadius: 5,
    tension: 0.35,
    fill: activePlatform !== 'all',
  }));

  return { weeks, datasets };
}

function renderGrowthChart() {
  const ctx = document.getElementById('growthChart').getContext('2d');
  const { weeks, datasets } = buildChartDatasets();

  growthChart = new Chart(ctx, {
    type: 'line',
    data: { labels: weeks, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#8892a4', boxWidth: 12, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: '#212537',
          titleColor: '#e8eaf0',
          bodyColor: '#8892a4',
          borderColor: '#2a2f45',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${fmt(ctx.raw)}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#2a2f45' },
          ticks: { color: '#8892a4', font: { size: 11 } }
        },
        y: {
          grid: { color: '#2a2f45' },
          ticks: {
            color: '#8892a4',
            font: { size: 11 },
            callback: v => fmt(v)
          }
        }
      }
    }
  });
}

function updateGrowthChart() {
  if (!growthChart) return;
  const { datasets } = buildChartDatasets();
  growthChart.data.datasets = datasets;
  growthChart.update();
}

// ── Revenue bars ──────────────────────────────────────────────

function renderRevenueBars() {
  const stats = getActivePlatformStats();
  const total = stats.reduce((s, p) => s + p.revenue, 0);
  const container = document.getElementById('revenueBars');
  container.innerHTML = '';

  stats.sort((a, b) => b.revenue - a.revenue).forEach(s => {
    const meta = getPlatformMeta(s.platform);
    const pct  = total > 0 ? (s.revenue / total) * 100 : 0;

    const row = document.createElement('div');
    row.className = 'rev-row';
    row.innerHTML = `
      <div class="rev-meta">
        <span class="rev-platform">
          <span class="rev-dot" style="background:${meta.color}"></span>
          ${meta.name}
        </span>
        <span class="rev-amount">${fmtDollar(s.revenue)}</span>
      </div>
      <div class="rev-track">
        <div class="rev-fill" style="width:${pct.toFixed(1)}%;background:${meta.color}"></div>
      </div>`;
    container.appendChild(row);
  });
}

// ── Platform stat cards ───────────────────────────────────────

function renderPlatformCards() {
  const stats = getActivePlatformStats();
  const container = document.getElementById('platformCards');
  container.innerHTML = '';

  stats.forEach(s => {
    const meta   = getPlatformMeta(s.platform);
    const change = s.followersChange;
    const dir    = change >= 0 ? 'up' : 'down';
    const sign   = change >= 0 ? '+' : '';

    const card = document.createElement('div');
    card.className = 'platform-card';
    card.innerHTML = `
      <div class="pcard-header">
        <div class="pcard-icon" style="background:${meta.color}">${meta.icon}</div>
        <span class="pcard-name">${meta.name}</span>
      </div>
      <div class="pcard-row">
        <span class="pcard-metric">Followers</span>
        <span class="pcard-val">${fmt(s.followers)}</span>
      </div>
      <div class="pcard-row">
        <span class="pcard-metric">This week</span>
        <span class="pcard-change ${dir}">${sign}${fmt(change)}</span>
      </div>
      <div class="pcard-row">
        <span class="pcard-metric">Engagement</span>
        <span class="pcard-val">${s.avgEngagement}%</span>
      </div>
      <div class="pcard-row">
        <span class="pcard-metric">Revenue</span>
        <span class="pcard-val">${fmtDollar(s.revenue)}</span>
      </div>`;
    container.appendChild(card);
  });
}

// ── Posts table ───────────────────────────────────────────────

function renderPostsTable() {
  let posts = activePlatform === 'all'
    ? [...data.topPosts]
    : data.topPosts.filter(p => p.platform === activePlatform);

  posts.sort((a, b) => {
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortAsc ? av - bv : bv - av;
  });

  const tbody = document.getElementById('postsBody');
  tbody.innerHTML = '';

  posts.forEach(post => {
    const meta = getPlatformMeta(post.platform);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="td-platform">
          <span class="td-dot" style="background:${meta.color}"></span>
          ${meta.name}
        </span>
      </td>
      <td class="td-title" title="${post.title}">${post.title}</td>
      <td>${post.date}</td>
      <td class="td-num">${fmt(post.views)}</td>
      <td class="td-num">${fmt(post.likes)}</td>
      <td class="td-eng">${post.engagementRate}%</td>
      <td class="td-rev ${post.revenue === 0 ? 'zero' : ''}">${post.revenue > 0 ? fmtDollar(post.revenue) : '—'}</td>`;
    tbody.appendChild(tr);
  });
}

// ── Column sort ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = false;
      }
      document.querySelectorAll('th.sortable').forEach(h => {
        h.classList.remove('sort-active', 'asc', 'desc');
        const arrow = h.textContent.replace(/ [↑↓]$/, '');
        h.textContent = arrow;
      });
      th.classList.add('sort-active', sortAsc ? 'asc' : 'desc');
      th.textContent = th.textContent.replace(/ [↑↓]$/, '') + (sortAsc ? ' ↑' : ' ↓');
      renderPostsTable();
    });
  });

  init();
});
