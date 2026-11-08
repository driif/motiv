import { IconButton, IconButtonGroup } from '@driif/motiv';

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function IconButtonDemo() {
  return (
    <>
      <IconButtonGroup label="Formatting">
        <IconButton
          icon={<Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />}
          label="Bold"
        />
        <IconButton icon={<Icon d="M10 5h8M6 19h8M14 5l-4 14" />} label="Italic" />
        <IconButton
          icon={
            <Icon d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
          }
          label="Link"
        />
      </IconButtonGroup>
      <div>
        <IconButton size="sm" icon={<Icon d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />} label="Edit row" />
        <IconButton
          size="sm"
          icon={<Icon d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />}
          label="Delete row"
        />
      </div>
    </>
  );
}
