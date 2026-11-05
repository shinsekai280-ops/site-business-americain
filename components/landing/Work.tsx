"use client";

import { useState } from "react";
import { site, formatUsd } from "@/config/site";
import { DarkButton, SectionTitle } from "@/components/ui";

const PER_PAGE = 4;
const fromPrice = formatUsd(Math.min(...site.packages.map((p) => p.priceUsd)));

/** The moodboard image, or a neutral placeholder while the file is not in /public/work yet. */
function Moodboard({ name, image }: { name: string; image: string }) {
  const [failed, setFailed] = useState(!image);
  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#EFEFEB,#E4E4DE)]">
        <span className="text-[22px] font-medium tracking-[-0.02em] text-ink/40 md:text-[28px]">{name}</span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={image}
      alt={`${name} brand identity`}
      onError={() => setFailed(true)}
      // the error can fire before the page is interactive: check again once mounted
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      className="h-full w-full object-cover"
    />
  );
}

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

      <div className="mt-8 grid gap-x-5 gap-y-8 md:grid-cols-2">
        {shown.map((p) => (
          <article key={p.name}>
            <div className="rounded-[26px] border border-line bg-white p-2.5 shadow-card md:p-3">
              <div className="aspect-[3/2] overflow-hidden rounded-[16px]">
                <Moodboard key={p.image} name={p.name} image={p.image} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4 px-1">
              <p className="text-[17px] font-medium tracking-[-0.01em]">{p.name}</p>
              <p className="text-[13px] text-muted">{p.industry}</p>
            </div>
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
