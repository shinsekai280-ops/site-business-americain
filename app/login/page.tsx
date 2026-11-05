import { redirect } from "next/navigation";
import { site } from "@/config/site";
import { Shell, Card, Field, inputClass, SubmitButton, Notice } from "@/components/Shell";
import { hasSupabase, supabaseAdmin, isAdminEmail } from "@/lib/supabase";
import { loginLink, sendEmail } from "@/lib/server";

export const metadata = { title: `Client login | ${site.brandName}`, robots: { index: false } };

async function sendLink(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const next = String(formData.get("next") || "/account");
  if (!email.includes("@")) redirect("/login?error=email");
  if (hasSupabase()) {
    const { count } = await supabaseAdmin().from("orders").select("id", { count: "exact", head: true }).eq("email", email);
    if ((count || 0) > 0 || isAdminEmail(email)) {
      const url = await loginLink(email, isAdminEmail(email) && next === "/account" ? "/admin" : next);
      await sendEmail(email, `Your ${site.brandName} login link`, "Your login link", "Click the button below to access your account. This link is valid for 1 hour and can be used once.", {
        label: "Log in",
        url,
      });
    }
  }
  redirect("/login?sent=1");
}

export default function Login({ searchParams }: { searchParams: { sent?: string; error?: string; next?: string } }) {
  return (
    <Shell>
      <div className="mx-auto max-w-[520px]">
        <h1 className="text-[36px] font-medium leading-[1.05] tracking-tightest md:text-[48px]">Access your brand.</h1>
        <p className="mt-3 text-[17px] text-muted">We’ll email you a secure one-click login link. No password needed.</p>
        <Card className="mt-8">
          {searchParams.sent ? (
            <Notice>If an order exists for this email, a login link is on its way. Check your inbox (and your spam folder).</Notice>
          ) : (
            <form action={sendLink} className="space-y-6">
              {searchParams.error === "expired" && <Notice>This link has expired or was already used. Request a new one below.</Notice>}
              <input type="hidden" name="next" value={searchParams.next || "/account"} />
              <Field label="Email">
                <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={inputClass} />
              </Field>
              <SubmitButton>Send my login link</SubmitButton>
            </form>
          )}
        </Card>
      </div>
    </Shell>
  );
}
