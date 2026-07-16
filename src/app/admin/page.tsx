'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

export default function AdminDashboard() {
  const { laporan, loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('Memuat tanggal...');

  // Running Live Clock
  useEffect(() => {
    const updateTime = () => {
      const sekarang = new Date();
      const formatTanggal = sekarang.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const jam = String(sekarang.getHours()).padStart(2, '0');
      const menit = String(sekarang.getMinutes()).padStart(2, '0');
      const detik = String(sekarang.getSeconds()).padStart(2, '0');
      setCurrentDate(`${formatTanggal} - ${jam}:${menit}:${detik} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const total = laporan.length;
  const baru = laporan.filter(l => l.status === 'baru').length;
  const proses = laporan.filter(l => l.status === 'proses').length;
  const selesai = laporan.filter(l => l.status === 'selesai').length;

  // Filter & Search Laporan
  const filteredLaporan = laporan.filter(l => {
    const query = searchQuery.toLowerCase();
    return (
      l.id.toLowerCase().includes(query) ||
      l.pelapor.toLowerCase().includes(query) ||
      l.kategoriLabel.toLowerCase().includes(query) ||
      l.lokasi.toLowerCase().includes(query)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'baru':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'proses':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'selesai':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'baru':
        return 'bg-red-500';
      case 'proses':
        return 'bg-amber-500 animate-pulse';
      case 'selesai':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'baru':
        return 'Baru Masuk';
      case 'proses':
        return 'Diproses';
      case 'selesai':
        return 'Selesai';
      default:
        return 'Laporan';
    }
  };

  return (
    <AuthGuard allowedRoles={['Administrator', 'Petugas', 'Petugas PUPR']}>
      <div className="min-h-screen page-shell">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen max-w-[1440px]">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Beranda Dashboard</h1>
                <p className="text-xs text-slate-500 font-mono">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center w-full sm:w-auto gap-4">
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari laporan..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full text-xs text-slate-800"
                />
              </div>
            </div>
          </header>

          {/* Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1: Total */}
            <div className="legacy-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Laporan</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{total}</h3>
              </div>
            </div>

            {/* Card 2: Baru */}
            <div className="legacy-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Menunggu Verifikasi</p>
                <h3 className="text-2xl font-extrabold text-red-600">{baru}</h3>
              </div>
            </div>

            {/* Card 3: Proses */}
            <div className="legacy-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sedang Diproses</p>
                <h3 className="text-2xl font-extrabold text-amber-500">{proses}</h3>
              </div>
            </div>

            {/* Card 4: Selesai */}
            <div className="legacy-card p-6 rounded-xl flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Laporan Selesai</p>
                <h3 className="text-2xl font-extrabold text-emerald-600">{selesai}</h3>
              </div>
            </div>
          </section>

          {/* Recent Activity Table */}
          <section className="legacy-card rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
              <h3 className="font-bold text-slate-800 text-base">Aduan Infrastruktur Terbaru</h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar laporan aduan masuk yang memerlukan tindakan disposisi atau perbaikan.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold">Pelapor / Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Kategori Kerusakan</th>
                    <th className="px-6 py-4 font-semibold">Lokasi</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-bold text-slate-500">Menghubungkan ke server database...</td>
                    </tr>
                  ) : filteredLaporan.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-500">Tidak ada laporan aduan yang cocok dengan pencarian Anda.</td>
                    </tr>
                  ) : (
                    filteredLaporan.slice(0, 10).map(aduan => (
                      <tr key={aduan.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">{aduan.pelapor}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">#{aduan.id} • {aduan.waktu}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{aduan.kategoriLabel}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium max-w-[200px] truncate" title={aduan.lokasi}>{aduan.lokasi}</td>
                        <td className="px-6 py-4">
                          <span className={"inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold border uppercase tracking-wider " + getStatusBadgeClass(aduan.status)}>
                            <span className={"w-1.5 h-1.5 rounded-full " + getStatusDotClass(aduan.status)}></span>
                            {getStatusText(aduan.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/detail-laporan?id=${aduan.id}`}
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            Tinjau Laporan <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
