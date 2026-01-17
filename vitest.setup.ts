import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import toHaveStyleRule from "jest-styled-components/src/toHaveStyleRule";
import { resetStyleSheet } from "jest-styled-components/src/utils";
import { afterEach, beforeEach, expect } from "vitest";

globalThis.expect = expect;
expect.extend({ toHaveStyleRule });

beforeEach(() => {
  resetStyleSheet();
});

afterEach(() => {
  cleanup();
});
