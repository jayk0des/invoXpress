import { NextResponse } from "next/server";

import { createInvoice, listInvoices } from "@/lib/invoice-storage";
import type { InvoiceInput } from "@/types/invoice";

export const runtime = "nodejs";

export async function GET() {
  try {
    const invoices = await listInvoices();
    return NextResponse.json(invoices);
  } catch {
    return NextResponse.json({ message: "Failed to load invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as InvoiceInput;
    const result = await createInvoice(payload);

    if (result.errors) {
      return NextResponse.json({ errors: result.errors }, { status: 400 });
    }

    return NextResponse.json(result.invoice, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create invoice" }, { status: 500 });
  }
}
