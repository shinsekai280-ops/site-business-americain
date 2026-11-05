/**
 * ============================================================
 *  SITE SETTINGS — the only file you need to edit.
 *  Change your brand name, prices, offers and options here.
 * ============================================================
 */

export type PackageId = "basic" | "premium" | "ecosystem";

export type Upsell = {
  enabled: boolean;
  name: string;
  priceUsd: number; // total price if the client accepts (replaces the package price)
  pitch: string;
  includes: string[];
  revisionLimit: number | null; // revisions allowed with this option (null = unlimited)
};

export type Package = {
  id: PackageId;
  name: string;
  priceUsd: number;
  tagline: string;
  badge?: string; // e.g. "Most popular"
  highlighted?: boolean;
  concepts: string;
  revisions: string;
  delivery: string;
  includes: string[]; // shown with a check
  excludes: string[]; // shown greyed out (what the client is missing)
  revisionLimit: number | null; // revisions included (null = unlimited)
  upsell: Upsell;
};

export const site = {
  /* ---------- Brand ---------- */
  brandName: "Brandsmith",
  domain: "brandsmith.studio",
  contactEmail: "hello@brandsmith.studio",
  legalName: "Brandsmith LLC", // your company name, shown in the footer and legal pages
  legalAddress: "[Your company address]",

  /* ---------- SEO ---------- */
  seo: {
    title: "Professional Logo Design & Brand Identity | Brandsmith",
    description:
      "Professional logo design and complete brand identity by experienced designers. First concepts in 48 hours, from $280. Fixed prices, full ownership, money-back guarantee.",
    keywords: [
      "logo design",
      "professional logo design",
      "brand identity design",
      "custom logo",
      "logo design for small business",
      "startup branding",
      "brand guidelines",
    ],
  },

  /* ---------- Top banner ---------- */
  // First concepts delivered in X days (the date updates by itself every day).
  deliveryDays: 2,
  // Max orders you can handle per day. Leave at 0 to hide the "spots left" message.
  dailyCapacity: 10,
  // Book a call button: paste your Calendly (or similar) link. Leave empty to hide the button.
  bookCallUrl: "",

  /* ---------- Social proof (leave empty until you have REAL data) ---------- */
  stats: {
    customers: "", // e.g. "1,200+"
    rating: "", // e.g. "4.9"
    reviewCount: "", // e.g. "312"
  },
  // Real reviews only. While this list is empty, the reviews section is hidden.
  reviews: [] as { name: string; country: string; date: string; text: string }[],

  /* ---------- Portfolio ("Our recent work") ----------
     4 projects per industry, 1 moodboard image per project (landscape 3:2, e.g. 1536 x 1024).
     Put the images in /public/work/ with the exact file name below. Missing image = neutral placeholder.
     "featured: true" = shown in the first tab ("Featured"). One tab is created per industry automatically. */
  portfolio: [
    { name: "Veyra AI", industry: "AI startups", featured: true, image: "/work/veyra-ai.jpg" },
    { name: "Synthra", industry: "AI startups", featured: true, image: "/work/synthra.jpg" },
    { name: "Kairo", industry: "AI startups", featured: false, image: "/work/kairo.jpg" },
    { name: "Loopmind", industry: "AI startups", featured: false, image: "/work/loopmind.jpg" },
    { name: "Tasklane", industry: "SaaS", featured: true, image: "/work/tasklane.jpg" },
    { name: "Pulsebase", industry: "SaaS", featured: false, image: "/work/pulsebase.jpg" },
    { name: "Shiftly", industry: "SaaS", featured: false, image: "/work/shiftly.jpg" },
    { name: "Clearform", industry: "SaaS", featured: false, image: "/work/clearform.jpg" },
    { name: "Stride Lab", industry: "E-commerce", featured: true, image: "/work/stride-lab.jpg" },
    { name: "Hearth & Clay", industry: "E-commerce", featured: false, image: "/work/hearth-clay.jpg" },
    { name: "Wildtail", industry: "E-commerce", featured: false, image: "/work/wildtail.jpg" },
    { name: "Aurum Atelier", industry: "E-commerce", featured: false, image: "/work/aurum-atelier.jpg" },
    { name: "Solène", industry: "Beauty", featured: true, image: "/work/solene.jpg" },
    { name: "Velours", industry: "Beauty", featured: false, image: "/work/velours.jpg" },
    { name: "Nuda", industry: "Beauty", featured: false, image: "/work/nuda.jpg" },
    { name: "Ambre Botanics", industry: "Beauty", featured: false, image: "/work/ambre-botanics.jpg" },
    { name: "Kinesis Physio", industry: "Health & wellness", featured: true, image: "/work/kinesis-physio.jpg" },
    { name: "Calmora", industry: "Health & wellness", featured: false, image: "/work/calmora.jpg" },
    { name: "Vitalis Labs", industry: "Health & wellness", featured: false, image: "/work/vitalis-labs.jpg" },
    { name: "Haven Dental", industry: "Health & wellness", featured: false, image: "/work/haven-dental.jpg" },
    { name: "Stonegate Realty", industry: "Real estate", featured: true, image: "/work/stonegate-realty.jpg" },
    { name: "Meridian Homes", industry: "Real estate", featured: false, image: "/work/meridian-homes.jpg" },
    { name: "Arcadia Living", industry: "Real estate", featured: false, image: "/work/arcadia-living.jpg" },
    { name: "Keystone Lofts", industry: "Real estate", featured: false, image: "/work/keystone-lofts.jpg" },
    { name: "Halvorsen Partners", industry: "Consulting", featured: false, image: "/work/halvorsen-partners.jpg" },
    { name: "Northbridge Advisory", industry: "Consulting", featured: false, image: "/work/northbridge-advisory.jpg" },
    { name: "Clarity Strategy Group", industry: "Consulting", featured: false, image: "/work/clarity-strategy-group.jpg" },
    { name: "Lattice Tax & Advisory", industry: "Consulting", featured: false, image: "/work/lattice-tax-advisory.jpg" },
    { name: "Studio Kinsa", industry: "Agencies", featured: false, image: "/work/studio-kinsa.jpg" },
    { name: "Bolt Media", industry: "Agencies", featured: false, image: "/work/bolt-media.jpg" },
    { name: "Fable & Frame", industry: "Agencies", featured: false, image: "/work/fable-frame.jpg" },
    { name: "Outpost PR", industry: "Agencies", featured: false, image: "/work/outpost-pr.jpg" },
    { name: "Casa Albera", industry: "Hospitality", featured: true, image: "/work/casa-albera.jpg" },
    { name: "Ember & Oak", industry: "Hospitality", featured: false, image: "/work/ember-oak.jpg" },
    { name: "Salt House", industry: "Hospitality", featured: false, image: "/work/salt-house.jpg" },
    { name: "The Linden", industry: "Hospitality", featured: false, image: "/work/the-linden.jpg" },
  ] as { name: string; industry: string; featured: boolean; image: string }[],

  /* ---------- "A logo is one piece" section images ----------
     Put your images in /public/included/ and write the path. Empty = demo visual. */
  includedImages: {
    directions: "",
    world: "",
    rules: "",
    tangible: "",
    social: "",
  },

  /* ---------- Packages ---------- */
  packages: [
    {
      id: "basic",
      name: "Basic",
      priceUsd: 280,
      tagline: "Everything you need to launch with a professional logo.",
      concepts: "1 logo concept",
      revisions: "2 revisions",
      delivery: "First concept in 2 days",
      includes: [
        "1 logo concept",
        "Transparent logo files",
        "Vector source files (SVG, EPS, PDF)",
        "Print-ready files",
        "2 revisions included",
        "Delivered in 2 days",
      ],
      excludes: [
        "Color palette",
        "Brand typography",
        "3D mockups",
        "Stationery design",
        "Competitor analysis",
        "Brand guidelines",
        "Social media kit",
      ],
      revisionLimit: 2,
      upsell: {
        enabled: true,
        name: "Basic+",
        priceUsd: 375,
        pitch: "Get more room to perfect your logo.",
        includes: ["5 revisions instead of 2", "Priority delivery", "Animated logo for social media"],
        revisionLimit: 5,
      },
    },
    {
      id: "premium",
      name: "Premium Branding",
      priceUsd: 480,
      tagline: "The complete identity to launch and grow your business.",
      badge: "Most popular",
      highlighted: true,
      concepts: "3 logo concepts",
      revisions: "3 revisions",
      delivery: "First concepts in 2 days",
      includes: [
        "3 logo concepts to choose from",
        "Complete brand guidelines",
        "Competitor analysis",
        "Color palette",
        "Brand typography",
        "Logo usage rules",
        "Social media kit",
        "3D mockups",
        "Business card design",
        "3 revisions included",
        "Delivered in 2 days",
      ],
      excludes: [],
      revisionLimit: 3,
      upsell: {
        enabled: true,
        name: "Launch Pack",
        priceUsd: 690,
        pitch: "Launch faster with unlimited revisions and priority service.",
        includes: ["Unlimited revisions", "Priority delivery", "Animated logo", "Dedicated project manager"],
        revisionLimit: null,
      },
    },
    {
      id: "ecosystem",
      name: "Brand Ecosystem",
      priceUsd: 987,
      tagline: "The full system to market and scale your brand online.",
      concepts: "3 logo concepts",
      revisions: "Unlimited revisions",
      delivery: "Delivered in 5 business days",
      includes: [
        "Everything in Premium Branding",
        "Brand positioning & messaging",
        "Brand voice guide",
        "10 social media designs",
        "LinkedIn profile design",
        "Email signature & newsletter design",
        "5 Google display banners",
        "5 static ad creatives",
        "Packaging & merchandise mockups",
        "Patterns, icons & UI brand elements",
        "Unlimited revisions",
        "Delivered in 5 business days",
      ],
      excludes: [],
      revisionLimit: null,
      upsell: {
        enabled: true,
        name: "Creative Director Bundle",
        priceUsd: 2499,
        pitch: "Your brand led personally by our creative director.",
        includes: ["Led by our creative director", "Top priority on every step", "Brand launch strategy session"],
        revisionLimit: null,
      },
    },
  ] as Package[],

  /* ---------- Revisions & refunds ---------- */
  approvalScore: 6, // a revision rating of 6/10 or more approves the concept
};

export function getPackage(id: string): Package | undefined {
  return site.packages.find((p) => p.id === id);
}

export function formatUsd(n: number) {
  return "$" + n.toLocaleString("en-US");
}
