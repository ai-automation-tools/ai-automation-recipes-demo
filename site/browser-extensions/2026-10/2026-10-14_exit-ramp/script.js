// Demo harness only: the mock browser, a fictional subscription site, and the toolbar button.
// The scanning and highlighting come from extension/content.js; the popup is extension/popup.js.
const ORIGIN = "https://account.streamly.tv";

const head = `<div class="site-head"><span class="site-logo">streamly</span><nav>Home · Browse · My list</nav></div>`;

const PAGES = {
  "/account": {
    title: "Account · Streamly",
    html: `${head}<section class="site-body">
      <h1>Account</h1>
      <div class="card"><h2>Premium plan</h2><p>$17.99 a month. Next charge November 13, 2026.</p>
        <button class="btn-primary">Upgrade to Premium+ 4K</button></div>
      <div class="card"><h2>Profiles</h2><p>3 profiles. Parental controls off.</p></div>
      <div class="card"><h2>Payment</h2><p>Visa ending 4417</p></div>
      <div class="fine">Streamly Inc. · Terms · Privacy · Cookie choices ·
        <a href="#" class="tiny" data-go="/account/cancel/offer">Cancel membership</a></div>
    </section>`,
  },
  "/account/cancel/offer": {
    title: "Before you go · Streamly",
    html: `${head}<section class="site-body">
      <h1>Wait, before you go</h1>
      <div class="card offer"><p class="big">50% off your next 3 months</p>
        <button class="btn-primary">Claim 50% off</button></div>
      <button class="btn-secondary">Pause my membership for 1 month</button>
      <div class="spacer"></div>
      <a href="#" class="muted" data-go="/account/cancel/confirm">Continue to cancel</a>
    </section>`,
  },
  "/account/cancel/confirm": {
    title: "Confirm · Streamly",
    html: `${head}<section class="site-body">
      <h1>Are you sure?</h1>
      <ul class="losses"><li>You'll lose your watch history and recommendations</li>
        <li>You'll lose 3 profiles, including Kids</li></ul>
      <label class="check"><input type="checkbox" checked> Keep sending me Streamly deals by email</label>
      <div class="row"><button class="btn-primary">Keep my benefits</button>
        <button class="btn-plain" data-go="/account/cancel/done">Yes, cancel membership</button></div>
    </section>`,
  },
  "/account/cancel/done": {
    title: "Cancelled · Streamly",
    html: `${head}<section class="site-body">
      <h1>Your membership has been cancelled</h1>
      <p>Your membership ends on November 13, 2026. Confirmation number SR-48213.</p>
      <a href="#" data-go="/account">Back to account</a>
    </section>`,
  },
};

const page = document.getElementById("mock-page");
const panel = document.getElementById("popup-panel");
const button = document.getElementById("ext-btn");
let path = "/account";

const scan = () => window.ExitRamp.scan(page, { url: ORIGIN + path, title: PAGES[path].title });
window.exitRampDemo = { scan };

async function go(next) {
  path = next;
  page.innerHTML = PAGES[path].html;
  document.getElementById("urlbar").textContent = ORIGIN + path;
  document.getElementById("tab-title").textContent = PAGES[path].title;
  // Stands in for content.js on page load: same scan, same highlights, logged to the popup's state.
  await window.exitRampPopup.record(scan());
  if (!panel.hidden) window.exitRampPopup.render();
}

page.addEventListener("click", (e) => {
  const target = e.target.closest("a, button");
  if (!target) return;
  e.preventDefault();
  if (target.dataset.go) go(target.dataset.go);
});

button.addEventListener("click", () => {
  panel.hidden = !panel.hidden;
  button.setAttribute("aria-expanded", String(!panel.hidden));
  if (!panel.hidden) window.exitRampPopup.render();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !panel.hidden) button.click();
});

go(path);
