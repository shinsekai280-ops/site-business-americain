import { site } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: `Terms of service | ${site.brandName}` };

/* TEMPLATE — adapt it to your business and have it reviewed by a legal professional. */
export default function Page() {
  return (
    <LegalPage
      title="Terms of service"
      updated="November 2026"
      sections={[
        ["Who we are", `${site.brandName} is operated by ${site.legalName}, ${site.legalAddress}. Contact: ${site.contactEmail}.`],
        [
          "Our service",
          "We design logos and brand identities based on the information you provide in your brief. Designs are created by our team of experienced partner designers and reviewed by a project manager before delivery.",
        ],
        ["Orders and payment", "Prices are shown in US dollars and paid once, in advance, by card through Stripe. The content of each package is described on our pricing page at the time of your order."],
        ["Delivery", "Delivery times start once your brief is submitted. First concepts are delivered within the time shown on your package. Revisions are delivered as fast as possible, usually within 1 to 2 business days."],
        [
          "Ownership",
          "Once your order is complete and fully paid, you own all rights to the final design delivered to you, including the source files. We may show your project in our portfolio unless you ask us not to.",
        ],
        ["Your responsibilities", "You confirm that the information, names and materials you send us can be used legally. We recommend checking trademark availability for your brand name and logo before registering or using them commercially."],
        ["Refunds", "Refunds are governed by our refund policy, which is part of these terms."],
        ["Liability", `To the extent permitted by law, ${site.legalName}'s liability is limited to the amount you paid for your order.`],
      ]}
    />
  );
}
