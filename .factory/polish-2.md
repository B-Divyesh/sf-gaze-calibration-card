# Polish 2 — complete finding closure

Candidate reviewed: `990fbcffc213966b7901b5db0fa6506c4a2d5313` · repaired 2026-09-01.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the 44px landing privacy link and full mobile control audit from polish 1. | `tests/e2e/site.spec.ts` mobile touch-target test; final `npm run test:e2e` pass. |
| F-1-2 | Retained comparison-only verdicts; removed visitor-visible raw reliability labels from history and removed the remaining reliability-score phrase. | `src/app/main.ts`; final browser suite; live `/demo/` check after deploy. |
| F-1-3 | Retained stable hash routes, direct-load rendering, push/pop history, title, focus, and announcements. | `tests/e2e/app.spec.ts` direct route/back-forward test; live `/demo/#setup`. |
| F-1-4 | Made release metadata coverage prove same-origin/GitHub-only request allowance plus reuse below and refetch above the 1-hour boundary. Added a real PowerShell corrupt-download runner to Windows CI; it asserts no `Start-Process` and deletes the corrupt file. | `@claim:release-download`; `@claim:installer-checksum`; `tests/installer-checksum.ps1`; `.github/workflows/ci.yml`. |
| F-1-5 | Registered the unvalidated-band limit, non-diagnosis/calibration limit, and unsigned-build statement. Added app/export observable tests for the two interpretation limits and package-signing checks in release CI. | `@claim:comparison-bands-limit`, `@claim:not-a-diagnosis`, `@claim:unsigned-builds`; `.factory/claims.json`; release workflow package checks. |
| F-1-6 | Retained phone-first fact ordering and compact hero image. | `tests/e2e/site.spec.ts` phone first-screen test; final browser suite. |
| F-1-7 | Retained shared headers, route-specific metadata/social cards, policy links, build identity, and 404 shell. | `tests/e2e/site.spec.ts` metadata/config tests; live route check after deploy. |
| F-1-8 | Standardized the product vocabulary: gaze-controlled pointer on first mention, then pointer; target; check; dwell. Replaced marks, points, per-mark, eye-controlled pointer, dwell steadiness/reliability, and raw reliable history labels. Split README release instructions under 22 words. | `.factory/copy-audit.md`; `rg` copy audit; app/browser tests. |
| F-1-9 | Retained explicit external-link labels. | `tests/e2e/site.spec.ts` accessible-shell test; live crawl after deploy. |

## Current evidence

- Clean `npm ci`, then `npm run lint`, `npm test`, and `npm run build` passed.
- All 17 `@claim:*` commands were run independently from the clean install and passed. The Linux worker has no PowerShell runtime; the exact PowerShell corrupt-download test is now executed by the required `windows-latest` CI job.
- `npm run test:e2e -- --reporter=line` passed: 58 tests across desktop and 390px mobile.
- `npm run test:lighthouse` passed: mobile performance 99/100/100, accessibility 100/100/100.
- Screenshots/live evidence will be recorded in `.factory/handoff.md` after deployment.
