---
'@driif/motiv': minor
---

CommandMenu accepts `open` and `onOpenChange` to be controlled (every controlled opening focuses the first command), ignores a ⌘K another handler already prevented, and no longer moves focus into a menu that did not open or pulls focus back from a command that moved it elsewhere.
