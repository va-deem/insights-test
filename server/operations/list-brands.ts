import type { Brand } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as brandsTable from "$tables/brands.ts";

type Input = HasDBClient;

export default (input: Input): Brand[] => {
  console.log("Listing brands");

  const result = input.db.sql<brandsTable.Row>`SELECT * FROM brands ORDER BY id`;

  console.log("Retrieved brands successfully: ", result);
  return result;
};
