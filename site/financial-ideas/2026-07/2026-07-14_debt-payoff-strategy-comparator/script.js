// Debt Payoff Strategy Comparator
// All monetary arithmetic uses integer cents to avoid binary floating-point drift.

const SAMPLE = [
  { name: 'Chase Sapphire (Credit Card)',  balance: 4200, apr: 24.99, min: 85  },
  { name: 'Capital One Quicksilver',        balance: 2850, apr: 22.49, min: 57  },
  { name: 'Discover it Cash Back',          balance: 1600, apr: 19.99, min: 32  },
  { name: 'Personal Loan',                  balance: 5500, apr: 12.75, min: 150 },
  { name: 'Target RedCard (Store Credit)', balance:  780, apr: 28.99, min: 25  },
];

const EXTRA_DEFAULT = 200;

let balanceChart = null;

document.addEventListener('DOMContentLoaded', () => {
  loadSample();

  document.getElementById('load-sample-btn').addEventListener('click', () => {
    document.getElementById('debt-tbody').innerHTML = '';
    document.getElementById('extra-payment').value = EXTRA_DEFAULT;
    loadSample();
    hideResults();
  });

  document.getElementById('add-row-btn').addEventListener('click', () => addRow(null));
  document.getElementById('compare-btn').addEventListener('click', compare);
});

function loadSample() {
  SAMPLE.forEach(preset => addRow(preset));
}

function addRow(preset) {
  const tbody = document.getElementById('debt-tbody');
  const tr    = document.createElement('tr');

  const nameVal = preset ? escAttr(preset.name) : '';
  const balVal  = preset ? preset.balance        : '';
  const aprVal  = preset ? preset.apr            : '';
  const minVal  = preset ? preset.min            : '';

  tr.innerHTML = `
    <td><input type="text"   class="d-name" value="${nameVal}" placeholder="e.g. Visa card" /></td>
    <td><input type="number" class="d-bal"  value="${balVal}"  min="0.01" step="0.01" placeholder="0.00" /></td>
    <td><input type="number" class="d-apr"  value="${aprVal}"  min="0.01" max="100"   step="0.01" placeholder="0.00" /></td>
    <td><input type="number" class="d-min"  value="${minVal}"  min="1"    step="1"    placeholder="0" /></td>
    <td><button class="btn-remove" title="Remove row" onclick="this.closest('tr').remove()">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Read debt rows from the table. Returns array of objects in cents. */
function readDebts() {
  const rows  = document.querySelectorAll('#debt-tbody tr');
  const debts = [];
  for (const row of rows) {
    const name    = row.querySelector('.d-name').value.trim();
    const balance = parseFloat(row.querySelector('.d-bal').value);
    const apr     = parseFloat(row.querySelector('.d-apr').value);
    const min     = parseFloat(row.querySelector('.d-min').value);

    if (!name || !isFinite(balance) || balance <= 0 ||
                 !isFinite(apr)     || apr     <= 0 ||
                 !isFinite(min)     || min     <= 0) {
      continue;
    }

    debts.push({
      name,
      balanceCents : Math.round(balance * 100),
      aprPct       : apr,
      minCents     : Math.round(min * 100),
    });
  }
  return debts;
}

/**
 * Simulate a debt payoff strategy month-by-month.
 *
 * Each month:
 *   1. Accrue interest on every active debt (integer cents, rounded).
 *   2. Collect extra pool = user extra + freed minimums from already-paid debts.
 *   3. Apply minimum payments to all active debts.
 *   4. Apply extra pool to active debts in priority order (determined by sortFn).
 *
 * @param {object[]} debtsInput         Debt objects with balanceCents/aprPct/minCents.
 * @param {number}   extraCentsPerMonth User-specified extra monthly payment in cents.
 * @param {function} sortFn             Comparator: (a, b) → negative if a has higher priority.
 * @returns {{ months, totalInterestCents, totalPaidCents, monthlyTotals, payoffOrder }}
 */
function computePayoff(debtsInput, extraCentsPerMonth, sortFn) {
  const debts = debtsInput.map(d => ({
    name          : d.name,
    remainingCents: d.balanceCents,
    aprPct        : d.aprPct,
    minCents      : d.minCents,
    paidOff       : false,
    paidOffMonth  : null,
  }));

  let month              = 0;
  let totalInterestCents = 0;

  const startTotal  = debts.reduce((s, d) => s + d.remainingCents, 0);
  const monthlyTotals = [{ month: 0, totalBalanceCents: startTotal }];

  while (debts.some(d => !d.paidOff)) {
    month++;
    if (month > 720) break; // safety cap: 60 years

    // 1. Accrue interest
    for (const d of debts) {
      if (d.paidOff) continue;
      const interest = Math.round(d.remainingCents * (d.aprPct / 100 / 12));
      d.remainingCents   += interest;
      totalInterestCents += interest;
    }

    // 2. Extra pool: user amount + freed minimums from debts already cleared
    const freedCents = debts.filter(d => d.paidOff).reduce((s, d) => s + d.minCents, 0);
    let   pool       = extraCentsPerMonth + freedCents;

    // 3. Apply minimums to every active debt
    for (const d of debts) {
      if (d.paidOff) continue;
      const pay = Math.min(d.remainingCents, d.minCents);
      d.remainingCents -= pay;
      if (d.remainingCents === 0) { d.paidOff = true; d.paidOffMonth = month; }
    }

    // 4. Apply extra pool in priority order
    const active = debts.filter(d => !d.paidOff).sort(sortFn);
    for (const d of active) {
      if (pool <= 0) break;
      const pay = Math.min(d.remainingCents, pool);
      d.remainingCents -= pay;
      pool             -= pay;
      if (d.remainingCents === 0) { d.paidOff = true; d.paidOffMonth = month; }
    }

    const total = debts.reduce((s, d) => s + d.remainingCents, 0);
    monthlyTotals.push({ month, totalBalanceCents: total });
  }

  const principalCents = debtsInput.reduce((s, d) => s + d.balanceCents, 0);
  const payoffOrder    = [...debts]
    .sort((a, b) => (a.paidOffMonth ?? 9999) - (b.paidOffMonth ?? 9999))
    .map(d => ({ name: d.name, month: d.paidOffMonth }));

  return {
    months: month,
    totalInterestCents,
    totalPaidCents: principalCents + totalInterestCents,
    monthlyTotals,
    payoffOrder,
  };
}

function compare() {
  const debts = readDebts();
  if (debts.length === 0) {
    alert('Please add at least one debt with all four fields filled in and greater than zero.');
    return;
  }

  const extraDollars = parseFloat(document.getElementById('extra-payment').value) || 0;
  const extraCents   = Math.round(extraDollars * 100);

  // Avalanche: highest APR first
  const avResult = computePayoff(
    debts, extraCents,
    (a, b) => b.aprPct - a.aprPct,
  );

  // Snowball: lowest remaining balance first
  const swResult = computePayoff(
    debts, extraCents,
    (a, b) => a.remainingCents - b.remainingCents,
  );

  // Populate strategy cards
  setText('av-interest', fmt(avResult.totalInterestCents));
  setText('av-months',   fmtMonths(avResult.months));
  setText('av-total',    fmt(avResult.totalPaidCents));

  setText('sw-interest', fmt(swResult.totalInterestCents));
  setText('sw-months',   fmtMonths(swResult.months));
  setText('sw-total',    fmt(swResult.totalPaidCents));

  // Verdict banner
  const interestDiff = swResult.totalInterestCents - avResult.totalInterestCents; // positive = avalanche wins
  const monthsDiff   = swResult.months - avResult.months;                         // positive = avalanche is faster
  const banner       = document.getElementById('verdict-banner');

  if (interestDiff > 0) {
    const mPart = monthsDiff > 0
      ? ` and reaches debt-free <strong>${monthsDiff} month${monthsDiff > 1 ? 's' : ''} sooner</strong>`
      : '';
    banner.innerHTML  = `<strong>Avalanche saves you ${fmt(interestDiff)} in interest</strong>${mPart}. Targeting the highest-APR debt first minimizes the total cost of borrowing.`;
    banner.className  = 'verdict-banner av-wins';
  } else if (interestDiff < 0) {
    const mPart = -monthsDiff > 0
      ? ` and reaches debt-free <strong>${-monthsDiff} month${-monthsDiff > 1 ? 's' : ''} sooner</strong>`
      : '';
    banner.innerHTML  = `<strong>Snowball saves you ${fmt(-interestDiff)} in interest</strong>${mPart}. Clearing small balances faster frees up more cash flow in this scenario.`;
    banner.className  = 'verdict-banner sw-wins';
  } else {
    banner.innerHTML  = 'Both strategies produce the same total interest and payoff timeline — your debt APRs and balances are balanced enough that order of attack doesn\'t change the outcome.';
    banner.className  = 'verdict-banner tie';
  }

  renderChart(avResult.monthlyTotals, swResult.monthlyTotals);
  renderPayoffOrder(avResult.payoffOrder, swResult.payoffOrder);

  const section = document.getElementById('results-section');
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
  document.getElementById('results-section').classList.add('hidden');
}

function renderChart(avData, swData) {
  const len    = Math.max(avData.length, swData.length);
  const labels = Array.from({ length: len }, (_, i) => i === 0 ? 'Start' : `Mo ${i}`);

  const toArr = data => {
    const arr = data.map(d => +(d.totalBalanceCents / 100).toFixed(2));
    while (arr.length < len) arr.push(0);
    return arr;
  };

  if (balanceChart) {
    balanceChart.destroy();
    balanceChart = null;
  }

  const ctx = document.getElementById('balance-chart').getContext('2d');

  balanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label           : '🏔 Avalanche',
          data            : toArr(avData),
          borderColor     : '#16a34a',
          backgroundColor : 'rgba(22, 163, 74, 0.07)',
          borderWidth     : 2.5,
          pointRadius     : 0,
          fill            : true,
          tension         : 0.3,
        },
        {
          label           : '⛄ Snowball',
          data            : toArr(swData),
          borderColor     : '#d97706',
          backgroundColor : 'rgba(217, 119, 6, 0.05)',
          borderWidth     : 2.5,
          pointRadius     : 0,
          fill            : true,
          tension         : 0.3,
        },
      ],
    },
    options: {
      responsive  : true,
      interaction : { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        title : {
          display: true,
          text   : 'Total Remaining Debt Balance Over Time',
          font   : { size: 13, weight: '600' },
          padding: { bottom: 12 },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 14, font: { size: 11 } },
          title: { display: true, text: 'Month', font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Remaining Balance ($)', font: { size: 11 } },
          ticks: {
            callback : v => '$' + v.toLocaleString('en-US'),
            font     : { size: 11 },
          },
        },
      },
    },
  });
}

function renderPayoffOrder(avOrder, swOrder) {
  const wrap = document.getElementById('payoff-order-wrap');

  const buildList = order =>
    order.map(d => {
      const nameNode  = document.createTextNode(d.name);
      const monthNode = document.createTextNode(` — month ${d.month}`);
      const li        = document.createElement('li');
      li.appendChild(nameNode);
      const span      = document.createElement('span');
      span.className  = 'month-label';
      span.appendChild(monthNode);
      li.appendChild(span);
      return li.outerHTML;
    }).join('');

  wrap.innerHTML = `
    <h3>Payoff Order</h3>
    <div class="payoff-cols">
      <div class="payoff-col av">
        <h4>🏔 Avalanche order</h4>
        <ol>${buildList(avOrder)}</ol>
      </div>
      <div class="payoff-col sw">
        <h4>⛄ Snowball order</h4>
        <ol>${buildList(swOrder)}</ol>
      </div>
    </div>
  `;
}

// ── Helpers ───────────────────────────────────────────────

function setText(id, val) {
  document.getElementById(id).textContent = val;
}

/** Format integer cents as a dollar string. */
function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits : 2,
    maximumFractionDigits : 2,
  });
}

/** Format a month count as "X yr Y mo" or "X mo". */
function fmtMonths(n) {
  if (n < 12) return `${n} mo`;
  const yr = Math.floor(n / 12);
  const mo = n % 12;
  return mo > 0 ? `${yr} yr ${mo} mo` : `${yr} yr`;
}
