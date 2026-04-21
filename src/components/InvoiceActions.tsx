"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmModal } from "@/components/ConfirmModal";
import type { Invoice } from "@/types/invoice";

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const deleteCurrent = async () => {
    setBusy(true);
    const response = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/");
      router.refresh();
      return;
    }
    setBusy(false);
    setConfirmOpen(false);
  };

  const markPaid = async () => {
    setBusy(true);
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_paid" }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href={`/invoices/${invoice.id}/edit`}
          className="rounded-full bg-[var(--color-background)] px-5 py-3 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-stroke)]"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="rounded-full bg-[var(--color-danger)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Delete
        </button>
        {invoice.status === "pending" ? (
          <button
            type="button"
            disabled={busy}
            onClick={markPaid}
            className="rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            Mark as Paid
          </button>
        ) : null}
      </div>

      {confirmOpen ? (
        <ConfirmModal
          title="Confirm Deletion"
          description={`Are you sure you want to delete invoice #${invoice.id}? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deleteCurrent}
        />
      ) : null}
    </>
  );
}
