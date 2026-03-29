import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import * as insightsTable from "$tables/insights.ts";
import { InsertInsight } from "$models/insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { z } from "zod";

const idParam = z.coerce.number().int().min(0);

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(insightsTable.createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  try {
    const result = listInsights({ db });
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

  const result = lookupInsight({ db, id: id.data });

  if (result === undefined) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  const body = await ctx.request.body.json();
  const parsed = InsertInsight.safeParse(body);

  if (!parsed.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: parsed.error.issues };
    return;
  }

  try {
    const result = createInsight({ db }, parsed.data);
    ctx.response.body = result;
    ctx.response.status = 201;
  } catch (error) {
    console.log("Server error: ", error);
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
    const result = deleteInsight({ db }, id.data);
    if (result === undefined) {
      ctx.response.status = 404;
      return;
    }
    ctx.response.body = { id: result };
    ctx.response.status = 200;
  } catch (error) {
    console.log("Server error: ", error);
    ctx.response.body = { error: "Failed to delete insight" };
    ctx.response.status = 500;
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
