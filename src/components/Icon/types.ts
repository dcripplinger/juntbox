// These are the allowed names for icons.
type TName =
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
  | "spinner"
  | "star"
  | "star_outline"
  | "warning";

// These are the props required for any components used as a specific implementation
// of Icon, e.g. MaterialIconRounded.
interface IComponentProps {
  name: TName;
  fontSize: string;
  color: string;
}

// These are the props for the externally facing Icon component, i.e. the parent
// component. Its only difference from IComponentProps is that some props are
// optional.
interface IIconProps {
  name: TName;
  fontSize?: string;
  color?: string;
  margin?: string;
}

export type { TName, IComponentProps, IIconProps };
