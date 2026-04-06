import { Brand } from "../schemas/insight.ts";

export const listBrands = async (): Promise<Brand[]> => {
  const response = await fetch("/api/brands");
  const body = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load brands");
  }

  return body.map((item: unknown) => Brand.parse(item));
};
