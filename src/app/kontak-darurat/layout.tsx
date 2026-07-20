import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Direktori Kontak Darurat Indonesia',
  description: 'Nomor telepon dan kontak darurat resmi kepolisian, ambulans, pemadam kebakaran, BPBD, PLN, dan PDAM di 38 provinsi Indonesia.',
  openGraph: {
    title: 'Direktori Kontak Darurat Indonesia | SIGAP',
    description: 'Nomor telepon dan kontak darurat resmi kepolisian, ambulans, pemadam kebakaran, BPBD, PLN, dan PDAM di 38 provinsi Indonesia.',
    url: 'https://sigap-liard.vercel.app/kontak-darurat',
    siteName: 'SIGAP',
    images: [{ url: '/assets/images/sigap.png' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Direktori Kontak Darurat Indonesia | SIGAP',
    description: 'Nomor telepon dan kontak darurat resmi kepolisian, ambulans, pemadam kebakaran, BPBD, PLN, dan PDAM di 38 provinsi Indonesia.',
    images: ['/assets/images/sigap.png'],
  },
};

export default function KontakDaruratLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
