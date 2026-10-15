// Harness logic only. This file stands in for the real browser: it renders the
// mock Ticketmaster checkout page, wires the toolbar button that opens and
// closes the popup panel, and — where noted — simulates what content.js would
// do to a real page (reading revealed prices, injecting the floating badge).

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderEvent(event, site) {
  document.getElementById("event-name").textContent = event.name;
  document.getElementById("event-meta").textContent =
    `${event.venue} · ${event.date} · ${event.section} · via ${site}`;
}

function renderSteps(steps, currentIndex) {
  const el = document.getElementById("checkout-steps");
  el.innerHTML = "";
  steps.forEach((step, i) => {
    const li = document.createElement("li");
    li.textContent = step.label;
    if (i < currentIndex) li.classList.add("done");
    else if (i === currentIndex) li.classList.add("current");
    el.appendChild(li);
  });
}

function renderPriceHistory(history) {
  const body = document.getElementById("price-history-body");
  body.innerHTML = history
    .map(
      (row) =>
        `<tr><td>${row.date}</td><td>${row.site}</td><td>${row.listing}</td>` +
        `<td>$${row.advertised.toFixed(2)}</td><td>$${row.finalTotal.toFixed(2)}</td>` +
        `<td>+${row.feePercent}%</td></tr>`
    )
    .join("");
}

// Named distinctly from popup.js's init() — both files are plain scripts
// sharing one global scope, and a same-named top-level function in each
// would silently overwrite the other's DOMContentLoaded binding.
async function initHarness() {
  const data = await fetch("sample-data.json").then((r) => r.json());
  renderEvent(data.event, data.site);
  renderPriceHistory(data.priceHistory);
  renderSteps(data.steps, -1);

  let stepIndex = -1;
  const state = { site: data.site, baseAdvertised: null, lineItems: [], total: 0, lastUpdated: null };

  // This is the demo's stand-in for chrome.tabs.sendMessage(tabId, {type:
  // "TRUETOTAL_GET_STATE"}) — the real popup asks the content script for its
  // live state; here it asks this closure instead.
  window.__ttGetState = () => ({ ...state, lineItems: [...state.lineItems] });

  const nextBtn = document.getElementById("next-step-btn");
  const orderLines = document.getElementById("order-lines");
  const badge = document.getElementById("tt-badge-sim");

  function applyStep(step) {
    step.reveals.forEach((reveal) => {
      if (reveal.type === "base") {
        state.baseAdvertised = reveal.amount;
      } else {
        state.lineItems.push({
          label: reveal.label,
          amount: reveal.amount,
          revealedAfterBase: state.baseAdvertised != null,
        });
      }
    });
    state.total = (state.baseAdvertised || 0) + state.lineItems.reduce((s, i) => s + i.amount, 0);
    state.lastUpdated = Date.now();
  }

  function renderOrderLines() {
    orderLines.innerHTML = "";
    if (state.baseAdvertised == null && !state.lineItems.length) {
      orderLines.innerHTML = '<li class="empty">Select tickets to begin.</li>';
      return;
    }
    if (state.baseAdvertised != null) {
      const li = document.createElement("li");
      li.innerHTML = `<span>Tickets</span><span>$${state.baseAdvertised.toFixed(2)}</span>`;
      orderLines.appendChild(li);
    }
    state.lineItems.forEach((item) => {
      const li = document.createElement("li");
      if (item.revealedAfterBase) li.classList.add("late");
      li.innerHTML = `<span>${titleCase(item.label)}</span><span>$${item.amount.toFixed(2)}</span>`;
      orderLines.appendChild(li);
    });
  }

  // Simulates content.js's shadow-DOM badge. A real content script injects
  // this into the live page; here script.js updates the same markup directly.
  function renderBadge() {
    if (state.baseAdvertised == null && !state.lineItems.length) return;
    badge.hidden = false;
    document.getElementById("tt-badge-amount").textContent = `$${state.total.toFixed(2)}`;
    const feeSum = state.lineItems.reduce((s, i) => s + i.amount, 0);
    const deltaEl = document.getElementById("tt-badge-delta");
    deltaEl.textContent =
      feeSum > 0 && state.baseAdvertised ? `+${Math.round((feeSum / state.baseAdvertised) * 100)}% in fees` : "";
  }

  nextBtn.addEventListener("click", () => {
    stepIndex += 1;
    if (stepIndex >= data.steps.length) return;
    applyStep(data.steps[stepIndex]);
    renderSteps(data.steps, stepIndex);
    renderOrderLines();
    renderBadge();
    window.dispatchEvent(new CustomEvent("tt:state-changed", { detail: window.__ttGetState() }));
    if (stepIndex === data.steps.length - 1) {
      nextBtn.disabled = true;
      nextBtn.textContent = "Checkout complete";
    }
  });

  document.getElementById("ext-toggle-btn").addEventListener("click", () => {
    const panel = document.getElementById("popup-panel");
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      window.dispatchEvent(new CustomEvent("tt:state-changed", { detail: window.__ttGetState() }));
    }
  });
}

document.addEventListener("DOMContentLoaded", initHarness);
