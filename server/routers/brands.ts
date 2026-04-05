import * as oak from "@oak/oak";
import listBrands from "../operations/list-brands.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient;

export const createBrandsRouter = (input: Input) => {
  const router = new oak.Router();

  router.get("/brands", (ctx) => {
    try {
      const result = listBrands(input);
      ctx.response.body = result;
      ctx.response.status = 200;
    } catch (error) {
      console.error("Server error: ", error);
      ctx.response.body = { error: "Failed to retrieve brands data" };
      ctx.response.status = 500;
    }
  });

  return router;
};
