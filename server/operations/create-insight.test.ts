import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";

describe("creating an insight in the database", () => {
  describe("inserting a new insight", () => {
    withDB((fixture) => {
      let result: Insight;

      const input = {
        brand: 2,
        createdAt: new Date().toISOString(),
        text: "A new insight",
      };

      beforeAll(() => {
        result = createInsight(fixture, input);
      });

      it("returns the created insight", () => {
        expect(result).toEqual({
          id: 1,
          brand: input.brand,
          createdAt: new Date(input.createdAt),
          text: input.text,
        });
      });

      it("persists the insight in the DB", () => {
        const rows = fixture.insights.selectAll();
        expect(rows).toHaveLength(1);
        expect(rows[0].brand).toBe(input.brand);
        expect(rows[0].text).toBe(input.text);
      });
    });
  });

  describe("inserting multiple insights", () => {
    withDB((fixture) => {
      const inputs = [
        { brand: 0, createdAt: new Date().toISOString(), text: "First" },
        { brand: 1, createdAt: new Date().toISOString(), text: "Second" },
      ];

      let results: Insight[];

      beforeAll(() => {
        results = inputs.map((input) => createInsight(fixture, input));
      });

      it("assigns unique IDs", () => {
        expect(results[0].id).not.toBe(results[1].id);
      });

      it("persists all insights in the DB", () => {
        const rows = fixture.insights.selectAll();
        expect(rows).toHaveLength(2);
      });
    });
  });
});
