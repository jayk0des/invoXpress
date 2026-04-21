import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { InvoiceDetailContent } from "@/components/InvoiceDetailContent";
import { InvoiceForm } from "@/components/InvoiceForm";
import { getInvoiceById } from "@/lib/invoice-storage";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <>
      <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:hidden">
        <Link
          href={`/invoices/${invoice.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-brand)]"
        >
          <ArrowLeft size={16} />
          <p>Go Back</p>
        </Link>
        <section className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm sm:p-8">
          <h1 className="mb-6 text-3xl font-bold text-[var(--color-text)]">Edit #{invoice.id}</h1>
          <InvoiceForm mode="edit" invoice={invoice} />
        </section>
      </main>

      <div className="relative hidden min-h-[calc(100vh-2rem)] lg:block">
        <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
            <ArrowLeft size={16} />
            <p>Go Back</p>
          </div>
          <InvoiceDetailContent invoice={invoice} />
        </main>

        <div className="absolute inset-0 bg-[#0c0e16]/45" />

        <aside className="absolute inset-y-0 left-0 w-[min(52rem,50vw)] overflow-y-auto rounded-r-3xl border-r border-[var(--color-stroke)] bg-[var(--color-background)] shadow-2xl">
          <div className="mx-auto w-full max-w-4xl space-y-5 px-6 py-8">
            <Link
              href={`/invoices/${invoice.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-brand)]"
            >
              <ArrowLeft size={16} />
              <p>Go Back</p>
            </Link>
            <section className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
              <h1 className="mb-6 text-3xl font-bold text-[var(--color-text)]">Edit #{invoice.id}</h1>
              <InvoiceForm mode="edit" invoice={invoice} />
            </section>
          </div>
        </aside>
      </div>
    </>
  );
}
