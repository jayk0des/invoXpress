"use client";

import { useEffect, useRef } from "react";

type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ title, description, confirmLabel, cancelLabel = "Cancel", onConfirm, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const focusables = containerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key === "Tab" && first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-description"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] p-6 shadow-2xl"
      >
        <h2 id="confirm-title" className="text-xl font-bold text-[var(--color-text)]">
          {title}
        </h2>
        <p id="confirm-description" className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-[var(--color-background)] px-5 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-stroke)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[var(--color-danger)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
