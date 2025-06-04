import type { FC } from "react";
import styled from "styled-components";
import MaterialIconRounded from "./MaterialIconRounded";
import NothingIcon from "./NothingIcon";
import type { IconInnerComponentProps, IconProps, IconName } from "./types";
import SvgIcon from "./SvgIcon";

/**
 * You can look up what material icons can be included here:
 * https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Icons
 * Our preferred icons are the Material Icons set (as opposed to Material
 * Symbols) and the Rounded category. For these, just look up the name of
 * the icon that should be used in the span (see details on right after
 * clicking the icon). Then in `components`, include the name of the icon as
 * the key and MaterialIconRounded as the value.
 *
 * If we ever need to include icons from a different source (like a
 * category other than Rounded, or Material Symbols, or a non-Material
 * source), we can make a new component similar to MaterialIconRounded
 * and set the value in `components` for that icon to the different component.
 */
const components: Record<IconName, FC<IconInnerComponentProps>> = {
  account_circle: MaterialIconRounded,
  add: MaterialIconRounded,
  add_circle_outline: MaterialIconRounded,
  arrow_back: MaterialIconRounded,
  chevron_left: MaterialIconRounded,
  chevron_right: MaterialIconRounded,
  close: MaterialIconRounded,
  delete: MaterialIconRounded,
  edit_note: MaterialIconRounded,
  keyboard_double_arrow_left: MaterialIconRounded,
  keyboard_double_arrow_right: MaterialIconRounded,
  lock: MaterialIconRounded,
  lock_open: MaterialIconRounded,
  logo: SvgIcon,
  menu: MaterialIconRounded,
  mouse: MaterialIconRounded,
  nothing: NothingIcon,
  open_in_new: MaterialIconRounded,
  public: MaterialIconRounded,
  remove: MaterialIconRounded,
  search: MaterialIconRounded,
  star: MaterialIconRounded,
  star_outline: MaterialIconRounded,
  warning: MaterialIconRounded,
};

const iconNames = Object.keys(components) as IconName[];

const Container = styled.div<{
  size: string;
  color: string;
  margin: string;
}>`
  // Without this, you get weird extra space underneath. Also,
  // inline-flex is better than flex because we want the default
  // behavior of icons to act like spans, not divs.
  display: inline-flex;
  font-size: ${(p) => p.size};
  color: ${(p) => p.color};
  margin: ${(p) => p.margin};
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  // In case the parent element uses display:flex, this ensures
  // that the icon or this Container won't shrink or grow.
  flex: 0 0 auto;
`;

const Icon = ({
  name,
  size = "1.5rem",
  color = "inherit",
  margin = "0",
}: IconProps) => {
  const Component = components[name];

  return (
    <Container size={size} color={color} margin={margin}>
      <Component name={name} size={size} color={color} />
    </Container>
  );
};

export default Icon;

export { iconNames };
