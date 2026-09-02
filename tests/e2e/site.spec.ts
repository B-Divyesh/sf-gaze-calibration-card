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

async function stubLatestRelease(page: import("@playwright/test").Page) {
  await page.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => route.fulfill({ json: releaseFixture }));
}

test("landing page has a complete accessible shell", async ({ page }) => {
  await stubLatestRelease(page);
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Check your gaze-controlled pointer before a demanding task");
  await expect(page.locator(".hero .lead")).toHaveText("For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.");
  await expect(page.locator(".plain-facts li")).toHaveText(["No camera access or account", "Sample reloads offline after first visit", "Free and open source"]);
  await expect(page.getByRole("link", { name: /Try it with sample data/ }).first()).toBeVisible();
  await expect(page.locator(".walkthrough-grid figcaption").last()).toContainText("Dwell shows how steadily the pointer stays on each target.");
  await expect(page.getByRole("link", { name: "Source on GitHub (external)", exact: true })).toHaveAttribute("href", "https://github.com/B-Divyesh/sf-gaze-calibration-card");
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

test("every public route has one clear page structure and no serious accessibility issue", async ({ page }) => {
  await stubLatestRelease(page);
  const routes = [
    ["/", "Gaze Calibration Card — compare pointer patterns"],
    ["/check/", "Gaze Calibration Card — compare your pointer"],
    ["/demo/", "Demo — Gaze Calibration Card"],
    ["/privacy/", "Privacy — Gaze Calibration Card"],
    ["/terms/", "Terms — Gaze Calibration Card"],
    ["/404.html", "Page not found — Gaze Calibration Card"]
  ] as const;
  for (const [route, title] of routes) {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:4173${route}`);
    await expect(page).toHaveTitle(title);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /social-card\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("img:not([alt])")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Privacy", exact: true }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms", exact: true }).last()).toBeVisible();
    const headingLevels = await page.locator("h1,h2,h3,h4,h5,h6").evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
    expect(headingLevels[0]).toBe(1);
    expect(headingLevels.every((level, index) => index === 0 || level <= headingLevels[index - 1] + 1)).toBe(true);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? "")), route).toEqual([]);
    expect(errors, route).toEqual([]);
  }
});

test("every route keeps the shared home header and navigation at desktop and phone widths", async ({ page }) => {
  await stubLatestRelease(page);
  const routes = ["/", "/check/", "/demo/", "/privacy/", "/terms/", "/404.html"];
  const navigation = [
    ["Demo", "/demo/"],
    ["How it works", "/#how"],
    ["Privacy", "/privacy/"],
    ["Source on GitHub (external)", "https://github.com/B-Divyesh/sf-gaze-calibration-card"]
  ] as const;
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:4173${route}`);
    const header = page.locator("header").first();
    await expect(header.getByRole("link", { name: "Gaze Calibration Card home" })).toHaveAttribute("href", "/");
    await expect(header.getByRole("link")).toHaveCount(5);
    for (const [name, href] of navigation) {
      const link = header.getByRole("link", { name, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", href);
      expect((await link.boundingBox())?.height, `${route}: ${name}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test("demo and policy pages have route-specific metadata", async ({ page }) => {
  await stubLatestRelease(page);
  await page.goto("http://127.0.0.1:4173/demo/");
  await expect(page).toHaveTitle("Demo — Gaze Calibration Card");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await page.goto("http://127.0.0.1:4173/check/#setup");
  await expect(page).toHaveTitle("Gaze Calibration Card — compare your pointer");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /check\/$/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "New check — Gaze Calibration Card");
  await page.goto("http://127.0.0.1:4173/privacy/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy, in plain language");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /privacy\/$/);
  await page.goto("http://127.0.0.1:4173/terms/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terms of use");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /device-dependent limits/);
});

test("the demo query path enters the isolated sample", async ({ page }) => {
  await stubLatestRelease(page);
  await page.goto("http://127.0.0.1:4173/?demo=1");
  await expect(page).toHaveURL(/\/demo\/#result$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
});

test("leaving demo opens a reloadable real check route", async ({ page }) => {
  await stubLatestRelease(page);
  await page.goto("http://127.0.0.1:4173/demo/");
  await page.getByRole("button", { name: "Start a new check" }).click();
  await expect(page).toHaveURL(/\/check\/#setup$/);
  await expect(page.getByRole("heading", { name: "Compare your gaze-controlled pointer right now" })).toBeFocused();
  await page.reload();
  await expect(page).toHaveURL(/\/check\/#setup$/);
  await expect(page.getByRole("heading", { name: "Compare your gaze-controlled pointer right now" })).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toHaveCount(0);
});

test("phone first screen includes the three plain facts", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Phone layout check");
  await stubLatestRelease(page);
  await page.goto("http://127.0.0.1:4173/");
  const box = await page.locator(".plain-facts").boundingBox();
  expect((box?.y ?? Infinity) + (box?.height ?? Infinity)).toBeLessThanOrEqual(844);
});

test("deployment config defines security, caching, and a real 404", async () => {
  const config = JSON.parse(await readFile("public/staticwebapp.config.json", "utf8"));
  expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders["Content-Security-Policy"]).toContain("https://api.github.com");
  expect(config.routes.find((route: { route: string }) => route.route === "/assets/*").headers["Cache-Control"]).toContain("immutable");
  expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  const notFound = await readFile("dist/site/404.html", "utf8");
  expect(notFound).toContain("Page not found");
});

test("mobile controls meet the 44 pixel touch target", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile geometry check");
  await stubLatestRelease(page);
  for (const route of ["/", "/check/", "/demo/", "/privacy/", "/terms/"]) {
    await page.goto(`http://127.0.0.1:4173${route}`);
    for (const control of await page.locator("a:visible, button:visible, summary:visible").all()) {
      const box = await control.boundingBox();
      expect(box?.height, `${route}: ${await control.innerText()}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test("phone pages reflow without horizontal scrolling at 200% text size", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Text zoom is a phone layout check.");
  await stubLatestRelease(page);
  for (const route of ["/", "/check/", "/demo/"]) {
    await page.goto(`http://127.0.0.1:4173${route}`);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await expect.poll(() => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))).toEqual({ scrollWidth: 390, clientWidth: 390 });
  }
});
