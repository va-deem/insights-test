import { expect } from "@std/expect";
import { beforeAll, describe, it } from "@std/testing/bdd";
import type { Brand } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import { listBrands } from "./list-brands.ts";

describe("listing brands in the database", () => {
  withDB((fixture) => {
    let result: Brand[];

    beforeAll(() => {
      result = listBrands(fixture);
    });

    it("returns all seeded brands", () => {
      expect(result).toEqual([
        { id: 1, name: "Brand 1" },
        { id: 2, name: "Brand 2" },
        { id: 3, name: "Brand 3" },
        { id: 4, name: "Brand 4" },
        { id: 5, name: "Brand 5" },
        { id: 6, name: "Brand 6" },
      ]);
    });
  });
});
