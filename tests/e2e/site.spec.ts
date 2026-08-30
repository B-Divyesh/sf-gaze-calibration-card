import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const releaseFixture = {
  tag_name: "v0.1.1",
  assets: [
    { name: "Gaze.Calibration.Card_0.1.1_aarch64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/download/v0.1.1/Gaze.Calibration.Card_0.1.1_aarch64.dmg" },
    { name: "Gaze.Calibration.Card_0.1.1_x64.dmg", browser_download_url: "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/download/v0.1.1/Gaze.Calibration.Card_0.1.1_x64.dmg" },
    { name: "Gaze.Calibration.Card_0.1.1_x64-setup.exe", browser_download_url: "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/download/v0.1.1/Gaze.Calibration.Card_0.1.1_x64-setup.exe" },
    { name: "Gaze.Calibration.Card_0.1.1_amd64.AppImage", browser_download_url: "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/download/v0.1.1/Gaze.Calibration.Card_0.1.1_amd64.AppImage" }
  ]
};

test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => route.fulfill({ json: releaseFixture }));
});

test("landing page has a complete accessible shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("link", { name: /Try it with sample data/ }).first()).toBeVisible();
  const download = page.getByRole("link", { name: /Download the app/ });
  await expect(download).toBeVisible();
  await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
  await expect(download).toHaveAttribute("href", /releases\/download\/v0\.1\.1\//);
  await expect(page.locator("img[alt]")).toHaveCount(4);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  await page.emulateMedia({ colorScheme: "dark" });
  const darkResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(darkResults.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("demo and policy pages have route-specific metadata", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/demo/");
  await expect(page).toHaveTitle("Demo — Gaze Calibration Card");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await page.goto("http://127.0.0.1:4173/privacy/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy, in plain language");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /privacy\/$/);
  await page.goto("http://127.0.0.1:4173/terms/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terms of use");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /device-dependent limits/);
});

test("deployment config defines security, caching, and a real 404", async () => {
  const config = JSON.parse(await readFile("public/staticwebapp.config.json", "utf8"));
  expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders["Content-Security-Policy"]).toContain("https://api.github.com");
  expect(config.routes.find((route: { route: string }) => route.route === "/assets/*").headers["Cache-Control"]).toContain("immutable");
  expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  const notFound = await readFile("dist/site/404.html", "utf8");
  expect(notFound).toContain("This field card is missing");
});

test("mobile links meet the 44 pixel touch target", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile geometry check");
  await page.goto("http://127.0.0.1:4173/privacy/");
  for (const link of await page.locator("main a, footer a").all()) {
    const box = await link.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});
