import { useRef, useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import { type InsertInsight, Insight } from "../../schemas/insight.ts";

type AddInsightProps = {
  addNewInsight: (newInsight: Insight) => void;
} & ModalProps;

export const AddInsight = (props: AddInsightProps) => {
  const { addNewInsight, onClose, ...modalProps } = props;

  const [brand, setBrand] = useState(BRANDS[0].id);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const addInsight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const insightInput: InsertInsight = {
      brand,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insightInput),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(
              data.error?.[0]?.message ?? "Failed to add insight",
            );
          });
        }
        return res.json();
      })
      .then((data) => {
        addNewInsight(Insight.parse(data));
        setBrand(BRANDS[0].id);
        setText("");
        handleClose();
      })
      .catch((err) => {
        setError(err.message);
        textRef.current?.focus();
      });
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
          >
            {BRANDS.map(({ id, name }) => (
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
