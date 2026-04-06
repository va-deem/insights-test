import { describe, expect, it } from "vitest";
import { AddInsight } from "./add-insight.tsx";
import { render } from "@testing-library/react";

const TEST_BRANDS = [{ id: 1, name: "Brand 1" }];

describe("add-insight", () => {
  it("renders", () => {
    const { getByText } = render(
      <AddInsight
        open
        onClose={() => {}}
        onAddInsight={async () => {}}
        brands={TEST_BRANDS}
      />,
    );
    expect(getByText("Add a new insight")).toBeTruthy();
  });
});
