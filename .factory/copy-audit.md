# Copy audit — polish 4

Reviewed 2026-09-02. This audit records the current visitor-facing landing and README copy. Counts treat URLs, numbers, hyphenated terms, and code tokens as one word. No visitor sentence exceeds 22 words or uses a banned marketing word.

The only declared dynamic values are `{release version}` in release metadata and `{build id}` in the footer. The test in `tests/copy-audit.test.ts` builds the site, checks every static landing string below in the generated output, and checks those two dynamic templates separately.

## Landing, header, footer, and conditional states

<!-- audit-landing:start -->
- Skip to main content
- Gaze Calibration Card
- Demo
- How it works
- Privacy
- Source on GitHub (external)
- Nine-target pointer comparison
- Check your gaze-controlled pointer before a demanding task
- For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.
- Try it with sample data
- Opens a completed check; nothing is saved
- Download the app
- Detecting your system…
- No camera access or account
- Sample reloads offline after first visit
- Free and open source
- Checking published desktop builds…
- Install another way
- curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh
- Copy install command
- The Windows installers and macOS app bundles are unsigned.
- Pressed fern around nine copper seeds arranged as calibration points
- The nine seeds mirror the app’s target layout.
- On this device
- Pointer processing stays in the app
- Comparison only
- Results are comparison guides
- Keyboard access
- Keyboard and high-contrast paths
- No telemetry
- No pointer data is sent
- Desktop walkthrough
- See the complete check before installing
- Setup screen for choosing eye pointer, mouse, touch, or keyboard input
- 1. Note the setup.
- Save details only when you choose.
- Nine-target check showing a gold target on a paper-like field
- 2. Visit nine targets.
- The app records pointer positions during each target.
- Completed sample with target error, drift, pointer steadiness, and a nine-target map
- 3. Compare the pattern.
- Dwell shows how steadily the pointer stays on each target.
- Compare the pointer in three steps
- Use the pointer your gaze system already controls.
- Compare this check with your own comfortable sessions.
- Note the circumstances
- Optionally record posture, lenses, room light, or a monitor adjustment.
- Visit nine targets
- The app records local pointer positions while each target settles.
- Compare the pattern
- Review target error, drift direction, dwell, and next steps.
- What the report shows
- The report shows measurements, not a pass
- Pixel bands are device-dependent and have not been validated across eye trackers or screens.
- Directional drift in plain words
- Dwell for each target
- Standalone HTML report for support
- Example check complete
- Pattern within guide
- Error
- 42 px
- Dwell
- 91%
- Pattern
- No drift
- Example only · compare results on your own device
- Privacy and limits
- The app never requests camera access
- It records local pointer positions. The browser sample sends no pointer data or telemetry.
- This comparison does not diagnose a condition or replace your device maker’s calibration.
- Read the privacy note →
- Try the sample first
- Review a completed check now
- Demo data uses separate browser storage
- Compare pointer patterns before a demanding task.
- Terms
- Releases on GitHub (external)
- Built by Param Factory ·
- Downloads are being published. Open the releases page to check again.
- Mac architecture could not be detected:
- Apple silicon
- Intel
- Copied
- Select and copy the install command shown above.
<!-- audit-landing:end -->

The release status is intentionally represented as `Version {release version} · a matching download is ready.` The build footer is intentionally represented as `Built by Param Factory · Build {build id}`. The release-download claim drives the branch-specific output with a recorded release fixture.

## README sentences and headings

<!-- audit-readme:start -->
- Gaze Calibration Card
- Compare a gaze-controlled pointer across nine targets before a demanding task.
- It is for people who rely on eye input.
- The report shows target error, directional drift, and dwell.
- Dwell shows how steadily the pointer stays on each target.
- Pixel bands are device-dependent and have not been validated across eye trackers or screens.
- This comparison does not diagnose a condition or replace your device maker’s calibration.
- Try the sample
- Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check.
- The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history.
- **Reset demo** restores the bundled sample.
- **Start a new check** discards demo data.
- See [.factory/demo.md](.factory/demo.md) for the sample and isolation details.
- Claim checks are listed in [.factory/claims.json](.factory/claims.json).
- How it works
- The app records ordinary system pointer coordinates during each target.
- The gaze-controlled pointer mode visits nine targets automatically in about 30 seconds.
- Keyboard practice supports Tab, Space, and Enter without producing a gaze score.
- Setup notes are stored only after approval.
- Local history keeps at most 50 checks and can be cleared.
- A completed result exports as a standalone HTML support report.
- The browser sample requests no camera access and sends no pointer data or telemetry.
- The download page reads GitHub release metadata to select current packages.
- It caches that metadata for one hour.
- Develop and verify
- Requirements: Node.js 22+, npm, Rust stable, and the [Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/).
- Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page.
- The production build writes the desktop files to `dist/app` and the website files to `dist/site`.
- Install
- Published packages are on the [GitHub Releases page (external)](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases).
- The landing page selects Windows, Linux, or a detected Mac architecture.
- If Mac architecture cannot be detected, it offers both builds.
- The shell installer verifies SHA256 before installing or opening the download.
- The Windows installers and macOS app bundles are unsigned.
- For macOS installation steps, see [Apple’s guidance for opening an unnotarized app (external)](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac).
- Release and deploy
- Tag `v*` or dispatch `.github/workflows/release.yml`.
- GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`.
- The Ubuntu release job supplies the GTK helper compatibility link.
- It runs AppImage helpers without a FUSE device.
- After installing Tauri prerequisites, run `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` to reproduce the Linux AppImage check.
- Deploy the website files in `dist/site`.
- Privacy and license
- The public [privacy](src/site/privacy/index.html) and [terms](src/site/terms/index.html) pages describe local storage and device-dependent limits.
- Source code is available under the [MIT License](LICENSE).
- Image provenance is recorded in [.factory/design.md](.factory/design.md).
<!-- audit-readme:end -->

## Terminology

| Concept | Required term | Used in product copy |
| --- | --- | --- |
| Measured cursor | gaze-controlled pointer on first mention, then pointer | landing, app, README |
| Measurement position | target | landing, app, report, README |
| Activity | check | landing, app, README |
| Hold measurement | dwell, defined as pointer steadiness on a target | landing, app, report, README |
| Saved results | history | app, privacy, README |
| Bundled example | sample check or sample data | landing, app, README |

## Audit evidence

- `npm test -- --run tests/copy-audit.test.ts` builds `dist/site` with a deterministic build id and verifies the static strings above.
- `npm run test:claims -- --grep @claim:release-download` verifies Windows, Linux, Apple-silicon Mac, Intel Mac, and unknown-Mac release output with a one-hour cache boundary.
