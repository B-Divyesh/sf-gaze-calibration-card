# Independent verification 8 — FAIL

**Candidate:** `394c2c03edb54251e1316c3cfb66911a51a208a9` (`docs: record polish three verification`)

**Live URL:** <https://gaze-calibration-card.sociobot.in/>

**Verified:** 2026-09-02 UTC from the clean candidate checkout.

## Release decision

**FAIL — two high-severity result-integrity defects block release.** The deployed files match the candidate, the declared claims pass, and the normal flows are polished. However, a stopped pointer is recorded as nine fresh measurements, and reloading a real result silently replaces it with bundled sample metrics outside demo mode. Both failures affect the core job of deciding whether the current gaze setup is trustworthy.

## First-read gate — PASS

The cold 1440×900 first screen answers all three questions in plain words:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** “For people who rely on eye input,” after posture, glasses, light, or fatigue changes.
- **First click:** **Try it with sample data**, followed by “Opens a completed check; nothing is saved.”

That action is in the first viewport and opens `/demo/#result` in one click. The completed nine-target sample has the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start a new check**.

## Claims — 18/18 passed after clean install

Every `test` value in `.factory/claims.json` was run separately against the repository's demo entry point. The literal pre-install invocations first reported only that the clean clone had no local `@playwright/test`; after the required `npm ci`, every registered assertion passed.

| Claim | Result | Observed assertion |
| --- | --- | --- |
| `sample-demo` | PASS | Completed sample, isolated namespace, reset, and exit preserved a real marker. |
| `offline-reload` | PASS | Landing and demo reloaded and operated offline after first visit. |
| `local-private` | PASS | Full demo/reset/export flow made same-origin requests only and requested no camera. |
| `no-account` | PASS | Demo, saved keyboard check, and export needed no credentials, auth request, or cookie. |
| `nine-targets` | PASS | Completed sample contained nine readings. |
| `pointer-measures` | PASS | Error, dwell, and directional pattern were populated. |
| `pointer-sampling` | PASS | Driven pointer coordinates were retained for all nine targets. |
| `keyboard-high-contrast` | PASS | Keyboard completion, forced colors, reduced motion, and axe assertion passed. |
| `report-export` | PASS | Standalone HTML report downloaded with the expected measurements and no remote resources. |
| `notes-opt-in` | PASS | Notes were absent without approval and retained after approval. |
| `history-limit` | PASS | The 51st record kept history at 50; confirmed clearing emptied storage. |
| `release-download` | PASS | Platform asset selection, GitHub-only metadata request, and one-hour cache passed. |
| `installer-checksum` | PASS | A controlled checksum mismatch stopped the shell installer before use. |
| `comparison-bands-limit` | PASS | The device-dependent, unvalidated limit appeared in the result and export. |
| `not-a-diagnosis` | PASS | The non-diagnostic, non-calibration limit appeared without pass/fail wording. |
| `unsigned-builds` | PASS | EXE, MSI, Intel Mac, and Apple-silicon Mac artifacts matched hashes and signing state. |
| `free-open-source` | PASS | MIT source/free wording appeared with no payment action. |
| `thirty-second-check` | PASS | The automatic nine-target timing stayed inside the asserted range. |

The landing page, app, policy pages, and README were cross-checked against the registry. No unlisted material claim was found. Passing the registered pointer tests does not cover the stale-pointer and cold-result cases below.

## Clean local and release QA

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages installed, 169 audited, 0 vulnerabilities. |
| `npm test` | PASS — 8/8 Vitest tests. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — exact app and site production builds created `dist/app` and `dist/site`. |
| `npm run test:e2e` | PASS — 57 passed, 7 intentional project-profile skips, 0 failed. |
| `npm run test:lighthouse` | PASS — performance/accessibility pairs 96/100, 99/100, 99/100; median performance 99. LCP 1.60–1.76 s, CLS 0.00016, TBT 0–178 ms. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run test:unsigned-builds` | PASS — all four asserted Windows/macOS packages matched `SHA256SUMS` and the disclosed signing state. |
| `cargo test --manifest-path src-tauri/Cargo.toml` and `cargo check ...` | ENVIRONMENT BLOCKED — this container lacks `glib-2.0.pc`. No Rust assertion ran. The candidate's GitHub release workflow completed successfully on all four platform runners and published the packages. |

Production budgets pass: app JS is 8.46 KB gzip; landing JS is 1.63 KB gzip; demo/app JS is 8.16 KB gzip; site CSS is 6.45 KB gzip; the AVIF hero is 28.4 KB. There are no third-party fonts or scripts.

GitHub Actions confirms both **Quality gates** and **Release desktop apps** completed successfully for the exact candidate SHA. Release `v0.1.4` targets the exact SHA and contains Linux AppImage/DEB/RPM, Windows EXE/MSI, Intel and Apple-silicon Mac builds, `SHA256SUMS`, and `latest.json`. The downloaded Debian package was version `0.1.4`, amd64; its observed SHA-256 `4c0ee0f91482ad9505292059ad0f06b68ee4de467d7ce151c668b1d5c7b01959` exactly matched the release manifest.

## Live deployment and browser QA

- The live footer reports `Build 394c2c03edb5`.
- Fresh local and live SHA-256 hashes match byte-for-byte for all six HTML pages, both application JS bundles, CSS, service worker, and other checked shell files.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, 852 ms, correct title/lang/one h1/main, no missing alt text, no unlabeled buttons, and no console errors.
- `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` have correct route titles, one h1/main, zero serious/critical axe findings, and zero console/page errors. A missing path returns the designed page with HTTP 404.
- A true keyboard-only flow used Tab, arrow keys, Enter, and Space to complete all nine targets. The observed focus outline was a 3 px solid high-contrast ring. Forced-colors axe found zero serious/critical issues.
- Under reduced motion, both target and settle-ring animation durations computed to `0s`.
- At 390×844, the demo banner and nine map points were visible, no horizontal overflow occurred, and axe found zero serious/critical issues. The primary landing action measured 358×64 px; the first-screen facts ended at y=780.
- A normal live pointer run completed all nine targets and reported 1 px error, 100% dwell, no consistent drift, and nine map points.
- A premature target click was ignored. Escape produced “No result was saved”; **Start again** returned to target 1. Malformed local history recovered to the designed empty state.
- Demo reset preserved a seeded real-history marker. Leaving demo removed demo data, opened `/check/#setup`, and remained in real mode after reload.
- Service-worker `registration.update()` completed with an activated controller and no waiting worker or console error. The `gaze-card-site-v2` cache existed; landing and demo reloaded offline.
- Internal/external link crawl returned 200 for every discovered target. `robots.txt` and `sitemap.xml` returned 200.
- The landing and demo request log used only the product origin plus the documented GitHub release-metadata API. No pointer upload, camera request, analytics, telemetry, or other third-party request was observed.
- HTML uses `Cache-Control: no-cache`; hashed assets use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Response headers include HSTS, `nosniff`, strict referrer policy, camera/microphone/geolocation/payment/USB denial, `X-Frame-Options: DENY`, and CSP with `frame-ancestors 'none'` and only the documented GitHub API in `connect-src`.
- This is a static site plus packaged local desktop app. It has no product server endpoint or product-unlock call, so a 429 allowance test is not applicable. It has no sign-in flow, so Entra authority verification is not applicable.

## Defects by severity

### High — a stopped pointer is fabricated as nine current samples

**Reproduction:** In a fresh live context, choose **Gaze-controlled pointer**, prepare and start the check with the pointer, then do not move the pointer for all nine automatic targets.

**Observed:** The result says “The pointer crossed this app’s error or dwell bands” and reports **9 local pointer samples**. Storage shows one sample for each target, all at the identical old Start-button coordinates (`361.9700, 594.8600`) and each relabeled around 2801 ms. `distinctPositions` is 1. The intended “No recent pointer movement was detected” message does not appear.

**Cause:** `completeCurrentTarget` in `src/app/main.ts` falls back to the global `pointer` whenever the current target has no samples, without checking `performance.now() - pointer.time`. It then assigns a current target-relative time to that stale coordinate.

**Impact:** A disconnected, frozen, or non-moving gaze pointer produces invented per-target measurements, false directional drift, and misleading recovery advice. This violates the core requirement to assess whether gaze input is currently trustworthy.

**Required fix:** Do not append the fallback unless the pointer event is recent enough for the current target. Preserve zero samples otherwise and regression-test the common click-Start-then-no-movement path, including the zero-sample recovery copy.

### High — reloading a real result silently replaces it with demo metrics

**Reproduction:** Complete a real mouse/pointer check at `/check/#result`, then reload. A direct fresh visit to `/check/#result` reproduces the same state.

**Observed:** Before reload, the test result showed 1 px error and nine map points, and one real history record existed. After reload, the page still had no demo banner but showed the bundled sample's 42 px result dated 30 August 2026, with zero map points. The real history record remained in storage. A fresh direct visit likewise presents “Pattern within comparison guide” despite having no saved check.

**Cause:** `renderRoute("result")` calls `renderResult(lastResult ?? sampleResult)` for real and demo routes alike. `lastResult` is memory-only and starts null after a reload, while the global `readings` array is empty.

**Impact:** The product can replace a user's current result—potentially an outside-guide result—with a positive sample result presented as real. This undermines the central comparison decision and breaks reload/deep-link recovery.

**Required fix:** Use `sampleResult` only in demo mode. Persist or address the current result and rehydrate it on reload; if no real result exists, return to setup/history with a plain explanation. Add cold-reload and direct-result-route regression tests.

### Medium / low

No additional defects found.
