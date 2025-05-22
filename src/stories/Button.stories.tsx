import type { Meta, StoryObj } from "@storybook/react";
import Button from "~/components/Button";
import { iconNames } from "~/components/Icon/Icon";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    icon: {
      control: { type: "select" },
      options: [undefined, ...iconNames],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    text: "Button",
  },
};
