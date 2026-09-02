# Gaze Calibration Card — polish 4 handoff

## Status: complete

Repair commit: `e1d670bab514117d0b04366535d896d28d907580` (`fix: close review four findings`). Static production deployment and the desktop [v0.1.6 release](https://github.com/B-Divyesh/sf-gaze-calibration-card/releases/tag/v0.1.6) are complete.

The repair closes every finding in review 4 and the earlier reviews:

- The download claim now proves Windows, Linux, Apple-silicon Mac, Intel Mac, unknown-Mac fallback, same-origin/GitHub requests, and the one-hour cache boundary.
- Every route now has a home-linked wordmark and the same Demo, How it works, Privacy, and Source navigation. Mobile keeps all of it visible and touch-sized.
- README says “website files,” not “static artifact.”
- The copy audit is current, includes navigation and conditional states, and is checked against a fresh `dist/site` build.
- The desktop release was bumped to 0.1.6 so the corrected app header is shipped in all published platform builds.

## How to run and verify

```sh
npm ci
npm run lint
npm test
npm run build
npm run test:e2e -- --reporter=line
npm run test:lighthouse
npm run test:unsigned-builds
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

Every exact command in [.factory/claims.json](claims.json) was also run independently after `npm ci`; all 18 passed. The new `@claim:release-download` test passes Windows, Linux, Apple-silicon Mac, Intel Mac, and unavailable-architecture Mac contexts.

## Verification evidence

- `npm test`: 9 tests passed, including the built-output copy-audit check.
- `npm run build`: passed; `dist/app` and `dist/site` produced. Initial static JS is 8.65 KB gzip; CSS is 6.56 KB gzip.
- `npm run test:e2e -- --reporter=line`: 64 passed, 8 expected project skips; Playwright recorded `status: passed`.
- `npm run test:lighthouse`: mobile performance 99/100, 100/100, 100/100; median 100.
- `cargo check --locked` and `cargo test --locked`: passed after installing the standard Linux Tauri GTK/WebKit development prerequisites in the disposable verifier.
- `npm run test:unsigned-builds`: passed against v0.1.6. It verified SHA256 then inspected EXE, MSI, Apple-silicon app archive, and Intel app archive; none has a publisher signature.
- Cold production audit: all `/`, `/check/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` routes had their expected title, one h1, main landmark, alt coverage, no console errors, and zero serious/critical Axe violations. The designed missing route returned HTTP 404.
- Cold 390×844 audit: facts finish at y=815; primary demo control is 358×64; all global navigation is visible; 200% text has no horizontal overflow.
- Live demo audit: `?demo=1` enters `/demo/#result`; the banner, Reset demo, and Start a new check work; demo storage remains isolated; exit opens `/check/#setup`; landing and demo reload offline.
- Live footer reports build `e1d670bab514`; a fresh release lookup reports “Version 0.1.6 · a matching download is ready.”

The worker image did not include a `verify-url.sh`; `tools/audit-live.mjs` performs its title/lang/main/alt/console equivalent and uses Playwright Axe. Final evidence is [live-audit.json](evidence/polish-4/live/live-audit.json), [landing](evidence/polish-4/live/live-landing-390.png), [demo](evidence/polish-4/live/live-demo-390.png), and [real check](evidence/polish-4/live/live-check-390.png).

## Known gaps

None. The app intentionally ships unsigned Windows and macOS packages; that limitation is visibly disclosed and verified against the release. Optional future signing needs `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` from the product owner, but signing is not required for this release.
