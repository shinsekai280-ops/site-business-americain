import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { site, getPackage } from "@/config/site";
import { Shell, Field, inputClass, SubmitButton } from "@/components/Shell";
import { PackageSummary } from "@/components/PackageSummary";
import { Shield } from "@/components/ui";
import { hasSupabase, supabaseAdmin } from "@/lib/supabase";

export const metadata = { title: `Start your brand | ${site.brandName}`, robots: { index: false } };

async function saveEmail(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const pkg = String(formData.get("pkg") || "premium");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect(`/start?pkg=${pkg}&error=email`);
  cookies().set("bs_email", email, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
  if (hasSupabase()) {
    await supabaseAdmin().from("leads").insert({ email, package_id: pkg });
  }
  redirect(`/start/options?pkg=${pkg}`);
}

export default function Start({ searchParams }: { searchParams: { pkg?: string; error?: string } }) {
  const pkg = getPackage(searchParams.pkg || "premium") || site.packages[1];
  const saved = cookies().get("bs_email")?.value || "";

  return (
    <Shell right={<span className="text-muted">Step 1 of 3</span>}>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <div>
          <h1 className="text-[38px] font-medium leading-[1.02] tracking-tightest md:text-[56px]">
            Where should we send your <span className="font-serif italic">concepts</span>?
          </h1>
          <p className="mt-4 text-[17px] text-muted">Nothing to pay on this step.</p>

          <form action={saveEmail} className="mt-10 space-y-6">
            <input type="hidden" name="pkg" value={pkg.id} />
            <Field label="Email">
              <input name="email" type="email" required autoComplete="email" defaultValue={saved} placeholder="you@company.com" className={inputClass} />
            </Field>
            {searchParams.error === "email" && <p className="text-[14px] text-red-600">Enter a valid email so we can send your concepts.</p>}
            <SubmitButton>See my options</SubmitButton>
          </form>

          <ul className="mt-10 space-y-3 text-[15px] text-ink/75">
            <li className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-leaf" /> Takes 5 minutes to complete
            </li>
            <li className="flex items-center gap-2.5">
              <Shield className="h-4 w-4" /> You own 100% of your brand: full rights and source files
            </li>
          </ul>
          <p className="mt-8 text-[13px] leading-relaxed text-muted">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms of service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <PackageSummary current={pkg} basePath="/start" />
      </div>
    </Shell>
  );
}
