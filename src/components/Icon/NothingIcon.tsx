import styled from "styled-components";
import type { IconInnerComponentProps } from "./types";

const Container = styled.span<{ size: string }>`
  width: ${(p) => p.size};
  height: ${(p) => p.size};
  background-color: transparent;
`;

const NothingIcon = ({ size }: IconInnerComponentProps) => {
  return <Container size={size} />;
};

export default NothingIcon;
