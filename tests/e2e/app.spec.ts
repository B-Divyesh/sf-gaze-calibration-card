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
  expect(errors).toEqual([]);
});

test("keyboard-only user can complete a practice check", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Keyboard practice", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-point check" }).click();
  for (let index = 1; index <= 9; index += 1) {
    const target = page.getByRole("button", { name: `Target ${index} of 9` });
    await expect(target).toBeFocused();
    await target.press("Space");
  }
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeVisible();
  await expect(page.getByText(/No gaze reliability score/)).toBeVisible();
});
