# Gaze Calibration Card — polish 3 handoff

## Delivered

- Repaired every finding in reviews 1–3 and every still-relevant finding in verifications 1–6. The complete mapping is in [.factory/polish-3.md](polish-3.md).
- Kept the first screen direct: it names the gaze-controlled-pointer check, the people and situations it serves, one-click sample outcome, and three concrete facts.
- Kept the botanical field-guide identity and original assets documented in `.factory/design.md`.
- Made `?demo=1` enter the completed isolated sample. The persistent banner includes **Reset demo** and **Start a new check**. Leaving uses the real, reloadable `/check/#setup` route and removes only demo data.
- Expanded `.factory/claims.json` to 18 claims. Each has one exact `@claim:<id>` test, enforced by `tests/claims.test.ts`.
- Added artifact-backed unsigned-package verification. The test downloads the latest EXE, MSI, Intel Mac app archive, and Apple-silicon app archive, checks GitHub SHA256 digests, then inspects their native signature structures.
- Narrowed checksum copy to the shell behavior its clean-sandbox claim executes. The PowerShell script still rejects corrupt downloads, with its Windows runner retained in CI.
- Registered and proved no-account operation. Removed unregistered advertising and platform-prompt predictions. Defined dwell wherever a new visitor first meets it.
- Added `/check/` metadata, sitemap/service-worker coverage, route tests, and live audit tooling. Route titles, legal links, 404 behavior, focus, 390px targets, 200% text reflow, security headers, privacy, and offline reload are covered.
- Updated the catalog line to: “Check your gaze-controlled pointer across nine targets before a demanding task.”
- Bumped the app and desktop packages to `0.1.4`.

## Verification

The product revision was cloned clean to `/tmp/gaze-calibration-card-clean-0d87dd9`. The final candidate contains only the documented audit/evidence additions after that product revision and was rechecked before release.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 168 packages installed, 169 audited, 0 vulnerabilities. |
| Every command in `.factory/claims.json`, separately | PASS — 18/18. The timed claim completed in 33.2 seconds of command time. |
| `npm run lint` | PASS. |
| `npm test` | PASS — 8/8. |
| `npm run build` | PASS — `dist/app` and `dist/site` created. |
| `npm run test:e2e -- --reporter=line` | PASS — 57 passed, 7 intentional profile skips. |
| Axe integration | PASS — zero serious/critical findings on `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`, desktop and 390px mobile. |
| `npm run test:lighthouse` | PASS — performance/accessibility: 99/100, 100/100, 100/100; median performance 100. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `cargo check --locked --manifest-path src-tauri/Cargo.toml` | PASS. |
| `cargo test --locked --manifest-path src-tauri/Cargo.toml` | PASS — Rust harnesses and doc tests. |

Production budgets: landing JS 1.63 KB gzip, app/demo JS 8.16 KB gzip, site CSS 6.45 KB gzip, and AVIF hero 28.4 KB. No third-party font or script is loaded.

## Live and release evidence

- Canonical URL: <https://gaze-calibration-card.sociobot.in/>
- Direct demo: <https://gaze-calibration-card.sociobot.in/?demo=1>
- Real check: <https://gaze-calibration-card.sociobot.in/check/>
- Release: <https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.4>
- `/opt/fleet/lib/verify-url.sh` result: HTTP 200, 844 ms observed load, correct title/lang/h1/main, no missing alt text, no unlabeled buttons, no console errors.
- `node tools/audit-live.mjs https://gaze-calibration-card.sociobot.in .factory/evidence/polish-3/live` passed. It checked all six public pages, the real 404 status, zero serious/critical Axe findings, zero console errors, demo namespace isolation/reset/exit/reload, same-origin demo requests, 390×844 geometry, 200% reflow, first-visit offline reload, and security headers.
- Live mobile geometry: sample action 358×64px; all three facts finish at y=780 in the 844px viewport.
- Evidence: [.factory/evidence/polish-3/live/live-audit.json](evidence/polish-3/live/live-audit.json) and [.factory/evidence/polish-3/live](evidence/polish-3/live).
- Static deployment used `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site` against the owned `sf-gaze-calibration-card` app. The final build embeds its exact Git commit in the footer.
- GitHub Release `v0.1.4` contains Linux AppImage/DEB/RPM, Windows EXE/MSI, Intel and Apple-silicon Mac DMG/app archives, `SHA256SUMS`, and `latest.json`. `npm run test:unsigned-builds` validates both Windows installers and both Mac app archives from that release.

## Run and verify

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:claims
npm run test:e2e
npm run test:lighthouse
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

To execute every claim exactly as the verifier does, read each `.factory/claims.json` `test` value and run it independently from a clean clone.

## Known gaps and operator action

No accepted finding or product defect remains. Windows and macOS packages are deliberately unsigned and say so before download. Adding trusted publisher signatures later requires owner-held signing certificates; no secret or provider credential is stored in this repository.
