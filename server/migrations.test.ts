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
      const brands = db.sql<{ id: number; name: string }>`
        SELECT id, name FROM brands ORDER BY id
      `;
      const insightsColumns = db.sql<{ name: string }>`
        PRAGMA table_info(insights)
      `;
      const insightsForeignKeys = db.sql<{ table: string; from: string; to: string }>`
        PRAGMA foreign_key_list(insights)
      `;

      expect(migrations).toEqual([
        { id: "001_create_brands" },
        { id: "002_create_insights" },
        { id: "003_recreate_insights_with_brand_fk" },
      ]);
      expect(brands).toEqual([
        { id: 1, name: "Brand 1" },
        { id: 2, name: "Brand 2" },
        { id: 3, name: "Brand 3" },
        { id: 4, name: "Brand 4" },
        { id: 5, name: "Brand 5" },
        { id: 6, name: "Brand 6" },
      ]);
      expect(insightsColumns.map((column) => column.name)).toEqual([
        "id",
        "brand",
        "createdAt",
        "text",
      ]);
      expect(
        insightsForeignKeys.map(({ table, from, to }) => ({ table, from, to })),
      ).toEqual([
        { table: "brands", from: "brand", to: "id" },
      ]);
    } finally {
      db.close();
    }
  });
});
