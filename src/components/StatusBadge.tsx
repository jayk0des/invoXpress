import { STATUS_STYLES } from "@/lib/constants";
import type { InvoiceStatus } from "@/types/invoice";

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold ${style.badge}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
