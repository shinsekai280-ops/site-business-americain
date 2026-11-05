import Link from "next/link";
import { site, formatUsd } from "@/config/site";
import { Check, DarkButton, Eyebrow, SectionTitle, Shield, BrandLogo } from "@/components/ui";

const fromPrice = formatUsd(Math.min(...site.packages.map((p) => p.priceUsd)));

/* ---------------- Industries ---------------- */
export function Industries() {
  const list = ["AI startups", "SaaS", "E-commerce", "Beauty", "Health & wellness", "Real estate", "Consulting", "Hospitality", "Food & drink", "Finance"];
  return (
    <section className="border-y border-line bg-white/60 py-6">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max gap-3">
          {[...list, ...list].map((l, i) => (
            <span key={i} className="whitespace-nowrap rounded-full border border-line bg-white px-5 py-2 text-[14px] text-ink/70">
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Compare ---------------- */
export function Compare() {
  const cols = [
    {
      name: "Marketplace freelancer",
      price: "$50",
      rows: ["A few days, if they reply", "Unknown designer, unknown quality", "Often a reworked template", "Every change costs extra", "Frequently redone a year later"],
    },
    {
      name: site.brandName,
      price: `From ${fromPrice}`,
      best: true,
      rows: ["First concepts in 48 hours", "Experienced designers + a project manager", "A complete, original brand identity", "Revisions included", "Money-back guarantee"],
    },
    {
      name: "Traditional agency",
      price: "$5,000+",
      rows: ["1 to 2 months", "Endless calls and meetings", "Premium pricing", "Revisions billed by the hour", "Great work, if you can afford it"],
    },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Eyebrow>Why {site.brandName}</Eyebrow>
      <div className="mt-4">
        <SectionTitle>
          Three ways to get a brand. <span className="text-ink/40">One clear choice.</span>
        </SectionTitle>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {cols.map((c) => (
          <div
            key={c.name}
            className={`relative rounded-[30px] p-8 ${
              c.best ? "bg-ink text-white shadow-float lg:-my-4 lg:py-12" : "border border-line bg-white shadow-card"
            }`}
          >
            {c.best && (
              <>
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="blob -right-20 -top-20 h-64 w-64 bg-lime/40" />
                </div>
                <span className="relative mb-5 inline-block rounded-full bg-gradient-brand px-3 py-1 text-[13px] font-medium text-ink">
                  Best value
                </span>
              </>
            )}
            <p className={`relative text-[15px] ${c.best ? "text-white/70" : "text-muted"}`}>{c.name}</p>
            <p className="relative mt-2 text-[44px] font-medium tracking-tightest">{c.price}</p>
            <ul className="relative mt-6 space-y-3.5">
              {c.rows.map((r) => (
                <li key={r} className={`flex gap-3 text-[15px] ${c.best ? "text-white" : "text-ink/60"}`}>
                  {c.best ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-lime" /> : <span className="mt-[9px] h-1 w-3 shrink-0 rounded bg-ink/20" />}
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-[15px] text-muted">
        Same deliverables as an agency. A fraction of the time and the price.
      </p>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
export function Pricing({ spots }: { spots: number | null }) {
  return (
    <section id="pricing" className="relative mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
      <div className="blob left-1/3 top-40 h-[420px] w-[420px] bg-lime/30" />
      <div className="relative text-center">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-4xl text-[40px] font-medium leading-[1.05] tracking-tightest md:text-[64px]">
          World-class branding. <span className="text-gradient">10x less</span> than an agency.
        </h2>
        <p className="mt-5 text-[18px] text-muted">Fixed prices. Paid once. No subscription.</p>
      </div>

      <div className="relative mt-16 grid items-stretch gap-5 lg:grid-cols-3">
        {site.packages.map((p) => {
          const dark = p.id !== "basic";
          const featured = p.highlighted;
          return (
            <div
              key={p.id}
              className={`relative flex flex-col overflow-hidden rounded-[32px] p-8 md:p-10 ${
                featured
                  ? "bg-ink text-white shadow-float ring-1 ring-lime/40"
                  : dark
                  ? "bg-[#111317] text-white shadow-card"
                  : "border border-line bg-white shadow-card"
              }`}
            >
              {featured && (
                <div className="pointer-events-none absolute inset-0">
                  <div className="blob -right-24 -top-24 h-80 w-80 bg-lemon/45" />
                  <div className="blob -bottom-24 -left-16 h-72 w-72 bg-leaf/40" />
                </div>
              )}
              <div className="relative flex items-center justify-between">
                <p className="text-[22px] font-medium tracking-[-0.02em]">{p.name}</p>
                {p.badge && <span className="rounded-full bg-gradient-brand px-3 py-1 text-[13px] font-medium text-ink">{p.badge}</span>}
              </div>
              <p className="relative mt-8 flex items-start text-[72px] font-medium leading-none tracking-tightest">
                <span className="mr-1 mt-2 text-[28px]">$</span>
                {p.priceUsd.toLocaleString("en-US")}
              </p>
              <p className={`relative mt-5 min-h-[56px] text-[16px] leading-relaxed ${dark ? "text-white/70" : "text-muted"}`}>{p.tagline}</p>

              <Link
                href={`/start?pkg=${p.id}`}
                className={`group relative mt-8 flex items-center justify-center gap-3 rounded-full py-2.5 pl-6 pr-2.5 text-[16px] font-medium transition ${
                  dark ? "bg-white text-ink hover:bg-white/90" : "border border-line bg-white text-ink hover:border-ink/30"
                }`}
              >
                Order now
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition group-hover:translate-x-0.5">→</span>
              </Link>
              <div className={`relative mt-4 space-y-1 text-center text-[13px] ${dark ? "text-white/60" : "text-muted"}`}>
                {featured && spots !== null && spots > 0 && (
                  <p className="flex items-center justify-center gap-2 text-white">
                    <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#9BE23C]" />
                    Only {spots} spots left today
                  </p>
                )}
                <p className="flex items-center justify-center gap-1.5">
                  <Shield className="h-4 w-4" /> 100% money-back guarantee
                </p>
              </div>

              <p className={`relative mt-8 text-[13px] font-medium ${dark ? "text-white/50" : "text-muted"}`}>
                {p.id === "basic" ? "Included" : p.id === "premium" ? "Everything in Basic, plus" : "Everything in Premium, plus"}
              </p>
              <ul className="relative mt-4 space-y-3">
                {p.includes.map((i) => (
                  <li key={i} className="flex gap-3 text-[15px]">
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${dark ? "text-lime" : "text-ink"}`} />
                    {i}
                  </li>
                ))}
                {p.excludes.map((i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-ink/30">
                    <Check className="mt-0.5 h-5 w-5 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="relative mt-8 text-center text-[14px] text-muted">Prices in US dollars, paid once. Secure checkout by Stripe.</p>
    </section>
  );
}

/* ---------------- Guarantee ---------------- */
export function Guarantee() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 md:px-10">
      <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-16 text-white md:px-16 md:py-20">
        <div className="blob -right-32 -top-32 h-[420px] w-[420px] bg-lime/35" />
        <div className="blob -bottom-40 left-10 h-[360px] w-[360px] bg-lemon/25" />
        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand text-ink">
              <Shield className="h-7 w-7" />
            </span>
            <h2 className="mt-8 text-[40px] font-medium leading-[1.05] tracking-tightest md:text-[58px]">
              Not in love with your concepts? <span className="text-white/45">That’s our risk, not yours.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-white/70">
              If the first concepts don’t feel right, we keep working: new directions, a different designer, more revisions. And if you’re still not happy, you get your money back.
            </p>
            <Link href="/refund-policy" className="mt-6 inline-block text-[15px] underline decoration-white/30 underline-offset-4 hover:decoration-white">
              Read our refund policy
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-medium text-white/50">Secure payment</p>
            <div className="flex flex-wrap gap-2">
              {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"].map((m) => (
                <span key={m} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-[13px] text-white/80">
                  {m}
                </span>
              ))}
            </div>
            <p className="text-[14px] text-white/55">Encrypted checkout, processed by Stripe.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Promises ---------------- */
export function Promises() {
  const items = [
    ["Experienced designers only", "Every brand is designed by a vetted, experienced designer."],
    ["Revisions included", "Refine your concept until it feels right."],
    ["Money-back guarantee", "If it doesn’t work out, you’re covered."],
    ["Quality-checked", "Every concept is reviewed before it reaches you."],
    ["Original work", "Designed from scratch for your business. Never a template."],
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
      <Eyebrow>Our promises</Eyebrow>
      <div className="mt-4">
        <SectionTitle>Five promises behind every brand.</SectionTitle>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(([t, d], i) => (
          <div key={t} className="rounded-[26px] border border-line bg-white p-7 shadow-card">
            <span className="text-[13px] font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-10 text-[19px] font-medium leading-tight tracking-[-0.02em]">{t}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
export function Process() {
  const steps = [
    ["Tell us about your business", "Fill in a guided brief in 5 minutes: your business, your audience, the brands you love. No call needed."],
    ["Get your first concepts", "We study your market and your competitors, then deliver your first concepts within 48 hours."],
    ["Refine, approve, launch", "Request changes until it’s right. Once approved, your final files are ready in your account."],
  ];
  return (
    <section id="how" className="scroll-mt-24 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Eyebrow>How it works</Eyebrow>
        <div className="mt-4">
          <SectionTitle>A remarkably simple process.</SectionTitle>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {steps.map(([t, d], i) => (
            <div key={t} className="relative overflow-hidden rounded-[30px] border border-line bg-paper p-8 md:p-10">
              {i === 1 && <div className="blob -right-20 -top-20 h-56 w-56 bg-lime/40" />}
              <p className="relative text-[64px] font-medium leading-none tracking-tightest text-ink/15">{i + 1}</p>
              <p className="relative mt-10 text-[24px] font-medium tracking-[-0.03em]">{t}</p>
              <p className="relative mt-3 text-[16px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <DarkButton href="#pricing">Start my brand</DarkButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reviews (hidden until you add real reviews in config/site.ts) ---------------- */
export function Reviews() {
  if (!site.reviews.length) return null;
  return (
    <section id="reviews" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
      <Eyebrow>Reviews</Eyebrow>
      <div className="mt-4">
        <SectionTitle>What founders say.</SectionTitle>
      </div>
      <div className="mt-14 columns-1 gap-4 md:columns-2 lg:columns-3">
        {site.reviews.map((r) => (
          <figure key={r.name + r.date} className="mb-4 break-inside-avoid rounded-[26px] border border-line bg-white p-7 shadow-card">
            <p className="tracking-[0.15em]">★★★★★</p>
            <blockquote className="mt-4 text-[16px] leading-relaxed">“{r.text}”</blockquote>
            <figcaption className="mt-5 text-[14px] text-muted">
              <strong className="text-ink">{r.name}</strong> · {r.country} · {r.date}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const qa: [string, string][] = [
    [`Is ${site.brandName} a real company?`, `Yes. ${site.legalName} is a registered business. Payments are processed securely by Stripe, and every order is covered by our money-back guarantee.`],
    ["How can you deliver in 48 hours?", "48 hours is the delay for your first concepts, after we study your market and competitors. Our process is streamlined: no meetings, no back-and-forth emails, just focused design work. The Brand Ecosystem is delivered in 5 business days."],
    ["Do I need to book a call?", "No. You fill in a guided brief online in about 5 minutes. Everything happens in your client space."],
    ["What if I don’t like my logo?", "You request revisions until it feels right. If it still isn’t right, we can assign a different designer. And if you’re still not satisfied, our refund policy has you covered."],
    ["Who designs my brand?", "A vetted, experienced designer from our partner team, supported by a project manager who checks every concept before it reaches you."],
    ["Will I own my logo?", "Yes. Once your order is complete, you own 100% of your brand, with full rights and editable source files."],
    ["Why is it so much cheaper than an agency?", "No pitches, no account managers, no expensive offices. A lean, efficient process lets us offer agency-level quality at a fixed, fair price."],
    ["Can I pay in installments?", "No. Each package is a one-time payment in US dollars. No subscription."],
    ["Which file formats will I receive?", "SVG, PNG, PDF and EPS, in color, black and white versions, with transparent backgrounds. Everything you need for print and web."],
    ["Can I get a brand for an existing business?", "Absolutely. Many of our clients come for a rebrand. Just mention it in your brief."],
  ];
  return (
    <section id="faq" className="mx-auto max-w-[1100px] scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
      <Eyebrow>FAQ</Eyebrow>
      <div className="mt-4">
        <SectionTitle>Questions, answered.</SectionTitle>
      </div>
      <div className="mt-12 divide-y divide-line rounded-[30px] border border-line bg-white shadow-card">
        {qa.map(([q, a]) => (
          <details key={q} className="group px-7 py-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[18px] font-medium tracking-[-0.01em]">
              {q}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-[18px] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Final call to action ---------------- */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-5 py-16 text-center md:py-24">
      <div className="blob left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-lime/35" />
      <div className="relative mx-auto max-w-4xl">
        <h2 className="text-[48px] font-medium leading-[1] tracking-tightest md:text-[88px]">
          Your brand, <span className="text-gradient">48 hours</span> from now.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[18px] text-muted">Fill in your brief today and see your first concepts in two days. From {fromPrice}, money-back guarantee.</p>
        <div className="mt-10 flex justify-center">
          <DarkButton href="#pricing" size="lg">
            Start my brand
          </DarkButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-white pb-28 pt-16">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-10">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-xs text-[15px] text-muted">Professional logo design and brand identity for ambitious businesses.</p>
        </div>
        <FooterCol
          title="Explore"
          links={[
            ["Our work", "/#work"],
            ["Pricing", "/#pricing"],
            ["How it works", "/#how"],
            ["FAQ", "/#faq"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ...(site.bookCallUrl ? ([["Book a call", site.bookCallUrl]] as [string, string][]) : []),
            ["Contact", `mailto:${site.contactEmail}`],
            ["Client login", "/login"],
          ]}
        />
        <FooterCol
          title="Legal"
          links={[
            ["Terms of service", "/terms"],
            ["Privacy policy", "/privacy"],
            ["Refund policy", "/refund-policy"],
          ]}
        />
      </div>
      <div className="mx-auto mt-14 flex max-w-[1400px] flex-col justify-between gap-2 border-t border-line px-5 pt-6 text-[13px] text-muted md:flex-row md:px-10">
        <p>
          © {year} {site.legalName}. All rights reserved.
        </p>
        <p>{site.legalAddress}</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[13px] font-medium text-muted">{title}</p>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map(([l, h]) => (
          <li key={l}>
            <a href={h} className="text-ink/75 transition hover:text-ink">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
