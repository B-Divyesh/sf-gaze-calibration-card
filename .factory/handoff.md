# Gaze Calibration Card — adversarial review 3 handoff

## Delivered

- Wrote `.factory/review-3.md` without changing product code.
- Reviewed production cold at 390×844 and 1440×900, including direct demo entry, reset, storage isolation, offline/privacy request behavior, routes, metadata, links, and accessibility.
- Ran `npm ci`, all 17 declared `@claim:*` commands independently, `npm test`, `npm run build`, and `npm run test:unsigned-builds`.

## Result

**FAIL.** The live product flow is clear and tryable, but `.factory/review-3.md` records two blocking evidence/claim findings and one minor plain-language finding:

1. The installer and unsigned-package assertions are not fully observed by their registered clean-sandbox tests.
2. Account, advertising, and publisher-confirmation promises are not exact registered claims.
3. “Dwell” is not defined for a cold visitor.

## Verification notes

- All runnable claim commands passed; `@claim:thirty-second-check` passed in 33.2s command wall time.
- The Linux review image has neither `pwsh` nor `powershell`, so the registry’s separately stated Windows checksum command could not be run here. This is recorded as an untested portion of the two-installer claim, not as a product-code failure.
- `npm test` passed 7 tests; `npm run build` produced `dist/app` and `dist/site`; `npm run test:unsigned-builds` passed.
- Fresh live Axe scans found zero serious/critical violations on landing, demo, policy pages, and the designed 404.

## Next steps

Implement the concrete fixes in review 3, deploy, then repeat the entire adversarial checklist from fresh browser contexts and a clean dependency install.
