// These are the allowed names for icons.
type IconName =
  | "account_circle"
  | "add"
  | "add_circle_outline"
  | "arrow_back"
  | "chevron_left"
  | "chevron_right"
  | "close"
  | "delete"
  | "edit_note"
  | "keyboard_double_arrow_left"
  | "keyboard_double_arrow_right"
  | "lock"
  | "lock_open"
  | "menu"
  | "mouse"
  | "nothing"
  | "open_in_new"
  | "public"
  | "remove"
  | "search"
  | "star"
  | "star_outline"
  | "warning";

type Size = "1.25rem" | "1.5rem" | "2.5rem" | "3rem";

// These are the props required for any components used as a specific implementation
// of Icon, e.g. MaterialIconRounded.
interface IconInnerComponentProps {
  name: IconName;
  size: Size;
  color: string;
}

// These are the props for the externally facing Icon component, i.e. the parent
// component.
interface IconProps {
  name: IconName;
  size?: Size;
  color?: string;
  margin?: string;
}

export type { IconName, IconInnerComponentProps, IconProps };
