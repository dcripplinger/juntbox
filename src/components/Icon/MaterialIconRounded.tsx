import styled from "styled-components";
import type { IconInnerComponentProps } from "./types";

const Span = styled.span`
  user-select: none;
  font-size: inherit;
`;

const MaterialIconRounded = ({ name }: IconInnerComponentProps) => {
  return <Span className="material-icons-round">{name}</Span>;
};

export default MaterialIconRounded;
