import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page has a complete accessible shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("h1")).toHaveCount(1);
  const download = page.getByRole("link", { name: /Download the app/ });
  await expect(download).toBeVisible();
  await expect(page.locator("#download-status")).toContainText("Version 0.1.0");
  await expect(download).toHaveAttribute("href", /releases\/download\/v0\.1\.0\//);
  await expect(page.locator("img[alt]")).toHaveCount(1);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  await page.emulateMedia({ colorScheme: "dark" });
  const darkResults = await new AxeBuilder({ page: page as never }).analyze();
  expect(darkResults.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("policy pages are available", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/privacy/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy, in plain language");
  await page.goto("http://127.0.0.1:4173/terms/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Terms of use");
});
