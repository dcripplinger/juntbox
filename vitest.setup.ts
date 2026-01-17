import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import toHaveStyleRule from "jest-styled-components/src/toHaveStyleRule";
import { afterEach, expect } from "vitest";

globalThis.expect = expect;
expect.extend({ toHaveStyleRule });

afterEach(() => {
  cleanup();
});
