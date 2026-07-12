import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E1B18] text-white pt-16 pb-8 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
        {/* Brand */}
        <div className="md:col-span-6 space-y-4">
          <Link href="/" className="flex items-center gap-3 min-h-[44px] w-max">
            <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center justify-center w-12 h-12 shrink-0">
              <img alt="SIGAP Logo" className="h-8 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-bold text-white text-lg">SIGAP</span>
          </Link>
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            SIGAP adalah platform Layanan Aspirasi &amp; Pengaduan Infrastruktur Daerah Nasional yang terintegrasi langsung dengan instansi teknis pemerintah daerah di seluruh Indonesia untuk pelayanan publik transparan.
          </p>
        </div>

        {/* Navigasi */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h5>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li><a className="hover:text-[#93BBFF] transition-colors duration-150" href="#info-section">Kegunaan</a></li>
            <li><a className="hover:text-[#93BBFF] transition-colors duration-150" href="#alur-section">Cara Melapor</a></li>
            <li><a className="hover:text-[#93BBFF] transition-colors duration-150" href="#proses-section">SOP Kerja</a></li>
            <li><a className="hover:text-[#93BBFF] transition-colors duration-150" href="#suara-warga-section">Suara Warga</a></li>
          </ul>
        </div>

        {/* Kontak */}
        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-white">Hubungi Bantuan</h5>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5 text-[#93BBFF]">location_on</span>
              <span>Pusat Layanan SIGAP Nasional, DKI Jakarta, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#93BBFF]">phone</span>
              <span>Hotline 112 (Bebas Pulsa)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#93BBFF]">mail</span>
              <span>support@sigap.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-8 text-center text-sm text-white/40">
        <p>Copyright &copy; 2026 SIGAP Indonesia. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
