// Exit Ramp popup. Runs in the real extension popup and in the demo harness (index.html).
const inExtension = typeof chrome !== "undefined" && !!chrome?.storage?.local;
let demoState = null; // demo harness: in-memory stand-in for chrome.storage.local

async function loadState() {
  if (inExtension) return (await chrome.storage.local.get("state")).state ?? {};
  demoState ??= JSON.parse(document.getElementById("sample-data").textContent).state ?? {};
  return demoState;
}

async function saveState(state) {
  if (inExtension) await chrome.storage.local.set({ state });
  else demoState = state;
}

// Ask the content script on the active tab for a fresh scan; null if it isn't running there.
async function scanActivePage() {
  if (inExtension) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      return await chrome.tabs.sendMessage(tab.id, { type: "exitramp:scan" });
    } catch {
      return null;
    }
  }
  return window.exitRampDemo?.scan() ?? null;
}

const $ = (id) => document.getElementById(id);
const stamp = (iso) => new Date(iso).toISOString().replace("T", " ").slice(0, 19) + " UTC";
let current = { host: null, journey: null };

function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  Object.assign(node, attrs);
  node.append(...kids);
  return node;
}

function chip(kind, label) {
  const c = el("span", { className: "xr-chip" }, label);
  c.dataset.kind = kind;
  return c;
}

function countKinds(steps) {
  const n = {};
  for (const s of steps) for (const f of s.findings) n[f.kind] = (n[f.kind] ?? 0) + 1;
  return n;
}

async function render() {
  const page = await scanActivePage();
  const state = await loadState();
  const status = $("xr-status");

  current.host = page ? new URL(page.url).host : null;
  current.journey = current.host ? state.journeys?.[current.host] ?? null : null;
  const { host, journey } = current;

  $("xr-site").textContent = host ?? "";
  status.className = "xr-status";

  if (!page) {
    status.classList.add("is-idle");
    status.textContent = "Open a supported account or billing page to start.";
  } else if (journey?.status === "done") {
    status.classList.add("is-done");
    status.textContent = `Cancelled. ${journey.confirmation}`;
  } else if (journey) {
    const n = countKinds(journey.steps);
    status.textContent = `Step ${journey.steps.length}: ${n.offer ?? 0} offers and ${n.shame ?? 0} pressure lines so far`;
  } else {
    status.classList.add("is-idle");
    status.textContent = "Nothing that looks like a cancel flow on this page.";
  }

  const findings = page?.findings ?? [];
  $("xr-findings").replaceChildren(
    ...(findings.length
      ? findings.map((f) => el("li", {}, chip(f.kind, f.label), f.text))
      : [el("li", { className: "xr-empty" }, "No exits or retention tricks found.")])
  );

  const steps = journey?.steps ?? [];
  $("xr-steps").replaceChildren(
    ...(steps.length
      ? steps.map((s) => el("li", {}, el("span", { className: "xr-time" }, stamp(s.at).slice(11, 16)), " ", s.title))
      : [el("li", { className: "xr-empty" }, "No steps logged on this site yet.")])
  );

  const others = Object.values(state.journeys ?? {}).filter((j) => j.host !== host);
  $("xr-others").textContent = others.length
    ? "Also logged: " + others.map((j) => `${j.host} (${j.status === "done" ? "cancelled" : "in progress"})`).join(", ")
    : "";
}

function evidenceText({ host, journey }) {
  const lines = [`Exit Ramp evidence log: ${host}`, `Started ${stamp(journey.started)}`, ""];
  journey.steps.forEach((s, i) => {
    lines.push(`${i + 1}. ${stamp(s.at)}  ${s.title}`, `   ${s.url}`);
    for (const f of s.findings) lines.push(`   - ${f.label}: ${f.text}`);
  });
  if (journey.status === "done") lines.push("", `Outcome: ${journey.confirmation}`);
  return lines.join("\n");
}

function note(msg) {
  $("xr-note").textContent = msg;
  setTimeout(() => ($("xr-note").textContent = ""), 2500);
}

$("xr-copy").addEventListener("click", async () => {
  if (!current.journey) return note("Nothing logged here yet.");
  try {
    await navigator.clipboard.writeText(evidenceText(current));
    note("Copied.");
  } catch {
    note("Clipboard blocked by the browser.");
  }
});

$("xr-clear").addEventListener("click", async () => {
  if (!current.host) return;
  const state = await loadState();
  const journeys = { ...state.journeys };
  delete journeys[current.host];
  await saveState({ ...state, journeys });
  render();
});

// Demo harness hook: script.js records each mock page visit, standing in for content.js + storage.
if (!inExtension) {
  window.exitRampPopup = {
    render,
    async record(page) {
      await saveState(window.ExitRamp.addStep(await loadState(), page));
    },
  };
}

render();
