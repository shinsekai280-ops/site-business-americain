import { site } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: `Privacy policy | ${site.brandName}` };

/* TEMPLATE — adapt it to your business and have it reviewed by a legal professional. */
export default function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="November 2026"
      sections={[
        ["What we collect", "Your email address, the answers to your brief, your feedback and the files we create for you. Payment details are handled directly by Stripe: we never see or store your card number."],
        ["Why we collect it", "To deliver your order, send you updates about it, give you access to your client space and answer your questions. If you start an order without finishing it, we may email you once to help you complete it."],
        ["Who we share it with", "Only with the services we need to run our business: Stripe (payments), Supabase (secure storage and login), Resend (emails), Vercel (hosting), and the designer working on your project."],
        ["How long we keep it", "As long as needed to deliver your order and meet our legal and accounting obligations."],
        ["Your rights", `You can ask us to access, correct or delete your personal data at any time by writing to ${site.contactEmail}.`],
        ["Cookies", "We use essential cookies to keep you logged in and to remember your order in progress. If we use analytics or advertising tools, we will tell you here."],
      ]}
    />
  );
}
