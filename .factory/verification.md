# Independent verification — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `ea5b7d19cab1ae860763f53466b74f4c2990272c`
- Branch: `main`
- Live URL: <https://gaze-calibration-card.sociobot.in>
- Verified: 2026-08-30 UTC
- Work order: `gaze-calibration-card-verify-1`

The core nine-point check works, the desktop packages are downloadable, and the live site is fast and private. It cannot be accepted because the required claims manifest and one-click isolated demo are absent. The PWA also fails a true offline reload after only one visit, and keyboard/screen-reader focus is lost at major workflow transitions.

## Release-blocking findings

### Critical — required claims gate is absent

`.factory/claims.json` does not exist. The mandatory first command therefore ended with `RELEASE_BLOCKER: .factory/claims.json missing` and exit 2. No claim test can be run through a demo entry point.

This also leaves all user-facing promises unlisted, including the roughly 30-second duration, local-only processing, no camera/network/telemetry, keyboard and high-contrast support, report export, 50-check history limit, and offline behavior. Some were independently exercised below, but that does not satisfy the claims contract.

### Critical — first-read and demo gates fail

A fresh 1440×900 and 390×844 browser context showed:

- Headline: “Know whether your gaze is steady before the task.”
- Supporting copy: “A calm, vendor-neutral check for changing posture, glasses, light, and fatigue…”
- First action: “Download the app.”

The screen explains the job, but does not plainly name the intended person relying on eye input. More importantly, there is no “Try it with sample data” or “Load sample project” action. `/demo` returns the ordinary homepage with HTTP 200 and has no demo banner, reset, sample data, or isolated storage. `.factory/demo.md` is also absent. The landing page has an illustration and one example result, not the required 3–5 frame desktop walkthrough.

### High — offline reload fails after the first visit

The service worker installs and its update call succeeds. Its cache after the first visit contains only `/`, the WebP hero, `/privacy/`, and `/terms/`; it does not precache the hashed JS, CSS, or AVIF selected by the page.

After one visit, clearing only the HTTP cache, going offline, and reloading produced three `net::ERR_FAILED` console errors. The page remained at “Detecting your system…” because JavaScript did not load, and its styling asset also failed. An online reload before going offline happens to populate the runtime cache, but that is not “offline after the first visit.”

### High — focus is lost at workflow state changes

Using only Tab, arrow keys, Enter, and Space completes keyboard practice. Focus is visible and the active target receives focus. However:

- submitting setup replaces the focused button and leaves focus on `<body>`;
- completing target 9 replaces the focused target and again leaves focus on `<body>`;
- there is no live route/state announcement and the new `<h1>` is not focused.

This makes screen-reader and keyboard users rediscover the page after the two most important state changes. It conflicts with the product's keyboard-access requirement and the routing/focus acceptance contract.

### High — the brief's outcome threshold is not validated

The success measure requires at least 90% agreement with measured target-error thresholds across 20 repeated checks. No fixture, study result, automated test, or hardware validation evidence exists. The handoff itself says the fixed pixel thresholds have not been validated. The UI nevertheless presents definitive “Reliable for use,” “Use with care,” and “Recalibrate first” verdicts. Device-dependent disclaimers are present, but they do not establish the required product outcome.

## Other findings

### Medium — deployment security and caching configuration is incomplete

The live responses include HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but no `Content-Security-Policy` or frame restriction. There is no `staticwebapp.config.json` in the candidate. The root document, hashed JS/CSS, and service worker all return `Cache-Control: public, must-revalidate, max-age=30`; hashed assets are not cached as long-lived immutable resources.

### Medium — routing and metadata do not meet the site contract

- An arbitrary missing route returns the homepage with HTTP 200; there is no designed 404 document.
- `/privacy/` and `/terms/` have no meta description or canonical URL.
- The site has no Open Graph tags, Twitter card tags, or Apple touch icon.
- The landing title, “Gaze Calibration Card — know before you gaze,” uses slogan copy rather than a plain description.
- The footer omits “Built by Param Factory” and a build identifier.
- `.factory/copy-audit.md` is absent.

### Medium — several mobile link targets are below 44 px

At 390 px, the inline privacy link is 19 px high and the footer links are 22 px high. Their visible target boxes do not meet the 44×44 px minimum. The primary controls and form fields do meet it; radio and checkbox controls have larger clickable labels.

### Medium — release discovery and build identity are fragile

The landing page reads a checked-in same-origin `latest.json`; it does not query the CORS-enabled GitHub Releases API or cache that API response for one hour as required. A new release can therefore leave the detected download stale until the site manifest is manually updated.

The architecture test relies on `navigator.userAgent` containing `arm` or `aarch`. A normal Apple-silicon Chrome compatibility user agent contains `Intel`, so it selects the Intel DMG. The shell installer correctly uses `uname -m`.

The static live files match the candidate byte-for-byte. Native assets are from tag `v0.1.0` at `e2a78e1d1cc4860b0f9a01b934dc77103bd5887c`, not the candidate commit. There are no app or Tauri source changes between that tag and the candidate, but the binary has no embedded commit identity, so exact candidate provenance is not independently attestable.

## Tests and evidence

### Clean checkout gates

| Check | Result | Evidence |
| --- | --- | --- |
| Initial repository state | PASS | `HEAD` and `origin/main` were candidate `ea5b7d19…`; tree was clean |
| Claims gate | **FAIL** | `.factory/claims.json` missing; exit 2 |
| `npm ci` | PASS | 62 packages installed; 0 vulnerabilities |
| `npm test` | PASS | 6/6 Vitest tests |
| `npm run build` | PASS | TypeScript plus app/site production builds; outputs in `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS | 9 passed, 1 intentional mobile pointer-path skip |
| `npm audit --audit-level=high` | PASS | 0 vulnerabilities |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS | Passed after installing documented Tauri Linux prerequisites |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS | 0 Rust unit/doc tests; build passed |
| Lint | N/A | No lint script/configuration exists |

Build sizes, all below budget:

- App JS 19.82 KB raw / 7.35 KB gzip; CSS 15.19 KB raw / 4.28 KB gzip.
- Site JS 2.54 KB raw / 1.19 KB gzip; CSS 7.29 KB raw / 2.38 KB gzip.
- Live mobile first load: 36,054 transferred bytes, including a 28,480-byte image.

### Product flows

- A real keyboard-only sequence selected keyboard practice with arrow keys, entered setup notes, submitted, started, and completed all nine targets with Space. The result correctly said “Keyboard path complete” and did not claim gaze reliability.
- A mouse/touch run produced a reliable result (1 px average error, 100% dwell, 9 samples), exported `gaze-check-2026-08-30.html`, and showed a completion status.
- HTML-like note input was escaped in the exported report; no raw `<img>` tag appeared.
- A keyboard-started gaze run with no pointer input took 27.2 seconds and produced “Recalibrate first,” 999 px, 0% dwell, 0 samples, and the correct tracker recovery instruction.
- Escape stopped after 1/9 targets and showed “No result was saved,” with restart and edit actions.
- Corrupt local history JSON recovered to the empty state without an error.
- Simulated storage quota failure still produced an exportable result without a page error.
- A 50-item history remained capped at 50 after adding another result.
- Boundary calculations behaved as specified: 75% dwell with 62.5 px mean was reliable; 55% with 125 px was borderline; 50% dwell or 125.45 px mean was unreliable.

### Accessibility and responsive behavior

- Playwright/axe on the local app setup, result, history, dark theme, and 390 px views found no serious/critical violations in normal light/dark modes.
- Live landing, privacy, and terms scans at desktop, dark theme, and 390 px found no serious/critical axe violations in normal modes.
- `verify-url.sh` returned HTTP 200, title, `lang=en`, one `<h1>`, `<main>`, zero missing image alts, and no console errors. Its one “unlabeled” count is the hidden Copy button inside a closed `<details>`; the button has visible text when exposed.
- Focus rings were 3 px and visible in light, dark, and forced-colors modes; a forced-colors screenshot remained legible.
- Reduced motion computed to no animation and zero-duration transition on the active target.
- The app at 390 px and its result at 200% root text size had no horizontal overflow.
- The focus-transition and mobile target-size defects above require repair despite the axe passes.

### Live privacy, deployment, and PWA

- Normal live landing requests were same-origin only: document, hashed JS/CSS, hero asset, and `latest.json`. There were no analytics, tracking, cookies, console errors, or page errors.
- The local app's complete keyboard flow also made no cross-origin request. Source review found no camera API, telemetry, or runtime external fetch in the app.
- Live `index.html`, hashed JS, hashed CSS, and `latest.json` SHA-256 values exactly matched the fresh candidate build.
- All nine links exposed on the landing page resolved successfully.
- Service-worker registration and update succeeded. Offline reload succeeds only after an extra online controlled reload; the first-visit failure is documented above.
- Lighthouse mobile runs scored 98–100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. One measured run: LCP 1,105 ms, TBT 149.5 ms, CLS 0.

### Desktop release and installers

- GitHub release `v0.1.0` is public and contains nine native assets plus `SHA256SUMS` and `latest.json`, covering Linux, Windows, and Intel/Apple-silicon macOS.
- OS selection resolved to real v0.1.0 URLs for Windows, Linux, Intel Mac, and a simulated ARM Mac. The real-world Apple-silicon detection concern is noted above.
- Running `public/install.sh` with an isolated `XDG_BIN_HOME` downloaded the 76,302,840-byte AppImage, verified it, and installed it to the temporary directory.
- AppImage SHA-256: `9f7c2dc8651a98ceebb8d265c6b306455ba0bc3bdeeb631cd9480de0d198f5f1`, matching both manifests. The image extracted successfully and its app ran under Xvfb for the 12-second smoke window without a crash. Direct FUSE mounting was unavailable in the container.
- Debian package SHA-256: `0a3035f8b34833ed5906c5a06a8c05961cfe1f01058dc07273a8a5128d00ebb5`; metadata identifies package/version/architecture `gaze-calibration-card` / `0.1.0` / `amd64`.
- Candidate CI run `33161203434` completed successfully.

### Not applicable

- There is no backend, server-side product endpoint, product-unlock call, account, or sign-in flow. Rate-limit/429, persistence concurrency, backend health, SQLite `/data`, and Entra tenant checks do not apply.
- The job does not benefit from an AI feature; no missed AI leverage was found.

## Required repairs before re-verification

1. Add `.factory/claims.json` and one observable demo-based test for every claim-like sentence.
2. Add the one-click isolated sample demo, persistent demo banner/actions, `/demo` entry, `.factory/demo.md`, and desktop screenshot walkthrough.
3. Precache every first-load PWA asset and prove an offline reload immediately after the first visit in a fresh context.
4. Move focus to and announce each new workflow heading, including ready and result states.
5. Supply evidence for the 20-check/90% agreement success measure or narrow the verdict language until validated.
6. Add deployment security/caching rules, a real 404, complete route/social metadata, compliant mobile link targets, and build identity.
7. Use GitHub API release discovery with caching/fallback and reliable macOS architecture selection.
