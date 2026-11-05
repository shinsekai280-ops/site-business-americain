import Link from "next/link";
import { site } from "@/config/site";
import { BrandLogo } from "@/components/ui";

export function TopBar({ date, spots }: { date: string; spots: number | null }) {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[13px] text-white/90 md:text-[14px]">
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-lime align-middle shadow-[0_0_10px_#9BE23C]" />
      Order today, see your first concepts by <strong className="font-semibold text-white">{date}</strong>
      {spots !== null && (
        <>
          <span className="mx-3 hidden text-white/40 md:inline">·</span>
          <span className="hidden md:inline">
            {spots > 0 ? (
              <>
                Only <strong className="font-semibold text-white">{spots}</strong> Premium spots left today
              </>
            ) : (
              <>Today is fully booked — order now to secure the next slot</>
            )}
          </span>
        </>
      )}
    </div>
  );
}

export function Nav() {
  const links = [
    { href: "#work", label: "Work" },
    { href: "#pricing", label: "Pricing" },
    { href: "#how", label: "How it works" },
    ...(site.reviews.length ? [{ href: "#reviews", label: "Reviews" }] : []),
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <div className="flex items-center gap-12">
          <Link href="/" aria-label={site.brandName}>
            <BrandLogo />
          </Link>
          <nav className="hidden items-center gap-9 text-[15px] text-ink/70 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2.5">
          {site.bookCallUrl && (
            <a
              href={site.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-line bg-white px-5 py-2.5 text-[15px] font-medium shadow-[0_1px_2px_rgba(11,11,15,0.06)] transition hover:border-ink/20 sm:inline-flex"
            >
              Book a call
            </a>
          )}
          <a href="#pricing" className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white shadow-pill transition hover:bg-black">
            Start my brand
          </a>
        </div>
      </div>
    </header>
  );
}
