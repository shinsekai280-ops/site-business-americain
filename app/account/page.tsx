import Link from "next/link";
import { site, formatUsd } from "@/config/site";
import { Shell, Card } from "@/components/Shell";
import { AccountNav } from "@/components/AccountNav";
import { DarkButton } from "@/components/ui";
import { requireUser } from "@/lib/access";
import { isAdminEmail, supabaseAdmin } from "@/lib/supabase";
import { orderRef, packageLabel, type Order } from "@/lib/server";
import { StatusPill } from "@/components/StatusPill";

export const metadata = { title: `My orders | ${site.brandName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await requireUser();
  const { data } = await supabaseAdmin().from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  const orders = (data || []) as Order[];

  return (
    <Shell right={<AccountNav email={user.email} admin={isAdminEmail(user.email)} />}>
      <h1 className="text-[38px] font-medium leading-[1.02] tracking-tightest md:text-[56px]">Your brand projects.</h1>
      <div className="mt-10 space-y-4">
        {orders.length === 0 && (
          <Card>
            <p className="text-[17px]">You don’t have any order yet.</p>
            <div className="mt-6">
              <DarkButton href="/#pricing">See packages</DarkButton>
            </div>
          </Card>
        )}
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/account/orders/${o.id}`}
            className="flex flex-col gap-3 rounded-[24px] border border-line bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-float sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-muted">Order #{orderRef(o.id)}</p>
              <p className="mt-1 text-[19px] font-medium tracking-[-0.02em]">{packageLabel(o)}</p>
            </div>
            <div className="flex items-center gap-4">
              <StatusPill status={o.status} />
              <span className="text-[15px] text-muted">{formatUsd(o.amount_cents / 100)}</span>
            </div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
