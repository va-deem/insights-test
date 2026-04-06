import { Database } from "@db/sqlite";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import { runMigrations } from "./migrations.ts";
import { createApp } from "./app.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT") ?? 8080),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
runMigrations(db);

console.log("Initialising server");

const app = createApp({ db });

app.listen(env);
console.log(`Started server on port ${env.port}`);
