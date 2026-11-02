import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { BUSINESS_NAME, BUSINESS_CITY } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://jsunrise.vercel.app"),
  title: { default: `${BUSINESS_NAME} | ${BUSINESS_CITY}`, template: "%s | JSunrise" },
  description: `Official website of ${BUSINESS_NAME}, ${BUSINESS_CITY}. Explore our products, services, gallery and contact us.`,
  keywords: ["JSunrise", "J-Sunrise Store", "JSunrise Marketing Office", "Pune", "store", "marketing"],
  openGraph: { title: BUSINESS_NAME, description: `${BUSINESS_NAME} — ${BUSINESS_CITY}`, type: "website" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
