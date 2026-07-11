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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <SessionTimeoutHandler />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
