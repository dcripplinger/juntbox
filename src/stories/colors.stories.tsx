import type { Meta, StoryObj } from "@storybook/react";
import {
  type SemanticColorSet,
  primitiveColors,
  semanticColors,
} from "~/styles/colors";
import styled from "styled-components";

const meta: Meta = {
  title: "Colors",
};

interface SwatchProps {
  color: string;
  label: string;
}

const SwatchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SwatchBlock = styled.div<{ $color: string }>`
  background-color: ${(p) => p.$color};
  width: 3rem;
  height: 3rem;
  border: 0.0625rem solid #cccccc;
`;

const Swatch = ({ color, label }: SwatchProps) => (
  <SwatchContainer>
    <SwatchBlock $color={color} />
    <code>{label}</code>
    <code>{color}</code>
  </SwatchContainer>
);

const StoryContainer = styled.div`
  padding: 2rem;
  font-family: sans-serif;
  display: grid;
  gap: 2rem;
`;

const GroupName = styled.h3`
  margin-bottom: 1rem;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PrimitiveColor: StoryObj = {
  render: () => (
    <StoryContainer>
      {Object.entries(primitiveColors).map(([groupName, shades]) => (
        <div key={groupName}>
          <GroupName>{groupName}</GroupName>
          <GroupContainer>
            {typeof shades === "string" ? (
              <Swatch key={groupName} color={shades} label={groupName} />
            ) : (
              Object.entries(shades).map(([tone, hex]) => (
                <Swatch
                  key={tone}
                  color={hex}
                  label={`${groupName}[${tone}]`}
                />
              ))
            )}
          </GroupContainer>
        </div>
      ))}
    </StoryContainer>
  ),
};

interface SemanticColorProps {
  colors: SemanticColorSet;
}

const SemanticColor = ({ colors }: SemanticColorProps) => {
  return (
    <GroupContainer>
      {Object.entries(colors).map(([colorName, value]) => (
        <Swatch key={colorName} color={value} label={colorName} />
      ))}
    </GroupContainer>
  );
};

const SemanticColorLight: StoryObj = {
  render: () => <SemanticColor colors={semanticColors.light} />,
};

const SemanticColorDark: StoryObj = {
  render: () => <SemanticColor colors={semanticColors.dark} />,
};

export default meta;

export { PrimitiveColor, SemanticColorLight, SemanticColorDark };
