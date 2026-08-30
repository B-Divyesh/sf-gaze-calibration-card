# Independent verification 2 — Gaze Calibration Card

**Verdict: PASS**

- Candidate: `6871ec701c36e3604390d581f6462ea14b567a8e`
- Live URL: <https://gaze-calibration-card.sociobot.in>
- Verified: 2026-08-30 UTC
- Work order: `gaze-calibration-card-verify-2`

The repaired candidate meets the researched brief: it provides a local nine-target pointer comparison, reports directional error/dwell/pattern, keeps opt-in notes and a 50-check history locally, offers a one-click isolated demo, and exports a support-friendly HTML report. It does not present unvalidated readiness or medical conclusions. The live static deployment exactly matches the fresh candidate build.

## First-read and demo gate

A cold 1440×900 visit said: “Check your gaze pointer before a demanding task.” It immediately identifies the audience (“people who rely on eye input”), names posture/glasses/light/fatigue changes, and offers **Try it with sample data** with the result (“Opens a completed check; nothing is saved”). The page also plainly states no camera/account, offline-after-installation, and free/open-source facts.

That action opens `/demo/` with the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real actions. The sample has a completed nine-reading map and uses the separate demo storage namespace. This passes the first-read and one-click sandbox requirements.

## Required claims gate

`.factory/claims.json` is present and contains 13 claims. From the clean checkout, after `npm ci`, I ran every listed command separately via the shipped demo entry point; all passed:

`sample-demo`, `offline-reload`, `local-private`, `nine-targets`, `pointer-measures`, `keyboard-high-contrast`, `report-export`, `notes-opt-in`, `history-limit`, `release-download`, `installer-checksum`, `free-open-source`, and `thirty-second-check`.

The individual command form was `npm run test:claims -- --grep @claim:<id>`. The full ordered loop reached and passed the final timed claim; no command exited non-zero.

## Clean-build and test evidence

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 64 packages, 0 reported vulnerabilities |
| `npm run lint` | PASS |
| `npm test` | PASS — 6/6 |
| `npm run build` | PASS — app and site production builds written to `dist/` |
| `npm run test:e2e` | PASS — full 40-test suite completed |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS after installing the release workflow’s documented Linux packages |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — 0 Rust tests defined, all harnesses pass |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |

Production web assets are within budget: site landing JS is 3,668 B raw (+711 B module-preload helper), demo-only JS is 21,428 B raw, and CSS is 25,010 B raw. App JS/CSS are 22.09/15.92 KB raw. No third-party fonts or scripts are loaded.

## Product exercise

- Completed the normal nine-target keyboard path with Space. Result: “Keyboard path complete”; focus moved to that result heading.
- Exported `gaze-check-2026-08-30.html`; its standalone HTML contains the pointer-comparison report.
- Set corrupt local history JSON, reloaded, and recovered to a usable setup without page errors.
- Started mouse/touch mode and pressed Escape; the app showed “No result was saved.”
- The bundled claim suite separately covers automatic 30-second completion, opt-in notes, 50-record trimming, boundary scoring, demo reset/leave isolation, and export content.

## Live deployment, privacy, and accessibility

- The live footer build id is `6871ec701c36`, and SHA-256 of live `index.html`, main JS, CSS, hero AVIF, and `sw.js` matches the fresh `dist/site` output exactly.
- A cold live request had no page or console errors. The request log contained same-origin assets plus the documented `api.github.com` Releases metadata request used solely to select a platform download; no camera API, user pointer data, analytics, advertising, authentication, or telemetry request occurred. The demo flow’s claim test permits only same-origin requests and passed.
- Root headers include CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, HSTS, `nosniff`, strict referrer policy, and a permissions policy disabling camera/microphone/geolocation/payment/USB. Hashed assets are immutable; `sw.js` is no-cache/no-store. A nonexistent live route returns HTTP 404.
- In a fresh context, the live service worker cached hashed JS, CSS, and AVIF on first visit. With the context offline, reload displayed the landing h1 with no console errors.
- Axe found **0 serious/critical** violations on `/`, `/demo/`, `/privacy/`, and `/terms/` at desktop and 390px mobile. Both widths had one h1/main and no horizontal overflow. The mobile skip link has a visible 3px focus ring. The normal landing request had no console/page errors.

## Release and desktop package evidence

GitHub Release `v0.1.1` is present with Linux AppImage, Debian/RPM, Windows MSI/EXE, Intel/Apple-silicon DMGs and app archives, plus `SHA256SUMS` and `latest.json`. The landing page resolved its Linux download through the GitHub Releases API.

I streamed the published Debian asset and verified SHA-256:

```
expected 1b3bc387a9e7b5dedc2dc64be9b4891382a87079b5a3a9066eeaab42aaec1f2e
actual   1b3bc387a9e7b5dedc2dc64be9b4891382a87079b5a3a9066eeaab42aaec1f2e
```

The local Tauri Debian production bundle also completed and reports `gaze-calibration-card` 0.1.1 / amd64 with the expected WebKit/GTK dependencies.

The candidate is four documentation/evidence changes after the `v0.1.1` source tag (`28a05ab`); it contains no application, site, Tauri, or workflow changes. Therefore the verified release binary remains the applicable desktop build, while the independently hash-matched static deployment identifies this exact candidate.

## Defects by severity

No product defects found.

### Environment note — non-blocking

In this disposable container, `CI=1 npm run tauri build` is rejected by Tauri CLI because this CLI expects the boolean value `true`/`false`; GitHub Actions supplies `CI=true`. With `CI=true`, the local Debian bundle succeeds. The local AppImage step reaches `linuxdeploy` but exits `failed to run linuxdeploy` after compiling the production binary. The published AppImage was successfully produced by the repository’s GitHub Actions release workflow and is listed in the verified release; this container limitation does not reproduce on the release platform. It is recorded for traceability, not classified as a candidate defect.

## Not applicable

There is no backend/server-side product endpoint, product-unlock endpoint, sign-in, database, payment flow, or AI feature. Rate-limit/429, persistence concurrency, health endpoint, Entra tenant, and SQLite `/data` checks do not apply.
