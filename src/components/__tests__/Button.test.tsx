import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Button from "../Button";

describe("Button", () => {
  it("renders provided text", () => {
    render(<Button text="Save" />);

    expect(
      screen.getByRole("button", { name: "Save" }),
    ).toBeInTheDocument();
  });

  it("respects disabled state", () => {
    render(<Button text="Save" disabled />);

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onClick when enabled", () => {
    const onClick = vi.fn();
    render(<Button text="Save" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(<Button text="Save" onClick={onClick} disabled />);

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders icon on the left by default", () => {
    render(<Button text="Save" icon="add" />);

    const button = screen.getByRole("button");
    const [firstNode, secondNode] = Array.from(button.childNodes);

    expect(button.querySelector(".material-icons-round")).toHaveTextContent(
      "add",
    );
    expect(firstNode?.nodeName).toBe("DIV");
    expect(secondNode?.nodeType).toBe(Node.TEXT_NODE);
    expect(secondNode?.textContent).toBe("Save");
  });

  it("renders icon on the right when configured", () => {
    render(<Button text="Save" icon="add" iconPosition="right" />);

    const button = screen.getByRole("button");
    const [firstNode, secondNode] = Array.from(button.childNodes);

    expect(button.querySelector(".material-icons-round")).toHaveTextContent(
      "add",
    );
    expect(firstNode?.nodeType).toBe(Node.TEXT_NODE);
    expect(firstNode?.textContent).toBe("Save");
    expect(secondNode?.nodeName).toBe("DIV");
  });

  it("renders icon alone when iconPosition is alone", () => {
    render(<Button text="Save" icon="add" iconPosition="alone" />);

    const button = screen.getByRole("button");

    expect(button.childNodes).toHaveLength(1);
    expect(button.querySelector(".material-icons-round")).toHaveTextContent(
      "add",
    );
    expect(button).not.toHaveTextContent("Save");
  });

  it("applies size styles for small and default", () => {
    render(
      <>
        <Button text="Default" />
        <Button text="Small" size="small" />
      </>,
    );

    const [defaultButton, smallButton] = screen.getAllByRole("button");
    const defaultStyles = getComputedStyle(defaultButton);
    const smallStyles = getComputedStyle(smallButton);

    expect(parseFloat(smallStyles.height)).toBeLessThan(
      parseFloat(defaultStyles.height),
    );
    expect(smallStyles.height).toBe(smallStyles.minWidth);
    expect(defaultStyles.height).toBe(defaultStyles.minWidth);
  });

  it("applies layout styles for width, margin, and flex", () => {
    render(
      <>
        <Button text="Base" />
        <Button text="With Width" width="240px" />
        <Button text="With Margin" margin="8px" />
        <Button text="With Flex" flex="1" />
      </>,
    );

    const baseButton = screen.getByRole("button", { name: "Base" });
    const widthButton = screen.getByRole("button", { name: "With Width" });
    const marginButton = screen.getByRole("button", { name: "With Margin" });
    const flexButton = screen.getByRole("button", { name: "With Flex" });

    expect(widthButton.className).not.toBe(baseButton.className);
    expect(marginButton.className).not.toBe(baseButton.className);
    expect(flexButton.className).not.toBe(baseButton.className);
  });
});
