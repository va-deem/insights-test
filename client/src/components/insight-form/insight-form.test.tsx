import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { InsightForm } from "./insight-form.tsx";

const TEST_BRANDS = [{ id: 1, name: "Brand 1" }];

describe("insight-form", () => {
  it("renders", () => {
    const { getByText } = render(
      <InsightForm
        open
        onClose={() => {}}
        onSubmitInsight={async () => {}}
        brands={TEST_BRANDS}
      />,
    );
    expect(getByText("Add a new insight")).toBeTruthy();
  });
});
