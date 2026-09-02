# Gaze Calibration Card — verification handoff

## Status: PASS

Independent verification 11 accepted candidate `c08f91a1ac945260dbd8c7c06e6c200c75674882` at <https://gaze-calibration-card.sociobot.in/> on 2026-09-02 UTC. No product code was changed.

## What was verified

- All 18 tests declared in `.factory/claims.json` passed individually from the demo entry point after `npm ci`.
- The cold first screen plainly states the task and audience and offers one-click sample data.
- `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e -- --reporter=line`, `npm audit --audit-level=high`, `npm run test:lighthouse`, and `npm run test:unsigned-builds` passed.
- `cargo check --locked` and `cargo test --locked` passed after adding the normal Linux Tauri development packages to the disposable verifier.
- Independent live desktop/mobile, keyboard, focus, 200% text, dark, forced-colors, reduced-motion, axe, demo isolation, export, invalid-note escaping, error recovery, request logging, browser headers, caching, service-worker update, offline reload, and link checks passed with no console/page errors.
- Live root HTML and hashed JS/CSS matched the candidate production build byte-for-byte. The footer reports `Build c08f91a1ac94`.
- Release `v0.1.6` contains all 11 expected platform/manifest/checksum assets. A downloaded Debian package matched SHA-256, had correct metadata, and opened its published desktop binary under Xvfb.
- Live Lighthouse: 98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.91 s, TBT 0 ms, CLS 0.00016.

Full evidence and the severity assessment are in [`.factory/verification-11.md`](verification-11.md). Cold desktop/mobile and loaded walkthrough captures are in [`.factory/evidence/`](evidence/).

## Known limitations / operator action

- Pixel bands have not been validated across devices or against the brief's 20-check, 90%-agreement measure. The product explicitly presents them as device-dependent comparison guides, not diagnosis or pass/fail.
- Windows and macOS packages are intentionally unsigned and disclose that state. Publisher signing would require operator certificates.
- No release-blocking defect or further operator action was found.
