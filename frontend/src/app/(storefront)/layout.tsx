import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatBubble from "@/components/ChatBubble";
import { getSettings, getCollections } from "@/lib/api";
import { buildNav } from "@/lib/nav";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, collections] = await Promise.all([
    getSettings(),
    getCollections(),
  ]);
  const nav = buildNav(collections);

  return (
    <>
      <AnnouncementBar messages={settings.announcementMessages} />
      <Header nav={nav} brand={settings.brand} />
      <main className="flex-1">{children}</main>
      <Footer footer={settings.footer} brand={settings.brand} />
      <CartDrawer />
      {settings.whatsapp.enabled && <ChatBubble whatsapp={settings.whatsapp} />}
    </>
  );
}
