import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { site } from "@/config/site";
import { Shell, Card, Field, inputClass, SubmitButton, Notice } from "@/components/Shell";
import { AccountNav } from "@/components/AccountNav";
import { StatusPill } from "@/components/StatusPill";
import { Check, Shield } from "@/components/ui";
import { loadOrder } from "@/lib/access";
import { briefQuestions } from "@/lib/brief";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyAdmins, orderRef, packageLabel, revisionLimit } from "@/lib/server";
import { firstConceptsDate } from "@/lib/availability";

export const metadata = { title: `Your order | ${site.brandName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

/* ---------------- actions ---------------- */
async function submitBrief(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id"));
  const { order } = await loadOrder(id);
  if (order.status !== "awaiting_brief") redirect(`/account/orders/${id}`);
  const brief: Record<string, string> = {};
  for (const q of briefQuestions) brief[q.id] = String(formData.get(q.id) || "").trim().slice(0, 3000);
  await supabaseAdmin().from("orders").update({ brief, status: "in_progress" }).eq("id", id);
  await notifyAdmins(`Brief received #${orderRef(id)}`, `${order.email} submitted the brief for ${brief.company}. Send it to your designer.`, id);
  revalidatePath(`/account/orders/${id}`);
  redirect(`/account/orders/${id}`);
}

async function submitRevision(formData: FormData) {
  "use server";
  const id = String(formData.get("order_id"));
  const { order } = await loadOrder(id);
  if (order.status !== "concepts_ready") redirect(`/account/orders/${id}`);
  const rating = Math.min(10, Math.max(1, Number(formData.get("rating") || 0)));
  const preferred = String(formData.get("preferred") || "");
  const feedback = String(formData.get("feedback") || "").trim().slice(0, 5000);
  const approved = rating >= site.approvalScore;
  const limit = revisionLimit(order);
  if (!approved && !feedback) redirect(`/account/orders/${id}?error=feedback#review`);
  if (!approved && limit !== null && order.revisions_used >= limit) redirect(`/account/orders/${id}?error=limit#review`);

  const db = supabaseAdmin();
  await db.from("revisions").insert({ order_id: id, rating, feedback: [preferred && `Preferred concept: ${preferred}`, feedback].filter(Boolean).join("\n\n") });
  await db
    .from("orders")
    .update(approved ? { status: "approved" } : { status: "revision_requested", revisions_used: order.revisions_used + 1 })
    .eq("id", id);
  await notifyAdmins(
    approved ? `Concept approved #${orderRef(id)} (${rating}/10)` : `Revision requested #${orderRef(id)} (${rating}/10)`,
    approved ? `${order.email} approved the concept. Upload the final files.` : `${order.email} asked for changes:<br><br>${feedback.replace(/</g, "&lt;").replace(/\n/g, "<br>")}`,
    id
  );
  revalidatePath(`/account/orders/${id}`);
  redirect(`/account/orders/${id}`);
}

/* ---------------- page ---------------- */
export default async function OrderPage({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  const { user, admin, order, files, revisions } = await loadOrder(params.id);
  const concepts = files.filter((f) => f.kind === "concept");
  const finals = files.filter((f) => f.kind === "final");
  const limit = revisionLimit(order);
  const left = limit === null ? null : Math.max(0, limit - order.revisions_used);

  const steps = ["Brief", "Design", "Review", "Final files"];
  const stepIndex = { awaiting_brief: 0, in_progress: 1, revision_requested: 1, concepts_ready: 2, approved: 3, delivered: 3, refunded: 3 }[order.status];

  return (
    <Shell right={<AccountNav email={user.email} admin={admin} />}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-medium text-muted">Order #{orderRef(order.id)}</p>
          <h1 className="mt-2 text-[34px] font-medium leading-[1.02] tracking-tightest md:text-[48px]">{packageLabel(order)}</h1>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* progress */}
      <ol className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((s, i) => (
          <li key={s}>
            <div className={`h-1.5 rounded-full ${i <= stepIndex ? "bg-gradient-brand" : "bg-line"}`} />
            <p className={`mt-2 text-[12px] sm:text-[14px] ${i <= stepIndex ? "text-ink" : "text-muted"}`}>{s}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 space-y-6">
        {/* BRIEF */}
        {order.status === "awaiting_brief" && (
          <Card>
            <h2 className="text-[26px] font-medium tracking-tightest md:text-[32px]">Tell us about your business.</h2>
            <p className="mt-2 text-[16px] text-muted">About 5 minutes. The more precise you are, the better your first concepts.</p>
            <form action={submitBrief} className="mt-8 space-y-6">
              <input type="hidden" name="order_id" value={order.id} />
              {briefQuestions.map((q, i) => (
                <Field key={q.id} label={`${i + 1}. ${q.label}${q.required ? "" : " (optional)"}`} hint={q.hint}>
                  {q.type === "textarea" ? (
                    <textarea name={q.id} required={q.required} rows={3} className={inputClass} />
                  ) : q.type === "select" ? (
                    <select name={q.id} required={q.required} className={inputClass} defaultValue="">
                      <option value="" disabled>
                        Choose one
                      </option>
                      {q.options!.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input name={q.id} required={q.required} className={inputClass} />
                  )}
                </Field>
              ))}
              <SubmitButton>Send my brief</SubmitButton>
            </form>
          </Card>
        )}

        {/* WAITING */}
        {(order.status === "in_progress" || order.status === "revision_requested") && (
          <Card className="relative overflow-hidden">
            <div className="blob -right-20 -top-20 h-64 w-64 bg-lime/40" />
            <p className="relative text-[13px] font-medium text-muted">In progress</p>
            <h2 className="relative mt-3 text-[26px] font-medium tracking-tightest md:text-[32px]">
              {order.status === "in_progress" ? "Our designers are working on your concepts." : "Your revision is in progress."}
            </h2>
            <p className="relative mt-3 text-[16px] text-muted">
              {order.status === "in_progress" ? `Expected by ${firstConceptsDate(new Date(order.created_at))}. ` : ""}We’ll email you as soon as they’re ready.
            </p>
          </Card>
        )}

        {/* CONCEPTS */}
        {concepts.length > 0 && (
          <Card>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-[26px] font-medium tracking-tightest md:text-[32px]">Your concepts</h2>
              <p className="text-[14px] text-muted">Previews are watermarked. Clean files come with your final delivery.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {concepts.map((f, i) => (
                <figure key={f.id} className="overflow-hidden rounded-[22px] border border-line bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/files/${f.id}/preview`} alt={`Concept ${i + 1}`} draggable={false} className="pointer-events-none aspect-[4/3] w-full select-none object-contain" />
                  <figcaption className="px-4 py-3 text-[14px] font-medium">Concept {i + 1}</figcaption>
                </figure>
              ))}
            </div>
          </Card>
        )}

        {/* REVIEW */}
        {order.status === "concepts_ready" && (
          <Card>
            <h2 id="review" className="scroll-mt-24 text-[26px] font-medium tracking-tightest md:text-[32px]">
              How do you feel about it?
            </h2>
            <p className="mt-2 text-[16px] text-muted">
              Rate from 1 to 10. A score of {site.approvalScore} or more approves the concept and we prepare your final files.{" "}
              {left === null ? "Your package includes unlimited revisions." : `Revisions left: ${left}.`}
            </p>
            {searchParams.error === "feedback" && <div className="mt-4"><Notice>Tell us what to change so your designer can improve it.</Notice></div>}
            {searchParams.error === "limit" && (
              <div className="mt-4">
                <Notice>You’ve used all the revisions included in your package. Contact us at {site.contactEmail} and we’ll find a solution together.</Notice>
              </div>
            )}
            <form action={submitRevision} className="mt-8 space-y-6">
              <input type="hidden" name="order_id" value={order.id} />
              <fieldset>
                <legend className="text-[15px] font-medium">Your score</legend>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <label key={n} className="cursor-pointer">
                      <input type="radio" name="rating" value={n} required className="peer sr-only" />
                      <span className="flex h-12 items-center justify-center rounded-2xl border border-line bg-white text-[16px] font-medium transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white">
                        {n}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {concepts.length > 1 && (
                <Field label="Which concept do you prefer?">
                  <select name="preferred" className={inputClass} defaultValue="">
                    <option value="">No preference yet</option>
                    {concepts.map((c, i) => (
                      <option key={c.id}>Concept {i + 1}</option>
                    ))}
                  </select>
                </Field>
              )}
              <Field label="What should we change?" hint={`Required if your score is under ${site.approvalScore}. Send all your changes at once: one message = one revision.`}>
                <textarea name="feedback" rows={5} className={inputClass} />
              </Field>
              <SubmitButton>Send my feedback</SubmitButton>
            </form>
          </Card>
        )}

        {order.status === "approved" && (
          <Card>
            <h2 className="text-[26px] font-medium tracking-tightest md:text-[32px]">Approved. Your final files are being prepared.</h2>
            <p className="mt-3 text-[16px] text-muted">You’ll receive an email within 24 hours when they’re ready to download.</p>
          </Card>
        )}

        {/* FINAL FILES */}
        {order.status === "delivered" && finals.length > 0 && (
          <Card>
            <h2 id="final" className="scroll-mt-24 text-[26px] font-medium tracking-tightest md:text-[32px]">
              Your final files
            </h2>
            <p className="mt-2 text-[16px] text-muted">Preview them below. Download the originals when you’re ready.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {finals.map((f) => (
                <figure key={f.id} className="overflow-hidden rounded-[22px] border border-line bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/files/${f.id}/preview`} alt={f.file_name} draggable={false} className="pointer-events-none aspect-[4/3] w-full select-none object-contain" />
                  <figcaption className="px-4 py-3 text-[14px]">{f.file_name}</figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 rounded-[22px] border border-line bg-paper p-5 md:p-6">
              {searchParams.error === "ack" && <p className="mb-4 text-[14px] text-red-600">Please tick the box to download your files.</p>}
              {finals.map((f) => (
                <form key={f.id} action={`/api/files/${f.id}/download`} method="post" className="flex flex-col gap-4 border-b border-line py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-3">
                    <p className="text-[15px] font-medium">{f.file_name}</p>
                    {!order.refund_locked && (
                      <label className="flex items-start gap-3 text-[14px] text-ink/80">
                        <input type="checkbox" name="ack" required className="mt-0.5 h-4 w-4 accent-ink" />
                        <span>I understand that downloading my final files ends my eligibility for a refund.</span>
                      </label>
                    )}
                    {order.refund_locked && <input type="hidden" name="ack" value="on" />}
                  </div>
                  <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-white shadow-pill transition hover:bg-black">
                    Download
                  </button>
                </form>
              ))}
            </div>
          </Card>
        )}

        {/* SUMMARY */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <p className="text-[13px] font-medium text-muted">Your guarantee</p>
            <p className="mt-3 flex items-start gap-2.5 text-[15px]">
              <Shield className="mt-0.5 h-5 w-5 shrink-0" />
              {order.refund_locked
                ? "Your final files were downloaded: this order is complete and no longer refundable."
                : "Covered by our money-back guarantee until you download your final files. See our refund policy."}
            </p>
          </Card>
          {order.brief && (
            <Card>
              <p className="text-[13px] font-medium text-muted">Your brief</p>
              <ul className="mt-3 space-y-1.5 text-[15px]">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-leaf" /> {order.brief.company}
                </li>
                <li className="text-muted">{order.brief.style}</li>
              </ul>
              {revisions.length > 0 && <p className="mt-3 text-[14px] text-muted">{revisions.length} feedback round(s) sent.</p>}
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
}
