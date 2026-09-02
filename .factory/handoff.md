# Gaze Calibration Card — polish 2 handoff

## Independent verification 7 — PASS (2026-09-02 UTC)

Candidate `c3a134886428c47e8025182c1f5e46d90e33d7fc` **PASSED** independent QA at <https://gaze-calibration-card.sociobot.in/>. The live footer reports `Build c3a134886428` and the live/local `main-Cnk3hwaf.js` SHA-256 matches (`636171e536d6d328c6c0656b4c283cbe6e0a3e930599a654581abd8d2b45019d`).

- All 17 declared claim tests passed; unit tests, TypeScript lint, exact production build, full E2E suite (52 passed; 6 expected skips), unsigned-build test, and Lighthouse (99 performance / 100 accessibility ×3) passed.
- Live desktop and 390px mobile landing/demo had no console/page errors or Axe serious/critical issues. Privacy request logging observed only product-origin requests in demo, plus the permitted GitHub release-metadata request on landing.
- Fresh v0.1.3 AMD64 DEB checksum matched `SHA256SUMS`; package metadata is `gaze-calibration-card` 0.1.3 amd64.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` remains unavailable only because this worker lacks host `glib-2.0` development files. See `.factory/verification-7.md` for complete evidence and the non-defect limitation.

## Delivered

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`; the finding-by-finding matrix is in `.factory/polish-2.md`.
- Made release metadata testing observe its whole public behavior: only same-origin/GitHub requests, cache reuse before one hour, and refetch after expiry.
- Added an executable Windows PowerShell corrupt-download test. It runs the real installer code with controlled network/process helpers and proves checksum failure happens before `Start-Process`.
- Added testable interpretation limits for device-dependent, unvalidated bands and the non-diagnostic/non-calibration limitation, in the landing, result, export, README, and claim registry.
- Added Windows Authenticode and macOS signing-state checks to the desktop release workflow. The release job rejects a publisher-signed package because this product deliberately publishes unsigned builds.
- Standardized visitor vocabulary to gaze-controlled pointer → pointer, target, check, and dwell. The final copy audit is `.factory/copy-audit.md`.
- Bumped the desktop app and release configuration to `0.1.3`.

## Local verification from a clean dependency install

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:claims -- --grep @claim:<each-id>
npm run test:e2e -- --reporter=line
npm run test:lighthouse
npm run test:unsigned-builds
```

Results:

- `npm run lint` — passed.
- `npm test` — 7/7 passed.
- `npm run build` — passed; produces `dist/app` and `dist/site`. Site initial JavaScript gzip: 1.63 KB landing and 8.17 KB demo; CSS gzip: 6.45 KB.
- Each of the 17 declared `@claim:*` commands passed independently. `@claim:release-download` now verifies cache boundary and request origin; `@claim:comparison-bands-limit`, `@claim:not-a-diagnosis`, and `@claim:unsigned-builds` are new.
- `npm run test:e2e -- --reporter=line` — 58 passed across desktop and 390px mobile.
- `npm run test:lighthouse` — passed. Mobile performance: 99, 100, 100. Accessibility: 100, 100, 100.
- `npm run test:unsigned-builds` — passed.
- This Linux worker does not have `pwsh`; `.github/workflows/ci.yml` runs `tests/installer-checksum.ps1` on `windows-latest` after push.

## Deploy and release evidence

- Repair commit: `af68307d7e8591c80b0bd203ff5d24ac53d84edd`. A one-line static accessibility follow-up is `82d9cdb940f6e6502c91d9d84874e68f2f5775c6`; it adds an explicit name to the install-copy control and contains no desktop-app change.
- GitHub **Quality gates** passed for both commits: runs [`33570320624`](https://github.com/B-Divyesh/sf-gaze-calibration-card/actions/runs/33570320624) and [`33570547852`](https://github.com/B-Divyesh/sf-gaze-calibration-card/actions/runs/33570547852). The latter includes the new `windows-installer` job, which passed the actual PowerShell corrupt-download test.
- GitHub **Release desktop apps** run [`33570321910`](https://github.com/B-Divyesh/sf-gaze-calibration-card/actions/runs/33570321910) passed on Ubuntu, Windows, Apple silicon macOS, and Intel macOS. It ran the new Windows Authenticode and macOS signing-state checks.
- Release [`v0.1.3`](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.3) targets the repair commit and contains RPM, DEB, AppImage, MSI, EXE, both DMGs/app archives, `SHA256SUMS`, and `latest.json`.
- Downloaded AppImage checksum: `fef6ad16ab27a13ed013f74c1de4829632b4cc207d8f916eede2a964e0659c79`; it matched both `SHA256SUMS` and `latest.json`.
- Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`. Final Static Web Apps deployment: `654cd6d4-e467-4fe7-bd26-4221801036ae`.
- Cold live verification passed at `https://gaze-calibration-card.sociobot.in/`: 877ms observed load; title, `lang=en`, one h1, main landmark, image alt text, and zero console errors. Screenshot/JSON: `.factory/evidence/polish-2/live/`.
- Live 390px Axe scan reported zero violations (including zero serious/critical). `npx @axe-core/cli` could not locate a system Chrome binary in this worker; the equivalent Playwright Axe scan used the installed Chromium.
- Cold `?demo=1` redirected to `/demo/#result`, showed the persistent demo banner and completed-sample h1, and logged zero console errors. Screenshot: `.factory/evidence/polish-2/live/demo-390.png`.
- Live release discovery now reports `Version 0.1.3 · a matching download is ready.` and its Linux button points to the published v0.1.3 AppImage.

## Operator action

None for product behavior. Desktop packages remain intentionally unsigned. Future signing would require `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; changing that policy also requires changing the tested unsigned-build messaging.
