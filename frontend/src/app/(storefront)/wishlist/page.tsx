import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Wishlist — miyaabi" };

export default function WishlistPage() {
  return (
    <InfoPage
      title="Your Wishlist"
      intro="Saved items are coming soon. In the meantime, explore the collection and add your favourites to the cart."
    >
      <div className="mt-2">
        <Link
          href="/collections"
          className="inline-block rounded-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand"
        >
          Browse the collection
        </Link>
      </div>
    </InfoPage>
  );
}
