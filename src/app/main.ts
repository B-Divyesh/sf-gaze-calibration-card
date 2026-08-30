import "./style.css";
import { calculateMetrics, describeDrift, escapeHtml, formatDate, targetPositions, type InputMode, type Metrics, type PointSample, type TargetReading } from "./core";

declare const __BUILD_ID__: string;

interface Setup {
  mode: InputMode;
  posture: string;
  glasses: string;
  lighting: string;
  notes: string;
  saveNotes: boolean;
  keepHistory: boolean;
}

interface SavedCheck {
  id: string;
  date: string;
  setup: Setup;
  metrics: Metrics;
  readings: TargetReading[];
}

const STORAGE_KEY = "gaze-calibration-card:checks:v1";
const DEMO_STORAGE_KEY = "demo:gaze-calibration-card:checks:v1";
const mount = document.querySelector<HTMLDivElement>("#app");
if (!mount) throw new Error("App mount not found");
const app: HTMLDivElement = mount;

let setup: Setup = {
  mode: "gaze-pointer", posture: "", glasses: "", lighting: "", notes: "", saveNotes: false, keepHistory: true
};
let readings: TargetReading[] = [];
let pointer: PointSample | null = null;
let targetIndex = 0;
let sampleTimer = 0;
let advanceTimer = 0;
let targetStarted = 0;
let targetCompleted = false;
let lastResult: SavedCheck | null = null;
let isDemo = location.pathname.startsWith("/demo") || new URLSearchParams(location.search).get("demo") === "1";

const sampleResult: SavedCheck = {
  id: "sample-steady-morning",
  date: "2026-08-30T09:15:00.000Z",
  setup: {
    mode: "gaze-pointer",
    posture: "Wheelchair upright; headrest raised",
    glasses: "Distance glasses",
    lighting: "Even indoor light",
    notes: "Monitor centered after breakfast",
    saveNotes: true,
    keepHistory: true
  },
  metrics: {
    meanError: 42,
    horizontalDrift: 7,
    verticalDrift: -4,
    dwellReliability: 91,
    sampleCount: 108,
    verdict: "reliable"
  },
  readings: targetPositions.map(([x, y], index) => ({
    targetX: x,
    targetY: y,
    samples: [{ x: x + 28 + (index % 3) * 4, y: y + 20, time: 2100 }]
  }))
};

document.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, time: performance.now() };
}, { passive: true });

window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);

function shell(content: string, step = "setup") {
  app.innerHTML = `
    ${isDemo ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span>Explore a completed check without changing your history.</span><button id="reset-demo" type="button">Reset demo</button><button id="leave-demo" type="button">Start for real</button></aside>` : ""}
    <header class="app-header">
      <a class="brand" href="#setup" aria-label="Gaze Calibration Card home">
        <svg aria-hidden="true" viewBox="0 0 40 40"><path d="M20 34C19 21 25 12 34 6M19 26c-6 0-10-4-11-9 6-1 11 2 12 7M23 19c0-6 4-10 9-11 1 6-2 11-8 12"/></svg>
        <span><b>Gaze Calibration Card</b><small>Local reliability check</small></span>
      </a>
      <div class="header-actions">
        <span id="network-status" class="network-note" role="status"></span>
        <button class="text-button" id="history-button" type="button">Past checks</button>
      </div>
    </header>
    <p id="view-announcement" class="sr-only" role="status" aria-live="polite"></p>
    <main id="main" data-step="${step}">${content}</main>
    <footer class="app-footer"><span>Measurements stay on this device.</span><span>Not a medical or hardware diagnostic.</span><span>Build ${__BUILD_ID__}</span></footer>`;
  document.querySelector("#history-button")?.addEventListener("click", renderHistory);
  document.querySelector("#reset-demo")?.addEventListener("click", resetDemo);
  document.querySelector("#leave-demo")?.addEventListener("click", leaveDemo);
  updateNetworkStatus();
}

function announceAndFocus(message: string) {
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>("#page-title");
    const announcement = document.querySelector<HTMLElement>("#view-announcement");
    if (announcement) announcement.textContent = message;
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  });
}

function resetDemo() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  readings = sampleResult.readings;
  lastResult = sampleResult;
  renderResult(sampleResult);
}

function leaveDemo() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  isDemo = false;
  history.replaceState({}, "", location.pathname.startsWith("/demo") ? "/" : location.pathname);
  renderSetup(true);
}

function updateNetworkStatus() {
  const status = document.querySelector<HTMLElement>("#network-status");
  if (!status) return;
  status.textContent = navigator.onLine ? "Ready offline" : "Offline — check still works";
  status.classList.toggle("is-offline", !navigator.onLine);
}

function renderSetup(shouldFocus = false) {
  clearTimers();
  shell(`
    <section class="intro-grid" aria-labelledby="page-title">
      <div class="intro-copy">
        <p class="eyebrow">Field check 01 · about 30 seconds</p>
        <h1 id="page-title">Is your gaze setup steady enough right now?</h1>
        <p class="lead">Visit nine marks. We’ll summarize pointer error, directional drift, and dwell steadiness before you begin a demanding interaction.</p>
        <div class="privacy-strip"><b>No camera access.</b> This reads the system pointer your gaze device already controls. Nothing leaves this device.</div>
      </div>
      <figure class="hero-figure">
        <picture>
          <source srcset="/assets/hero-field-guide.avif" type="image/avif">
          <img src="/assets/hero-field-guide.webp" width="900" height="600" alt="Pressed fern curving around nine copper seed specimens arranged like calibration points" fetchpriority="high" decoding="async">
        </picture>
        <figcaption>Observe nine points, like specimens on a field card.</figcaption>
      </figure>
    </section>
    <section class="setup-sheet" aria-labelledby="setup-heading">
      <div class="section-number" aria-hidden="true">I</div>
      <div>
        <h2 id="setup-heading">Note today’s setup</h2>
        <p>Optional details make a saved report useful to you, a caregiver, or device support.</p>
        <form id="setup-form">
          <fieldset>
            <legend>How will you complete the marks?</legend>
            <div class="choice-grid">
              <label class="choice"><input type="radio" name="mode" value="gaze-pointer" checked><span><b>Eye-controlled pointer</b><small>Recommended. Your device moves the system pointer.</small></span></label>
              <label class="choice"><input type="radio" name="mode" value="pointer"><span><b>Mouse or touch</b><small>Explore the check without a gaze device.</small></span></label>
              <label class="choice"><input type="radio" name="mode" value="keyboard"><span><b>Keyboard practice</b><small>Verify access with Tab and Space; no gaze score.</small></span></label>
            </div>
          </fieldset>
          <div class="form-grid">
            <label>Posture or position <input name="posture" autocomplete="off" placeholder="e.g. chair reclined, headrest up"></label>
            <label>Glasses or lenses <input name="glasses" autocomplete="off" placeholder="e.g. reading glasses"></label>
            <label>Room light <select name="lighting"><option value="">Not noted</option><option>Dim</option><option>Even indoor light</option><option>Bright room</option><option>Direct sunlight</option></select></label>
            <label>Other setup note <input name="notes" autocomplete="off" placeholder="e.g. monitor lowered 3 cm"></label>
          </div>
          <div class="consent-row">
            <label><input type="checkbox" name="saveNotes"> Save these notes with the result</label>
            <label><input type="checkbox" name="keepHistory" checked> Keep this check in local history</label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit">Prepare the check <span aria-hidden="true">→</span></button>
            <button class="secondary-button" id="load-sample" type="button">Load sample project</button>
            <span class="action-note">You can stop at any time with Escape.</span>
          </div>
        </form>
      </div>
    </section>`, "setup");
  document.querySelector<HTMLFormElement>("#setup-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    setup = {
      mode: form.get("mode") as InputMode,
      posture: String(form.get("posture") ?? ""),
      glasses: String(form.get("glasses") ?? ""),
      lighting: String(form.get("lighting") ?? ""),
      notes: String(form.get("notes") ?? ""),
      saveNotes: form.has("saveNotes"),
      keepHistory: form.has("keepHistory")
    };
    renderReady();
  });
  document.querySelector("#load-sample")?.addEventListener("click", () => {
    isDemo = true;
    resetDemo();
  });
  if (shouldFocus) announceAndFocus("Setup ready");
}

function renderReady() {
  shell(`
    <section class="ready-sheet" aria-labelledby="page-title">
      <p class="eyebrow">Field check 01 · ready</p>
      <h1 id="page-title">Follow each pollen mark</h1>
      <div class="instruction-columns">
        <div><span class="instruction-mark">1</span><h2>Settle</h2><p>Move your gaze pointer into the gold center and hold it there. Each mark records automatically.</p></div>
        <div><span class="instruction-mark">2</span><h2>Stay natural</h2><p>Keep the posture you want to test. Don’t chase a score by moving closer.</p></div>
        <div><span class="instruction-mark">3</span><h2>Pause if needed</h2><p>Press Escape to stop. Keyboard practice uses Tab, then Space or Enter.</p></div>
      </div>
      <div class="ready-actions">
        <button class="primary-button" id="start-check" type="button">Start nine-point check <span aria-hidden="true">→</span></button>
        <button class="secondary-button" id="back-setup" type="button">Back to setup</button>
      </div>
      <p class="device-note">Results depend on your screen, pointer settings, and eye-tracker driver. This companion does not replace the maker’s calibration.</p>
    </section>`, "ready");
  document.querySelector("#start-check")?.addEventListener("click", startCheck);
  document.querySelector("#back-setup")?.addEventListener("click", () => renderSetup(true));
  announceAndFocus("Check instructions ready");
}

function startCheck() {
  readings = [];
  targetIndex = 0;
  renderCheck();
}

function renderCheck() {
  clearTimers();
  targetCompleted = false;
  const [left, top] = targetPositions[targetIndex];
  shell(`
    <section class="check-shell" aria-labelledby="page-title">
      <h1 id="page-title" class="sr-only">Nine-point gaze check</h1>
      <div class="check-meta"><span>Specimen ${targetIndex + 1} of 9</span><progress value="${targetIndex}" max="9">${targetIndex} of 9</progress><span id="check-instruction">${setup.mode === "keyboard" ? "Tab to the mark, then press Space" : "Rest on the gold center"}</span></div>
      <div class="target-field" id="target-field">
        ${readings.map((_, index) => `<span class="target-trace" style="--x:${targetPositions[index][0]}%;--y:${targetPositions[index][1]}%" aria-hidden="true"></span>`).join("")}
        <button class="gaze-target" id="gaze-target" type="button" style="--x:${left}%;--y:${top}%" aria-label="Target ${targetIndex + 1} of 9"><span></span></button>
        <p class="field-caption">Keep your usual head and chair position</p>
      </div>
      <button class="stop-button" id="stop-check" type="button">Stop check <kbd>Esc</kbd></button>
    </section>`, "check");
  document.querySelector("#stop-check")?.addEventListener("click", renderStopped);
  document.addEventListener("keydown", handleEscape, { once: true });
  const target = document.querySelector<HTMLButtonElement>("#gaze-target");
  if (!target) return;
  if (setup.mode === "keyboard") target.focus();
  else announceAndFocus(`Target ${targetIndex + 1} of 9 ready`);
  target.addEventListener("keydown", (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      completeKeyboardTarget(target);
    }
  });
  target.addEventListener("click", (event) => {
    if (setup.mode !== "keyboard" && performance.now() - targetStarted > 650) completeCurrentTarget(target, event.clientX, event.clientY);
  });
  beginSampling(target);
}

function beginSampling(target: HTMLButtonElement) {
  targetStarted = performance.now();
  const samples: PointSample[] = [];
  const rect = target.getBoundingClientRect();
  readings.push({ targetX: rect.left + rect.width / 2, targetY: rect.top + rect.height / 2, samples });
  if (setup.mode === "keyboard") return;
  sampleTimer = window.setInterval(() => {
    const elapsed = performance.now() - targetStarted;
    if (elapsed >= 1600 && pointer && performance.now() - pointer.time < 600) samples.push({ ...pointer, time: elapsed });
  }, 50);
  advanceTimer = window.setTimeout(() => completeCurrentTarget(target), 2800);
}

function completeKeyboardTarget(target: HTMLButtonElement) {
  if (targetCompleted) return;
  targetCompleted = true;
  const rect = target.getBoundingClientRect();
  const reading = readings[readings.length - 1];
  reading.keyboard = true;
  reading.samples = [{ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, time: performance.now() - targetStarted }];
  advanceTarget();
}

function completeCurrentTarget(target: HTMLButtonElement, clickX?: number, clickY?: number) {
  if (targetCompleted) return;
  targetCompleted = true;
  const reading = readings[readings.length - 1];
  if (clickX !== undefined && clickY !== undefined) reading.samples.push({ x: clickX, y: clickY, time: performance.now() - targetStarted });
  if (!reading.samples.length && pointer) reading.samples.push({ ...pointer, time: performance.now() - targetStarted });
  target.classList.add("is-complete");
  window.setTimeout(advanceTarget, 180);
}

function advanceTarget() {
  clearTimers();
  targetIndex += 1;
  if (targetIndex >= targetPositions.length) finishCheck();
  else renderCheck();
}

function clearTimers() {
  window.clearInterval(sampleTimer);
  window.clearTimeout(advanceTimer);
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape") renderStopped();
  else document.addEventListener("keydown", handleEscape, { once: true });
}

function renderStopped() {
  clearTimers();
  shell(`<section class="message-sheet" aria-labelledby="page-title"><p class="eyebrow">Check paused</p><h1 id="page-title">No result was saved</h1><p>You stopped after ${Math.min(readings.length, 9)} of 9 marks. Your setup notes remain only in this open session.</p><div class="ready-actions"><button class="primary-button" id="restart" type="button">Start again</button><button class="secondary-button" id="edit-setup" type="button">Edit setup</button></div></section>`, "stopped");
  document.querySelector("#restart")?.addEventListener("click", startCheck);
  document.querySelector("#edit-setup")?.addEventListener("click", () => renderSetup(true));
  announceAndFocus("Check stopped. No result was saved");
}

function finishCheck() {
  clearTimers();
  const metrics = calculateMetrics(readings, setup.mode);
  const savedSetup = setup.saveNotes ? setup : { ...setup, posture: "", glasses: "", lighting: "", notes: "" };
  lastResult = { id: crypto.randomUUID(), date: new Date().toISOString(), setup: savedSetup, metrics, readings };
  if (setup.keepHistory) saveCheck(lastResult);
  renderResult(lastResult);
}

function renderResult(result: SavedCheck) {
  const { metrics } = result;
  const verdictCopy = {
    reliable: ["Pattern within comparison guide", "The pointer stayed inside this app’s comparison bands."],
    borderline: ["Mixed comparison pattern", "Drift or dwell crossed one of this app’s comparison bands."],
    unreliable: ["Pattern outside comparison guide", metrics.sampleCount ? "The pointer crossed this app’s error or dwell bands." : "No recent pointer movement was detected. Make sure your gaze device moves the system pointer."],
    practice: ["Keyboard path complete", "Keyboard access works. No gaze reliability score was calculated."]
  }[metrics.verdict];
  shell(`
    <section class="result-sheet" aria-labelledby="page-title">
      <div class="result-heading">
        <div><p class="eyebrow">Field check complete · ${escapeHtml(formatDate(result.date))}</p><h1 id="page-title">${verdictCopy[0]}</h1><p class="lead">${verdictCopy[1]}</p></div>
        <div class="verdict-stamp verdict-${metrics.verdict}" aria-label="Verdict: ${verdictCopy[0]}"><span>${metrics.verdict === "reliable" ? "✓" : metrics.verdict === "practice" ? "⌨" : "!"}</span>${verdictCopy[0]}</div>
      </div>
      ${metrics.verdict === "practice" ? `<div class="practice-note"><b>Practice only:</b> Repeat with “Eye-controlled pointer” to measure accuracy and dwell.</div>` : `
      <div class="metrics-grid" aria-label="Measurement summary">
        <div><span>Average target error</span><strong>${Math.round(metrics.meanError)}<small> px</small></strong><p>${metrics.meanError <= 80 ? "Inside the ≤80 px comparison band" : "Outside the ≤80 px comparison band"}</p></div>
        <div><span>Dwell reliability</span><strong>${Math.round(metrics.dwellReliability)}<small>%</small></strong><p>${metrics.dwellReliability >= 75 ? "Steady on most samples" : "Pointer wandered or went quiet"}</p></div>
        <div><span>Directional pattern</span><strong class="drift-value">${escapeHtml(describeDrift(metrics.horizontalDrift, metrics.verticalDrift))}</strong><p>${metrics.sampleCount} local pointer samples</p></div>
      </div>`}
      <p class="validation-note"><b>Use this as a comparison, not a pass or fail.</b> These pixel bands have not been validated across eye trackers or screen sizes.</p>
      <div class="result-detail">
        <div class="result-map" role="img" aria-label="Nine-point map. ${Math.round(metrics.meanError)} pixel average error and ${Math.round(metrics.dwellReliability)} percent dwell reliability.">
          ${readings.map((reading, index) => {
            const error = reading.samples.length ? reading.samples.reduce((sum, sample) => sum + Math.hypot(sample.x - reading.targetX, sample.y - reading.targetY), 0) / reading.samples.length : 999;
            const state = error <= 80 ? "good" : error <= 125 ? "warn" : "bad";
            return `<span class="map-point ${state}" style="--x:${targetPositions[index][0]}%;--y:${targetPositions[index][1]}%"><i>${index + 1}</i><b>${error >= 999 ? "No sample" : `${Math.round(error)} px`}</b></span>`;
          }).join("")}
          <span class="map-caption">Screen field · per-mark mean error</span>
        </div>
        <div class="next-note"><h2>What to do next</h2>${nextSteps(metrics)}<p class="threshold-note">Comparison bands: ≤80 px and ≥75% dwell; mixed: ≤125 px and ≥55%. Unvalidated, device-dependent, and not diagnostic.</p></div>
      </div>
      <div class="result-actions">
        <button class="primary-button" id="run-again" type="button">Check again</button>
        <button class="secondary-button" id="export-report" type="button">Export support report</button>
        <button class="text-button" id="new-setup" type="button">Change setup notes</button>
      </div>
      <p id="export-status" class="export-status" role="status" aria-live="polite"></p>
    </section>`, "result");
  document.querySelector("#run-again")?.addEventListener("click", startCheck);
  document.querySelector("#new-setup")?.addEventListener("click", () => renderSetup(true));
  document.querySelector("#export-report")?.addEventListener("click", () => exportReport(result));
  announceAndFocus(`Check result: ${verdictCopy[0]}`);
}

function nextSteps(metrics: Metrics): string {
  if (metrics.verdict === "reliable") return "<p>Compare this result with your own comfortable sessions before starting a demanding task.</p>";
  if (metrics.verdict === "practice") return "<p>Choose the eye-controlled pointer mode when your gaze device is ready.</p>";
  if (!metrics.sampleCount) return "<p>Confirm that the tracker is on and controlling the pointer, then repeat the check.</p>";
  const steps = ["Run your device maker’s calibration", "Return to the posture recorded for a good check"];
  if (Math.abs(metrics.horizontalDrift) > 24 || Math.abs(metrics.verticalDrift) > 24) steps.unshift("Re-center the display and tracker toward your usual head position");
  return `<ul>${steps.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function getChecks(): SavedCheck[] {
  try { return JSON.parse(localStorage.getItem(isDemo ? DEMO_STORAGE_KEY : STORAGE_KEY) ?? "[]") as SavedCheck[]; }
  catch { return []; }
}

function saveCheck(check: SavedCheck) {
  const checks = [check, ...getChecks()].slice(0, 50);
  try { localStorage.setItem(isDemo ? DEMO_STORAGE_KEY : STORAGE_KEY, JSON.stringify(checks)); }
  catch { /* A result remains exportable even if storage is unavailable. */ }
}

function renderHistory() {
  clearTimers();
  const checks = getChecks();
  shell(`<section class="history-sheet" aria-labelledby="page-title">
    <div class="history-heading"><div><p class="eyebrow">Local notebook</p><h1 id="page-title">Past checks</h1><p>Only checks you chose to keep appear here.</p></div>${checks.length ? `<button class="danger-button" id="clear-history" type="button">Clear history</button>` : ""}</div>
    ${checks.length ? `<ol class="history-list">${checks.map((check) => `<li><button type="button" data-id="${check.id}"><span class="history-verdict ${check.metrics.verdict}">${check.metrics.verdict}</span><b>${escapeHtml(formatDate(check.date))}</b><span>${check.metrics.verdict === "practice" ? "Keyboard practice" : `${Math.round(check.metrics.meanError)} px · ${Math.round(check.metrics.dwellReliability)}% dwell`}</span><small>${escapeHtml([check.setup.posture, check.setup.glasses, check.setup.lighting].filter(Boolean).join(" · ") || "No setup notes saved")}</small></button></li>`).join("")}</ol>` : `<div class="empty-state"><span aria-hidden="true">⌁</span><h2>No saved checks yet</h2><p>Complete a field check and leave “Keep this check” selected.</p></div>`}
    <button class="primary-button" id="history-home" type="button">Start a new check</button>
  </section>`, "history");
  document.querySelector("#history-home")?.addEventListener("click", () => renderSetup(true));
  document.querySelectorAll<HTMLButtonElement>("[data-id]").forEach((button) => button.addEventListener("click", () => {
    const check = checks.find((item) => item.id === button.dataset.id);
    if (check) { lastResult = check; readings = check.readings; renderResult(check); }
  }));
  document.querySelector("#clear-history")?.addEventListener("click", confirmClearHistory);
  announceAndFocus("Past checks");
}

function confirmClearHistory() {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `<form method="dialog"><h2>Clear all saved checks?</h2><p>This removes ${getChecks().length} local ${getChecks().length === 1 ? "check" : "checks"}. Export anything you need first.</p><div><button class="danger-button" value="confirm">Clear checks</button><button class="secondary-button" value="cancel" autofocus>Keep checks</button></div></form>`;
  document.body.append(dialog);
  dialog.addEventListener("close", () => {
    if (dialog.returnValue === "confirm") localStorage.removeItem(isDemo ? DEMO_STORAGE_KEY : STORAGE_KEY);
    dialog.remove();
    renderHistory();
  });
  dialog.showModal();
}

function exportReport(result: SavedCheck) {
  const notes = result.setup.saveNotes ? [result.setup.posture, result.setup.glasses, result.setup.lighting, result.setup.notes].filter(Boolean).map(escapeHtml).join(" · ") : "Not saved by user";
  const report = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Gaze check report ${escapeHtml(result.date)}</title><style>body{font:17px/1.55 system-ui;color:#17251e;max-width:760px;margin:48px auto;padding:0 24px}h1{font:700 38px Georgia,serif}table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:12px;border-bottom:1px solid #aaa}.note{background:#f3f0e5;padding:16px}small{color:#59685f}</style><main><p>Gaze Calibration Card · support report</p><h1>Pointer comparison</h1><p>${escapeHtml(formatDate(result.date))}</p><table><tr><th>Input</th><td>${escapeHtml(result.setup.mode)}</td></tr><tr><th>Average target error</th><td>${Math.round(result.metrics.meanError)} px</td></tr><tr><th>Dwell reliability</th><td>${Math.round(result.metrics.dwellReliability)}%</td></tr><tr><th>Directional pattern</th><td>${escapeHtml(describeDrift(result.metrics.horizontalDrift, result.metrics.verticalDrift))}</td></tr><tr><th>Pointer samples</th><td>${result.metrics.sampleCount}</td></tr><tr><th>Setup notes</th><td>${notes}</td></tr></table><p class="note"><b>Interpretation:</b> The app compares results with unvalidated pixel bands: ≤80 px mean error and ≥75% dwell, or a mixed band of ≤125 px and ≥55%. Results are device- and display-dependent. This is not a pass, medical diagnostic, or replacement for the device maker’s calibration.</p><small>Generated locally by Gaze Calibration Card. No camera frames or data were uploaded.</small></main></html>`;
  const url = URL.createObjectURL(new Blob([report], { type: "text/html" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `gaze-check-${result.date.slice(0, 10)}.html`;
  link.click();
  URL.revokeObjectURL(url);
  const status = document.querySelector("#export-status");
  if (status) status.textContent = "Report exported. Open it in any browser or attach it to a support message.";
}

window.addEventListener("hashchange", () => {
  if (location.hash === "#history") renderHistory();
  else if (location.hash === "#setup") renderSetup(true);
});

if (isDemo) resetDemo();
else renderSetup();
