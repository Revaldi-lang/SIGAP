'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

const MapImpactView = dynamic(() => import('@/components/MapImpactView'), { ssr: false });

export default function PetaPelapor() {
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
    <AuthGuard allowedRoles={['Masyarakat']}>
      <div className="min-h-screen page-shell flex flex-col">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="flex items-center gap-3 mb-6 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-xl flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-0.5">Peta Sebaran Laporan Warga</h1>
              <p className="text-sm text-[#807667]">Lihat sebaran spasial lokasi aduan infrastruktur dari masyarakat luas secara real-time.</p>
            </div>
          </header>

          {/* Filter Map Panel */}
          <section className="page-card p-5 rounded-2xl mb-6 flex flex-wrap gap-6 items-center shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#807667]">Filter Status Laporan:</span>
            <div className="flex flex-wrap gap-5">
              {[
                { id: 'baru', label: 'Baru Masuk', colorClass: 'bg-[#ef4444]' },
                { id: 'proses', label: 'Sedang Diproses', colorClass: 'bg-[#f59e0b]' },
                { id: 'selesai', label: 'Selesai Perbaikan', colorClass: 'bg-[#22c55e]' }
              ].map(filter => (
                <label key={filter.id} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#1C1B18]">
                  <input
                    type="checkbox"
                    checked={statusFilters.includes(filter.id)}
                    onChange={() => handleFilterChange(filter.id)}
                    className="rounded border-[#D3C5B1] text-[#001360] focus:ring-[#001360]/20 h-4 w-4 cursor-pointer animate-pulse-none"
                  />
                  <span className="inline-flex items-center gap-1.5 ml-1">
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
              detailUrlPrefix="/detail-laporan-pelapor"
            />
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
