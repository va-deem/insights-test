import type { InsertInsight, Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient;

export const createInsight = (input: Input, item: InsertInsight): Insight => {
  console.log("Creating insight");

  const row = (input.db.sql<
    insightsTable.Row
  >`INSERT INTO insights (brand, text)
    VALUES (${item.brand}, ${item.text}) RETURNING *`)[0];

  const result: Insight = row;

  console.log("Created insight successfully: ", result);
  return result;
};
