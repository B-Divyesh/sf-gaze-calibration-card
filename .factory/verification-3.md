# Independent verification 3 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `14265aa43069c44a11b08a37f69fc7cbd2e6d149`
- Live URL: <https://gaze-calibration-card.sociobot.in>
- Verified: 2026-09-01 UTC
- Work order: `gaze-calibration-card-verify-3`

The candidate provides the intended local nine-target pointer comparison, a one-click isolated sample, local opt-in notes/history, and a standalone support report. The deployed static assets match this candidate exactly. It is not acceptable because the full browser suite fails a declared claim test. The claims contract makes any failed claim test release-blocking.

## First read and demo

A cold 1440×900 visit said: **“Check your gaze pointer before a demanding task.”** It says it is for people who rely on eye input, identifies posture, glasses, light, and fatigue changes, and gives **“Try it with sample data”** with the immediate result **“Opens a completed check; nothing is saved.”** This clearly states what it does, for whom, and what to click first.

That action opens `/demo/` with the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, and Start a new check. The completed sample contains nine readings, 42 px error, 91% dwell, and a directional result. The demo entry and first-read gates pass.

## Release-blocking finding

### Critical — declared offline-reload claim is not stable in the full suite

`npm run test:e2e -- --reporter=line` ran 48 tests. Its desktop execution of declared claim `@claim:offline-reload` failed at `tests/e2e/claims.spec.ts:69`:

```
Expected: []
Received: ["Failed to load resource: net::ERR_FAILED"]
```

The error is recorded in `test-results/claims--claim-offline-relo-0789b-mplete-site-after-one-visit-desktop/error-context.md`. The runner’s final `.last-run.json` records one failed test. A direct single-claim repeat passed, and a fresh live service-worker repeat with the release-metadata response fixture passed with no errors; neither result removes the full-suite failure. The product must make this declared check reliable in the complete suite before acceptance.

## Test and build evidence

| Check | Result |
| --- | --- |
| Initial checkout | PASS — clean tree at the requested candidate commit |
| `.factory/claims.json` | PASS — present with 14 declared claims; full claim entry point was started first after `npm ci` |
| `npm run test:claims -- --grep @claim:history-limit` | PASS — 1/1 |
| `npm run test:claims -- --grep @claim:offline-reload` | PASS — 1/1 direct repeat |
| `npm test` | PASS — 6/6 Vitest tests |
| `npm run lint` | PASS — TypeScript type check |
| `npm run build` | PASS — outputs `dist/app` and `dist/site` |
| `npm run test:e2e -- --reporter=line` | **FAIL** — 1 declared offline-reload claim failure in the 48-test suite |
| `cargo check --locked --offline --manifest-path src-tauri/Cargo.toml` | NOT RUN — required `tauri` crate was not in this isolated worker’s local cache; external dependency retrieval was outside the permitted resource scope |
| `cargo test --locked --offline --manifest-path src-tauri/Cargo.toml` | NOT RUN — blocked by the same unavailable dependency |

Production asset sizes remain within the static budget: site main JavaScript is 1.61 KB gzip, demo JavaScript is 8.19 KB gzip, site CSS is 6.24 KB gzip, app JavaScript is 8.45 KB gzip, and app CSS is 4.44 KB gzip.

## Product exercise

- Completed keyboard practice through all nine targets with Space; the result reports keyboard completion without a gaze score.
- Completed a mouse/touch run, produced a measured result, and exported the standalone HTML report.
- Confirmed corrupted local history JSON recovers to the usable empty history state without a console error.
- Confirmed Escape stops a pointer check with “No result was saved”; Start again returns to target 1.
- Confirmed the 390 px local app view has no horizontal overflow and its first keyboard focus has a visible 3 px solid outline.

## Live deployment, privacy, accessibility, and cache checks

- SHA-256 matched between fresh `dist/site` and live `/index.html`, `/assets/main-B3CHey_1.js`, `/assets/style-g4F_idTj.css`, `/assets/demo-BK-TpIQS.js`, and `/sw.js`.
- Live `/`, `/demo/`, `/privacy/`, and `/terms/` return 200; a nonexistent route returns the designed 404 with HTTP 404.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, `X-Frame-Options: DENY`, and a permissions policy that disables camera, microphone, geolocation, payment, and USB. Hashed assets are immutable for one year; `sw.js` is no-cache/no-store.
- In a fresh live demo context, reset and report export made only requests to `https://gaze-calibration-card.sociobot.in`; camera access was not requested, and there were no page or console errors.
- A live offline repeat, with the documented release-metadata response supplied locally, installed the service worker, reloaded both landing and demo offline, and showed the expected headings with no errors.
- Axe found zero serious or critical findings on live `/demo/`, `/privacy/`, and `/terms/` at desktop and 390 px. Each had one h1, one main landmark, no missing image alt text, no horizontal overflow, and no errors. Landing-page axe checks at both widths also had zero serious/critical findings and no errors when its documented release-metadata response was supplied locally.
- No `verify-url.sh` exists in this repository; the equivalent browser checks above covered title, language, h1, main, alt text, focus, and errors.

## Not applicable

This static product has no server-side product endpoint, account, payment, product-unlock call, database, or sign-in flow. Request allowance/429 behavior, persistence concurrency, health checks, SQLite `/data`, and Entra tenant checks do not apply. The product does not need an AI feature for the stated job.

## Required next step

Make `@claim:offline-reload` pass consistently when the entire Playwright suite runs, then rerun the complete claim and browser suites from a clean checkout.
