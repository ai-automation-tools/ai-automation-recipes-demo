let state = {
  debts: [],
  extraPayment: 300,
  strategy: 'avalanche',
  chart: null
};

async function init() {
  const res = await fetch('sample-data.json');
  const data = await res.json();
  state.debts = data.debts.map(d => ({ ...d }));
  state.extraPayment = data.extraMonthlyPayment;
  state.strategy = data.defaultStrategy;

  document.getElementById('extra-payment').value = state.extraPayment;
  document.querySelector(`[data-strategy="${state.strategy}"]`).classList.add('active');

  renderDebtList();
  runSimulation();
}

function renderDebtList() {
  const list = document.getElementById('debt-list');
  list.innerHTML = state.debts.map((d, i) => `
    <div class="debt-item" data-id="${d.id}">
      <div class="debt-color" style="background:${d.color}"></div>
      <div class="debt-info">
        <span class="debt-name">${d.name}</span>
        <span class="debt-type-tag">${formatType(d.type)}</span>
      </div>
      <div class="debt-numbers">
        <span class="debt-balance">$${d.balance.toLocaleString()}</span>
        <span class="debt-apr">${d.apr}% APR</span>
      </div>
      <button class="remove-btn" onclick="removeDebt('${d.id}')">✕</button>
    </div>
  `).join('');
}

function formatType(type) {
  return { credit_card: 'Credit Card', student_loan: 'Student Loan', auto_loan: 'Auto Loan', personal_loan: 'Personal Loan', medical: 'Medical' }[type] || type;
}

function simulate(debts, extraPayment, strategy) {
  if (!debts.length) return { months: [], payoffOrder: [], totalInterest: 0, monthsToFree: 0 };

  let pool = debts.map(d => ({ ...d, remaining: d.balance, paid: false }));
  const monthlyRate = d => d.apr / 100 / 12;

  function sortPool(p) {
    const active = p.filter(d => !d.paid);
    if (strategy === 'avalanche') active.sort((a, b) => b.apr - a.apr);
    else active.sort((a, b) => a.remaining - b.remaining);
    return active;
  }

  let months = [];
  let totalInterest = 0;
  let month = 0;
  const MAX_MONTHS = 480;

  while (pool.some(d => !d.paid) && month < MAX_MONTHS) {
    month++;
    let snapshot = {};
    let extraLeft = extraPayment;

    // Apply interest first
    pool.forEach(d => {
      if (d.paid) return;
      const interest = d.remaining * monthlyRate(d);
      totalInterest += interest;
      d.remaining += interest;
    });

    // Pay minimums
    pool.forEach(d => {
      if (d.paid) return;
      const payment = Math.min(d.minPayment, d.remaining);
      d.remaining -= payment;
      if (d.remaining < 0.01) { d.remaining = 0; d.paid = true; }
    });

    // Redirect freed minimums
    pool.filter(d => d.paid).forEach(() => { /* minimums already freed in extraLeft pool */ });

    // Apply extra to priority debt
    const sorted = sortPool(pool);
    for (const target of sorted) {
      if (extraLeft <= 0) break;
      const payment = Math.min(extraLeft, target.remaining);
      target.remaining -= payment;
      extraLeft -= payment;
      if (target.remaining < 0.01) { target.remaining = 0; target.paid = true; }
    }

    pool.forEach(d => { snapshot[d.id] = Math.max(0, d.remaining); });
    months.push({ month, balances: { ...snapshot } });
  }

  const payoffOrder = debts.map(d => {
    const idx = months.findIndex(m => m.balances[d.id] === 0);
    return { id: d.id, name: d.name, payoffMonth: idx >= 0 ? idx + 1 : null, color: d.color };
  }).sort((a, b) => (a.payoffMonth || 999) - (b.payoffMonth || 999));

  return { months, payoffOrder, totalInterest, monthsToFree: months.length };
}

function runSimulation() {
  if (!state.debts.length) {
    showEmptyState();
    return;
  }

  const extra = parseFloat(document.getElementById('extra-payment').value) || 0;
  state.extraPayment = extra;

  const ava = simulate(state.debts, extra, 'avalanche');
  const snow = simulate(state.debts, extra, 'snowball');
  const current = state.strategy === 'avalanche' ? ava : snow;
  const minOnly = simulate(state.debts, 0, 'avalanche');

  updateSummaryCards(current, minOnly, ava, snow);
  renderChart(current, ava, snow);
  renderPayoffSchedule(current);
}

function updateSummaryCards(current, minOnly, ava, snow) {
  const freeDate = monthsToDate(current.monthsToFree);
  document.getElementById('debt-free-date').textContent = freeDate;
  document.getElementById('months-to-free').textContent = `${current.monthsToFree} months`;

  const interestSaved = minOnly.totalInterest - current.totalInterest;
  document.getElementById('interest-saved').textContent = `$${Math.round(interestSaved).toLocaleString()}`;
  document.getElementById('total-interest').textContent = `$${Math.round(current.totalInterest).toLocaleString()} total interest`;

  const totalDebt = state.debts.reduce((s, d) => s + d.balance, 0);
  document.getElementById('total-debt').textContent = `$${totalDebt.toLocaleString()}`;
  document.getElementById('debt-count').textContent = `${state.debts.length} account${state.debts.length !== 1 ? 's' : ''}`;

  const avaDiff = snow.monthsToFree - ava.monthsToFree;
  const avaSave = snow.totalInterest - ava.totalInterest;
  document.getElementById('strategy-comparison').innerHTML = avaDiff > 0
    ? `Avalanche saves <strong>$${Math.round(avaSave).toLocaleString()}</strong> and finishes <strong>${avaDiff} month${avaDiff !== 1 ? 's' : ''} sooner</strong> than Snowball.`
    : avaDiff < 0
    ? `Snowball finishes <strong>${-avaDiff} month${-avaDiff !== 1 ? 's' : ''} sooner</strong>; Avalanche saves <strong>$${Math.round(-avaSave).toLocaleString()}</strong> in interest.`
    : `Both strategies finish at the same time with similar total interest.`;
}

function renderChart(current, ava, snow) {
  const ctx = document.getElementById('payoff-chart').getContext('2d');
  if (state.chart) state.chart.destroy();

  const maxMonths = Math.max(current.monthsToFree, 12);
  const labels = Array.from({ length: maxMonths }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i + 1);
    return i % 12 === 0 || i === maxMonths - 1 ? d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '';
  });

  // Build stacked datasets for current strategy
  const datasets = state.debts.map(debt => ({
    label: debt.name,
    data: current.months.slice(0, maxMonths).map(m => Math.round(m.balances[debt.id] || 0)),
    backgroundColor: hexToRgba(debt.color, 0.75),
    borderColor: debt.color,
    borderWidth: 1,
    fill: true
  }));

  state.chart = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`,
            footer: items => `Total: $${items.reduce((s, i) => s + i.raw, 0).toLocaleString()}`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxRotation: 0 } },
        y: {
          stacked: true,
          ticks: { callback: v => `$${(v / 1000).toFixed(0)}k` },
          grid: { color: '#f0f0f0' }
        }
      }
    }
  });
}

function renderPayoffSchedule(current) {
  const tbody = document.getElementById('schedule-body');
  const rows = current.payoffOrder.map(p => {
    const debt = state.debts.find(d => d.id === p.id);
    if (!debt) return '';
    const date = p.payoffMonth ? monthsToDate(p.payoffMonth) : 'N/A';
    const interest = calculateDebtInterest(debt, current);
    return `
      <tr>
        <td><span class="dot" style="background:${debt.color}"></span>${debt.name}</td>
        <td>$${debt.balance.toLocaleString()}</td>
        <td>${debt.apr}%</td>
        <td>$${Math.round(interest).toLocaleString()}</td>
        <td><span class="payoff-date">${date}</span></td>
      </tr>`;
  });
  tbody.innerHTML = rows.join('');
}

function calculateDebtInterest(debt, result) {
  // Approximate interest paid for this debt from simulation
  const monthlyRate = debt.apr / 100 / 12;
  let bal = debt.balance;
  let totalInterest = 0;
  for (let i = 0; i < result.monthsToFree && bal > 0.01; i++) {
    const interest = bal * monthlyRate;
    totalInterest += interest;
    const m = result.months[i];
    if (m) bal = m.balances[debt.id] || 0;
    else bal = 0;
  }
  return totalInterest;
}

function monthsToDate(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function setStrategy(s) {
  state.strategy = s;
  document.querySelectorAll('.strategy-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-strategy="${s}"]`).classList.add('active');
  runSimulation();
}

function showAddDebtModal() {
  document.getElementById('debt-modal').classList.add('visible');
  document.getElementById('modal-name').focus();
}

function closeModal() {
  document.getElementById('debt-modal').classList.remove('visible');
  document.getElementById('add-debt-form').reset();
}

function addDebt(e) {
  e.preventDefault();
  const colors = ['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6','#1abc9c','#e91e63'];
  const newDebt = {
    id: `debt-${Date.now()}`,
    name: document.getElementById('modal-name').value,
    type: document.getElementById('modal-type').value,
    balance: parseFloat(document.getElementById('modal-balance').value),
    apr: parseFloat(document.getElementById('modal-apr').value),
    minPayment: parseFloat(document.getElementById('modal-min').value),
    color: colors[state.debts.length % colors.length]
  };
  state.debts.push(newDebt);
  closeModal();
  renderDebtList();
  runSimulation();
}

function removeDebt(id) {
  state.debts = state.debts.filter(d => d.id !== id);
  renderDebtList();
  runSimulation();
}

function showEmptyState() {
  document.getElementById('debt-free-date').textContent = '—';
  document.getElementById('months-to-free').textContent = 'add debts to start';
  document.getElementById('interest-saved').textContent = '—';
  document.getElementById('total-interest').textContent = '';
  document.getElementById('total-debt').textContent = '$0';
  document.getElementById('debt-count').textContent = '0 accounts';
  document.getElementById('strategy-comparison').textContent = 'Add debts above to see your payoff plan.';
  document.getElementById('schedule-body').innerHTML = '<tr><td colspan="5" style="text-align:center;color:#aaa;padding:24px">No debts added yet</td></tr>';
  if (state.chart) { state.chart.destroy(); state.chart = null; }
}

document.getElementById('extra-payment').addEventListener('input', () => runSimulation());
document.getElementById('add-debt-form').addEventListener('submit', addDebt);
document.getElementById('debt-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('debt-modal')) closeModal();
});

init();
