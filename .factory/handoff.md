# Gaze Calibration Card — polish 1 handoff

**Work order:** `gaze-calibration-card-polish-1`
**Base:** `c780b097d535be561ec4bba82aa339c8d14a5788`
**Repair commit:** `45c574b242433aa0f6a7bb6bc433858f876fec86`
**Verdict:** repaired and deployed.

## What changed

- Replaced unvalidated reliability/readiness wording with local pointer-comparison language.
- Made `?demo=1` redirect into the isolated sample. Demo has a persistent banner, reset, and Start a new check; demo storage remains separate.
- Made app screens addressable states with history navigation, reload handling, title updates, focus restoration, and live announcements.
- Completed claim coverage for demo offline reload, reduced motion, standalone export, pointer sampling, history clearing, bounded timing, and shell-installer checksum mismatch.
- Unified policy/404 metadata, navigation, footer policy links, build identity, social cards, external-link labels, and 44px targets.
- Reworked phone ordering so the three plain facts finish in the 390×844 first screen while preserving the field-guide visual identity.

## Verification

- `npm run lint` — PASS.
- `npm test` — PASS (6 tests).
- `npm run build` — PASS; produces `dist/app` and `dist/site`. Initial JS gzip: app 8.46 KB; site main 1.61 KB; demo 8.19 KB.
- Every manifest claim command was run with `npm run test:claims -- --grep @claim:<id>`: 14/14 PASS. The 30-second check met its 24–30s interval.
- `npx playwright test tests/e2e/app.spec.ts --project=desktop` — 4/4 PASS.
- `npx playwright test tests/e2e/app.spec.ts --project=mobile` — 3 PASS, 1 expected pointer-path skip.
- `npx playwright test tests/e2e/site.spec.ts --project=desktop` — 4 PASS, 2 viewport-specific expected skips.
- `npx playwright test tests/e2e/site.spec.ts --project=mobile` — 6/6 PASS, including all visible targets ≥44px and facts within 844px.
- Axe runs in the landing/app browser tests for light, dark, forced-colors, and reduced-motion flows; zero serious or critical violations.
- Lighthouse (live landing, headless Chromium): Performance 100; Accessibility 100.
- `verify-url.sh` was not present in this worker image. Equivalent browser checks cover title, lang, one h1, main, alt text, console errors, and focus.

Evidence screenshots: `.factory/evidence/polish-1/landing-390.png`, `.factory/evidence/polish-1/demo-desktop.png`, and the cold live check `.factory/evidence/polish-1/live-demo-390.png`.

## Live check

Deployed with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`. Cold checks passed at `https://gaze-calibration-card.sociobot.in/`, `/demo/`, `/privacy/`, `/terms/`, and `/does-not-exist` (HTTP 404). The live `?demo=1` URL redirected to `/demo/#result`, showed the persistent banner and sample h1, and logged no browser console errors. Live headers include CSP with `frame-ancestors 'none'`, `nosniff`, strict referrer policy, and camera-denying permissions policy.

## Known gaps

None in the product repair. The PowerShell checksum branch is source-asserted because this Linux worker has no PowerShell runtime; the POSIX mismatch path is executed.

## Deploy

Deploy `dist/site` with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`, then cold-open the landing, demo, policy pages, and a missing route.

---

# Independent verification 3 — FAIL

**Candidate:** `14265aa43069c44a11b08a37f69fc7cbd2e6d149`
**Live URL:** <https://gaze-calibration-card.sociobot.in>
**Verified:** 2026-09-01 UTC

The live site hash-matches the candidate’s landing, app assets, demo asset, CSS, and service worker. First-read, one-click sample demo, core local flows, privacy request log, headers, cache rules, desktop/mobile axe scans, and production build checks passed.

**Release verdict: FAIL.** `npm run test:e2e -- --reporter=line` ran 48 tests and failed declared claim `@claim:offline-reload` with `Failed to load resource: net::ERR_FAILED` at `tests/e2e/claims.spec.ts:69`. The claims contract makes this release-blocking, even though the same claim passed when run alone and the equivalent live service-worker check passed. Repair the test/product behavior so the complete suite is reliable, then rerun verification.

Verification details and exact evidence are in `.factory/verification-3.md`. Rust checks could not run in this isolated worker because the required Tauri crate was not locally cached and external dependency retrieval was outside the permitted scope.

---

# Repair 2 — offline-reload suite stabilization

**Work order:** `gaze-calibration-card-repair-2`
**Base / verifier report:** `d9909a93f029e5fd6be0cf409c7301a307e2b486` / `.factory/verification-3.md`

## What changed

- Fixed the real offline cache mismatch: the static host/preview can emit `Vary: Origin`, while the service worker precaches same-origin assets without that header. Cache reads now use `ignoreVary: true` for same-origin shell assets and navigation fallback, so the cached CSS and JavaScript are served after offline reload instead of falling through to `net::ERR_FAILED`.
- Reworked `@claim:offline-reload` so it owns and always closes a new browser context. Before either offline transition it waits for an active, controlling service worker and verifies every current page script, module preload, and stylesheet has a cache match. It records console errors for the whole offline flow and asserts none occurred.
- Serialized Playwright projects (`workers: 1`). The parallel runner reproducibly hit a Chromium SIGSEGV while launching/tearing down adjacent desktop/mobile profiles; serial browser lifecycles keep the full test suite deterministic. The claim still runs in its own context, not the shared test context.
- Kept the release-metadata claim independent of the service-worker claim by using temporary `serviceWorkers: "block"` contexts; it tests only the recorded GitHub metadata behavior.

## Verification

- `npm ci` — PASS (clean install; 65 packages audited, 0 vulnerabilities).
- `npm test` — PASS (6/6 Vitest tests).
- `npm run lint` — PASS (`tsc --noEmit`).
- `npm run build` — PASS; produces `dist/app` and `dist/site`. Site JS gzip: main 1.61 KB, demo 8.19 KB; site CSS gzip: 6.24 KB. App JS gzip: 8.45 KB.
- `npm run test:claims -- --grep @claim:offline-reload --reporter=line` — PASS (1/1); explicit service-worker readiness, landing and demo offline reload, reset action, and zero error-console messages.
- `npm run test:e2e -- --reporter=line` — PASS (48/48), serialized desktop and 390px mobile projects. This includes all declared claim flows, keyboard completion, reduced motion/forced colors, standalone report export, request privacy checks, navigation, touch-target checks, and Axe serious/critical scans.
- `cargo check --locked --offline --manifest-path src-tauri/Cargo.toml` — cannot run in this disposable worker because the locked `tauri` crate is absent from the local Cargo cache. No network dependency retrieval was attempted.

## Known gaps / operator action

The Tauri Rust check remains unavailable only in this worker’s offline cache. Run `cargo check --locked --manifest-path src-tauri/Cargo.toml` in the release runner (where dependencies are available) before desktop release. No product behavior, privacy, accessibility, or browser-test gaps remain.

## Deploy

Deploy the rebuilt static artifact with:

`/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`

Then cold-open `/`, `/demo/`, `/privacy/`, `/terms/`, and a missing route. In a fresh browser context, load `/` and `/demo/` once, wait for the service worker, set the browser offline, reload both routes, and verify no console errors.
