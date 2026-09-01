# Gaze Calibration Card — polish 1 handoff

**Work order:** `gaze-calibration-card-polish-1`
**Base:** `c780b097d535be561ec4bba82aa339c8d14a5788`
**Repair commit:** `45c574b242433aa0f6a7bb6bc433858f876fec86`
**Verdict:** repaired and deployed.

## What changed

- Replaced unvalidated reliability/readiness wording with local pointer-comparison language.
- Made `?demo=1` redirect into the isolated sample. Demo has a persistent banner, reset, and Start a new check; demo storage remains separate.
- Made app screens addressable states with history navigation, reload handling, title updates, focus restoration, and live announcements.
- Completed claim coverage for demo offline reload, reduced motion, standalone export, pointer sampling, history clearing, bounded timing, and shell-installer checksum mismatch.
- Unified policy/404 metadata, navigation, footer policy links, build identity, social cards, external-link labels, and 44px targets.
- Reworked phone ordering so the three plain facts finish in the 390×844 first screen while preserving the field-guide visual identity.

## Verification

- `npm run lint` — PASS.
- `npm test` — PASS (6 tests).
- `npm run build` — PASS; produces `dist/app` and `dist/site`. Initial JS gzip: app 8.46 KB; site main 1.61 KB; demo 8.19 KB.
- Every manifest claim command was run with `npm run test:claims -- --grep @claim:<id>`: 14/14 PASS. The 30-second check met its 24–30s interval.
- `npx playwright test tests/e2e/app.spec.ts --project=desktop` — 4/4 PASS.
- `npx playwright test tests/e2e/app.spec.ts --project=mobile` — 3 PASS, 1 expected pointer-path skip.
- `npx playwright test tests/e2e/site.spec.ts --project=desktop` — 4 PASS, 2 viewport-specific expected skips.
- `npx playwright test tests/e2e/site.spec.ts --project=mobile` — 6/6 PASS, including all visible targets ≥44px and facts within 844px.
- Axe runs in the landing/app browser tests for light, dark, forced-colors, and reduced-motion flows; zero serious or critical violations.
- Lighthouse (live landing, headless Chromium): Performance 100; Accessibility 100.
- `verify-url.sh` was not present in this worker image. Equivalent browser checks cover title, lang, one h1, main, alt text, console errors, and focus.

Evidence screenshots: `.factory/evidence/polish-1/landing-390.png`, `.factory/evidence/polish-1/demo-desktop.png`, and the cold live check `.factory/evidence/polish-1/live-demo-390.png`.

## Live check

Deployed with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`. Cold checks passed at `https://gaze-calibration-card.sociobot.in/`, `/demo/`, `/privacy/`, `/terms/`, and `/does-not-exist` (HTTP 404). The live `?demo=1` URL redirected to `/demo/#result`, showed the persistent banner and sample h1, and logged no browser console errors. Live headers include CSP with `frame-ancestors 'none'`, `nosniff`, strict referrer policy, and camera-denying permissions policy.

## Known gaps

None in the product repair. The PowerShell checksum branch is source-asserted because this Linux worker has no PowerShell runtime; the POSIX mismatch path is executed.

## Deploy

Deploy `dist/site` with `/opt/fleet/lib/deploy-static.sh gaze-calibration-card dist/site`, then cold-open the landing, demo, policy pages, and a missing route.
