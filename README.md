# Gaze Calibration Card

Compare an eye-controlled pointer across nine targets before a demanding task. It is for people who rely on eye input.

The report shows target error, directional drift, and dwell. Pixel bands are device-dependent comparison guides. They are not validated across eye trackers or screen sizes. The app does not certify a setup, replace maker calibration, or provide a diagnosis.

## Try the sample

Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. **Reset demo** restores the bundled sample. **Start a new check** discards demo data.

See [.factory/demo.md](.factory/demo.md) for the sample and isolation details. Every public product claim and its browser test is listed in [.factory/claims.json](.factory/claims.json).

## How it works

The app records ordinary system pointer coordinates during each target.

- The eye-controlled pointer mode visits nine targets automatically in about 30 seconds.
- Keyboard practice supports Tab, Space, and Enter without producing a gaze score.
- Setup notes are stored only after approval.
- Local history keeps at most 50 checks and can be cleared.
- A completed result exports as a standalone HTML support report.

The browser sample requests no camera access and sends no pointer data or telemetry. The download page contacts the GitHub release service only to find current packages and stores that result for one hour.

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

Both installers verify SHA256 before installing or opening the download. Packages are unsigned: on macOS, right-click and choose **Open** if Gatekeeper blocks the app. Windows may show an unknown-publisher confirmation.

## Release and deploy

Tag `v*` or dispatch `.github/workflows/release.yml`. GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`. The pinned Ubuntu 24.04 release path supplies the GTK helper compatibility link and runs AppImage helpers without a FUSE device; reproduce its Linux AppImage check with `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` after installing the listed Tauri prerequisites.

Deploy `dist/site` as the static artifact.

## Privacy and license

The public [privacy](src/site/privacy/index.html) and [terms](src/site/terms/index.html) pages describe local storage and device-dependent limits. Source code is available under the [MIT License](LICENSE). Image provenance is recorded in [.factory/design.md](.factory/design.md).
