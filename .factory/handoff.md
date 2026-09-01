# Gaze Calibration Card — review 1 handoff

**Verdict: FAIL**

**Work order:** `gaze-calibration-card-review-1`

**Candidate:** `1cfcde92e101fa0b156a283d7f43da72d64868ec`

**Reviewed:** 2026-09-01 UTC

## What was done

- Reviewed the live site cold at 390×844 and 1440×900.
- Audited every landing/README sentence and heading for length, jargon, terminology, and action wording.
- Exercised the one-click sample, reset, leave, export, real/demo storage isolation, request log, camera behavior, and first-visit offline reload.
- Ran every `.factory/claims.json` command separately from a clean clone.
- Rechecked every earlier verification finding against the live site and current source.
- Checked titles, h1/main structure, metadata, 404, headers, cache policy, links, app deep links/history, mobile targets, axe results, and visual identity.
- Reviewed missed AI/import/export/sync leverage. No AI addition is justified; export already covers the brief’s support handoff.
- Did not modify product code.

## Verification summary

- All 13 listed claim commands exited zero, but five claim assertions are incomplete and public claims remain unlisted; see F-1-4 and F-1-5.
- `npm test`: PASS, 6/6.
- `npm run build`: PASS; `dist/app` and `dist/site` produced.
- Live `verify-url.sh`: PASS for HTTP/title/lang/h1/main/alt/button/console basics.
- Live axe: zero serious/critical findings on `/`, `/demo/`, `/privacy/`, and `/terms/` at 390 and 1440 px.
- Live demo isolation/privacy/offline checks: PASS.
- Live link crawl: expected statuses; missing route returns designed HTTP 404.

## What remains

The review records five blocking and four minor findings in `.factory/review-1.md`. The most urgent are the remaining 19-pixel landing privacy target, unvalidated reliability wording, broken app deep links/Back behavior, incomplete claim assertions, and unlisted public claims.

Run the full review again after those findings are addressed. A passing claims command alone is not sufficient where its assertions do not cover the full published claim.
