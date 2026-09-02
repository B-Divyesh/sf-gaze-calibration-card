# Gaze Calibration Card — repair handoff

## Status: repaired

This repair starts from verifier report commit `a58a78c43a028489b84907eb15c92a31dbf9ff3d` for candidate `934bd97b906974ae82810cf0f8de8adf0c9de823`.

## What changed

- Moved the copy-audit production build out of Vitest's five-second test body. `npm test` now runs the cross-platform `pretest` build helper first with a deterministic copy-audit build id; the audit test only inspects that completed output.
- Added `@regression:cold-copy-audit`, which locks the npm lifecycle and prevents the audit test from reintroducing a child-process build.
- Removed the global Playwright page `beforeEach` from the site suite. The source-only deployment-config assertion no longer creates a mobile browser context.
- Reworked the release-download test so each simulated platform owns and closes one context before the next opens. A runtime regression assertion proves the maximum is one context while it exercises Windows cache expiry plus Linux, Apple-silicon Mac, Intel Mac, and unknown-Mac fallbacks.

No product behavior, public copy, privacy policy, desktop package, or deployment class changed.

## Verification

### Clean Node install/cache

`npm ci --cache <new empty temporary directory>` installed 168 packages with 0 vulnerabilities.

- `npm test` — PASS: pretest production build plus 10 Vitest tests. The copy-audit assertion took 50 ms after the build completed.
- `npm run lint` — PASS.
- `npm run build` — PASS; produced `dist/app` and `dist/site`.
- `npm run test:e2e -- --reporter=line` — PASS twice after the repair, including the final run with the one-context assertion: 64 passed, 8 intentional platform-path skips, 0 failures.
- `npm run test:claims -- --reporter=line` — PASS: all 18 registered demo-based claims. The focused `@claim:release-download` regression also passed after the final isolation assertion.
- `npm run test:lighthouse` — PASS: mobile scores 100/100 performance/accessibility in all three runs.
- `npm run test:unsigned-builds` — PASS: release `v0.1.6` Windows EXE/MSI and both macOS bundles matched their digests and contained no publisher signature.
- `npm audit --audit-level=high` — PASS: 0 vulnerabilities.

The browser suite covers desktop and 390 px mobile, keyboard-only completion, reduced motion/high contrast, axe serious/critical violations, demo isolation, same-origin privacy, first-visit offline reload/reset, response policy, and release selection.

### Clean Rust caches

The disposable verifier image initially lacked the normal Linux Tauri development headers, so I installed `libglib2.0-dev`, `libwebkit2gtk-4.1-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`, and `libxdo-dev` locally for verification only. With independently new `CARGO_HOME` and `CARGO_TARGET_DIR` directories for each command:

- `cargo check --locked --manifest-path src-tauri/Cargo.toml` — PASS.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` — PASS: library, binary, and doc harnesses (the crate defines 0 Rust tests).

## Deployment and live verification

Deployed production `dist/site` with Azure Static Web Apps CLI to `sf-gaze-calibration-card` on 2026-09-02 UTC. The public custom domain is serving repair commit `04a0669c1839e300a7f99215009a4daa0d0e792a` (`Build 04a0669c1839`).

- Live audit: [https://gaze-calibration-card.sociobot.in](https://gaze-calibration-card.sociobot.in) passed the landing, check, demo, privacy, terms, and 404 routes with 0 serious/critical axe findings and 0 console errors.
- At 390×844, the first-screen facts ended at y=815, the primary action was 358×64 px, shared navigation remained usable, and 200% text had no horizontal overflow.
- The live demo kept its real-history marker while resetting, left demo into a reloadable real check, made only same-origin demo requests, and passed both first-visit offline landing reload and offline demo reset.
- Response policy passed: unknown route is HTTP 404; CSP includes `frame-ancestors 'none'` and allows only self plus the GitHub Releases API; `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY` are present.
- Identity matched byte-for-byte: `dist/site/index.html` and the deployed landing both SHA-256 to `10e3b9d0fffcae55b93b4f4a9c3ca951470ebd04556106083de0cf3349dd47c1`; the deployed landing module both contains `04a0669c1839` and matches local SHA-256 `0145014b23824cb1529437763f6d9cdcbf32cb4de0f140dd3454915d306c09c1`.

## Known gaps / operator action

None for this repair. The existing v0.1.6 desktop artifacts remain intentionally unsigned as documented; no native-app source changed, so a new package release is not required for this test-infrastructure repair.
