"use server";

import { revalidatePath } from "next/cache";
import { site } from "@/config/site";
import { requireAdmin } from "@/lib/access";
import { STORAGE_BUCKET, supabaseAdmin } from "@/lib/supabase";
import { loginLink, orderRef, sendEmail, type OrderStatus } from "@/lib/server";

type Kind = "concept" | "final";

/** Step 1 of an upload: get one secure upload slot per file (the browser uploads directly to storage). */
export async function createUploadUrls(orderId: string, kind: Kind, files: { name: string }[]) {
  await requireAdmin();
  const db = supabaseAdmin();
  return Promise.all(
    files.map(async (f) => {
      const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
      const path = `${orderId}/${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safe}`;
      const { data, error } = await db.storage.from(STORAGE_BUCKET).createSignedUploadUrl(path);
      if (error || !data) throw new Error("Upload slot failed: " + error?.message);
      return { path, token: data.token };
    })
  );
}

/** Step 2: record the uploaded files, update the order and notify the client. */
export async function registerFiles(orderId: string, kind: Kind, items: { path: string; name: string; mime: string }[], notify: boolean) {
  await requireAdmin();
  const db = supabaseAdmin();
  await db.from("files").insert(items.map((i) => ({ order_id: orderId, kind, storage_path: i.path, file_name: i.name, mime: i.mime })));
  const status: OrderStatus = kind === "concept" ? "concepts_ready" : "delivered";
  const { data: order } = await db.from("orders").update({ status }).eq("id", orderId).select("*").single();

  if (notify && order) {
    const link = await loginLink(order.email, `/account/orders/${orderId}`);
    if (kind === "concept") {
      await sendEmail(order.email, `Your concepts are ready (#${orderRef(orderId)})`, "Your concepts are ready.", `Your designer has finished. Log in to review your concepts and tell us what you think.`, {
        label: "Review my concepts",
        url: link,
      });
    } else {
      await sendEmail(order.email, `Your final files are ready (#${orderRef(orderId)})`, "Your brand is ready.", `Your final files are ready to download in your account. Thank you for trusting ${site.brandName}.`, {
        label: "Get my files",
        url: link,
      });
    }
  }
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function deleteFile(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("file_id"));
  const db = supabaseAdmin();
  const { data: file } = await db.from("files").select("*").eq("id", id).single();
  if (file) {
    await db.storage.from(STORAGE_BUCKET).remove([file.storage_path]);
    await db.from("files").delete().eq("id", id);
    revalidatePath(`/admin/orders/${file.order_id}`);
  }
}

export async function setStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("order_id"));
  const status = String(formData.get("status")) as OrderStatus;
  await supabaseAdmin().from("orders").update({ status }).eq("id", id);
  revalidatePath(`/admin/orders/${id}`);
}
