# Gaze Calibration Card — verification handoff

**Status: FAIL**

Independent verification of candidate `ea5b7d19cab1ae860763f53466b74f4c2990272c` at <https://gaze-calibration-card.sociobot.in> completed on 2026-08-30 UTC. Full evidence and reproduction details are in [verification.md](verification.md).

## Why it fails

- `.factory/claims.json` is missing, which is an automatic release blocker.
- The first screen has no one-click sample demo; `/demo` is only the homepage fallback and `.factory/demo.md` is missing.
- Offline reload after only one visit loses the hashed JS/CSS/AVIF and logs three failed-resource errors.
- Focus falls to `<body>` after setup submission and after the final target, with no state announcement.
- The brief's 90%-agreement outcome across 20 repeated checks has no validation evidence.

Additional defects: no live CSP/frame restriction, 30-second caching even for hashed assets, soft-200 missing routes and no designed 404, incomplete policy/social metadata, sub-44px mobile links, fragile Apple-silicon detection, and a same-origin checked-in release manifest instead of the required cached GitHub API lookup.

## What passed

- `npm ci`, `npm test` (6/6), `npm run build`, `npm run test:e2e` (9 passed, 1 intentional skip), `npm audit`, `cargo check --locked`, and `cargo test --locked` passed. There is no lint script.
- The keyboard, pointer, no-pointer, stop/restart, export, history cap, corrupt-storage, quota-failure, reduced-motion, 390px, 200% text, and threshold-boundary paths were exercised.
- Normal light/dark desktop/mobile axe scans found no serious/critical issues. Focus rings, semantic shell, contrast, and horizontal layout passed; dynamic focus management and small mobile links did not.
- Live normal flows made same-origin requests only and had no console/page errors. The privacy implementation is consistent with source review.
- The live site HTML/JS/CSS/manifest hashes exactly match the candidate build.
- Lighthouse mobile scored 98–100 Performance and 100 for Accessibility, Best Practices, and SEO; measured LCP 1.11 s, TBT 149.5 ms, CLS 0, total transfer 36 KB.
- The v0.1.0 release has Linux, Windows, and both macOS architectures. The Linux install script verified and installed the AppImage in an isolated directory; AppImage and Debian checksums matched published metadata; the extracted AppImage passed a 12-second launch smoke test under Xvfb.

## Re-run

```sh
npm ci
npm test
npm run build
npm run test:e2e
cargo check --locked --manifest-path src-tauri/Cargo.toml
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

Before all other checks, require `.factory/claims.json` and run every listed command through the documented demo entry point. Re-run the cold first-read and first-visit offline tests in fresh browser contexts.

## Scope notes

No product code, deployment, infrastructure, billing, databases, app settings, or secrets were modified. The only repository changes are this verifier documentation. The product has no backend, product-unlock call, account, or sign-in flow, so rate-limit, health, SQLite `/data`, and Entra checks are not applicable.
