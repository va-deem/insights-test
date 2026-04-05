import { beforeAll, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import lookupInsight from "./lookup-insight.ts";

describe("listing insights in the database", () => {
  describe("specified insight not in the DB", () => {
    withDB((fixture) => {
      let result: Insight | undefined;

      beforeAll(() => {
        result = lookupInsight({ ...fixture, id: 0 });
      });

      it("returns nothing", () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe("insight is in the DB", () => {
    withDB((fixture) => {
      const inputs = [
        { brand: 1, text: "1" },
        { brand: 2, text: "2" },
        { brand: 3, text: "3" },
        { brand: 4, text: "4" },
      ];

      let result: Insight | undefined;

      beforeAll(() => {
        fixture.insights.insert(inputs);
        result = lookupInsight({ ...fixture, id: 3 });
      });

      it("returns the expected insight", () => {
        expect(result).toBeDefined();
        expect(result!.id).toBe(3);
        expect(result!.brand).toBe(inputs[2].brand);
        expect(result!.text).toBe(inputs[2].text);
        expect(result!.createdAt).toBeInstanceOf(Date);
      });
    });
  });
});
