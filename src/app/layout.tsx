import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";
import "./globals.css";

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
    <html lang="id" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
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
