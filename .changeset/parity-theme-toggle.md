---
"@driif/motiv": minor
---

Drawn `ThemeToggle` and `OrbitalThemeToggle` and matrix `GlitchThemeToggle` (`ThemeToggle`) take an optional `dark`: leave it out and they follow `data-theme` on the root element, with the state picked by CSS before hydration.
