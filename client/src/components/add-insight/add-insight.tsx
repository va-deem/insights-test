import { useEffect, useRef, useState } from "react";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import type { Brand, InsertInsight } from "../../schemas/insight.ts";

type AddInsightProps = {
  onAddInsight: (input: InsertInsight) => Promise<void>;
  brands: Brand[];
} & ModalProps;

export const AddInsight = (props: AddInsightProps) => {
  const { onAddInsight, brands, onClose, ...modalProps } = props;

  const [brand, setBrand] = useState<number>(brands[0]?.id ?? 0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (brands.length > 0 && !brands.some(({ id }) => id === brand)) {
      setBrand(brands[0].id);
    }
  }, [brand, brands]);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const addInsight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const insightInput: InsertInsight = {
      brand,
      text: text.trim(),
    };

    try {
      await onAddInsight(insightInput);

      setBrand(brands[0]?.id ?? 0);
      setText("");
      handleClose();
    } catch {
      setError("Failed to add insight");
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
    <Modal {...modalProps} onClose={handleClose}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
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
        <Button className={styles.submit} type="submit" label="Add insight" />
      </form>
    </Modal>
  );
};
