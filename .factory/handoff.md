# Gaze Calibration Card — polish 2 handoff

## Delivered

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`; the finding-by-finding matrix is in `.factory/polish-2.md`.
- Made release metadata testing observe its whole public behavior: only same-origin/GitHub requests, cache reuse before one hour, and refetch after expiry.
- Added an executable Windows PowerShell corrupt-download test. It runs the real installer code with controlled network/process helpers and proves checksum failure happens before `Start-Process`.
- Added testable interpretation limits for device-dependent, unvalidated bands and the non-diagnostic/non-calibration limitation, in the landing, result, export, README, and claim registry.
- Added Windows Authenticode and macOS signing-state checks to the desktop release workflow. The release job rejects a publisher-signed package because this product deliberately publishes unsigned builds.
- Standardized visitor vocabulary to gaze-controlled pointer → pointer, target, check, and dwell. The final copy audit is `.factory/copy-audit.md`.
- Bumped the desktop app and release configuration to `0.1.3`.

## Local verification from a clean dependency install

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:claims -- --grep @claim:<each-id>
npm run test:e2e -- --reporter=line
npm run test:lighthouse
npm run test:unsigned-builds
```

Results:

- `npm run lint` — passed.
- `npm test` — 7/7 passed.
- `npm run build` — passed; produces `dist/app` and `dist/site`. Site initial JavaScript gzip: 1.63 KB landing and 8.17 KB demo; CSS gzip: 6.45 KB.
- Each of the 17 declared `@claim:*` commands passed independently. `@claim:release-download` now verifies cache boundary and request origin; `@claim:comparison-bands-limit`, `@claim:not-a-diagnosis`, and `@claim:unsigned-builds` are new.
- `npm run test:e2e -- --reporter=line` — 58 passed across desktop and 390px mobile.
- `npm run test:lighthouse` — passed. Mobile performance: 99, 100, 100. Accessibility: 100, 100, 100.
- `npm run test:unsigned-builds` — passed.
- This Linux worker does not have `pwsh`; `.github/workflows/ci.yml` runs `tests/installer-checksum.ps1` on `windows-latest` after push.

## Deploy and release evidence

Pending the final push, `v0.1.3` release workflow, static deployment, and cold live recheck. This section is updated with the exact commit, CI run, release assets, deployment ID, and live route checks after those actions complete.

## Operator action

None for product behavior. Desktop packages remain intentionally unsigned. Future signing would require `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`; changing that policy also requires changing the tested unsigned-build messaging.
