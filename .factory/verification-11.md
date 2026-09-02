# Independent verification 11 — Gaze Calibration Card

**Verdict: PASS**

- Candidate: `c08f91a1ac945260dbd8c7c06e6c200c75674882`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Verified: 2026-09-02 UTC
- Work order: `gaze-calibration-card-verify-11`

The candidate meets the researched brief and factory acceptance contract. It delivers the local nine-target pointer comparison, directional error and dwell reporting, consent-gated setup notes, local history, standalone support export, one-click isolated demo, offline reload, and installable desktop releases. It states the device-dependent and non-diagnostic limits instead of claiming the brief's unvalidated 90% agreement target.

## First-read and demo gate — PASS

A cold 1440×900 live visit answered all three required questions on the first screen:

- **What:** “Check your gaze-controlled pointer before a demanding task.”
- **For whom:** people who rely on eye input after posture, glasses, light, or fatigue changes.
- **First action:** **Try it with sample data**, beside “Opens a completed check; nothing is saved.”

One click opened `/demo/#result` with nine readings, 42 px average error, 91% dwell, and directional pattern. The persistent **Demo — sample data, nothing is saved** banner offered **Reset demo** and **Start a new check**. Reset and exit preserved a seeded real-history marker while removing demo data. Screenshots: [desktop cold view](evidence/live-cold-desktop.png), [390 px cold view](evidence/live-cold-mobile-390.png), and [loaded mobile walkthrough](evidence/live-walkthrough-mobile-loaded.png).

## Required claims gate — 18/18 PASS

`.factory/claims.json` was present. After the clean checkout's required `npm ci`, every literal `test` command was run separately in manifest order and exited 0.

| Claims | Result | Evidence |
| --- | --- | --- |
| `sample-demo`, `offline-reload`, `local-private`, `no-account` | PASS | Isolated sample/reset/exit, first-visit offline reload, camera/request trap, credential and cookie checks passed. |
| `nine-targets`, `pointer-measures`, `pointer-sampling`, `keyboard-high-contrast` | PASS | Nine readings, all three measures, fresh local samples, keyboard/forced-colors/reduced-motion/axe checks passed. |
| `report-export`, `notes-opt-in`, `history-limit` | PASS | Standalone HTML export, approval-gated notes, 50-record cap and clear passed. |
| `release-download`, `installer-checksum`, `unsigned-builds` | PASS | Platform selection/cache, checksum-failure stop, and published Windows/macOS signature inspection passed. |
| `comparison-bands-limit`, `not-a-diagnosis`, `free-open-source`, `thirty-second-check` | PASS | Limits and MIT/free wording passed; automatic path completed inside its asserted 24–30 second range. |

The live landing page and README were cross-checked against the registry. No unlisted material claim was found.

## Clean checkout and production gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages installed; 0 vulnerabilities. |
| `npm test` | PASS — pretest production build plus 10/10 Vitest tests. |
| `npm run lint` | PASS — `tsc --noEmit`. |
| `npm run build` | PASS — exact production output in `dist/app` and `dist/site`. |
| `npm run test:e2e -- --reporter=line` | PASS — 64 passed, 8 intentional project-profile skips, 0 failed in 3.4 minutes. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run test:lighthouse` | PASS — three mobile runs scored 99 Performance / 100 Accessibility; median Performance 99. |
| `npm run test:unsigned-builds` | PASS — EXE, MSI, Apple-silicon and Intel Mac archives matched digests and had no publisher signature. |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the documented Linux Tauri development libraries in the disposable verifier. |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — library, binary, and doc harnesses; the crate defines 0 Rust tests. |

Production budgets pass. Landing JavaScript is 3,809 bytes raw / 1,639 bytes gzip plus a 436-byte gzip preload helper. Check/demo JavaScript is 24,940 bytes raw / 8,622 bytes gzip. Site CSS is 27,446 bytes raw / 6,588 bytes gzip. The hero AVIF is 28,391 bytes and there are no downloaded fonts.

Independent Lighthouse against the live URL scored 98 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. It measured LCP 1,908 ms, FCP 1,908 ms, TBT 0 ms, CLS 0.00016, and 140,193 transferred bytes.

## End-to-end, invalid input, and recovery

- The live sample exported a 1,456-byte standalone HTML report with the expected setup and no remote script content.
- A keyboard-only live run used Tab, radio arrows, Enter, and Space. All nine targets received focus, the result was saved locally, and a cold reload restored it.
- Escape during the first target showed **No result was saved** and created no history entry. **Start again** recovered and completed normally.
- A fresh `/check/#result` without local state showed **No saved result found** and recovered to setup without exposing demo metrics.
- The adversarial note `<script>alert(1)</script> chair reclined` was stored only after approval and safely escaped in the exported report. No script executed and no console/page error occurred.
- The candidate suite additionally covers normal pointer completion, fresh-pointer sampling, stopped-pointer recovery, boundary scoring, history trimming/clear, note opt-in, back/forward focus restoration, and 200% text.

## Accessibility and responsive behavior

- Independent live axe scans found 0 serious/critical findings on the landing, demo, real result, dark theme, and forced-colors target views. The full candidate suite scans every public route.
- The primary keyboard focus indicator computed to a 3 px solid outline. Route changes focus the new heading; all nine keyboard targets receive focus.
- At 390×844, the three first-screen facts ended at y=815, every visible action was at least 44 px high, and `scrollWidth === clientWidth === 390` at normal and 200% root text size.
- With reduced motion, the live active target computed `animation-name: none` and `transition-duration: 0s`.
- The walkthrough's three lazy images were scrolled into view and decoded at their declared 1280×800 intrinsic size.
- No console or page error appeared in any independent desktop, mobile, dark, forced-colors, demo, keyboard, recovery, or offline run.

## Privacy, network, headers, PWA, and links

- Playwright's request log showed only same-origin requests through the complete demo reset/export/exit flow. The landing's only external request was the documented GitHub Releases API. A `getUserMedia` trap remained false; there were no cookies, analytics, auth, telemetry, or pointer/note upload requests.
- Browser response headers include HSTS; `nosniff`; strict referrer policy; `X-Frame-Options: DENY`; a policy denying camera, microphone, geolocation, payment, and USB; and CSP with `frame-ancestors 'none'`. CSP allows connections only to self and `https://api.github.com`.
- HTML is `no-cache`; the checked hashed JS asset is `public, max-age=31536000, immutable`; `sw.js` is configured `no-cache, no-store, must-revalidate`; a missing route returns the designed document with HTTP 404.
- `registration.update()` completed with an activated `/sw.js`. Cache `gaze-card-site-v2` contained the shell, public routes, hashed scripts/styles, and images. Landing and demo reloaded offline, and demo reset worked offline.
- All 14 discovered internal, GitHub, release-page, and detected Linux download links resolved successfully.

## Candidate, deployment, and desktop release identity

- The live footer reports `Build c08f91a1ac94`.
- Candidate and live SHA-256 hashes matched byte-for-byte: root HTML `633f03ea7719b949a5dd93fa83c89e70ef671b2fd29d17ae323919cd0051f196`, landing JS `6dc7e5386d94971383137d8f6421749a9e58b59fa4b09b6f250b05decd0e808f`, and CSS `00fdf273f10f0a4e8fcf27a0ee80df60f74a0c1e5a206bcf4b8c24d60c4efc16`.
- GitHub Release `v0.1.6` has 11 expected assets: Linux AppImage/DEB/RPM, Windows EXE/MSI, Intel and Apple-silicon DMG/app archives, `SHA256SUMS`, and valid `latest.json`. Release workflow run `33590949532` completed successfully.
- Downloaded Debian SHA-256 `030a0172f2b7d7c6d72cd0e7973b7612e7daaed6b531ec3b1fe4d420d8121858` matched `SHA256SUMS`. Package metadata is `gaze-calibration-card` 0.1.6 amd64.
- The extracted published binary opened a 1280×820 window titled **Gaze Calibration Card** and stayed alive through an eight-second isolated Xvfb smoke run. Only the expected headless DRI3 warning was logged.

## Defects by severity

### Critical / high / medium / low

None found.

## Explicit limitations and non-applicable checks

- Pixel comparison bands remain unvalidated across eye trackers/screens and against the brief's 20-check, 90%-agreement success measure. The app consistently calls them comparison guides, not a pass, diagnosis, or vendor-calibration replacement. This is an honest documented product limitation, not a hidden claim.
- Windows installers and macOS bundles are unsigned and disclosed before download.
- This is a static site plus local Tauri app. It has no product server endpoint, unlock call, account, payment, backend database, or sign-in. Rate-limit/429, backend concurrency/persistence, health identity, SQLite `/data`, and Entra authority checks do not apply.
- The researched job does not benefit from an AI feature; no missed AI leverage was found.
