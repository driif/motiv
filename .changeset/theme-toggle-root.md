---
"@driif/motiv": minor
---

The `ThemeToggle` `dark` prop is optional: without it the toggle follows `data-theme` on the root element, and CSS picks the icon before hydration, so a server-rendered page needs no pre-paint script.
