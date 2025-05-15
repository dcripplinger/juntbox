import type { Meta, StoryObj } from "@storybook/react";
import Button from "~/components/Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"], // optional: enables automatic documentation
  argTypes: {
    prominence: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "small"],
    },
    colorScheme: {
      control: { type: "select" },
      options: ["action", "brand", "offbrand", "success", "danger"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    text: "Primary Button",
    prominence: "primary",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    text: "Secondary Button",
    prominence: "secondary",
    size: "default",
  },
};

export const Tertiary: Story = {
  args: {
    text: "Tertiary Button",
    prominence: "tertiary",
    size: "default",
  },
};

export const Small: Story = {
  args: {
    text: "Small Button",
    prominence: "primary",
    size: "small",
  },
};

export const Disabled: Story = {
  args: {
    text: "Disabled Button",
    prominence: "primary",
    size: "default",
    disabled: true,
  },
};
