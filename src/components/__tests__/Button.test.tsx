import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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
});
