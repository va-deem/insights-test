import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Header, HEADER_TEXT } from "./header.tsx";

describe("header", () => {
  it("renders", () => {
    const { getByText } = render(
      <Header onAddInsightClick={() => {}} />,
    );
    expect(getByText(HEADER_TEXT)).toBeTruthy();
  });
});
