import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#FCF9F8] border-t border-[#E5E1DA] py-8 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#4E4639]">
        <div className="flex items-center gap-3">
          <img alt="SIGAP Logo" className="h-5 w-auto object-contain opacity-60" src="/assets/images/sigap.png" />
          <p>© 2026 SIGAP - Sistem Informasi Gerak Aduan Publik. Hak Cipta Dilindungi.</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Kebijakan Privasi</a>
          <a href="#" className="hover:underline">Syarat & Ketentuan</a>
          <a href="#" className="hover:underline">Pemerintah Kota Malang</a>
        </div>
      </div>
    </footer>
  );
}
