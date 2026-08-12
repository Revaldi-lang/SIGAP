'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

const MapImpactView = dynamic(() => import('@/components/MapImpactView'), { ssr: false });

export default function AdminPetaSebaran() {
  const { laporan } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<string[]>(['baru', 'proses', 'selesai']);

  const handleFilterChange = (status: string) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  return (
    <AuthGuard allowedRoles={['Administrator', 'Petugas', 'Petugas PUPR']}>
      <div className="min-h-screen page-shell flex flex-col">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen flex flex-col">
          {/* Header */}
          <header className="flex items-center gap-3 mb-6 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#0c0f12] hover:bg-[#0c0f12]/5 rounded-lg flex items-center justify-center mr-2 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0c0f12] mb-1">Peta Spasial Dampak Kerusakan</h1>
              <p className="text-xs text-[#5c6268]">Halaman pemantauan visual geografis titik kerusakan infrastruktur wilayah secara real-time.</p>
            </div>
          </header>

          {/* Filter Map Panel */}
          <section className="page-card p-4 rounded-xl mb-6 flex flex-wrap gap-6 items-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6268]">Filter Status:</span>
            <div className="flex flex-wrap gap-5">
              {[
                { id: 'baru', label: 'Baru Masuk', colorClass: 'bg-[#ef4444]' },
                { id: 'proses', label: 'Sedang Diproses', colorClass: 'bg-[#f59e0b]' },
                { id: 'selesai', label: 'Selesai Perbaikan', colorClass: 'bg-[#22c55e]' }
              ].map(filter => (
                <label key={filter.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0f172a]">
                  <input
                    type="checkbox"
                    checked={statusFilters.includes(filter.id)}
                    onChange={() => handleFilterChange(filter.id)}
                    className="rounded border-[#e4e2dc] text-[#0c0f12] focus:ring-accent h-4 w-4"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${filter.colorClass}`}></span>
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Interactive Map Container */}
          <section className="flex-grow page-card rounded-2xl overflow-hidden relative min-h-[480px] flex flex-col">
            <MapImpactView
              laporan={laporan}
              statusFilters={statusFilters}
              detailUrlPrefix="/admin/detail-laporan"
            />
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
