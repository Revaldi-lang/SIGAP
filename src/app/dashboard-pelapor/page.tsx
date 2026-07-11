'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

export default function DashboardPelapor() {
  const { currentUser, laporan } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter reports to only show those filed by the active citizen
  const citizenName = currentUser?.username || 'Budi Santoso';
  const myReports = laporan.filter(
    l => l.pelapor.toLowerCase() === citizenName.toLowerCase()
  );

  const total = myReports.length;
  const baru = myReports.filter(l => l.status === 'baru').length;
  const proses = myReports.filter(l => l.status === 'proses').length;
  const selesai = myReports.filter(l => l.status === 'selesai').length;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'jalan':
        return {
          icon: 'road',
          wrapperClass: 'bg-blue-50 text-blue-600 border-blue-200',
        };
      case 'penerangan':
        return {
          icon: 'lightbulb',
          wrapperClass: 'bg-amber-50 text-amber-600 border-amber-200',
        };
      case 'drainase':
        return {
          icon: 'water',
          wrapperClass: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        };
      case 'fasilitas':
        return {
          icon: 'eco',
          wrapperClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        };
      default:
        return {
          icon: 'description',
          wrapperClass: 'bg-slate-50 text-slate-600 border-slate-200',
        };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'baru':
        return {
          label: 'Baru Masuk',
          badgeClass: 'bg-red-50 text-red-600 border-red-150',
          dotClass: 'bg-red-500',
        };
      case 'proses':
        return {
          label: 'Sedang Diproses',
          badgeClass: 'bg-amber-50 text-amber-600 border-amber-150',
          dotClass: 'bg-amber-500 animate-pulse',
        };
      case 'selesai':
        return {
          label: 'Selesai Diperbaiki',
          badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-150',
          dotClass: 'bg-emerald-500',
        };
      default:
        return {
          label: 'Laporan Umum',
          badgeClass: 'bg-slate-50 text-slate-600 border-slate-150',
          dotClass: 'bg-slate-500',
        };
    }
  };

  return (
    <AuthGuard allowedRoles={['Masyarakat']}>
      <div className="min-h-screen bg-[#FEFDF8]">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-16 min-h-screen">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-lg flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#001360]">
                  Selamat Datang, {currentUser?.username || 'Pak Budi'}
                </h1>
                <p className="text-xs text-[#4E4639] mt-0.5">
                  Pantau status laporan dan permohonan layanan publik Anda di sini.
                </p>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#001360] tracking-widest uppercase bg-[#001360]/10 px-3 py-1.5 rounded border border-[#001360]/10">
                {total} Aduan Aktif
              </span>
            </div>
          </header>

          {/* Status Bento Grid */}
          <div className="grid grid-cols-12 gap-6 mb-16">
            {/* Total Card */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#D3C5B1] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#4E4639] mb-2">Total Laporan</h2>
                <p className="text-4xl font-extrabold text-[#001360] font-display">{total}</p>
              </div>
            </div>

            {/* Split Stats */}
            <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4">
              <div className="bg-white border border-[#D3C5B1] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#4E4639] mb-1">Ditinjau</p>
                <p className="text-2xl font-bold text-[#001360]">{baru}</p>
                <span className="mt-2 inline-block h-1 w-6 bg-[#001360]/20 rounded-full"></span>
              </div>
              <div className="bg-white border border-[#D3C5B1] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#4E4639] mb-1">Diproses</p>
                <p className="text-2xl font-bold text-amber-500">{proses}</p>
                <span className="mt-2 inline-block h-1 w-6 bg-amber-500/20 rounded-full"></span>
              </div>
              <div className="bg-white border border-[#D3C5B1] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#4E4639] mb-1">Selesai</p>
                <p className="text-2xl font-bold text-emerald-600">{selesai}</p>
                <span className="mt-2 inline-block h-1 w-6 bg-emerald-600/20 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-[#001360]">Riwayat Laporan</h2>
              <p className="text-xs text-[#4E4639] mt-0.5">Daftar laporan aduan infrastruktur yang Anda ajukan.</p>
            </div>

            {/* List Container */}
            <div className="space-y-4">
              {myReports.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#D3C5B1] rounded-2xl bg-[#F6F3EC]/30">
                  <span className="material-symbols-outlined text-4xl text-[#807667] mb-2">folder_open</span>
                  <p className="text-sm font-bold text-[#1C1B18]">Belum Ada Aduan</p>
                  <p className="text-xs text-[#4E4639] mt-1 mb-4">Anda belum mengirimkan laporan aduan infrastruktur.</p>
                  <Link
                    href="/buat-laporan"
                    className="inline-flex items-center gap-1.5 bg-[#001360] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">add_circle</span> Buat Aduan Baru
                  </Link>
                </div>
              ) : (
                myReports.map(aduan => {
                  const cat = getCategoryStyles(aduan.kategori);
                  const stat = getStatusStyles(aduan.status);
                  return (
                    <div
                      key={aduan.id}
                      className="group bg-white hover:bg-slate-50 border border-[#D3C5B1] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3.5 rounded-xl border ${cat.wrapperClass} text-sm flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined">{cat.icon}</span>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-[#807667]">#{aduan.id}</span>
                            <span className="bg-[#001360]/10 text-[#001360] text-[9px] px-2 py-0.5 rounded-full font-bold border border-[#001360]/10 uppercase tracking-wider">
                              {aduan.kategoriLabel}
                            </span>
                            <span className="text-[#807667] text-[10px]"><span className="mx-1 text-[#D3C5B1]">|</span> {aduan.waktu}</span>
                          </div>
                          <h4 className="font-bold text-[#1C1B18] text-sm mt-1.5 leading-snug">{aduan.lokasi}</h4>
                          <p className="text-[#4E4639] text-xs mt-1 max-w-xl leading-relaxed">{aduan.deskripsi}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-[#D3C5B1]/30 pt-3 sm:pt-0 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 ${stat.badgeClass} px-3 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stat.dotClass}`}></span> {stat.label}
                        </span>
                        <Link
                          href={`/detail-laporan-pelapor?id=${aduan.id}`}
                          className="bg-[#FEFDF8] hover:bg-[#001360] text-[#001360] hover:text-white border border-[#D3C5B1] hover:border-[#001360] px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                        >
                          Tinjau Log <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
