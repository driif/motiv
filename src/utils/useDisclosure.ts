import { useState } from 'react';

/** Open item ids of an accordion, controlled through `open` or kept inside. */
export function useDisclosure({
  multiple,
  defaultOpen,
  open,
  onOpenChange,
}: {
  multiple: boolean;
  defaultOpen: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
}) {
  const [inner, setInner] = useState(defaultOpen);
  const openIds = open ?? inner;

  function toggle(id: string) {
    const next = openIds.includes(id)
      ? openIds.filter((x) => x !== id)
      : multiple
        ? [...openIds, id]
        : [id];
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  }

  return { openIds, toggle };
}
