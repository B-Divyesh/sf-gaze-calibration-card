# Polish 3 — complete finding closure

Candidate repaired from `ba55e4997e8d76546f15adc0600b9d28d5d6da6a` on 2026-09-02. Review 2 repeated F-1-4, F-1-5, and F-1-8; those IDs are mapped once below with the later recurrence evidence. No finding is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept every visible mobile link, button, and summary at least 44px high, including the new real-check route. | `mobile controls meet the 44 pixel touch target`; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live `/`, `/check/`, `/demo/`, `/privacy/`, and `/terms/` audit records a 358×64px primary action. |
| F-1-2 | Kept the result as a comparison guide. The app and export say the bands are device-dependent, unvalidated, non-diagnostic, and not pass/fail. | `@claim:comparison-bands-limit` and `@claim:not-a-diagnosis`; [.factory/evidence/polish-3/live/live-demo-390.png](evidence/polish-3/live/live-demo-390.png); live `/demo/#result`. |
| F-1-3 | Preserved hash history/focus and added `/check/` as the real, reloadable destination when leaving demo. `?demo=1` still enters the isolated result directly. | `leaving demo opens a reloadable real check route`, app route/back test, and `@claim:sample-demo`; [.factory/evidence/polish-3/live/live-check-390.png](evidence/polish-3/live/live-check-390.png); live `/?demo=1` → `/demo/#result` → `/check/#setup`, including reload. |
| F-1-4 | Expanded the registry to 18 exact claims, added a registry unit test enforcing one tag and one runnable command per claim, and made the remaining installer/signing checks observable. | `claim registry maps every registered claim to exactly one runnable tagged test`; all 18 commands passed independently from a clean clone; [.factory/evidence/polish-3/live/live-demo-390.png](evidence/polish-3/live/live-demo-390.png); live demo/privacy/offline audit. |
| F-1-5 | Registered the no-account promise. Expanded the privacy claim to setup notes. Removed the advertising and publisher-prompt predictions. Kept all remaining claim copy aligned with `.factory/claims.json`. | `@claim:no-account`, `@claim:local-private`, `@claim:unsigned-builds`, and the registry test; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live `/` and `/privacy/`. |
| F-1-6 | Kept the job, audience, sample action, its outcome, and all three facts before the 844px phone fold. | `phone first screen includes the three plain facts`; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live audit measured the facts bottom at 780px. |
| F-1-7 | Added complete metadata and build input for `/check/`, kept route-specific titles/metadata on every route, included `/check/` in the sitemap/service worker, and retained the real 404 and security headers. | `every public route has one clear page structure and no serious accessibility issue`, metadata/config tests; [.factory/evidence/polish-3/live/live-check-390.png](evidence/polish-3/live/live-check-390.png); live `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`, plus an unknown route returning 404. |
| F-1-8 | Kept `gaze-controlled pointer`, `pointer`, `target`, `check`, and `history` consistent. Defined dwell as how steadily the pointer stays on each target in the landing, app, export, and README. | Landing shell wording assertion and [.factory/copy-audit.md](copy-audit.md); [.factory/evidence/polish-3/live/live-demo-390.png](evidence/polish-3/live/live-demo-390.png); live `/` and `/demo/`. |
| F-1-9 | Kept visible “(external)” labels for GitHub source and release destinations and added an exact accessible-name assertion. | `landing page has a complete accessible shell`; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live landing source/release links. |
| F-3-1 | Narrowed the public checksum claim to the shell installer and made its tagged test execute the production script against corrupt bytes. Replaced source-text signing evidence with downloads and binary inspection of the latest EXE, MSI, Intel Mac app, and Apple-silicon Mac app; GitHub digests are checked first. | `@claim:installer-checksum`, `@claim:unsigned-builds`, and `npm run test:unsigned-builds`; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live `/` install details and latest GitHub release. |
| F-3-2 | Added and tested the exact no-account promise. Removed the unregistered advertising promise and publisher-confirmation prediction. Reworded privacy text to the measured data boundary. | `@claim:no-account`, `@claim:local-private`, and `@claim:unsigned-builds`; [.factory/evidence/polish-3/live/live-landing-390.png](evidence/polish-3/live/live-landing-390.png); live `/` and `/privacy/`. |
| F-3-3 | Defined dwell at its first landing, app, export, and README uses, then retained the short label in measurement tables. | Landing shell dwell assertion, `@claim:pointer-measures`, and `@claim:report-export`; [.factory/evidence/polish-3/live/live-check-390.png](evidence/polish-3/live/live-check-390.png); live `/` and `/check/`. |

## Earlier unnumbered verification findings

| Finding | Final disposition and evidence |
| --- | --- |
| Missing claims gate | `.factory/claims.json` has 18 independently passing commands; `tests/claims.test.ts` enforces complete one-to-one tags. |
| Missing first-read demo and walkthrough | The first screen states job/audience/action/facts; `?demo=1` opens the isolated sample; three app walkthrough frames remain in the botanical field-guide landing. See the three live screenshots above. |
| First-visit offline failure and later flaky offline test | `@claim:offline-reload` owns its browser context; full and standalone clean-clone runs pass. `live-audit.json` records landing reload plus demo reload/reset offline. |
| Lost workflow focus | App route tests verify heading focus after setup, ready, result, Back/Forward, and leaving demo. The new `/check/` route reloads without losing state. |
| Unvalidated readiness threshold | Visitor wording is comparison-only and the two interpretation claims inspect both screen and exported report. |
| Missing security/cache/metadata/404 | Live headers include CSP/frame denial/nosniff, immutable hashed assets remain configured, all routes have metadata, and an unknown live URL returns the designed 404 with status 404. |
| Fragile release discovery and Mac selection | `@claim:release-download` proves GitHub API selection, Apple architecture branches, and one-hour cache expiry/refetch. |
| History-limit race | `@claim:history-limit` passed alone and in the 57-test clean-clone suite after waiting for the persisted deletion. |
| 200% phone overflow | The 390px browser test covers landing, demo, and `/check/`; `live-audit.json` records equal scroll/client widths. |
| Lighthouse below 90 | Three clean-clone mobile runs scored 99/100, 100/100, and 100/100 for performance/accessibility; median performance 100. |
| Linux packaging and stale desktop release | The pinned Ubuntu workflow installs the GTK compatibility link and uses extracted AppImage helpers. Release `v0.1.4` is built from the final candidate for Linux, Windows, and both Mac architectures. |
| Live build identity mismatch | The final site is built with `GITHUB_SHA` from the final commit and redeployed; the footer exposes that build. |

## Evidence index

- Live automated audit: [.factory/evidence/polish-3/live/live-audit.json](evidence/polish-3/live/live-audit.json)
- Worker verifier: [.factory/evidence/polish-3/live/verify.json](evidence/polish-3/live/verify.json)
- Local desktop/mobile captures: [.factory/evidence/polish-3/local](evidence/polish-3/local)
- Live URL: <https://gaze-calibration-card.sociobot.in/>
