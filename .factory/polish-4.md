# Polish 4 — final finding closure

Repair commit: `e1d670bab514117d0b04366535d896d28d907580` · desktop release: [v0.1.6](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.6) · live URL: <https://gaze-calibration-card.sociobot.in/>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Expanded `release-download` to cover Windows, Linux, Apple-silicon Mac, Intel Mac, and an unavailable-Mac-architecture fallback with both Mac links. The registry wording now names every branch. | `npm run test:claims -- --grep @claim:release-download` passed; [v0.1.6 release](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.6) contains all platform assets and `latest.json`; live landing cold check showed “Version 0.1.6 · a matching download is ready.” |
| F-4-2 / F-1-7 | Made the wordmark link to `/` in the app. Added the same four global destinations—Demo, How it works, Privacy, and Source—on landing, app, policy, and 404 routes. Kept Past checks as a separate app utility. Mobile shows every global link. | `every route keeps the shared home header and navigation at desktop and phone widths`; live [audit JSON](evidence/polish-4/live/live-audit.json), [landing screenshot](evidence/polish-4/live/live-landing-390.png), and live `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`. |
| F-4-3 / F-1-8 | Replaced README contributor jargon with “Deploy the website files in `dist/site`.” The terminology audit keeps pointer, target, check, history, and dwell consistent. | `copy audit matches current built visitor copy and declares only release and build values as dynamic`; [copy audit](copy-audit.md); live `/`. |
| F-4-4 | Rebuilt the copy audit from current visitor strings, including navigation, footer, shell command, and all conditional download states. The test rebuilds the site and compares every static audited string; only `{release version}` and `{build id}` are declared dynamic. | `tests/copy-audit.test.ts`; `npm test` passed; [copy audit](copy-audit.md). |
| F-1-1 | Retained 44px controls and added the shared header’s mobile target checks. | `mobile controls meet the 44 pixel touch target`; live mobile audit and [landing screenshot](evidence/polish-4/live/live-landing-390.png). |
| F-1-2 | Retained comparison-only setup and result language; no readiness, reliability, or diagnostic conclusion is shown. | `@claim:comparison-bands-limit`, `@claim:not-a-diagnosis`; live `/demo/` and [demo screenshot](evidence/polish-4/live/live-demo-390.png). |
| F-1-3 | Retained direct hash routes, `pushState`/`popstate`, heading focus, and reloadable `/check/` recovery. | `app routes load directly and browser back restores the prior screen`; live `/demo/#setup` → `/check/#setup` in [audit JSON](evidence/polish-4/live/live-audit.json). |
| F-1-4 | Retained complete observable claim coverage, then added the missing release platform branches. | All 18 exact commands in [claims.json](claims.json) passed independently after `npm ci`; `tests/claims.test.ts` enforces one tag per claim. |
| F-1-5 | Retained an exact claim registry for every public reliance statement; the unknown-Mac fallback is now included in `release-download`. | `claim registry maps every registered claim to exactly one runnable tagged test`; [claims.json](claims.json). |
| F-1-6 | Retained the compact phone hero/fact order while exposing the full mobile navigation. | Live audit records facts bottom at 815px in an 844px viewport; [landing screenshot](evidence/polish-4/live/live-landing-390.png). |
| F-1-9 | Retained visible “(external)” labels on GitHub destinations, including the new all-route header link. | Shared-header Playwright test; live all-route audit. |
| F-3-1 | Retained artifact-backed shell checksum and unsigned-package checks. The current release was rebuilt at v0.1.6. | `@claim:installer-checksum`, `npm run test:unsigned-builds`; v0.1.6 checks four package signatures after SHA256 verification. |
| F-3-2 | Retained exact no-account/privacy copy and tests; removed untestable advertising and publisher-prompt promises. | `@claim:no-account`, `@claim:local-private`; live demo request log contains only product-origin requests. |
| F-3-3 | Retained the plain definition of dwell before its abbreviated labels. | `@claim:pointer-measures`, `@claim:report-export`; landing, app, report, and README audit. |

## Earlier verification findings

The final live audit rechecked the prior result-integrity, offline, demo-isolation, routing, metadata, 404, CSP, focus, mobile reflow, and console-error fixes. It found zero serious/critical Axe violations or console errors across every public route. Demo reset preserved a real storage marker; exit removed the demo namespace; landing and demo reloaded offline; and the 404 returned HTTP 404.

Evidence: [final live audit](evidence/polish-4/live/live-audit.json), [mobile landing](evidence/polish-4/live/live-landing-390.png), [mobile demo](evidence/polish-4/live/live-demo-390.png), and [mobile real check](evidence/polish-4/live/live-check-390.png).
