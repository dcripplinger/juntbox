import styled from "styled-components";
import type { IconInnerComponentProps } from "./types";
import Logo from "./Logo";
import { type FC } from "react";

const Span = styled.span<{ $size: string }>`
  height: ${(p) => p.$size};
  width: ${(p) => p.$size};
  font-size: ${(p) => p.$size};
  user-select: none;
`;

const svgs: Record<string, FC> = {
  logo: Logo,
};

const SvgIcon = ({ size, name }: IconInnerComponentProps) => {
  const Svg = svgs[name];

  return <Span $size={size}>{Svg && <Svg />}</Span>;
};

export default SvgIcon;
