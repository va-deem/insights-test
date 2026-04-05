import type { Database } from "@db/sqlite";
import * as brandsTable from "$tables/brands.ts";
import * as insightsTable from "$tables/insights.ts";

type Migration = {
  id: string;
  up(db: Database): void;
};

const initialBrands: brandsTable.Row[] = [
  { id: 1, name: "Brand 1" },
  { id: 2, name: "Brand 2" },
  { id: 3, name: "Brand 3" },
  { id: 4, name: "Brand 4" },
  { id: 5, name: "Brand 5" },
  { id: 6, name: "Brand 6" },
];

const migrations: Migration[] = [
  {
    id: "001_create_brands",
    up(db) {
      db.exec(brandsTable.createTable);

      for (const brand of initialBrands) {
        db.sql`
          INSERT INTO brands (id, name)
          VALUES (${brand.id}, ${brand.name})
        `;
      }
    },
  },
  {
    id: "002_create_insights",
    up(db) {
      db.exec(insightsTable.createTable);
    },
  },
  {
    id: "003_recreate_insights_with_brand_fk",
    up(db) {
      // Recreate insights with a foreign key; assumes no existing data must be preserved
      db.exec("DROP TABLE IF EXISTS insights");
      db.exec(insightsTable.createTable);
    },
  },
];

const createMigrationsTable = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY NOT NULL,
    appliedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

export const runMigrations = (db: Database) => {
  // Enable SQLite foreign key enforcement for this DB connection
  db.exec("PRAGMA foreign_keys = ON");

  db.exec(createMigrationsTable);

  const applied = new Set(
    db.sql<{ id: string }>`SELECT id FROM schema_migrations`
      .map(({ id }) => id),
  );

  for (const migration of migrations) {
    if (applied.has(migration.id)) {
      continue;
    }

    db.exec("BEGIN");

    try {
      migration.up(db);
      db.sql`INSERT INTO schema_migrations (id) VALUES (${migration.id})`;
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
};
