# Independent verification 7 — PASS

**Candidate:** `c3a134886428c47e8025182c1f5e46d90e33d7fc` (`docs: record polish two evidence`)  
**Live URL:** <https://gaze-calibration-card.sociobot.in/>  
**Verified:** 2026-09-02 UTC from a detached candidate checkout after `npm ci`.

## Release decision

**PASS.** The live landing page and generated bundle match the requested candidate: the live footer says `Build c3a134886428`, and both fresh local production output and live `/assets/main-Cnk3hwaf.js` have SHA-256 `636171e536d6d328c6c0656b4c283cbe6e0a3e930599a654581abd8d2b45019d`.

## First-read and demo

Cold loading the live page plainly answered the required questions in its first screen:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** people relying on eye input after posture, glasses, light, or fatigue changes.
- **First action:** **Try it with sample data**; adjacent text says it opens a completed check and saves nothing.

The one-click action opened `/demo/#result`, with the persistent **Demo — sample data, nothing is saved** banner and a completed nine-target check.

## Declared claims

`.factory/claims.json` exists and `npm run test:claims` ran all 17 declared `@claim:` tests against the local demo entry point: **17 passed (1.3m)**.

| Claims | Result | Observable coverage |
| --- | --- | --- |
| `sample-demo`, `offline-reload`, `local-private`, `nine-targets`, `pointer-measures`, `pointer-sampling` | PASS | Isolated sample/reset, offline shell reload, same-origin demo flow/no camera call, nine readings, populated measurements, and local samples. |
| `keyboard-high-contrast`, `report-export`, `notes-opt-in`, `history-limit`, `thirty-second-check` | PASS | Keyboard/forced-colors/reduced-motion completion, standalone HTML export, consent-gated notes, 50-record cap/clear, and asserted 24–30 second automatic check. |
| `release-download`, `installer-checksum`, `unsigned-builds`, `free-open-source` | PASS | Recorded GitHub metadata/platform selection/cache behavior, checksum-mismatch stop, unsigned-package guidance, MIT/source/no-payment copy. |
| `comparison-bands-limit`, `not-a-diagnosis` | PASS | Exact device-dependent and non-diagnostic limitations in both completed demo and exported report. |

The separate `npm run test:unsigned-builds` also passed. The Linux worker has no `pwsh`; the repository’s Windows CI contains the PowerShell corrupt-download test.

## Local quality gates and product exercise

| Check | Result |
| --- | --- |
| `npm test` | PASS — 7/7 Vitest tests. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — creates `dist/app` and `dist/site`. |
| `npm run test:e2e` | PASS — 52 passed, 6 expected platform skips, 2.8 minutes. |
| `npm run test:lighthouse` | PASS — mobile 99 performance / 100 accessibility on each of three runs. |
| Production budget | PASS — landing JS 1.63 KB gzip, demo JS 8.18 KB gzip, CSS 6.45 KB gzip. |

I separately completed all nine targets using keyboard controls only and verified Escape recovery to “No result was saved”; no page errors occurred. The E2E/claim paths also cover normal pointer sampling, notes consent, history boundary/clear recovery, automatic timing, keyboard, offline, and export paths.

`cargo test --locked --manifest-path src-tauri/Cargo.toml` could not compile in this container because host `glib-2.0 >= 2.70` development files are absent (`pkg-config` exit 1). This is the documented Linux Tauri host prerequisite, not a test failure after compilation; the published release packages were independently checked below.

## Live QA, privacy, and deployment

- Desktop (1440×900) and mobile (390×844) landing and demo both returned 200 with one `h1`, a `main` landmark, zero console/page errors, and zero Axe serious/critical findings. The first Tab exposed a visible `rgb(168, 95, 0) solid 3px` focus outline.
- Cold landing requested only the product origin plus the permitted `https://api.github.com` release-metadata endpoint. Demo requested only the product origin. No camera request, telemetry, pointer upload, or unlisted third-party request was observed.
- HTML uses `Cache-Control: no-cache`; hashed assets use `public, max-age=31536000, immutable`. Headers include CSP with `frame-ancestors 'none'`, `connect-src 'self' https://api.github.com`, restrictive `Permissions-Policy` including `camera=()`, `X-Content-Type-Options: nosniff`, and strict referrer policy.
- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; the designed unknown-route response returns 404. All internal and GitHub/release links crawled successfully.
- This static application has no product server endpoint or product-unlock API, so a 429 allowance test is not applicable. It has no sign-in flow.

## Desktop release artifact

GitHub latest release is `v0.1.3`, containing Linux RPM/DEB/AppImage, Windows MSI/EXE, macOS Apple-silicon/Intel DMG/app archives, `SHA256SUMS`, and `latest.json`. Fresh download of `Gaze.Calibration.Card_0.1.3_amd64.deb` was SHA-256 `459e61eb770ac5956840fcd10e3dd10f0bf614195a1e44f16b7cd7d71de75af5`, exactly matching `SHA256SUMS`; `dpkg-deb` identifies package `gaze-calibration-card`, version `0.1.3`, architecture `amd64`.

## Defects by severity

No release-blocking, high, medium, or low product defects found. The missing local GLib development dependency is an environment limitation noted above, not a shipped-product defect.
