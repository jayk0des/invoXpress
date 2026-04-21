import type { Invoice, InvoiceItem, InvoiceInput, ValidationErrors } from "@/types/invoice";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeItems(items: unknown): InvoiceItem[] {
  return Array.isArray(items) ? (items as InvoiceItem[]) : [];
}

export function computeItems(items: InvoiceItem[]): InvoiceItem[] {
  return items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    price: Number(item.price),
    total: Number(item.quantity) * Number(item.price),
  }));
}

export function computeTotals(payload: InvoiceInput): Pick<Invoice, "items" | "total" | "paymentDue"> {
  const computedItems = computeItems(payload.items);
  const total = computedItems.reduce((sum, item) => sum + item.total, 0);
  const createdDate = payload.createdAt ? new Date(payload.createdAt) : new Date();
  const paymentDueDate = new Date(createdDate);
  paymentDueDate.setDate(paymentDueDate.getDate() + Number(payload.paymentTerms || 0));

  return {
    items: computedItems,
    total,
    paymentDue: toDateString(paymentDueDate),
  };
}

export function validateInvoice(payload: InvoiceInput, strict: boolean): ValidationErrors {
  const errors: ValidationErrors = {};

  const senderAddress = payload.senderAddress ?? { street: "", city: "", postCode: "", country: "" };
  const clientAddress = payload.clientAddress ?? { street: "", city: "", postCode: "", country: "" };
  const items = safeItems(payload.items);

  if (strict) {
    if (!safeString(payload.currency).trim()) errors.currency = "Currency is required";
    if (!safeString(payload.description).trim()) errors.description = "Project description is required";
    if (!safeString(payload.clientName).trim()) errors.clientName = "Client name is required";
    if (!safeString(payload.clientEmail).trim()) {
      errors.clientEmail = "Client email is required";
    } else if (!EMAIL_PATTERN.test(safeString(payload.clientEmail))) {
      errors.clientEmail = "Enter a valid email address";
    }

    if (!payload.createdAt) errors.createdAt = "Invoice date is required";
    if (!isPositiveNumber(Number(payload.paymentTerms))) {
      errors.paymentTerms = "Payment terms must be greater than 0";
    }

    if (!safeString(senderAddress.street).trim()) errors.senderStreet = "Street is required";
    if (!safeString(senderAddress.city).trim()) errors.senderCity = "City is required";
    if (!safeString(senderAddress.postCode).trim()) errors.senderPostCode = "Post code is required";
    if (!safeString(senderAddress.country).trim()) errors.senderCountry = "Country is required";

    if (!safeString(clientAddress.street).trim()) errors.clientStreet = "Street is required";
    if (!safeString(clientAddress.city).trim()) errors.clientCity = "City is required";
    if (!safeString(clientAddress.postCode).trim()) errors.clientPostCode = "Post code is required";
    if (!safeString(clientAddress.country).trim()) errors.clientCountry = "Country is required";

    if (!items.length) {
      errors.items = "At least one invoice item is required";
    }
  }

  items.forEach((item, index) => {
    if (strict && !safeString(item.name).trim()) {
      errors[`itemName_${index}`] = "Item name is required";
    }
    if (!isPositiveNumber(Number(item.quantity))) {
      errors[`itemQty_${index}`] = "Quantity must be greater than 0";
    }
    if (!isPositiveNumber(Number(item.price))) {
      errors[`itemPrice_${index}`] = "Price must be greater than 0";
    }
  });

  return errors;
}
