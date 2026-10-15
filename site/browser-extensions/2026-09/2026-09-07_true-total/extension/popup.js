// Shared between the real extension popup (extension/popup.html) and the demo
// harness (index.html embeds this same file). Every chrome.* call is guarded
// so this runs the same whether or not the extension APIs exist.
const inExtension = typeof chrome !== "undefined" && !!chrome?.storage?.local;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadState() {
  if (inExtension) {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (!tab?.id) return resolve(null);
        chrome.tabs.sendMessage(tab.id, { type: "TRUETOTAL_GET_STATE" }, (response) => {
          if (chrome.runtime.lastError || !response) {
            resolve(null);
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  // Demo harness: the mock page stands in for the content script. It exposes
  // its current simulated checkout state directly instead of via
  // chrome.tabs messaging, since there's no real tab to message.
  if (typeof window.__ttGetState === "function") {
    return window.__ttGetState();
  }
  const data = await fetch("sample-data.json").then((r) => r.json());
  return data.initialState ?? null;
}

function exportReport(state, total) {
  const lateFees = (state.lineItems || []).filter((item) => item.revealedAfterBase);
  const lines = [
    "TrueTotal evidence report",
    `Site: ${state.site}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    `Advertised price: $${(state.baseAdvertised || 0).toFixed(2)}`,
    "Fees added after the advertised price was shown:",
    ...(lateFees.length
      ? lateFees.map((i) => `  - ${capitalize(i.label)}: $${i.amount.toFixed(2)}`)
      : ["  (none detected)"]),
    "",
    `True total: $${total.toFixed(2)}`,
    "",
    "Relevant to the FTC's Junk Fees Rule (16 CFR Part 464), which requires the",
    "total price to be displayed more prominently than any other pricing",
    "information for live-event tickets and short-term lodging.",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `truetotal-report-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderState(state) {
  const siteEl = document.getElementById("tt-site");
  const amountEl = document.getElementById("tt-total-amount");
  const deltaEl = document.getElementById("tt-delta-badge");
  const listEl = document.getElementById("tt-line-items");
  const exportBtn = document.getElementById("tt-export-btn");
  if (!siteEl) return; // popup markup not mounted yet (harness panel closed)

  const hasData = state && (state.baseAdvertised != null || (state.lineItems || []).length);
  if (!hasData) {
    siteEl.textContent = inExtension
      ? "Open a Ticketmaster or Airbnb checkout to start tracking."
      : "Waiting for the mock checkout to load a price.";
    amountEl.textContent = "—";
    deltaEl.textContent = "";
    listEl.innerHTML = '<li class="tt-empty">No checkout detected yet.</li>';
    exportBtn.disabled = true;
    exportBtn.onclick = null;
    return;
  }

  siteEl.textContent = state.site || "current checkout";
  const total =
    state.total ?? (state.baseAdvertised || 0) + (state.lineItems || []).reduce((s, i) => s + i.amount, 0);
  amountEl.textContent = `$${total.toFixed(2)}`;

  const feeSum = (state.lineItems || []).reduce((s, i) => s + i.amount, 0);
  if (feeSum > 0 && state.baseAdvertised) {
    const pct = Math.round((feeSum / state.baseAdvertised) * 100);
    deltaEl.textContent = `+${pct}% above the price you were first shown`;
  } else {
    deltaEl.textContent = "";
  }

  listEl.innerHTML = "";
  if (state.baseAdvertised != null) {
    const li = document.createElement("li");
    li.innerHTML = `<span>Advertised price</span><span>$${state.baseAdvertised.toFixed(2)}</span>`;
    listEl.appendChild(li);
  }
  (state.lineItems || []).forEach((item) => {
    const li = document.createElement("li");
    const lateTag = item.revealedAfterBase ? '<span class="tt-late-tag">added later</span>' : "";
    li.innerHTML = `<span>${capitalize(item.label)}${lateTag}</span><span>$${item.amount.toFixed(2)}</span>`;
    listEl.appendChild(li);
  });

  exportBtn.disabled = false;
  exportBtn.onclick = () => exportReport(state, total);
}

async function init() {
  const state = await loadState();
  renderState(state);
  if (!inExtension) {
    window.addEventListener("tt:state-changed", (e) => renderState(e.detail));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();

  const premiumFeatures = [
    "Price-history graph for this listing",
    "One-click FTC / state AG complaint export",
    "Alerts when a saved listing's fees change",
  ];
  const premiumList = document.getElementById("tt-premium-preview");
  if (premiumList) {
    premiumList.innerHTML = premiumFeatures.map((f) => `<li>${f}</li>`).join("");
  }

  const upgradeBtn = document.getElementById("tt-upgrade-btn");
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", () => {
      upgradeBtn.textContent = "Not wired up in this prototype";
      upgradeBtn.disabled = true;
    });
  }
});
