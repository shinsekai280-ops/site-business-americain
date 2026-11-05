import { site, formatUsd } from "@/config/site";
import { firstConceptsDate, spotsLeftToday } from "@/lib/availability";
import { TopBar, Nav } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Work } from "@/components/landing/Work";
import { Included } from "@/components/landing/Included";
import { Dock } from "@/components/landing/Dock";
import { Industries, Compare, Pricing, Guarantee, Promises, Process, Reviews, Faq, FinalCta, Footer } from "@/components/landing/Sections";

export const revalidate = 300; // refresh the banner date and spots every 5 minutes

export default async function Home() {
  const date = firstConceptsDate();
  const spots = await spotsLeftToday();
  const fromPrice = formatUsd(Math.min(...site.packages.map((p) => p.priceUsd)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brandName,
    description: site.seo.description,
    url: `https://${site.domain}`,
    email: site.contactEmail,
    priceRange: `${fromPrice}+`,
    makesOffer: site.packages.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.priceUsd,
      priceCurrency: "USD",
      description: p.tagline,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopBar date={date} spots={spots} />
      <Nav />
      <main>
        <Hero />
        <Industries />
        <Compare />
        <Work />
        <Included />
        <Pricing spots={spots} />
        <Guarantee />
        <Promises />
        <Process />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <Dock fromPrice={fromPrice} />
    </>
  );
}
