# Adversarial first-read review 3 — Gaze Calibration Card

**Verdict: FAIL**

- Candidate reviewed: `ec0618f51a690b235f52cabe0a86a7e7c1ae5002`
- Live URL: <https://gaze-calibration-card.sociobot.in/>
- Reviewed: 2026-09-02 UTC
- Contexts: new Chromium contexts at 390×844 and 1440×900; a separate fresh demo context; clean `npm ci`
- Findings: 2 blocking, 1 minor

The first screen is clear, the live demo is usable, the earlier routing/mobile/metadata defects are repaired, and all runnable declared commands pass. This review still fails because public installer/privacy claims exceed what the registered sandbox evidence proves, and the landing uses an unexplained measurement term.

## Cold first read before scrolling

### 390×844

In my own words: this lets a person who controls a pointer with their eyes compare today's pointer behaviour before a demanding task, especially after a change in posture, glasses, light, or fatigue. I should click **Try it with sample data**; it opens a completed check and does not save it.

The exact text that supplied the answers was:

- What: “Check your gaze-controlled pointer before a demanding task”.
- Who and situation: “For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes.”
- First action and outcome: “Try it with sample data” / “Opens a completed check; nothing is saved”.

This gate passes. At 390px the primary action measured 358×64px. All three plain facts finished at y=780.4 in the 844px viewport.

### 1440×900

The same job, audience, first action, and three facts were visible without scrolling. This gate passes.

## Findings

### Blocking

#### F-3-1 — The installer and signing claims are not fully proven by the declared clean-sandbox tests

This is a recurrence of the evidence defect previously recorded as F-1-4.

| Claim / exact quote | Evidence checked | Why this remains blocking | Concrete fix |
| --- | --- | --- | --- |
| `installer-checksum`: “The shell and PowerShell installers verify SHA256 before using a download.” README: “Both installers verify SHA256 before installing or opening the download.” | The tagged test at `tests/e2e/claims.spec.ts:242` executes only `public/install.sh`; it has no PowerShell execution. The registry appends `Windows CI: pwsh -File tests/installer-checksum.ps1`, but that is not the tagged test and `pwsh`/`powershell` is absent in this clean Linux sandbox. | A passing `npm run test:claims -- --grep @claim:installer-checksum` proves only the shell installer. The listed claim promises two installers, and the review could not execute the second stated test from this sandbox. | Make one registered, runnable claim test exercise both production installers against a corrupt fixture, including `install.ps1` in a provisioned Windows/PowerShell sandbox; record its command and result as the claim evidence. Alternatively narrow the public claim to the shell installer until the PowerShell test is available to the verifier. |
| `unsigned-builds`: “macOS and Windows builds are unsigned.” | `@claim:unsigned-builds` only checks that the sentence is visible (`claims.spec.ts:277`). `npm run test:unsigned-builds` only searches workflow text for signing-check strings. Neither test inspects a release artifact. | Page wording and workflow source do not prove the signing state of the downloadable macOS and Windows packages a visitor is asked to install. The registry’s final prose about release CI is not a clean-sandbox observable result. | Download the published Windows installer and both Mac packages in a release-artifact claim test. Assert `NotSigned` with Windows tooling and no Developer ID signature with `codesign`, or remove the signing-state promise from visitor copy. |

Both `@claim:*` commands exited 0; the finding concerns the unobserved portions of the claims, not an exit-code failure.

#### F-3-2 — Three visitor-facing privacy/install promises have no matching claims entry

This is a recurrence of F-1-5. The nearest entry, `local-private`, promises no camera access, no pointer-data transmission, and no telemetry. It does not register the additional promises below.

| Exact quote / location | Why a visitor could rely on it | Concrete fix |
| --- | --- | --- |
| Landing fact and meta description: “No camera access or account” | “No account” is a separate promise from camera access. The current tagged test merely checks that no login link is rendered; the registry does not state or test that no account can be created or required. | Add a `no-account` claim whose demo flow confirms every meaningful action works without authentication and whose request log confirms no auth endpoint, or change the fact to the already-registered “No camera access”. |
| Landing trust fact: “No telemetry or advertising” | `local-private` covers telemetry requests. It neither names nor proves the absence of advertising; a same-origin advertisement would pass its request-origin assertion. | Add a `no-advertising` claim that checks the rendered app/shell contains no advertising surface or ad request, or reduce the fact to “No telemetry”. |
| Landing and README install copy: “Your system may ask you to confirm the publisher.” | This is a platform-behaviour promise used to prepare someone for installation. It is not the same assertion as “the builds are unsigned”, and no registry entry or runnable test verifies it. | Remove this prediction and link to the platform’s unsigned-app guidance, or register a platform-specific, artifact-backed test with the exact supported wording. |

### Minor

#### F-3-3 — “Dwell” is used as unexplained measurement jargon

- Exact locations: landing walkthrough “Review error, dwell, drift, and next steps”; landing report list “Dwell across nine targets”; README opening “The report shows target error, directional drift, and dwell.”
- Why it matters: a cold visitor can understand the task but cannot tell what the percentage labelled **Dwell** represents. “Dwell” and “directional drift” are measurement vocabulary, not plain wording by themselves.
- Concrete fix: introduce the metric once where it first appears: “Dwell: how steadily the pointer stays on each target.” Then use **Dwell** consistently as the short label.

## Copy audit

Counts treat hyphenated terms, URLs, numbers, and code tokens as one word. No landing or README sentence exceeds 22 words. No banned marketing adjective or mood/metaphor heading was found. The only plain-words flag is F-3-3; the claim-bearing copy is separately flagged in F-3-1 and F-3-2.

### Landing page

| Words | Copy |
| ---: | --- |
| 3 | Nine-target pointer comparison |
| 8 | Check your gaze-controlled pointer before a demanding task |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 5 | Try it with sample data |
| 7 | Opens a completed check; nothing is saved |
| 3 | Download the app |
| 3 | Detecting your system… |
| 5 | No camera access or account |
| 6 | Sample reloads offline after first visit |
| 4 | Free and open source |
| 4 | Checking published desktop builds… |
| 8 | Version 0.1.3 · a matching download is ready. |
| 3 | Install another way |
| 3 | Copy install command |
| 6 | macOS and Windows builds are unsigned. |
| 9 | Your system may ask you to confirm the publisher. |
| 10 | Pressed fern around nine copper seeds arranged as calibration points |
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
| 4 | Dwell across nine targets |
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
| 4 | Read the privacy note |
| 4 | Try the sample first |
| 5 | Review a completed check now |
| 5 | Try it with sample data |
| 6 | Demo data uses separate browser storage |
| 7 | Compare pointer patterns before a demanding task. |
| 4 | Built by Param Factory |

### README

| Words | Copy |
| ---: | --- |
| 3 | Gaze Calibration Card |
| 11 | Compare a gaze-controlled pointer across nine targets before a demanding task. |
| 9 | It is for people who rely on eye input. |
| 9 | The report shows target error, directional drift, and dwell. |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 13 | This comparison does not diagnose a condition or replace your device maker’s calibration. |
| 3 | Try the sample |
| 7 | Open <https://gaze-calibration-card.sociobot.in/demo/> for a completed sample check. |
| 8 | The demo uses `demo:gaze-calibration-card:checks:v1`, separate from real history. |
| 6 | Reset demo restores the bundled sample. |
| 7 | Start a new check discards demo data. |
| 8 | See `.factory/demo.md` for the sample and isolation details. |
| 12 | Every public product claim and its browser test is listed in `.factory/claims.json`. |
| 3 | How it works |
| 10 | The app records ordinary system pointer coordinates during each target. |
| 12 | The gaze-controlled pointer mode visits nine targets automatically in about 30 seconds. |
| 12 | Keyboard practice supports Tab, Space, and Enter without producing a gaze score. |
| 7 | Setup notes are stored only after approval. |
| 11 | Local history keeps at most 50 checks and can be cleared. |
| 10 | A completed result exports as a standalone HTML support report. |
| 14 | The browser sample requests no camera access and sends no pointer data or telemetry. |
| 20 | The download page contacts the GitHub release service only to find current packages and stores that result for one hour. |
| 3 | Develop and verify |
| 11 | Requirements: Node.js 22+, npm, Rust stable, and the Tauri 2 prerequisites. |
| 16 | Use `npm run dev` for the desktop UI and `npm run dev:site` for the download page. |
| 15 | The production build writes the desktop files to `dist/app` and the website files to `dist/site`. |
| 1 | Install |
| 9 | Published packages are on the GitHub Releases page (external). |
| 11 | The landing page selects Windows, Linux, or a detected Mac architecture. |
| 10 | If Mac architecture cannot be detected, it offers both builds. |
| 10 | Both installers verify SHA256 before installing or opening the download. |
| 6 | macOS and Windows builds are unsigned. |
| 9 | Your system may ask you to confirm the publisher. |
| 3 | Release and deploy |
| 5 | Tag `v*` or dispatch `.github/workflows/release.yml`. |
| 12 | GitHub Actions builds macOS, Windows, and Linux packages plus `SHA256SUMS` and `latest.json`. |
| 10 | The Ubuntu release job supplies the GTK helper compatibility link. |
| 8 | It runs AppImage helpers without a FUSE device. |
| 20 | After installing Tauri prerequisites, run `APPIMAGE_EXTRACT_AND_RUN=1 CI=true npm run tauri build -- --bundles appimage` to reproduce the Linux AppImage check. |
| 6 | Deploy `dist/site` as the static artifact. |
| 3 | Privacy and license |
| 12 | The public privacy and terms pages describe local storage and device-dependent limits. |
| 8 | Source code is available under the MIT License. |
| 6 | Image provenance is recorded in `.factory/design.md`. |

## Demo, sandbox, privacy, and offline verification

- The first landing action reached `/demo/#result` in one click. Its first screen showed a realistic completed check: 42px average target error, 91% dwell, a directional result, 108 local pointer samples, and nine target readings.
- The persistent banner said **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start a new check**.
- A pre-seeded `gaze-calibration-card:checks:v1` marker survived demo entry, Reset demo, and leaving demo. The demo used no real-storage key.
- In a fresh direct-demo request log, Reset demo and export made only same-origin requests. No camera request and no console error occurred.
- The runnable `@claim:offline-reload` test reloaded the landing and demo after the first visit while offline, then operated Reset demo.

## Claim commands

After `npm ci`, all 17 registry `@claim:*` commands passed independently: `sample-demo`, `offline-reload`, `local-private`, `nine-targets`, `pointer-measures`, `pointer-sampling`, `keyboard-high-contrast`, `report-export`, `notes-opt-in`, `history-limit`, `release-download`, `installer-checksum`, `comparison-bands-limit`, `not-a-diagnosis`, `unsigned-builds`, `free-open-source`, and `thirty-second-check` (33.2 seconds wall-clock command duration; its asserted check duration passed).

Additional local checks passed: `npm test` (7 tests), `npm run build`, `npm run test:unsigned-builds`, and production Axe scans with zero serious/critical violations on `/`, `/demo/`, `/privacy/`, `/terms/`, and the designed 404.

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1, mobile targets | Fixed. The primary mobile demo action is 358×64px; the facts fit in the first 844px screen. |
| F-1-2, unvalidated reliability conclusion | Fixed. The sample uses “Pattern within comparison guide” and includes comparison-only, unvalidated, non-diagnostic limits. |
| F-1-3, deep links and Back | Fixed. Direct `/demo/#setup` opened setup, navigation produced `/demo/#ready`, Back restored `/demo/#setup`, and the h1 received focus on each route change. |
| F-1-4, complete claim proof | **Blocking recurrence:** F-3-1. Shell-only and source-only checks still do not observe every installer/signing assertion. |
| F-1-5, unlisted claims | **Blocking recurrence:** F-3-2. Account, advertising, and publisher-confirmation promises are not registered as exact claims. |
| F-1-6, phone facts below the fold | Fixed. |
| F-1-7, metadata/shared shell | Fixed for the required routes: title, description, canonical, OG/Twitter card, favicon, one h1, main landmark, policy footer, and route-specific 404 all verified live. |
| F-1-8, terminology/plain wording | Terminology is otherwise fixed: `gaze-controlled pointer`, `pointer`, `target`, `check`, and `dwell` are consistent. F-3-3 remains because dwell is not defined for a cold visitor. |
| F-1-9, external labels | Fixed. Product GitHub destinations visibly say “(external)”. |

## Structure, links, identity, and missed leverage

- The live `/`, `/demo/`, `/privacy/`, and `/terms/` routes returned 200. An unknown path returned the designed 404 with status 404. Each had `lang=en`, one h1, one main landmark, a route title, meta description, canonical link, OG/Twitter card, and no serious/critical Axe violation.
- All crawled internal links returned 200 (or the intentional 404); GitHub source and release links returned 200, and the Linux release asset returned a valid 302 download redirect. `robots.txt` and `sitemap.xml` are present and include all public routes.
- The cold landing and demo had no console errors. The browser records an expected failed-resource console message only when directly navigating to the intentional HTTP-404 route.
- The pressed-fern field-guide treatment, paper palette, serif captions, target layout, and non-generic walkthrough match the documented product-specific visual thesis. It does not resemble a generic SaaS template.
- No missing AI feature is raised. This is a deterministic, privacy-sensitive pointer comparison; an AI step would not improve the core job. The support-report export supplies the obvious handoff feature.

## What would make this perfect

Make the installer/signing statements observable in the same claim contract that publishes them, register or remove the three extra visitor promises, and define **dwell** once in plain language. A repeat should then find no untested or unregistered claim and no copy finding.
