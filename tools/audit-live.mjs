import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, devices } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = (process.argv[2] ?? "https://gaze-calibration-card.sociobot.in").replace(/\/$/, "");
const output = process.argv[3] ?? ".factory/evidence/polish-3/live";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const evidence = { base, checkedAt: new Date().toISOString(), routes: [], demo: {}, mobile: {}, offline: {}, headers: {} };
const sharedNavigation = [
  ["Demo", "/demo/"],
  ["How it works", "/#how"],
  ["Privacy", "/privacy/"],
  ["Source on GitHub (external)", "https://github.com/B-Divyesh/sf-gaze-calibration-card"]
];

try {
  const context = await browser.newContext();
  const routes = [
    ["/", "Gaze Calibration Card — compare pointer patterns"],
    ["/check/", "Gaze Calibration Card — compare your pointer"],
    ["/demo/", "Demo — Gaze Calibration Card"],
    ["/privacy/", "Privacy — Gaze Calibration Card"],
    ["/terms/", "Terms — Gaze Calibration Card"],
    ["/404.html", "Page not found — Gaze Calibration Card"]
  ];
  for (const [path, expectedTitle] of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, path);
    assert.equal(await page.title(), expectedTitle, path);
    assert.equal(await page.locator("html").getAttribute("lang"), "en", path);
    assert.equal(await page.locator("h1").count(), 1, path);
    assert.equal(await page.locator("main").count(), 1, path);
    assert.equal(await page.locator("img:not([alt])").count(), 0, path);
    const header = page.locator("header").first();
    assert.equal(await header.getByRole("link", { name: "Gaze Calibration Card home" }).getAttribute("href"), "/", path);
    for (const [name, href] of sharedNavigation) {
      const link = header.getByRole("link", { name, exact: true });
      assert.equal(await link.count(), 1, `${path} ${name}`);
      assert.equal(await link.getAttribute("href"), href, `${path} ${name}`);
    }
    const axe = await new AxeBuilder({ page }).analyze();
    const serious = axe.violations.filter((item) => item.impact === "serious" || item.impact === "critical");
    assert.deepEqual(serious, [], path);
    assert.deepEqual(errors, [], path);
    evidence.routes.push({ path, status: response.status(), title: expectedTitle, seriousAxeViolations: 0, consoleErrors: 0 });
    await page.close();
  }

  const missing = await context.request.get(`${base}/missing-polish-3-check`);
  assert.equal(missing.status(), 404);
  assert.match(await missing.text(), /Page not found/);

  const demoPage = await context.newPage();
  const demoRequests = [];
  demoPage.on("request", (request) => demoRequests.push(request.url()));
  await demoPage.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  await demoPage.evaluate(() => localStorage.setItem("gaze-calibration-card:checks:v1", "live-real-marker"));
  await demoPage.getByRole("button", { name: "Reset demo" }).click();
  assert.equal(await demoPage.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1")), "live-real-marker");
  assert.equal(demoRequests.every((url) => new URL(url).origin === base), true);
  await demoPage.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
  assert.match(demoPage.url(), /\/demo\/#result$/);
  await demoPage.getByText("Demo — sample data, nothing is saved").waitFor();
  await demoPage.getByRole("button", { name: "Start a new check" }).click();
  assert.match(demoPage.url(), /\/check\/#setup$/);
  await demoPage.reload({ waitUntil: "networkidle" });
  assert.match(demoPage.url(), /\/check\/#setup$/);
  assert.equal(await demoPage.getByText("Demo — sample data, nothing is saved").count(), 0);
  assert.equal(await demoPage.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1")), "live-real-marker");
  assert.equal(await demoPage.evaluate(() => localStorage.getItem("demo:gaze-calibration-card:checks:v1")), null);
  evidence.demo = { queryEntry: "/demo/#result", banner: true, resetPreservedRealMarker: true, exit: "/check/#setup", reloadStayedReal: true, onlySameOriginRequests: true };
  await demoPage.close();
  await context.close();

  const mobileContext = await browser.newContext({ ...devices["iPhone 13"], viewport: { width: 390, height: 844 } });
  const mobile = await mobileContext.newPage();
  await mobile.goto(`${base}/`, { waitUntil: "networkidle" });
  const factsBottom = await mobile.locator(".plain-facts").evaluate((element) => element.getBoundingClientRect().bottom);
  const primary = await mobile.getByRole("link", { name: /Try it with sample data/ }).first().boundingBox();
  assert(primary && primary.width >= 44 && primary.height >= 44);
  assert(factsBottom <= 844);
  const mobileHeader = mobile.locator("header").first();
  for (const [name] of sharedNavigation) {
    const link = mobileHeader.getByRole("link", { name, exact: true });
    assert.equal(await link.isVisible(), true, `mobile ${name}`);
    assert((await link.boundingBox())?.height >= 44, `mobile ${name}`);
  }
  await mobile.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  await mobile.waitForFunction(() => window.scrollY === 0);
  const walkthroughReady = await mobile.locator(".walkthrough img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0));
  assert.equal(walkthroughReady, true);
  await mobile.screenshot({ path: join(output, "live-landing-390.png") });
  await mobile.goto(`${base}/?demo=1`, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: join(output, "live-demo-390.png"), fullPage: true });
  await mobile.getByRole("button", { name: "Start a new check" }).click();
  await mobile.screenshot({ path: join(output, "live-check-390.png"), fullPage: true });
  evidence.mobile = { viewport: "390x844", factsBottom: Math.round(factsBottom), primaryWidth: Math.round(primary.width), primaryHeight: Math.round(primary.height), sharedNavigation: true, horizontalOverflowAt200Percent: false };
  await mobile.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const widths = await mobile.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  assert.equal(widths.scroll, widths.client);
  await mobileContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/`, { waitUntil: "networkidle" });
  await offlinePage.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
  });
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  await offlinePage.getByRole("heading", { name: "Check your gaze-controlled pointer before a demanding task" }).waitFor();
  await offlineContext.setOffline(false);
  await offlinePage.goto(`${base}/demo/`, { waitUntil: "networkidle" });
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  await offlinePage.getByRole("button", { name: "Reset demo" }).click();
  await offlinePage.getByRole("heading", { name: "Pattern within comparison guide" }).waitFor();
  evidence.offline = { landingReload: true, demoReloadAndReset: true };
  await offlineContext.close();

  const rootResponse = await fetch(`${base}/`, { cache: "no-store" });
  const csp = rootResponse.headers.get("content-security-policy") ?? "";
  assert.match(csp, /frame-ancestors 'none'/);
  assert.equal(rootResponse.headers.get("x-content-type-options"), "nosniff");
  assert.equal(rootResponse.headers.get("x-frame-options"), "DENY");
  evidence.headers = { contentSecurityPolicy: csp, xContentTypeOptions: "nosniff", xFrameOptions: "DENY", missingRouteStatus: 404 };

  await writeFile(join(output, "live-audit.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
} finally {
  await browser.close();
}
