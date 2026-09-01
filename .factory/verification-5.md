# Independent verification 5 — PASS

**Candidate:** `15fd18b563e4b4f2fec30c188077a43c2a38bb4d`
**Live URL:** <https://gaze-calibration-card.sociobot.in/>
**Verified:** 2026-09-01 UTC
**Result:** **PASS**

## First-read and demo check

Cold-opening the live 1440×900 landing page showed the plain headline **“Check your gaze pointer before a demanding task.”** It states that it is for people who rely on eye input, identifies posture, glasses, light, and fatigue changes as the situation, and makes **“Try it with sample data”** the first action. The adjacent text says that it opens a completed check and does not save anything. This satisfies the first-read check.

That action opens `/demo/#result`. The completed nine-target sample, persistent **“Demo — sample data, nothing is saved”** banner, Reset demo control, and Start a new check control were present. In a fresh demo context, the completed sample used only the `demo:gaze-calibration-card:checks:v1` storage key; the real-history marker remained unchanged.

## Required claims checks

From the clean candidate checkout, after `npm ci`, I ran every command listed in `.factory/claims.json` individually through the demo entry point. All 14 passed:

| Claim ID | Check result |
| --- | --- |
| `sample-demo` | PASS — completed sample and separate storage were confirmed. |
| `offline-reload` | PASS — landing and demo reloaded offline after first visit. |
| `local-private` | PASS — demo flow made only same-origin requests and did not request a camera. |
| `nine-targets` | PASS — completed map contained nine readings. |
| `pointer-measures` | PASS — error, dwell, and directional pattern were populated. |
| `pointer-sampling` | PASS — a sample was stored for every target. |
| `keyboard-high-contrast` | PASS — keyboard completion, forced colors, reduced motion, and axe check completed. |
| `report-export` | PASS — downloaded standalone HTML report was inspected. |
| `notes-opt-in` | PASS — notes were absent until approval and retained after approval. |
| `history-limit` | PASS — history stayed at 50 records and clear history emptied it. |
| `release-download` | PASS — recorded GitHub metadata selected the Windows asset and one-hour cache behavior. |
| `installer-checksum` | PASS — controlled checksum mismatch stopped the shell installer before installation. |
| `free-open-source` | PASS — MIT license/source path and no payment action were confirmed. |
| `thirty-second-check` | PASS — automatic nine-target timing met the claimed 24–30 second interval. |

## Local build and functional checks

- `npm ci` — PASS; 169 packages audited, zero reported vulnerabilities.
- `npm test` — PASS; 7 Vitest checks passed.
- `npm run lint` — PASS; TypeScript completed without errors.
- `npm run build` — PASS; created `dist/app` and `dist/site`.
- `npm run test:e2e -- --reporter=line` — PASS; 46 checks passed, with six intentional mobile pointer-path skips. This covered desktop and 390px mobile app/site flows, keyboard completion, pointer measurement/export, state/back navigation, 200% text reflow, demo isolation, all claims, route metadata, target dimensions, and serious/critical axe findings.
- `npm run test:lighthouse` — PASS. Three local mobile runs measured Performance 98/99/99 and Accessibility 100/100/100. LCP was 1,808/1,637/1,773 ms and CLS was 0.00016.

The production output stays within the static budgets: site main JavaScript is 1.63 KB gzip, demo JavaScript is 8.21 KB gzip, site CSS is 6.45 KB gzip, and the 55.3 KB WebP hero remains under the image budget.

The optional local Tauri `cargo check --locked --manifest-path src-tauri/Cargo.toml` could not complete because this disposable worker lacks the system `glib-2.0` development package required by `pkg-config`. This is an environment prerequisite, not a TypeScript/build failure. The published v0.1.2 native DEB was independently downloaded and inspected below.

## Live deployment checks

Freshly built files hash-matched the live deployment for `index.html`, demo/privacy/terms/404 pages, service worker, main JavaScript, demo JavaScript, and stylesheet. The live build therefore matches this candidate; the only candidate change after the v0.1.2 functional tag is the prior handoff documentation.

- Desktop and 390px live demo scans had zero axe serious or critical findings, no console errors, no page errors, visible demo banner, and no horizontal overflow.
- Live `?demo=1` redirected to the isolated sample result. At 200% text size on a 390px viewport, the demo stayed 390px wide.
- A fresh service-worker context visited `/` and `/demo/`, then reloaded each offline. Both remained functional with zero console errors.
- The live demo request log contained only the origin document, demo JavaScript, module-preload script, and stylesheet. No telemetry, camera, or cross-origin request occurred during the completed sample flow.
- Responses for `/`, `/demo/`, `/privacy/`, `/terms/`, `/sw.js`, main JavaScript, and CSS include the expected CSP, `X-Content-Type-Options: nosniff`, strict referrer policy, denied camera/microphone/geolocation/payment/USB permissions, and frame denial. Hashed JavaScript and CSS use `Cache-Control: public, max-age=31536000, immutable`; the service worker uses no-cache. A missing route returned HTTP 404.
- The landing has a title, `lang=en`, one h1, main landmark, skip link, route-specific policy/demo titles, self-hosted assets, and no browser-console errors. Keyboard, reduced-motion, high-contrast, focus, and 44px control checks are included in the passing browser checks.

## Desktop release check

GitHub Release `v0.1.2` targets `d1a048e1541263a6aa52659f31becd8e09aa3016`, the last functional product commit before this documentation-only candidate. It contains Linux AppImage/DEB/RPM, Windows EXE/MSI, x64 and arm64 macOS DMG/app archives, `SHA256SUMS`, and `latest.json`.

I downloaded `Gaze.Calibration.Card_0.1.2_amd64.deb`. Its SHA-256 was `3fd6f1849232ca5de646b8ffb272f099b8d16045bd35e2ad3702d2dcb99e5ff5`, matching `SHA256SUMS`. Package metadata reports `gaze-calibration-card`, version `0.1.2`, architecture `amd64`.

No server-side product endpoint, account flow, payment flow, or sign-in flow is present, so request allowance and tenant checks do not apply.

## Findings

No release-blocking product findings were identified.

- Critical: none.
- High: none.
- Medium: none.
- Low: desktop packages are intentionally unsigned; release and landing guidance explain the platform confirmation step. This is documented operator follow-up, not a functional release blocker.
