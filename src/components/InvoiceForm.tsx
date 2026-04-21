"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { CURRENCY_OPTIONS, PAYMENT_TERM_OPTIONS } from "@/lib/constants";
import { formatMoney } from "@/lib/format";
import { validateInvoice } from "@/lib/validation";
import type { Invoice, InvoiceInput, InvoiceStatus } from "@/types/invoice";

type ItemForm = Invoice["items"][number];

type Props = {
  mode: "create" | "edit";
  invoice?: Invoice;
};

const emptyAddress = { street: "", city: "", postCode: "", country: "" };

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `item-${Math.random().toString(36).slice(2, 10)}`;
}

const defaultState: InvoiceInput = {
  createdAt: new Date().toISOString().slice(0, 10),
  currency: "USD",
  description: "",
  paymentTerms: 30,
  clientName: "",
  clientEmail: "",
  status: "pending",
  senderAddress: { ...emptyAddress },
  clientAddress: { ...emptyAddress },
  items: [{ id: createLocalId(), name: "", quantity: 1, price: 1, total: 1 }],
};

export function InvoiceForm({ mode, invoice }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<InvoiceInput>(() => {
    if (!invoice) return defaultState;
    return {
      createdAt: invoice.createdAt,
      currency: invoice.currency || "USD",
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      senderAddress: invoice.senderAddress,
      clientAddress: invoice.clientAddress,
      items: invoice.items,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const grandTotal = useMemo(
    () => form.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0),
    [form.items],
  );

  const updateItem = (itemId: string, updates: Partial<ItemForm>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }));
  };

  const submit = async (nextStatus: InvoiceStatus) => {
    setSubmitting(true);
    setErrors({});

    const payload: InvoiceInput = {
      ...form,
      status: nextStatus,
      paymentTerms: Number(form.paymentTerms),
      items: form.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price),
      })),
    };
    const strict = nextStatus !== "draft";
    const localErrors = validateInvoice(payload, strict);
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors as Record<string, string>);
      setSubmitting(false);
      return;
    }

    const endpoint = mode === "create" ? "/api/invoices" : `/api/invoices/${invoice?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? ((await response.json()) as { errors?: Record<string, string>; message?: string; id?: string }) : null;

      if (!response.ok) {
        setErrors(data?.errors ?? { form: data?.message ?? `Request failed (${response.status}). Please try again.` });
        setSubmitting(false);
        return;
      }

      const saved = data as Invoice;
      router.push(`/invoices/${saved.id}`);
      router.refresh();
    } catch {
      setErrors({ form: "Network error. Please try again." });
      setSubmitting(false);
    }
  };

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand)]">Bill From</h2>
        <Field label="Street Address" error={errors.senderStreet}>
          <input
            value={form.senderAddress.street}
            onChange={(event) => setForm((prev) => ({ ...prev, senderAddress: { ...prev.senderAddress, street: event.target.value } }))}
            className={inputClass(errors.senderStreet)}
          />
        </Field>
        <Field label="City" error={errors.senderCity}>
          <input
            value={form.senderAddress.city}
            onChange={(event) => setForm((prev) => ({ ...prev, senderAddress: { ...prev.senderAddress, city: event.target.value } }))}
            className={inputClass(errors.senderCity)}
          />
        </Field>
        <Field label="Post Code" error={errors.senderPostCode}>
          <input
            value={form.senderAddress.postCode}
            onChange={(event) => setForm((prev) => ({ ...prev, senderAddress: { ...prev.senderAddress, postCode: event.target.value } }))}
            className={inputClass(errors.senderPostCode)}
          />
        </Field>
        <Field label="Country" error={errors.senderCountry}>
          <input
            value={form.senderAddress.country}
            onChange={(event) => setForm((prev) => ({ ...prev, senderAddress: { ...prev.senderAddress, country: event.target.value } }))}
            className={inputClass(errors.senderCountry)}
          />
        </Field>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="sm:col-span-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brand)]">Bill To</h2>
        <Field label="Client Name" error={errors.clientName}>
          <input
            value={form.clientName}
            onChange={(event) => setForm((prev) => ({ ...prev, clientName: event.target.value }))}
            className={inputClass(errors.clientName)}
          />
        </Field>
        <Field label="Client Email" error={errors.clientEmail}>
          <input
            type="email"
            value={form.clientEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, clientEmail: event.target.value }))}
            className={inputClass(errors.clientEmail)}
          />
        </Field>
        <Field label="Client Street" error={errors.clientStreet}>
          <input
            value={form.clientAddress.street}
            onChange={(event) => setForm((prev) => ({ ...prev, clientAddress: { ...prev.clientAddress, street: event.target.value } }))}
            className={inputClass(errors.clientStreet)}
          />
        </Field>
        <Field label="Client City" error={errors.clientCity}>
          <input
            value={form.clientAddress.city}
            onChange={(event) => setForm((prev) => ({ ...prev, clientAddress: { ...prev.clientAddress, city: event.target.value } }))}
            className={inputClass(errors.clientCity)}
          />
        </Field>
        <Field label="Client Post Code" error={errors.clientPostCode}>
          <input
            value={form.clientAddress.postCode}
            onChange={(event) => setForm((prev) => ({ ...prev, clientAddress: { ...prev.clientAddress, postCode: event.target.value } }))}
            className={inputClass(errors.clientPostCode)}
          />
        </Field>
        <Field label="Client Country" error={errors.clientCountry}>
          <input
            value={form.clientAddress.country}
            onChange={(event) => setForm((prev) => ({ ...prev, clientAddress: { ...prev.clientAddress, country: event.target.value } }))}
            className={inputClass(errors.clientCountry)}
          />
        </Field>
        <Field label="Invoice Date" error={errors.createdAt}>
          <input
            type="date"
            value={form.createdAt}
            onChange={(event) => setForm((prev) => ({ ...prev, createdAt: event.target.value }))}
            className={inputClass(errors.createdAt)}
          />
        </Field>
        <Field label="Payment Terms" error={errors.paymentTerms}>
          <select
            value={form.paymentTerms}
            onChange={(event) => setForm((prev) => ({ ...prev, paymentTerms: Number(event.target.value) }))}
            className={inputClass(errors.paymentTerms)}
          >
            {PAYMENT_TERM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Currency" error={errors.currency}>
          <select
            value={form.currency}
            onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
            className={inputClass(errors.currency)}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project Description" error={errors.description} full>
          <input
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className={inputClass(errors.description)}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[var(--color-muted)]">Item List</h2>
        {errors.items ? <p className="text-sm font-semibold text-[var(--color-danger)]">{errors.items}</p> : null}
        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div key={item.id} className="grid gap-2 rounded-xl border border-[var(--color-stroke)] p-3 sm:grid-cols-[2fr_1fr_1fr_auto_auto] sm:items-end">
              <Field label="Item Name" error={errors[`itemName_${index}`]}>
                <input
                  value={item.name}
                  onChange={(event) => updateItem(item.id, { name: event.target.value })}
                  className={inputClass(errors[`itemName_${index}`])}
                />
              </Field>
              <Field label="Qty." error={errors[`itemQty_${index}`]}>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateItem(item.id, { quantity: Number(event.target.value) })}
                  className={inputClass(errors[`itemQty_${index}`])}
                />
              </Field>
              <Field label="Price" error={errors[`itemPrice_${index}`]}>
                <input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={item.price}
                  onChange={(event) => updateItem(item.id, { price: Number(event.target.value) })}
                  className={inputClass(errors[`itemPrice_${index}`])}
                />
              </Field>
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted)]">Total</p>
                <p className="mt-2 text-sm font-bold text-[var(--color-text)]">
                  {formatMoney(Number(item.quantity) * Number(item.price), form.currency || "USD")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, items: prev.items.filter((row) => row.id !== item.id) }))}
                disabled={form.items.length <= 1}
                className="rounded-lg border border-[var(--color-stroke)] px-3 py-2 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-danger)] hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              items: [...prev.items, { id: createLocalId(), name: "", quantity: 1, price: 1, total: 1 }],
            }))
          }
          className="w-full rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-muted)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
        >
          + Add New Item
        </button>
      </section>

      <div className="rounded-xl border border-[var(--color-stroke)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-muted)]">Grand Total</p>
        <p className="text-2xl font-bold text-[var(--color-text)]">{formatMoney(grandTotal, form.currency || "USD")}</p>
        {errors.form ? <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.form}</p> : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full bg-[var(--color-background)] px-5 py-3 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-stroke)]"
        >
          Cancel
        </button>

        {mode === "create" || form.status === "draft" ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => submit("draft")}
            className="draft-save-button rounded-full bg-[var(--color-text)] px-5 py-3 text-sm font-semibold text-[var(--draft-save-text)] transition hover:brightness-110 disabled:opacity-60"
          >
            Save as Draft
          </button>
        ) : null}

        {mode === "edit" && form.status === "draft" ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => submit("pending")}
            className="rounded-full bg-[var(--color-brand-secondary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            Save & Mark Pending
          </button>
        ) : null}

        <button
          type="button"
          disabled={submitting}
          onClick={() => submit(form.status === "paid" ? "paid" : "pending")}
          className="rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {mode === "create" ? "Save & Send" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function inputClass(hasError?: string) {
  return `w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-brand)] ${
    hasError ? "border-[var(--color-danger)]" : "border-[var(--color-stroke)]"
  }`;
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`space-y-1 ${full ? "sm:col-span-2" : ""}`}>
      <span className="flex items-center justify-between text-xs font-semibold text-[var(--color-muted)]">
        <span>{label}</span>
        {error ? <span className="text-[var(--color-danger)]">{error}</span> : null}
      </span>
      {children}
    </label>
  );
}
