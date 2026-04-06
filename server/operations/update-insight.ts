import type { InsertInsight, Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input, item: InsertInsight): Insight | undefined => {
  console.log(`Updating insight for id=${input.id}`);

  const row = input.db.sql<
    insightsTable.Row
  >`UPDATE insights
    SET brand = ${item.brand}, text = ${item.text}
    WHERE id = ${input.id}
    RETURNING *`[0];

  if (row) {
    const result: Insight = row;
    console.log("Updated insight successfully: ", result);
    return result;
  }

  console.log("Insight not found");
  return;
};
