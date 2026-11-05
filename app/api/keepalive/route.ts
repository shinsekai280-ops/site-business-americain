import { NextResponse } from "next/server";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Called once a day by Vercel (see vercel.json).
 * A tiny database read keeps the free Supabase project active (free projects pause after 7 days without activity).
 */
export async function GET() {
  if (!hasSupabase()) return NextResponse.json({ ok: false, reason: "supabase not configured" });
  const { error } = await supabaseAdmin().from("orders").select("id", { head: true, count: "exact" });
  return NextResponse.json({ ok: !error, at: new Date().toISOString() });
}
