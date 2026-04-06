import * as oak from "@oak/oak";
import { createBaseRouter } from "./routers/base.ts";
import { createBrandsRouter } from "./routers/brands.ts";
import { createInsightsRouter } from "./routers/insights.ts";
import type { HasDBClient } from "./shared.ts";

type Input = HasDBClient;

export const createApp = (input: Input) => {
  const app = new oak.Application();
  const routers = [
    createBaseRouter(),
    createBrandsRouter(input),
    createInsightsRouter(input),
  ];

  for (const router of routers) {
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  return app;
};
