"use client";

import { useMemo } from "react";

import { ALL_STATUS } from "@/lib/constants";
import type { InvoiceStatus } from "@/types/invoice";

type Props = {
  selected: InvoiceStatus[];
  onChange: (value: InvoiceStatus[]) => void;
};

export function StatusFilter({ selected, onChange }: Props) {
  const allSelected = useMemo(() => selected.length === ALL_STATUS.length, [selected]);

  const toggleSingle = (value: InvoiceStatus) => {
    if (selected.includes(value)) {
      const next = selected.filter((item) => item !== value);
      onChange(next.length ? next : ALL_STATUS);
      return;
    }

    onChange([...selected, value]);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold text-[var(--color-muted)]">Filter by status</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-stroke)] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-brand)]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onChange(ALL_STATUS)}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          All
        </label>
        {ALL_STATUS.map((status) => (
          <label
            key={status}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-stroke)] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold capitalize text-[var(--color-text)] transition hover:border-[var(--color-brand)]"
          >
            <input
              type="checkbox"
              checked={selected.includes(status)}
              onChange={() => toggleSingle(status)}
              className="h-4 w-4 accent-[var(--color-brand)]"
            />
            {status}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
