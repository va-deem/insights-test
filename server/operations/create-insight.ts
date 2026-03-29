import type { InsertInsight, Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient;

export default (input: Input, item: InsertInsight): Insight => {
  console.log("Creating insight");

  const row = (input.db.sql<
    insightsTable.Row
  >`INSERT INTO insights (brand, createdAt, text) 
    VALUES (${item.brand}, ${item.createdAt}, ${item.text}) RETURNING *`)[0];

  const result: Insight = { ...row, createdAt: new Date(row.createdAt) };

  console.log("Created insight successfully: ", result);
  return result;
};
