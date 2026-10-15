// Harness-only logic: renders the mock Amazon-style product page and simulates the badge
// that extension/content.js would inject on the real site. The popup itself is the real
// extension/popup.js, loaded unmodified below via its own <script> tag in index.html.

function parseSizeText(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(fl oz|oz|lb|ct|g|kg|ml|l)\b/i);
  if (!match) return null;
  return { quantity: parseFloat(match[1]), unit: match[2].toLowerCase() };
}

function renderMockPage(mockPage) {
  const container = document.getElementById("mock-page");
  const current = parseSizeText(mockPage.sizeText);
  const previous = parseSizeText(mockPage.previousVisit.sizeText);

  const sizeChangePct = Math.round(((current.quantity - previous.quantity) / previous.quantity) * 1000) / 10;
  const priceChangePct =
    Math.round(((mockPage.price - mockPage.previousVisit.price) / mockPage.previousVisit.price) * 1000) / 10;
  const shrinkflationDetected = sizeChangePct < 0 && priceChangePct >= 0;
  const unitPrice = Math.round((mockPage.price / current.quantity) * 10000) / 10000;

  const badgeText = shrinkflationDetected
    ? `ShrinkWatch: size down ${Math.abs(sizeChangePct)}% since your last visit, price ${priceChangePct > 0 ? "up" : "unchanged"}. Unit price now $${unitPrice.toFixed(4)}/${current.unit}.`
    : `ShrinkWatch: $${unitPrice.toFixed(4)}/${current.unit}. No size change detected since your last visit.`;

  container.innerHTML = `
    <p class="mock-page__crumbs">Grocery &rsaquo; Breakfast &amp; Cereal &rsaquo; ${mockPage.brand}</p>
    <div class="mock-page__layout">
      <div class="mock-page__image" aria-hidden="true">${mockPage.icon}</div>
      <div>
        <p class="mock-page__brand">${mockPage.brand}</p>
        <h1 class="mock-page__title">${mockPage.title}</h1>
        <p class="mock-page__price">$${mockPage.price.toFixed(2)}</p>
        <p class="mock-page__size">${mockPage.sizeText}</p>
        <ul class="mock-page__bullets">
          ${mockPage.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>
        <div class="mock-page__badge ${shrinkflationDetected ? "mock-page__badge--warn" : "mock-page__badge--ok"}">
          ${badgeText}
        </div>
        <p class="mock-page__history">
          Last seen ${mockPage.previousVisit.date}: $${mockPage.previousVisit.price.toFixed(2)} for ${mockPage.previousVisit.sizeText}.
        </p>
      </div>
    </div>
  `;
}

function wireToolbar() {
  const button = document.getElementById("toggle-popup");
  const panel = document.getElementById("popup-panel");

  button.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    button.setAttribute("aria-expanded", String(!isOpen));
  });
}

async function init() {
  const data = await fetch("sample-data.json").then((response) => response.json());
  renderMockPage(data.state.mockPage);
  wireToolbar();
}

init();
