import Link from "next/link";
import { site, formatUsd } from "@/config/site";
import { Shell, Card, inputClass } from "@/components/Shell";
import { AccountNav } from "@/components/AccountNav";
import { StatusPill } from "@/components/StatusPill";
import { Uploader } from "@/components/Uploader";
import { requireAdmin, loadOrder } from "@/lib/access";
import { briefQuestions } from "@/lib/brief";
import { STATUS_LABEL, orderRef, packageLabel, revisionLimit, type OrderStatus } from "@/lib/server";
import { deleteFile, setStatus } from "@/app/admin/actions";

export const metadata = { title: `Order | Admin | ${site.brandName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminOrder({ params }: { params: { id: string } }) {
  const user = await requireAdmin();
  const { order, files, revisions } = await loadOrder(params.id);
  const limit = revisionLimit(order);

  return (
    <Shell wide right={<AccountNav email={user.email} admin />}>
      <Link href="/admin" className="text-[14px] text-muted hover:text-ink">
        ← All orders
      </Link>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[13px] font-medium text-muted">Order #{orderRef(order.id)}</p>
          <h1 className="mt-2 text-[32px] font-medium leading-[1.05] tracking-tightest md:text-[44px]">{packageLabel(order)}</h1>
          <p className="mt-2 text-[15px] text-muted">
            {order.email} · {formatUsd(order.amount_cents / 100)} · {new Date(order.created_at).toLocaleString("en-US")}
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-[22px] font-medium tracking-tightest">Brief</h2>
            {!order.brief ? (
              <p className="mt-3 text-muted">The client hasn’t filled in the brief yet.</p>
            ) : (
              <dl className="mt-5 divide-y divide-line">
                {briefQuestions.map((q) => (
                  <div key={q.id} className="grid gap-1 py-3 sm:grid-cols-[220px_1fr] sm:gap-4">
                    <dt className="text-[14px] text-muted">{q.label}</dt>
                    <dd className="whitespace-pre-wrap text-[15px]">{order.brief?.[q.id] || "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>

          <Card>
            <h2 className="text-[22px] font-medium tracking-tightest">Client feedback</h2>
            <p className="mt-1 text-[14px] text-muted">
              Revisions used: {order.revisions_used} / {limit === null ? "unlimited" : limit} · Approval score: {site.approvalScore}/10
            </p>
            {revisions.length === 0 ? (
              <p className="mt-4 text-muted">No feedback yet.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {revisions.map((r) => (
                  <li key={r.id} className="rounded-2xl border border-line bg-paper p-4">
                    <p className="text-[14px] font-medium">
                      {r.rating}/10 · {r.rating >= site.approvalScore ? "Approved" : "Changes requested"}
                      <span className="ml-2 font-normal text-muted">{new Date(r.created_at).toLocaleString("en-US")}</span>
                    </p>
                    {r.feedback && <p className="mt-2 whitespace-pre-wrap text-[15px]">{r.feedback}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-[22px] font-medium tracking-tightest">Deliver</h2>
            <div className="mt-5 space-y-4">
              <Uploader orderId={order.id} kind="concept" label="Upload concepts (images: PNG, JPG)" />
              <Uploader orderId={order.id} kind="final" label="Upload final files (any format, ZIP recommended)" />
            </div>
            {files.length > 0 && (
              <ul className="mt-6 divide-y divide-line">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                    <span className="truncate">
                      <span className="mr-2 rounded-full bg-paper px-2 py-0.5 text-[13px] font-medium">{f.kind}</span>
                      <a href={`/api/files/${f.id}/preview`} target="_blank" className="underline-offset-2 hover:underline">
                        {f.file_name}
                      </a>
                    </span>
                    <form action={deleteFile}>
                      <input type="hidden" name="file_id" value={f.id} />
                      <button className="text-red-600 hover:underline">Delete</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-[22px] font-medium tracking-tightest">Status</h2>
            <form action={setStatus} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="order_id" value={order.id} />
              <select name="status" defaultValue={order.status} className={inputClass}>
                {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <button className="shrink-0 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-white">Save</button>
            </form>
            <div className={`mt-5 rounded-2xl p-4 text-[14px] ${order.refund_locked ? "bg-ink text-white" : "bg-paper"}`}>
              {order.refund_locked
                ? `Final files downloaded on ${new Date(order.downloaded_at!).toLocaleString("en-US")}. Not refundable.`
                : "Refundable under your refund policy. Refunds are made in your Stripe dashboard, then set the status to “Refunded”."}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
