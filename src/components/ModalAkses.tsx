import React from 'react';
import Link from 'next/link';

interface ModalAksesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAkses({ isOpen, onClose }: ModalAksesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1B18]/75 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in">
      <div className="bg-white border border-[#D3C5B1] rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-transform duration-300 relative text-center mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#4E4639] hover:text-[#1C1B18] transition text-2xl focus:outline-none"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#1C1B18] tracking-tight">Pilih Akses Masuk Portal</h3>
          <p className="text-xs text-[#4E4639] mt-1">Silakan pilih peran akun Anda untuk disesuaikan menuju gerbang login.</p>
        </div>

        {/* Roles Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/login-masyarakat"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-6 bg-[#F6F3EC] hover:bg-white border border-[#D3C5B1] hover:border-[#001360] rounded-xl transition group text-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#001360]/10 text-[#001360] flex items-center justify-center text-xl mb-3.5 group-hover:bg-[#001360] group-hover:text-white transition shadow-sm">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h4 className="font-bold text-sm text-[#1C1B18]">Masyarakat / Pelapor</h4>
            <p className="text-[10px] text-[#4E4639] mt-1.5 leading-relaxed">Masuk untuk membuat laporan aduan baru atau melacak berkas aduan.</p>
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-6 bg-[#F6F3EC] hover:bg-white border border-[#D3C5B1] hover:border-[#001360] rounded-xl transition group text-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#001360]/10 text-[#001360] flex items-center justify-center text-xl mb-3.5 group-hover:bg-[#001360] group-hover:text-white transition shadow-sm">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <h4 className="font-bold text-sm text-[#1C1B18]">Admin / Petugas</h4>
            <p className="text-[10px] text-[#4E4639] mt-1.5 leading-relaxed">Portal khusus aparatur pemda untuk meninjau dan merespons aduan.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
