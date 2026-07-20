import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Warga & Pelapor',
  description: 'Masuk ke portal warga SIGAP untuk menyampaikan laporan kerusakan infrastruktur dan melacak status aduan.',
  openGraph: {
    title: 'Portal Warga & Pelapor | SIGAP',
    description: 'Masuk ke portal warga SIGAP untuk menyampaikan laporan kerusakan infrastruktur dan melacak status aduan.',
    url: 'https://sigap-liard.vercel.app/login-masyarakat',
    siteName: 'SIGAP',
    images: [{ url: '/assets/images/sigap.png' }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Warga & Pelapor | SIGAP',
    description: 'Masuk ke portal warga SIGAP untuk menyampaikan laporan kerusakan infrastruktur dan melacak status aduan.',
    images: ['/assets/images/sigap.png'],
  },
};

export default function LoginMasyarakatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
