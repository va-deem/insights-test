import { type InsertInsight, Insight } from "../schemas/insight.ts";

async function parseErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data.error?.[0]?.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function listInsights(): Promise<Insight[]> {
  const response = await fetch("/api/insights");
  const body = await response.json();

  if (!response.ok) {
    throw new Error("Failed to load insights");
  }

  return body.map((item: unknown) => Insight.parse(item));
}

export async function createInsight(input: InsertInsight): Promise<Insight> {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Failed to add insight"),
    );
  }

  return Insight.parse(await response.json());
}

export async function deleteInsight(id: Insight["id"]): Promise<Insight["id"]> {
  const response = await fetch(`/api/insights/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete insight");
  }

  const body = await response.json();
  return body.id;
}
