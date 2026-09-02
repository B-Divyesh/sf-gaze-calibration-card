# Gaze Calibration Card

Compare a gaze-controlled pointer across nine targets before a demanding task. It is for people who rely on eye input.

The report shows target error, directional drift, and dwell. Dwell shows how steadily the pointer stays on each target. Pixel bands are device-dependent and have not been validated across eye trackers or screens. This comparison does not diagnose a condition or replace your device maker’s calibration.

## Try the sample

Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. **Reset demo** restores the bundled sample. **Start a new check** discards demo data.

See [.factory/demo.md](.factory/demo.md) for the sample and isolation details. Claim checks are listed in [.factory/claims.json](.factory/claims.json).

## How it works

The app records ordinary system pointer coordinates during each target.

- The gaze-controlled pointer mode visits nine targets automatically in about 30 seconds.
- Keyboard practice supports Tab, Space, and Enter without producing a gaze score.
- Setup notes are stored only after approval.
- Local history keeps at most 50 checks and can be cleared.
- A completed result exports as a standalone HTML support report.

The browser sample requests no camera access and sends no pointer data or telemetry. The download page reads GitHub release metadata to select current packages. It caches that metadata for one hour.

## Develop and verify

Requirements: Node.js 22+, npm, Rust stable, and the [Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/).

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

Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page. The production build writes the desktop files to `dist/app` and the website files to `dist/site`.

## Install

Published packages are on the [GitHub Releases page (external)](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases). The landing page selects Windows, Linux, or a detected Mac architecture. If Mac architecture cannot be detected, it offers both builds.

```sh
curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh
```

```powershell
irm https://gaze-calibration-card.sociobot.in/install.ps1 | iex
```

The shell installer verifies SHA256 before installing or opening the download. The Windows installers and macOS app bundles are unsigned.

For macOS installation steps, see [Apple’s guidance for opening an unnotarized app (external)](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac).

## Release and deploy

Tag `v*` or dispatch `.github/workflows/release.yml`. GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`.

The Ubuntu release job supplies the GTK helper compatibility link. It runs AppImage helpers without a FUSE device.

After installing Tauri prerequisites, run `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` to reproduce the Linux AppImage check.

Deploy `dist/site` as the static artifact.

## Privacy and license

The public [privacy](src/site/privacy/index.html) and [terms](src/site/terms/index.html) pages describe local storage and device-dependent limits. Source code is available under the [MIT License](LICENSE). Image provenance is recorded in [.factory/design.md](.factory/design.md).
