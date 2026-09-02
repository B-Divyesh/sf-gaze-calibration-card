# Gaze Calibration Card — independent verification 8 handoff

## Status: FAIL

Candidate `394c2c03edb54251e1316c3cfb66911a51a208a9` was independently tested at <https://gaze-calibration-card.sociobot.in/> on 2026-09-02 UTC. The live deployment identifies this build and is byte-for-byte identical to the fresh production site build for every checked HTML, JS, CSS, and service-worker file.

Release is blocked by two high-severity result-integrity defects:

1. If the user clicks Start and the gaze pointer never moves again, the app reuses that stale click coordinate for all nine targets and reports nine current samples instead of no pointer input.
2. Reloading or directly opening `/check/#result` outside demo mode substitutes the bundled 42 px sample result for the user's result, without a demo banner, and renders zero map points.

Exact steps, observed values, cause, impact, and required regression coverage are in [.factory/verification-8.md](verification-8.md).

## Verification summary

- All 18 `.factory/claims.json` commands: PASS after `npm ci`.
- `npm test`: PASS, 8/8.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/app` and `dist/site` produced.
- `npm run test:e2e`: PASS, 57 passed and 7 intentional skips.
- `npm run test:lighthouse`: PASS; performance 96/99/99, accessibility 100/100/100, median performance 99.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- `npm run test:unsigned-builds`: PASS for EXE, MSI, and both Mac app archives.
- Live semantic, console, axe, desktop, 390px mobile, keyboard-only, forced-colors, reduced-motion, privacy-request, response-header, cache, link, service-worker update, and offline checks: PASS.
- Release `v0.1.4`: PASS for exact candidate target, platform matrix, checksum manifest, and downloaded Debian checksum/version.
- Local Rust checks were attempted but could not start because this worker lacks the Tauri Linux prerequisite `glib-2.0.pc`. The exact candidate's four-platform release workflow succeeded.

This verification changed documentation only. Product code was not modified.

## Re-run

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:lighthouse
npm run test:unsigned-builds
```

Run every `test` string in `.factory/claims.json` separately. With Tauri's Linux prerequisites installed, also run:

```sh
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

## Next steps

Fix the two high-severity findings without weakening the existing claims, add the described regressions, rebuild and release a new version, deploy that exact commit, then repeat independent verification.
