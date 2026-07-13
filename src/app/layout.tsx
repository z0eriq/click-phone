import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingContact } from "@/components/layout/floating-contact";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "CLICK PHONE | كليك فون - هواتف ذكية وإلكترونيات",
    template: "%s | CLICK PHONE",
  },
  description:
    "متجر كليك فون - وجهتك الأولى لشراء الهواتف الذكية، الأجهزة اللوحية، الساعات الذكية والإكسسوارات في إربد، الأردن. أفضل الأسعار وضمان أصلي.",
  keywords: [
    "كليك فون",
    "CLICK PHONE",
    "هواتف ذكية",
    "ايفون",
    "سامسونج",
    "شاومي",
    "إربد",
    "الأردن",
    "بيع هواتف",
    "إكسسوارات",
    "صيانة هواتف",
  ],
  authors: [{ name: "CLICK PHONE" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_JO",
    alternateLocale: "en_US",
    siteName: "CLICK PHONE",
    title: "CLICK PHONE | كليك فون",
    description: "وجهتك الأولى للهواتف الذكية والإلكترونيات في إربد، الأردن",
    images: [{ url: "/logo.png", alt: "CLICK PHONE" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} font-arabic antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
