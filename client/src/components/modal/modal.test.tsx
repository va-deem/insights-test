import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./modal.tsx";

describe("Modal", () => {
  it("should open and close", () => {
    render(
      <Modal open={false} onClose={() => undefined}>
        Closed modal
      </Modal>,
    );
    expect(screen.queryByText("Closed modal")).toBeFalsy();

    render(
      <Modal open onClose={() => undefined}>
        <div>Open modal</div>
      </Modal>,
    );
    expect(screen.getByText("Open modal")).toBeTruthy();
  });

  it("closes on escape", () => {
    const onClose = vi.fn();

    render(
      <Modal open onClose={onClose}>
        <div>Open modal</div>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the modal when opened", () => {
    render(
      <Modal open onClose={() => undefined}>
        <button type="button">Primary action</button>
      </Modal>,
    );

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Primary action" }),
    );
  });
});
