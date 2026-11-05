import { site } from "@/config/site";
import { Check, SectionTitle } from "@/components/ui";
import { BrandVisual } from "@/components/showcase/Visual";

const files: [string, string, string, string][] = [
  ["SVG", "01 Logo", "SVG · PNG · PDF · EPS", "from-[#F2D90B] to-[#9BE23C]"],
  ["PDF", "02 Brand guidelines", "usage rules", "from-[#9BE23C] to-[#1FA85B]"],
  ["Aa", "03 Colors & typography", "palette · fonts", "from-[#1FA85B] to-[#0E6B44]"],
  ["IG", "04 Social media kit", "every platform", "from-[#F2D90B] to-[#1FA85B]"],
  ["PDF", "05 Stationery", "card · letterhead", "from-[#C9E86B] to-[#4FB06A]"],
  ["3D", "06 Mockups", "real-world", "from-[#0E1116] to-[#2E3B33]"],
  ["AI", "07 Source files", "fully editable", "from-[#E3C400] to-[#7CC520]"],
];

function Tile({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[22px] border border-line bg-white shadow-card">
      <div className="aspect-[16/9] overflow-hidden">{children}</div>
      <div className="p-5">
        <p className="text-[16px] font-medium tracking-[-0.01em]">{title}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{text}</p>
      </div>
    </div>
  );
}

export function Included() {
  const img = site.includedImages;
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="text-center">
        <SectionTitle sub="Strategy, identity and every file you need to launch, delivered together and owned by you forever. Look established from your very first customer.">
          A logo is one piece.
          <br />
          You get the whole brand.
        </SectionTitle>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {/* Big card: the final files window */}
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[26px] bg-gradient-brand p-5 shadow-card md:p-10 lg:col-span-2 lg:row-span-2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.45),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(11,59,46,0.35),transparent_50%)]" />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-float backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-[13px] text-muted">Your brand · Final files</span>
            </div>
            <ul>
              {files.map(([badge, name, meta, grad]) => (
                <li key={name} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${grad} text-[10px] font-semibold text-white`}>{badge}</span>
                    <span className="text-[14px] font-medium">{name}</span>
                  </span>
                  <span className="hidden text-[12px] text-muted sm:inline">{meta}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-line bg-paper/70 px-4 py-3 text-[12px]">
              <span className="text-leaf">✓ Delivered · first concepts within 48h</span>
              <span className="text-muted">100% yours</span>
            </div>
          </div>
        </div>

        <Tile title="Three creative directions" text="Three distinct ideas, each explained, so you choose between real options.">
          <BrandVisual brand="Northline Capital" image={img.directions} />
        </Tile>
        <Tile title="One coherent brand world" text="Logo, colors, typography, imagery and tone that all work together.">
          <BrandVisual brand="Oriel Hotels" image={img.world} variant="card" />
        </Tile>
        <Tile title="Guidelines your team can follow" text="Clear rules for your logo, colors and fonts, so every post and slide looks right.">
          <BrandVisual brand="Kinetic" image={img.rules} variant="card" />
        </Tile>
        <Tile title="See it in the real world" text="Business cards and 3D mockups before you print a single thing.">
          <BrandVisual brand="Fieldwork Coffee" image={img.tangible} variant="card" />
        </Tile>
        <Tile title="Social-ready from day one" text="On-brand templates for Instagram, LinkedIn and more.">
          <BrandVisual brand="Lumen Health" image={img.social} />
        </Tile>
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {["Full ownership and copyright", "Print and web formats", "One payment, no subscription"].map((t) => (
          <li key={t} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink/75">
            <Check className="h-3.5 w-3.5 text-leaf" />
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
