import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("setup is accessible and has no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle("Gaze Calibration Card — compare your pointer");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  await page.emulateMedia({ colorScheme: "dark" });
  const darkResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(darkResults.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("keyboard-only user can complete a practice check", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Keyboard practice", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await expect(page.getByRole("heading", { name: "Follow each target" })).toBeFocused();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  for (let index = 1; index <= 9; index += 1) {
    const target = page.getByRole("button", { name: `Target ${index} of 9` });
    await expect(target).toBeFocused();
    await target.press("Space");
  }
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeFocused();
  await expect(page.getByText(/No pointer comparison was calculated/)).toBeVisible();
});

test("pointer check produces and exports a measured result", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer path is the representative gaze-controlled cursor path.");
  await page.goto("/");
  await page.getByText("Mouse or touch", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  for (let index = 1; index <= 9; index += 1) {
    const target = page.getByRole("button", { name: `Target ${index} of 9` });
    await target.hover();
    await page.waitForTimeout(700);
    await target.click();
  }
  await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^gaze-check-.*\.html$/);
});

test("a stopped gaze pointer is not reused as nine fresh target samples", async ({ page, isMobile }) => {
  test.skip(isMobile, "The documented stopped-pointer path is reproduced on the desktop gaze-pointer flow.");
  test.setTimeout(40_000);
  await page.goto("/");
  // These Playwright clicks establish the exact old failure: the mouse moves
  // to Start, then remains there while all nine automatic targets advance.
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  await expect(page.getByRole("heading", { name: "Pattern outside comparison guide" })).toBeVisible({ timeout: 32_000 });
  await expect(page.getByText("No recent pointer movement was detected. Make sure your gaze system moves the pointer.")).toBeVisible();
  const result = await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]")[0]);
  expect(result.metrics.sampleCount).toBe(0);
  expect(result.readings).toHaveLength(9);
  expect(result.readings.every((reading: { samples: unknown[] }) => reading.samples.length === 0)).toBe(true);
});

test("a completed real result rehydrates after a cold reload", async ({ page }) => {
  await page.goto("/check/");
  await page.getByText("Keyboard practice", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  for (let index = 1; index <= 9; index += 1) {
    await page.getByRole("button", { name: `Target ${index} of 9` }).press("Space");
  }
  const beforeReload = await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:current-result:v1") ?? "null"));
  expect(beforeReload?.metrics.verdict).toBe("practice");
  await page.reload();
  await expect(page).toHaveURL(/\/check\/#result$/);
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:current-result:v1") ?? "null")?.id)).toBe(beforeReload.id);
});

test("a real result route without local data shows recovery instead of demo metrics", async ({ page }) => {
  await page.goto("/check/#result");
  await expect(page.getByRole("heading", { name: "No saved result found" })).toBeVisible();
  await expect(page.getByText("This result link has no local check on this device. It may have been cleared or created in another browser.")).toBeVisible();
  await expect(page.getByText("Demo — sample data, nothing is saved")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toHaveCount(0);
  await expect(page.locator(".map-point")).toHaveCount(0);
  await page.getByRole("button", { name: "Start a new check" }).click();
  await expect(page).toHaveURL(/\/check\/#setup$/);
});

test("app routes load directly and browser back restores the prior screen", async ({ page }) => {
  await page.goto("/#history");
  await expect(page.getByRole("heading", { name: "Past checks" })).toBeVisible();
  await page.goto("/demo/#setup");
  await expect(page.getByRole("heading", { name: "Compare your gaze-controlled pointer right now" })).toBeVisible();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await expect(page).toHaveURL(/#ready$/);
  await page.goBack();
  await expect(page).toHaveURL(/#setup$/);
  await expect(page.getByRole("heading", { name: "Compare your gaze-controlled pointer right now" })).toBeFocused();
  await page.goForward();
  await expect(page).toHaveURL(/#ready$/);
  await expect(page.getByRole("heading", { name: "Follow each target" })).toBeFocused();
});

test("the app reflows at 200% text size on a phone", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Text zoom is a phone layout check.");
  await page.goto("/");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expect.poll(() => page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))).toEqual({ scrollWidth: 390, clientWidth: 390 });
});
