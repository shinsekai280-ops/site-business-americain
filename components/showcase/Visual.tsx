import { demoBrands } from "@/components/showcase/logos";

/** Styling of each demo brand (used until you add your own images). */
const looks: Record<string, { bg: string; ink: string; alt: string; altInk: string; size: string }> = {
  Halden: { bg: "bg-[#ECEBE6]", ink: "#0B0B0F", alt: "bg-[#1C1D20]", altInk: "#ECEBE6", size: "text-[28px]" },
  Verra: { bg: "bg-[#EFE7DA]", ink: "#2B2118", alt: "bg-[#C9B79C]", altInk: "#2B2118", size: "text-[64px]" },
  "Northline Capital": { bg: "bg-[#0E1116]", ink: "#FFFFFF", alt: "bg-[#DDE3EA]", altInk: "#0E1116", size: "text-[30px]" },
  "Oriel Hotels": { bg: "bg-[#16352B]", ink: "#EAF2E3", alt: "bg-[#E9E3D6]", altInk: "#16352B", size: "text-[30px]" },
  "Fieldwork Coffee": { bg: "bg-[#3B2A1E]", ink: "#F7F2E8", alt: "bg-[#D8C3A5]", altInk: "#3B2A1E", size: "text-[28px]" },
  "Lumen Health": { bg: "bg-gradient-brand", ink: "#0B3B2E", alt: "bg-[#0B3B2E]", altInk: "#D9F99D", size: "text-[32px]" },
  Kinetic: { bg: "bg-white", ink: "#0B0B0F", alt: "bg-[#0B0B0F]", altInk: "#FFFFFF", size: "text-[40px]" },
  "Maison Sel": { bg: "bg-[#D9D4CB]", ink: "#1A1A1A", alt: "bg-[#1A1A1A]", altInk: "#D9D4CB", size: "text-[34px]" },
};

/**
 * Shows your image if a path is given, otherwise a demo visual of the brand.
 * variant "logo" = the logo on its color, "card" = the logo on a business card mockup.
 */
export function BrandVisual({ brand, image, variant = "logo", className = "" }: { brand: string; image?: string; variant?: "logo" | "card"; className?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={brand} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  const look = looks[brand] || { bg: "bg-[#ECEBE6]", ink: "#0B0B0F", alt: "bg-ink", altInk: "#fff", size: "text-[28px]" };
  const Logo = demoBrands.find((b) => b.name === brand)?.Logo;

  if (variant === "card") {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${look.alt} ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
        <div className={`absolute bottom-[14%] right-[12%] aspect-[1.75] w-[34%] min-w-[120px] rotate-6 rounded-lg opacity-90 shadow-[0_20px_40px_rgba(0,0,0,0.3)] ${look.bg}`} />
        <div className={`relative z-10 -translate-x-[6%] flex aspect-[1.75] w-[52%] min-w-[180px] -rotate-6 items-center justify-center rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.35)] ${look.bg}`}>
          <div className="text-[clamp(12px,1.4vw,18px)]">{Logo ? <Logo color={look.ink} /> : <span style={{ color: look.ink }}>{brand}</span>}</div>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden ${look.bg} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      <div className={`relative ${look.size}`}>{Logo ? <Logo color={look.ink} /> : <span style={{ color: look.ink }}>{brand}</span>}</div>
    </div>
  );
}
