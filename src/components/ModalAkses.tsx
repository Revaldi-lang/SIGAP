import React from 'react';
import Link from 'next/link';

interface ModalAksesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAkses({ isOpen, onClose }: ModalAksesProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E1B18]/70 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in p-4">
      <div className="bg-white border border-[#E5E2E1] rounded-2xl shadow-[0_16px_48px_rgba(0,19,96,0.16)] w-full max-w-lg p-7 sm:p-9 relative text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#807667] hover:text-[#1C1B18] transition w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F6F3EC]"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#001360]/10 border border-[#001360]/15 flex items-center justify-center mx-auto mb-4">
            <img src="/assets/images/sigap.png" alt="SIGAP" className="h-7 w-auto object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#1C1B18] tracking-tight">Pilih Akses Masuk Portal</h3>
          <p className="text-sm text-[#807667] mt-1.5 leading-relaxed">Silakan pilih peran akun Anda untuk disesuaikan menuju gerbang login.</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/login-masyarakat"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-7 bg-[#F6F3EC] hover:bg-white border border-[#E5E2E1] hover:border-[#001360]/30 rounded-2xl transition-all duration-200 group text-center hover:shadow-[0_4px_20px_rgba(0,19,96,0.10)] hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-[#001360]/10 text-[#001360] flex items-center justify-center mb-4 group-hover:bg-[#001360] group-hover:text-white transition-all duration-200 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            </div>
            <h4 className="font-bold text-sm text-[#1C1B18]">Masyarakat / Pelapor</h4>
            <p className="text-xs text-[#807667] mt-2 leading-relaxed">Masuk untuk membuat laporan aduan baru atau melacak berkas aduan.</p>
          </Link>

          <Link
            href="/login"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-7 bg-[#F6F3EC] hover:bg-white border border-[#E5E2E1] hover:border-[#001360]/30 rounded-2xl transition-all duration-200 group text-center hover:shadow-[0_4px_20px_rgba(0,19,96,0.10)] hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-[#001360]/10 text-[#001360] flex items-center justify-center mb-4 group-hover:bg-[#001360] group-hover:text-white transition-all duration-200 shadow-sm">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <h4 className="font-bold text-sm text-[#1C1B18]">Admin / Petugas</h4>
            <p className="text-xs text-[#807667] mt-2 leading-relaxed">Portal khusus aparatur pemda untuk meninjau dan merespons aduan.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
