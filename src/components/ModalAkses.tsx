import React from 'react';
import Link from 'next/link';

interface ModalAksesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAkses({ isOpen, onClose }: ModalAksesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0c0f12]/75 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in">
      <div className="bg-white border border-[#e4e2dc] rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 transform transition-transform duration-300 relative text-center mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5c6268] hover:text-[#0f172a] transition text-2xl focus:outline-none"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">Pilih Akses Masuk Portal</h3>
          <p className="text-xs text-[#5c6268] mt-1">Silakan pilih peran akun Anda untuk disesuaikan menuju gerbang login.</p>
        </div>

        {/* Roles Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/login-masyarakat"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-6 bg-[#f6f5f2] hover:bg-white border border-[#e4e2dc] hover:border-[#0c0f12] rounded-xl transition group text-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0c0f12]/10 text-[#0c0f12] flex items-center justify-center text-xl mb-3.5 group-hover:bg-[#0c0f12] group-hover:text-white transition shadow-sm">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h4 className="font-bold text-sm text-[#0f172a]">Masyarakat / Pelapor</h4>
            <p className="text-[10px] text-[#5c6268] mt-1.5 leading-relaxed">Masuk untuk membuat laporan aduan baru atau melacak berkas aduan.</p>
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-6 bg-[#f6f5f2] hover:bg-white border border-[#e4e2dc] hover:border-[#0c0f12] rounded-xl transition group text-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0c0f12]/10 text-[#0c0f12] flex items-center justify-center text-xl mb-3.5 group-hover:bg-[#0c0f12] group-hover:text-white transition shadow-sm">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <h4 className="font-bold text-sm text-[#0f172a]">Admin / Petugas</h4>
            <p className="text-[10px] text-[#5c6268] mt-1.5 leading-relaxed">Portal khusus aparatur pemda untuk meninjau dan merespons aduan.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
