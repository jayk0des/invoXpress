import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { computeTotals, validateInvoice } from "@/lib/validation";
import type { Invoice, InvoiceInput, InvoiceStatus, ValidationErrors } from "@/types/invoice";

const DATA_DIR =
  process.env.NODE_ENV === "production" ? path.join(tmpdir(), "invoxpress-data") : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "invoices.json");
const SEED_FILE = path.join(process.cwd(), "data", "invoices.json");

function createId(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix = `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
  const number = (Math.floor(Math.random() * 9000) + 1000).toString();
  return `${prefix}${number}`;
}

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf-8");
  } catch {
    try {
      const seed = await readFile(SEED_FILE, "utf-8");
      await writeFile(DATA_FILE, seed, "utf-8");
    } catch {
      const sample: Invoice[] = [
        {
          id: "RT3080",
          createdAt: "2026-04-21",
          paymentDue: "2026-05-20",
          currency: "USD",
          description: "Website redesign",
          paymentTerms: 30,
          clientName: "Jensen Huang",
          clientEmail: "jensen@example.com",
          status: "pending",
          senderAddress: {
            street: "19 Union Terrace",
            city: "Lagos",
            postCode: "100001",
            country: "Nigeria",
          },
          clientAddress: {
            street: "106 Kendell Street",
            city: "Sharrington",
            postCode: "NR24 5WQ",
            country: "United Kingdom",
          },
          items: [
            { id: randomBytes(4).toString("hex"), name: "Design", quantity: 1, price: 1800, total: 1800 },
            { id: randomBytes(4).toString("hex"), name: "Dev", quantity: 2, price: 900, total: 1800 },
          ],
          total: 3600,
        },
      ];
      await writeFile(DATA_FILE, JSON.stringify(sample, null, 2), "utf-8");
    }
  }
}

async function readInvoices(): Promise<Invoice[]> {
  await ensureDataFile();
  const content = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(content) as Invoice[];
}

async function saveInvoices(invoices: Invoice[]): Promise<void> {
  await ensureDataFile();
  await writeFile(DATA_FILE, JSON.stringify(invoices, null, 2), "utf-8");
}

export async function listInvoices(): Promise<Invoice[]> {
  const invoices = await readInvoices();
  return invoices.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoices = await readInvoices();
  return invoices.find((invoice) => invoice.id === id) ?? null;
}

export async function createInvoice(payload: InvoiceInput): Promise<{ invoice?: Invoice; errors?: ValidationErrors }> {
  const strict = true;
  const errors = validateInvoice(payload, strict);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const normalizedItems = payload.items.map((item) => ({
    ...item,
    id: item.id || randomBytes(4).toString("hex"),
  }));

  const calculated = computeTotals({ ...payload, items: normalizedItems });

  const invoice: Invoice = {
    ...payload,
    id: payload.id ?? createId(),
    currency: payload.currency || "USD",
    items: calculated.items,
    total: calculated.total,
    paymentDue: calculated.paymentDue,
  };

  const invoices = await readInvoices();
  invoices.push(invoice);
  await saveInvoices(invoices);

  return { invoice };
}

export async function updateInvoice(
  id: string,
  payload: InvoiceInput,
): Promise<{ invoice?: Invoice; errors?: ValidationErrors; notFound?: boolean; invalidTransition?: boolean }> {
  const invoices = await readInvoices();
  const index = invoices.findIndex((invoice) => invoice.id === id);
  if (index === -1) {
    return { notFound: true };
  }
  const existing = invoices[index];

  if (existing.status === "paid" && payload.status === "draft") {
    return { invalidTransition: true };
  }

  const strict = true;
  const errors = validateInvoice(payload, strict);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const normalizedItems = payload.items.map((item) => ({
    ...item,
    id: item.id || randomBytes(4).toString("hex"),
  }));

  const calculated = computeTotals({ ...payload, items: normalizedItems });
  const updated: Invoice = {
    ...payload,
    id,
    currency: payload.currency || "USD",
    items: calculated.items,
    total: calculated.total,
    paymentDue: calculated.paymentDue,
  };

  invoices[index] = updated;
  await saveInvoices(invoices);

  return { invoice: updated };
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const invoices = await readInvoices();
  const next = invoices.filter((invoice) => invoice.id !== id);
  if (next.length === invoices.length) return false;
  await saveInvoices(next);
  return true;
}

export async function markInvoicePaid(id: string): Promise<{ invoice?: Invoice; notFound?: boolean; invalid?: boolean }> {
  const invoices = await readInvoices();
  const index = invoices.findIndex((invoice) => invoice.id === id);
  if (index === -1) return { notFound: true };

  if (invoices[index].status !== "pending") {
    return { invalid: true };
  }

  invoices[index] = { ...invoices[index], status: "paid" as InvoiceStatus };
  await saveInvoices(invoices);
  return { invoice: invoices[index] };
}
