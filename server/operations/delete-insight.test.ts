import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting an insight from the database", () => {
  describe("insight exists", () => {
    withDB((fixture) => {
      let result: number | undefined;

      beforeAll(() => {
        fixture.insights.insert([
          { brand: 0, createdAt: new Date().toISOString(), text: "1" },
          { brand: 1, createdAt: new Date().toISOString(), text: "2" },
          { brand: 2, createdAt: new Date().toISOString(), text: "3" },
        ]);
        result = deleteInsight(fixture, 2);
      });

      it("returns the deleted id", () => {
        expect(result).toBe(2);
      });

      it("removes the insight from the DB", () => {
        const rows = fixture.insights.selectAll();
        expect(rows).toHaveLength(2);
        expect(rows.find((r) => r.id === 2)).toBeUndefined();
      });

      it("does not remove other insights", () => {
        const rows = fixture.insights.selectAll();
        expect(rows.find((r) => r.id === 1)).toBeDefined();
        expect(rows.find((r) => r.id === 3)).toBeDefined();
      });
    });
  });

  describe("insight does not exist", () => {
    withDB((fixture) => {
      let result: number | undefined;

      beforeAll(() => {
        result = deleteInsight(fixture, 999);
      });

      it("returns undefined", () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
