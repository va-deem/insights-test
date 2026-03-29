import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
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
      <Header addNewInsight={addNewInsight} />
      <Insights
        className={styles.insights}
        insights={insights}
        removeInsight={removeInsight}
      />
    </main>
  );
};
