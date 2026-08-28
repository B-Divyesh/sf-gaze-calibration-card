# Gaze Calibration Card v0.1.0 — handoff

## What shipped

- A Tauri 2 desktop app with a roughly 30-second, nine-target gaze-pointer check.
- Three explicit paths: eye-controlled system pointer, mouse/touch trial, and keyboard-only practice. Keyboard practice never presents itself as a gaze score.
- Local calculations for mean target error, horizontal/vertical drift, dwell reliability, and reliable/borderline/recalibrate verdicts with visible thresholds.
- Optional posture, glasses, lighting, and free-text notes. Notes are persisted only with explicit approval; history can also be disabled or cleared.
- A standalone, locally generated HTML support report with inputs, measurements, setup context, thresholds, and diagnostic limitations.
- First-class stopped, empty-history, offline, no-pointer-sample, and storage-failure-safe behavior.
- A responsive static download site at `dist/site`, OS/architecture detection, release-manifest lookup, SHA256-checking shell and PowerShell installers, privacy and terms pages, and an offline service worker.
- A product-specific botanical field-guide system and original nine-seed/fern hero image. Source and generation provenance are in `assets/src/` and `.factory/design.md`; production image sizes are 28 KB AVIF and 54 KB WebP.
- GitHub Actions CI and a release matrix for Linux x86_64, Windows x86_64, macOS Apple silicon (`macos-latest`), and macOS Intel (`macos-15-intel`, the current supported Intel label). The release also emits `SHA256SUMS` and `latest.json`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
cargo check --manifest-path src-tauri/Cargo.toml
```

Static deployment uses the exact command `npm run build:site` and deploys `dist/site` (with `index.html` at that root). Tauri packages use `npm run tauri build`; platform binaries are intentionally built only on GitHub-hosted runners.

Verified on 2026-08-28:

- `npm test`: 6/6 unit tests passed.
- `npm run test:e2e`: 9 passed, 1 intentionally skipped (the desktop pointer simulation is not duplicated on mobile); covers app/site desktop and mobile, axe serious/critical checks, keyboard completion, measured pointer completion, report download, policies, and console errors.
- `npm run build`: passed; app initial JS 19.82 KB and CSS 15.19 KB uncompressed, site JS 2.83 KB and CSS 7.29 KB uncompressed.
- `cargo check --manifest-path src-tauri/Cargo.toml`: passed.
- `npm audit`: 0 vulnerabilities.
- Lighthouse mobile production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.2 s, CLS 0, total blocking time 0 ms.

## Release

- Version/tag: `v0.1.0`.
- Workflow: `.github/workflows/release.yml`.
- Release page: <https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.0>
- Manifest: <https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/latest/download/latest.json>
- `latest.json` includes the release URL and SHA256 for each platform choice; `SHA256SUMS` covers every uploaded native artifact.
- The site ships a same-origin copy of the verified release manifest because GitHub’s release-asset CDN does not allow browser CORS reads; the shell and PowerShell installers still consume the canonical Release copy directly.
- All four platform build jobs completed successfully in Actions run `33159692181`; the corrected metadata-only publication run `33160751499` completed successfully.
- Release verification downloaded all nine native assets and passed every line of the published `SHA256SUMS`. An independent re-download of the Linux `.deb` matched manifest hash `0a3035f8b34833ed5906c5a06a8c05961cfe1f01058dc07273a8a5128d00ebb5`.

## Known gaps

- The pixel thresholds are intentionally transparent and useful for comparisons on the same display, but have not been validated against 20 repeated checks on every eye-tracker model. A physical-device validation study is the next product step.
- There is no direct vendor SDK or raw camera integration. The app measures the operating-system pointer, which keeps it private and vendor-neutral but inherits the driver’s behavior.
- Linux ARM64 is not included in v0.1.0.
- The builds are unsigned, so operating systems may show publisher warnings.
- On a future release, update `public/latest.json` from the generated release manifest before deploying the site (or add an equivalent same-origin deployment sync).

## Needs operator action

- Deploy `dist/site` at `https://gaze-calibration-card.sociobot.in`; do not change DNS or infrastructure from this repository.
- For signed macOS releases, configure `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`, then add signing/notarization inputs to the workflow.
- For signed Windows releases, configure `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`, then add certificate import/signing steps to the workflow.
- The repository secret `FACTORY_RELEASE_TOKEN` was configured for release publication because the default Actions token is read-only under the current repository policy. Rotate or replace it according to the factory’s credential policy.
