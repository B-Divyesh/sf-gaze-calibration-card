# Gaze Calibration Card

Gaze Calibration Card is a free desktop utility for people who rely on eye input. It compares an eye-controlled pointer across nine targets before a demanding task. The result shows pointer error, directional drift, and dwell reliability.

The pixel bands are device-dependent comparison guides. They have not been validated across eye trackers or screen sizes. The app does not certify a setup, replace the device maker’s calibration, or provide a diagnosis.

## Try the sample

Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. The demo uses the separate `demo:gaze-calibration-card:checks:v1` storage key. **Reset demo** restores the bundled sample; **Start for real** discards demo data. The desktop app offers the same sample from **Load sample project**.

See [.factory/demo.md](.factory/demo.md) for the fixture and isolation details. Every public product claim and its browser test is listed in [.factory/claims.json](.factory/claims.json).

## How it works

The app samples ordinary pointer coordinates exposed by the operating system. A gaze device that controls the system pointer needs no special integration.

- Eye-controlled pointer mode measures nine targets automatically in about 30 seconds.
- Mouse or touch mode lets someone explore the same flow.
- Keyboard practice supports Tab, Space, and Enter without producing a gaze score.
- Setup notes are attached only after approval.
- Local history is capped at 50 checks and can be cleared.
- A completed result exports as a standalone HTML support report.

The desktop app requests no camera permission, account, or network connection. It includes no analytics, telemetry, or cloud storage. The static download site contacts only the GitHub Releases API to find current packages and caches that metadata for one hour.

## Develop and verify

Requirements: Node.js 22+, npm, Rust stable, and the [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/).

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:claims
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

Use `npm run dev` for the desktop UI and `npm run dev:site` for the landing site. The production build writes the Tauri frontend to `dist/app` and the static deploy to `dist/site`.

## Install

Published packages are on the [GitHub Releases page](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases). The landing page reads the CORS-enabled GitHub API and selects Windows, Linux, or a detected Mac architecture. If Mac architecture cannot be detected, it offers both builds.

```sh
curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh
```

```powershell
irm https://gaze-calibration-card.sociobot.in/install.ps1 | iex
```

Both installers verify SHA256 before installing or opening the download. Packages are unsigned: on macOS, right-click and choose **Open** if Gatekeeper blocks the app. Windows may show an unknown-publisher confirmation.

## Release and deploy

Tag `v*` or dispatch `.github/workflows/release.yml`. GitHub Actions builds Intel and Apple-silicon macOS packages, Windows packages, Linux AppImage and Debian packages, `SHA256SUMS`, and `latest.json`. The build identifier is embedded from `GITHUB_SHA`.

Deploy `dist/site` as the static artifact. `staticwebapp.config.json` supplies security headers, immutable asset caching, and the 404 response. The service worker precaches the complete generated shell for first-visit offline reloads.

## Privacy and license

The public [privacy](src/site/privacy/index.html) and [terms](src/site/terms/index.html) pages describe local storage and device-dependent limits. Source code is available under the [MIT License](LICENSE). Generated botanical imagery is original to this project; provenance is recorded in [.factory/design.md](.factory/design.md).
