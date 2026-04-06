import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { z } from "zod";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import { updateInsight } from "./update-insight.ts";

describe("updating an insight in the database", () => {
  describe("insight exists", () => {
    withDB((fixture) => {
      let result: Insight | undefined;

      beforeAll(() => {
        fixture.insights.insert([{ brand: 1, text: "Original" }]);
        result = updateInsight(
          { ...fixture, id: 1 },
          { brand: 2, text: "Updated" },
        );
      });

      it("returns the updated insight", () => {
        expect(result).toBeDefined();
        expect(result!.id).toBe(1);
        expect(result!.brand).toBe(2);
        expect(result!.text).toBe("Updated");
        expect(z.string().datetime().parse(result!.createdAt)).toBe(
          result!.createdAt,
        );
      });

      it("persists the updated insight in the DB", () => {
        const [row] = fixture.insights.selectAll();
        expect(row.brand).toBe(2);
        expect(row.text).toBe("Updated");
      });
    });
  });

  describe("insight does not exist", () => {
    withDB((fixture) => {
      let result: Insight | undefined;

      beforeAll(() => {
        result = updateInsight(
          { ...fixture, id: 999 },
          { brand: 1, text: "Updated" },
        );
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
