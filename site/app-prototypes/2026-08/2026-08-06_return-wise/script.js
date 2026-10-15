const DAY_MS = 24 * 60 * 60 * 1000;
const TODAY = new Date("2026-08-06T00:00:00");

let retailers = [];
let trackedReturns = [];

async function loadData() {
  const res = await fetch("sample-data.json");
  const data = await res.json();
  retailers = data.retailers;
  trackedReturns = data.trackedReturns.map((r) => ({ ...r }));
}

function retailerById(id) {
  return retailers.find((r) => r.id === id);
}

function returnCost(retailer, price, opened, method) {
  if (method === "store") {
    return { fee: 0, feeLabel: "In-store returns are free at every retailer in this sample.", net: price };
  }
  let fee = 0;
  const parts = [];
  if (retailer.mailReturnFee.type === "flat" && retailer.mailReturnFee.amount > 0) {
    fee += retailer.mailReturnFee.amount;
    parts.push(`Mail label fee: $${retailer.mailReturnFee.amount.toFixed(2)}`);
  }
  if (retailer.restockingFee.type === "percent") {
    const appliesToOpenedOnly = retailer.restockingFee.condition && retailer.restockingFee.condition.includes("opened");
    if (!appliesToOpenedOnly || opened) {
      const amount = price * retailer.restockingFee.amount;
      fee += amount;
      parts.push(`Restocking fee (${Math.round(retailer.restockingFee.amount * 100)}%): $${amount.toFixed(2)}`);
    }
  }
  const net = Math.max(0, price - fee);
  return { fee, parts, net };
}

function fillRetailerSelect(select) {
  select.innerHTML = retailers
    .map((r) => `<option value="${r.id}">${r.name}</option>`)
    .join("");
}

function renderCalculator() {
  const retailerId = document.getElementById("calc-retailer").value;
  const price = parseFloat(document.getElementById("calc-price").value) || 0;
  const opened = document.getElementById("calc-opened").checked;
  const method = document.querySelector('input[name="method"]:checked').value;
  const retailer = retailerById(retailerId);
  if (!retailer) return;

  const result = returnCost(retailer, price, opened, method);
  const effectivePct = price > 0 ? Math.round((result.fee / price) * 100) : 0;

  const breakdownRows =
    method === "store"
      ? `<div><span>In-store return</span><span>$0.00</span></div>`
      : (result.parts.length
          ? result.parts.map((p) => {
              const [label, amt] = p.split(": ");
              return `<div><span>${label}</span><span>${amt}</span></div>`;
            }).join("")
          : `<div><span>No fees found for this retailer</span><span>$0.00</span></div>`);

  const flag =
    result.fee === 0
      ? `<div class="result-flag ok">This return costs you nothing but the wait.</div>`
      : `<div class="result-flag warn">You'd give up ${effectivePct}% of the refund to return this by mail.</div>`;

  document.getElementById("calc-result").innerHTML = `
    <div class="result-headline">You'd get back</div>
    <div class="result-amount">$${result.net.toFixed(2)}</div>
    <div class="result-sub">of the $${price.toFixed(2)} you paid at ${retailer.name}, ${method === "store" ? "returning in store" : "mailing it back"}</div>
    <div class="result-breakdown">
      ${breakdownRows}
      <div class="total"><span>Refund you'd actually receive</span><span>$${result.net.toFixed(2)}</span></div>
    </div>
    ${flag}
  `;
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - TODAY) / DAY_MS);
}

function deadlineFor(tracked) {
  const retailer = retailerById(tracked.retailerId);
  const purchase = new Date(tracked.purchaseDate + "T00:00:00");
  const deadline = new Date(purchase.getTime() + retailer.windowDays * DAY_MS);
  return deadline;
}

function renderTracker() {
  const list = document.getElementById("tracker-list");
  if (trackedReturns.length === 0) {
    list.innerHTML = `<p class="compare-note">Nothing tracked yet. Add a purchase to start the countdown.</p>`;
    return;
  }

  const rows = [...trackedReturns]
    .sort((a, b) => deadlineFor(a) - deadlineFor(b))
    .map((t) => {
      const retailer = retailerById(t.retailerId);
      const deadline = deadlineFor(t);
      const daysLeft = Math.ceil((deadline - TODAY) / DAY_MS);
      const urgency = daysLeft <= 4 ? "urgent" : daysLeft <= 12 ? "soon" : "ok";
      const cost = returnCost(retailer, t.price, t.opened, t.method);
      const deadlineLabel =
        daysLeft < 0
          ? "Window closed"
          : daysLeft === 0
          ? "Last day"
          : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;

      return `
        <div class="tracker-row ${urgency}" data-id="${t.id}">
          <div class="tracker-item">
            <strong>${t.item}</strong>
            <span>${retailer.name} · $${t.price.toFixed(2)} · ${t.opened ? "opened" : "unopened"}</span>
          </div>
          <div class="tracker-deadline">
            <span class="pill ${urgency}">${deadlineLabel}</span><br />
            <span>by ${deadline.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </div>
          <div class="tracker-cost">
            <strong>$${cost.net.toFixed(2)}</strong>
            <span>if mailed today</span>
          </div>
          <button class="remove-btn" data-remove="${t.id}">Remove</button>
        </div>
      `;
    })
    .join("");

  list.innerHTML = rows;

  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      trackedReturns = trackedReturns.filter((t) => t.id !== btn.dataset.remove);
      renderTracker();
    });
  });
}

function renderCompare() {
  const price = 100;
  const rows = retailers
    .map((r) => {
      const cost = returnCost(r, price, true, "mail");
      return { name: r.name, fee: cost.fee };
    })
    .sort((a, b) => b.fee - a.fee);

  const maxFee = Math.max(...rows.map((r) => r.fee), 1);

  document.getElementById("compare-list").innerHTML = rows
    .map((r) => {
      const free = r.fee === 0;
      const widthPct = free ? 2 : Math.max(4, Math.round((r.fee / maxFee) * 100));
      return `
        <div class="compare-row ${free ? "free" : ""}">
          <span>${r.name}</span>
          <span class="compare-bar-track"><span class="compare-bar-fill" style="width:${widthPct}%"></span></span>
          <span class="compare-amount">${free ? "$0" : "$" + r.fee.toFixed(2)}</span>
        </div>
      `;
    })
    .join("");
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function setupCalculator() {
  const form = document.getElementById("calc-form");
  form.addEventListener("input", renderCalculator);
  form.addEventListener("change", renderCalculator);
}

function setupAddReturnDialog() {
  const dialog = document.getElementById("add-return-dialog");
  const form = document.getElementById("add-return-form");
  document.getElementById("add-return-btn").addEventListener("click", () => {
    document.getElementById("new-date").value = "2026-08-06";
    dialog.showModal();
  });
  document.getElementById("cancel-add-return").addEventListener("click", () => dialog.close());

  form.addEventListener("submit", () => {
    const id = "r" + Math.random().toString(36).slice(2, 8);
    trackedReturns.push({
      id,
      retailerId: document.getElementById("new-retailer").value,
      item: document.getElementById("new-item").value || "Untitled item",
      price: parseFloat(document.getElementById("new-price").value) || 0,
      opened: document.getElementById("new-opened").checked,
      purchaseDate: document.getElementById("new-date").value,
      method: "mail",
    });
    form.reset();
    renderTracker();
  });
}

async function init() {
  await loadData();
  fillRetailerSelect(document.getElementById("calc-retailer"));
  fillRetailerSelect(document.getElementById("new-retailer"));
  setupTabs();
  setupCalculator();
  setupAddReturnDialog();
  renderCalculator();
  renderTracker();
  renderCompare();
}

init();
