# Independent verification 10 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `934bd97b906974ae82810cf0f8de8adf0c9de823`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Verified: 2026-09-02 UTC
- Work order: `gaze-calibration-card-verify-10`

The deployed product is functionally strong and matches the candidate byte-for-byte, but the candidate does **not** meet the factory release contract because its required local test commands fail from this clean checkout. `npm test` failed twice reproducibly. The complete Playwright suite also exited non-zero after a Chromium crash. These failures block release acceptance even though every declared product claim passed.

## First-read and demo gate — PASS

A cold live visit answers all required questions on its first screen in plain words:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** people who rely on eye input after posture, glasses, light, or fatigue changes.
- **First action:** **Try it with sample data** — “Opens a completed check; nothing is saved.”

One click opens `/demo/#result`, showing a completed nine-target check (42 px mean error, 91% dwell, directional pattern). The persistent **Demo — sample data, nothing is saved** banner supplies **Reset demo** and **Start a new check**. Reset preserved a real-history marker; leaving demo removed its `demo:` namespace and opened reloadable real mode.

## Required claims gate — 18/18 PASS

`.factory/claims.json` was present before testing. After clean `npm ci`, I ran every literal `test` command in manifest order from its specified demo entry point. All reached the final `@claim:thirty-second-check` test and passed; Playwright's final run status was `passed` with no failed tests.

| Claims | Result | Evidence |
| --- | --- | --- |
| `sample-demo`, `offline-reload`, `local-private`, `no-account` | PASS | Isolated demo, offline reload, no camera/telemetry, no account/cookie paths passed. |
| `nine-targets`, `pointer-measures`, `pointer-sampling`, `keyboard-high-contrast` | PASS | Nine readings, populated measurements, per-target local samples, keyboard/forced-colors/reduced-motion + axe passed. |
| `report-export`, `notes-opt-in`, `history-limit` | PASS | Standalone report, consent-gated notes, 50-record cap and clear passed. |
| `release-download`, `installer-checksum`, `unsigned-builds` | PASS | Platform release selection/cache, checksum stop, and Windows/macOS signature inspection passed. |
| `comparison-bands-limit`, `not-a-diagnosis`, `free-open-source`, `thirty-second-check` | PASS | Required limitations/free-MIT wording and the approximately 30-second automatic path passed. |

No material public claim on the live landing page or README lacked a registry entry.

## Local build and test evidence

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages installed; `npm audit --audit-level=high` found 0 vulnerabilities. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm test` | **FAIL twice** — 8/9 tests passed; `tests/copy-audit.test.ts` timed out at Vitest's 5,000 ms default. |
| `npx vitest run tests/copy-audit.test.ts --testTimeout=10000` | PASS — same test completed in 8,912 ms, confirming the timeout defect. |
| `npm run build` | PASS — produced `dist/app` and `dist/site`. |
| `npm run test:e2e -- --reporter=line` | **FAIL** — 63 passed, 8 intentional skips, 1 failed in 4.1 minutes; see High finding 2. The failed test passed alone. |
| `npx playwright test tests/e2e/site.spec.ts:137 --project=mobile --reporter=line` | PASS — 1/1 in 17.6 seconds. |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing standard GLib/GTK/WebKit development prerequisites in this disposable verifier. |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — library, binary, and doc harnesses; the crate defines 0 Rust tests. |
| `npm run test:lighthouse` | PASS — mobile performance 95, 99, 98 (median 98); accessibility 100 in all three runs. |
| `npm run test:unsigned-builds` | PASS — v0.1.6 EXE, MSI, Apple-silicon and Intel Mac archives matched release digests and reported no publisher signature. |

Production output remains well within static budgets: the largest application JS is 25.65 KB raw / 8.95 KB gzip; site check/demo JS is 24.94 KB raw / 8.65 KB gzip; landing JS is 3.81 KB raw / 1.63 KB gzip plus a 0.40 KB gzip preload helper; site CSS is 6.56 KB gzip; hero AVIF is 28,391 bytes.

## End-to-end, accessibility, privacy, and deployment — PASS

- The claim suite exercised normal flows, keyboard-only completion, pointer samples, blank/stopped-pointer recovery, malformed/local-history recovery, note consent, clearing 50 records, export, direct routes, back/forward, boundary scoring, and the 30-second path.
- The independent live Playwright audit found 0 serious/critical axe findings and 0 console/page errors on `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`. Each has `lang=en`, exactly one `h1`, one `main`, expected route title, alternatives for every image, and the shared skip/header/footer structure.
- At 390×844, the first-screen facts ended at y=815, the sample control was 358×64 px, navigation remained visible/touch-sized, and 200% text had no horizontal overflow. Visual inspection confirmed the live mobile landing and completed-demo layouts are legible and coherent.
- The live demo requested only same-origin resources during reset/exit; landing's only external request is the documented GitHub Releases API. Claim testing verified the demo does not request camera access, send pointer/setup data, telemetry, credentials, or cookies.
- Live root headers include HSTS, `nosniff`, strict referrer policy, `X-Frame-Options: DENY`, a permissions policy that denies camera/microphone/geolocation/payment/USB, and CSP with `frame-ancestors 'none'`. `connect-src` permits only self and `https://api.github.com`.
- HTML is `no-cache`; hashed assets are `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`. Landing and demo reloaded offline after first visit, and demo reset worked offline.
- Live build id is `934bd97b9069`. Fresh production output matched the live SHA-256 byte-for-byte for six HTML routes, service worker, both app JS bundles, landing JS, module helper, site CSS, and hero AVIF. The candidate differs from tag `v0.1.6` only in `.factory/` evidence/handoff files; no product, Tauri, workflow, or manifest file differs.
- GitHub Release `v0.1.6` has all 11 expected desktop artifacts. The Debian package SHA-256 was `030a0172f2b7d7c6d72cd0e7973b7612e7daaed6b531ec3b1fe4d420d8121858`, matching `SHA256SUMS`; its metadata is `gaze-calibration-card` 0.1.6 amd64. Its extracted executable stayed alive for a 12-second Xvfb smoke run (only expected headless EGL warnings).

## Defects by severity

### High — required `npm test` is deterministically red

`tests/copy-audit.test.ts` invokes `npm run build:site`, yet the test leaves Vitest's default 5,000 ms timeout. From this clean checkout, `npm test` failed twice at 5,051 ms and 5,038 ms respectively (8/9 tests passed). With an explicit 10,000 ms timeout, that same test passed in 8,912 ms. This fails the required local quality gate. Increase the test timeout or restructure the test so its build is outside the default test deadline, then rerun `npm test` from a clean checkout.

### High — complete Playwright command is not reliable

`npm run test:e2e -- --reporter=line` exited 1 after 63 passes and 8 expected skips when Chromium crashed before the mobile execution of `deployment config defines security, caching, and a real 404`. The failure was `browser.newContext: Target page, context or browser has been closed`; its trace records the Chromium process crash. The test passes in a fresh isolated mobile run (1/1). Diagnose and eliminate the full-suite browser/resource instability before accepting the candidate; a non-zero required browser suite is release-blocking even if its isolated assertion is valid.

### Medium / low

None found.

## Non-applicable checks

This local-first static site and desktop app has no product server endpoint, account, billing, unlock call, backend database, or sign-in flow. Rate-limit/429, persistence concurrency, backend health/build identity, SQLite `/data`, and Entra authority checks do not apply. The product does not need an AI feature for the researched job.
