import { describe, expect, it } from "vitest";
import { Header, HEADER_TEXT } from "./header.tsx";
import { render } from "@testing-library/react";

const TEST_BRANDS = [{ id: 1, name: "Brand 1" }];

describe("header", () => {
  it("renders", () => {
    const { getByText } = render(
      <Header addNewInsight={() => {}} brands={TEST_BRANDS} />,
    );
    expect(getByText(HEADER_TEXT)).toBeTruthy();
  });
});
