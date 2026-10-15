// TrueTotal content script — runs on ticketmaster.com and airbnb.com checkout pages.
// Watches the page for price text as it changes and keeps a running "true total,"
// separating the price shown up front from fees that show up later in the flow.

if (!window.__trueTotalInjected) {
  window.__trueTotalInjected = true;

  const FEE_KEYWORDS = [
    "service fee",
    "facility fee",
    "processing fee",
    "convenience fee",
    "delivery fee",
    "cleaning fee",
    "resort fee",
    "occupancy fee",
    "taxes & fees",
    "taxes and fees",
    "order fee",
  ];

  const PRICE_RE = /\$\s?([\d,]+(?:\.\d{2})?)/;

  const state = {
    site: location.hostname.replace(/^www\./, ""),
    baseAdvertised: null,
    lineItems: [],
    firstSeenAt: null,
    lastUpdated: null,
  };

  function parseAmount(text) {
    const m = text.match(PRICE_RE);
    if (!m) return null;
    return Number(m[1].replace(/,/g, ""));
  }

  function findFeeLines() {
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue.trim();
      if (!text || !PRICE_RE.test(text)) continue;
      const context = (node.parentElement?.closest("li,tr,div,span")?.textContent || text).toLowerCase();
      const label = FEE_KEYWORDS.find((k) => context.includes(k));
      if (label) {
        const amount = parseAmount(text);
        if (amount != null) found.push({ label, amount });
      }
    }
    return found;
  }

  function findBaseTotal() {
    const candidates = [];
    document.querySelectorAll('[class*="total" i], [data-testid*="total" i]').forEach((el) => {
      const amount = parseAmount(el.textContent);
      if (amount != null) candidates.push(amount);
    });
    if (candidates.length) return Math.max(...candidates);
    return null;
  }

  function currentTotal() {
    const feeSum = state.lineItems.reduce((sum, item) => sum + item.amount, 0);
    return (state.baseAdvertised || 0) + feeSum;
  }

  function rescan() {
    const base = findBaseTotal();
    if (base != null && state.baseAdvertised == null) {
      state.baseAdvertised = base;
      state.firstSeenAt = Date.now();
    }

    const fees = findFeeLines();
    fees.forEach((fee) => {
      const already = state.lineItems.some((item) => item.label === fee.label && item.amount === fee.amount);
      if (!already) {
        state.lineItems.push({
          ...fee,
          revealedAfterBase: state.baseAdvertised != null,
          seenAt: Date.now(),
        });
      }
    });

    state.lastUpdated = Date.now();
    renderBadge();
    persistSnapshot();
  }

  // Saves the latest snapshot locally so a future version can chart price
  // history across visits (the TrueTotal Plus feature previewed in the popup).
  function persistSnapshot() {
    if (chrome.storage?.local) {
      chrome.storage.local.set({ [`tt:${state.site}:last`]: { ...state, total: currentTotal() } });
    }
  }

  // Badge lives in a shadow root so the host page's CSS can't touch it and
  // our styles can't leak onto the host page either.
  let shadowHost = null;
  let shadowRoot = null;

  function ensureBadge() {
    if (shadowHost) return;
    shadowHost = document.createElement("div");
    shadowHost.id = "tt-badge-host";
    shadowHost.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:2147483647;";
    document.documentElement.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <style>
        .tt-pill {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #14213d;
          color: #fdfcfb;
          padding: 10px 14px;
          border-radius: 999px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          font-size: 13px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .tt-dot { width: 8px; height: 8px; border-radius: 50%; background: #ffb703; flex-shrink: 0; }
        .tt-amount { font-weight: 700; }
        .tt-delta { color: #ffb703; font-weight: 600; }
      </style>
      <div class="tt-pill">
        <span class="tt-dot"></span>
        <span>TrueTotal: <span class="tt-amount"></span></span>
        <span class="tt-delta"></span>
      </div>
    `;
  }

  function renderBadge() {
    if (state.baseAdvertised == null && !state.lineItems.length) return;
    ensureBadge();
    const total = currentTotal();
    const feeSum = state.lineItems.reduce((s, i) => s + i.amount, 0);
    const amountEl = shadowRoot.querySelector(".tt-amount");
    const deltaEl = shadowRoot.querySelector(".tt-delta");
    amountEl.textContent = `$${total.toFixed(2)}`;
    if (feeSum > 0 && state.baseAdvertised) {
      const pct = Math.round((feeSum / state.baseAdvertised) * 100);
      deltaEl.textContent = `+${pct}% in fees`;
    } else {
      deltaEl.textContent = "";
    }
  }

  const observer = new MutationObserver(() => {
    clearTimeout(window.__trueTotalDebounce);
    window.__trueTotalDebounce = setTimeout(rescan, 400);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  rescan();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "TRUETOTAL_GET_STATE") {
      sendResponse({ ...state, total: currentTotal() });
    }
    return true;
  });
}
