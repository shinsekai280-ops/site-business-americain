"use client";

import { useState } from "react";
import { site, formatUsd } from "@/config/site";
import { DarkButton, SectionTitle } from "@/components/ui";
import { BrandVisual } from "@/components/showcase/Visual";

const PER_PAGE = 2;
const fromPrice = formatUsd(Math.min(...site.packages.map((p) => p.priceUsd)));

export function Work() {
  const tabs = ["Featured", ...Array.from(new Set(site.portfolio.map((p) => p.industry)))];
  const [tab, setTab] = useState("Featured");
  const [page, setPage] = useState(0);

  const list = tab === "Featured" ? site.portfolio.filter((p) => p.featured) : site.portfolio.filter((p) => p.industry === tab);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const shown = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[20px] leading-none shadow-[0_1px_2px_rgba(11,11,15,0.06)] transition hover:border-ink/30";

  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-14 md:px-10 md:py-20">
      <SectionTitle>Our recent work</SectionTitle>

      <div className="mt-8 flex justify-center">
        <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-ink/[0.05] p-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(0);
              }}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition md:px-5 ${
                tab === t ? "bg-white text-ink shadow-[0_1px_3px_rgba(11,11,15,0.12)]" : "text-ink/60 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {shown.map((p) => (
          <article key={p.name}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden rounded-[20px]">
                <BrandVisual brand={p.name} image={p.images[0]} variant="logo" />
              </div>
              <div className="aspect-[16/10] overflow-hidden rounded-[20px]">
                <BrandVisual brand={p.name} image={p.images[1]} variant="card" />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[15px]">
              <span aria-hidden>→</span>
              <span className="font-medium">{p.name}</span>
              <span className="text-muted">· {p.industry}</span>
            </p>
          </article>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <button aria-label="Previous projects" onClick={() => setPage((page - 1 + pages) % pages)} className={arrow}>
            ‹
          </button>
          <button aria-label="Next projects" onClick={() => setPage((page + 1) % pages)} className={arrow}>
            ›
          </button>
          <p className="text-[13px] tabular-nums">
            {String(page + 1).padStart(2, "0")} <span className="text-muted">/ {String(pages).padStart(2, "0")}</span>
          </p>
          <div className="h-px w-32 bg-line md:w-40">
            <div className="h-px bg-ink transition-all duration-500" style={{ width: `${((page + 1) / pages) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-col items-center gap-3">
        <DarkButton href="#pricing">Start my brand</DarkButton>
        <p className="text-[13px] text-muted">From {fromPrice} · first concepts in 48 hours</p>
      </div>
    </section>
  );
}
