# Gaze Calibration Card — visual thesis

## Direction

**Botanical field guide for a dependable line of sight.** The app treats calibration as a short field observation, not a clinical exam. Nine check points are “specimens” on a quiet paper field; results read like a hand-marked survey card. This is calm, adult, and recognizable without implying medical precision. Decoration explains the task: the hero’s nine berries and sight lines mirror the nine-target check.

## Palette

Light is the primary treatment, like a well-kept field notebook; a full dark treatment follows the device setting.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| paper / background | `#F3F0E5` | `#17201B` | page field |
| leaf / surface | `#FCFAF2` | `#212C25` | working sheets |
| ink / text | `#17251E` | `#F5F2E8` | primary text |
| moss / muted | `#59685F` | `#BAC5BC` | supporting text |
| fern / accent | `#286047` | `#87CFA8` | primary actions and focus |
| pollen / accent warm | `#C7882C` | `#E7B968` | active target and attention |
| good | `#236644` | `#8AD6AB` | reliable result |
| caution | `#8B5516` | `#F0C374` | borderline result |
| danger | `#9A3E35` | `#F0A39B` | unreliable/error |
| graphite rule | `#C9C7BA` | `#47544B` | dividers and control outlines |

All body/color pairings meet 4.5:1; state always includes wording or symbols, never color alone.

## Typography

- Display and headings: **Georgia**, an installed serif with the authority of specimen captions.
- UI, data, and body: **system sans** (`Inter`-like platform stack) for crisp instructions. No font downloads.
- Scale: 16px body, 18px lead, 21px h3, 28px h2, 40–56px h1. Data uses tabular figures.
- Measures: instructions max 62ch; long policy copy max 72ch.

## Spacing and form

- 4/8px rhythm: 4, 8, 12, 16, 24, 32, 48, 64.
- Corners are clipped/pressed-paper rather than bubbly: 4–14px radii. Rules and tiny registration marks evoke a survey sheet.
- Working controls are at least 48px; primary actions are dark fern blocks with a small arrow.
- Cards appear only for independent things (saved checks, individual setup facts). Primary workflow stays a single continuous sheet.

## Interaction grammar

- **Observe → mark → interpret.** Setup gathers the input method and optional circumstance notes. The check presents one large target at a time. Results reveal a nine-cell map, directional drift, dwell reliability, and a plain-language verdict.
- Gaze-compatible input: pointer position is sampled during the final 1.2-second settle window, so a compatible eye tracker that controls the system pointer works without camera access. Keyboard users focus each target and press Space/Enter. Pointer/click users activate it directly.
- Active targets use a pollen center and two rings. Completion leaves a small ink “pressing” in the target’s former position.
- Feedback is immediate and written in a polite field-note voice.

## Motion policy

- 180–260ms opacity/transform transitions connect stages; the target arrives from the next survey coordinate rather than floating decoratively.
- The target’s settle ring contracts once over the 2.8-second observation period to communicate dwell timing. Nothing loops.
- With `prefers-reduced-motion`, movement and contraction are removed; state changes use immediate opacity and clear text.

## Original asset plan and provenance

One generated hero still life depicts a pressed fern curving around nine copper berries on warm paper, with faint graphite sight lines. It is explanatory, not a UI screenshot. UI icons and target marks are hand-authored SVG/CSS.

### Prompt sheet

- Subject: pressed fern frond, exactly nine small round berry/seed specimens, faint gaze/survey rays and registration dots.
- World: archival botanical field notebook, assistive-technology calibration interpreted as careful observation.
- Materials: deckled warm paper, graphite, dry ink, pressed leaf, tiny copper-gold seeds.
- Light/lens: flatbed-scanner clarity, soft raking daylight, top-down, generous negative space.
- Palette words: warm paper, deep forest ink, fern green, oxidized copper, pollen gold.
- Negative list: people, eyes, faces, medical devices, UI screens, text, letters, numbers, logos, watermarks, gradients, neon, glossy 3D.

Final generation prompt: “Top-down archival botanical field-guide plate on warm deckled paper. A single graceful pressed fern frond curves around a complete calibration arrangement of EXACTLY NINE small copper-gold round seed specimens. The nine seeds must be plainly visible and separated, in exactly three complete horizontal rows with exactly three seeds in each row, a clear 3 by 3 matrix: 3 top, 3 middle, 3 bottom. Faint graphite sight lines and tiny registration dots suggest careful measurement. Flatbed-scanner clarity with soft raking daylight, dry ink and tactile paper fibers, deep forest green and pollen-gold restrained palette, generous quiet negative space, elegant editorial still life. No additional fruit or seeds, no missing positions, no people, no eyes, no faces, no medical devices, no interface screenshot, no text, no letters, no numbers, no logo, no watermark, no gradient, no neon, no glossy 3D.”

Generated with the Factory Azure image deployment (`factory-image`), 2026-08-28. The first candidate was rejected because it contained only eight specimens; the accepted candidate was visually reviewed for count, text artifacts, brands, seams, and palette. Original asset for this project; prompt and generation metadata live beside the source in `assets/src/hero-field-guide.json`. Production exports are AVIF/WebP and are disclosed in the footer.

## Responsive intent

- Desktop: instructions and live survey area share the sheet; results pair verdict with the nine-cell map.
- 390px: the illustration becomes a short masthead crop; setup and result columns stack; secondary explanatory prose collapses behind details. The active target retains at least 64px and the page uses safe-area padding.
- The calibration stage locks to a viewport-height workspace; navigation is minimized so the target field remains usable.
