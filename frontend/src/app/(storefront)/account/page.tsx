import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Account — miyaabi" };

export default function AccountPage() {
  return (
    <InfoPage
      title="Your Account"
      intro="Customer accounts are coming soon. For now, you can shop as a guest and check out without an account."
    >
      <p>
        Need help with an order or a return? Reach our team any time and we'll
        sort it out for you.
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <Link
          href="/pages/track-order"
          className="rounded-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand"
        >
          Track an order
        </Link>
        <Link
          href="/pages/contact"
          className="rounded-full border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white"
        >
          Contact support
        </Link>
      </div>
    </InfoPage>
  );
}
