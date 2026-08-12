import type { Metadata } from "next";
import { Public_Sans, Archivo } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";
import "./globals.css";

// Public Sans: built by the US Digital Service for civic/government interfaces.
// Archivo: mechanical display family with a width axis — reads like a city
// signage / road-works system without sliding into generic "gov blue".
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SIGAP - Sistem Informasi Gerak Aduan Publik",
    template: "%s | SIGAP",
  },
  description: "Portal Resmi Pelayanan Pengaduan & Aspirasi Infrastruktur Daerah Terintegrasi",
  metadataBase: new URL("https://sigap-liard.vercel.app"),
  icons: {
    icon: "/assets/images/sigap.png",
    shortcut: "/assets/images/sigap.png",
    apple: "/assets/images/sigap.png",
  },
  openGraph: {
    title: "SIGAP - Sistem Informasi Gerak Aduan Publik",
    description: "Portal Resmi Pelayanan Pengaduan & Aspirasi Infrastruktur Daerah Terintegrasi",
    url: "https://sigap-liard.vercel.app",
    siteName: "SIGAP",
    images: [
      {
        url: "/assets/images/sigap.png",
        width: 800,
        height: 600,
        alt: "Logo SIGAP",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGAP - Sistem Informasi Gerak Aduan Publik",
    description: "Portal Resmi Pelayanan Pengaduan & Aspirasi Infrastruktur Daerah Terintegrasi",
    images: ["/assets/images/sigap.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${publicSans.variable} ${archivo.variable} h-full antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <AppProvider>
          <SessionTimeoutHandler />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
