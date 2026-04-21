import type { InvoiceStatus } from "@/types/invoice";

export const ALL_STATUS: Array<InvoiceStatus> = ["draft", "pending", "paid"];

export const STATUS_STYLES: Record<InvoiceStatus, { badge: string; dot: string; label: string }> = {
  draft: {
    label: "Draft",
    badge: "bg-slate-500/10 text-slate-700 dark:bg-slate-200/10 dark:text-slate-200",
    dot: "bg-slate-500 dark:bg-slate-300",
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-500/10 text-amber-700 dark:bg-amber-300/10 dark:text-amber-300",
    dot: "bg-amber-500 dark:bg-amber-300",
  },
  paid: {
    label: "Paid",
    badge: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300",
    dot: "bg-emerald-500 dark:bg-emerald-300",
  },
};

export const PAYMENT_TERM_OPTIONS = [
  { label: "Net 1 Day", value: 1 },
  { label: "Net 7 Days", value: 7 },
  { label: "Net 14 Days", value: 14 },
  { label: "Net 30 Days", value: 30 },
];

export const CURRENCY_OPTIONS = [
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "NGN", label: "Nigerian Naira (NGN)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
];
