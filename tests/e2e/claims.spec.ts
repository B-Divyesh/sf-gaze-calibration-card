import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";

const execFileAsync = promisify(execFile);

const siteUrl = "http://127.0.0.1:4173";
const siteCache = "gaze-card-site-v2";
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
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  for (let index = 1; index <= 9; index += 1) await page.getByRole("button", { name: `Target ${index} of 9` }).press("Space");
}

async function waitForOfflineShell(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error("Service worker did not activate");
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    }
  });
  await expect.poll(async () => page.evaluate(async (cacheName) => {
    const assetPaths = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>("script[src], link[rel='modulepreload'][href], link[rel='stylesheet'][href]")]
      .map((element) => new URL(element.getAttribute("src") ?? element.getAttribute("href") ?? "", location.href).pathname);
    const cache = await caches.open(cacheName);
    const cached = await Promise.all(assetPaths.map((path) => cache.match(path, { ignoreVary: true })));
    return cached.every(Boolean);
  }, siteCache)).toBe(true);
}

test("@claim:sample-demo opens realistic data in isolated storage", async ({ page }) => {
  await page.goto(`${siteUrl}/`);
  await page.evaluate(() => localStorage.setItem("gaze-calibration-card:checks:v1", "real-history-marker"));
  await page.getByRole("link", { name: /Try it with sample data/ }).first().click();
  await expect(page).toHaveURL(/\/demo\/#result$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(await page.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1"))).toBe("real-history-marker");
  await page.getByRole("button", { name: "Start a new check" }).click();
  await expect(page).toHaveURL(/\/check\/#setup$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1"))).toBe("real-history-marker");
  expect(await page.evaluate(() => localStorage.getItem("demo:gaze-calibration-card:checks:v1"))).toBeNull();
  await page.goto(`${siteUrl}/?demo=1`);
  await expect(page).toHaveURL(/\/demo\/#result$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1"))).toBe("real-history-marker");
});

test("@claim:offline-reload reloads the complete site after one visit", async ({ browser }) => {
  // This claim deliberately owns its context: offline state and service-worker
  // storage must not leak into the normal desktop/mobile browser fixtures.
  const context = await browser.newContext();
  try {
    await context.route("https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest", (route) => route.fulfill({ json: releaseFixture }));
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(`${message.location().url}: ${message.text()}`); });

    await page.goto(`${siteUrl}/`);
    await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
    await waitForOfflineShell(page);
    const cached = await page.evaluate(async (cacheName) => (await (await caches.open(cacheName)).keys()).map((request) => request.url), siteCache);
    expect(cached.some((url) => /\/assets\/main-.*\.js$/.test(url))).toBe(true);
    expect(cached.some((url) => /\/assets\/style-.*\.css$/.test(url))).toBe(true);
    expect(cached.some((url) => url.endsWith("/assets/hero-field-guide.avif"))).toBe(true);

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Check your gaze-controlled pointer before a demanding task" })).toBeVisible();
    await context.setOffline(false);

    await page.goto(`${siteUrl}/demo/`);
    await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
    await waitForOfflineShell(page);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(page.getByRole("heading", { name: "Pattern within comparison guide" })).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
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
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const download = await downloadPromise;
  const report = await readFile(await download.path() as string, "utf8");
  expect(report).toContain("Wheelchair upright; headrest raised");
  expect(requests.every((url) => new URL(url).origin === siteUrl)).toBe(true);
  expect(await page.evaluate(() => (window as typeof window & { cameraRequested?: boolean }).cameraRequested)).toBe(false);
});

test("@claim:no-account completes the useful flows without authentication", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto(`${siteUrl}/demo/`);
  await page.getByRole("button", { name: "Reset demo" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  await downloadPromise;
  await expect(page.getByRole("link", { name: /sign in|log in|create account/i })).toHaveCount(0);
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);

  await page.goto("/");
  await completeKeyboardCheck(page);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]").length)).toBe(1);
  expect(requests.some((url) => /\/auth\b|\/login\b|\/account\b/i.test(new URL(url).pathname))).toBe(false);
  expect(await page.context().cookies()).toEqual([]);
});

test("@claim:nine-targets shows one reading for every target", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  await expect(page.locator(".map-point")).toHaveCount(9);
});

test("@claim:pointer-measures reports error, dwell, and directional pattern", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  await expect(page.getByText("Average target error")).toBeVisible();
  await expect(page.getByText("Dwell", { exact: true })).toBeVisible();
  await expect(page.getByText("Directional pattern")).toBeVisible();
  await expect(page.getByText(/42/).first()).toBeVisible();
});

test("@claim:pointer-sampling stores a local sample for every target", async ({ page, isMobile }) => {
  test.skip(isMobile, "Representative system-pointer path runs on desktop.");
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
  const result = await page.evaluate(() => JSON.parse(localStorage.getItem("gaze-calibration-card:checks:v1") ?? "[]")[0]);
  expect(result.readings).toHaveLength(9);
  expect(result.readings.every((reading: { samples: unknown[] }) => reading.samples.length > 0)).toBe(true);
});

test("@claim:keyboard-high-contrast supports keyboard completion and forced colors", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByText("Keyboard practice", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  expect(await page.getByRole("button", { name: "Target 1 of 9" }).evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  for (let index = 1; index <= 9; index += 1) await page.getByRole("button", { name: `Target ${index} of 9` }).press("Space");
  await expect(page.getByRole("heading", { name: "Keyboard path complete" })).toBeFocused();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});

test("@claim:report-export downloads a standalone HTML support report", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^gaze-check-.*\.html$/);
  const report = await readFile(await download.path() as string, "utf8");
  expect(report).toContain("Pointer comparison");
  expect(report).not.toMatch(/<(script|img|link)\b|https?:\/\//i);
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
  await page.getByRole("button", { name: "View past checks" }).click();
  await page.getByRole("button", { name: "Clear history" }).click();
  await page.getByRole("button", { name: "Clear checks" }).click();
  // Regression: the clear operation must be committed by the confirming click,
  // not deferred until the dialog's later close event.
  expect(await page.evaluate(() => localStorage.getItem("gaze-calibration-card:checks:v1"))).toBeNull();
});

test("@claim:release-download selects every published platform branch and caches GitHub metadata for one hour", async ({ browser }) => {
  // Each simulated device owns and closes its own browser context. Keeping
  // five device contexts open at once caused Chromium to crash late in the
  // complete mobile run, which then made an unrelated deployment test fail.
  const releaseRoute = "https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest";
  let activeSimulationContexts = 0;
  let maximumSimulationContexts = 0;
  const openSimulationContext = async () => {
    const context = await browser.newContext({ serviceWorkers: "block" });
    activeSimulationContexts += 1;
    maximumSimulationContexts = Math.max(maximumSimulationContexts, activeSimulationContexts);
    return context;
  };
  const closeSimulationContext = async (context: import("@playwright/test").BrowserContext) => {
    await context.close();
    activeSimulationContexts -= 1;
  };
  const openPlatform = async (platform: string, architecture: string, unavailable = false) => {
    const context = await openSimulationContext();
    try {
      await context.addInitScript(({ platformName, architectureName, fail }) => {
        Object.defineProperty(navigator, "userAgentData", {
          configurable: true,
          value: {
            platform: platformName,
            getHighEntropyValues: async () => {
              if (fail) throw new Error("Architecture unavailable");
              return { architecture: architectureName };
            }
          }
        });
      }, { platformName: platform, architectureName: architecture, fail: unavailable });
      await context.route(releaseRoute, (route) => route.fulfill({ json: releaseFixture }));
      const page = await context.newPage();
      await page.goto(`${siteUrl}/`);
      return await (async () => {
        if (platform === "Linux") {
          await expect(page.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-amd64\.AppImage$/);
          await expect(page.locator("#platform-label")).toHaveText("Download for Linux");
        } else if (platform === "macOS" && architecture === "arm") {
          await expect(page.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-aarch64\.dmg$/);
          await expect(page.locator("#platform-label")).toHaveText("Download for Mac (Apple silicon)");
        } else if (platform === "macOS" && architecture === "x86") {
          await expect(page.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-x64\.dmg$/);
          await expect(page.locator("#platform-label")).toHaveText("Download for Mac (Intel)");
        } else {
          await expect(page.locator("#platform-label")).toHaveText("Choose a Mac download");
          await expect(page.getByText("Mac architecture could not be detected:")).toBeVisible();
          await expect(page.getByRole("link", { name: "Apple silicon", exact: true })).toHaveAttribute("href", /app-aarch64\.dmg$/);
          await expect(page.getByRole("link", { name: "Intel", exact: true })).toHaveAttribute("href", /app-x64\.dmg$/);
        }
      })();
    } finally {
      await closeSimulationContext(context);
    }
  };

  const windows = await openSimulationContext();
  try {
    const page = await windows.newPage();
    let apiCalls = 0;
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.addInitScript(() => Object.defineProperty(navigator, "userAgentData", { configurable: true, value: { platform: "Windows", getHighEntropyValues: async () => ({ architecture: "x86" }) } }));
    await page.route(releaseRoute, (route) => { apiCalls += 1; return route.fulfill({ json: releaseFixture }); });
    await page.goto(`${siteUrl}/`);
    await expect(page.getByRole("link", { name: /Download the app/ })).toHaveAttribute("href", /app-x64\.exe$/);
    await expect(page.locator("#platform-label")).toHaveText("Download for Windows");
    expect(requests.every((url) => [siteUrl, "https://api.github.com"].includes(new URL(url).origin))).toBe(true);
    await page.evaluate(() => {
      const key = "gaze-calibration-card:release:v1";
      const cached = JSON.parse(localStorage.getItem(key) ?? "{}");
      cached.savedAt = Date.now() - (60 * 60 * 1000) + 10_000;
      localStorage.setItem(key, JSON.stringify(cached));
    });
    await page.reload();
    await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
    expect(apiCalls).toBe(1);
    await page.evaluate(() => {
      const key = "gaze-calibration-card:release:v1";
      const cached = JSON.parse(localStorage.getItem(key) ?? "{}");
      cached.savedAt = Date.now() - (60 * 60 * 1000) - 1;
      localStorage.setItem(key, JSON.stringify(cached));
    });
    await page.reload();
    await expect(page.locator("#download-status")).toContainText("Version 0.1.1");
    expect(apiCalls).toBe(2);

  } finally {
    await closeSimulationContext(windows);
  }

  await openPlatform("Linux", "x86");
  await openPlatform("macOS", "arm");
  await openPlatform("macOS", "x86");
  await openPlatform("macOS", "", true);
  // Exact regression for the mobile Chromium crash: every simulated device is
  // isolated, and its context is closed before the next one opens.
  expect(maximumSimulationContexts).toBe(1);
});

test("@claim:installer-checksum executes the shell installer and stops before use on a checksum mismatch", async () => {
  const shell = await readFile("public/install.sh", "utf8");
  expect(shell).toMatch(/sha256sum|shasum/);
  expect(shell).toContain("Checksum verification failed");
  const directory = await mkdtemp(join(tmpdir(), "gaze-installer-"));
  await writeFile(join(directory, "latest.json"), JSON.stringify({ assets: { "linux-x86_64": { url: "https://fixture.invalid/app.AppImage", sha256: "0000000000000000000000000000000000000000000000000000000000000000" } } }));
  await writeFile(join(directory, "curl"), `#!/bin/sh\nset -eu\nout=\"\"\nfor arg in \"$@\"; do out=\"$arg\"; done\ncase \"$out\" in *latest.json) cp \"$FIXTURE_DIR/latest.json\" \"$out\" ;; *) printf corrupt > \"$out\" ;; esac\n`);
  await writeFile(join(directory, "uname"), "#!/bin/sh\n[ \"$1\" = -s ] && echo Linux || echo x86_64\n");
  await chmod(join(directory, "curl"), 0o755);
  await chmod(join(directory, "uname"), 0o755);
  await expect(execFileAsync("sh", ["public/install.sh"], { env: { ...process.env, XDG_BIN_HOME: directory, FIXTURE_DIR: directory, PATH: `${directory}:${process.env.PATH}` } })).rejects.toThrow(/Checksum verification failed/);
  await rm(directory, { recursive: true, force: true });
});

test("@claim:comparison-bands-limit keeps the device-dependent, unvalidated limit in the app and exported report", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  const limitation = "Pixel bands are device-dependent and have not been validated across eye trackers or screens.";
  await expect(page.locator(".validation-note")).toContainText(limitation);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const report = await readFile(await (await downloadPromise).path() as string, "utf8");
  expect(report).toContain(limitation);
});

test("@claim:not-a-diagnosis keeps comparison-only language in the app and exported report", async ({ page }) => {
  await page.goto(`${siteUrl}/demo/`);
  const limitation = "This comparison does not diagnose a condition or replace your device maker’s calibration.";
  await expect(page.locator(".validation-note")).toContainText(limitation);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export support report" }).click();
  const report = await readFile(await (await downloadPromise).path() as string, "utf8");
  expect(report).toContain(limitation);
  expect(report).toContain("It is not a pass or fail.");
});

test("@claim:unsigned-builds inspects every published Windows and macOS app package", async ({ page, isMobile }) => {
  test.skip(isMobile, "Release artifacts are inspected once in the desktop project.");
  await page.goto(`${siteUrl}/`);
  await page.getByText("Install another way", { exact: true }).click();
  await expect(page.getByText("The Windows installers and macOS app bundles are unsigned.", { exact: true })).toBeVisible();
  const { stdout } = await execFileAsync(process.execPath, ["tests/release-unsigned.test.mjs"]);
  const evidence = JSON.parse(stdout.slice(stdout.indexOf("{")));
  expect(evidence.artifacts).toHaveLength(4);
  expect(evidence.artifacts.every((artifact: { publisherSignature: boolean }) => artifact.publisherSignature === false)).toBe(true);
});

test("@claim:free-open-source exposes the MIT license and no payment action", async ({ page }) => {
  await page.goto(`${siteUrl}/`);
  await expect(page.getByText("Free and open source", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Source on GitHub (external)" })).toHaveAttribute("href", /sf-gaze-calibration-card/);
  await expect(page.getByText(/buy|subscribe|payment/i)).toHaveCount(0);
  expect(await readFile("LICENSE", "utf8")).toContain("MIT License");
});

test("@claim:thirty-second-check completes automatically in about 30 seconds", async ({ page }) => {
  test.setTimeout(40_000);
  await page.goto("/");
  await page.getByText("Mouse or touch", { exact: true }).click();
  await page.getByRole("button", { name: "Prepare the check" }).click();
  const started = Date.now();
  await page.getByRole("button", { name: "Start nine-target check" }).click();
  await expect(page.getByRole("heading", { name: "Pattern outside comparison guide" })).toBeVisible({ timeout: 32_000 });
  const elapsed = Date.now() - started;
  expect(elapsed).toBeGreaterThanOrEqual(24_000);
  expect(elapsed).toBeLessThanOrEqual(30_000);
});
