import { site } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: `Refund policy | ${site.brandName}`, description: `${site.brandName} money-back guarantee and refund policy.` };

/* TEMPLATE — adapt it to your business and have it reviewed by a legal professional. */
export default function Page() {
  return (
    <LegalPage
      title="Refund policy"
      updated="November 2026"
      sections={[
        ["Our guarantee", `We want you to love your brand. If your concepts don’t feel right, we keep working on them. If you’re still not satisfied, you can request a refund under the conditions below.`],
        [
          "Revisions first",
          `Each package includes a set number of revisions (unlimited for some packages). A revision is one list of changes sent at once through your client space. After each delivery, you rate the concept from 1 to 10. A score of ${site.approvalScore} or more approves the concept.\nAt least one revision request is required before a refund can be requested, so our designers have a chance to adjust the work to your feedback. Before issuing a refund, we may offer to assign a different designer or create new concepts.`,
        ],
        [
          "When you can get a refund",
          "You can request a full refund as long as you have not downloaded your final files.\nRequests are made by email with your order number and a short explanation. Refunds are issued to the original payment method. Processing times depend on your bank.",
        ],
        [
          "When a refund is no longer possible",
          "Once your final files have been downloaded from your client space, your order is considered complete and is no longer refundable. Before downloading, you are asked to confirm that you understand this, and the date of the download is recorded.\nA project may also be closed without refund if we receive no response from you for 40 consecutive days. The work completed so far is then delivered as is.",
        ],
        ["Exceptions", "If a final file is corrupted, missing or delivered in the wrong format, we fix it at no cost."],
        ["Changes after delivery", "Changes that go beyond the scope of your original package, after final delivery, may be billed separately. We always tell you the price before starting."],
      ]}
    />
  );
}
