import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";
import styled from "styled-components";

const StyledButton = styled.button<{
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  outlineColor: string;
  $height: string;
  fullWidth?: boolean;
  $margin?: string;
}>`
  display: ${(p) => (p.fullWidth ? "flex" : "inline-flex")};
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  gap: 0.5rem;
  background-color: ${(p) => p.backgroundColor};
  color: ${(p) => p.textColor};
  border-width: 0.125rem;
  border-style: solid;
  border-color: ${(p) => p.borderColor};
  border-radius: 0.25rem;
  ${(p) => (p.$margin ? `margin: ${p.$margin}` : "")}

  &:hover {
    background-color: ${(p) => p.hoverBackgroundColor};
    border-color: ${(p) => p.hoverBorderColor};
  }

  &:focus {
    outline: 0.0625rem dashed ${(p) => p.outlineColor};
  }
`;

interface Props {
  prominence?: "primary" | "secondary" | "tertiary";
  colorScheme?: "action" | "danger" | "success" | "brand" | "offbrand";
  disabled?: boolean;
  onClick?: () => void;
  size?: "default" | "small";
  iconPosition?: "left" | "right" | "alone";
  icon?: ReactNode;
  fullWidth?: boolean;
  margin?: string;
  text?: string;
}

const Button = ({
  disabled,
  onClick,
  icon,
  fullWidth,
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
        offbrand: colors.offbrand,
      }[colorScheme];
  const mainAlt = disabled
    ? colors.disabled
    : {
        action: colors.actionAlt,
        danger: colors.dangerAlt,
        success: colors.successAlt,
        brand: colors.brandAlt,
        offbrand: colors.offbrandAlt,
      }[colorScheme];
  const contrast = disabled
    ? colors.disabledContrast
    : {
        action: colors.actionContrast,
        danger: colors.dangerContrast,
        success: colors.successContrast,
        brand: colors.brandContrast,
        offbrand: colors.offbrandContrast,
      }[colorScheme];
  const contrastAlt = disabled
    ? colors.disabledContrast
    : {
        action: colors.actionContrast,
        danger: colors.dangerContrast,
        success: colors.successContrast,
        brand: colors.brandContrast,
        offbrand: colors.offbrandContrast,
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
    secondary: contrast,
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
      fullWidth={fullWidth}
      $margin={margin}
    >
      {iconPosition === "left" && icon}
      {iconPosition === "alone" ? icon : text}
      {iconPosition === "right" && icon}
    </StyledButton>
  );
};

export default Button;
