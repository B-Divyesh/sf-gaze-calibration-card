# Independent verification 4 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `b4c64c1a435f345bc0a4fe1a1afc729176fcf8a2`
- Live URL: <https://gaze-calibration-card.sociobot.in>
- Verified: 2026-09-01 UTC
- Work order: `gaze-calibration-card-verify-4`

The live static site matches the candidate and the main local pointer-comparison flow works. The candidate is not acceptable because one required claim command failed, the published desktop package predates candidate desktop changes, and 200% text resizing causes horizontal scrolling. The three-run median Lighthouse performance score is also below the required score.

## First-read and one-click sample gate

Confirm that a cold 1440×900 visit explains the product in its first viewport: **“Check your gaze pointer before a demanding task.”** The next sentence says it is for people who rely on eye input and names posture, glasses, light, and fatigue changes. The first action is **“Try it with sample data,”** with adjacent text saying it opens a completed check and saves nothing. The same viewport shows the three facts: no camera/account, offline sample reload, and free/open-source availability.

Confirm that one click opens `https://gaze-calibration-card.sociobot.in/demo/#result`, shows the persistent **“Demo — sample data, nothing is saved”** banner, and displays a completed nine-reading result. This gate passes on desktop and at 390×844.

## Defects by severity

### Critical — the published desktop download is older than the candidate

Confirm that the live landing selects GitHub Release `v0.1.1`. The release API reports `target_commitish` `28a05ab3a26e11930f84d0690326ed9b82fcc847`, published `2026-08-30T07:12:58Z`. Candidate `b4c64c1` includes later desktop-app changes from commit `45c574b` on 2026-09-01. `git diff v0.1.1..b4c64c1 -- src/app` reports three changed app files with 75 insertions and 41 deletions.

Check that the downloaded Linux AppImage opens the older first screen, **“Is your gaze setup steady enough right now?”**, with **“Local reliability check”** and **“Past checks.”** The candidate binary opens **“Compare your gaze pointer right now,”** with **“Local pointer comparison”** and **“View past checks.”** The downloadable desktop product therefore does not contain the candidate’s current copy, routing, policy links, or 44px demo controls. A new release must be built from the accepted candidate.

### Critical — one required claim command fails

Confirm that `.factory/claims.json` is present and lists 14 commands. Run each command separately immediately after `npm ci`. Thirteen pass. This exact command fails:

```text
npm run test:claims -- --grep @claim:history-limit
```

Check that the failure occurs after the check count is correctly capped at 50. After selecting **Clear history** and **Clear checks**, the assertion at `tests/e2e/claims.spec.ts:192` reads the storage key before the dialog `close` handler has removed it. Playwright reports the full 50-record value instead of `null`.

Check that this is timing-dependent: the complete Playwright suite later passes, a five-repeat diagnostic passes 5/5, and an independent live check passes after waiting for the storage key to disappear. The initial required command still failed, which is release-blocking under the claims contract. Candidate CI is also red: GitHub check `web` for `b4c64c1` failed in its `npm run test:e2e` step.

### Major — 200% text resizing does not reflow at phone width

Confirm that normal 390×844 layouts have no horizontal overflow. Check the same pages after setting the root text size to 200%. The landing document becomes 421px wide in a 390px viewport, and `/demo/` becomes 413px wide. On the landing page, `.preview-copy` and `.mini-card` extend 31px beyond the viewport; report text and the example card require horizontal scrolling. `/privacy/`, `/terms/`, and the 404 page remain 390px wide.

### Moderate — mobile Lighthouse performance misses the required score

Check three fresh Lighthouse 12.8.2 mobile runs. Performance scores are 87, 88, and 91; the median is 88 against the required 90. Accessibility, Best Practices, and SEO are 100 in every recorded run. LCP ranges from 1.32–2.08 seconds, CLS is 0.00016, total transfer is about 139.7 KB, and total blocking time ranges from 352–506.5 ms.

### Moderate — the local Linux AppImage packaging step is not reproducible in this worker

Confirm that `CI=true npm run tauri build -- --bundles appimage` compiles the optimized application binary, then fails when the current downloaded `linuxdeploy` helper runs its GTK plugin and returns status 127. The previously published AppImage exists and works when extracted, so this is a next-release packaging risk rather than evidence that the published package is unusable. Pin or repair the Linux packaging helper before creating the replacement release.

## Required claim checks

| Check that | Result |
| --- | --- |
| The sample opens with isolated storage | PASS |
| The landing and sample reload offline | PASS |
| The sample requests no camera and sends no pointer data or telemetry | PASS |
| A completed result contains nine targets | PASS |
| The result shows error, dwell, and directional pattern | PASS |
| Pointer positions are recorded for every target | PASS |
| Keyboard, high contrast, and reduced motion paths work | PASS |
| A standalone HTML report downloads | PASS |
| Setup notes are stored only after approval | PASS |
| History stays at 50 and can be cleared | **FAIL** on the required isolated command |
| Platform downloads resolve from release metadata and cache for one hour | PASS |
| Shell and PowerShell installers check SHA-256 before use | PASS |
| The product is free and uses the MIT License | PASS |
| The automatic nine-target check takes about 30 seconds | PASS — 36.9-second test runtime including setup; measured check interval remains 24–30 seconds |

Confirm that each manifest identifier appears exactly once as a tagged browser check. Check the live landing and README claim-like statements against the manifest; no additional unlisted landing or README claim was found.

## Clean install, build, and automated checks

| Check that | Result |
| --- | --- |
| Checkout starts clean at the requested candidate | PASS |
| `npm ci` installs the lockfile | PASS — 64 packages, 0 reported vulnerabilities |
| `npm audit --audit-level=high` reports no known package issue | PASS |
| `npm test` passes unit checks | PASS — 6/6 |
| `npm run lint` passes TypeScript checking | PASS |
| `npm run build` creates `dist/app` and `dist/site` | PASS |
| `npm run test:e2e -- --reporter=line` passes locally | PASS — 44 passed, 4 expected viewport skips |
| `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check` passes | PASS |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` passes | PASS |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` passes | PASS — no Rust unit cases are defined |
| The optimized native binary compiles | PASS |
| The local AppImage bundler completes | FAIL — `linuxdeploy` GTK plugin exits 127 |
| Candidate GitHub CI is green | FAIL — check run `33553834042`, job `100009678298`, fails at `npm run test:e2e` |

## Product workflow and recovery checks

- Confirm that a strict keyboard-only run can leave the sample, select Keyboard practice with Arrow keys, prepare/start with Enter, and complete all nine targets with Space. The result heading receives focus and no console/page error occurs.
- Check that keyboard focus uses a 3px solid `#a85f00` outline. Its light-paper contrast is 4.28:1; the dark-theme outline contrast is 10.75:1.
- Confirm that a mouse/pointer run produces a measured result and export through the complete local suite.
- Check threshold boundaries directly: 80px mean error with 75% dwell is within the guide; 80.25px is mixed; 55% dwell is mixed; 50% dwell and no samples are outside; keyboard input reports practice only.
- Confirm that invalid local-history JSON recovers to the empty state without an error.
- Check that a 4,127-character setup value containing HTML-like markup remains text, does not execute, and is escaped in the exported report.
- Confirm that Escape stops a running check, reports that no result was saved, and returns to editable setup.
- Check that history is capped at 50 records and that live clearing succeeds after the dialog close event completes.

## Live identity, privacy, accessibility, and offline checks

- Confirm that every public file in fresh `dist/site` except the host-only configuration hash-matches the live counterpart. This includes all route HTML, JS, CSS, images, icons, installers, `robots.txt`, `sitemap.xml`, and `sw.js`. The footer reports build `b4c64c1a435f`.
- Check that `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. A missing route returns the designed page with HTTP 404. All discovered internal and GitHub links return 200.
- Confirm that normal routes have no console or page errors. The requested missing document produces only the browser’s expected 404 resource message.
- Check that the live sample’s complete reset/export flow requests only `https://gaze-calibration-card.sociobot.in`. The cold landing additionally requests the documented GitHub Releases API and no other origin.
- Confirm that the response denies camera, microphone, geolocation, payment, and USB permissions. Check CSP, HSTS, frame denial, `nosniff`, and strict referrer policy headers.
- Check that hashed JS/CSS files use `public, max-age=31536000, immutable`; `sw.js` uses `no-cache, no-store, must-revalidate`.
- Confirm that the service worker controls the page, completes an update check, uses cache `gaze-card-site-v2`, and reloads both the landing and sample offline. Reset sample remains usable offline with no console/page errors.
- Check live `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404 at desktop and 390px. Each has one h1, one main landmark, `lang="en"`, route-specific title, no missing image alt text, and no serious/critical Axe finding. Normal-size layouts have no horizontal overflow.
- Confirm that `/opt/fleet/lib/verify-url.sh` passes the live URL: 200, title, language, one h1, main, no missing alt text, no errors, and 813 ms observed load. Its `buttonsUnlabeled: 1` counter is the collapsed **Copy install command** control; the element has visible text in its markup and is hidden while its `<details>` is closed.

## Bundle and release checks

- Confirm that initial compressed landing JavaScript is 1.92 KB, CSS is 6.49 KB, and the AVIF hero is 28.4 KB. The app JavaScript is 8.45 KB gzip and app CSS is 4.44 KB gzip. There are no downloaded fonts.
- Check GitHub Release `v0.1.1` for macOS arm64/x64 DMGs, Windows EXE/MSI, Linux AppImage/DEB/RPM, app archives, `SHA256SUMS`, and `latest.json`; all are present.
- Confirm that the downloaded 76,564,984-byte Linux AppImage has SHA-256 `9aea533ab97af74efbc14b01616c5292f58b66423d0797e1246d3116fa848095`, matching `SHA256SUMS` and `latest.json`.
- Check that the AppImage extracts with its executable and desktop entry. Its process remains running under a virtual display until the 12-second QA timeout, with only a non-fatal software-rendering warning.

## Not applicable

Confirm that this product has no server-side product endpoint, product-unlock call, account, payment, database, or sign-in flow. Request allowance/429, persistence concurrency, health endpoint, SQLite `/data`, and Entra tenant checks do not apply. Check that the brief does not need an AI feature; no missed AI step was found.

## Required next steps

1. Confirm the history-limit claim passes reliably as its exact standalone command and in the complete suite.
2. Check that landing and demo content reflow without horizontal scrolling at 200% text size.
3. Confirm a new desktop release is built from the accepted candidate and that the live download resolves to it.
4. Check the candidate’s GitHub quality workflow is green and the Linux packaging helper completes reproducibly.
5. Confirm the median mobile Lighthouse performance score is at least 90.
