import { redirect } from "next/navigation";
import { site } from "@/config/site";
import { Shell, Card, Notice } from "@/components/Shell";
import { stripe, loginLink } from "@/lib/server";
import { handlePaidSession } from "@/lib/onboarding";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: `Welcome | ${site.brandName}`, robots: { index: false } };
export const dynamic = "force-dynamic";

/** Stripe sends the client here after payment: we log them in and open their brief. */
export default async function Welcome({ searchParams }: { searchParams: { session_id?: string } }) {
  if (!searchParams.session_id) redirect("/");
  const session = await stripe().checkout.sessions.retrieve(searchParams.session_id);
  if (session.payment_status !== "paid") {
    return (
      <Shell>
        <Card>
          <h1 className="text-[32px] font-medium tracking-tightest">Payment pending</h1>
          <p className="mt-3 text-muted">We’re waiting for confirmation from your bank. You’ll receive an email as soon as it’s done.</p>
        </Card>
      </Shell>
    );
  }

  const order = await handlePaidSession(session);
  if (!order) redirect("/");

  // one-time automatic login right after payment
  if (!order.welcome_used) {
    await supabaseAdmin().from("orders").update({ welcome_used: true }).eq("id", order.id);
    redirect(await loginLink(order.email, `/account/orders/${order.id}`));
  }

  return (
    <Shell>
      <Card>
        <h1 className="text-[32px] font-medium tracking-tightest">Thank you, your order is confirmed.</h1>
        <div className="mt-6">
          <Notice>We sent a login link to {order.email}. Open it to fill in your brief.</Notice>
        </div>
      </Card>
    </Shell>
  );
}
