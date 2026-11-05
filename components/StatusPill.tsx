import { STATUS_LABEL, type Order } from "@/lib/server";

export function StatusPill({ status }: { status: Order["status"] }) {
  const action = status === "awaiting_brief" || status === "concepts_ready" || status === "delivered";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium ${
        action ? "bg-gradient-brand text-ink" : status === "refunded" ? "bg-ink/10 text-ink/60" : "bg-ink text-white"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${action ? "bg-ink" : "bg-lime"}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
