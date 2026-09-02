# Gaze Calibration Card — verification 10 handoff

## Status: FAIL — release blocked

Candidate `934bd97b906974ae82810cf0f8de8adf0c9de823` was independently verified against <https://gaze-calibration-card.sociobot.in/> on 2026-09-02 UTC. Do not accept this candidate until both required test commands are reliably green.

The live deployment itself matches the candidate (`Build 934bd97b9069`) and the product works end to end: one-click isolated demo, nine-target pointer comparison, keyboard path, local-only storage, opt-in notes, history clearing, standalone export, offline reload, and desktop packages all passed. All 18 registered claim tests passed when each manifest command was run independently.

## Release-blocking defects

1. `npm test` failed twice from the clean checkout. `tests/copy-audit.test.ts` invokes a production-site build but is limited by Vitest's 5-second default timeout. It timed out at 5.051 s and 5.038 s; with `--testTimeout=10000`, it passed in 8.912 s.
2. `npm run test:e2e -- --reporter=line` exited 1 after 63 passing tests and 8 intentional skips because Chromium crashed before the mobile deployment-config test. The same test passes alone, but the full required suite is unstable.

## Verification summary

- `npm ci`, lint, production build, cargo check/test, Lighthouse, release signature checks: pass.
- Lighthouse mobile: 95/100, 99/100, 98/100 performance; 100 accessibility in every run.
- Live audit: zero serious/critical axe findings and zero console/page errors across landing, check, demo, privacy, terms, and 404 routes; 390px layout and 200% text reflow pass.
- Privacy/network: demo only made same-origin requests; the landing's documented GitHub Release API call is the sole external request. Camera, microphone, geolocation, payment, and USB are denied by policy.
- Release: v0.1.6 contains all 11 expected artifacts. The Linux Debian package checksum matches `SHA256SUMS` and its extracted app stayed open for 12 seconds in Xvfb.

See [verification-10.md](verification-10.md) for commands, full evidence, and severity detail.

## Next steps

1. Fix the copy-audit test deadline and verify `npm test` on a clean checkout.
2. Stabilize the full Playwright mobile run, then rerun `npm run test:e2e -- --reporter=line` until it exits 0.
3. Re-run the 18 exact `.factory/claims.json` commands and the production live audit after the repair.
