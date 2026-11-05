import "server-only";
import { headers } from "next/headers";
import Stripe from "stripe";
import { Resend } from "resend";
import { site, getPackage } from "@/config/site";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";

/* ---------------- URLs ---------------- */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Address the visitor is on right now (used for the Stripe return pages, so they always come back to the same site). */
export function requestUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!host) return siteUrl();
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/* ---------------- Stripe ---------------- */
export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is missing");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

/* ---------------- Orders ---------------- */
export type OrderStatus =
  | "awaiting_brief"
  | "in_progress"
  | "concepts_ready"
  | "revision_requested"
  | "approved"
  | "delivered"
  | "refunded";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_brief: "Waiting for your brief",
  in_progress: "Designers at work",
  concepts_ready: "Concepts ready for review",
  revision_requested: "Revision in progress",
  approved: "Approved — preparing final files",
  delivered: "Final files ready",
  refunded: "Refunded",
};

export type Order = {
  id: string;
  user_id: string | null;
  email: string;
  package_id: string;
  upsell: boolean;
  amount_cents: number;
  stripe_session_id: string | null;
  status: OrderStatus;
  brief: Record<string, string> | null;
  revisions_used: number;
  refund_locked: boolean;
  downloaded_at: string | null;
  welcome_used: boolean;
  created_at: string;
};

export function orderRef(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export function revisionLimit(order: Pick<Order, "package_id" | "upsell">): number | null {
  const p = getPackage(order.package_id);
  if (!p) return 0;
  return order.upsell && p.upsell.enabled ? p.upsell.revisionLimit : p.revisionLimit;
}

export function packageLabel(order: Pick<Order, "package_id" | "upsell">) {
  const p = getPackage(order.package_id);
  if (!p) return order.package_id;
  return order.upsell && p.upsell.enabled ? `${p.name} + ${p.upsell.name}` : p.name;
}

/** Finds or creates the Supabase user for this email. Returns the user id. */
export async function ensureUser(email: string) {
  const db = supabaseAdmin();
  const created = await db.auth.admin.createUser({ email, email_confirm: true });
  if (created.data.user) return created.data.user.id;
  // already exists: find it through a magic link generation (returns the user)
  const link = await db.auth.admin.generateLink({ type: "magiclink", email });
  if (link.data.user) return link.data.user.id;
  throw new Error("Could not create or find user: " + (created.error?.message || link.error?.message));
}

/** One-click login link (valid 1 hour), sent by our own emails. */
export async function loginLink(email: string, next: string) {
  const { data, error } = await supabaseAdmin().auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data.properties?.hashed_token) throw new Error("Could not create login link: " + error?.message);
  const params = new URLSearchParams({ token_hash: data.properties.hashed_token, type: "magiclink", next });
  return `${siteUrl()}/auth/confirm?${params.toString()}`;
}

/** Creates the order from a paid Stripe Checkout session. Safe to call several times. */
export async function upsertOrderFromSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;
  const db = supabaseAdmin();
  const existing = await db.from("orders").select("*").eq("stripe_session_id", session.id).maybeSingle();
  if (existing.data) return { order: existing.data as Order, created: false };

  const email = (session.customer_details?.email || session.customer_email || "").toLowerCase();
  const userId = await ensureUser(email);
  const insert = await db
    .from("orders")
    .insert({
      user_id: userId,
      email,
      package_id: session.metadata?.package_id || "basic",
      upsell: session.metadata?.upsell === "true",
      amount_cents: session.amount_total || 0,
      currency: session.currency || "usd",
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
      status: "awaiting_brief",
    })
    .select("*")
    .single();

  if (insert.error) {
    // a parallel call (webhook vs. welcome page) may have inserted it first
    const again = await db.from("orders").select("*").eq("stripe_session_id", session.id).single();
    return { order: again.data as Order, created: false };
  }
  return { order: insert.data as Order, created: true };
}

/* ---------------- Emails ---------------- */
function emailLayout(title: string, body: string, cta?: { label: string; url: string }) {
  return `<!doctype html><html><body style="margin:0;background:#F7F7F5;font-family:Inter,Arial,sans-serif;color:#0B0B0F">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <p style="font-weight:700;font-size:20px;letter-spacing:-0.5px;margin:0 0 32px">${site.brandName.toLowerCase()}</p>
    <div style="background:#fff;border:1px solid #E7E7E3;border-radius:20px;padding:32px">
      <h1 style="font-size:24px;letter-spacing:-0.5px;margin:0 0 16px">${title}</h1>
      <div style="font-size:15px;line-height:1.6;color:#3a3d42">${body}</div>
      ${
        cta
          ? `<a href="${cta.url}" style="display:inline-block;margin-top:24px;background:#0B0B0F;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:600;font-size:15px">${cta.label}</a>`
          : ""
      }
    </div>
    <p style="font-size:12px;color:#8a8d92;margin-top:24px">${site.legalName} · ${site.contactEmail}</p>
  </div></body></html>`;
}

export async function sendEmail(to: string, subject: string, title: string, body: string, cta?: { label: string; url: string }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.log(`[email skipped: RESEND not configured] to=${to} subject=${subject}`);
    return;
  }
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: emailLayout(title, body, cta),
    });
  } catch (e) {
    console.error("[email error]", e);
  }
}

export async function notifyAdmins(subject: string, body: string, orderId?: string) {
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  const cta = orderId ? { label: "Open order", url: `${siteUrl()}/admin/orders/${orderId}` } : undefined;
  await Promise.all(admins.map((a) => sendEmail(a, subject, subject, body, cta)));
}

export function setupReady() {
  return hasSupabase() && Boolean(process.env.STRIPE_SECRET_KEY);
}
