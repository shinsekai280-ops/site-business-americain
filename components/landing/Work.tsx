"use client";

import { useState } from "react";
import { demoBrands } from "@/components/showcase/logos";
import { DarkButton, Eyebrow, SectionTitle } from "@/components/ui";

const backgrounds: Record<string, { bg: string; logo: string; size: string }> = {
  Halden: { bg: "bg-[#ECEBE6]", logo: "#0B0B0F", size: "text-[26px]" },
  Verra: { bg: "bg-[#EFE7DA]", logo: "#2B2118", size: "text-[56px]" },
  "Northline Capital": { bg: "bg-[#0E1116]", logo: "#FFFFFF", size: "text-[26px]" },
  "Oriel Hotels": { bg: "bg-[#16352B]", logo: "#EAF2E3", size: "text-[26px]" },
  "Fieldwork Coffee": { bg: "bg-[#3B2A1E]", logo: "#F7F2E8", size: "text-[26px]" },
  "Lumen Health": { bg: "bg-gradient-brand", logo: "#0B3B2E", size: "text-[28px]" },
  Kinetic: { bg: "bg-white", logo: "#0B0B0F", size: "text-[34px]" },
  "Maison Sel": { bg: "bg-[#D9D4CB]", logo: "#1A1A1A", size: "text-[30px]" },
};

export function Work() {
  const industries = ["All", ...Array.from(new Set(demoBrands.map((b) => b.industry)))];
  const [active, setActive] = useState("All");
  const list = active === "All" ? demoBrands : demoBrands.filter((b) => b.industry === active);

  return (
    <section id="work" className="mx-auto max-w-[1400px] scroll-mt-24 px-5 py-24 md:px-10 md:py-32">
      <Eyebrow>Portfolio</Eyebrow>
      <div className="mt-4 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionTitle>Our recent work</SectionTitle>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {industries.map((i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              data-filter={i}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition ${
                active === i ? "bg-ink text-white shadow-pill" : "border border-line bg-white text-ink/70 hover:text-ink"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map(({ name, industry, Logo }) => {
          const s = backgrounds[name];
          return (
            <article key={name} data-industry={industry} className="group overflow-hidden rounded-[28px] border border-white bg-white p-2 shadow-card transition hover:-translate-y-1 hover:shadow-float">
              <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[22px] ${s.bg}`}>
                <div className={`${s.size} transition duration-500 group-hover:scale-105`}>
                  <Logo color={s.logo} />
                </div>
              </div>
              <div className="flex items-center justify-between px-3 pb-2 pt-4">
                <p className="text-[15px] font-medium">{name}</p>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">{industry}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <DarkButton href="#pricing">Start my brand</DarkButton>
        <p className="text-[14px] text-muted">First concepts in 48 hours</p>
      </div>
    </section>
  );
}
