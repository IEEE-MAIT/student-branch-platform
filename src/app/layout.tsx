import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IEEE MAIT Student Branch | Maharaja Agrasen Institute of Technology",
  description: "Official digital platform, identity, and institutional record of IEEE MAIT Student Branch at Maharaja Agrasen Institute of Technology, Delhi. Established in 2005.",
  keywords: [
    "IEEE MAIT",
    "MAIT Delhi",
    "IEEE Student Branch",
    "Maharaja Agrasen Institute of Technology",
    "WIE MAIT",
    "EDS MAIT",
    "Engineering Community",
    "Rohini Delhi"
  ],
  authors: [{ name: "IEEE MAIT Student Branch" }],
  openGraph: {
    title: "IEEE MAIT Student Branch",
    description: "Advancing technology, building community, and shaping futures at MAIT Delhi. Established in 2005.",
    type: "website",
    locale: "en_US",
    siteName: "IEEE MAIT Student Branch",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans bg-white text-ink antialiased min-h-screen flex flex-col">
        <AnnouncementBanner />
        {children}
      </body>
    </html>
  );
}
