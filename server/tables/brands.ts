import type { Brand } from "$models/insight.ts";

export const createTable = `
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
  )
`;

export type Row = Brand;
