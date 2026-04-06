import { useEffect, useState } from "react";
import { listBrands } from "../http/brands.ts";
import {
  createInsight as createInsightRequest,
  deleteInsight as deleteInsightRequest,
  listInsights,
} from "../http/insights.ts";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Brand, InsertInsight, Insight } from "../schemas/insight.ts";

export const App = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isInsightError, setIsInsightError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setBrands(await listBrands());
      } catch (err) {
        console.error(err);
      }

      try {
        setInsights(await listInsights());
        setIsInsightError(false);
      } catch (err) {
        console.error(err);
        setIsInsightError(true);
      }
    };

    void loadData();
  }, []);

  const addNewInsight = async (input: InsertInsight) => {
    const newInsight = await createInsightRequest(input);
    setInsights((prev) => [...prev, newInsight]);
    setIsInsightError(false);
  };

  const removeInsight = async (id: Insight["id"]) => {
    const deletedId = await deleteInsightRequest(id);
    setInsights((prev) => prev.filter((i) => i.id !== deletedId));
    return deletedId;
  };

  return (
    <main className={styles.main}>
      <Header onAddInsight={addNewInsight} brands={brands} />
      <Insights
        className={styles.insights}
        brands={brands}
        isError={isInsightError}
        insights={insights}
        onDeleteInsight={removeInsight}
      />
    </main>
  );
};
