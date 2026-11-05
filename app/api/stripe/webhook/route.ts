import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/server";
import { handlePaidSession } from "@/lib/onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stripe calls this URL after each payment. */
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch (e) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    await handlePaidSession(event.data.object as Stripe.Checkout.Session);
  }
  return NextResponse.json({ received: true });
}
