import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progres & Pembenahan Infrastruktur',
  description: 'Pantau transparansi dan hasil kerja nyata perbaikan jalan, penerangan, drainase, dan jembatan oleh dinas teknis daerah.',
  openGraph: {
    title: 'Progres & Pembenahan Infrastruktur | SIGAP',
    description: 'Pantau transparansi dan hasil kerja nyata perbaikan jalan, penerangan, drainase, dan jembatan oleh dinas teknis daerah.',
    url: 'https://sigap-liard.vercel.app/progress',
    siteName: 'SIGAP',
    images: [{ url: '/assets/images/sigap.png' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progres & Pembenahan Infrastruktur | SIGAP',
    description: 'Pantau transparansi dan hasil kerja nyata perbaikan jalan, penerangan, drainase, dan jembatan oleh dinas teknis daerah.',
    images: ['/assets/images/sigap.png'],
  },
};

export default function ProgressLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
