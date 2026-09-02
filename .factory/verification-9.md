# Independent verification 9 — Gaze Calibration Card

**Verdict: PASS**

- Candidate: `2f099d02d1f1c2877b9b39ce5629c055de948b1f`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Verified: 2026-09-02 UTC
- Work order: `gaze-calibration-card-verify-9`

The candidate meets the researched brief and factory contract. It provides a usable local nine-target pointer check, reports target error, dwell, and directional pattern, keeps setup notes only with approval, retains local history, and exports a standalone support report. It is honest about its device-dependent, non-diagnostic comparison bands and does not claim the unvalidated 90% agreement outcome.

The two high-severity defects from verification 8 are fixed in the deployed candidate. A motionless gaze pointer now produces nine empty readings and zero samples rather than fabricated Start-button coordinates. A cold real-result deep link without local data now shows an honest recovery state rather than bundled demo metrics.

## First-read and demo gate — PASS

A cold 1440×900 live visit answers the required questions in the first screen:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** “For people who rely on eye input,” after posture, glasses, light, or fatigue changes.
- **First click:** **Try it with sample data**, with “Opens a completed check; nothing is saved.”

The action opens `/demo/#result` in one click. The completed sample immediately shows nine readings, 42 px average error, 91% dwell, and its directional pattern. The persistent banner says **Demo — sample data, nothing is saved** and provides **Reset demo** and **Start a new check**. Reset preserved a seeded real-history marker; leaving demo removed the demo namespace and stayed in real mode after reload.

## Required claims gate — 18/18 PASS

`.factory/claims.json` was present at the initial candidate commit. After clean `npm ci`, every literal `test` command was executed separately in manifest order; all exited 0.

| Claim | Result | Independent evidence |
| --- | --- | --- |
| `sample-demo` | PASS | Completed sample, persistent banner, isolated reset, and real-data preservation passed. |
| `offline-reload` | PASS | Fresh landing and demo contexts reloaded and operated offline after one visit. |
| `local-private` | PASS | Demo reset/export requested no camera and sent only same-origin requests. |
| `no-account` | PASS | Demo, real keyboard save, and export used no credentials, auth request, or cookie. |
| `nine-targets` | PASS | Completed sample displayed nine distinct readings. |
| `pointer-measures` | PASS | Error, dwell, and directional pattern were populated. |
| `pointer-sampling` | PASS | Driven local coordinates produced samples for all nine targets. |
| `keyboard-high-contrast` | PASS | Keyboard completion, forced colors, reduced motion, and axe assertions passed. |
| `report-export` | PASS | Exported HTML was standalone and contained the expected report. |
| `notes-opt-in` | PASS | Notes were omitted without approval and stored after approval. |
| `history-limit` | PASS | The 51st check retained 50; confirmed clearing removed history. |
| `release-download` | PASS | Platform selection, GitHub-only metadata, and one-hour caching passed. |
| `installer-checksum` | PASS | A controlled digest mismatch stopped the shell installer before use. |
| `comparison-bands-limit` | PASS | The device-dependent, unvalidated limitation appeared in the result and export. |
| `not-a-diagnosis` | PASS | App and export retained non-diagnostic, non-calibration, non-pass/fail wording. |
| `unsigned-builds` | PASS | Published EXE, MSI, Intel Mac, and Apple-silicon app archives matched digests and disclosed signing states. |
| `free-open-source` | PASS | MIT source/free wording appeared with no payment action. |
| `thirty-second-check` | PASS | Automatic completion took about 27 seconds, within the asserted 24–30 second range. |

The live landing page and README were cross-checked against the manifest. No unlisted material claim was found.

## Clean checkout and build evidence

| Check | Result |
| --- | --- |
| Initial state | PASS — clean `main`, HEAD and `origin/main` at the candidate SHA. |
| `npm ci` | PASS — 168 packages installed, 169 audited, 0 vulnerabilities. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm test` | PASS — 8/8 Vitest tests. |
| `npm run build` | PASS — exact app and site production builds created `dist/app` and `dist/site`. |
| `npm run test:e2e` | PASS — 62 passed, 8 intentional project-profile skips, 0 failed. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run test:lighthouse` | PASS — three mobile runs scored 99 Performance and 100 Accessibility. |
| `npm run test:unsigned-builds` | PASS — four asserted Windows/macOS artifacts matched hashes and disclosed signing state. |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the release workflow's documented GTK/WebKit prerequisites. |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — library, binary, and doc harnesses; no Rust unit tests are defined. |

Production budgets pass:

- Landing JS: 3.81 KB raw / 1.63 KB gzip, plus a 0.71 KB module-preload helper.
- Check/demo JS: 24.65 KB raw / 8.52 KB gzip.
- Desktop UI JS: 25.36 KB raw / 8.82 KB gzip.
- Site CSS: 26.75 KB raw / 6.45 KB gzip; desktop UI CSS: 16.45 KB raw / 4.55 KB gzip.
- Hero AVIF: 28,391 bytes. No downloaded font exists.
- Lighthouse LCP: 1.69–1.74 s; CLS: 0.00016; TBT: 0–69 ms.

## End-to-end product exercise

- A true keyboard-only live run used Tab, radio-group arrows, Enter, and Space. Every target received focus, completion moved focus to **Keyboard path complete**, and the saved result was correctly marked as practice rather than a gaze score.
- The live focus treatment computed to a 3 px solid high-contrast outline.
- A live mouse/pointer run produced nine readings and nine local samples, then exported `gaze-check-2026-09-02.html`. The report contained no script, image, remote link, or remote URL.
- Escape during target 1 produced **No result was saved** and did not create a result.
- Malformed local-history JSON recovered to the usable setup screen without a console or page error. The malformed value remains until the next write, but it does not block use.
- A fresh `/check/#result` visit showed **No saved result found**, no demo banner, no sample verdict, and no map points.
- The previous stopped-pointer reproduction was rerun live: after 27,012 ms with no post-Start pointer movement, storage contained nine empty readings and `sampleCount: 0`; the UI displayed the correct pointer-movement recovery message.
- The automated suites additionally cover note consent, 50-record trimming/clear, boundary scoring, back/forward focus restoration, demo reset/exit isolation, and standalone export content.

## Accessibility, responsive behavior, and presentation

- Live axe scans found zero serious/critical findings on `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at desktop width.
- Separate live scans at 390×844 found zero serious/critical findings on the five user routes, zero console/page errors, and a minimum visible link/button/summary height of 44 px.
- At 390 px with the root font at 200%, the landing, check, demo, privacy, and terms pages had `scrollWidth === clientWidth` (390 px).
- The first-screen facts end at y=780 in an 844 px mobile viewport; the primary sample action measures 358×64 px.
- Forced-colors and dark-theme axe checks pass in the candidate suite. With reduced motion, the live target computed `animation-name: none` and `transition-duration: 0s`.
- Every audited route has `lang=en`, one h1, one main landmark, route-specific title/metadata, complete image alternatives, and a real heading outline.
- The botanical field-guide design, palette, typography, spacing, motion policy, original-asset provenance, and responsive intent are documented in `.factory/design.md` and visible in the product.

## Privacy, network, PWA, and deployment

- A normal landing load requested only same-origin assets plus the documented GitHub Releases metadata endpoint. Complete demo, keyboard, and pointer flows made same-origin requests only.
- A `getUserMedia` trap confirmed the demo never requested camera access. No analytics, telemetry, authentication, advertising, or pointer-upload request was observed.
- Root headers include HSTS, `nosniff`, strict referrer policy, `X-Frame-Options: DENY`, a permissions policy denying camera/microphone/geolocation/payment/USB, and CSP with `frame-ancestors 'none'`. CSP permits only self and the documented GitHub API connection.
- HTML uses `Cache-Control: no-cache`; hashed JS/CSS/image assets use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`.
- `registration.update()` completed with an activated controller and no waiting worker or console error. The `gaze-card-site-v2` cache contained all routes and hashed shell assets. Landing and demo both reloaded offline; demo reset continued to work offline.
- A missing live route returns the designed 404 document with HTTP 404. Every discovered internal and external page/download link resolved successfully.

## Candidate, deployment, and desktop release identity

- The live footer reports `Build 2f099d02d1f1`.
- Fresh candidate and live SHA-256 hashes matched byte-for-byte for six HTML pages, both application JS bundles, the landing JS, module helper, CSS, service worker, and hero AVIF.
- GitHub Release `v0.1.5` contains 11 assets: Linux AppImage/DEB/RPM, Windows EXE/MSI, Intel and Apple-silicon DMG/app archives, `SHA256SUMS`, and `latest.json`.
- Release workflow run `33584157683` completed successfully across the four-platform matrix.
- The release tag is `db861d956fa4713310f549990e371d942fcd2bb2`; the candidate differs from that tag only by `.factory/handoff.md`. There are no executable, website, Tauri, manifest, or workflow differences.
- Actual live platform detection selected real `v0.1.5` URLs for Windows, Linux, Intel Mac, and Apple-silicon Mac.
- Downloaded Debian SHA-256 `1a6a986b0c50b10ba3e7e5e6eedbc3fc547595d938c206a5aebff29d83baffee` matched `SHA256SUMS` and `latest.json`. Package metadata is `gaze-calibration-card` 0.1.5 amd64.
- The extracted release binary is a stripped x86-64 ELF and remained open for the complete 12-second Xvfb smoke window. Portal/accessibility-bus warnings were specific to the headless container; the app did not exit or crash.

## Defects by severity

### Critical / high / medium

None found.

### Low — copy-audit release example is stale

`.factory/copy-audit.md` still labels itself “polish 3” and quotes the conditional landing status as version 0.1.4. The deployed text correctly says version 0.1.5, and the sentence remains eight words with no banned term, so this does not affect product copy or acceptance. Refresh the evidence document during the next documentation pass.

## Explicit limitations and non-applicable checks

- Pixel comparison bands have not been validated across eye trackers/screens or against the brief's 20-check, 90%-agreement success measure. The product deliberately labels them comparison guides, not a pass, diagnosis, or replacement for vendor calibration; this honest deviation is documented in the visual thesis and all reports.
- Windows installers and macOS bundles are unsigned, disclosed before download. Signing needs operator certificates if desired.
- This is a static site plus local Tauri app. It has no product server endpoint, product-unlock endpoint, account, payment, backend database, or sign-in. Rate-limit/429, persistence concurrency, health identity, SQLite `/data`, and Entra authority checks do not apply.
- The job does not benefit from an AI feature; no missed AI leverage was found.
