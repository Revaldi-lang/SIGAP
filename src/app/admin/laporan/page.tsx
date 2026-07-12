'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

export default function AdminLaporanManajemen() {
  const { laporan, loading, hapusLaporan } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedKategori('semua');
    setSelectedStatus('semua');
  };

  // Filter Logic
  const filteredLaporan = laporan.filter(l => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      l.id.toLowerCase().includes(query) ||
      l.pelapor.toLowerCase().includes(query) ||
      l.kategoriLabel.toLowerCase().includes(query) ||
      l.lokasi.toLowerCase().includes(query);

    // 2. Kategori Filter
    const matchesKategori = selectedKategori === 'semua' || l.kategori === selectedKategori;

    // 3. Status Filter
    const matchesStatus = selectedStatus === 'semua' || l.status === selectedStatus;

    return matchesSearch && matchesKategori && matchesStatus;
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
                className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-lg flex items-center justify-center shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-1">Manajemen Laporan</h1>
                <p className="text-xs text-[#4E4639]">Kelola, verifikasi, dan tindak lanjuti aduan infrastruktur dari masyarakat.</p>
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <span className="text-xs bg-[#001360]/10 text-[#001360] px-4 py-2 rounded-full font-bold border border-[#001360]/10 uppercase tracking-wider">
                {filteredLaporan.length} Laporan Ditemukan
              </span>
            </div>
          </header>

          {/* Search & Filter Card */}
          <section className="legacy-card p-6 rounded-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-[9px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Cari Laporan</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari pelapor, lokasi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[9px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Kategori</label>
                <select
                  value={selectedKategori}
                  onChange={e => setSelectedKategori(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="jalan">Jalan Berlubang / Rusak</option>
                  <option value="fasilitas">Fasilitas Sosial / Taman</option>
                  <option value="penerangan">Penerangan Jalan</option>
                  <option value="drainase">Saluran Air / Drainase rusak</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[9px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                >
                  <option value="semua">Semua Status</option>
                  <option value="baru">Baru Masuk</option>
                  <option value="proses">Sedang Diproses</option>
                  <option value="selesai">Selesai Diperbaiki</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-[#F6F3EC] border border-[#D3C5B1] hover:bg-[#FEFDF8] text-[#1C1B18] font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span> Reset Filter
                </button>
              </div>
            </div>
          </section>

          {/* Reports Table Container */}
          <section className="legacy-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F3EC] text-[10px] font-bold uppercase tracking-wider text-[#4E4639] border-b border-[#D3C5B1]/50">
                    <th className="px-6 py-4">Pelapor / Tanggal</th>
                    <th className="px-6 py-4">Kategori Kerusakan</th>
                    <th className="px-6 py-4">Lokasi</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3C5B1]/30 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-bold text-[#4E4639]">Menghubungkan ke database...</td>
                    </tr>
                  ) : filteredLaporan.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-[#4E4639]">Tidak ada laporan aduan yang cocok.</td>
                    </tr>
                  ) : (
                    filteredLaporan.map(aduan => (
                      <tr key={aduan.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1C1B18]">{aduan.pelapor}</p>
                          <p className="text-[10px] text-[#807667] mt-0.5 font-mono">#{aduan.id} • {aduan.waktu}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#001360]">{aduan.kategoriLabel}</td>
                        <td className="px-6 py-4 text-[#4E4639] font-medium max-w-[240px] truncate" title={aduan.lokasi}>{aduan.lokasi}</td>
                        <td className="px-6 py-4">
                          <span className={"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider " + getStatusBadgeClass(aduan.status)}>
                            <span className={"w-1.5 h-1.5 rounded-full " + getStatusDotClass(aduan.status)}></span>
                            {getStatusText(aduan.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/detail-laporan?id=${aduan.id}`}
                            className="bg-white hover:bg-[#001360] text-[#001360] hover:text-white border border-[#D3C5B1] hover:border-[#001360] px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            Tinjau Laporan <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
                          </Link>
                          {aduan.status === 'selesai' && (
                            <button
                              onClick={() => {
                                if (confirm('Apakah Anda yakin ingin menghapus laporan aduan ini secara permanen dari database?')) {
                                  hapusLaporan(aduan.id);
                                }
                              }}
                              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 p-2 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center justify-center cursor-pointer active:scale-95"
                              title="Hapus Laporan Selesai"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          )}
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
