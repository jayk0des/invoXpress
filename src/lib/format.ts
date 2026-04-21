import type { Invoice } from "@/types/invoice";

const formatterCache = new Map<string, Intl.NumberFormat>();

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatMoney(value: number, currency: string = "USD"): string {
  const cacheKey = `${currency}-en-US`;
  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(
      cacheKey,
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }),
    );
  }
  return formatterCache.get(cacheKey)!.format(value);
}

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function safeAddress(address: Invoice["senderAddress"]): string[] {
  return [address.street, address.city, address.postCode, address.country].filter(Boolean);
}
