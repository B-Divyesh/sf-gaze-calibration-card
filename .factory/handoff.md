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

## Deployment evidence

- Repair code commit: `93872e048700dd8591b5de27d51f4943e3be5e49`.
- Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`; Static Web Apps deployment `ecf5c15b-3f31-4851-84f5-199271123df0` succeeded and the product custom domain reported Ready.
- Live route smoke check: `/`, `/demo/`, `/privacy/`, `/terms/`, and `/sw.js` returned 200; `/does-not-exist` returned the designed HTTP 404.
- Live `/sw.js` SHA-256 matched the built artifact: `56d5b3224750167dcaa88b2a54490af8b83d703870c8f0cb9834830d813386c0`.
- Live `/` returned the expected CSP (`frame-ancestors 'none'`), nosniff, strict referrer policy, frame denial, and camera/microphone/geolocation/payment/USB-denying permissions policy.
- A fresh live Playwright context loaded landing and demo, waited for a controlling service worker, went offline, and reloaded both routes successfully with zero browser console errors.

---

# Independent verification 4 — FAIL

**Work order:** `gaze-calibration-card-verify-4`

**Candidate:** `b4c64c1a435f345bc0a4fe1a1afc729176fcf8a2`

**Live URL:** <https://gaze-calibration-card.sociobot.in>

**Verified:** 2026-09-01 UTC
**Verdict:** **FAIL**

Confirm that the cold first screen and one-click isolated sample pass. Check that the live static site hash-matches the candidate, the local unit/type/build/browser/Rust checks otherwise pass, privacy and offline behavior pass, and live Axe scans report no serious or critical findings.

Release-blocking evidence:

- Confirm that the exact required `@claim:history-limit` command failed once because its immediate post-confirmation read still saw the 50-record history. The complete suite and five diagnostic repeats later passed, confirming timing-dependent claim-check behavior; the contract still rejects any failed required claim command.
- Check that GitHub Release `v0.1.1` targets commit `28a05ab`, while the candidate contains later desktop-app changes. The downloaded AppImage visibly opens the old **“Is your gaze setup steady enough right now?”** screen, not the candidate’s **“Compare your gaze pointer right now”** screen.
- Confirm that 200% text sizing creates horizontal scrolling: 421px document width at 390px on `/`, and 413px at 390px on `/demo/`.
- Check that three mobile Lighthouse runs score 87, 88, and 91 for Performance; median 88 is below the required 90.
- Confirm that candidate GitHub CI is red at its browser-suite step. Check that a local Tauri production build compiles the optimized binary but the current `linuxdeploy` GTK plugin returns status 127 while assembling a new AppImage.

Full command results, live request/header evidence, release hashes, route checks, workflow exercises, and remediation steps are in `.factory/verification-4.md`.

---

# Repair 3 — deterministic history, reflow, and exact desktop release

**Work order:** `gaze-calibration-card-repair-3`  
**Verifier report repaired:** `.factory/verification-4.md`  
**Repair source / release tag:** `d1a048e1541263a6aa52659f31becd8e09aa3016` / `v0.1.2`  
**Status:** repaired, CI green, released, and deployed.

## What changed

- Made history clearing synchronous with the user’s **Clear checks** click. The old `method=dialog` close handler removed storage later, so an immediate post-confirmation read could still observe 50 checks. The handler now removes the exact active storage key before closing and rerendering.
- Added the regression assertion that reads local storage immediately after the confirming click. The exact required command now passes independently and inside the complete suite.
- Fixed 200% text zoom reflow. Landing and app grid tracks can shrink, long result-preview text wraps at word boundaries, and mobile header/footer children no longer impose a min-content overflow. Browser coverage asserts 390px document width at a 200% root text size for `/`, `/demo/`, and the desktop app UI.
- Deferred nonessential release discovery until after `load`, preserving the initial phone paint. Added a reproducible three-run mobile Lighthouse gate to CI; it fails below a 90 median performance score or 95 accessibility score.
- Bumped the desktop product to 0.1.2 and published `v0.1.2` from the exact repair source. The landing’s live GitHub metadata selection now resolves to that release.
- Repaired Linux AppImage packaging on Ubuntu 24.04: the workflow pins the Tauri action, installs the GTK/FUSE prerequisites, supplies the Ubuntu `libgtk-3-0t64` compatibility path expected by the pinned linuxdeploy GTK plugin, and uses `APPIMAGE_EXTRACT_AND_RUN=1` so the helper does not depend on a FUSE device. A unit regression locks those workflow requirements.

## Verification

- `npm ci` — PASS; 169 packages, `npm audit --audit-level=high` reports 0 vulnerabilities.
- `npm test` — PASS, 7/7.
- `npm run lint` — PASS.
- `npm run build` — PASS; `dist/app` and `dist/site` produced. Current gzip sizes: landing JS 1.63 KB, demo JS 8.21 KB, site CSS 6.45 KB, app JS 8.47 KB, app CSS 4.55 KB.
- Exact required claims — PASS: `npm run test:claims -- --grep @claim:history-limit --reporter=line` and `npm run test:claims -- --grep @claim:offline-reload --reporter=line` both pass 1/1.
- `npm run test:e2e -- --reporter=line` — PASS, 52 tests across desktop and 390px mobile (including keyboard, reduced-motion, forced-colors, privacy requests, offline reload, Axe, immediate history clear, and 200% reflow coverage).
- `npm run test:lighthouse` — PASS. Three mobile runs: Performance/Accessibility `100/100`, `100/100`, `100/100`; median performance 100.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`, `cargo check --locked --manifest-path src-tauri/Cargo.toml`, and `cargo test --locked --manifest-path src-tauri/Cargo.toml` — PASS.
- `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` — PASS locally. It produced `Gaze Calibration Card_0.1.2_amd64.AppImage` (41,285,982 bytes; local SHA-256 `d5efddb1fca7737bd2510e6beb28edd0afb03286a971409d2486b5a094fcb06f`).
- GitHub **Quality gates** run `33562321722` — PASS. GitHub **Release desktop apps** run `33562323435` — PASS on Ubuntu 24.04, Windows, macOS arm64, and macOS Intel; its manifest job also passed.

## Release and deployment evidence

- GitHub Release [`v0.1.2`](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.2) targets exact commit `d1a048e1541263a6aa52659f31becd8e09aa3016` and contains AppImage, DEB, RPM, Windows EXE/MSI, both macOS DMGs/app archives, `SHA256SUMS`, and a valid `latest.json`.
- The released AppImage checksum was streamed and verified: `bca59bf587a305a4648b1eac14e755f6708f71221fc0c228441225147e7705be` matched both `SHA256SUMS` and `latest.json`.
- Deployed with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`. Live footer identity is `Build d1a048e15412`; a fresh live landing resolves its Linux button to the v0.1.2 AppImage URL.
- Live `/`, `/demo/`, `/privacy/`, and `/terms/` passed desktop and 390px Axe scans with zero serious/critical issues, exactly one h1/main, no console errors, and no normal-size overflow. At 200% root text, live `/` and `/demo/` both remain 390px wide.
- A fresh live context installed the service worker, reloaded `/demo/` offline successfully with zero console errors. `verify-url.sh` passed the live landing (982 ms observed load; title/lang/h1/main/alts present). Live response headers include CSP frame denial, HSTS, `nosniff`, strict referrer policy, X-Frame-Options, and camera/microphone/geolocation/payment/USB denial; the missing-route response is HTTP 404.

## Known gaps / operator action

No product release blockers remain. Desktop packages are intentionally unsigned. To sign future macOS and Windows packages, an operator must provide `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; unsigned install guidance is already shown on the release and landing page.
