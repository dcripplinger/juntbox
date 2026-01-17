import { useTheme } from "./ThemeProvider";
import styled from "styled-components";
import type { IconName } from "./Icon/types";
import Icon from "./Icon/Icon";

const StyledButton = styled.button<{
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  outlineColor: string;
  $height: string;
  $width?: string;
  $flex?: string;
  $margin?: string;
  iconIsAlone: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.iconIsAlone ? "0" : "0 0.5rem")};
  gap: 0.5rem;
  background-color: ${(p) => p.backgroundColor};
  color: ${(p) => p.textColor};
  height: ${(p) => p.$height};
  min-width: ${(p) => p.$height};
  font-weight: 700;
  border-width: 0.125rem;
  cursor: pointer;
  outline-offset: 0.125rem;
  border-style: solid;
  border-color: ${(p) => p.borderColor};
  border-radius: 0.25rem;
  border-width: 0.125rem;
  ${(p) => (p.$margin ? `margin: ${p.$margin};` : "")}
  ${(p) => (p.$flex ? `flex: ${p.$flex};` : "")}
  ${(p) => (p.$width ? `width: ${p.$width};` : "")}

  &:hover {
    background-color: ${(p) => p.hoverBackgroundColor};
    border-color: ${(p) => p.hoverBorderColor};
  }

  &:focus-visible {
    outline: 0.125rem dashed ${(p) => p.outlineColor};
  }

  &:disabled {
    cursor: auto;
  }
`;

interface Props {
  prominence?: "primary" | "secondary" | "tertiary";
  colorScheme?: "action" | "danger" | "success" | "brand";
  disabled?: boolean;
  onClick?: () => void;
  size?: "default" | "small";
  iconPosition?: "left" | "right" | "alone";
  icon?: IconName;
  margin?: string;
  text?: string;
  width?: string;
  flex?: string;
}

const Button = ({
  disabled,
  onClick,
  icon,
  width,
  flex,
  margin,
  text,
  prominence = "primary",
  colorScheme = "action",
  size = "default",
  iconPosition = "left",
}: Props) => {
  const { colors } = useTheme();

  // select colors (main, mainAlt, contrast, contrastAlt) based on colorScheme and disabled
  const main = disabled
    ? colors.disabled
    : {
        action: colors.action,
        danger: colors.danger,
        success: colors.success,
        brand: colors.brand,
      }[colorScheme];
  const mainAlt = disabled
    ? colors.disabled
    : {
        action: colors.actionAlt,
        danger: colors.dangerAlt,
        success: colors.successAlt,
        brand: colors.brandAlt,
      }[colorScheme];
  const contrast = disabled
    ? colors.disabledContrast
    : {
        action: colors.actionContrast,
        danger: colors.dangerContrast,
        success: colors.successContrast,
        brand: colors.brandContrast,
      }[colorScheme];
  const contrastAlt = disabled
    ? colors.disabledContrast
    : {
        action: colors.actionContrastAlt,
        danger: colors.dangerContrastAlt,
        success: colors.successContrastAlt,
        brand: colors.brandContrastAlt,
      }[colorScheme];

  // assign colors to css based on prominence
  const backgroundColor = {
    primary: main,
    secondary: contrast,
    tertiary: "transparent",
  }[prominence];
  const textColor = {
    primary: contrast,
    secondary: main,
    tertiary: main,
  }[prominence];
  const borderColor = {
    primary: main,
    secondary: main,
    tertiary: "transparent",
  }[prominence];
  const hoverBackgroundColor = {
    primary: mainAlt,
    secondary: contrastAlt,
    tertiary: contrastAlt,
  }[prominence];
  const hoverBorderColor = {
    primary: mainAlt,
    secondary: main,
    tertiary: contrastAlt,
  }[prominence];

  return (
    <StyledButton
      backgroundColor={backgroundColor}
      textColor={textColor}
      borderColor={borderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      hoverBorderColor={hoverBorderColor}
      outlineColor={colors.outline}
      $height={size === "small" ? "2rem" : "3rem"}
      onClick={onClick}
      $width={width}
      $flex={flex}
      $margin={margin}
      iconIsAlone={iconPosition === "alone"}
      disabled={disabled}
    >
      {iconPosition === "left" && icon && <Icon name={icon} />}
      {iconPosition === "alone" && icon ? <Icon name={icon} /> : text}
      {iconPosition === "right" && icon && <Icon name={icon} />}
    </StyledButton>
  );
};

export default Button;
