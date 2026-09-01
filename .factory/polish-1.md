# Polish 1 — finding closure

| Finding | Change | Evidence |
| --- | --- | --- |
| F-1-1 | Gave the landing privacy link and every demo/footer control a 44px minimum; added full-route mobile audit. | `site.spec.ts` mobile controls test; `evidence/polish-1/landing-390.png` |
| F-1-2 | Replaced “Local reliability check” and “steady enough” with local pointer-comparison language. | `app.spec.ts` accessible setup; `evidence/polish-1/demo-desktop.png` |
| F-1-3 | Added stable hash routes, push/pop history, direct-load restoration, titles, focus, and announcements. | `app.spec.ts` route/back test |
| F-1-4 | Expanded all incomplete claim assertions: demo offline, reduced motion, standalone report, shell mismatch execution, and bounded timing. | 14 `@claim:*` tests |
| F-1-5 | Removed unsupported promises and added pointer-sampling coverage; narrowed privacy/offline copy to tested browser behavior. | `.factory/claims.json`; `@claim:pointer-sampling` |
| F-1-6 | Put headline, actions, and facts before the phone illustration and reduced its height. | `site.spec.ts` phone first-screen test; `evidence/polish-1/landing-390.png` |
| F-1-7 | Added route-specific social metadata plus a consistent header/footer/build identity. | `site.spec.ts` route metadata test |
| F-1-8 | Replaced botanical workflow labels and vague labels with pointer, target, check, history, sample check, and explicit actions. | `.factory/copy-audit.md` |
| F-1-9 | Marked GitHub destinations as external. | landing shell test |

The controller additions map to F-1-1 (44px), F-1-2/F-1-4 (testable wording), F-1-3 (deep links and Back), F-1-4/F-1-5 (registry/assertions), and F-1-6 through F-1-9 (every minor).
