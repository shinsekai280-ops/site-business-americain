import { NextResponse } from "next/server";
import { loadFileForUser } from "@/lib/access";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase";
import { notifyAdmins, orderRef } from "@/lib/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Downloads an original final file.
 * The client must tick the box: downloading ends the refund eligibility (date is recorded as proof).
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const ctx = await loadFileForUser(params.id);
  const origin = new URL(req.url).origin;
  if (!ctx) return NextResponse.redirect(`${origin}/account`, 303);
  const { file, order, admin } = ctx;

  if (!admin) {
    const form = await req.formData();
    if (form.get("ack") !== "on") return NextResponse.redirect(`${origin}/account/orders/${order.id}?error=ack#final`, 303);
    if (file.kind !== "final" || order.status !== "delivered") return NextResponse.redirect(`${origin}/account/orders/${order.id}`, 303);

    const db = supabaseAdmin();
    if (!order.refund_locked) {
      await db.from("orders").update({ refund_locked: true, downloaded_at: new Date().toISOString() }).eq("id", order.id);
      await notifyAdmins(`Final files downloaded #${orderRef(order.id)}`, `${order.email} downloaded the final files. This order is no longer refundable.`, order.id);
    }
    await db.from("downloads").insert({ order_id: order.id, file_id: file.id, user_id: ctx.user.id, ip: req.headers.get("x-forwarded-for") || null });
  }

  const { data, error } = await supabaseAdmin().storage.from(STORAGE_BUCKET).createSignedUrl(file.storage_path, 60, { download: file.file_name });
  if (error || !data) return NextResponse.redirect(`${origin}/account/orders/${order.id}?error=file`, 303);
  return NextResponse.redirect(data.signedUrl, 303);
}
