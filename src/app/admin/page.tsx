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

  useEffect(() => {
    const updateTime = () => {
      const sekarang = new Date();
      const formatTanggal = sekarang.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const jam = String(sekarang.getHours()).padStart(2, '0');
      const menit = String(sekarang.getMinutes()).padStart(2, '0');
      const detik = String(sekarang.getSeconds()).padStart(2, '0');
      setCurrentDate(`${formatTanggal} — ${jam}:${menit}:${detik} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = laporan.length;
  const baru = laporan.filter(l => l.status === 'baru').length;
  const proses = laporan.filter(l => l.status === 'proses').length;
  const selesai = laporan.filter(l => l.status === 'selesai').length;

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
      case 'baru':    return 'bg-red-50 text-red-600 border-red-200';
      case 'proses':  return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'selesai': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default:        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'baru':    return 'bg-red-500';
      case 'proses':  return 'bg-amber-500 animate-pulse';
      case 'selesai': return 'bg-emerald-500';
      default:        return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'baru':    return 'Baru Masuk';
      case 'proses':  return 'Diproses';
      case 'selesai': return 'Selesai';
      default:        return 'Laporan';
    }
  };

  const statCards = [
    { label: 'Total Laporan', value: total, icon: 'analytics', color: 'bg-[#001360]/10 text-[#001360]', valueColor: 'text-[#1C1B18]' },
    { label: 'Menunggu Verifikasi', value: baru, icon: 'campaign', color: 'bg-red-50 text-red-600', valueColor: 'text-red-600' },
    { label: 'Sedang Diproses', value: proses, icon: 'pending_actions', color: 'bg-amber-50 text-amber-500', valueColor: 'text-amber-500' },
    { label: 'Laporan Selesai', value: selesai, icon: 'verified', color: 'bg-emerald-50 text-emerald-600', valueColor: 'text-emerald-600' },
  ];

  return (
    <AuthGuard allowedRoles={['Administrator', 'Petugas', 'Petugas PUPR']}>
      <div className="min-h-screen page-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        <main className="ml-0 md:ml-64 p-6 md:p-10 min-h-screen">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-xl flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-0.5">Beranda Dashboard</h1>
                <p className="text-xs text-[#807667] font-mono">{currentDate}</p>
              </div>
            </div>

            <div className="flex items-center w-full sm:w-auto gap-3">
              <div className="relative w-full sm:w-72">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari laporan..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none w-full text-sm text-[#1C1B18]"
                  style={{ minHeight: '44px' }}
                />
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {statCards.map(card => (
              <div key={card.label} className="legacy-card p-6 rounded-2xl flex flex-col gap-4 hover:shadow-[0_4px_20px_rgba(0,19,96,0.08)] transition-all duration-200">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#807667] mb-1">{card.label}</p>
                  <h3 className={`text-2xl font-extrabold ${card.valueColor}`}>{card.value}</h3>
                </div>
              </div>
            ))}
          </section>

          {/* Recent Table */}
          <section className="legacy-card rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E5E2E1] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#1C1B18] text-base">Aduan Infrastruktur Terbaru</h3>
                <p className="text-xs text-[#807667] mt-0.5">Daftar laporan aduan masuk yang memerlukan tindakan disposisi atau perbaikan.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F3EC] text-[10px] font-bold uppercase tracking-wider text-[#807667] border-b border-[#E5E2E1]">
                    <th className="px-6 py-4">Pelapor / Tanggal</th>
                    <th className="px-6 py-4">Kategori Kerusakan</th>
                    <th className="px-6 py-4">Lokasi</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2E1] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 font-medium text-[#807667]">Menghubungkan ke server database...</td>
                    </tr>
                  ) : filteredLaporan.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[#807667]">Tidak ada laporan aduan yang cocok dengan pencarian Anda.</td>
                    </tr>
                  ) : (
                    filteredLaporan.slice(0, 10).map(aduan => (
                      <tr key={aduan.id} className="hover:bg-[#F6F3EC] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#1C1B18]">{aduan.pelapor}</p>
                          <p className="text-[10px] text-[#807667] mt-0.5 font-mono">#{aduan.id} • {aduan.waktu}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#001360]">{aduan.kategoriLabel}</td>
                        <td className="px-6 py-4 text-[#4E4639] max-w-[200px] truncate" title={aduan.lokasi}>{aduan.lokasi}</td>
                        <td className="px-6 py-4">
                          <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ' + getStatusBadgeClass(aduan.status)}>
                            <span className={'w-1.5 h-1.5 rounded-full ' + getStatusDotClass(aduan.status)} />
                            {getStatusText(aduan.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admin/detail-laporan?id=${aduan.id}`}
                            className="bg-white hover:bg-[#001360] text-[#001360] hover:text-white border border-[#D3C5B1] hover:border-[#001360] px-4 py-2 rounded-[28px] text-xs font-semibold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            Tinjau <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
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
