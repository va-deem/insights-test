import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Brand, Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  brands: Brand[];
  isError?: boolean;
  insights: Insight[];
  onEditInsight: (insight: Insight) => void;
  onDeleteInsight: (id: Insight["id"]) => Promise<Insight["id"]>;
  className?: string;
};

const getBrandName = (brands: Brand[], id: number) =>
  brands.find((i) => i.id === id)?.name;

const formatIsoDate = (value: Insight["createdAt"]) =>
  new Date(value).toLocaleString();

export const Insights = (
  { brands, isError, insights, onDeleteInsight, onEditInsight, className }:
    InsightsProps,
) => {
  const deleteInsight = async (
    event: React.MouseEvent<SVGSVGElement>,
    id: number,
  ) => {
    event.stopPropagation();

    try {
      await onDeleteInsight(id);
    } catch (_err) {
      console.error("Failed to delete insight with id", id);
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {isError
          ? (
            <p className={styles.error}>
              Something went wrong while loading insights.
            </p>
          )
          : insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div
                className={styles.insight}
                key={id}
                onClick={() => onEditInsight({ id, text, createdAt, brand })}
              >
                <div className={styles["insight-meta"]}>
                  <span>{getBrandName(brands, brand)}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{formatIsoDate(createdAt)}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={(event) => deleteInsight(event, id)}
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
