import "server-only";
import { notFound, redirect } from "next/navigation";
import { getUser, isAdminEmail, supabaseAdmin } from "@/lib/supabase";
import type { Order } from "@/lib/server";

export type FileRow = { id: string; order_id: string; kind: "concept" | "final"; storage_path: string; file_name: string; mime: string | null; created_at: string };
export type RevisionRow = { id: string; order_id: string; rating: number; feedback: string | null; created_at: string };

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) redirect("/account");
  return user;
}

/** Loads an order the current visitor is allowed to see (owner or admin). */
export async function loadOrder(id: string) {
  const user = await requireUser();
  const db = supabaseAdmin();
  const { data: order } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) notFound();
  const admin = isAdminEmail(user.email);
  if (!admin && order.user_id !== user.id) notFound();
  const [{ data: files }, { data: revisions }] = await Promise.all([
    db.from("files").select("*").eq("order_id", id).order("created_at", { ascending: true }),
    db.from("revisions").select("*").eq("order_id", id).order("created_at", { ascending: true }),
  ]);
  return { user, admin, order: order as Order, files: (files || []) as FileRow[], revisions: (revisions || []) as RevisionRow[] };
}

/** Same check, for API routes working on a single file. */
export async function loadFileForUser(fileId: string) {
  const user = await getUser();
  if (!user) return null;
  const db = supabaseAdmin();
  const { data: file } = await db.from("files").select("*").eq("id", fileId).maybeSingle();
  if (!file) return null;
  const { data: order } = await db.from("orders").select("*").eq("id", file.order_id).single();
  const admin = isAdminEmail(user.email);
  if (!admin && order?.user_id !== user.id) return null;
  return { user, admin, file: file as FileRow, order: order as Order };
}
