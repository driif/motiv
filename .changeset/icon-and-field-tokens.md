---
"@driif/motiv": minor
---

New tokens `--motiv-icon-size` (20px) and `--motiv-icon-size-sm` (16px), and the base token `--motiv-field-scale` (1.25): set it to `1` to make fields as high as a small button. `IconButton`, `BellButton` and `BadgeButton` now read them: their boxes are `--motiv-field-height` high (40px instead of 48, 52 and 56px) with a 20px icon; a small `IconButton` has a 16px icon in a `--motiv-control-height` box.
