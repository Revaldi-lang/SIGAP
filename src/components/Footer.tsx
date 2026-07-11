import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E1B18] text-[#E6DFD5] pt-16 pb-8 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
        <div className="md:col-span-6 space-y-4">
          <Link href="/" className="flex items-center gap-3 min-h-[44px] w-max">
            <div className="bg-white/10 p-2 rounded-xl border border-white/10 flex items-center justify-center w-11 h-11 shrink-0">
              <img alt="SIGAP Logo" className="h-7 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-bold text-white text-lg">SIGAP</span>
          </Link>
          <p className="text-xs text-[#E6DFD5]/85 leading-relaxed max-w-md">
            SIGAP adalah platform Layanan Aspirasi &amp; Pengaduan Infrastruktur Daerah Nasional yang terintegrasi langsung dengan instansi teknis pemerintah daerah di seluruh Indonesia untuk pelayanan publik transparan.
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-white">Navigasi</h5>
          <ul className="space-y-2.5 text-xs text-[#E6DFD5]/80">
            <li><a className="hover:text-blue-400 transition-colors" href="#info-section">Kegunaan</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="#alur-section">Cara Melapor</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="#proses-section">SOP Kerja</a></li>
            <li><a className="hover:text-blue-400 transition-colors" href="#suara-warga-section">Suara Warga</a></li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h5 className="text-sm font-bold uppercase tracking-wider text-white">Hubungi Bantuan</h5>
          <ul className="space-y-2.5 text-xs text-[#E6DFD5]/80">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm mt-0.5 text-blue-400">location_on</span>
              <span>Pusat Layanan SIGAP Nasional, DKI Jakarta, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-blue-400">phone</span>
              <span>Hotline 112 (Bebas Pulsa)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-blue-400">mail</span>
              <span>support@sigap.go.id</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-8 text-center text-xs text-[#E6DFD5]/60">
        <p>Copyright &copy; 2026 SIGAP Indonesia. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
}
