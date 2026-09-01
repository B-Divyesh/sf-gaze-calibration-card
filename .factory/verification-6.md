# Independent verification 6 — FAIL

**Candidate:** `82d9cdb940f6e6502c91d9d84874e68f2f5775c6` (`fix: label install copy control`)  
**Live URL:** <https://gaze-calibration-card.sociobot.in/>  
**Verified:** 2026-09-01 UTC, from a clean dependency install and detached candidate checkout.

## Release decision

**FAIL — release-blocking deployment identity mismatch.** The live site is healthy and its product source is functionally equivalent to this candidate, but it identifies itself as build `c3a134886428`, not the required candidate `82d9cdb940f6`. It serves a different generated JS asset (`/assets/main-Cnk3hwaf.js`; live) than a candidate build (`/assets/main-Blh0ZjZS.js`; local). The candidate and the deployed commit differ only in `.factory` evidence/handoff files, but the acceptance contract requires confirming that the live deployment matches the candidate. That cannot be confirmed.

## First-read test

Cold loading the live page answers all required questions in its first screen:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** “For people who rely on eye input,” especially after posture, glasses, light, or fatigue changes.
- **First click:** **Try it with sample data**; its adjacent explanation says it opens a completed check and saves nothing.

The first-read/demo gate passes. The click led to `/demo/#result`, a completed nine-target example with the persistent “Demo — sample data, nothing is saved” banner.

## Claims — all declared commands passed

Each command in `.factory/claims.json` was run individually against the clean local demo entry point. All passed.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `sample-demo` | PASS | Isolated completed sample, reset, and leaving demo preserve real marker. |
| `offline-reload` | PASS | Landing and demo reload after service-worker caching while offline. |
| `local-private` | PASS | Demo/export made same-origin requests only; no camera request or sign-in UI. |
| `nine-targets` | PASS | Completed map has nine readings. |
| `pointer-measures` | PASS | Error, dwell, and directional pattern are populated. |
| `pointer-sampling` | PASS | Nine pointer readings each retain local samples. |
| `keyboard-high-contrast` | PASS | Keyboard completion, forced colors/reduced motion, and axe check pass. |
| `report-export` | PASS | Downloaded standalone HTML report contains no remote/script resources. |
| `notes-opt-in` | PASS | Notes are absent before approval and retained after approval. |
| `history-limit` | PASS | 51st check remains capped at 50; confirmation clears history. |
| `release-download` | PASS | Fixture verifies platform asset selection, only GitHub external origin, and one-hour cache expiry/refetch. |
| `installer-checksum` | PASS | Shell installer stops before use on a checksum mismatch. |
| `comparison-bands-limit` | PASS | Exact device-dependent/unvalidated limitation appears in app and export. |
| `not-a-diagnosis` | PASS | Exact non-diagnostic/non-calibration limitation appears in app and export. |
| `unsigned-builds` | PASS | Landing copy plus release signing-state workflow assertion pass. |
| `free-open-source` | PASS | MIT source link/free copy and no purchase action. |
| `thirty-second-check` | PASS | Mouse/touch automatic path completed within the asserted 24–30 second range. |

The associated `npm run test:unsigned-builds` command also passed. The separately requested PowerShell checksum test is configured for Windows CI; this Linux worker has no `pwsh`.

## Clean local QA

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 169 packages audited, no vulnerabilities. |
| `npm test` | PASS — 7/7 Vitest tests. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — writes `dist/app` and `dist/site`. |
| `npm run test:e2e` | PASS — 52 passed, 6 expected platform skips, 2.4 minutes. |
| `npm run test:lighthouse` | PASS — mobile 99 performance / 100 accessibility / 100 best practices (median performance 99). |
| Bundle budget | PASS — landing JS 1.63 KB gzip, demo JS 8.17 KB gzip, CSS 6.45 KB gzip. |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | BLOCKED by this worker image: `pkg-config` cannot find `glib-2.0 >= 2.70`. This is the documented Tauri/Linux system prerequisite, not a source/test assertion failure. |

## Live product QA

Fresh Playwright checks were run against the production URL at desktop (1440×900) and mobile (390×844):

- Landing and demo returned 200; unknown route returned the designed 404 with HTTP 404.
- Desktop and mobile completed the sample end to end. Each showed the demo banner and nine map points.
- No browser console errors or page errors occurred.
- Axe found zero serious/critical violations on landing and demo in both viewports.
- Keyboard tabbing exposed a solid visible focus outline on interactive controls; the automated keyboard-only completion claim also passed.
- Request logging during landing plus demo reached only `https://gaze-calibration-card.sociobot.in` and the permitted `https://api.github.com` release-metadata origin. No camera request, pointer upload, telemetry, or other third-party request was observed.
- Landing headers include CSP with `frame-ancestors 'none'`, `connect-src 'self' https://api.github.com`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`, `X-Content-Type-Options: nosniff`, and strict referrer policy. Hashed assets returned `Cache-Control: public, max-age=31536000, immutable`; HTML returned `no-cache`.
- This is static-only product hosting. It exposes no product server-side API/product-unlock endpoint, so a 429 allowance test is not applicable. It has no sign-in flow.

## Release artifact spot check

The GitHub latest release is `v0.1.3` and includes macOS, Windows, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. Downloaded `Gaze.Calibration.Card_0.1.3_amd64.deb` SHA-256 was `459e61eb770ac5956840fcd10e3dd10f0bf614195a1e44f16b7cd7d71de75af5`, exactly matching `SHA256SUMS`. `dpkg-deb` reports package `gaze-calibration-card`, version `0.1.3`, architecture `amd64`.

## Defects by severity

### Blocker — live deployment is not the specified candidate

**Evidence:** Candidate build embeds `Build 82d9cdb940f6` and produces `main-Blh0ZjZS.js`. The live bundle embeds `Build c3a134886428` and serves `main-Cnk3hwaf.js`; live HTML and route HTML hashes consequently differ. `c3a1348` is later than the candidate and changes only `.factory` evidence and handoff files, so no user-facing behavioral regression was found, but it is still a distinct deployed artifact.

**Required resolution:** Deploy `dist/site` built from exactly `82d9cdb940f6e6502c91d9d84874e68f2f5775c6`, then cold-recheck that the live footer/build bundle identifies `82d9cdb940f6` and hash-matches its fresh build. No product-code repair is indicated.

### High / medium / low

No additional defects found in the tested product behavior, accessibility, privacy, performance, release metadata, or desktop artifact spot check.
