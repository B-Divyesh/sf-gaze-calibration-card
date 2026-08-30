# Gaze Calibration Card — repair handoff

**Status: PASS — independently verified at candidate `6871ec701c36e3604390d581f6462ea14b567a8e`**

**Release: v0.1.1**

**Work order: gaze-calibration-card-repair-1**

## What changed

- Added `.factory/claims.json` with 13 claims and exactly one tagged browser test per claim.
- Added `/demo/`, **Load sample project**, a persistent demo banner, reset/leave actions, realistic sample readings, and a separate `demo:` storage namespace. See `.factory/demo.md`.
- Added three direct app screenshots to the landing walkthrough.
- Rebuilt the service worker to discover and precache generated JS, CSS, AVIF/WebP, icons, and every route during its first install.
- Restored focus to each new workflow heading and announced state changes. Keyboard targets still receive direct focus.
- Replaced unvalidated “Reliable,” “Use with care,” and “Recalibrate” outcomes with comparison-only language. The UI and export now state that pixel bands are unvalidated and device-dependent.
- Added Static Web Apps CSP, frame restrictions, permissions policy, immutable asset caching, service-worker no-cache rules, and a real 404 response.
- Added route descriptions/canonicals, Open Graph and Twitter metadata, a 1200×630 social image, Apple touch icon, build identity, Param Factory credit, and 44 px policy/footer links.
- Switched release discovery to the GitHub Releases API with one-hour local caching, a calm releases-page fallback, high-entropy Mac architecture detection, and explicit Apple-silicon/Intel choices when detection is unavailable.
- Bumped the desktop package to 0.1.1. Release builds embed `GITHUB_SHA` in the app footer.

## Outcome-threshold decision

No 20-check hardware study exists for the brief’s 90% agreement measure. The repair does not invent that evidence. Measurements and transparent bands remain useful for repeated personal comparisons, but the product no longer labels a setup reliable, ready, or failed. Cross-device validation remains future research.

## Verification evidence

Run from a clean npm install on 2026-08-30:

- `npm ci` — 64 packages installed; 0 vulnerabilities.
- `npm run lint` — TypeScript passed.
- `npm test` — 6/6 Vitest tests passed.
- `npm run build` — passed; output in `dist/app` and `dist/site`.
- `npm run test:claims` — 13/13 claim tests passed.
- `npm run test:e2e` — 38 passed, 2 intentional mobile pointer-path skips.
- `npm audit --audit-level=high` — 0 vulnerabilities.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml` — passed.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` — passed; no Rust unit/doc tests are defined.
- `verify-url.sh http://127.0.0.1:4173/ .factory/evidence/local` — HTTP 200, title, `lang=en`, one h1, main landmark, zero missing alts, zero unlabeled buttons, and zero console/page errors.
- Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 2,068 ms, TBT 125 ms, CLS 0, transfer 141,264 bytes.
- Production size: site JS 4.38 KB raw plus 21.43 KB demo-only JS; shared CSS 25.01 KB raw. App JS 22.09 KB raw; app CSS 15.92 KB raw.

The offline claim uses its own fresh browser context, waits for the first service-worker install, asserts hashed JS/CSS and AVIF are cached, sets the context offline, and reloads with no console errors. It passed three consecutive stress repetitions after the deterministic release-fixture wait was added.

## Run locally

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:claims
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

The static deploy root is `dist/site`. The Tauri frontend is `dist/app`.

## Release and deployment evidence

The repair release was built by `.github/workflows/release.yml` from tag `v0.1.1` at source commit `28a05ab3a26e11930f84d0690326ed9b82fcc847`.

- GitHub Actions run `33298524839` completed successfully for Linux, Windows, Intel Mac, Apple-silicon Mac, and the manifest job.
- The public release has 11 assets: AppImage, Debian and RPM packages, MSI and EXE installers, both DMGs and app archives, `SHA256SUMS`, and `latest.json`.
- `latest.json` reports version 0.1.1 and all five required platform keys.
- The 76,564,984-byte AppImage matched SHA256 `9aea533ab97af74efbc14b01616c5292f58b66423d0797e1246d3116fa848095`.
- The AppImage extracted successfully. Its `AppRun` stayed running for the 12-second Xvfb smoke window; only expected headless EGL warnings were printed.
- A fresh live browser resolved the Linux button to the v0.1.1 AppImage through the GitHub API.

The static site was deployed only to the existing Azure Static Web App `sf-gaze-calibration-card`. Live `verify-url.sh` evidence is under `.factory/evidence/live`: HTTP 200, zero console errors, correct title/lang/main/h1, zero missing alts, and zero unlabeled buttons. Live response checks also confirmed CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, the permissions policy, immutable hashed assets, and an HTTP 404 serving the designed page. A fresh live first-visit offline run cached hashed JS, CSS, and AVIF, then reloaded with zero console errors.

## Known gaps and next steps

- Pixel bands need a consented 20-check study across representative trackers and screen sizes before any reliability or readiness verdict can return.
- macOS and Windows packages are unsigned. Users receive plain warnings and install instructions.
- A browser without architecture client hints cannot distinguish Intel from Apple-silicon Mac safely, so the landing page presents both downloads.

## Needs operator action

Signing is optional for this unsigned release. Future signed builds require `APPLE_CERTIFICATE` for macOS notarization and `WINDOWS_CERT_PFX` for Windows Authenticode, plus their associated password/identity secrets in GitHub Actions.

## Independent verification 2 (2026-08-30 UTC)

**PASS.** Fresh verification against candidate `6871ec701c36e3604390d581f6462ea14b567a8e` and <https://gaze-calibration-card.sociobot.in> found no release-blocking product defects. All 13 required claim commands passed individually from the clean checkout; lint, unit tests, production build, full Playwright suite, Cargo check/test, and high-severity audit passed. The live first screen plainly explains the job, audience, and first action, and `/demo/` supplies an isolated one-click completed sample.

Live `index.html`, main JS, CSS, hero AVIF, and service worker SHA-256 values exactly matched the fresh candidate build. Fresh first-visit offline reload, outgoing-request/privacy checks, headers, 404, keyboard/focus, and desktop/390px axe scans were clean (zero serious/critical violations). A streamed release Debian package matched its published SHA-256. See `.factory/verification-2.md` for exact commands, outcomes, scope, and the non-blocking local AppImage/linuxdeploy container limitation.
