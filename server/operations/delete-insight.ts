import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient;

export default (input: Input, id: number): number | undefined => {
  console.log("Deleting insight");

  const row = input.db.sql<
    insightsTable.Row
  >`DELETE FROM insights WHERE id = ${id} RETURNING *`[0];

  if (row) {
    console.log("Deleted insight successfully: ", row.id);
    return row.id;
  }

  console.log("Insight not found");
  return;
};
