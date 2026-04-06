import { PencilIcon, Trash2Icon } from "lucide-react";
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
  const deleteInsight = async (id: number) => {
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
            <ul className={styles.items}>
              {insights.map(({ id, text, createdAt, brand }) => (
                <li className={styles.insight} key={id}>
                  <div className={styles["insight-meta"]}>
                    <span>{getBrandName(brands, brand)}</span>
                    <div className={styles["insight-meta-details"]}>
                      <span>{formatIsoDate(createdAt)}</span>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.action}
                          onClick={() =>
                            onEditInsight({ id, text, createdAt, brand })}
                          aria-label={`Edit insight: ${text}`}
                        >
                          <PencilIcon className={styles.actionIcon} />
                        </button>
                        <button
                          type="button"
                          className={cx(styles.action, styles.delete)}
                          onClick={() =>
                            deleteInsight(id)}
                          aria-label={`Delete insight: ${text}`}
                        >
                          <Trash2Icon className={styles.actionIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className={styles["insight-content"]}>{text}</p>
                </li>
              ))}
            </ul>
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
