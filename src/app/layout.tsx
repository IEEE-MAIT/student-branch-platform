import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { FloatingSocialBar } from "@/components/layout/FloatingSocialBar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { JsonLd } from "@/components/seo/JsonLd";
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00629B" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
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
  manifest: "/manifest.webmanifest",
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

// Instant Anti-Flash Theme Script: Defaults to Light mode; supports explicit Dark or System mode preference
const themeAntiFlashScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (stored === 'system' && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeAntiFlashScript }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="font-sans bg-white dark:bg-gray-950 text-ink dark:text-gray-100 antialiased min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <JsonLd />
          <ServiceWorkerRegister />
          <AnnouncementBanner />
          <FloatingSocialBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
