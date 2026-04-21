import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { InvoiceDetailContent } from "@/components/InvoiceDetailContent";
import { getInvoiceById } from "@/lib/invoice-storage";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-muted)] transition hover:text-[var(--color-brand)]"
      >
        <ArrowLeft size={16} />
        <p>Go Back</p>
      </Link>
      <InvoiceDetailContent invoice={invoice} />
    </main>
  );
}
