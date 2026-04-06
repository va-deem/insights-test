import { useEffect, useRef, useState } from "react";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./insight-form.module.css";
import type { Brand, InsertInsight, Insight } from "../../schemas/insight.ts";

type InsightFormProps = {
  insight?: Insight | null;
  onSubmitInsight: (input: InsertInsight) => Promise<void>;
  brands: Brand[];
} & ModalProps;

export const InsightForm = (props: InsightFormProps) => {
  const { insight, onSubmitInsight, brands, open, onClose, ...modalProps } =
    props;
  const isEditing = insight !== null && insight !== undefined;

  const [brand, setBrand] = useState<number>(
    insight?.brand ?? brands[0]?.id ?? 0,
  );
  const [text, setText] = useState(insight?.text ?? "");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setBrand(insight?.brand ?? brands[0]?.id ?? 0);
    setText(insight?.text ?? "");
    setError(null);
  }, [brands, insight, open]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const submitInsight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const insightInput: InsertInsight = {
      brand,
      text: text.trim(),
    };

    try {
      await onSubmitInsight(insightInput);

      setBrand(brands[0]?.id ?? 0);
      setText("");
      handleClose();
    } catch {
      setError(
        isEditing ? "Failed to update insight" : "Failed to add insight",
      );
      textRef.current?.focus();
    }
  };

  const handleSelectBrand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(Number(e.target.value));
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setError(null);
  };

  return (
    <Modal {...modalProps} open={open} onClose={handleClose}>
      <h1 className={styles.heading}>
        {isEditing ? "Edit insight" : "Add a new insight"}
      </h1>
      <form className={styles.form} onSubmit={submitInsight}>
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={handleSelectBrand}
            disabled={brands.length === 0}
          >
            {brands.map(({ id, name }) => (
              <option value={id} key={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            ref={textRef}
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={handleTextChange}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          className={styles.submit}
          type="submit"
          label={isEditing ? "Save insight" : "Add insight"}
        />
      </form>
    </Modal>
  );
};
