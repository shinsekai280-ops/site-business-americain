import Link from "next/link";
import { site, formatUsd } from "@/config/site";
import { Shell } from "@/components/Shell";
import { AccountNav } from "@/components/AccountNav";
import { StatusPill } from "@/components/StatusPill";
import { requireAdmin } from "@/lib/access";
import { supabaseAdmin } from "@/lib/supabase";
import { STATUS_LABEL, orderRef, packageLabel, type Order, type OrderStatus } from "@/lib/server";

export const metadata = { title: `Admin | ${site.brandName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Admin({ searchParams }: { searchParams: { status?: string } }) {
  const user = await requireAdmin();
  let q = supabaseAdmin().from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (searchParams.status) q = q.eq("status", searchParams.status);
  const { data } = await q;
  const orders = (data || []) as Order[];

  const { data: all } = await supabaseAdmin().from("orders").select("status, amount_cents, refund_locked");
  const revenue = (all || []).filter((o) => o.status !== "refunded").reduce((s, o) => s + o.amount_cents, 0);
  const todo = (all || []).filter((o) => ["in_progress", "revision_requested", "approved"].includes(o.status)).length;

  return (
    <Shell wide right={<AccountNav email={user.email} admin />}>
      <h1 className="text-[38px] font-medium leading-[1.02] tracking-tightest md:text-[56px]">Orders</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Orders" value={String(all?.length || 0)} />
        <Stat label="Revenue" value={formatUsd(Math.round(revenue / 100))} />
        <Stat label="To do now" value={String(todo)} highlight />
      </div>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
        <FilterLink href="/admin" active={!searchParams.status} label="All" />
        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
          <FilterLink key={s} href={`/admin?status=${s}`} active={searchParams.status === s} label={STATUS_LABEL[s]} />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/orders/${o.id}`}
            className="grid gap-3 rounded-[22px] border border-line bg-white p-5 shadow-card transition hover:shadow-float md:grid-cols-[120px_1.5fr_1.3fr_auto_100px] md:items-center"
          >
            <span className="font-mono text-[13px] uppercase text-muted">#{orderRef(o.id)}</span>
            <span className="truncate text-[15px]">{o.email}</span>
            <span className="text-[15px] font-medium">{packageLabel(o)}</span>
            <StatusPill status={o.status} />
            <span className="text-[15px] md:text-right">{formatUsd(o.amount_cents / 100)}</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-[22px] p-5 shadow-card ${highlight ? "bg-ink text-white" : "border border-line bg-white"}`}>
      <p className={`font-mono text-[11px] uppercase tracking-[0.15em] ${highlight ? "text-white/60" : "text-muted"}`}>{label}</p>
      <p className="mt-2 text-[32px] font-medium tracking-tightest">{value}</p>
    </div>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href} className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] ${active ? "bg-ink text-white" : "border border-line bg-white text-ink/70"}`}>
      {label}
    </Link>
  );
}
