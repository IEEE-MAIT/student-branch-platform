import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
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

export const viewport: Viewport = {
  themeColor: "#00629B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IEEE MAIT",
  },
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="font-sans bg-white text-ink antialiased min-h-screen flex flex-col">
        <ServiceWorkerRegister />
        <AnnouncementBanner />
        {children}
      </body>
    </html>
  );
}
