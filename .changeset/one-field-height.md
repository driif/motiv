---
'@driif/motiv': minor
---

New token `--motiv-field-height` (40px by default, scaled by `data-density="compact"`): a medium `Button`, the `Select` and `MultiSelect` triggers and the `SegmentedControl` track now share this one height and the `--motiv-font-size` text size, so a row of them lines up.
`TextField` accepts `labelPosition="above"`, which puts the label over a field-height box like `Select`'s label; the floating label stays the default.
`Button` now has the `--motiv-radius` corners of fields by default instead of a pill; set `--motiv-button-radius: var(--motiv-radius-full)` to keep the pill.
`Badge` centres its text when it is wider than its content.
