import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("setup is accessible and has no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page).toHaveTitle("Gaze Calibration Card");
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
  await expect(page.getByRole("heading", { name: "Follow each pollen mark" })).toBeFocused();
  await page.getByRole("button", { name: "Start nine-point check" }).click();
  for (let index = 1; index <= 9; index += 1) {
    const target = page.getByRole("button", { name: `Target ${index} of 9` });
    await expect(target).toBeFocused();
    await target.press("Space");
  }
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeFocused();
  await expect(page.getByText(/No gaze reliability score/)).toBeVisible();
});

test("pointer check produces and exports a measured result", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer path is the representative gaze-controlled cursor path.");
  await page.goto("/");
  await page.getByText("Mouse or touch", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-point check" }).click();
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
