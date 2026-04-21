import { NextResponse } from "next/server";

import { deleteInvoice, getInvoiceById, markInvoicePaid, updateInvoice } from "@/lib/invoice-storage";
import type { InvoiceInput } from "@/types/invoice";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as Partial<InvoiceInput> & { action?: "mark_paid" };

  if (body.action === "mark_paid") {
    const result = await markInvoicePaid(id);
    if (result.notFound) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }
    if (result.invalid) {
      return NextResponse.json({ message: "Only pending invoices can be marked as paid" }, { status: 400 });
    }
    return NextResponse.json(result.invoice);
  }

  const result = await updateInvoice(id, body as InvoiceInput);
  if (result.notFound) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }
  if (result.errors) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json(result.invoice);
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteInvoice(id);
  if (!deleted) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
