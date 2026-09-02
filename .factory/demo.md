# Sample demo

- URL: `https://gaze-calibration-card.sociobot.in/?demo=1`, which opens `/demo/#result` (direct URL: `https://gaze-calibration-card.sociobot.in/demo/`).
- Desktop entry: choose **Load sample check** on the setup screen.
- Sample: a completed morning check for a wheelchair user with an adjusted headrest, distance glasses, even indoor light, nine readings, 42 px mean error, and 91% dwell.
- Banner: **Demo — sample data, nothing is saved** remains visible throughout demo mode.
- Reset: **Reset demo** restores the bundled sample. **Start a new check** removes demo data and opens reloadable `/check/#setup`.
- Isolation: demo history uses `demo:gaze-calibration-card:checks:v1`. Real history uses `gaze-calibration-card:checks:v1`; demo code never reads or writes that key.
