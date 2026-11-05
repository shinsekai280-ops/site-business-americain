/**
 * Fictional demo brands, designed for the showcase.
 * Replace them with your REAL work as soon as you have it (see GUIDE.md).
 */

type P = { color?: string; className?: string };

export function Halden({ color = "#0B0B0F", className = "" }: P) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ color }}>
      <svg viewBox="0 0 40 40" className="h-[1.6em] w-[1.6em]" aria-hidden>
        <rect x="4" y="4" width="14" height="32" fill="currentColor" />
        <rect x="22" y="4" width="14" height="32" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="18" y="18" width="4" height="4" fill="currentColor" />
      </svg>
      <span className="font-sans font-semibold uppercase tracking-[0.32em]">Halden</span>
    </div>
  );
}

export function Verra({ color = "#2B2118", className = "" }: P) {
  return (
    <div className={`flex items-baseline ${className}`} style={{ color }}>
      <span className="font-serif text-[1.35em] italic tracking-[-0.02em]">verra</span>
      <span className="ml-1 inline-block h-[0.28em] w-[0.28em] rounded-full" style={{ background: "#C8A24A" }} />
    </div>
  );
}

export function Northline({ color = "#FFFFFF", className = "" }: P) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ color }}>
      <svg viewBox="0 0 40 40" className="h-[1.7em] w-[1.7em]" aria-hidden>
        <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M13 28V12l14 16V12" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-sans font-semibold tracking-[-0.02em]">Northline</span>
        <span className="block font-mono text-[0.42em] uppercase tracking-[0.3em] opacity-70">Capital</span>
      </span>
    </div>
  );
}

export function Oriel({ color = "#1E2A24", className = "" }: P) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} style={{ color }}>
      <svg viewBox="0 0 40 44" className="h-[1.8em] w-[1.6em]" aria-hidden>
        <path d="M6 42V20a14 14 0 0 1 28 0v22" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M13 42V22a7 7 0 0 1 14 0v20" fill="none" stroke="currentColor" strokeWidth="2.4" />
      </svg>
      <span className="font-serif text-[1.15em] uppercase tracking-[0.35em]">Oriel</span>
      <span className="font-mono text-[0.38em] uppercase tracking-[0.4em] opacity-70">Hotels &amp; Residences</span>
    </div>
  );
}

export function Fieldwork({ color = "#F7F2E8", className = "" }: P) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ color }}>
      <svg viewBox="0 0 120 120" className="h-[4.4em] w-[4.4em]" aria-label="Fieldwork Coffee">
        <defs>
          <path id="fw-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2" />
        <text fontSize="11" letterSpacing="5" fill="currentColor" fontFamily="var(--font-mono)">
          <textPath href="#fw-circle">FIELDWORK • COFFEE ROASTERS • EST 2026 •</textPath>
        </text>
        <path d="M47 70c0-12 6-22 13-26 7 4 13 14 13 26-4 4-9 6-13 6s-9-2-13-6Z" fill="currentColor" />
        <path d="M60 46v28" stroke="#3B2A1E" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function Lumen({ color = "#0B3B2E", className = "" }: P) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ color }}>
      <svg viewBox="0 0 40 40" className="h-[1.5em] w-[1.5em]" aria-hidden>
        <circle cx="20" cy="20" r="7" fill="currentColor" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={20 + Math.cos(a) * 11}
              y1={20 + Math.sin(a) * 11}
              x2={20 + Math.cos(a) * 17}
              y2={20 + Math.sin(a) * 17}
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <span className="font-sans font-medium tracking-[-0.03em]">
        lumen<span className="font-light opacity-70"> health</span>
      </span>
    </div>
  );
}

export function Kinetic({ color = "#0B0B0F", className = "" }: P) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={{ color }}>
      <svg viewBox="0 0 40 40" className="h-[1.4em] w-[1.4em]" aria-hidden>
        <path d="M8 8l12 12L8 32" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M20 8l12 12-12 12" fill="none" stroke="#9BE23C" strokeWidth="4.5" strokeLinejoin="round" />
      </svg>
      <span className="font-sans font-bold tracking-[-0.045em]">kinetic</span>
    </div>
  );
}

export function MaisonSel({ color = "#1A1A1A", className = "" }: P) {
  return (
    <div className={`flex flex-col items-center ${className}`} style={{ color }}>
      <span className="font-serif text-[2.2em] leading-none tracking-[-0.06em]">
        M<span className="italic">s</span>
      </span>
      <span className="mt-2 font-sans text-[0.5em] uppercase tracking-[0.5em]">Maison Sel</span>
    </div>
  );
}

export const demoBrands = [
  { name: "Halden", industry: "Real estate", Logo: Halden },
  { name: "Verra", industry: "Beauty", Logo: Verra },
  { name: "Northline Capital", industry: "Finance", Logo: Northline },
  { name: "Oriel Hotels", industry: "Hospitality", Logo: Oriel },
  { name: "Fieldwork Coffee", industry: "Food & drink", Logo: Fieldwork },
  { name: "Lumen Health", industry: "Health", Logo: Lumen },
  { name: "Kinetic", industry: "SaaS", Logo: Kinetic },
  { name: "Maison Sel", industry: "E-commerce", Logo: MaisonSel },
];
