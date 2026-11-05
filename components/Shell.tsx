import Link from "next/link";
import { BrandLogo } from "@/components/ui";

/** Simple frame for the order funnel, client space and admin pages. */
export function Shell({ children, right, wide = false }: { children: React.ReactNode; right?: React.ReactNode; wide?: boolean }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="blob -right-40 -top-40 h-[520px] w-[520px] bg-lime/35" />
      <div className="blob -left-40 top-1/2 h-[420px] w-[420px] bg-lemon/30" />
      <header className="relative border-b border-line/70 bg-paper/70 backdrop-blur-xl">
        <div className={`mx-auto flex h-16 items-center justify-between px-5 md:h-[72px] md:px-8 ${wide ? "max-w-[1200px]" : "max-w-[980px]"}`}>
          <Link href="/" aria-label="Home">
            <BrandLogo />
          </Link>
          <div className="text-[14px]">{right}</div>
        </div>
      </header>
      <main className={`relative mx-auto px-5 py-10 md:px-8 md:py-16 ${wide ? "max-w-[1200px]" : "max-w-[980px]"}`}>{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[28px] border border-line bg-white p-6 shadow-card md:p-10 ${className}`}>{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[15px] font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[16px] outline-none transition placeholder:text-ink/30 focus:border-ink/40 focus:ring-4 focus:ring-lime/25";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={`group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink py-2.5 pl-6 pr-2.5 text-[16px] font-medium text-white shadow-pill transition hover:bg-black disabled:opacity-50 sm:w-auto ${className}`}
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition group-hover:translate-x-0.5">→</span>
    </button>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-line bg-paper px-5 py-4 text-[15px] text-ink/80">{children}</div>;
}
