import { site, formatUsd } from "@/config/site";
import { DarkButton, LightButton, Check } from "@/components/ui";
import { Lumen, Verra, Oriel, Northline } from "@/components/showcase/logos";

const fromPrice = formatUsd(Math.min(...site.packages.map((p) => p.priceUsd)));

export function Hero() {
  const proof = [
    site.stats.customers ? `${site.stats.customers} customers` : "Fixed, transparent prices",
    "Money-back guarantee",
    "100% ownership of your files",
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="blob left-[-10%] top-[-10%] h-[520px] w-[520px] bg-lemon/50" />
      <div className="blob right-[-8%] top-[5%] h-[620px] w-[620px] bg-lime/50" />
      <div className="blob right-[25%] top-[35%] h-[380px] w-[380px] bg-leaf/25" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-10 pt-14 md:px-10 md:pt-20">
        {site.stats.rating && site.stats.reviewCount ? (
          <div className="inline-flex items-center gap-3 rounded-full border border-white bg-white/80 px-4 py-2 shadow-card backdrop-blur">
            <span className="text-[15px] tracking-[0.15em]">★★★★★</span>
            <span className="text-[15px]">
              <strong>{site.stats.rating}</strong> <span className="text-muted">from {site.stats.reviewCount} reviews</span>
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white bg-white/80 px-4 py-2 text-[14px] font-medium shadow-card backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-leaf shadow-[0_0_8px_#1FA85B]" />
            Logo &amp; brand identity studio
          </div>
        )}

        <h1 className="mt-8 max-w-[1200px] text-[54px] font-medium leading-[0.98] tracking-tightest text-ink sm:text-[76px] lg:text-[112px]">
          Look like a <span className="text-gradient">market leader</span>, from day one.
        </h1>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[640px] text-[19px] leading-relaxed text-ink/75 md:text-[22px]">
            Professional logo design and a complete brand identity, crafted by experienced designers. First concepts in 48 hours, from {fromPrice}.
          </p>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <div className="flex flex-wrap gap-3">
              <DarkButton href="#pricing" size="lg">
                See packages &amp; pricing
              </DarkButton>
              <LightButton href="#work" size="lg">
                See our work
              </LightButton>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink/70">
              {proof.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-leaf" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Showcase />
      </div>
    </section>
  );
}

/** The 4 big image cards under the hero. Replace with your real photos in /public/showcase. */
function Showcase() {
  return (
    <div className="mt-14 rounded-[36px] border border-white/80 bg-white/50 p-3 shadow-float backdrop-blur md:p-4">
      <div className="grid grid-cols-2 gap-3 md:h-[440px] md:grid-cols-[1fr_2fr_1fr_1fr] md:gap-4">
        <div className="relative h-[260px] overflow-hidden rounded-[26px] bg-gradient-brand md:h-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.55),transparent_55%)]" />
          <div className="absolute bottom-8 left-6 text-[22px]">
            <Lumen color="#0B3B2E" />
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-float">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-ink">
              <Check className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[14px] font-medium">First concepts delivered</span>
              <span className="block text-[13px] font-medium text-muted">within 48 hours</span>
            </span>
          </div>
        </div>
        <div className="relative col-span-2 h-[260px] overflow-hidden rounded-[26px] bg-[#EFE7DA] md:col-span-1 md:h-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.7),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center text-[64px] md:text-[96px]">
            <Verra />
          </div>
          <p className="absolute bottom-5 left-6 text-[13px] font-medium text-[#2B2118]/50">Verra · Skincare</p>
        </div>
        <div className="relative h-[260px] overflow-hidden rounded-[26px] bg-[#16352B] md:h-auto">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(155,226,60,0.25),transparent_60%)]" />
          <div className="absolute inset-0 flex items-center justify-center text-[26px]">
            <Oriel color="#EAF2E3" />
          </div>
        </div>
        <div className="relative h-[260px] overflow-hidden rounded-[26px] bg-[#0E1116] md:h-auto">
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(242,217,11,0.18),transparent_45%)]" />
          <div className="absolute left-6 top-8 text-[22px]">
            <Northline />
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-float">
            <p className="text-[14px] font-medium">Brand guidelines included</p>
            <p className="mt-1 text-[13px] text-muted">Colors, typography and usage rules, ready for your team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
