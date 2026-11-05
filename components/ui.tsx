import Link from "next/link";
import { site } from "@/config/site";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Shield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M10 2.5 4 5v4.6c0 3.6 2.5 6.6 6 7.9 3.5-1.3 6-4.3 6-7.9V5l-6-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m7.3 10 1.9 1.9 3.6-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Black pill with a round arrow — main call to action */
export function DarkButton({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "pl-8 pr-2.5 py-2.5 text-[17px]" : "pl-6 pr-2 py-2 text-[15px]";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 rounded-full bg-ink ${pad} font-medium text-white shadow-pill transition hover:bg-black hover:shadow-float`}
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-x-0.5 group-hover:bg-white/25">
        <Arrow className="h-4 w-4" />
      </span>
    </Link>
  );
}

/** White pill with border — secondary call to action */
export function LightButton({ href, children, size = "md" }: { href: string; children: React.ReactNode; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "px-8 py-[18px] text-[17px]" : "px-6 py-3 text-[15px]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border border-line bg-white ${pad} font-medium text-ink shadow-[0_1px_2px_rgba(11,11,15,0.06)] transition hover:border-ink/20 hover:shadow-pill`}
    >
      {children}
    </Link>
  );
}

/** Brandsmith logo (mark + wordmark) */
export function BrandLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
  const c = light ? "#FFFFFF" : "#0B0B0F";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
        <rect x="3" y="3" width="26" height="26" rx="8" fill={c} />
        <path d="M11 9.5h7.2a4.1 4.1 0 0 1 .9 8.1 4.4 4.4 0 0 1-1.2 8.9H11V9.5Z" fill="none" stroke={light ? "#0B0B0F" : "#FFFFFF"} strokeWidth="2.6" strokeLinejoin="round" />
        <circle cx="23.5" cy="8.5" r="3" fill="#9BE23C" />
      </svg>
      <span className="text-[22px] font-bold tracking-[-0.04em]" style={{ color: c }}>
        {site.brandName.toLowerCase()}
      </span>
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  // Small labels above titles are hidden (cleaner look). Kept so existing code still compiles.
  void children;
  return null;
}

export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-[36px] font-medium leading-[1.05] tracking-tightest text-ink md:text-[56px]">{children}</h2>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-muted md:text-[19px]">{sub}</p>}
    </div>
  );
}
