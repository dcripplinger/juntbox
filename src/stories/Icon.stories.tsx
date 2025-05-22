import type { Meta, StoryObj } from "@storybook/react";
import Icon, { iconNames } from "~/components/Icon/Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"], // optional: enables automatic documentation
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["1.5rem", "1.25rem", "2.5rem", "3rem"],
    },
    name: {
      control: { type: "select" },
      options: iconNames,
    },
    color: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const IconStory: Story = {
  name: "Icon",
  args: {
    name: "close",
  },
};
