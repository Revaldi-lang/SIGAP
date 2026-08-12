import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-16 w-full mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
        <div className="md:col-span-6 space-y-4">
          <Link href="/" className="flex items-center gap-3 min-h-[44px] w-max">
            <div className="bg-white/10 p-2 border border-white/10 rounded-md flex items-center justify-center w-11 h-11 shrink-0">
              <img alt="SIGAP Logo" className="h-7 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-display font-bold text-white text-2xl tracking-tight uppercase">SIGAP</span>
          </Link>
          <p className="text-xs text-white/70 leading-relaxed max-w-md">
            Sistem Informasi Gerak Aduan Publik — layanan pelaporan dan pengaduan kerusakan
            infrastruktur yang terintegrasi langsung dengan instansi teknis pemerintah daerah,
            untuk pelayanan publik yang transparan.
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-accent-bright">Navigasi</h5>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li><Link className="hover:text-accent-bright hover:underline decoration-2 underline-offset-4 transition-colors font-semibold uppercase" href="/#info-section">Kegunaan</Link></li>
            <li><Link className="hover:text-accent-bright hover:underline decoration-2 underline-offset-4 transition-colors font-semibold uppercase" href="/#alur-section">Cara Melapor</Link></li>
            <li><Link className="hover:text-accent-bright hover:underline decoration-2 underline-offset-4 transition-colors font-semibold uppercase" href="/#proses-section">SOP Kerja</Link></li>
            <li><Link className="hover:text-accent-bright hover:underline decoration-2 underline-offset-4 transition-colors font-semibold uppercase" href="/#suara-warga-section">Suara Warga</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-accent-bright">Hubungi Bantuan</h5>
          <ul className="space-y-2.5 text-xs text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-accent-bright shrink-0" aria-hidden="true" />
              <span>Pusat Layanan SIGAP Nasional, DKI Jakarta, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-accent-bright shrink-0" aria-hidden="true" />
              <span>Hotline 112 (Bebas Pulsa)</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-accent-bright shrink-0" aria-hidden="true" />
              <span>support@sigap.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-8 text-center text-xs text-white/50">
        <p>Copyright &copy; 2026 SIGAP Indonesia. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
