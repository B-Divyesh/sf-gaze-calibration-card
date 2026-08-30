import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const siteUrl = "http://127.0.0.1:4173";
const releaseFixture = {
  tag_name: "v0.1.1",
  assets: [
    { name: "Gaze.Calibration.Card_0.1.1_aarch64.dmg", browser_download_url: "https://github.com/example/releases/download/v0.1.1/app-aarch64.dmg" },
    { name: "Gaze.Calibration.Card_0.1.1_x64.dmg", browser_download_url: "https://github.com/example/releases/download/v0.1.1/app-x64.dmg" },
    { name: "Gaze.Calibration.Card_0.1.1_x64-setup.exe", browser_download_url: "https://github.com/example/releases/download/v0.1.1/app-x64.exe" },
    { name: "Gaze.Calibration.Card_0.1.1_amd64.AppImage", browser_download_url: "https://github.com/example/releases/download/v0.1.1/app-amd64.AppImage" }
  ]
};

async function completeKeyboardCheck(page: import("@playwright/test").Page) {
  await page.getByText("Keyboard practice", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-point check" }).click();
  for (let index = 1; index <= 9; index += 1) await page.getByRole("button", { name: `Target ${index} of 9` }).press("Space");
}

test("@claim:sample-demo opens realistic data in isolated storage", async ({ page }) => {
  await page.goto(`${siteUrl}/`);
  await page.evaluate(() => localStorage.setItem("gaze-calibration-card:checks:v1", "real-history-marker"));
  await page.getByRole("link", { name: /Try it with sample data/ }).first().click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(await page.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1"))).toBe("real-history-marker");
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toHaveCount(0);
});

test("@claim:offline-reload reloads the complete site after one visit", async ({ browser }) => {
  const context = await browser.newContext();
  await context.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => route.fulfill({ json: releaseFixture }));
  const page = await context.newPage();
  await page.goto(`${siteUrl}/`);
  await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const cached = await page.evaluate(async () => (await (await caches.open("gaze-card-site-v2")).keys()).map((request) => request.url));
  expect(cached.some((url) => /\/assets\/main-.*\.js$/.test(url))).toBe(true);
  expect(cached.some((url) => /\/assets\/style-.*\.css$/.test(url))).toBe(true);
  expect(cached.some((url) => url.endsWith("/assets/hero-field-guide.avif"))).toBe(true);
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Check your gaze pointer before a demanding task" })).toBeVisible();
  expect(errors).toEqual([]);
  await context.close();
});

test("@claim:local-private completes a demo flow without camera, telemetry, or cross-origin requests", async ({ page }) => {
  await page.addInitScript(() => {
    (window as typeof window & { cameraRequested?: boolean }).cameraRequested = false;
    if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = async () => { (window as typeof window & { cameraRequested?: boolean }).cameraRequested = true; throw new Error("blocked in test"); };
  });
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(`${siteUrl}/demo/`);
  await page.getByRole("button", { name: "Reset demo" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  await download;
  expect(requests.every((url) => new URL(url).origin === siteUrl)).toBe(true);
  expect(await page.evaluate(() => (window as typeof window & { cameraRequested?: boolean }).cameraRequested)).toBe(false);
  await expect(page.getByRole("link", { name: /sign in|log in/i })).toHaveCount(0);
});

test("@claim:nine-targets shows one reading for every target", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  await expect(page.locator(".map-point")).toHaveCount(9);
});

test("@claim:pointer-measures reports error, dwell, and directional pattern", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  await expect(page.getByText("Average target error")).toBeVisible();
  await expect(page.getByText("Dwell reliability")).toBeVisible();
  await expect(page.getByText("Directional pattern")).toBeVisible();
  await expect(page.getByText(/42/).first()).toBeVisible();
});

test("@claim:keyboard-high-contrast supports keyboard completion and forced colors", async ({ page }) => {
  await page.goto("/");
  await completeKeyboardCheck(page);
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeFocused();
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});

test("@claim:report-export downloads a standalone HTML support report", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^gaze-check-.*\.html$/);
  expect(await readFile(await download.path() as string, "utf8")).toContain("Pointer comparison");
});

test("@claim:notes-opt-in stores setup notes only after approval", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Posture or position").fill("Chair reclined");
  await completeKeyboardCheck(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]")[0].setup.posture)).toBe("");
  await page.getByRole("button", { name: "Change setup notes" }).click();
  await page.getByLabel("Posture or position").fill("Chair reclined");
  await page.getByLabel("Save these notes with the result").check();
  await completeKeyboardCheck(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]")[0].setup.posture)).toBe("Chair reclined");
});

test("@claim:history-limit keeps no more than 50 local checks", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const checks = Array.from({ length: 50 }, (_, index) => ({ id: String(index), date: new Date().toISOString(), setup: { mode: "keyboard", posture: "", glasses: "", lighting: "", notes: "", saveNotes: false, keepHistory: true }, metrics: { meanError: 0, horizontalDrift: 0, verticalDrift: 0, dwellReliability: 100, sampleCount: 9, verdict: "practice" }, readings: [] }));
    localStorage.setItem("gaze-calibration-card:checks:v1", JSON.stringify(checks));
  });
  await completeKeyboardCheck(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]").length)).toBe(50);
});

test("@claim:release-download uses GitHub release metadata and caches it for one hour", async ({ page, browser }) => {
  let apiCalls = 0;
  await page.addInitScript(() => Object.defineProperty(navigator, "userAgentData", { configurable: true, value: { platform: "Windows", getHighEntropyValues: async () => ({ architecture: "x86" }) } }));
  await page.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => { apiCalls += 1; return route.fulfill({ json: releaseFixture }); });
  await page.goto(`${siteUrl}/`);
  await expect(page.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-x64\.exe$/);
  await page.reload();
  await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
  expect(apiCalls).toBe(1);
  const mac = await browser.newContext();
  await mac.addInitScript(() => Object.defineProperty(navigator, "userAgentData", { configurable: true, value: { platform: "macOS", getHighEntropyValues: async () => ({ architecture: "arm" }) } }));
  await mac.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => route.fulfill({ json: releaseFixture }));
  const macPage = await mac.newPage();
  await macPage.goto(`${siteUrl}/`);
  await expect(macPage.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-aarch64\.dmg$/);
  await expect(macPage.locator("#platform-label")).toHaveText("Download for Mac (Apple silicon)");
  await mac.close();
});

test("@claim:installer-checksum verifies installer downloads before use", async () => {
  const shell = await readFile("public/install.sh", "utf8");
  const powershell = await readFile("public/install.ps1", "utf8");
  expect(shell).toContain("sha256sum");
  expect(shell).toContain("Checksum verification failed");
  expect(powershell).toContain("Get-FileHash");
  expect(powershell).toContain("Checksum verification failed");
});

test("@claim:free-open-source exposes the MIT license and no payment action", async ({ page }) => {
  await page.goto(`${siteUrl}/`);
  await expect(page.getByText("Free and open source", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Source" })).toHaveAttribute("href", /sf-gaze-calibration-card/);
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
  expect(await readFile("LICENSE", "utf8")).toContain("MIT License");
});

test("@claim:thirty-second-check completes automatically in about 30 seconds", async ({ page }) => {
  test.setTimeout(40_000);
  await page.goto("/");
  await page.getByText("Mouse or touch", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  const started = Date.now();
  await page.getByRole("button", { name: "Start nine-point check" }).click();
  await expect(page.getByRole("heading", { name: "Pattern outside comparison guide" })).toBeVisible({ timeout: 32_000 });
  expect(Date.now() - started).toBeLessThanOrEqual(30_000);
});
