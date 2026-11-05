import { site } from "@/config/site";
import { Nav } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Sections";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: [string, string][] }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[820px] px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-[40px] font-medium leading-[1.05] tracking-tightest md:text-[60px]">{title}</h1>
        <p className="mt-4 text-[15px] text-muted">Last updated: {updated}</p>
        <div className="mt-12 space-y-10">
          {sections.map(([h, body]) => (
            <section key={h}>
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">{h}</h2>
              <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-ink/75">
                {body.split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="text-[15px] text-muted">
            Questions? Contact us at {site.contactEmail}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
