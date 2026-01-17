import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveStyleRule } from "jest-styled-components";
import { afterEach, expect } from "vitest";

expect.extend({ toHaveStyleRule });

afterEach(() => {
  cleanup();
});
