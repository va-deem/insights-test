import * as oak from "@oak/oak";
import { z } from "zod";
import { InsertInsight } from "$models/insight.ts";
import {
  BadRequestError,
  internalServerError,
  NotFoundError,
} from "../errors.ts";
import { createInsight } from "../operations/create-insight.ts";
import { deleteInsight } from "../operations/delete-insight.ts";
import { listInsights } from "../operations/list-insights.ts";
import { lookupInsight } from "../operations/lookup-insight.ts";
import { updateInsight } from "../operations/update-insight.ts";
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
      throw internalServerError("Failed to retrieve insights data", error);
    }
  });

  router.get("/insights/:id", (ctx) => {
    const id = idParam.safeParse(ctx.params.id);
    if (!id.success) {
      throw new BadRequestError({ error: id.error.issues });
    }

    let result;
    try {
      result = lookupInsight({ ...input, id: id.data });
    } catch (error) {
      throw internalServerError("Failed to retrieve insight", error);
    }

    if (result === undefined) {
      throw new NotFoundError();
    }

    ctx.response.body = result;
    ctx.response.status = 200;
  });

  router.post("/insights", async (ctx) => {
    let body;
    try {
      body = await ctx.request.body.json();
    } catch {
      throw new BadRequestError({ error: "Invalid JSON" });
    }

    const parsed = InsertInsight.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError({ error: parsed.error.issues });
    }

    try {
      const result = createInsight(input, parsed.data);
      ctx.response.body = result;
      ctx.response.status = 201;
    } catch (error) {
      throw internalServerError("Failed to create insight", error);
    }
  });

  router.delete("/insights/:id", (ctx) => {
    const id = idParam.safeParse(ctx.params.id);
    if (!id.success) {
      throw new BadRequestError({ error: id.error.issues });
    }

    let result;
    try {
      result = deleteInsight(input, id.data);
    } catch (error) {
      throw internalServerError("Failed to delete insight", error);
    }

    if (result === undefined) {
      throw new NotFoundError();
    }

    ctx.response.body = { id: result };
    ctx.response.status = 200;
  });

  router.put("/insights/:id", async (ctx) => {
    const id = idParam.safeParse(ctx.params.id);
    if (!id.success) {
      throw new BadRequestError({ error: id.error.issues });
    }

    let body;
    try {
      body = await ctx.request.body.json();
    } catch {
      throw new BadRequestError({ error: "Invalid JSON" });
    }

    const parsed = InsertInsight.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestError({ error: parsed.error.issues });
    }

    let result;
    try {
      result = updateInsight({ ...input, id: id.data }, parsed.data);
    } catch (error) {
      throw internalServerError("Failed to update insight", error);
    }

    if (result === undefined) {
      throw new NotFoundError();
    }

    ctx.response.body = result;
    ctx.response.status = 200;
  });

  return router;
};
