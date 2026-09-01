import { spawn } from "node:child_process";
import { readFile, rm } from "node:fs/promises";
import { chromium } from "@playwright/test";

const port = 4174;
const url = `http://127.0.0.1:${port}/`;
const reports = ["/tmp/gaze-card-lighthouse-1.json", "/tmp/gaze-card-lighthouse-2.json", "/tmp/gaze-card-lighthouse-3.json"];
const preview = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--config", "vite.site.config.ts", "--host", "127.0.0.1", "--port", String(port)], {
  cwd: process.cwd(),
  stdio: "ignore"
});

async function waitForPreview() {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* The preview server is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error("Timed out waiting for the static preview server");
}

function runLighthouse(report) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.platform === "win32" ? "npx.cmd" : "npx", [
      "lighthouse", url,
      "--only-categories=performance,accessibility",
      "--preset=perf",
      "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-gpu",
      "--output=json",
      `--output-path=${report}`,
      "--quiet"
    ], {
      cwd: process.cwd(),
      env: { ...process.env, CHROME_PATH: chromium.executablePath() },
      stdio: "inherit"
    });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve(undefined) : reject(new Error(`Lighthouse exited ${code}`)));
  });
}

try {
  await waitForPreview();
  const scores = [];
  for (const report of reports) {
    await rm(report, { force: true });
    await runLighthouse(report);
    const result = JSON.parse(await readFile(report, "utf8"));
    scores.push({
      performance: Math.round(result.categories.performance.score * 100),
      accessibility: Math.round(result.categories.accessibility.score * 100)
    });
  }
  const median = [...scores].sort((left, right) => left.performance - right.performance)[1].performance;
  console.log(`Mobile Lighthouse: ${scores.map((score) => `${score.performance}/${score.accessibility}`).join(", ")} (median performance ${median})`);
  if (median < 90) throw new Error(`Mobile Lighthouse median performance ${median} is below 90`);
  if (scores.some((score) => score.accessibility < 95)) throw new Error("Mobile Lighthouse accessibility is below 95");
} finally {
  preview.kill("SIGTERM");
}
