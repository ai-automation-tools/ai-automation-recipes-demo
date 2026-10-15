// Membership Break-Even Calculator
// All monetary arithmetic uses integer cents to avoid binary floating-point drift.

// Mirrors sample-data.json. Embedded directly (rather than fetched) so the app
// still works when opened straight from file:// — fetch() of a local JSON file
// is blocked by CORS in most browsers under the file:// protocol.
const RETAILERS = [
  {
    id: 'costco',
    name: 'Costco',
    tiers: [
      { id: 'gold-star', label: 'Gold Star', annualFeeCents: 6500, rewardRate: 0, rewardCapCents: 0, upgradeOf: null,
        notes: 'Full warehouse, Costco.com, food court, and pharmacy access. No annual reward.' },
      { id: 'executive', label: 'Executive', annualFeeCents: 13000, rewardRate: 0.02, rewardCapCents: 125000, upgradeOf: 'gold-star',
        notes: 'Includes the $65 Gold Star base plus a $65 Executive upgrade. 2% back on qualifying Costco, Costco.com, and Costco Travel purchases, capped at $1,250/yr.' },
    ],
  },
  {
    id: 'sams-club',
    name: "Sam's Club",
    tiers: [
      { id: 'club', label: 'Club', annualFeeCents: 6000, rewardRate: 0, rewardCapCents: 0, upgradeOf: null,
        notes: 'Standard membership, no Sam’s Cash reward.' },
      { id: 'plus', label: 'Plus', annualFeeCents: 12000, rewardRate: 0.02, rewardCapCents: 75000, upgradeOf: 'club',
        notes: '2% Sam’s Cash on qualifying in-club purchases, capped at $750/yr. Also includes early shopping hours and free shipping on orders over $50.' },
    ],
  },
  {
    id: 'bjs',
    name: "BJ's Wholesale",
    tiers: [
      { id: 'club-card', label: 'Club Card', annualFeeCents: 6000, rewardRate: 0, rewardCapCents: 0, upgradeOf: null,
        notes: 'Standard membership, no reward.' },
      { id: 'club-plus', label: 'Club+', annualFeeCents: 12000, rewardRate: 0.02, rewardCapCents: 50000, upgradeOf: 'club-card',
        notes: '2% back on eligible purchases, capped at $500/yr, plus 5¢/gallon off BJ’s gas and two free same-day delivery orders per year.' },
    ],
  },
];

const PRIME_ANNUAL_FEE_CENTS = 13900;
const PRIME_MONTHLY_FEE_CENTS = 1499;

const DEMO_PROFILES = [
  { id: 'family-of-four', label: 'Family of four — weekly warehouse runs',
    annualSpendCents: { costco: 480000, 'sams-club': 0, bjs: 0 }, primeEstimatedValueCents: 30000 },
  { id: 'single-professional', label: 'Single professional — occasional bulk trips',
    annualSpendCents: { costco: 150000, 'sams-club': 0, bjs: 0 }, primeEstimatedValueCents: 15000 },
  { id: 'small-business-owner', label: 'Small business owner — bulk supply runs at two clubs',
    annualSpendCents: { costco: 900000, 'sams-club': 300000, bjs: 0 }, primeEstimatedValueCents: 8000 },
];

document.addEventListener('DOMContentLoaded', () => {
  renderRetailerPanels();
  populateProfileSelect();
  document.getElementById('profile-select').addEventListener('change', onProfileChange);
  document.getElementById('calculate-btn').addEventListener('click', calculate);
});

function renderRetailerPanels() {
  const container = document.getElementById('retailer-panels');
  container.innerHTML = RETAILERS.map(retailer => `
    <section class="panel" id="panel-${retailer.id}">
      <h2>${retailer.name}</h2>
      <label for="spend-${retailer.id}">Your annual spend at ${retailer.name} ($)</label>
      <input type="number" id="spend-${retailer.id}" min="0" step="1" placeholder="e.g. 3000" />
      <p class="field-error" id="error-spend-${retailer.id}">Enter a number 0 or greater.</p>
      <div class="retailer-tiers">
        ${retailer.tiers.map(tier => `
          <div class="tier-card">
            <h3>${tier.label}</h3>
            <div class="tier-fee">${fmtDollars(tier.annualFeeCents)}/yr</div>
            <p class="tier-detail">${tier.notes}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');
}

function populateProfileSelect() {
  const select = document.getElementById('profile-select');
  DEMO_PROFILES.forEach((p, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = p.label;
    select.appendChild(opt);
  });
}

function onProfileChange(e) {
  const idx = e.target.value;
  if (idx === '') return;
  const profile = DEMO_PROFILES[idx];

  RETAILERS.forEach(retailer => {
    const cents = profile.annualSpendCents[retailer.id] ?? 0;
    document.getElementById(`spend-${retailer.id}`).value = (cents / 100).toFixed(0);
  });
  document.getElementById('prime-value').value = (profile.primeEstimatedValueCents / 100).toFixed(0);

  calculate();
}

/** Reads and validates one non-negative dollar input. Returns cents, or null if invalid. */
function readSpendInput(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const raw = input.value.trim();

  if (raw === '') {
    input.classList.remove('invalid');
    error.classList.remove('visible');
    return 0; // blank = not shopping there
  }

  const dollars = parseFloat(raw);
  if (!isFinite(dollars) || dollars < 0) {
    input.classList.add('invalid');
    error.classList.add('visible');
    return null;
  }

  input.classList.remove('invalid');
  error.classList.remove('visible');
  return Math.round(dollars * 100);
}

function calculate() {
  const results = [];
  let anyInvalid = false;

  RETAILERS.forEach(retailer => {
    const spendCents = readSpendInput(`spend-${retailer.id}`, `error-spend-${retailer.id}`);
    if (spendCents === null) { anyInvalid = true; return; }
    results.push(evaluateRetailer(retailer, spendCents));
  });

  const primeValueCents = readSpendInput('prime-value', 'error-spend-prime');
  if (primeValueCents === null) anyInvalid = true;

  if (anyInvalid) return;

  renderRetailerResults(results);
  const primeResult = evaluatePrime(primeValueCents);
  renderPrimeResult(primeResult);
  renderSummary(results, primeResult);

  const section = document.getElementById('results-section');
  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Computes reward, net cost, recommendation, and break-even spend for one retailer's
 * base/upgrade tier pair at the user's entered annual spend.
 */
function evaluateRetailer(retailer, spendCents) {
  const base = retailer.tiers.find(t => t.upgradeOf === null);
  const upgrade = retailer.tiers.find(t => t.upgradeOf === base.id);

  const upgradeRewardCents = Math.min(Math.round(spendCents * upgrade.rewardRate), upgrade.rewardCapCents);
  const baseNetCents = base.annualFeeCents;
  const upgradeNetCents = upgrade.annualFeeCents - upgradeRewardCents;

  const feeDeltaCents = upgrade.annualFeeCents - base.annualFeeCents;
  const capAtFullRate = upgrade.rewardCapCents; // max reward ever earnable
  let breakEvenSpendCents = null;
  let breakEvenBlocked = false;

  if (upgrade.rewardRate > 0) {
    if (capAtFullRate < feeDeltaCents) {
      breakEvenBlocked = true; // reward cap can never cover the fee difference
    } else {
      breakEvenSpendCents = Math.ceil(feeDeltaCents / upgrade.rewardRate);
    }
  } else {
    breakEvenBlocked = true;
  }

  return {
    retailer,
    base,
    upgrade,
    spendCents,
    upgradeRewardCents,
    baseNetCents,
    upgradeNetCents,
    recommended: upgradeNetCents < baseNetCents ? upgrade : base,
    breakEvenSpendCents,
    breakEvenBlocked,
    hasSpend: spendCents > 0,
  };
}

function evaluatePrime(estimatedValueCents) {
  const netCents = estimatedValueCents - PRIME_ANNUAL_FEE_CENTS;
  return {
    estimatedValueCents,
    feeCents: PRIME_ANNUAL_FEE_CENTS,
    netCents,
    worthIt: netCents >= 0,
    hasValue: estimatedValueCents > 0,
  };
}

function renderRetailerResults(results) {
  const container = document.getElementById('retailer-results');
  container.innerHTML = results.map(r => {
    if (!r.hasSpend) {
      return `
        <div class="result-panel skipped">
          <h3>${r.retailer.name}</h3>
          <p class="verdict-line">No spend entered — skipped in the summary. Enter an annual spend estimate above to compare tiers.</p>
        </div>
      `;
    }

    const baseCheaper = r.baseNetCents <= r.upgradeNetCents;
    const maxNet = Math.max(r.baseNetCents, r.upgradeNetCents, 1);

    const verdictClass = r.recommended.id === r.upgrade.id ? 'wins' : '';
    const verdictText = r.recommended.id === r.upgrade.id
      ? `<strong>${r.upgrade.label} pays for itself</strong> at ${fmtDollars(r.spendCents)}/yr spend — its ${fmtDollars(r.upgradeRewardCents)} reward more than covers the ${fmtDollars(r.upgrade.annualFeeCents - r.base.annualFeeCents)} extra fee, netting ${fmtDollars(r.baseNetCents - r.upgradeNetCents)} cheaper than ${r.base.label}.`
      : `<strong>${r.base.label} is cheaper</strong> at ${fmtDollars(r.spendCents)}/yr spend — the ${fmtDollars(r.upgradeRewardCents)} reward from ${r.upgrade.label} doesn't cover its extra ${fmtDollars(r.upgrade.annualFeeCents - r.base.annualFeeCents)} fee.`;

    const breakEvenNote = r.breakEvenBlocked
      ? `<div class="breakeven-note blocked">The ${r.upgrade.label} reward cap (${fmtDollars(r.upgrade.rewardCapCents)}/yr) is below the ${fmtDollars(r.upgrade.annualFeeCents - r.base.annualFeeCents)} fee difference — this upgrade can't fully pay for itself from rewards alone at any spend level.</div>`
      : `<div class="breakeven-note">Break-even: spend at least <strong>${fmtDollars(r.breakEvenSpendCents)}/yr</strong> at ${r.retailer.name} for ${r.upgrade.label}'s reward to fully offset its extra fee over ${r.base.label}.</div>`;

    return `
      <div class="result-panel">
        <h3>${r.retailer.name}</h3>
        <p class="verdict-line ${verdictClass}">${verdictText}</p>
        <div class="bar-row">
          <span class="bar-label">${r.base.label}</span>
          <div class="bar-track"><div class="bar-fill ${baseCheaper ? 'cheaper' : ''}" style="width:${(r.baseNetCents / maxNet) * 100}%"></div></div>
          <span class="bar-value">${fmtDollars(r.baseNetCents)}</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">${r.upgrade.label}</span>
          <div class="bar-track"><div class="bar-fill ${!baseCheaper ? 'cheaper' : ''}" style="width:${(r.upgradeNetCents / maxNet) * 100}%"></div></div>
          <span class="bar-value">${fmtDollars(r.upgradeNetCents)}</span>
        </div>
        ${breakEvenNote}
      </div>
    `;
  }).join('');
}

function renderPrimeResult(p) {
  const container = document.getElementById('amazon-result');
  if (!p.hasValue) {
    container.innerHTML = `
      <div class="result-panel skipped">
        <h3>Amazon Prime</h3>
        <p class="verdict-line">No estimated value entered — skipped in the summary.</p>
      </div>
    `;
    return;
  }

  const verdictClass = p.worthIt ? 'wins' : 'loses';
  const verdictText = p.worthIt
    ? `<strong>Worth it at your estimate</strong> — you value Prime at ${fmtDollars(p.estimatedValueCents)}/yr against a ${fmtDollars(p.feeCents)}/yr fee, a net of ${fmtDollars(p.netCents)}.`
    : `<strong>Not worth it at your estimate</strong> — you value Prime at ${fmtDollars(p.estimatedValueCents)}/yr, which is ${fmtDollars(-p.netCents)} short of the ${fmtDollars(p.feeCents)}/yr fee.`;

  container.innerHTML = `
    <div class="result-panel">
      <h3>Amazon Prime</h3>
      <p class="verdict-line ${verdictClass}">${verdictText}</p>
      <p class="tier-detail">No purchase-based reward exists here, so there's no break-even spend to compute — only whether your own estimate of the perks clears the fee.</p>
    </div>
  `;
}

function renderSummary(results, primeResult) {
  const active = results.filter(r => r.hasSpend);

  let totalFeeCents = 0;
  let totalRewardCents = 0;
  active.forEach(r => {
    totalFeeCents += r.recommended.annualFeeCents;
    totalRewardCents += r.recommended.id === r.upgrade.id ? r.upgradeRewardCents : 0;
  });

  if (primeResult.hasValue) {
    totalFeeCents += primeResult.feeCents;
  }

  const totalNetCents = totalFeeCents - totalRewardCents;
  const monthlyEquivCents = Math.round(totalNetCents / 12);

  const container = document.getElementById('summary-cards');
  container.innerHTML = `
    <div class="card">
      <span class="card-label">Memberships counted</span>
      <span class="card-value">${active.length + (primeResult.hasValue ? 1 : 0)}</span>
    </div>
    <div class="card">
      <span class="card-label">Total fees (recommended tiers)</span>
      <span class="card-value">${fmtDollars(totalFeeCents)}</span>
    </div>
    <div class="card">
      <span class="card-label">Total rewards earned</span>
      <span class="card-value">${fmtDollars(totalRewardCents)}</span>
    </div>
    <div class="card">
      <span class="card-label">Net annual cost</span>
      <span class="card-value">${fmtDollars(totalNetCents)} <span style="font-size:0.7rem;color:var(--text-muted);font-weight:600;">(${fmtDollars(monthlyEquivCents)}/mo)</span></span>
    </div>
  `;
}

// ── Helpers ───────────────────────────────────────────────

/** Format integer cents as a dollar string. */
function fmtDollars(cents) {
  return '$' + (cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
