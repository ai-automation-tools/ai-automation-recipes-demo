// Refinance Break-Even Calculator
// All monetary arithmetic uses integer cents to avoid binary floating-point drift.

const SAFETY_CAP_MONTHS = 480; // 40 years

// Mirrors sample-data.json. Embedded directly (rather than fetched) so the app
// still works when opened straight from file:// — fetch() of a local JSON file
// is blocked by CORS in most browsers under the file:// protocol.
const SAMPLE_SCENARIOS = [
  { label: '30-yr mortgage, rate improved 0.54 pts', loanType: 'Mortgage', currentBalance: 320000, currentApr: 7.25, currentRemainingMonths: 336, newApr: 6.71, newTermMonths: 336, closingCosts: 9600, planToStayMonths: 84 },
  { label: '30-yr mortgage, term reset trap', loanType: 'Mortgage', currentBalance: 250000, currentApr: 6.10, currentRemainingMonths: 300, newApr: 5.90, newTermMonths: 360, closingCosts: 7500, planToStayMonths: 36 },
  { label: '15-yr mortgage refi, kept short term', loanType: 'Mortgage', currentBalance: 180000, currentApr: 6.85, currentRemainingMonths: 150, newApr: 6.18, newTermMonths: 150, closingCosts: 5400, planToStayMonths: 150 },
  { label: 'Mortgage refi with points bought down', loanType: 'Mortgage', currentBalance: 410000, currentApr: 6.95, currentRemainingMonths: 348, newApr: 5.75, newTermMonths: 348, closingCosts: 16400, planToStayMonths: 180 },
  { label: 'Cash-strapped move, refi too soon', loanType: 'Mortgage', currentBalance: 295000, currentApr: 6.60, currentRemainingMonths: 312, newApr: 6.10, newTermMonths: 312, closingCosts: 8850, planToStayMonths: 18 },
  { label: 'Auto loan, credit union refi', loanType: 'Auto', currentBalance: 18500, currentApr: 9.90, currentRemainingMonths: 48, newApr: 6.50, newTermMonths: 48, closingCosts: 250, planToStayMonths: 48 },
  { label: 'Auto loan, near-zero-cost refi', loanType: 'Auto', currentBalance: 11200, currentApr: 11.25, currentRemainingMonths: 30, newApr: 7.90, newTermMonths: 30, closingCosts: 25, planToStayMonths: 30 },
  { label: 'Personal loan consolidation', loanType: 'Personal', currentBalance: 12000, currentApr: 18.99, currentRemainingMonths: 36, newApr: 11.50, newTermMonths: 36, closingCosts: 300, planToStayMonths: 36 },
  { label: 'Private student loan refi', loanType: 'Student', currentBalance: 42000, currentApr: 8.25, currentRemainingMonths: 120, newApr: 6.40, newTermMonths: 120, closingCosts: 0, planToStayMonths: 120 },
  { label: 'Student loan refi, extended term', loanType: 'Student', currentBalance: 28000, currentApr: 7.80, currentRemainingMonths: 84, newApr: 6.90, newTermMonths: 120, closingCosts: 0, planToStayMonths: 60 },
];

let costChart = null;
let sampleScenarios = SAMPLE_SCENARIOS;

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('scenario-select');
  sampleScenarios.forEach((s, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = s.label;
    select.appendChild(opt);
  });

  document.getElementById('scenario-select').addEventListener('change', onScenarioChange);
  document.getElementById('estimate-costs-btn').addEventListener('click', estimateClosingCosts);
  document.getElementById('calculate-btn').addEventListener('click', calculate);
});

function onScenarioChange(e) {
  const idx = e.target.value;
  if (idx === '') return;
  const s = sampleScenarios[idx];

  document.getElementById('loan-type').value      = s.loanType;
  document.getElementById('current-balance').value = s.currentBalance;
  document.getElementById('current-apr').value      = s.currentApr;
  document.getElementById('current-term').value     = s.currentRemainingMonths;
  document.getElementById('new-apr').value          = s.newApr;
  document.getElementById('new-term').value         = s.newTermMonths;
  document.getElementById('closing-costs').value    = s.closingCosts;
  document.getElementById('plan-to-stay').value     = s.planToStayMonths;

  calculate();
}

function estimateClosingCosts() {
  const balance = parseFloat(document.getElementById('current-balance').value);
  if (!isFinite(balance) || balance <= 0) return;
  document.getElementById('closing-costs').value = (balance * 0.03).toFixed(2);
}

/** Standard amortization payment formula. Returns integer cents. */
function amortizedPaymentCents(balanceCents, aprPct, termMonths) {
  const r = aprPct / 100 / 12;
  if (r === 0) return Math.round(balanceCents / termMonths);
  const factor = Math.pow(1 + r, termMonths);
  return Math.round((balanceCents * r * factor) / (factor - 1));
}

/**
 * Simulate a loan month-by-month up to horizonMonths (or payoff, whichever is first).
 * Returns a schedule of { month, cumulativePaidCents, remainingBalanceCents } plus totals.
 */
function simulateLoan(balanceCents, aprPct, termMonths, paymentCents, horizonMonths) {
  const r = aprPct / 100 / 12;
  let balance = balanceCents;
  let cumulativePaid = 0;
  let totalInterest = 0;

  const schedule = [{ month: 0, cumulativePaidCents: 0, remainingBalanceCents: balance }];

  const cap = Math.min(horizonMonths, SAFETY_CAP_MONTHS);
  for (let month = 1; month <= cap; month++) {
    if (balance <= 0) {
      schedule.push({ month, cumulativePaidCents: cumulativePaid, remainingBalanceCents: 0 });
      continue;
    }
    const interest = Math.round(balance * r);
    let payment = paymentCents;
    let principal = payment - interest;

    if (principal >= balance) {
      principal = balance;
      payment = principal + interest;
    }

    balance -= principal;
    cumulativePaid += payment;
    totalInterest += interest;

    schedule.push({ month, cumulativePaidCents: cumulativePaid, remainingBalanceCents: Math.max(balance, 0) });
  }

  return {
    schedule,
    totalInterestCents: totalInterest,
    endingBalanceCents: Math.max(balance, 0),
  };
}

/** True cost at a given month index: payments made so far + remaining balance owed + upfront cost. */
function trueCostAt(schedule, month, upfrontCents) {
  const point = schedule[Math.min(month, schedule.length - 1)];
  return point.cumulativePaidCents + point.remainingBalanceCents + upfrontCents;
}

function calculate() {
  const loanType       = document.getElementById('loan-type').value;
  const balanceDollars  = parseFloat(document.getElementById('current-balance').value);
  const currentApr      = parseFloat(document.getElementById('current-apr').value);
  const currentTerm     = parseInt(document.getElementById('current-term').value, 10);
  const newApr           = parseFloat(document.getElementById('new-apr').value);
  const newTerm           = parseInt(document.getElementById('new-term').value, 10);
  const closingCostsDollars = parseFloat(document.getElementById('closing-costs').value);
  const planToStay        = parseInt(document.getElementById('plan-to-stay').value, 10);

  if (!isFinite(balanceDollars) || balanceDollars <= 0 ||
      !isFinite(currentApr) || currentApr <= 0 ||
      !isFinite(currentTerm) || currentTerm <= 0 ||
      !isFinite(newApr) || newApr <= 0 ||
      !isFinite(newTerm) || newTerm <= 0 ||
      !isFinite(closingCostsDollars) || closingCostsDollars < 0 ||
      !isFinite(planToStay) || planToStay <= 0) {
    alert('Please fill in every field with a positive number (closing costs may be zero).');
    return;
  }

  const balanceCents = Math.round(balanceDollars * 100);
  const closingCents = Math.round(closingCostsDollars * 100);

  const currentPaymentCents = amortizedPaymentCents(balanceCents, currentApr, currentTerm);
  const newPaymentCents     = amortizedPaymentCents(balanceCents, newApr, newTerm);
  const monthlySavingsCents = currentPaymentCents - newPaymentCents;

  // Simple break-even (industry rule of thumb): closing costs / monthly savings.
  let simpleBreakEvenMonths = null;
  if (monthlySavingsCents > 0) {
    simpleBreakEvenMonths = Math.ceil(closingCents / monthlySavingsCents);
  }

  // Simulate both loans out to the longer of the two terms (capped) for the chart and true-cost crossover.
  const simHorizon = Math.min(Math.max(currentTerm, newTerm), SAFETY_CAP_MONTHS);
  const currentSim = simulateLoan(balanceCents, currentApr, currentTerm, currentPaymentCents, simHorizon);
  const newSim      = simulateLoan(balanceCents, newApr, newTerm, newPaymentCents, simHorizon);

  // Term-adjusted break-even: first month where new loan's true cost drops below current's.
  let adjustedBreakEvenMonths = null;
  for (let m = 0; m <= simHorizon; m++) {
    const currentCost = trueCostAt(currentSim.schedule, m, 0);
    const newCost      = trueCostAt(newSim.schedule, m, closingCents);
    if (newCost <= currentCost) {
      adjustedBreakEvenMonths = m;
      break;
    }
  }

  // Verdict at the user's planned horizon.
  const horizonForVerdict = Math.min(planToStay, simHorizon);
  const currentCostAtHorizon = trueCostAt(currentSim.schedule, horizonForVerdict, 0);
  const newCostAtHorizon      = trueCostAt(newSim.schedule, horizonForVerdict, closingCents);
  const diffCents              = currentCostAtHorizon - newCostAtHorizon; // positive = refi wins

  renderSummary(newPaymentCents, monthlySavingsCents, simpleBreakEvenMonths, adjustedBreakEvenMonths);
  renderVerdict(diffCents, planToStay, adjustedBreakEvenMonths, newTerm, currentTerm, loanType);
  renderChart(currentSim.schedule, newSim.schedule, closingCents, planToStay);

  const section = document.getElementById('results-section');
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderSummary(newPaymentCents, monthlySavingsCents, simpleBreakEvenMonths, adjustedBreakEvenMonths) {
  setText('new-payment', fmt(newPaymentCents) + '/mo');

  const savingsEl = document.getElementById('monthly-savings');
  savingsEl.textContent = (monthlySavingsCents >= 0 ? '+' : '−') + fmt(Math.abs(monthlySavingsCents)) + '/mo';
  savingsEl.style.color = monthlySavingsCents >= 0 ? 'var(--green-dark)' : 'var(--red)';

  setText('simple-breakeven', simpleBreakEvenMonths === null ? 'Never — payment doesn\'t decrease' : fmtMonths(simpleBreakEvenMonths));
  setText('adjusted-breakeven', adjustedBreakEvenMonths === null ? 'Beyond ' + SAFETY_CAP_MONTHS + ' mo' : fmtMonths(adjustedBreakEvenMonths));
}

function renderVerdict(diffCents, planToStay, adjustedBreakEvenMonths, newTerm, currentTerm, loanType) {
  const banner = document.getElementById('verdict-banner');
  const termResetsLonger = newTerm > currentTerm;

  if (diffCents > 0) {
    banner.className = 'verdict-banner wins';
    banner.innerHTML = `<strong>Refinancing this ${loanType.toLowerCase()} loan saves you ${fmt(diffCents)}</strong> over your planned ${fmtMonths(planToStay)}, counting closing costs and the balance you'd still owe at that point.`;
  } else if (diffCents < 0) {
    banner.className = 'verdict-banner loses';
    banner.innerHTML = `<strong>Refinancing costs you ${fmt(-diffCents)} more</strong> over your planned ${fmtMonths(planToStay)} than keeping the current loan — the closing costs (and, if applicable, a longer term) outweigh the lower rate on this timeline.`;
  } else {
    banner.className = 'verdict-banner';
    banner.innerHTML = `Refinancing and keeping the current loan cost about the same over your planned ${fmtMonths(planToStay)} — this one's a toss-up.`;
  }

  if (termResetsLonger && diffCents > 0) {
    banner.innerHTML += ` <span class="term-note">Note: the new term is longer than your current remaining term, so this "win" comes partly from spreading payments out further — you'll owe a larger balance at the ${fmtMonths(planToStay)} mark than if you'd kept the current loan on schedule.</span>`;
    banner.className = 'verdict-banner term-warning';
  }
}

function renderChart(currentSchedule, newSchedule, closingCents, planToStay) {
  const len = Math.max(currentSchedule.length, newSchedule.length);
  const labels = Array.from({ length: len }, (_, i) => i === 0 ? 'Start' : `Mo ${i}`);

  const currentArr = currentSchedule.map(p => +((p.cumulativePaidCents + p.remainingBalanceCents) / 100).toFixed(2));
  const newArr      = newSchedule.map(p => +((p.cumulativePaidCents + p.remainingBalanceCents + closingCents) / 100).toFixed(2));

  while (currentArr.length < len) currentArr.push(currentArr[currentArr.length - 1]);
  while (newArr.length < len) newArr.push(newArr[newArr.length - 1]);

  if (costChart) {
    costChart.destroy();
    costChart = null;
  }

  const ctx = document.getElementById('cost-chart').getContext('2d');

  costChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Keep current loan',
          data: currentArr,
          borderColor: '#475569',
          backgroundColor: 'rgba(71, 85, 105, 0.06)',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0.25,
        },
        {
          label: 'Refinance',
          data: newArr,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.08)',
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'True Cost So Far (payments made + closing costs + balance still owed)',
          font: { size: 13, weight: '600' },
          padding: { bottom: 12 },
        },
        tooltip: {
          callbacks: {
            label: c => `${c.dataset.label}: $${c.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          },
        },
        annotation: undefined,
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 14, font: { size: 11 } },
          title: { display: true, text: `Month (your planned stay: ${planToStay} mo)`, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'True Cost ($)', font: { size: 11 } },
          ticks: {
            callback: v => '$' + v.toLocaleString('en-US'),
            font: { size: 11 },
          },
        },
      },
    },
  });
}

// ── Helpers ───────────────────────────────────────────────

function setText(id, val) {
  document.getElementById(id).textContent = val;
}

/** Format integer cents as a dollar string. */
function fmt(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Format a month count as "X yr Y mo" or "X mo". */
function fmtMonths(n) {
  if (n < 12) return `${n} mo`;
  const yr = Math.floor(n / 12);
  const mo = n % 12;
  return mo > 0 ? `${yr} yr ${mo} mo` : `${yr} yr`;
}
