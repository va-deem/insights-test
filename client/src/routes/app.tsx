import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import { Brand, Insight } from "../schemas/insight.ts";

export const App = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    fetch(`/api/brands`)
      .then((res) => res.json())
      .then((res) => {
        setBrands(res.map((item: unknown) => Brand.parse(item)));
      })
      .catch((err) => console.error(err));

    fetch(`/api/insights`)
      .then((res) => res.json())
      .then((res) => {
        setInsights(res.map((item: unknown) => Insight.parse(item)));
      })
      .catch((err) => console.error(err));
  }, []);

  const addNewInsight = (newInsight: Insight) => {
    setInsights((prev) => [...prev, newInsight]);
  };
  const removeInsight = (id: Insight["id"]) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className={styles.main}>
      <Header addNewInsight={addNewInsight} brands={brands} />
      <Insights
        className={styles.insights}
        brands={brands}
        insights={insights}
        removeInsight={removeInsight}
      />
    </main>
  );
};
