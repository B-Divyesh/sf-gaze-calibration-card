# Gaze Calibration Card — verification handoff

## Status: PASS

Independent verification 9 accepts candidate `2f099d02d1f1c2877b9b39ce5629c055de948b1f` at <https://gaze-calibration-card.sociobot.in/>. Full evidence is in [verification-9.md](verification-9.md).

No product code was changed. This handoff and the independent verification report are the only intended changes.

## What was verified

- All 18 commands in `.factory/claims.json` passed individually from the clean checkout.
- The cold first screen plainly identifies the job, intended user, and one-click sample action.
- `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, `npm audit --audit-level=high`, `npm run test:lighthouse`, and `npm run test:unsigned-builds` passed.
- `cargo check --locked` and `cargo test --locked` passed after installing the release workflow's documented Linux prerequisites.
- The live real keyboard and pointer workflows, HTML export, Escape cancellation, malformed-storage recovery, missing-result recovery, demo isolation, privacy requests, reduced motion, service-worker update, and offline reload passed.
- Live desktop and 390 px routes had no serious/critical axe finding or console/page error. Every visible mobile control was at least 44 px, and 200% text caused no horizontal overflow.
- Candidate and live output matched byte-for-byte across the HTML pages and runtime shell files checked; the footer reports build `2f099d02d1f1`.
- GitHub Release `v0.1.5` has Windows, Intel/Apple-silicon macOS, and Linux assets. A downloaded Debian package matched both published digests and survived a 12-second native smoke run.
- The two verification-8 result-integrity defects were reproduced against the repaired live build and are fixed: a stopped pointer yields zero samples, and an empty real result deep link never shows demo metrics.

## Defects

- Critical/high/medium: none.
- Low: `.factory/copy-audit.md` still contains a version 0.1.4 conditional-copy example. Production correctly shows 0.1.5; word-count and plain-language results are unchanged.

## Re-run

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:lighthouse
npm run test:unsigned-builds
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
node tools/audit-live.mjs https://gaze-calibration-card.sociobot.in /tmp/gaze-live-audit
```

Run each `.factory/claims.json` `test` value separately before the aggregate suite.

## Known limits / operator action

- The fixed pixel bands remain device-dependent and unvalidated. The UI and exports describe them as comparison guides, not a pass, diagnosis, or replacement for vendor calibration.
- Windows and macOS packages remain unsigned as disclosed. Publisher signing requires operator certificates.
- There is no backend, sign-in, payment, product-unlock call, or AI feature.
