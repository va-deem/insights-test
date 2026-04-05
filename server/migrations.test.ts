import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { Database } from "@db/sqlite";
import { runMigrations } from "./migrations.ts";

describe("runMigrations", () => {
  it("creates the schema and is safe to run multiple times", () => {
    const db = new Database(":memory:");

    try {
      runMigrations(db);
      runMigrations(db);

      const migrations = db.sql<{ id: string }>`
        SELECT id FROM schema_migrations ORDER BY id
      `;
      const insightsColumns = db.sql<{ name: string }>`
        PRAGMA table_info(insights)
      `;

      expect(migrations).toEqual([{ id: "001_create_insights" }]);
      expect(insightsColumns.map((column) => column.name)).toEqual([
        "id",
        "brand",
        "createdAt",
        "text",
      ]);
    } finally {
      db.close();
    }
  });
});
