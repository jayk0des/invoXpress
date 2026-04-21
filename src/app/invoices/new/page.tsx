import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceListView } from "@/components/InvoiceListView";

export default function NewInvoicePage() {
  return (
    <>
      <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-brand)]">
          <ArrowLeft size={16} />
          <p>Go Back</p>
        </Link>
        <section className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm sm:p-8">
          <h1 className="mb-6 text-3xl font-bold text-[var(--color-text)]">New Invoice</h1>
          <InvoiceForm mode="create" />
        </section>
      </main>

      <div className="relative hidden min-h-[calc(100vh-2rem)] lg:block">
        <div className="pointer-events-none select-none">
          <InvoiceListView />
        </div>
        <div className="absolute inset-0 bg-[#0c0e16]/45" />

        <aside className="absolute inset-y-0 left-0 w-[min(52rem,50vw)] overflow-y-auto rounded-r-3xl border-r border-[var(--color-stroke)] bg-[var(--color-background)] shadow-2xl">
          <div className="mx-auto w-full max-w-4xl space-y-5 px-6 py-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-brand)]"
            >
              <ArrowLeft size={16} />
              <p>Go Back</p>
            </Link>
            <section className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
              <h1 className="mb-6 text-3xl font-bold text-[var(--color-text)]">New Invoice</h1>
              <InvoiceForm mode="create" />
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}
