import * as oak from "@oak/oak";
import { z } from "zod";
import { InsertInsight } from "$models/insight.ts";
import createInsight from "../operations/create-insight.ts";
import deleteInsight from "../operations/delete-insight.ts";
import listInsights from "../operations/list-insights.ts";
import lookupInsight from "../operations/lookup-insight.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient;

const idParam = z.coerce.number().int().min(0);

export const createInsightsRouter = (input: Input) => {
  const router = new oak.Router();

  router.get("/insights", (ctx) => {
    try {
      const result = listInsights(input);
      ctx.response.body = result;
      ctx.response.status = 200;
    } catch (error) {
      console.error("Server error: ", error);
      ctx.response.body = { error: "Failed to retrieve insights data" };
      ctx.response.status = 500;
    }
  });

  router.get("/insights/:id", (ctx) => {
    const id = idParam.safeParse(ctx.params.id);
    if (!id.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: id.error.issues };
      return;
    }

    try {
      const result = lookupInsight({ ...input, id: id.data });

      if (result === undefined) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Not found" };
        return;
      }

      ctx.response.body = result;
      ctx.response.status = 200;
    } catch (error) {
      console.error("Server error: ", error);
      ctx.response.body = { error: "Failed to retrieve insight" };
      ctx.response.status = 500;
    }
  });

  router.post("/insights", async (ctx) => {
    let body;
    try {
      body = await ctx.request.body.json();
    } catch {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid JSON" };
      return;
    }

    const parsed = InsertInsight.safeParse(body);

    if (!parsed.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: parsed.error.issues };
      return;
    }

    try {
      const result = createInsight(input, parsed.data);
      ctx.response.body = result;
      ctx.response.status = 201;
    } catch (error) {
      console.error("Server error: ", error);
      ctx.response.body = { error: "Failed to create insight" };
      ctx.response.status = 500;
    }
  });

  router.delete("/insights/:id", (ctx) => {
    const id = idParam.safeParse(ctx.params.id);
    if (!id.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: id.error.issues };
      return;
    }

    try {
      const result = deleteInsight(input, id.data);
      if (result === undefined) {
        ctx.response.status = 404;
        ctx.response.body = { error: "Not found" };
        return;
      }
      ctx.response.body = { id: result };
      ctx.response.status = 200;
    } catch (error) {
      console.error("Server error: ", error);
      ctx.response.body = { error: "Failed to delete insight" };
      ctx.response.status = 500;
    }
  });

  return router;
};
