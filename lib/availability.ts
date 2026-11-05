import { site } from "@/config/site";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";

const TZ = "America/New_York";

/** "Saturday, Nov 7" — today + deliveryDays, in US Eastern time. */
export function firstConceptsDate(now = new Date()) {
  const d = new Date(now.getTime() + site.deliveryDays * 24 * 60 * 60 * 1000);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long", timeZone: TZ });
  const md = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });
  return `${weekday}, ${md}`;
}

/** Spots left today = daily capacity − paid orders created today. null = hidden. */
export async function spotsLeftToday(): Promise<number | null> {
  if (!site.dailyCapacity || site.dailyCapacity <= 0) return null;
  if (!hasSupabase()) return site.dailyCapacity;
  try {
    const now = new Date();
    const dayStr = now.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
    // start of the day in New York, expressed in UTC (approximation good enough for a counter)
    const offset = new Date(now.toLocaleString("en-US", { timeZone: TZ })).getTime() - now.getTime();
    const start = new Date(new Date(`${dayStr}T00:00:00Z`).getTime() - offset);
    const { count } = await supabaseAdmin()
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", start.toISOString());
    return Math.max(0, site.dailyCapacity - (count || 0));
  } catch {
    return site.dailyCapacity;
  }
}
