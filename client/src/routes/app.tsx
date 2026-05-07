import { useEffect, useState } from "react";
import { listBrands } from "../http/brands.ts";
import {
  createInsight as createInsightRequest,
  deleteInsight as deleteInsightRequest,
  listInsights,
  updateInsight as updateInsightRequest,
} from "../http/insights.ts";
import { Button } from "../components/button/button.tsx";
import { InsightForm } from "../components/insight-form/insight-form.tsx";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import { Modal } from "../components/modal/modal.tsx";
import styles from "./app.module.css";
import type { Brand, InsertInsight, Insight } from "../schemas/insight.ts";

export const App = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isInsightError, setIsInsightError] = useState(false);
  const [editedInsight, setEditedInsight] = useState<Insight | null>(null);
  const [deletedInsight, setDeletedInsight] = useState<Insight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openCreateModal = () => {
    setEditedInsight(null);
    setIsModalOpen(true);
  };

  const openEditModal = (insight: Insight) => {
    setEditedInsight(insight);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditedInsight(null);
    setIsModalOpen(false);
  };

  const openDeleteModal = (insight: Insight) => {
    setDeletedInsight(insight);
  };

  const closeDeleteModal = () => {
    setDeletedInsight(null);
  };

  const saveInsight = async (input: InsertInsight) => {
    if (editedInsight) {
      const updatedInsight = await updateInsightRequest(
        editedInsight.id,
        input,
      );
      setInsights((prev) =>
        prev.map((item) =>
          item.id === updatedInsight.id ? updatedInsight : item
        )
      );
    } else {
      const newInsight = await createInsightRequest(input);
      setInsights((prev) => [...prev, newInsight]);
    }

    setIsInsightError(false);
  };

  const removeInsight = async () => {
    if (!deletedInsight) {
      return;
    }

    const deletedId = await deleteInsightRequest(deletedInsight.id);
    setInsights((prev) => prev.filter((i) => i.id !== deletedId));
    closeDeleteModal();
  };

  return (
    <main className={styles.main}>
      <Header onAddInsightClick={openCreateModal} />

      <InsightForm
        open={isModalOpen}
        onClose={closeModal}
        insight={editedInsight}
        onSubmitInsight={saveInsight}
        brands={brands}
      />

      <Modal open={deletedInsight !== null} onClose={closeDeleteModal}>
        <p className={styles.dialogText}>Delete this insight?</p>
        <div className={styles.dialogActions}>
          <Button
            type="button"
            label="Delete"
            onClick={() => void removeInsight()}
          />
        </div>
      </Modal>

      <Insights
        className={styles.insights}
        brands={brands}
        isError={isInsightError}
        insights={insights}
        onEditInsight={openEditModal}
        onDeleteInsight={openDeleteModal}
      />
    </main>
  );
};
