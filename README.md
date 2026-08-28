# Gaze Calibration Card

Gaze Calibration Card is a free, private desktop utility that answers one practical question: is an eye-controlled system pointer reliable enough right now? It guides the user through nine targets in about 30 seconds, reports pointer error, directional drift, and dwell reliability, and can save user-approved setup notes or export a standalone support report.

It is intended for people using gaze input, caregivers, assistive-technology practitioners, and community support workers. It is vendor-neutral and does not replace a hardware maker’s calibration or provide a medical diagnosis.

## How it works

The app samples only ordinary pointer coordinates exposed by the operating system. A gaze device that already controls the system pointer requires no special integration. No camera permission, account, network connection, telemetry, or cloud storage is used.

- Eye-controlled pointer mode measures nine targets automatically.
- Mouse/touch mode lets someone explore the flow without gaze hardware.
- Keyboard practice verifies the entire path with Tab, Space, and Enter but deliberately does not claim a gaze score.
- Notes are attached only when “Save these setup notes” is selected.
- History stays in local app storage, is capped at 50 checks, and can be cleared in the app.

## Develop and verify

Requirements: Node.js 22+, npm, Rust stable, and the [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/).

```sh
npm ci
npm run dev          # desktop UI in a browser
npm run dev:site     # download site on port 4173
npm test             # unit tests
npm run test:e2e     # Chromium accessibility + keyboard/mobile flows
npm run build        # exact production build; writes dist/app and dist/site
npm run tauri build  # local desktop package, when platform prerequisites exist
```

The static deploy root is `dist/site`; `index.html` is emitted directly there. Tauri uses `dist/app` as its frontend.

## Install

Published releases are available from the [GitHub Releases page](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases). The landing page detects Windows, macOS architecture, or Linux and selects the matching asset from the release `latest.json` manifest.

```sh
curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh
```

```powershell
irm https://gaze-calibration-card.sociobot.in/install.ps1 | iex
```

Both installers verify SHA256 before opening or placing the download. Version 0.1.0 packages are unsigned: on macOS, right-click and choose **Open** if Gatekeeper blocks the app; Windows may show an unknown-publisher confirmation.

## Release

Push a `v*` tag or run the release workflow manually. GitHub Actions uses Tauri to build `.dmg` files for Apple silicon and Intel macOS, `.msi`/`.exe` for Windows, and `.AppImage`/`.deb` for Linux. The workflow publishes `SHA256SUMS` and `latest.json` after all builds complete.

## Privacy and license

The public [privacy](src/site/privacy/index.html) and [terms](src/site/terms/index.html) pages describe the local-data model and device-dependent limits. Source code is available under the [MIT License](LICENSE). The generated botanical hero is original to this project; generation provenance is recorded in `.factory/design.md` and `assets/src/hero-field-guide.json`.
