// Reads the product on an Amazon product page, compares it against what ShrinkWatch
// last saw for the same ASIN, and flags a size cut that wasn't matched by a price cut.

if (!window.__shrinkwatchInjected) {
  window.__shrinkwatchInjected = true;

  const FREE_LIMIT = 8;
  const HISTORY_LENGTH = 6;

  const UNIT_ALIASES = {
    "fl oz": "fl oz",
    "fl. oz": "fl oz",
    "fluid ounce": "fl oz",
    "fluid ounces": "fl oz",
    ounce: "oz",
    ounces: "oz",
    oz: "oz",
    pound: "lb",
    pounds: "lb",
    lbs: "lb",
    lb: "lb",
    count: "ct",
    ct: "ct",
    pack: "ct",
    gram: "g",
    grams: "g",
    g: "g",
    kilogram: "kg",
    kilograms: "kg",
    kg: "kg",
    milliliter: "ml",
    milliliters: "ml",
    ml: "ml",
    liter: "l",
    liters: "l",
    l: "l",
  };

  const SIZE_PATTERN =
    /(\d+(?:\.\d+)?)\s*(fl\.?\s*oz|fluid ounces?|ounces?|oz|pounds?|lbs?|count|ct|pack|grams?|kilograms?|kg|g|milliliters?|ml|liters?|l)\b/i;

  function getAsin() {
    const match = location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
    return match ? match[1] : location.pathname;
  }

  function getTitle() {
    return document.querySelector("#productTitle")?.textContent?.trim() || null;
  }

  function getBrand() {
    return (
      document.querySelector("#bylineInfo")?.textContent?.trim() ||
      document.querySelector(".po-brand .po-break-word")?.textContent?.trim() ||
      null
    );
  }

  function getPrice() {
    const selectors = [
      ".a-price .a-offscreen",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      ".a-price-whole",
    ];
    for (const selector of selectors) {
      const raw = document.querySelector(selector)?.textContent;
      if (!raw) continue;
      const value = parseFloat(raw.replace(/[^0-9.]/g, ""));
      if (!Number.isNaN(value)) return value;
    }
    return null;
  }

  function getSizeText() {
    const bulletText = Array.from(
      document.querySelectorAll("#detailBullets_feature_div li, #productDetails_detailBullets_sections1 tr")
    )
      .map((node) => node.textContent)
      .join(" ");
    const title = getTitle() || "";
    return `${title} ${bulletText}`;
  }

  function parseSize(text) {
    const match = text.match(SIZE_PATTERN);
    if (!match) return null;
    const quantity = parseFloat(match[1]);
    const unit = UNIT_ALIASES[match[2].toLowerCase().replace(/\.?\s+/, " ").trim()] || match[2].toLowerCase();
    return { quantity, unit, sizeText: `${quantity} ${unit}` };
  }

  function readProductFromPage() {
    const title = getTitle();
    const price = getPrice();
    const size = parseSize(getSizeText());
    if (!title || !price || !size) return null;
    return {
      asin: getAsin(),
      title,
      brand: getBrand(),
      price,
      quantity: size.quantity,
      unit: size.unit,
      sizeText: size.sizeText,
      unitPrice: Math.round((price / size.quantity) * 10000) / 10000,
    };
  }

  function injectBadge(product, comparison) {
    document.querySelectorAll(".shrinkwatch-badge").forEach((node) => node.remove());

    if (!document.getElementById("shrinkwatch-style")) {
      const style = document.createElement("style");
      style.id = "shrinkwatch-style";
      style.textContent = `
        .shrinkwatch-badge { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4;
          border-radius: 6px; padding: 8px 10px; margin: 8px 0; max-width: 320px; }
        .shrinkwatch-badge--ok { background: #eef6ee; color: #285c28; border: 1px solid #bfe0bf; }
        .shrinkwatch-badge--warn { background: #fdeeee; color: #7a1f1f; border: 1px solid #f0bcbc; }
        .shrinkwatch-badge strong { display: block; margin-bottom: 2px; }
      `;
      document.head.appendChild(style);
    }

    const badge = document.createElement("div");
    badge.className = `shrinkwatch-badge ${comparison.shrinkflationDetected ? "shrinkwatch-badge--warn" : "shrinkwatch-badge--ok"}`;
    badge.textContent = comparison.shrinkflationDetected
      ? `ShrinkWatch: size down ${Math.abs(comparison.sizeChangePct)}% since your last visit, price ${comparison.priceChangePct > 0 ? "up" : "unchanged"}. Unit price now $${product.unitPrice}/${product.unit}.`
      : `ShrinkWatch: $${product.unitPrice}/${product.unit}. No size change detected since your last visit.`;

    const priceNode = document.querySelector(".a-price") || document.querySelector("#productTitle");
    priceNode?.parentElement?.insertBefore(badge, priceNode.nextSibling);
  }

  async function compareAndStore(product) {
    const { trackedProducts = [] } = await chrome.storage.local.get("trackedProducts");
    const existing = trackedProducts.find((item) => item.asin === product.asin);
    const now = new Date().toISOString().slice(0, 10);

    let shrinkflationDetected = false;
    let sizeChangePct = 0;
    let priceChangePct = 0;

    if (existing && existing.unit === product.unit) {
      sizeChangePct = Math.round(((product.quantity - existing.quantity) / existing.quantity) * 1000) / 10;
      priceChangePct = Math.round(((product.price - existing.price) / existing.price) * 1000) / 10;
      shrinkflationDetected = sizeChangePct < 0 && priceChangePct >= 0;
    }

    const canTrackNewProduct = existing || trackedProducts.length < FREE_LIMIT;
    if (canTrackNewProduct) {
      const history = existing ? [...existing.history] : [];
      if (!existing || existing.price !== product.price || existing.quantity !== product.quantity) {
        history.push({ date: now, price: product.price, quantity: product.quantity, sizeText: product.sizeText });
      }
      const record = {
        ...product,
        firstSeen: existing?.firstSeen || now,
        lastSeen: now,
        shrinkflationDetected,
        sizeChangePct,
        priceChangePct,
        history: history.slice(-HISTORY_LENGTH),
      };
      const next = trackedProducts.filter((item) => item.asin !== product.asin).concat(record);
      await chrome.storage.local.set({ trackedProducts: next });
    }

    return { shrinkflationDetected, sizeChangePct, priceChangePct, tracked: canTrackNewProduct };
  }

  async function run() {
    const product = readProductFromPage();
    if (!product) return;
    const comparison = await compareAndStore(product);
    injectBadge(product, comparison);
    window.__shrinkwatchLastResult = { ...product, ...comparison };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "SHRINKWATCH_GET_PAGE") {
      sendResponse(window.__shrinkwatchLastResult || null);
    }
    return false;
  });

  run();
}
