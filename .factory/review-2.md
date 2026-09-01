# Adversarial first-read review 2 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `990fbcffc213966b7901b5db0fa6506c4a2d5313`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Reviewed: 2026-09-01 UTC
- Contexts: fresh Chromium at 390×844 and 1440×900; fresh demo context; clean dependency install
- Findings: 3 blocking, 0 minor

This is not accepted. The cold landing, sample flow, routing, accessibility checks, build, and declared commands work. Three findings from review 1 remain only partly repaired: two declared claims are not proven by their tests, several public statements still have no claim entry, and the required product vocabulary is still inconsistent.

## Cold first read before scrolling

### 390×844

In my own words: this helps people who use eye input decide whether today's pointer behaviour has changed before an important task. I should click **Try it with sample data**; it opens a completed check and does not save anything.

All three answers are supplied before scrolling by:

- What: “Check your gaze pointer before a demanding task”.
- Who and situation: “For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.”
- First action and result: “Try it with sample data” / “Opens a completed check; nothing is saved”.

The three facts finish at y=734 in the 844px viewport. The primary control is 358×64px. This gate passes.

### 1440×900

The same job, audience, action, and three facts are visible together. This gate passes.

## Findings

### Blocking

#### F-1-4 — Declared claim tests still do not prove their complete claims

This finding recurs. All 14 declared commands exit successfully, but two tests still leave a material part of their listed claim unobserved.

| Claim and exact public wording | Evidence of incomplete test | Why this fails verification | Concrete fix |
| --- | --- | --- | --- |
| `installer-checksum`: “The shell and PowerShell installers verify SHA256 before using a download.” | `tests/e2e/claims.spec.ts` executes `sh public/install.sh` against a corrupt fixture. For `install.ps1`, it only searches the source text for `Get-FileHash` and the error phrase. Neither `pwsh` nor `powershell` is installed in this worker. | A removed comparison, an early `Start-Process`, or a malformed PowerShell branch would still pass. The prior review explicitly required each installer to be executed against a mismatch. | Run `install.ps1` in a Windows or PowerShell test job with controlled manifest/download fixtures. Assert that it throws before `Start-Process` and removes or does not open the corrupt file. Keep the shell test separately. |
| `release-download`: “The landing page selects a published platform build from GitHub release metadata” and README: “The download page contacts the GitHub release service only to find current packages and stores that result for one hour.” | The test intercepts a fixture, verifies platform selection, and verifies one reload uses the cache. It never advances time to the one-hour boundary, verifies expiry/refetch, or records the complete landing request set. | An infinite cache, a five-minute cache, or an extra cross-origin request would pass the current test despite contradicting the public statement. | Freeze/advance `Date.now()` to just below and just above one hour; assert cache reuse then one refetch. Record all landing requests and allow only the site origin plus `api.github.com`. |

The command results are not failures; the listed claims are incompletely tested. Per the claims contract, that remains blocking.

#### F-1-5 — Claim-like public statements remain outside `.factory/claims.json`

This finding recurs. The registry has no entry for these visitor-facing statements, and no existing claim is an exact test of them:

| Exact quote and location | Why a first-time visitor could rely on it | Concrete fix |
| --- | --- | --- |
| Landing, report section: “Pixel bands are device-dependent and have not been validated across eye trackers or screens.” | This is an important interpretation limit. A visitor needs it to be maintained everywhere the bands are shown. | Add a `comparison-bands-limit` entry and test the result screen and exported report display the exact qualified limitation, or reduce the landing text to a non-claim label. |
| Landing, privacy section: “It does not diagnose a condition or replace your device maker’s calibration.” | This is a reliance/safety limitation, not decorative copy. | Add a `not-a-diagnosis` entry that verifies each result and export present the comparison-only limitation and no diagnostic/pass conclusion, or rewrite to the observable statement “This result is labelled a comparison, not a diagnosis.” |
| Landing install details: “macOS and Windows builds are unsigned. Your system may ask you to confirm the publisher.” | Installation safety and signing state affect whether a person decides to download. | Add a release-artifact/signing check for the published Windows and macOS builds, or remove the assertion and link to the release instructions. |
| README opening: “Pixel bands are device-dependent comparison guides. They are not validated across eye trackers or screen sizes. The app does not certify a setup, replace maker calibration, or provide a diagnosis.” | These repeat the same unregistered interpretation and safety promises. | Cover them with the two entries above, using the same wording across landing, app, export, and README. |
| README install section: “Packages are unsigned: on macOS, right-click and choose **Open** if Gatekeeper blocks the app. Windows may show an unknown-publisher confirmation.” | This extends the unregistered signing promise with platform-specific outcome guidance. | Verify published signing state on both platforms, or move the unverified platform behaviour out of public product copy. |

`local-private`, `offline-reload`, and `free-open-source` cover nearby but different promises; they do not make these statements registered claims. The review instruction requires one entry and observable test for each claim-like sentence.

#### F-1-8 — Product terminology is still not consistent

This finding recurs. The required terminology table says the measured cursor is a **pointer**, measurement positions are **targets**, and the activity is a **check**. The live app and source still introduce competing words:

| Exact quote/location | Why it is confusing | Concrete rewrite |
| --- | --- | --- |
| Landing h1: “Check your **gaze pointer** …”; README: “Compare an **eye-controlled pointer** …”; app setup privacy strip: “the system pointer your **gaze device** already controls” | Three names are used for the same measured cursor. | Define once as “gaze-controlled pointer”, then use “pointer” everywhere. |
| App setup: “Visit nine **marks**.”; result map: “Screen field · **per-mark** mean error”; app/result copy: “nine-point map”; elsewhere: “nine **targets**”. | A visitor cannot tell whether a mark, point, and target are distinct parts of the check. | Use “target” in each location: “Visit nine targets”, “per-target mean error”, and “nine-target map”. |
| App setup: “dwell **steadiness**”; result, report, and README: “dwell **reliability**” / “dwell”. | The metric has three labels, despite the required term being “dwell”. | Label the metric “Dwell” and describe its value in the adjacent explanatory sentence if needed. |

This is particularly harmful in an assistive-input product: the user must not spend time decoding whether controls and report fields refer to the same measurement.

## Copy audit

Word counts treat hyphenated words, numerals, URLs, and code tokens as one word. No landing or README sentence exceeds 22 words. The terminology flags above are the copy findings; `Tauri` appears only in the developer requirements and is retained there as the concrete build dependency.

### Landing page: sentences and sentence-like facts

| Words | Copy |
| ---: | --- |
| 3 | Nine-target pointer comparison |
| 8 | Check your gaze pointer before a demanding task |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 5 | Try it with sample data |
| 7 | Opens a completed check; nothing is saved |
| 3 | Download the app |
| 3 | Download for Linux |
| 5 | No camera access or account |
| 6 | Sample reloads offline after first visit |
| 4 | Free and open source |
| 7 | Version 0.1.2 · a matching download is ready. |
| 3 | Install another way |
| 3 | Copy install command |
| 6 | macOS and Windows builds are unsigned. |
| 9 | Your system may ask you to confirm the publisher. |
| 8 | The nine seeds mirror the app’s target layout. |
| 3 | On this device |
| 6 | Pointer processing stays in the app |
| 2 | Comparison only |
| 4 | Results are comparison guides |
| 2 | Keyboard access |
| 4 | Keyboard and high-contrast paths |
| 2 | No telemetry |
| 4 | No telemetry or advertising |
| 2 | Desktop walkthrough |
| 6 | See the complete check before installing |
| 3 | Note the setup |
| 6 | Save details only when you choose. |
| 3 | Visit nine targets |
| 8 | The app records pointer positions during each target. |
| 3 | Compare the pattern |
| 7 | Review error, dwell, drift, and next steps. |
| 3 | How it works |
| 6 | Compare the pointer in three steps |
| 8 | Use the pointer your gaze software already controls. |
| 8 | Compare this check with your own comfortable sessions. |
| 3 | Note the circumstances |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. |
| 3 | Visit nine targets |
| 10 | The app records local pointer positions while each target settles. |
| 3 | Compare the pattern |
| 8 | Review target error, drift direction, dwell, and next steps. |
| 4 | What the report shows |
| 7 | The report shows measurements, not a pass |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 5 | Directional drift in plain words |
| 4 | Dwell across nine targets |
| 5 | Standalone HTML report for support |
| 3 | Example check complete |
| 4 | Pattern within guide |
| 2 | Example only |
| 7 | Compare results on your own device |
| 3 | Privacy and limits |
| 6 | The app never requests camera access |
| 5 | It records local pointer positions. |
| 9 | The browser sample sends no pointer data or telemetry. |
| 12 | It does not diagnose a condition or replace your device maker’s calibration. |
| 4 | Read the privacy note |
| 4 | Try the sample first |
| 5 | Review a completed check now |
| 5 | Try it with sample data |
| 6 | Demo data uses separate browser storage |
| 7 | Compare gaze-pointer patterns before a demanding task. |
| 3 | Built by Param Factory |

### README: sentences and headings

| Words | Copy |
| ---: | --- |
| 3 | Gaze Calibration Card |
| 12 | Compare an eye-controlled pointer across nine targets before a demanding task. |
| 10 | It is for people who rely on eye input. |
| 8 | The report shows target error, directional drift, and dwell. |
| 5 | Pixel bands are device-dependent comparison guides. |
| 9 | They are not validated across eye trackers or screen sizes. |
| 13 | The app does not certify a setup, replace maker calibration, or provide a diagnosis. |
| 3 | Try the sample |
| 7 | Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. |
| 8 | The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. |
| 5 | **Reset demo** restores the bundled sample. |
| 7 | **Start a new check** discards demo data. |
| 8 | See `.factory/demo.md` for the sample and isolation details. |
| 12 | Every public product claim and its browser test is listed in `.factory/claims.json`. |
| 3 | How it works |
| 10 | The app records ordinary system pointer coordinates during each target. |
| 11 | The eye-controlled pointer mode visits nine targets automatically in about 30 seconds. |
| 12 | Keyboard practice supports Tab, Space, and Enter without producing a gaze score. |
| 8 | Setup notes are stored only after approval. |
| 11 | Local history keeps at most 50 checks and can be cleared. |
| 10 | A completed result exports as a standalone HTML support report. |
| 14 | The browser sample requests no camera access and sends no pointer data or telemetry. |
| 20 | The download page contacts the GitHub release service only to find current packages and stores that result for one hour. |
| 3 | Develop and verify |
| 8 | Requirements: Node.js 22+, npm, Rust stable, and the Tauri 2 prerequisites. |
| 9 | Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page. |
| 13 | The production build writes the desktop files to `dist/app` and the website files to `dist/site`. |
| 1 | Install |
| 8 | Published packages are on the GitHub Releases page (external). |
| 11 | The landing page selects Windows, Linux, or a detected Mac architecture. |
| 10 | If Mac architecture cannot be detected, it offers both builds. |
| 10 | Both installers verify SHA256 before installing or opening the download. |
| 13 | Packages are unsigned: on macOS, right-click and choose **Open** if Gatekeeper blocks the app. |
| 6 | Windows may show an unknown-publisher confirmation. |
| 3 | Release and deploy |
| 17 | Tag `v*` or dispatch `.github/workflows/release.yml`. |
| 12 | GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`. |
| 32 | The pinned Ubuntu 24.04 release path supplies the GTK helper compatibility link and runs AppImage helpers without a FUSE device; reproduce its Linux AppImage check with `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` after installing the listed Tauri prerequisites. |
| 5 | Deploy `dist/site` as the static artifact. |
| 3 | Privacy and license |
| 12 | The public privacy and terms pages describe local storage and device-dependent limits. |
| 7 | Source code is available under the MIT License. |
| 6 | Image provenance is recorded in `.factory/design.md`. |

The README AppImage release-process sentence at 32 words exceeds the 22-word cap. This is part of F-1-8’s plain-words recurrence. Split it into short deployment instructions; for example, “GitHub Actions builds macOS, Windows, and Linux packages. It also publishes `SHA256SUMS` and `latest.json`.” Move the platform-specific AppImage reproduction command into a linked contributor note.

## Demo, sandbox, privacy, and offline check

- The first action opens `/demo/#result` in one click. Its first screen is already a realistic completed check: nine readings, 42px average target error, 91% dwell, directional pattern, and 108 local pointer samples.
- The persistent banner reads **“Demo — sample data, nothing is saved”** and includes **Reset demo** and **Start a new check**.
- A pre-seeded real storage marker (`gaze-calibration-card:checks:v1`) survived demo entry, reset, and exit. Leaving demo opened `/#setup`; the demo key was absent after exit. The demo result is held in memory until a demo action needs storage, and its code selects only the `demo:` namespace.
- A fresh live demo request log contained only the product origin (document, demo script, module-preload script, stylesheet). No camera request or console error occurred.
- After a first visit, the declared offline claim test successfully reloaded both landing and demo offline, then reset the sample.

Demo behaviour is otherwise adequate. No demo finding is raised.

## Claim commands run from clean dependencies

After `npm ci`, each exact command from `.factory/claims.json` was run independently. All commands passed: `sample-demo`, `offline-reload`, `local-private`, `nine-targets`, `pointer-measures`, `pointer-sampling`, `keyboard-high-contrast`, `report-export`, `notes-opt-in`, `history-limit`, `release-download`, `installer-checksum`, `free-open-source`, and `thirty-second-check`.

Additional local checks passed:

- `npm test` — 7/7.
- `npm run lint` — passed.
- `npm run build` — passed; produced `dist/app` and `dist/site`.
- `npm run test:e2e -- --reporter=line` — passed; Playwright's `test-results/.last-run.json` records `status: "passed"`.
- `npm run test:lighthouse` — passed.

Passing exit codes do not clear F-1-4 because the test bodies are incomplete for the written claims.

## Earlier finding verification

| Earlier finding | Live and code verification |
| --- | --- |
| F-1-1, mobile targets | Fixed. At 390px, **Read the privacy note** measures 206.98×44px; the main sample action is 358×64px. |
| F-1-2, unvalidated reliability conclusion | Fixed in public verdict/headline copy. The UI now says “Pattern within comparison guide” and carries the unvalidated, comparison-only limitation. |
| F-1-3, deep links and Back | Fixed. Live `/demo/#setup` opens **Compare your gaze pointer right now**; app tests cover direct history/setup routes plus Back/Forward and focus. |
| F-1-4, complete claim proof | **BLOCKING recurrence**, above. |
| F-1-5, unlisted claims | **BLOCKING recurrence**, above. |
| F-1-6, phone facts below the fold | Fixed. All facts finish at y=734 of 844. |
| F-1-7, metadata/shared shell | Fixed. Landing, demo, Privacy, Terms, and 404 have route titles, description, canonical, OG/Twitter image, header, footer, and policy links. |
| F-1-8, plain words and terminology | **BLOCKING recurrence**, above. |
| F-1-9, external labels | Fixed. Source, repository, and releases links visibly say “on GitHub (external)”. |

## Structure, links, and identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; an unknown URL returned the designed 404 with HTTP 404. Each checked route had one h1 and main landmark. `/demo/#setup` direct-loaded correctly.
- The live landing has the required title pattern, description, canonical, Open Graph/Twitter card, SVG favicon, Apple touch icon, `lang=en`, robots file, sitemap, CSP frame denial, referrer policy, nosniff, and camera-denying permissions policy.
- Crawled product and GitHub links resolved successfully. The 404-page skip-link target retains its intentional 404 response.
- No console errors occurred in fresh landing/demo contexts. The browser suite covers keyboard completion, high contrast, reduced motion, focus, reflow, and Axe serious/critical issues.
- The pressed-fern field-guide surface is distinct from a generic SaaS template and matches the documented palette, typography, imagery provenance, and reduced-motion policy.

## Missed leverage

No additional AI feature is expected. This is a deterministic, privacy-sensitive local comparison; a model would not improve the core check. The existing standalone support report supplies the obvious handoff/export capability. No missed-leverage finding is raised.

## What would make this perfect

Execute both installers against a corrupt-download fixture, test the release cache at its one-hour boundary and request allowance, and register every remaining reliance/safety/signing statement. Then standardize `pointer`, `target`, `check`, and `dwell` across the landing, app, export, and README; split the two overlong README release sentences. A repeat from fresh contexts must then find zero findings.
