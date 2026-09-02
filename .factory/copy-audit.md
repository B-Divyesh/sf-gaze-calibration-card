# Copy audit — polish 3

Reviewed 2026-09-02. Counts treat a URL, number, hyphenated term, or code token as one word. The landing copy below includes headings, actions, facts, image alternatives, conditional status text, and footer copy. No item exceeds 22 words or contains a banned marketing word.

| Words | Landing copy |
| ---: | --- |
| 3 | Nine-target pointer comparison |
| 8 | Check your gaze-controlled pointer before a demanding task |
| 18 | For people who rely on eye input, compare today’s pointer pattern after posture, glasses, light, or fatigue changes. |
| 5 | Try it with sample data |
| 7 | Opens a completed check; nothing is saved |
| 3 | Download the app |
| 3 | Detecting your system… |
| 5 | No camera access or account |
| 6 | Sample reloads offline after first visit |
| 4 | Free and open source |
| 4 | Checking published desktop builds… |
| 8 | Version 0.1.4 · a matching download is ready. |
| 3 | Install another way |
| 3 | Copy install command |
| 9 | The Windows installers and macOS app bundles are unsigned. |
| 10 | Pressed fern around nine copper seeds arranged as calibration points |
| 8 | The nine seeds mirror the app’s target layout. |
| 3 | On this device |
| 6 | Pointer processing stays in the app |
| 2 | Comparison only |
| 4 | Results are comparison guides |
| 2 | Keyboard access |
| 4 | Keyboard and high-contrast paths |
| 2 | No telemetry |
| 5 | No pointer data is sent |
| 2 | Desktop walkthrough |
| 6 | See the complete check before installing |
| 3 | Note the setup |
| 6 | Save details only when you choose. |
| 3 | Visit nine targets |
| 8 | The app records pointer positions during each target. |
| 3 | Compare the pattern |
| 10 | Dwell shows how steadily the pointer stays on each target. |
| 3 | How it works |
| 6 | Compare the pointer in three steps |
| 8 | Use the pointer your gaze system already controls. |
| 8 | Compare this check with your own comfortable sessions. |
| 3 | Note the circumstances |
| 10 | Optionally record posture, lenses, room light, or a monitor adjustment. |
| 3 | Visit nine targets |
| 10 | The app records local pointer positions while each target settles. |
| 3 | Compare the pattern |
| 9 | Review target error, drift direction, dwell, and next steps. |
| 4 | What the report shows |
| 7 | The report shows measurements, not a pass |
| 14 | Pixel bands are device-dependent and have not been validated across eye trackers or screens. |
| 5 | Directional drift in plain words |
| 4 | Dwell for each target |
| 5 | Standalone HTML report for support |
| 3 | Example check complete |
| 4 | Pattern within comparison guide |
| 9 | Example only · compare results on your own device |
| 3 | Privacy and limits |
| 6 | The app never requests camera access |
| 5 | It records local pointer positions. |
| 9 | The browser sample sends no pointer data or telemetry. |
| 13 | This comparison does not diagnose a condition or replace your device maker’s calibration. |
| 4 | Read the privacy note |
| 4 | Try the sample first |
| 5 | Review a completed check now |
| 6 | Demo data uses separate browser storage |
| 7 | Compare pointer patterns before a demanding task. |
| 4 | Built by Param Factory |

Conditional download and error states are also within the limit: “Downloads are being published. Open the releases page to check again.” (11), “Mac architecture could not be detected” (6), and “Select and copy the install command shown above.” (8).

## README and policy check

Every prose sentence in `README.md` is at most 22 words. The GitHub metadata and one-hour cache facts are separate sentences. “Dwell” is defined in the opening before its short label is reused. The landing, app setup, and exported report also define it before relying on the label.

The Privacy and Terms pages use sentences of at most 22 words, except standard legal wording that is split into readable clauses. Account, local-storage, telemetry, camera, diagnosis, and device-limit statements map to registered claim tests.

## Terminology

| Concept | Required term | Used in product copy |
| --- | --- | --- |
| Measured cursor | gaze-controlled pointer on first mention, then pointer | landing, setup, README |
| Measurement position | target | landing, setup, check, map, report |
| Activity | check | landing, app, README |
| Hold measurement | dwell, defined as pointer steadiness on a target | landing, setup, result, export, README |
| Saved results | history | app, privacy, README |
| Bundled example | sample check | landing, demo documentation |

Checks used: `rg` found none of the banned terms in visitor copy. The catalog line starts with “Check,” is one line, and is 80 characters including its newline.
