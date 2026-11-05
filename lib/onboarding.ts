import "server-only";
import type Stripe from "stripe";
import { site } from "@/config/site";
import { upsertOrderFromSession, loginLink, sendEmail, notifyAdmins, orderRef, packageLabel } from "@/lib/server";
import { firstConceptsDate } from "@/lib/availability";

/** Creates the order (once) and sends the confirmation emails. Used by the webhook and the welcome page. */
export async function handlePaidSession(session: Stripe.Checkout.Session) {
  const res = await upsertOrderFromSession(session);
  if (!res) return null;
  const { order, created } = res;
  if (created) {
    const link = await loginLink(order.email, `/account/orders/${order.id}`);
    await sendEmail(
      order.email,
      `Order confirmed — let’s build your brand (#${orderRef(order.id)})`,
      "Your order is confirmed.",
      `Thank you for choosing ${site.brandName}. Your package: <strong>${packageLabel(order)}</strong>.<br><br>
       Next step: fill in your brief (about 5 minutes). Once it’s in, your first concepts arrive by <strong>${firstConceptsDate()}</strong>.`,
      { label: "Fill in my brief", url: link }
    );
    await notifyAdmins(
      `New order #${orderRef(order.id)} — ${packageLabel(order)}`,
      `${order.email} paid $${(order.amount_cents / 100).toFixed(0)}. Waiting for the brief.`,
      order.id
    );
  }
  return order;
}
