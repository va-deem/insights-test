import { useState } from "react";
import { Button } from "../button/button.tsx";
import styles from "./header.module.css";
import { AddInsight } from "../add-insight/add-insight.tsx";
import type { Brand, InsertInsight } from "../../schemas/insight.ts";

export const HEADER_TEXT = "Suit Tracker Insights";

type HeaderProps = {
  onAddInsight: (input: InsertInsight) => Promise<void>;
  brands: Brand[];
};

export const Header = ({ onAddInsight, brands }: HeaderProps) => {
  const [addInsightOpen, setAddInsightOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <span className={styles.logo}>{HEADER_TEXT}</span>
          <Button
            label="Add insight"
            theme="secondary"
            onClick={() => setAddInsightOpen(true)}
          />
        </div>
      </header>
      <AddInsight
        open={addInsightOpen}
        onClose={() => setAddInsightOpen(false)}
        onAddInsight={onAddInsight}
        brands={brands}
      />
    </>
  );
};
