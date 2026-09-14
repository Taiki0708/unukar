import type { Metadata, Viewport } from "next";
import "./globals.css";
const origin = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(origin
    ? { metadataBase: new URL(origin), alternates: { canonical: "/" } }
    : {}),
  title: "UNUKAR — Your journey is more than a camera roll",
  description:
    "One photo. Thirty seconds of your voice. Keep the people, places and connections that shaped your year abroad. Become a founding traveler.",
  openGraph: {
    title: "UNUKAR — Keep what made the journey",
    description:
      "Places show where you went. People explain how you got there.",
    type: "website",
    siteName: "UNUKAR",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "UNUKAR — Keep what made the journey",
    description:
      "One photo. Thirty seconds of your voice. A journey worth remembering.",
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#f5f3ed" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
