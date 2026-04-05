import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Brand, Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  brands: Brand[];
  insights: Insight[];
  removeInsight: (insight: number) => void;
  className?: string;
};

const getBrandName = (brands: Brand[], id: number) =>
  brands.find((i) => i.id === id)?.name;

export const Insights = (
  { brands, insights, removeInsight, className }: InsightsProps,
) => {
  const deleteInsight = (id: number) => {
    fetch(`/api/insights/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          removeInsight(id);
        }
      })
      .catch(() => {
        console.error("Failed to delete insight with id", id);
      });
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{getBrandName(brands, brand)}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{createdAt.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() =>
                        deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
