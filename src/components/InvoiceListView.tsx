"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { StatusFilter } from "@/components/StatusFilter";
import { formatDate, formatMoney } from "@/lib/format";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

const FILTER_KEY = "invoxpress-filter";

export function InvoiceListView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceStatus[]>(() => {
    if (typeof window === "undefined") return ["draft", "pending", "paid"];
    const saved = localStorage.getItem(FILTER_KEY);
    if (!saved) return ["draft", "pending", "paid"];
    const parsed = saved.split(",") as InvoiceStatus[];
    return parsed.length ? parsed : ["draft", "pending", "paid"];
  });

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/invoices");
      const data = (await response.json()) as Invoice[];
      setInvoices(data);
      setLoading(false);
    };

    void load();
  }, []);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, filter.join(","));
  }, [filter]);

  const filtered = useMemo(
    () => invoices.filter((invoice) => filter.includes(invoice.status)),
    [invoices, filter],
  );
  const hasInvoices = invoices.length > 0;
  const hasFilteredResults = filtered.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {hasInvoices
              ? `${filtered.length} invoice${filtered.length === 1 ? "" : "s"} shown`
              : "No invoices"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/new"
            className="rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
          >
            + New Invoice
          </Link>
        </div>
      </header>

      <StatusFilter selected={filter} onChange={setFilter} />

      {loading ? (
        <p className="py-10 text-center text-sm text-[var(--color-muted)]">
          Loading invoices...
        </p>
      ) : null}

      {!loading && !hasInvoices ? (
        <section className="flex min-h-[54vh] flex-col items-center justify-center rounded-2xl bg-[var(--color-surface)] px-6 py-10 text-center">
          <Image
            src="/empty-invoices.png"
            alt="Empty invoices illustration"
            width={220}
            height={180}
            priority
          />
          <h2 className="mt-8 text-2xl font-bold text-[var(--color-text)]">
            There is nothing here
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--color-muted)]">
            Create an invoice by clicking the{" "}
            <span className="font-semibold text-[var(--color-text)]">
              New Invoice
            </span>{" "}
            button and get started.
          </p>
        </section>
      ) : null}

      {!loading && hasInvoices && !hasFilteredResults ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-stroke)] bg-[var(--color-surface)] p-10 text-center">
          <p className="text-lg font-semibold text-[var(--color-text)]">
            No invoices match this filter
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Try adjusting your status filters.
          </p>
        </div>
      ) : null}

      <ul className={`space-y-3 ${!hasFilteredResults ? "hidden" : ""}`}>
        {filtered.map((invoice) => (
          <li key={invoice.id}>
            <Link
              href={`/invoices/${invoice.id}`}
              className="grid gap-3 rounded-2xl border border-transparent bg-[var(--color-surface)] p-4 shadow-sm transition hover:border-[var(--color-brand)] hover:shadow-md sm:grid-cols-[auto_1fr_auto_auto_auto] sm:items-center"
            >
              <p className="text-sm font-bold text-[var(--color-text)]">
                #{invoice.id}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                Due {formatDate(invoice.paymentDue)}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {invoice.clientName}
              </p>
              <p className="text-lg font-bold text-[var(--color-text)]">
                {formatMoney(invoice.total, invoice.currency || "USD")}
              </p>
              <StatusBadge status={invoice.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
