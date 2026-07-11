import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SIGAP - Sistem Informasi Gerak Aduan Publik",
  description: "Portal Resmi Pelayanan Pengaduan & Aspirasi Infrastruktur Daerah Terintegrasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
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
