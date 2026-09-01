# Adversarial first-read review 1 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate: `1cfcde92e101fa0b156a283d7f43da72d64868ec`
- Live URL: <https://gaze-calibration-card.sociobot.in>
- Reviewed: 2026-09-01 UTC
- Viewports: 390×844 and 1440×900, each in a fresh Chromium context
- Findings: 5 blocking, 4 minor

The one-click sample, storage separation, first-visit offline reload, basic accessibility, and core measurements work. Acceptance still fails because an earlier touch-target defect remains, unvalidated reliability wording remains in the live app, browser history and deep links do not represent app state, several claim tests do not prove their full claims, and public claims remain outside `.factory/claims.json`.

## Cold first read before scrolling

### 390×844

In my own words: this is for someone who controls a pointer with their eyes. It compares the current pointer pattern across nine targets after posture, glasses, light, or fatigue changes. I should choose **Try it with sample data** first.

The exact text that supplied those answers was:

- What: “Check your gaze pointer before a demanding task.”
- Who: “For people who rely on eye input…”
- First action: “Try it with sample data” and “Opens a completed check; nothing is saved.”

All three questions are answerable, so this specific gate is not blocking. The botanical image appears before the headline and uses 300 pixels of vertical space. The three required facts begin at y=928 and are outside the 844-pixel first screen; see F-1-6.

### 1440×900

The same three answers are visible without scrolling, together with the three facts and the desktop download action. The first-read gate passes at this width.

## Findings

### Blocking

#### F-1-1 — The earlier 44-pixel touch-target finding is only half fixed

- Earlier finding: “several mobile link targets are below 44 px.” The earlier report did not assign an ID, so this review assigns the recurrence `F-1-1`.
- Exact location: landing page, 390 px, “Read the privacy note →”.
- Confirmed result: its rendered box is 195×19 px. All tested demo, Privacy, and Terms controls met 44 px, but the current mobile geometry test checks `/privacy/` only and never checks this landing link.
- Why this matters: a person using touch or imprecise pointer control receives a target less than half the required height on a product intended for assistive input.
- Concrete fix: give `.privacy-section a` at least 44 px of rendered height and add a 390 px test that checks every visible interactive target on `/`, `/demo/`, `/privacy/`, and `/terms/`.

#### F-1-2 — The unvalidated reliability conclusion remains in live copy

- Earlier finding: “the brief's outcome threshold is not validated.” The repair correctly changed result verdicts, but it did not remove all reliability conclusions.
- Exact live quotes: app header “Local reliability check” and real-setup h1 “Is your gaze setup steady enough right now?”
- Contradicting disclosure: “These pixel bands have not been validated across eye trackers or screen sizes.”
- Why this matters: the header and question imply that this unvalidated comparison can decide whether a setup is reliable or “steady enough.” A first-time visitor can reasonably take that as the promised answer.
- Concrete fix: use “Local pointer comparison” and “Compare your gaze pointer right now.” Reserve reliability/readiness wording until the documented cross-device study exists.

#### F-1-3 — App state has broken deep links and browser-back behavior

- Exact locations and results:
  - `/#history` opens the marketing landing h1, not **Past checks**.
  - `/demo/#setup` opens the completed sample, not setup.
  - **Past checks** and **Prepare the check** change the rendered screen without changing history.
  - After **Start for real** and **Prepare the check**, Back returns to the marketing landing document instead of the preceding setup screen.
  - **Start for real** rewrites `/demo/` to `/` without loading the route represented by `/`; reloading then swaps the app setup for the landing page.
- Code location: `src/app/main.ts` listens for `hashchange`, but initial rendering ignores the current hash and screen transitions do not call `pushState`.
- Why this matters: shared URLs do not open the named state, refresh changes the experience, and Back does not undo the last app transition.
- Concrete fix: define stable app routes or hashes, resolve them on first load, call `pushState` for user-visible transitions, restore state on `popstate`, and focus/announce the restored h1. Add direct-load, reload, Back, and Forward tests.

#### F-1-4 — Five passing claim commands do not prove the whole listed claim

All 13 commands exited zero, but five tests do not meet the observable-outcome rule:

| Claim | Gap | Required test change |
| --- | --- | --- |
| `offline-reload` | The claim says “landing site and demo”; the test visits and reloads `/` only. | Prime `/demo/`, go offline, reload `/demo/`, and confirm the sample and controls still work. |
| `keyboard-high-contrast` | Reduced motion is enabled only after completion, and no animation/transition is asserted. | Enable it before the check; confirm the full flow works and computed motion is removed. |
| `report-export` | The test checks the filename and one text fragment, not that the HTML is standalone. | Parse the download and confirm it has no external scripts, styles, images, or network dependencies. |
| `installer-checksum` | The test searches installer source for hash-function and error strings. It does not execute either installer or confirm rejection on a mismatch. | Run each installer against a controlled invalid checksum and confirm it stops before install/open. |
| `thirty-second-check` | The quantitative assertion is only `<= 30,000 ms`; an immediate result would pass “about 30 seconds.” | Assert a justified lower and upper bound around the intended 25.2-second nine-target timing. |

Any untested portion of a listed claim blocks acceptance even when the current command passes.

#### F-1-5 — Public claim-like statements remain unlisted

`.factory/claims.json` has no entry that covers each statement below. Some have unrelated or narrower tests; none has one claim entry and one tagged test for the exact observable promise.

| Exact quote and location | Why it is unlisted | Concrete fix |
| --- | --- | --- |
| Landing: “Works without a network after installation” | `offline-reload` checks the web landing route, not an installed desktop build. | Add an installed-app offline test or change the fact to “This sample reloads offline after your first visit.” |
| Landing: “Hardware calibration can be correct while today’s position has changed.” | No claim entry or evidence tests this hardware statement. | Remove it or add documented evidence and a suitable claim check. |
| Landing: “The app reads ordinary pointer coordinates.” / “Your gaze-controlled system pointer is sampled locally while each target settles.” | `pointer-measures` checks populated sample labels, not live coordinate sampling. | Add one pointer-sampling claim and drive known pointer positions through all nine targets. |
| Landing: “There is no login, cloud sync, advertising, analytics, or cursor control.” | `local-private` covers requests, camera use, and absence of a login link, but not cursor control or every named capability. | Narrow the sentence to tested behavior or extend the claim and source/runtime checks. |
| Landing status: “Version 0.1.1 · unsigned builds · checksums on the release page” | The release test uses a fixture and never confirms the live release or checksum asset. | Add a recorded release-manifest assertion for version, signing status, and `SHA256SUMS`, or remove the status details. |
| README: “The desktop app offers the same sample from Load sample project.” | `sample-demo` checks only the website action. | Exercise the desktop/app setup action in the tagged sample claim. |
| README: “A gaze device that controls the system pointer needs no special integration.” | No test checks a representative gaze-controlled system pointer. | Recast as a compatibility requirement or add a supported-device integration check. |
| README: “Mouse or touch mode lets someone explore the same flow.” | No claim entry covers either complete input path. | Add a tagged mouse/touch flow claim or remove the promise. |
| README: “Local history is capped at 50 checks and can be cleared.” | `history-limit` checks the cap only. | Test clearing, or split the sentence and remove the untested half. |
| README: “The desktop app requests no camera permission, account, or network connection.” | The tagged privacy test runs the browser demo, not the installed desktop app or its permissions. | Inspect the packaged permissions and run the installed app offline in the tagged test. |
| README: “The static download site contacts only the GitHub Releases API…” | `release-download` checks selection and caching, not an exclusive request log. | Add a landing request-log claim that allows same-origin plus `api.github.com` only. |
| README: “Published packages are on the GitHub Releases page” and the all-platform build list | The release fixture does not confirm that each public package exists. | Add a recorded release inventory claim or make this release-process documentation explicitly non-normative. |
| README: “The build identifier is embedded from `GITHUB_SHA`.” | No claim entry inspects the built app. | Add a build-identity test or remove the public promise. |
| README: “`staticwebapp.config.json` supplies security headers, immutable asset caching, and the 404 response.” | Existing non-claim tests inspect the file, but the statement has no claim entry and no live response test. | Add one deployment-behavior claim with live-equivalent response assertions. |
| README: “Generated botanical imagery is original to this project…” | Provenance is documented but absent from the claim inventory. | Add a provenance claim backed by the source metadata, or move it to non-product contributor notes. |
| README: “Every public product claim and its browser test is listed in `.factory/claims.json`.” | The rows above make this self-audit statement false. | Complete the manifest, then add a copy-to-manifest coverage check. |

### Minor

#### F-1-6 — The phone first screen omits the three required facts

- Exact location: at 390×844, `.plain-facts` begins at y=928. The viewport ends at y=844.
- Why this matters: the first screen does answer what/who/first action, but visitors must scroll to see privacy, offline, and price facts required by the first-screen pattern.
- Concrete fix: place the copy before the 240-pixel image on phones, shorten the image, or compact the hero so the facts finish above y=844.

#### F-1-7 — Route metadata and the shared shell are incomplete

- `/demo/`, `/privacy/`, `/terms/`, and the 404 have no Open Graph title/image or Twitter card.
- `/demo/` has no Privacy or Terms link and no “Built by Param Factory” credit.
- `/privacy/`, `/terms/`, and the 404 omit the build/version identifier; the current-route Privacy/Terms link also disappears instead of keeping a consistent footer.
- The 404 header contains no navigation.
- Concrete fix: use one shared metadata/header/footer component for every route, retain both policy links on every footer, include build identity, and add route-specific social metadata using the existing 1200×630 image.

#### F-1-8 — Several labels break the plain-word and terminology rules

| Exact copy/location | Problem | Proposed rewrite |
| --- | --- | --- |
| Landing fact label “Device-aware” | Vague adjective; it does not name a user-visible result. | “Comparison only” |
| Landing heading “Transparent measurements, not a pass” | “Transparent” is an unsupported adjective. | “The report shows measurements, not a pass” |
| App/404: “Field check 01”, “pollen mark”, “Specimen 1 of 9”, “Local notebook”, “This field card is missing” | Botanical metaphor/lore replaces task vocabulary and conflicts with `target`, `check`, and `history`. | “Check”, “target”, “Target 1 of 9”, “Local history”, “Page not found” |
| Desktop button “Load sample project” | The product has checks, not projects; it differs from “sample data” and “sample check.” | “Load sample check” |
| Demo button “Start for real” | It does not name the resulting action or screen. | “Start a new check” |
| App button “Past checks” | A noun is used as an action button. | “View past checks” or make it a route link. |
| Landing visible button “Copy” | The visible verb omits the result, although its accessible name is better. | “Copy install command” |
| README “CORS-enabled GitHub API”, “Tauri frontend”, “static artifact”, and “service worker precaches the complete generated shell” | Contributor jargon makes the README harder to scan. | Use “GitHub release service”, “desktop web files”, “website files”, and “saves every required page and file for offline reload.” |

#### F-1-9 — External links are not identified as external

- Exact locations: landing **Source** and **All releases**; Privacy **public repository**.
- Why this matters: each link leaves the product origin without saying so, contrary to the site-structure contract.
- Concrete fix: label them “Source on GitHub (external)”, “Releases on GitHub (external)”, and “public repository on GitHub (external)”.

## Copy audit

Word counts treat a hyphenated term, number, URL, or code token as one word. There are no sentences over 22 words and no banned marketing words. Flags and rewrites are in F-1-2, F-1-5, and F-1-8.

### Landing page sentences and sentence-like facts

| Words | Exact copy |
| ---: | --- |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 7 | Opens a completed check; nothing is saved |
| 5 | No camera access or account |
| 6 | Works without a network after installation |
| 4 | Free and open source |
| 9 | Version 0.1.1 · unsigned builds · checksums on the release page |
| 6 | macOS and Windows builds are unsigned. |
| 9 | Your system may ask you to confirm the publisher. |
| 8 | The nine seeds mirror the app’s target layout. |
| 6 | Pointer processing stays in the app |
| 4 | Results are comparison guides |
| 4 | Keyboard and high-contrast paths |
| 4 | No telemetry or advertising |
| 6 | Save details only when you choose. |
| 6 | The app reads ordinary pointer coordinates. |
| 7 | Review error, dwell, drift, and next steps. |
| 10 | Hardware calibration can be correct while today’s position has changed. |
| 8 | This app checks the pointer you already use. |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. |
| 11 | Your gaze-controlled system pointer is sampled locally while each target settles. |
| 11 | Review target error, drift direction, dwell reliability, and concrete next steps. |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 5 | Directional drift in plain words |
| 5 | Dwell steadiness across nine targets |
| 5 | Standalone HTML report for support |
| 8 | Example only; compare results on your own device. |
| 9 | It observes pointer positions from your existing gaze software. |
| 11 | There is no login, cloud sync, advertising, analytics, or cursor control. |
| 12 | It does not diagnose a condition or replace your device maker’s calibration. |
| 6 | Demo data uses separate browser storage |
| 7 | Compare gaze-pointer patterns before a demanding task. |
| 11 | Botanical imagery generated for this project with the Factory image model. |

Conditional landing states are also copy:

| Words | Exact copy |
| ---: | --- |
| 4 | Downloads are being published. |
| 7 | Open the releases page to check again. |
| 6 | Mac architecture could not be detected |
| 8 | Select and copy the install command shown above. |

Accessible image text:

| Words | Exact alt text |
| ---: | --- |
| 10 | Pressed fern around nine copper seeds arranged as calibration points |
| 11 | Setup screen for choosing eye pointer, mouse, touch, or keyboard input |
| 10 | Nine-point check showing a gold target on a paper-like field |
| 9 | Completed sample with error, dwell, drift, and nine-point map |

### Landing headings and actions

| Words | Exact copy | Check |
| ---: | --- | --- |
| 3 | Nine-target pointer comparison | Informative label |
| 8 | Check your gaze pointer before a demanding task | Clear h1 |
| 5 | Try it with sample data | Result-naming action |
| 3 | Download the app | Result-naming action |
| 3 | Install another way | Clear summary |
| 2 | Desktop walkthrough | Clear section label |
| 6 | See the complete check before installing | Clear h2 |
| 3 | Note the setup | Clear caption |
| 3 | Visit nine targets | Clear caption |
| 3 | Compare the pattern | Clear caption |
| 3 | How it works | Clear section label |
| 6 | Compare the pointer in three steps | Clear h2 |
| 3 | Note the circumstances | Clear h3 |
| 3 | Visit nine targets | Clear h3 |
| 3 | Compare the pattern | Clear h3 |
| 4 | What the report shows | Clear section label |
| 5 | Transparent measurements, not a pass | Flagged in F-1-8 |
| 3 | Example check complete | Clear label |
| 3 | Pattern within guide | Clear example result |
| 3 | Privacy and limits | Clear section label |
| 6 | The app never requests camera access | Clear h2 and listed claim |
| 4 | Read the privacy note | Result-naming link; target size fails F-1-1 |
| 4 | Try the sample first | Clear section label |
| 5 | Review a completed check now | Clear h2 |
| 5 | Try it with sample data | Result-naming action |
| 1 | Copy | Flagged in F-1-8 |
| 1 | Local | Paired with a concrete fact |
| 1 | Device-aware | Flagged in F-1-8 |
| 1 | Accessible | Paired with a concrete fact |
| 1 | Private | Paired with a concrete fact |
| 1 | Copied | Clear completion state |

### README sentences and headings

| Words | Type | Exact copy |
| ---: | --- | --- |
| 3 | H1 | Gaze Calibration Card |
| 15 | Sentence | Gaze Calibration Card is a free desktop utility for people who rely on eye input. |
| 12 | Sentence | It compares an eye-controlled pointer across nine targets before a demanding task. |
| 10 | Sentence | The result shows pointer error, directional drift, and dwell reliability. |
| 7 | Sentence | The pixel bands are device-dependent comparison guides. |
| 11 | Sentence | They have not been validated across eye trackers or screen sizes. |
| 16 | Sentence | The app does not certify a setup, replace the device maker’s calibration, or provide a diagnosis. |
| 3 | H2 | Try the sample |
| 7 | Sentence | Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. |
| 8 | Sentence | The demo uses the separate `demo:gaze-calibration-card:checks:v1` storage key. |
| 12 | Sentence | Reset demo restores the bundled sample; Start for real discards demo data. |
| 11 | Sentence | The desktop app offers the same sample from Load sample project. |
| 8 | Sentence | See `.factory/demo.md` for the fixture and isolation details. |
| 12 | Sentence | Every public product claim and its browser test is listed in `.factory/claims.json`. |
| 3 | H2 | How it works |
| 11 | Sentence | The app samples ordinary pointer coordinates exposed by the operating system. |
| 12 | Sentence | A gaze device that controls the system pointer needs no special integration. |
| 11 | Bullet | Eye-controlled pointer mode measures nine targets automatically in about 30 seconds. |
| 10 | Bullet | Mouse or touch mode lets someone explore the same flow. |
| 12 | Bullet | Keyboard practice supports Tab, Space, and Enter without producing a gaze score. |
| 7 | Bullet | Setup notes are attached only after approval. |
| 11 | Bullet | Local history is capped at 50 checks and can be cleared. |
| 10 | Bullet | A completed result exports as a standalone HTML support report. |
| 11 | Sentence | The desktop app requests no camera permission, account, or network connection. |
| 8 | Sentence | It includes no analytics, telemetry, or cloud storage. |
| 21 | Sentence | The static download site contacts only the GitHub Releases API to find current packages and caches that metadata for one hour. |
| 3 | H2 | Develop and verify |
| 12 | Sentence | Requirements: Node.js 22+, npm, Rust stable, and the Tauri 2 system prerequisites. |
| 16 | Sentence | Use `npm run dev` for the desktop UI and `npm run dev:site` for the landing site. |
| 15 | Sentence | The production build writes the Tauri frontend to `dist/app` and the static deploy to `dist/site`. |
| 1 | H2 | Install |
| 8 | Sentence | Published packages are on the GitHub Releases page. |
| 17 | Sentence | The landing page reads the CORS-enabled GitHub API and selects Windows, Linux, or a detected Mac architecture. |
| 10 | Sentence | If Mac architecture cannot be detected, it offers both builds. |
| 10 | Sentence | Both installers verify SHA256 before installing or opening the download. |
| 14 | Sentence | Packages are unsigned: on macOS, right-click and choose Open if Gatekeeper blocks the app. |
| 6 | Sentence | Windows may show an unknown-publisher confirmation. |
| 3 | H2 | Release and deploy |
| 5 | Sentence | Tag `v*` or dispatch `.github/workflows/release.yml`. |
| 18 | Sentence | GitHub Actions builds Intel and Apple-silicon macOS packages, Windows packages, Linux AppImage and Debian packages, `SHA256SUMS`, and `latest.json`. |
| 7 | Sentence | The build identifier is embedded from `GITHUB_SHA`. |
| 6 | Sentence | Deploy `dist/site` as the static artifact. |
| 11 | Sentence | `staticwebapp.config.json` supplies security headers, immutable asset caching, and the 404 response. |
| 12 | Sentence | The service worker precaches the complete generated shell for first-visit offline reloads. |
| 3 | H2 | Privacy and license |
| 12 | Sentence | The public privacy and terms pages describe local storage and device-dependent limits. |
| 8 | Sentence | Source code is available under the MIT License. |
| 13 | Sentence | Generated botanical imagery is original to this project; provenance is recorded in `.factory/design.md`. |

### Terminology check

| Concept | Current variants | Required single term |
| --- | --- | --- |
| Measured cursor | gaze pointer, pointer pattern, eye-controlled pointer, system pointer, gaze-controlled system pointer | `pointer` after one definition |
| Measurement position | target, mark, pollen mark, specimen, seed | `target` |
| Activity | check, field check, comparison, sample project | `check` |
| Bundled example | sample data, sample check, sample project, bundled sample | `sample check` |
| Saved results | history, Past checks, local notebook | `history` |
| Hold quality | dwell reliability, dwell steadiness | define once, then use `dwell` consistently |

## Demo, sandbox, privacy, and offline evidence

- The first action reaches `/demo/` in one click.
- The first demo screen shows “Pattern within comparison guide,” 42 px average error, 91% dwell, a directional pattern, 108 samples, and nine map points.
- The persistent banner says “Demo — sample data, nothing is saved” and exposes Reset demo and Start for real.
- A marker in `gaze-calibration-card:checks:v1` survived entry, reset, export, and leave. Demo state used `demo:gaze-calibration-card:checks:v1`; leaving removed that key.
- Export produced `gaze-check-2026-08-30.html`.
- A fresh demo request log contained only the product origin. The camera stub was not called. There were no console errors.
- A fresh first visit installed `gaze-card-site-v2`, including hashed JS/CSS, AVIF/WebP, demo, policy, and 404 resources. Offline reload returned the landing h1 without console errors.

Demo behavior passes apart from the route/history defect in F-1-3 and the incomplete offline-demo test in F-1-4.

## Claims execution from a clean clone

Clean clone: candidate `1cfcde92…`, followed by `npm ci`. Every manifest command was run separately.

| Claim id | Command result | Coverage review |
| --- | --- | --- |
| `sample-demo` | PASS | Adequate for web demo isolation/reset/leave |
| `offline-reload` | PASS | Partial; demo route not exercised |
| `local-private` | PASS | Adequate for browser demo request/camera behavior |
| `nine-targets` | PASS | Adequate |
| `pointer-measures` | PASS | Adequate for populated report output |
| `keyboard-high-contrast` | PASS | Partial; reduced-motion behavior not asserted |
| `report-export` | PASS | Partial; standalone nature not asserted |
| `notes-opt-in` | PASS | Adequate |
| `history-limit` | PASS | Adequate for cap only |
| `release-download` | PASS | Adequate for fixture-based selection/cache |
| `installer-checksum` | PASS | Partial; installers are not executed against a mismatch |
| `free-open-source` | PASS | Adequate |
| `thirty-second-check` | PASS | Partial; no lower timing bound |

Additional clean-clone checks: `npm test` passed 6/6; `npm run build` passed and produced `dist/app` and `dist/site`.

## Structure, links, accessibility, and visual identity

- Root, Demo, Privacy, and Terms return 200. A missing path returns the designed 404 with HTTP 404.
- Root title follows “Product — what it does.” Demo, Privacy, Terms, and 404 have route titles. Every checked route has `lang=en`, one h1, one main, a description, canonical, SVG favicon, and Apple touch icon.
- Root has the 1200×630 social image and OG/Twitter metadata; F-1-7 records the missing route metadata elsewhere.
- Every crawled internal link returned its expected status. GitHub source/releases returned 200. The detected v0.1.1 AppImage resolved through a 302 to a 200 asset of 76,564,984 bytes.
- The live root has CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and the declared permissions policy. Hashed JS is immutable; `sw.js` is no-cache/no-store.
- Axe found zero serious or critical violations on `/`, `/demo/`, `/privacy/`, and `/terms/` at 390 and 1440 px. There was no horizontal overflow or console error. `verify-url.sh` confirmed HTTP 200, title, `lang`, one h1, main, complete alt text, and labeled buttons.
- The pressed-fern field-guide identity is distinct, product-specific, and consistent with `.factory/design.md`; it is not a generic SaaS layout.

## Earlier finding verification

The earlier reports used prose headings instead of finding IDs. This table preserves those headings and maps any recurrence to this review’s ID.

| Earlier finding | Live + code result |
| --- | --- |
| Required claims gate absent | Partly fixed: manifest and 13 passing commands exist, but F-1-4 and F-1-5 leave claims untested/unlisted. **BLOCKING again.** |
| First-read and demo gates fail | Core gate fixed: audience/job/action are visible and demo isolation works. Mobile fact placement remains as F-1-6. |
| Offline reload fails after first visit | Fixed on live first visit and in service-worker cache inspection. |
| Focus is lost at workflow state changes | Fixed for setup, ready, targets, result, stopped, and history in code/tests. Route history remains broken under F-1-3. |
| Outcome threshold is not validated | Half fixed: result bands are qualified, but reliability/“steady enough” wording remains. **BLOCKING again as F-1-2.** |
| Deployment security and caching incomplete | Fixed in live response headers and configuration. |
| Routing and metadata incomplete | Partly fixed: real 404 and core metadata exist; F-1-3 and F-1-7 remain. **BLOCKING again where routing is broken.** |
| Mobile link targets below 44 px | Half fixed: footer/policy links pass; landing privacy link remains 19 px. **BLOCKING again as F-1-1.** |
| Release discovery/build identity fragile | Fixed: GitHub metadata, one-hour cache, Mac fallback, and build id are present. |

## Missed leverage

No AI feature is warranted. The job is deterministic, local, and privacy-sensitive. Export already addresses the obvious support handoff. Cloud sync would conflict with the local-first brief unless it were explicit and optional. No additional feature finding is raised.

## What would make this perfect

Resolve F-1-1 through F-1-9, then repeat the review from fresh contexts. In particular: remove the remaining unvalidated reliability wording, make app screens real navigable states, bring every public claim under a complete observable test, place the three facts in the phone first screen, and use one metadata/header/footer shell across every route. “Perfect” means the rerun finds zero blocking and zero minor findings.
