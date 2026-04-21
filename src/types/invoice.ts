export type InvoiceStatus = "draft" | "pending" | "paid";

export type InvoiceItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type Address = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type Invoice = {
  id: string;
  createdAt: string;
  paymentDue: string;
  currency: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
};

export type InvoiceInput = Omit<Invoice, "id" | "paymentDue" | "total"> & {
  id?: string;
};

export type ValidationErrors = Partial<Record<string, string>>;
