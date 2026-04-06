import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Insights } from "./insights.tsx";

const TEST_BRANDS = [
  { id: 1, name: "Brand 1" },
  { id: 2, name: "Brand 2" },
];

const TEST_INSIGHTS = [
  {
    id: 1,
    brand: 1,
    createdAt: new Date(),
    text: "Test insight",
  },
  { id: 2, brand: 2, createdAt: new Date(), text: "Another test insight" },
];

describe("insights", () => {
  it("renders", () => {
    const { getByText } = render(
      <Insights
        brands={TEST_BRANDS}
        insights={TEST_INSIGHTS}
        onDeleteInsight={(id) => Promise.resolve(id)}
      />,
    );
    expect(getByText(TEST_INSIGHTS[0].text)).toBeTruthy();
  });
});
