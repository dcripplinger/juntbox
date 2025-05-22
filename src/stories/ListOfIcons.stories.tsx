import type { Meta, StoryObj } from "@storybook/react";
import styled from "styled-components";
import Icon, { iconNames } from "~/components/Icon/Icon";

const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const IconDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 4rem;
`;

const Label = styled.span`
  font-size: 0.625rem;
  overflow-wrap: break-word;
  width: 100%;
  text-align: center;
`;

const ListOfIcons = () => {
  return (
    <Container>
      {iconNames.map((iconName) => (
        <IconDisplay key={iconName}>
          <Icon name={iconName} />
          <Label>{iconName}</Label>
        </IconDisplay>
      ))}
    </Container>
  );
};

const meta: Meta<typeof ListOfIcons> = {
  title: "Components/Icon",
  component: ListOfIcons,
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const TheStory: Story = {
  name: "List of Icons",
};
