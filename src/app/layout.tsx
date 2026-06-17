import type { Metadata } from "next";
import { Public_Sans, Archivo, Mukta } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Analytics } from "@vercel/analytics/next";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

// Supports both Latin and Devanagari — used for the mi-या-bi wordmark.
const mukta = Mukta({
  variable: "--font-deva",
  subsets: ["latin", "devanagari"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "mi-या-bi — Premium Sportswear & Athleisure",
  description:
    "miyaabi — premium sports, athleisure and team wear. Engineered for performance, designed for the streets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${archivo.variable} ${mukta.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-white text-ink">
        <StoreProvider>{children}</StoreProvider>
        <Analytics />
      </body>
    </html>
  );
}
