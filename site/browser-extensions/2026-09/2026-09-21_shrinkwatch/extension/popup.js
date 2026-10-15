const inExtension = typeof chrome !== "undefined" && !!chrome?.storage?.local;
const FREE_LIMIT = 8;

async function loadSampleData() {
  const response = await fetch("sample-data.json");
  return response.json();
}

async function loadOnThisPage() {
  if (inExtension) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return null;
    try {
      return await chrome.tabs.sendMessage(tab.id, { type: "SHRINKWATCH_GET_PAGE" });
    } catch {
      return null; // No ShrinkWatch content script on this tab (not an Amazon product page).
    }
  }
  const data = await loadSampleData();
  return data.state.onThisPage;
}

async function loadTrackedProducts() {
  if (inExtension) {
    const { trackedProducts = [] } = await chrome.storage.local.get("trackedProducts");
    return trackedProducts;
  }
  const data = await loadSampleData();
  return data.state.trackedProducts;
}

function renderOnThisPage(product) {
  const section = document.getElementById("on-this-page");
  const loading = section.querySelector('[data-role="page-loading"]');
  loading.remove();

  const card = document.createElement("div");
  card.className = `shrinkwatch-page-card${product?.shrinkflationDetected ? " shrinkwatch-page-card--warn" : ""}`;

  if (!product) {
    card.innerHTML = `<p class="shrinkwatch-popup__empty">Open an Amazon product page to see its unit price.</p>`;
    section.appendChild(card);
    return;
  }

  const unitLine = `$${product.unitPrice.toFixed(2)}/${product.unit}`;
  const note = product.shrinkflationDetected
    ? `Size down ${Math.abs(product.sizeChangePct)}% since your last visit, price ${product.priceChangePct > 0 ? `up ${product.priceChangePct}%` : "unchanged"}.`
    : product.sizeChangePct || product.priceChangePct
      ? `Size or price shifted since your last visit, but not a shrink.`
      : `First time ShrinkWatch has seen this one, or no change since last visit.`;

  card.innerHTML = `
    <span class="shrinkwatch-page-card__title">${product.title}</span>
    <span class="shrinkwatch-page-card__unit">${unitLine}</span>
    <span class="shrinkwatch-page-card__note">${note}</span>
  `;
  section.appendChild(card);
}

function renderTrackedProducts(products) {
  const list = document.querySelector('[data-role="tracked-list"]');
  const countEl = document.querySelector('[data-role="tracked-count"]');
  const upgradeBanner = document.querySelector('[data-role="upgrade-banner"]');

  countEl.textContent = `${products.length}/${FREE_LIMIT} free`;
  upgradeBanner.hidden = products.length < FREE_LIMIT;

  if (products.length === 0) {
    const empty = document.createElement("p");
    empty.className = "shrinkwatch-popup__empty";
    empty.textContent = "Visit a product page to start tracking it.";
    list.appendChild(empty);
    return;
  }

  const sorted = [...products].sort((a, b) => (b.lastSeen || "").localeCompare(a.lastSeen || ""));
  for (const product of sorted) {
    const item = document.createElement("li");
    item.className = "shrinkwatch-item";
    item.innerHTML = `
      <span class="shrinkwatch-item__name">${product.title}</span>
      <span class="shrinkwatch-item__unit">$${product.unitPrice.toFixed(2)}/${product.unit}${
        product.shrinkflationDetected ? `<span class="shrinkwatch-item__flag">SHRUNK</span>` : ""
      }</span>
    `;
    list.appendChild(item);
  }
}

async function init() {
  const [onThisPage, trackedProducts] = await Promise.all([loadOnThisPage(), loadTrackedProducts()]);
  renderOnThisPage(onThisPage);
  renderTrackedProducts(trackedProducts);
}

init();
