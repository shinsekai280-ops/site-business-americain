import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { site, getPackage, formatUsd } from "@/config/site";
import { Shell, SubmitButton, Notice } from "@/components/Shell";
import { Check, Shield } from "@/components/ui";
import { stripe, siteUrl } from "@/lib/server";

export const metadata = { title: `Choose your options | ${site.brandName}`, robots: { index: false } };

async function checkout(formData: FormData) {
  "use server";
  const pkg = getPackage(String(formData.get("pkg")));
  const email = cookies().get("bs_email")?.value;
  if (!pkg) redirect("/#pricing");
  if (!email) redirect(`/start?pkg=${pkg.id}`);
  const upsell = formData.get("choice") === "upsell" && pkg.upsell.enabled;
  const price = upsell ? pkg.upsell.priceUsd : pkg.priceUsd;
  const name = upsell ? `${pkg.name} + ${pkg.upsell.name}` : pkg.name;

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: price * 100,
          product_data: { name: `${site.brandName} — ${name}`, description: pkg.tagline },
        },
      },
    ],
    allow_promotion_codes: true,
    metadata: { package_id: pkg.id, upsell: String(upsell) },
    success_url: `${siteUrl()}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/start/options?pkg=${pkg.id}`,
  });
  redirect(session.url!);
}

export default function Options({ searchParams }: { searchParams: { pkg?: string } }) {
  const pkg = getPackage(searchParams.pkg || "premium") || site.packages[1];
  const email = cookies().get("bs_email")?.value;
  if (!email) redirect(`/start?pkg=${pkg.id}`);
  const ready = Boolean(process.env.STRIPE_SECRET_KEY);
  const extra = pkg.upsell.priceUsd - pkg.priceUsd;

  return (
    <Shell right={<span className="text-muted">Step 2 of 3</span>}>
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-[38px] font-medium leading-[1.02] tracking-tightest md:text-[56px]">Choose your options.</h1>
        <p className="mt-4 text-[17px] text-muted">
          Concepts will be sent to <strong className="text-ink">{email}</strong>.{" "}
          <Link href={`/start?pkg=${pkg.id}`} className="underline underline-offset-2">
            Change
          </Link>
        </p>

        <form action={checkout} className="mt-10 space-y-4">
          <input type="hidden" name="pkg" value={pkg.id} />

          <label className="block cursor-pointer rounded-[26px] border border-line bg-white p-6 shadow-card transition has-[:checked]:border-ink has-[:checked]:ring-2 has-[:checked]:ring-ink md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <input type="radio" name="choice" value="base" defaultChecked className="mt-1.5 h-5 w-5 accent-ink" />
                <div>
                  <p className="text-[20px] font-medium tracking-[-0.02em]">{pkg.name}</p>
                  <p className="mt-1 text-[15px] text-muted">
                    {pkg.concepts} · {pkg.revisions} · {pkg.delivery}
                  </p>
                </div>
              </div>
              <p className="text-[24px] font-medium tracking-tightest">{formatUsd(pkg.priceUsd)}</p>
            </div>
          </label>

          {pkg.upsell.enabled && (
            <label className="relative block cursor-pointer overflow-hidden rounded-[26px] bg-ink p-6 text-white shadow-float transition has-[:checked]:ring-4 has-[:checked]:ring-lime/60 md:p-8">
              <div className="blob -right-16 -top-16 h-56 w-56 bg-lime/40" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <input type="radio" name="choice" value="upsell" className="mt-1.5 h-5 w-5 accent-lime" />
                  <div>
                    <span className="inline-block rounded-full bg-gradient-brand px-2.5 py-0.5 text-[13px] font-medium text-ink">
                      Recommended upgrade
                    </span>
                    <p className="mt-2 text-[20px] font-medium tracking-[-0.02em]">
                      {pkg.name} + {pkg.upsell.name}
                    </p>
                    <p className="mt-1 text-[15px] text-white/70">{pkg.upsell.pitch}</p>
                    <ul className="mt-4 space-y-2">
                      {pkg.upsell.includes.map((i) => (
                        <li key={i} className="flex gap-2.5 text-[15px]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-medium tracking-tightest">{formatUsd(pkg.upsell.priceUsd)}</p>
                  <p className="text-[13px] text-white/60">+{formatUsd(extra)}</p>
                </div>
              </div>
            </label>
          )}

          {!ready && <Notice>Payments are not connected yet. Add your Stripe keys to enable checkout (see GUIDE.md).</Notice>}

          <div className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[14px] text-muted">
              <Shield className="h-4 w-4" /> Secure payment by Stripe · 100% money-back guarantee
            </p>
            <SubmitButton>Continue to secure checkout</SubmitButton>
          </div>
          <p className="text-[13px] text-muted">
            One-time payment in USD. By paying, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="underline underline-offset-2">
              refund policy
            </Link>
            .
          </p>
        </form>
      </div>
    </Shell>
  );
}
