# Copy audit — polish 2

Reviewed 2026-09-01. Counts use URLs, numerals, hyphenated words, and code tokens as one word. Every visitor-facing landing sentence is at most 22 words. No landing sentence uses a banned marketing word.

| Words | Landing copy |
| ---: | --- |
| 3 | Nine-target pointer comparison |
| 8 | Check your gaze-controlled pointer before a demanding task |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 5 | Try it with sample data |
| 7 | Opens a completed check; nothing is saved |
| 3 | Download the app |
| 3 | No camera access or account |
| 7 | Sample reloads offline after first visit |
| 4 | Free and open source |
| 3 | Install another way |
| 8 | macOS and Windows builds are unsigned. |
| 9 | Your system may ask you to confirm the publisher. |
| 8 | The nine seeds mirror the app’s target layout. |
| 6 | Pointer processing stays in the app |
| 4 | Results are comparison guides |
| 4 | Keyboard and high-contrast paths |
| 4 | No telemetry or advertising |
| 6 | See the complete check before installing |
| 6 | Save details only when you choose. |
| 9 | The app records pointer positions during each target. |
| 8 | Review error, dwell, drift, and next steps. |
| 6 | Use the pointer your gaze system already controls. |
| 8 | Compare this check with your own comfortable sessions. |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. |
| 10 | The app records local pointer positions while each target settles. |
| 8 | Review target error, drift direction, dwell, and next steps. |
| 8 | The report shows measurements, not a pass. |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 5 | Directional drift in plain words |
| 4 | Dwell across nine targets |
| 5 | Standalone HTML report for support |
| 13 | This comparison does not diagnose a condition or replace your device maker’s calibration. |
| 4 | Read the privacy note |
| 5 | Review a completed check now |
| 5 | Demo data uses separate browser storage |
| 7 | Compare pointer patterns before a demanding task. |

## README and policy checks

The README’s release instructions are split into three sentences: 11, 12, and 19 words. Its opening uses the same limit wording as the landing, result, export, and policy pages. The policy pages retain legal information while keeping the user terms below consistent.

| Concept | Required term | Used in product copy |
| --- | --- | --- |
| Measured cursor | gaze-controlled pointer on first mention, then pointer | setup, landing, README |
| Measurement position | target | landing, setup, check, map, report |
| Activity | check | landing, app, README |
| Hold measurement | dwell | landing, result, export, README |
| Saved results | history | app, privacy, README |
| Bundled example | sample check | demo documentation |

Flagged and fixed in this pass: `gaze pointer`, `eye-controlled pointer`, `mark`, `point`, `per-mark`, `dwell steadiness`, `dwell reliability`, and visitor-visible raw `reliable` verdicts.
