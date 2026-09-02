# Gaze Calibration Card — review 4 handoff

## Status: FAIL

Adversarial first-read review 4 is recorded in [review-4.md](review-4.md). Product code was not modified.

The cold first screen and one-click demo pass, all 18 registered claim commands pass, and the local quality suites pass. Four blocking review findings remain:

- F-4-1: the release claim test omits Linux, Intel Mac, and unknown-architecture Mac selection branches.
- F-4-2: earlier shared-header finding F-1-7 remains; app wordmarks link to local `#setup` instead of `/` and app headers omit global navigation.
- F-4-3: earlier plain-words finding F-1-8 remains in README as “static artifact”.
- F-4-4: the prior handoff's stale `.factory/copy-audit.md` defect remains and the audit has another exact-copy mismatch.

## Verification performed

- Fresh 390×844 and 1440×900 cold browser contexts.
- Live demo entry, realistic sample, banner, Reset, real/demo namespace isolation, exit, export, same-origin request log, and offline reload.
- Live metadata/Axe/console checks for `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Live missing-route 404, internal/external link crawl, security headers, mobile touch targets, 200% text reflow, and app Back/focus behavior.
- Every `.factory/claims.json` command run separately: 18 passed.
- `npm run lint`: passed.
- `npm test`: 8 passed.
- `npm run build`: passed and produced `dist/app` and `dist/site`.
- `npm run test:e2e -- --reporter=line`: 62 passed, 8 intentionally skipped.

Evidence is under `.factory/evidence/review-4/`.

## Next steps

Implement the concrete fixes in F-4-1 through F-4-4, deploy the repaired build, and rerun review 4 from fresh contexts. No infrastructure, DNS, billing, secrets, or out-of-scope resources were accessed or changed.
