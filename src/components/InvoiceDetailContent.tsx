import { InvoiceActions } from "@/components/InvoiceActions";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatMoney, safeAddress } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

export function InvoiceDetailContent({ invoice, showActions = true }: { invoice: Invoice; showActions?: boolean }) {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-muted)]">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        {showActions ? <InvoiceActions invoice={invoice} /> : <div />}
      </section>

      <section className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap justify-between gap-6 border-b border-[var(--color-stroke)] pb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">#{invoice.id}</h1>
            <p className="text-sm text-[var(--color-muted)]">{invoice.description}</p>
          </div>
          <address className="not-italic text-right text-sm leading-6 text-[var(--color-muted)]">
            {safeAddress(invoice.senderAddress).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Invoice Date</p>
              <p className="text-lg font-bold text-[var(--color-text)]">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--color-muted)]">Payment Due</p>
              <p className="text-lg font-bold text-[var(--color-text)]">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">Bill To</p>
            <p className="text-lg font-bold text-[var(--color-text)]">{invoice.clientName}</p>
            <address className="mt-2 not-italic text-sm leading-6 text-[var(--color-muted)]">
              {safeAddress(invoice.clientAddress).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
          </div>

          <div>
            <p className="text-sm text-[var(--color-muted)]">Sent to</p>
            <p className="text-lg font-bold text-[var(--color-text)]">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--color-stroke)]">
          <table className="min-w-full border-collapse">
            <thead className="bg-[var(--color-background)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3">Item Name</th>
                <th className="px-4 py-3">QTY.</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-t border-[var(--color-stroke)]">
                  <td className="px-4 py-3 font-semibold text-[var(--color-text)]">{item.name}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{item.quantity}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{formatMoney(item.price, invoice.currency || "USD")}</td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--color-text)]">{formatMoney(item.total, invoice.currency || "USD")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#141625]">
                <td colSpan={3} className="px-4 py-4 text-sm font-semibold text-white/70">
                  Amount Due
                </td>
                <td className="px-4 py-4 text-right text-xl font-bold text-white">{formatMoney(invoice.total, invoice.currency || "USD")}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}
