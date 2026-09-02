# Adversarial first-read review 4 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `c35a851f3468f87b3c4fc89d69d84685abccf8e0`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Reviewed: 2026-09-02 UTC
- Contexts: fresh Chromium at 390×844 and 1440×900; separate demo, offline, and route contexts
- Findings: 4 blocking, 0 minor

The first screen, one-click sample, storage isolation, core app flow, accessibility checks, and all 18 registered commands work. Acceptance still fails because one public platform-selection promise is not covered by its claim test, the app routes still do not use the required shared header, an earlier README jargon finding remains, and the repository's prior copy audit is knowingly stale and inaccurate.

## Cold first read before scrolling

### 390×844

In my own words: this checks the pointer controlled by an eye-input system across nine targets before a demanding task. It is for people whose setup may change with posture, glasses, light, or fatigue. I should choose **Try it with sample data** first; it opens a completed check and saves nothing.

The exact text that supplied the three answers was:

- What: “Check your gaze-controlled pointer before a demanding task”.
- Who: “For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.”
- First action and outcome: “Try it with sample data” and “Opens a completed check; nothing is saved”.

The three facts finish at y=780 in the 844-pixel viewport. The primary action is 358×64 pixels. This gate passes. Evidence: [mobile cold read](evidence/review-4/first-read/mobile.png).

### 1440×900

The same task, audience, first action, outcome, and three facts are visible before scrolling. This gate passes. Evidence: [desktop cold read](evidence/review-4/first-read/desktop.png).

## Findings

### Blocking

#### F-4-1 — The platform-download claim does not test the Linux or unknown-Mac outcomes

- Exact live location: the Linux first screen shows “Download for Linux” and “Version 0.1.5 · a matching download is ready.”
- Exact README claim: “The landing page selects Windows, Linux, or a detected Mac architecture. If Mac architecture cannot be detected, it offers both builds.”
- Registry location: `release-download` says the page “selects a published platform build from GitHub release metadata and caches that metadata for one hour.”
- Test evidence: `@claim:release-download` creates Windows and Mac contexts. It asserts Windows x64 and detected Mac ARM only. It does not create a Linux context, an Intel Mac context, or a Mac context with missing/failed architecture detection. `rg` finds no other test for “Mac architecture could not be detected”, “Choose a Mac download”, or both Mac links.
- Why this blocks: the command passes, but it does not prove every platform result covered by the registered claim and public README. The unknown-Mac sentence is also an unlisted observable claim outside the narrower tested behavior.
- Concrete fix: extend `@claim:release-download` with Linux, Intel Mac, and unknown-architecture Mac contexts. Assert the Linux asset, Intel asset, and both labelled Mac links. Keep the one-hour cache assertions in the same tagged test, or narrow the public and registered claim to the branches actually tested.

#### F-4-2 — The shared-header finding F-1-7 remains half fixed

- Earlier requirement: F-1-7 required “one shared metadata/header/footer component for every route” and the site-structure contract requires the wordmark to link home.
- Exact live result: on `/`, the wordmark links to `/` and the header offers Demo, How it works, Privacy, and Source. On `/privacy/`, `/terms/`, and the 404, the wordmark links to `/` and the header offers Home, Demo, and Privacy. On `/check/`, the wordmark resolves to `/check/#setup`; on `/demo/`, it resolves to `/demo/#setup`. Those two app headers replace site navigation with **View past checks**.
- Code confirmation: `src/app/main.ts` renders `<a class="brand" href="#setup" aria-label="Gaze Calibration Card home">`, not the shared site header. At 390 pixels, `src/site/site.css` also hides Demo, How it works, and Privacy from the landing header while leaving only the external Source link.
- Why this blocks: the wordmark's accessible name says “home” but does not go to the site home on two routes. Navigation changes by route and viewport, so the earlier shared-shell finding was not actually closed.
- Concrete fix: render one shared header on every route, make the wordmark link to `/`, and retain the same small set of site links at desktop and 390 pixels. Keep **View past checks** as an app utility outside the global navigation. Add an exact link-destination test for every route at both widths.

#### F-4-3 — The earlier F-1-8 README jargon remains

- Exact quote: README, Release and deploy: “Deploy `dist/site` as the static artifact.”
- Earlier finding: F-1-8 explicitly flagged “static artifact” as contributor jargon and proposed “website files”. Polish 1 and polish 2 marked the finding fixed, but the phrase remains in the current README.
- Why this blocks: “artifact” does not tell a first-time contributor what to upload. The history rule makes a half-fixed earlier finding blocking again.
- Concrete rewrite: “Deploy the website files in `dist/site`.”

#### F-4-4 — The handoff's known stale copy-audit defect is still present

- Exact locations: `.factory/handoff.md` records a low defect because `.factory/copy-audit.md` still says “Version 0.1.4 · a matching download is ready.” The live page now says “Version 0.1.5 · a matching download is ready.” The same audit lists “Pattern within comparison guide”, while the landing preview says “Pattern within guide”.
- Why this blocks: the review order requires every defect recorded in an earlier handoff to be rechecked and treats anything unfixed as blocking. The audit claims it covers current landing copy exactly, but two entries do not match the current page.
- Concrete fix: regenerate `.factory/copy-audit.md` from current visitor copy, include navigation and conditional states, and add a test that compares the audited strings with built output while allowing only declared dynamic values such as the release version.

## Copy audit

Counts treat a URL, number, or hyphenated term as one word; shell commands are counted by whitespace. No landing or README sentence exceeds 22 words. No banned marketing adjective or mood heading appears. F-4-3 is the only current visitor-copy wording flag; F-4-4 concerns the stale prior audit rather than live wording.

### Landing page: navigation, headings, actions, facts, and sentences

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | Skip to main content | Clear action |
| 3 | Gaze Calibration Card | Product name |
| 1 | Demo | Clear destination |
| 3 | How it works | Clear destination/heading |
| 1 | Privacy | Clear destination |
| 4 | Source on GitHub (external) | Clear destination |
| 3 | Nine-target pointer comparison | Informative label |
| 8 | Check your gaze-controlled pointer before a demanding task | Clear h1 |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. | Clear audience and change |
| 5 | Try it with sample data | Result-naming action |
| 7 | Opens a completed check; nothing is saved | Clear outcome |
| 3 | Download the app | Result-naming action |
| 3 | Detecting your system… | Clear status |
| 3 | Download for Linux | Clear conditional action |
| 3 | Download for Windows | Clear conditional action |
| 5 | Download for Mac (Apple silicon) | Clear conditional action |
| 4 | Download for Mac (Intel) | Clear conditional action |
| 5 | Choose a Mac download | Clear conditional action |
| 5 | No camera access or account | Concrete fact |
| 6 | Sample reloads offline after first visit | Concrete fact |
| 4 | Free and open source | Concrete fact |
| 4 | Checking published desktop builds… | Clear status |
| 8 | Version 0.1.5 · a matching download is ready. | Clear status |
| 3 | Install another way | Clear action |
| 3 | Copy install command | Result-naming action |
| 9 | The Windows installers and macOS app bundles are unsigned. | Clear installation limitation |
| 10 | Pressed fern around nine copper seeds arranged as calibration points | Useful image alternative |
| 8 | The nine seeds mirror the app’s target layout. | Useful caption |
| 3 | On this device | Informative label |
| 6 | Pointer processing stays in the app | Concrete fact |
| 2 | Comparison only | Informative label |
| 4 | Results are comparison guides | Concrete limitation |
| 2 | Keyboard access | Informative label |
| 4 | Keyboard and high-contrast paths | Concrete fact |
| 2 | No telemetry | Informative label |
| 5 | No pointer data is sent | Concrete fact |
| 2 | Desktop walkthrough | Clear section label |
| 6 | See the complete check before installing | Clear h2 |
| 11 | Setup screen for choosing eye pointer, mouse, touch, or keyboard input | Useful image alternative |
| 4 | 1. Note the setup. | Clear caption heading |
| 6 | Save details only when you choose. | Clear sentence |
| 10 | Nine-target check showing a gold target on a paper-like field | Useful image alternative |
| 4 | 2. Visit nine targets. | Clear caption heading |
| 8 | The app records pointer positions during each target. | Clear sentence |
| 12 | Completed sample with target error, drift, pointer steadiness, and a nine-target map | Useful image alternative |
| 4 | 3. Compare the pattern. | Clear caption heading |
| 10 | Dwell shows how steadily the pointer stays on each target. | Defines the term |
| 3 | How it works | Clear section label |
| 6 | Compare the pointer in three steps | Clear h2 |
| 8 | Use the pointer your gaze system already controls. | Clear sentence |
| 8 | Compare this check with your own comfortable sessions. | Clear sentence |
| 3 | Note the circumstances | Clear h3 |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. | Clear sentence |
| 3 | Visit nine targets | Clear h3 |
| 10 | The app records local pointer positions while each target settles. | Clear sentence |
| 3 | Compare the pattern | Clear h3 |
| 9 | Review target error, drift direction, dwell, and next steps. | Clear sentence |
| 4 | What the report shows | Clear section label |
| 7 | The report shows measurements, not a pass | Clear h2 |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. | Clear limitation |
| 5 | Directional drift in plain words | Clear fact |
| 4 | Dwell for each target | Clear fact after definition |
| 5 | Standalone HTML report for support | Clear fact |
| 3 | Example check complete | Clear example label |
| 3 | Pattern within guide | Clear example result |
| 1 | Error | Clear metric label |
| 2 | 42 px | Clear example value |
| 1 | Dwell | Clear metric label after definition |
| 1 | 91% | Clear example value |
| 1 | Pattern | Clear metric label |
| 2 | No drift | Clear example value |
| 9 | Example only · compare results on your own device | Clear limitation |
| 3 | Privacy and limits | Clear section label |
| 6 | The app never requests camera access | Clear h2 |
| 5 | It records local pointer positions. | Clear sentence |
| 9 | The browser sample sends no pointer data or telemetry. | Clear sentence |
| 13 | This comparison does not diagnose a condition or replace your device maker’s calibration. | Clear limitation |
| 5 | Read the privacy note → | Result-naming action |
| 4 | Try the sample first | Clear section label |
| 5 | Review a completed check now | Clear h2 |
| 6 | Demo data uses separate browser storage | Clear outcome |
| 7 | Compare pointer patterns before a demanding task. | Clear footer sentence |
| 1 | Terms | Clear destination |
| 4 | Releases on GitHub (external) | Clear destination |
| 4 | Built by Param Factory | Clear provenance |

Conditional landing states are also within the limit:

| Words | Exact copy | Result |
| ---: | --- | --- |
| 4 | Downloads are being published. | Clear error state |
| 7 | Open the releases page to check again. | Clear next action |
| 6 | Mac architecture could not be detected | Clear status; claim coverage fails F-4-1 |
| 2 | Apple silicon | Clear option |
| 1 | Intel | Clear option |
| 1 | Copied | Clear completion state |
| 8 | Select and copy the install command shown above. | Clear recovery action |

### README: headings and sentences

| Words | Type | Exact copy | Result |
| ---: | --- | --- | --- |
| 3 | H1 | Gaze Calibration Card | Clear product heading |
| 11 | Sentence | Compare a gaze-controlled pointer across nine targets before a demanding task. | Clear sentence |
| 9 | Sentence | It is for people who rely on eye input. | Clear audience |
| 9 | Sentence | The report shows target error, directional drift, and dwell. | Clear sentence |
| 10 | Sentence | Dwell shows how steadily the pointer stays on each target. | Defines the term |
| 14 | Sentence | Pixel bands are device-dependent and have not been validated across eye trackers or screens. | Clear limitation |
| 13 | Sentence | This comparison does not diagnose a condition or replace your device maker’s calibration. | Clear limitation |
| 3 | H2 | Try the sample | Clear heading |
| 7 | Sentence | Open `https://gaze-calibration-card.sociobot.in/demo/` for a completed sample check. | Clear action |
| 8 | Sentence | The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. | Clear isolation fact |
| 6 | Sentence | Reset demo restores the bundled sample. | Clear sentence |
| 7 | Sentence | Start a new check discards demo data. | Clear sentence |
| 8 | Sentence | See `.factory/demo.md` for the sample and isolation details. | Clear action |
| 6 | Sentence | Claim checks are listed in `.factory/claims.json`. | Clear contributor fact |
| 3 | H2 | How it works | Clear heading |
| 10 | Sentence | The app records ordinary system pointer coordinates during each target. | Clear sentence |
| 12 | Bullet | The gaze-controlled pointer mode visits nine targets automatically in about 30 seconds. | Clear sentence |
| 12 | Bullet | Keyboard practice supports Tab, Space, and Enter without producing a gaze score. | Clear sentence |
| 7 | Bullet | Setup notes are stored only after approval. | Clear sentence |
| 11 | Bullet | Local history keeps at most 50 checks and can be cleared. | Clear sentence |
| 10 | Bullet | A completed result exports as a standalone HTML support report. | Clear sentence |
| 14 | Sentence | The browser sample requests no camera access and sends no pointer data or telemetry. | Clear sentence |
| 11 | Sentence | The download page reads GitHub release metadata to select current packages. | Covered except branches in F-4-1 |
| 7 | Sentence | It caches that metadata for one hour. | Clear sentence |
| 3 | H2 | Develop and verify | Clear contributor heading |
| 11 | Sentence | Requirements: Node.js 22+, npm, Rust stable, and the Tauri 2 prerequisites. | Necessary technical terms |
| 16 | Sentence | Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page. | Clear contributor instruction |
| 15 | Sentence | The production build writes the desktop files to `dist/app` and the website files to `dist/site`. | Clear contributor fact |
| 1 | H2 | Install | Clear heading |
| 9 | Sentence | Published packages are on the GitHub Releases page (external). | Clear sentence |
| 11 | Sentence | The landing page selects Windows, Linux, or a detected Mac architecture. | Claim coverage fails F-4-1 |
| 10 | Sentence | If Mac architecture cannot be detected, it offers both builds. | Unlisted/untested claim in F-4-1 |
| 11 | Sentence | The shell installer verifies SHA256 before installing or opening the download. | Clear sentence |
| 9 | Sentence | The Windows installers and macOS app bundles are unsigned. | Clear limitation |
| 13 | Sentence | For macOS installation steps, see Apple’s guidance for opening an unnotarized app (external). | Clear external reference |
| 3 | H2 | Release and deploy | Clear contributor heading |
| 5 | Sentence | Tag `v*` or dispatch `.github/workflows/release.yml`. | Clear contributor instruction |
| 12 | Sentence | GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`. | Clear contributor fact |
| 10 | Sentence | The Ubuntu release job supplies the GTK helper compatibility link. | Necessary technical fact |
| 8 | Sentence | It runs AppImage helpers without a FUSE device. | Necessary technical fact |
| 20 | Sentence | After installing Tauri prerequisites, run `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` to reproduce the Linux AppImage check. | Within limit |
| 6 | Sentence | Deploy `dist/site` as the static artifact. | Jargon; F-4-3 |
| 3 | H2 | Privacy and license | Clear heading |
| 12 | Sentence | The public privacy and terms pages describe local storage and device-dependent limits. | Clear sentence |
| 8 | Sentence | Source code is available under the MIT License. | Clear sentence |
| 6 | Sentence | Image provenance is recorded in `.factory/design.md`. | Clear sentence |

### Terminology

| Concept | Term used | Result |
| --- | --- | --- |
| Measured cursor | gaze-controlled pointer on first mention, then pointer | Consistent |
| Measurement position | target | Consistent |
| Activity | check | Consistent |
| Hold measurement | dwell, defined as pointer steadiness on a target | Consistent |
| Saved results | history | Consistent |
| Bundled example | sample check / sample data where the action describes supplied data | Understandable |

## Demo, sandbox, privacy, and offline evidence

- The first landing action opens `/demo/#result` in one click.
- The first demo screen already shows a completed morning wheelchair/headrest sample, nine readings, 42 px average target error, 91% dwell, a directional result, and 108 pointer samples.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes **Reset demo** and **Start a new check**.
- Reset restores the sample. A pre-seeded `gaze-calibration-card:checks:v1` marker survived entry, reset, and exit. Leaving removed `demo:gaze-calibration-card:checks:v1` and opened reloadable `/check/#setup`.
- The complete demo request log, including reset and export, contained only product-origin requests. No camera request or console error occurred.
- After the first visit, both landing and demo reloaded offline; Reset demo still worked offline.
- Evidence: [live audit](evidence/review-4/live/live-audit.json), [mobile demo](evidence/review-4/live/live-demo-390.png), and [mobile real check](evidence/review-4/live/live-check-390.png).

The demo and sandbox gate passes.

## Claims execution

After `npm ci`, every exact `test` value in `.factory/claims.json` was run independently. All commands exited zero:

| Claim | Result |
| --- | --- |
| `sample-demo` | PASS |
| `offline-reload` | PASS |
| `local-private` | PASS |
| `no-account` | PASS |
| `nine-targets` | PASS |
| `pointer-measures` | PASS |
| `pointer-sampling` | PASS |
| `keyboard-high-contrast` | PASS |
| `report-export` | PASS |
| `notes-opt-in` | PASS |
| `history-limit` | PASS |
| `release-download` | PASS command; incomplete branch coverage in F-4-1 |
| `installer-checksum` | PASS |
| `comparison-bands-limit` | PASS |
| `not-a-diagnosis` | PASS |
| `unsigned-builds` | PASS |
| `free-open-source` | PASS |
| `thirty-second-check` | PASS |

Additional checks passed: `npm run lint`, `npm test` (8 tests), `npm run build`, and `npm run test:e2e -- --reporter=line` (62 passed, 8 intentionally skipped). The build produced `dist/app` and `dist/site`; the largest site route loads about 8.9 kB of JavaScript gzip.

## Structure, routing, accessibility, and links

- `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` have route-specific titles, descriptions, canonicals, OG/Twitter metadata, one h1, one main, `lang=en`, favicon links, and no serious/critical Axe finding.
- A missing URL returns the designed 404 with HTTP 404. The direct `/404.html` document returns 200 as expected.
- Direct app routes work. On live `/check/#setup`, **Prepare the check** opens `#ready`, focuses “Follow each target”, and Back restores `#setup` with its h1 focused.
- Every crawled internal link returned 200. The GitHub source and release pages returned 200. The selected binary link was excluded from the page crawl because the signing claim already downloads and inspects release artifacts.
- The live page had no console or page errors. All tested mobile controls were at least 44 pixels. Landing, demo, and check had no horizontal overflow at 200% text.
- CSP, frame denial, `nosniff`, referrer policy, permissions policy, service-worker offline behavior, `robots.txt`, and a sitemap containing all public routes are present.
- F-4-2 remains the header consistency failure.

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1, mobile targets | Fixed. Full-route 390-pixel checks meet 44 pixels. |
| F-1-2, unvalidated reliability conclusion | Fixed. Results say comparison guide, not readiness/pass/diagnosis. |
| F-1-3, deep links and Back | Fixed. Direct load, reload, Back, Forward, h1 focus, and announcements work. |
| F-1-4, complete claim proof | Partly fixed. Installer/signing evidence now inspects real artifacts; release platform branches remain incomplete as F-4-1. |
| F-1-5, unlisted claims | Partly fixed. Account, privacy, signing, and limits are registered; the unknown-Mac fallback remains in F-4-1. |
| F-1-6, phone facts | Fixed. Facts finish at y=780 of 844. |
| F-1-7, metadata/shared shell | **BLOCKING recurrence as F-4-2.** Metadata and footer are fixed; the shared header and wordmark destination are not. |
| F-1-8, terminology/plain words | **BLOCKING recurrence as F-4-3.** Product terms are fixed; the exact previously flagged “static artifact” phrase remains. |
| F-1-9, external labels | Fixed. External GitHub destinations say “(external)”. |
| F-3-1, installer/signing proof | Fixed. The narrowed shell claim executes a corrupt fixture; unsigned-builds downloads and inspects four current artifacts after digest verification. |
| F-3-2, extra promises | Fixed for no-account, advertising removal, and publisher-prompt removal. |
| F-3-3, dwell jargon | Fixed. Landing, app, export, and README define dwell. |
| Polish 3 unnumbered verification findings | Fixed: offline context ownership, result integrity, storage recovery, security headers, 404, release identity, 200% reflow, and Linux release checks all passed current tests or live inspection. |
| Handoff known defect, stale copy audit | **BLOCKING recurrence as F-4-4.** The documented version mismatch remains and another exact-copy mismatch is present. |

## Visual identity and missed leverage

The pressed-fern field-guide image, paper palette, serif/sans pairing, copper targets, clipped corners, and survey-card layout match `.factory/design.md`. The product is visually distinct and not a generic SaaS template. Image provenance is recorded and the walkthrough uses product screenshots.

No AI feature is expected. The core task is deterministic, privacy-sensitive pointer measurement; model output would add uncertainty without helping the decision. The standalone HTML support report provides the obvious export/handoff feature. Sync would conflict with the local-first scope unless introduced as an explicit opt-in. No missed-leverage finding is raised.

## What would make this perfect

Resolve all four findings: test every advertised platform-selection branch, use one global header with a real home link on every route and viewport, replace “static artifact” with “website files”, and regenerate the copy audit from current built copy. Then repeat the entire review from fresh contexts. The acceptance target is zero findings and no untested claim.
