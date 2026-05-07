import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { z } from "zod";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import { listInsights } from "./list-insights.ts";

describe("listing insights in the database", () => {
  describe("nothing in the DB", () => {
    withDB((fixture) => {
      let result: Insight[];

      beforeAll(() => {
        result = listInsights(fixture);
      });

      it("returns empty result", () => {
        expect(result).toEqual([]);
      });
    });
  });

  describe("populated DB", () => {
    withDB((fixture) => {
      const inputs = [
        { brand: 1, text: "1" },
        { brand: 2, text: "2" },
        { brand: 3, text: "3" },
        { brand: 4, text: "4" },
      ];

      let result: Insight[];

      beforeAll(() => {
        fixture.insights.insert(inputs);
        result = listInsights(fixture);
      });

      it("returns non-empty result", () => {
        expect(result.length).toBeGreaterThan(0);
      });

      it("returns all insights in the DB", () => {
        expect(result).toHaveLength(inputs.length);
        for (let i = 0; i < inputs.length; i++) {
          expect(result[i].brand).toBe(inputs[i].brand);
          expect(result[i].text).toBe(inputs[i].text);
          expect(z.string().datetime().parse(result[i].createdAt)).toBe(
            result[i].createdAt,
          );
        }
      });
    });
  });
});
