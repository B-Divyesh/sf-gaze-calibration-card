# Adversarial first-read review 5 — Gaze Calibration Card

**Verdict: PASS**

- Candidate: `f38cead5b4f4b6b194f7e34f476e7c5b4691d3b1`
- Live product build: `c08f91a1ac945260dbd8c7c06e6c200c75674882`; the candidate adds only verification documentation after that build
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Reviewed: 2026-09-02 UTC
- Contexts: fresh Chromium at 390×844 and 1440×900; separate demo, offline, route, and link contexts
- Findings: 0 blocking, 0 minor

The product is clear on first view, usable in one click, honest about its limits, and backed by complete claim checks. This review assigns no `F-5-*` IDs because it found no defect.

## Cold first read before scrolling

### 390×844

In my own words: this compares the pointer controlled by an eye-input system before a demanding task. It is for people whose pointer may change with posture, glasses, light, or fatigue. I should choose **Try it with sample data** first; it opens a completed check and saves nothing.

The exact text that supplied the answers was:

- What: “Check your gaze-controlled pointer before a demanding task”.
- Who: “For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.”
- First action and result: “Try it with sample data” and “Opens a completed check; nothing is saved”.

All three facts are also visible before scrolling. Their box ends at y=815 in the 844-pixel viewport. The sample action is 358×64 pixels. Evidence: [mobile cold read](evidence/review-5/first-read/mobile.png).

### 1440×900

The task, audience, sample action, outcome, and three facts are visible without scrolling. Evidence: [desktop cold read](evidence/review-5/first-read/desktop.png).

## Findings

None.

## Copy audit

Counts treat a URL, number, code token, or hyphenated term as one word. Repeated copy is listed once. Code blocks are commands rather than sentences. Every landing and README sentence is at most 22 words. No banned marketing adjective, vague slogan, mood heading, unexplained product term, or non-result-naming action remains.

### Landing page, including headings, actions, states, and image text

| Words | Exact copy |
| ---: | --- |
| 4 | Skip to main content |
| 3 | Gaze Calibration Card |
| 1 | Demo |
| 3 | How it works |
| 1 | Privacy |
| 4 | Source on GitHub (external) |
| 3 | Nine-target pointer comparison |
| 8 | Check your gaze-controlled pointer before a demanding task |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 5 | Try it with sample data |
| 7 | Opens a completed check; nothing is saved |
| 3 | Download the app |
| 3 | Detecting your system… |
| 3 | Download for Linux |
| 3 | Download for Windows |
| 5 | Download for Mac (Apple silicon) |
| 4 | Download for Mac (Intel) |
| 5 | Choose a Mac download |
| 5 | No camera access or account |
| 6 | Sample reloads offline after first visit |
| 4 | Free and open source |
| 4 | Checking published desktop builds… |
| 8 | Version 0.1.6 · a matching download is ready. |
| 3 | Install another way |
| 5 | `curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh \| sh` |
| 3 | Copy install command |
| 9 | The Windows installers and macOS app bundles are unsigned. |
| 10 | Pressed fern around nine copper seeds arranged as calibration points |
| 8 | The nine seeds mirror the app’s target layout. |
| 3 | On this device |
| 6 | Pointer processing stays in the app |
| 2 | Comparison only |
| 4 | Results are comparison guides |
| 2 | Keyboard access |
| 4 | Keyboard and high-contrast paths |
| 2 | No telemetry |
| 5 | No pointer data is sent |
| 2 | Desktop walkthrough |
| 6 | See the complete check before installing |
| 11 | Setup screen for choosing eye pointer, mouse, touch, or keyboard input |
| 4 | 1. Note the setup. |
| 6 | Save details only when you choose. |
| 10 | Nine-target check showing a gold target on a paper-like field |
| 4 | 2. Visit nine targets. |
| 8 | The app records pointer positions during each target. |
| 12 | Completed sample with target error, drift, pointer steadiness, and a nine-target map |
| 4 | 3. Compare the pattern. |
| 10 | Dwell shows how steadily the pointer stays on each target. |
| 6 | Compare the pointer in three steps |
| 8 | Use the pointer your gaze system already controls. |
| 8 | Compare this check with your own comfortable sessions. |
| 3 | Note the circumstances |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. |
| 3 | Visit nine targets |
| 10 | The app records local pointer positions while each target settles. |
| 3 | Compare the pattern |
| 9 | Review target error, drift direction, dwell, and next steps. |
| 4 | What the report shows |
| 7 | The report shows measurements, not a pass |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 5 | Directional drift in plain words |
| 4 | Dwell for each target |
| 5 | Standalone HTML report for support |
| 3 | Example check complete |
| 3 | Pattern within guide |
| 1 | Error |
| 2 | 42 px |
| 1 | Dwell |
| 1 | 91% |
| 1 | Pattern |
| 2 | No drift |
| 9 | Example only · compare results on your own device |
| 3 | Privacy and limits |
| 6 | The app never requests camera access |
| 5 | It records local pointer positions. |
| 9 | The browser sample sends no pointer data or telemetry. |
| 13 | This comparison does not diagnose a condition or replace your device maker’s calibration. |
| 5 | Read the privacy note → |
| 4 | Try the sample first |
| 5 | Review a completed check now |
| 6 | Demo data uses separate browser storage |
| 7 | Compare pointer patterns before a demanding task. |
| 1 | Terms |
| 4 | Releases on GitHub (external) |
| 6 | Built by Param Factory · Build `{build id}` |
| 4 | Downloads are being published. |
| 7 | Open the releases page to check again. |
| 6 | Mac architecture could not be detected: |
| 2 | Apple silicon |
| 1 | Intel |
| 1 | Copied |
| 8 | Select and copy the install command shown above. |

### README sentences and headings

| Words | Type | Exact copy |
| ---: | --- | --- |
| 3 | H1 | Gaze Calibration Card |
| 11 | Sentence | Compare a gaze-controlled pointer across nine targets before a demanding task. |
| 9 | Sentence | It is for people who rely on eye input. |
| 9 | Sentence | The report shows target error, directional drift, and dwell. |
| 10 | Sentence | Dwell shows how steadily the pointer stays on each target. |
| 14 | Sentence | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 13 | Sentence | This comparison does not diagnose a condition or replace your device maker’s calibration. |
| 3 | H2 | Try the sample |
| 7 | Sentence | Open `https://gaze-calibration-card.sociobot.in/demo/` for a completed sample check. |
| 8 | Sentence | The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. |
| 6 | Sentence | **Reset demo** restores the bundled sample. |
| 7 | Sentence | **Start a new check** discards demo data. |
| 8 | Sentence | See `.factory/demo.md` for the sample and isolation details. |
| 6 | Sentence | Claim checks are listed in `.factory/claims.json`. |
| 3 | H2 | How it works |
| 10 | Sentence | The app records ordinary system pointer coordinates during each target. |
| 12 | Bullet | The gaze-controlled pointer mode visits nine targets automatically in about 30 seconds. |
| 12 | Bullet | Keyboard practice supports Tab, Space, and Enter without producing a gaze score. |
| 7 | Bullet | Setup notes are stored only after approval. |
| 11 | Bullet | Local history keeps at most 50 checks and can be cleared. |
| 10 | Bullet | A completed result exports as a standalone HTML support report. |
| 14 | Sentence | The browser sample requests no camera access and sends no pointer data or telemetry. |
| 11 | Sentence | The download page reads GitHub release metadata to select current packages. |
| 7 | Sentence | It caches that metadata for one hour. |
| 3 | H2 | Develop and verify |
| 11 | Sentence | Requirements: Node.js 22+, npm, Rust stable, and the Tauri 2 prerequisites. |
| 16 | Sentence | Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page. |
| 15 | Sentence | The production build writes the desktop files to `dist/app` and the website files to `dist/site`. |
| 1 | H2 | Install |
| 9 | Sentence | Published packages are on the GitHub Releases page (external). |
| 11 | Sentence | The landing page selects Windows, Linux, or a detected Mac architecture. |
| 10 | Sentence | If Mac architecture cannot be detected, it offers both builds. |
| 11 | Sentence | The shell installer verifies SHA256 before installing or opening the download. |
| 9 | Sentence | The Windows installers and macOS app bundles are unsigned. |
| 13 | Sentence | For macOS installation steps, see Apple’s guidance for opening an unnotarized app (external). |
| 3 | H2 | Release and deploy |
| 5 | Sentence | Tag `v*` or dispatch `.github/workflows/release.yml`. |
| 12 | Sentence | GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`. |
| 10 | Sentence | The Ubuntu release job supplies the GTK helper compatibility link. |
| 8 | Sentence | It runs AppImage helpers without a FUSE device. |
| 20 | Sentence | After installing Tauri prerequisites, run `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` to reproduce the Linux AppImage check. |
| 7 | Sentence | Deploy the website files in `dist/site`. |
| 3 | H2 | Privacy and license |
| 12 | Sentence | The public privacy and terms pages describe local storage and device-dependent limits. |
| 8 | Sentence | Source code is available under the MIT License. |
| 6 | Sentence | Image provenance is recorded in `.factory/design.md`. |

### Terminology and flag result

| Concept | One term used |
| --- | --- |
| Measured cursor | `gaze-controlled pointer` on first mention, then `pointer` |
| Measurement position | `target` |
| Activity | `check` |
| Hold measurement | `dwell`, defined as pointer steadiness on a target |
| Saved results | `history` |
| Bundled example | `sample check` or `sample data` |

There are no copy flags and therefore no proposed rewrites.

## Demo and sandbox verification

- The first landing action opens `/demo/#result` in one click.
- The first demo screen already shows a wheelchair/headrest sample with nine readings, 42 px average target error, 91% dwell, a directional result, and 108 pointer samples.
- The persistent banner says “Demo — sample data, nothing is saved” and provides **Reset demo** and **Start a new check**.
- Reset restores the sample. A seeded `gaze-calibration-card:checks:v1` marker survived entry, reset, and exit. Leaving removed `demo:gaze-calibration-card:checks:v1` and opened `/check/#setup`.
- The complete live demo request log contained only product-origin requests. The camera API was not requested in the claim test.
- Landing and demo both reloaded after the first visit while offline. Reset still worked in the offline demo.

Evidence: [live audit](evidence/review-5/live/live-audit.json) and [mobile demo](evidence/review-5/live/live-demo-390.png).

## Claims verification

After `npm ci`, every exact `test` command in `.factory/claims.json` was run separately. All 18 passed:

| Claim | Result | Observable coverage checked |
| --- | --- | --- |
| `sample-demo` | PASS | One-click sample, banner, reset, exit, and real-key preservation |
| `offline-reload` | PASS | Landing and demo reload; demo reset while offline |
| `local-private` | PASS | No camera call and only same-origin demo requests through export |
| `no-account` | PASS | Demo, export, and saved keyboard check without auth UI, auth request, or cookie |
| `nine-targets` | PASS | Nine populated target readings |
| `pointer-measures` | PASS | Error, dwell, and directional pattern values |
| `pointer-sampling` | PASS | Known pointer movement stored for all nine targets |
| `keyboard-high-contrast` | PASS | Keyboard completion, forced colors, reduced motion, and Axe |
| `report-export` | PASS | Downloaded standalone HTML with no external dependencies |
| `notes-opt-in` | PASS | Notes omitted without approval and stored after approval |
| `history-limit` | PASS | 50-check cap and confirmed clearing |
| `release-download` | PASS | Windows, Linux, both detected Macs, unknown Mac fallback, request allowlist, and one-hour cache |
| `installer-checksum` | PASS | Production shell installer rejects corrupt bytes before use |
| `comparison-bands-limit` | PASS | Exact device-dependent limit in result and exported report |
| `not-a-diagnosis` | PASS | Exact non-diagnostic, non-pass language in result and export |
| `unsigned-builds` | PASS | Four current Windows/macOS artifacts checked after digest verification |
| `free-open-source` | PASS | MIT license, source link, and no payment action |
| `thirty-second-check` | PASS | Automatic check measured within the asserted 24–30 second interval |

The landing and README reliance statements map to these entries. No unlisted claim was found.

## Earlier finding verification

Every earlier review, polish report, and handoff was read. The current live site and source/tests confirm each recorded defect is closed.

| Earlier finding | Current live and code result |
| --- | --- |
| F-1-1, mobile touch targets | Fixed. Live primary action is 358×64 px; full-route tests require all visible controls to be at least 44 px. |
| F-1-2, unvalidated reliability wording | Fixed. Live results say comparison guide, and source/export state unvalidated, non-diagnostic, non-pass limits. |
| F-1-3, deep links and Back | Fixed. Live `/check/#setup` → `#ready` → Back restored `#setup`; each h1 received focus. Source uses `pushState`, `popstate`, route titles, and an aria-live announcement. |
| F-1-4, incomplete claim proof | Fixed. All 18 exact commands pass; tests cover prior offline, motion, export, timing, cache, installer, signing, and release-branch gaps. |
| F-1-5, unlisted claims | Fixed. Unsupported copy was removed or represented by the current claim registry and tagged tests. |
| F-1-6, phone facts below the fold | Fixed. Live facts end at y=815 of 844. |
| F-1-7, metadata/shared shell | Fixed. Every route has the same four navigation destinations; app and site wordmarks link to `/`; metadata, policy links, build id, and the designed 404 are present. |
| F-1-8, jargon and inconsistent terms | Fixed. Current copy uses pointer, target, check, history, sample, and defined dwell consistently. README says “website files”. |
| F-1-9, external link labels | Fixed. GitHub source and release destinations visibly say “(external)”. |
| F-3-1, installer/signing evidence | Fixed. The checksum claim is accurately narrowed to the shell installer; the signing test downloads and inspects all four promised packages. |
| F-3-2, account/advertising/publisher promises | Fixed. No-account is registered and tested; advertising and publisher-prompt predictions were removed. |
| F-3-3, unexplained dwell term | Fixed. Landing, app, export, and README define dwell as pointer steadiness on a target. |
| F-4-1, incomplete platform branches | Fixed. The tagged test covers Linux, Windows, Apple silicon, Intel Mac, and unknown-Mac fallback. |
| F-4-2, app header inconsistency | Fixed. Live app routes expose the home wordmark and the same global destinations at 390 px and desktop widths. |
| F-4-3, README “static artifact” jargon | Fixed. The current sentence is “Deploy the website files in `dist/site`.” |
| F-4-4, stale copy audit | Fixed. The audited static strings match the production build, with release version and build id explicitly treated as dynamic. |
| Earlier unnumbered verification findings | Fixed. Current checks cover first-read demo, offline context ownership, workflow focus, result integrity, storage recovery, security headers, 404, release selection, history clearing, 200% text reflow, Lighthouse, release artifacts, and build identity. |

The current handoff discloses two limitations rather than unresolved defects: pixel bands remain unvalidated across devices, and Windows/macOS packages remain unsigned. Both limitations are prominent in visitor copy and are covered by claim tests.

## Structure, accessibility, links, and identity

- `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` return the intended content with route-specific titles, descriptions, canonicals, OG/Twitter metadata, favicon links, `lang=en`, one h1, and one main landmark.
- A missing URL returns the designed 404 with HTTP 404. `robots.txt`, `sitemap.xml`, and the static-host fallback configuration cover every public route.
- Live direct load, reload, Back, h1 focus, and shared navigation work. Every crawled internal, GitHub, release-page, and selected release-asset link resolved successfully.
- The live route audit found no console errors and zero serious/critical Axe violations. The worker URL verifier found a title, language, one h1, main, complete alt text, and labelled buttons.
- The desktop/mobile suite covers keyboard operation, dialogs, forced colors, reduced motion, 44 px touch targets, and 200% text reflow. `npm run test:lighthouse` scored 99/100, 100/100, and 100/100 with median performance 100.
- The largest site JavaScript bundle is 8.65 kB gzip, well below the 150 kB threshold.
- The pressed-fern field-guide art, paper/fern/copper palette, serif display type, survey marks, and product screenshots match `.factory/design.md`. The visual identity is specific to this pointer-comparison task and is not a generic SaaS template.

## Quality gates

- `npm test`: PASS, 10/10.
- `npm run build`: PASS; produced `dist/app` and `dist/site`.
- `npm run test:e2e -- --reporter=line`: PASS, 64 passed and 8 expected mobile skips.
- All 18 claim commands: PASS individually.
- `npm run test:lighthouse`: PASS.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: PASS.

## Missed leverage

No missing feature is raised. The brief’s obvious handoff need is met by standalone HTML export. The task is deterministic and privacy-sensitive, so an AI step would add uncertainty rather than help. Sync would conflict with the local-first scope unless explicitly optional.

## What would make this perfect

For the reviewed contract, nothing remains: there are zero blocking findings, zero minor findings, and no untested claim. Cross-device validation and publisher signing are future product/release work only if the product later makes stronger promises; the current product states those limits accurately.
