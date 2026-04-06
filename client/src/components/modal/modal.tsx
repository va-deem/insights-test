import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cx } from "../../lib/cx.ts";
import styles from "./modal.module.css";

export type ModalProps = {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal closes */
  onClose(): void;
  /** Content of the modal */
  children?: ReactNode;
};

const ANIMATIONS = {
  overlay: {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
      },
    },
  },
  modal: {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 },
  },
};

/**
 * @component
 * Modal that opens in a portal
 */
export const Modal = ({ open, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    (firstFocusable ?? modalRef.current)?.focus();

    return () => {
      previousActiveElement?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <LayoutGroup>
          <motion.div
            className={styles.overlay}
            variants={ANIMATIONS.overlay}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            data-testid="overlay"
          >
            <motion.div
              ref={modalRef}
              className={cx(styles.modal)}
              variants={ANIMATIONS.modal}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close modal"
              >
                <XIcon className={styles.closeIcon} />
              </button>

              <div ref={contentRef} className={cx(styles.content)}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      )}
    </AnimatePresence>,
    document.body,
  );
};
