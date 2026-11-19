---
"@driif/motiv": minor
---

`MultiSelect` (all styles) shows the selected chips inside the field, next to the chevron, instead of in a row under it. A click anywhere on the field opens the list. Markup: the new `__field` holds the chips and the trigger; a chip is now a `span` with a `__remove` button, so CSS that targets `__chip` as a button needs an update.
