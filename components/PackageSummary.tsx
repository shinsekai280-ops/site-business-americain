import Link from "next/link";
import { site, type Package, formatUsd } from "@/config/site";
import { Check } from "@/components/ui";

/** "Your package" box with the option to switch packages. */
export function PackageSummary({ current, basePath }: { current: Package; basePath: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-white p-6 shadow-card md:p-8">
      <p className="text-[13px] font-medium text-muted">Your package</p>
      <div className="mt-4 space-y-2">
        {site.packages.map((p) => {
          const active = p.id === current.id;
          return (
            <Link
              key={p.id}
              href={`${basePath}?pkg=${p.id}`}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 transition ${
                active ? "border-ink bg-ink text-white" : "border-line hover:border-ink/30"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${active ? "border-lime bg-lime text-ink" : "border-line"}`}>
                  {active && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="text-[15px] font-medium">{p.name}</span>
                {p.badge && !active && <span className="hidden rounded-full bg-gradient-brand px-2 py-0.5 text-[13px] font-medium text-ink sm:inline">{p.badge}</span>}
              </span>
              <span className="text-[15px]">from {formatUsd(p.priceUsd)}</span>
            </Link>
          );
        })}
      </div>
      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {current.includes.slice(0, 6).map((i) => (
          <li key={i} className="flex gap-2.5 text-[14px] text-ink/75">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
