import { PencilIcon, Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Brand, Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  brands: Brand[];
  isError?: boolean;
  insights: Insight[];
  onEditInsight: (insight: Insight) => void;
  onDeleteInsight: (insight: Insight) => void;
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
              {insights.map((insight) => (
                <li className={styles.insight} key={insight.id}>
                  <div className={styles["insight-meta"]}>
                    <span>{getBrandName(brands, insight.brand)}</span>
                    <div className={styles["insight-meta-details"]}>
                      <span>{formatIsoDate(insight.createdAt)}</span>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.action}
                          onClick={() =>
                            onEditInsight(insight)}
                          aria-label={`Edit insight: ${insight.text}`}
                        >
                          <PencilIcon className={styles.actionIcon} />
                        </button>
                        <button
                          type="button"
                          className={cx(styles.action, styles.delete)}
                          onClick={() =>
                            onDeleteInsight(insight)}
                          aria-label={`Delete insight: ${insight.text}`}
                        >
                          <Trash2Icon className={styles.actionIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className={styles["insight-content"]}>{insight.text}</p>
                </li>
              ))}
            </ul>
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
