import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t-border-width-main border-black pt-16 pb-8 px-6 md:px-16 w-full mt-auto shadow-[0_-4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b-2 border-white/10">
        <div className="md:col-span-6 space-y-4">
          <Link href="/" className="flex items-center gap-3 min-h-[44px] w-max">
            <div className="bg-white/10 p-2 border-2 border-white/20 flex items-center justify-center w-12 h-12 shrink-0 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)]">
              <img alt="SIGAP Logo" className="h-8 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-black text-white text-2xl tracking-tight uppercase">SIGAP</span>
          </Link>
          <p className="text-xs text-white/80 leading-relaxed max-w-md">
            SIGAP adalah platform Layanan Aspirasi &amp; Pengaduan Infrastruktur Daerah Nasional yang terintegrasi langsung dengan instansi teknis pemerintah daerah di seluruh Indonesia untuk pelayanan publik transparan.
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-secondary">Navigasi</h5>
          <ul className="space-y-2.5 text-xs text-white/85">
            <li><a className="hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-colors font-bold uppercase" href="#info-section">Kegunaan</a></li>
            <li><a className="hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-colors font-bold uppercase" href="#alur-section">Cara Melapor</a></li>
            <li><a className="hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-colors font-bold uppercase" href="#proses-section">SOP Kerja</a></li>
            <li><a className="hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-colors font-bold uppercase" href="#suara-warga-section">Suara Warga</a></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-secondary">Hubungi Bantuan</h5>
          <ul className="space-y-2.5 text-xs text-white/85">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5 text-secondary">location_on</span>
              <span>Pusat Layanan SIGAP Nasional, DKI Jakarta, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">phone</span>
              <span>Hotline 112 (Bebas Pulsa)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-secondary">mail</span>
              <span>support@sigap.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-8 text-center text-xs text-white/60">
        <p>Copyright &copy; 2026 SIGAP Indonesia. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}

