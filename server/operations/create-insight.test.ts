import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { z } from "zod";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import { createInsight } from "./create-insight.ts";

describe("creating an insight in the database", () => {
  describe("inserting a new insight", () => {
    withDB((fixture) => {
      let result: Insight;

      const input = {
        brand: 2,
        text: "A new insight",
      };

      beforeAll(() => {
        result = createInsight(fixture, input);
      });

      it("returns the created insight", () => {
        expect(result.id).toBe(1);
        expect(result.brand).toBe(input.brand);
        expect(result.text).toBe(input.text);
        expect(z.string().datetime().parse(result.createdAt)).toBe(
          result.createdAt,
        );
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
        { brand: 1, text: "First" },
        { brand: 2, text: "Second" },
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

  describe("inserting an insight with an unknown brand", () => {
    withDB((fixture) => {
      let error: Error | undefined;

      beforeAll(() => {
        try {
          createInsight(fixture, { brand: 999, text: "Invalid brand" });
        } catch (cause) {
          error = cause as Error;
        }
      });

      it("fails with a foreign key violation", () => {
        expect(error).toBeDefined();
      });
    });
  });
});
