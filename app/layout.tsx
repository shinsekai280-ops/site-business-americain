import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/fraunces";
import { site } from "@/config/site";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : `https://${site.domain}`);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.seo.title,
  description: site.seo.description,
  keywords: site.seo.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    url: siteUrl,
    siteName: site.brandName,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
