// Exit Ramp content script. Reads the account page, marks the real cancel control and the
// retention patterns around it, and logs each step of the cancellation to chrome.storage.
// The demo harness loads this same file to reuse scan() and addStep().
(() => {
  if (window.ExitRamp) return; // already injected

  // First matching rule wins. "exit" only applies to clickable controls.
  const RULES = [
    { kind: "done", label: "Cancellation confirmed", re: /(membership|subscription|plan) (will end|ends|has been cancell?ed)|cancellation (is )?confirmed|confirmation (number|#)/i },
    { kind: "exit", label: "Real exit", re: /(cancel|end|turn off|stop)\s+(my\s+|your\s+)?(subscription|membership|plan|auto-?renew(al)?)|continue to cancel|cancel anyway|yes,?\s*cancel/i },
    { kind: "shame", label: "Pressure copy", re: /no thanks,? i|i don'?t (want|care|like)|i'?d rather|you'?ll lose|are you sure/i },
    { kind: "offer", label: "Retention offer", re: /\d+%\s*off|months? free|free month|pause (my |your )?(subscription|membership|plan)|special offer|keep my (benefits|subscription|membership)/i },
  ];
  const INTERACTIVE = "a,button,[role=button],input[type=submit],input[type=button]";
  const TEXTY = "h1,h2,h3,p,li,label";

  // ponytail: an injected <style> can be blocked by a strict page CSP; move to a manifest "css" file if that bites.
  const CSS = `
    [data-xr-kind]{outline:2px solid var(--xr-c);outline-offset:3px;position:relative}
    [data-xr-kind]::after{content:attr(data-xr-label);position:absolute;left:0;top:-1.9em;font:600 11px/1.5 system-ui,sans-serif;
      background:var(--xr-c);color:#fff;padding:0 6px;border-radius:4px;white-space:nowrap;pointer-events:none;z-index:2147483647}
    [data-xr-kind=exit]{--xr-c:#0f7b55}
    [data-xr-kind=hidden]{--xr-c:#0f7b55;outline-width:3px;outline-style:dashed}
    [data-xr-kind=offer],[data-xr-kind=prechecked]{--xr-c:#a65a00}
    [data-xr-kind=shame]{--xr-c:#b8324a}
    [data-xr-kind=done]{--xr-c:#2a5bd7}`;

  function injectStyle(doc) {
    if (doc.getElementById("xr-style")) return;
    const style = doc.createElement("style");
    style.id = "xr-style";
    style.textContent = CSS;
    doc.head.append(style);
  }

  const textOf = (el) => (el.value || el.textContent || "").replace(/\s+/g, " ").trim();

  function looksHidden(el) {
    const cs = getComputedStyle(el);
    return parseFloat(cs.fontSize) < 13 || Number(cs.opacity) < 0.7;
  }

  function mark(el, kind, label) {
    el.dataset.xrKind = kind;
    el.dataset.xrLabel = label;
  }

  // Scan `root`, mark what it finds, and return a page record for the log.
  function scan(root = document.body, ctx = {}) {
    injectStyle(root.ownerDocument);
    root.querySelectorAll("[data-xr-kind]").forEach((el) => {
      delete el.dataset.xrKind;
      delete el.dataset.xrLabel;
    });

    const findings = [];
    for (const el of root.querySelectorAll(`${INTERACTIVE},${TEXTY}`)) {
      const interactive = el.matches(INTERACTIVE);
      if (!interactive && el.querySelector(INTERACTIVE)) continue; // let the control report itself
      const text = textOf(el);
      if (!text || text.length > 200) continue;
      const rule = RULES.find((r) => r.re.test(text) && (r.kind !== "exit" || interactive));
      if (!rule) continue;
      let { kind, label } = rule;
      if (kind === "exit" && looksHidden(el)) {
        kind = "hidden";
        label = "Real exit, made hard to see";
      }
      mark(el, kind, label);
      findings.push({ kind, label, text: text.slice(0, 120) });
    }

    for (const box of root.querySelectorAll("input[type=checkbox]:checked")) {
      const holder = box.closest("label") ?? box.parentElement;
      mark(holder, "prechecked", "Pre-ticked box");
      findings.push({ kind: "prechecked", label: "Pre-ticked box", text: textOf(holder).slice(0, 120) });
    }

    return { url: ctx.url ?? location.href, title: ctx.title ?? document.title, at: new Date().toISOString(), findings };
  }

  // Pure: returns a new state with `page` appended to its host's cancellation journey.
  function addStep(state, page) {
    const host = new URL(page.url).host;
    const journeys = { ...state.journeys };
    const prev = journeys[host];
    if (!prev && !page.findings.length) return state; // nothing worth logging yet

    const journey = prev ?? { host, started: page.at, status: "in-progress", steps: [] };
    const last = journey.steps.at(-1);
    const sameUrl = last?.url === page.url;
    const step = { at: sameUrl ? last.at : page.at, url: page.url, title: page.title, findings: page.findings.slice(0, 8) };
    const steps = sameUrl ? [...journey.steps.slice(0, -1), step] : [...journey.steps, step];
    const done = page.findings.findLast((f) => f.kind === "done");
    journeys[host] = { ...journey, steps, ...(done && { status: "done", confirmation: done.text }) };
    return { ...state, journeys };
  }

  window.ExitRamp = { scan, addStep };

  const inExtension = typeof chrome !== "undefined" && !!chrome?.storage?.local;
  if (!inExtension) return; // demo harness: scan() and addStep() only

  let lastSig = "";
  async function scanAndLog() {
    const page = scan();
    const sig = page.url + JSON.stringify(page.findings);
    if (sig === lastSig) return;
    lastSig = sig;
    const { state = {} } = await chrome.storage.local.get("state");
    await chrome.storage.local.set({ state: addStep(state, page) });
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "exitramp:scan") sendResponse(scan());
  });

  // Retention modals often arrive after load; rescan when the page settles.
  let timer;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(scanAndLog, 800);
  }).observe(document.body, { childList: true, subtree: true });

  scanAndLog();
})();
