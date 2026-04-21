import { NextResponse } from "next/server";

import { createInvoice, listInvoices } from "@/lib/invoice-storage";
import type { InvoiceInput } from "@/types/invoice";

export const runtime = "nodejs";

export async function GET() {
  const invoices = await listInvoices();
  return NextResponse.json(invoices);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as InvoiceInput;
  const result = await createInvoice(payload);

  if (result.errors) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json(result.invoice, { status: 201 });
}
