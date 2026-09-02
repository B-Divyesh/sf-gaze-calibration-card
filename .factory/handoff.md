# Gaze Calibration Card — repair handoff

## Status: ready to deploy

Repair implementation: `e1faf5e6e9b4` (`fix: preserve fresh gaze measurements and real results`).

This `0.1.5` repair resolves both release-blocking findings from independent verification 8 and the controller’s follow-up evidence review.

## What changed

1. **Fresh movement for every target.** The app records the pointer-event revision when a target appears. A timed sample or completion fallback is accepted only when a newer pointer movement occurred after that point and remains recent. The Start button coordinate therefore cannot become nine fabricated target readings.
2. **Honest real-result recovery.** A completed real check now persists its current, already privacy-filtered result in local storage and rehydrates it after reload. A real `/check/#result` route with no local result shows **No saved result found** with actions to start a check or view history. Only demo mode may render the bundled sample.
3. **Result/map consistency.** The result map renders from the result being displayed, not a mutable in-memory reading array. Selecting a historical result also makes that result the reloadable current result.
4. **Privacy clear.** Clearing real history also removes the persisted current result; demo code still never reads or writes real check keys.
5. **Release version.** Package, Cargo, Tauri, and lock-file versions are now `0.1.5` for a patched desktop release.

## Exact regressions

`tests/e2e/app.spec.ts` now covers all documented failure paths:

- **a stopped gaze pointer is not reused as nine fresh target samples**: reproduces clicking Start and moving no further; asserts nine empty readings, zero samples, and the recovery copy.
- **a completed real result rehydrates after a cold reload**: completes a real keyboard check, reloads `/check/#result`, and asserts its non-demo result and persisted id remain intact.
- **a real result route without local data shows recovery instead of demo metrics**: opens `/check/#result` in a fresh context and asserts the no-result screen, no demo banner, no sample verdict, and no map points.

## Verification evidence

Run after a clean `npm ci` with Playwright `1.58.2` and its preinstalled Chromium:

| Check | Result |
| --- | --- |
| Documented stale-pointer reproduction before repair | FAILED as expected: 9 samples, 1 distinct Start coordinate |
| Documented cold `/check/#result` reproduction before repair | FAILED as expected: bundled 42 px sample without demo banner |
| `npm run lint` | PASS |
| `npm test` | PASS — 8/8 Vitest tests |
| Focused desktop regression file | PASS — 8/8 |
| `npm run test:e2e` | PASS — 70 tests, 7 intentional profile skips, 0 failures |
| Desktop + 390px mobile, keyboard, forced colors, reduced motion, axe | PASS through the Playwright suite |
| Demo isolation, privacy requests, offline reload, service-worker update, headers, and 404 | PASS through declared claim/browser coverage |
| `npm run build` | PASS — `dist/app` and `dist/site` produced |
| Initial JS budgets | PASS — app 8.82 KB gzip; landing 1.63 KB gzip; check/demo app bundle 8.52 KB gzip; site CSS 6.45 KB gzip |
| `npm run test:lighthouse` | PASS — mobile performance/accessibility 99/100, 100/100, 100/100; median performance 100; LCP 1.51–1.63 s; CLS 0.00016 |
| `npm run test:unsigned-builds` | PASS — `v0.1.4` EXE, MSI, Intel Mac, and Apple-silicon Mac assets matched `SHA256SUMS` and were correctly unsigned/ad-hoc as disclosed |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | Environment blocked before compilation by missing `glib-2.0.pc`; no source failure observed |

## Deployment and release

The static production deployment and the `v0.1.5` GitHub Actions desktop release are the remaining actions. Deploy `dist/site` to the scoped Static Web App `sf-gaze-calibration-card` in resource group `sociobot`, then verify the live build identity and response policy. Tag `v0.1.5` after the final repair commit so the release workflow builds the macOS, Windows, and Linux package matrix, `SHA256SUMS`, and `latest.json`.

## Known gap / operator action

This worker image lacks the Linux Tauri development dependency `glib-2.0` (`glib-2.0.pc`). GitHub’s release workflow installs the needed Linux dependencies and is the authoritative package build for the desktop matrix. No signing certificate is configured: Windows installers and macOS bundles remain unsigned as disclosed in the product and README.
