'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

const MapDetailView = dynamic(() => import('@/components/MapDetailView'), { ssr: false });

function DetailContent({ reportId }: { reportId: string }) {
  const { laporan, updateStatusLaporan } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const aduan = laporan.find(l => l.id === reportId);

  // Form States
  const [status, setStatus] = useState<'baru' | 'proses' | 'selesai'>(aduan?.status || 'baru');
  const [dinas, setDinas] = useState(aduan?.dinas || '');
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!aduan) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-5xl text-red-500 mb-3 animate-bounce">error</span>
        <h2 className="text-lg font-semibold text-slate-800">Laporan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Nomor laporan aduan yang Anda cari tidak terdaftar atau telah dihapus.</p>
        <Link href="/admin/laporan" className="bg-primary text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-sm hover:bg-primary/95 active:scale-95 transition-all">
          Kembali ke Manajemen Laporan
        </Link>
      </div>
    );
  }

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
        return 'Sedang Diproses';
      case 'selesai':
        return 'Selesai Diperbaiki';
      default:
        return 'Laporan Umum';
    }
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'Rendah':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Sedang':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Tinggi':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateStatusLaporan(aduan.id, status, dinas, catatan);
      alert('Status laporan aduan berhasil diperbarui!');
      setCatatan('');
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui status aduan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['Administrator', 'Petugas', 'Petugas PUPR']}>
      <div className="min-h-screen page-shell">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen">
          {/* Header */}
          <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-12">
            <div>
              <nav className="flex items-center gap-2 text-slate-500 mb-4">
                <Link className="text-[10px] font-bold uppercase tracking-wider hover:underline" href="/admin/laporan">Manajemen Laporan</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Detail Laporan</span>
              </nav>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 font-bold text-lg">#{aduan.id}</span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{aduan.kategoriLabel}</h1>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-3 font-semibold">
                <span>Pelapor: {aduan.pelapor}</span>
                <span>•</span>
                <span>Status: {aduan.waktu}</span>
              </p>
            </div>
            <div>
              <span className={"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border uppercase tracking-wider " + getStatusBadgeClass(aduan.status)}>
                <span className={"w-1.5 h-1.5 rounded-full " + getStatusDotClass(aduan.status)}></span>
                {getStatusText(aduan.status)}
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Report Details & Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Visual Proof Section */}
              <section className="page-card rounded-2xl overflow-hidden bg-white border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Bukti Visual Kerusakan</h2>
                  <span className={"text-[10px] px-3 py-1 rounded-full font-semibold border uppercase tracking-wider " + getUrgencyClass(aduan.urgensi)}>
                    Urgensi: {aduan.urgensi}
                  </span>
                </div>
                <div className="aspect-video relative bg-slate-50 flex items-center justify-center">
                  <img
                    src={aduan.foto}
                    alt="Foto Laporan"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/kategori_jalan.jpg';
                    }}
                  />
                </div>
              </section>

              {/* Information Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Deskripsi Kerusakan Warga</h3>
                  <p className="text-xs sm:text-sm text-slate-655 text-slate-600 leading-relaxed whitespace-pre-line">{aduan.deskripsi}</p>
                </div>

                {/* Status Action Form */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">settings_suggest</span> Pembaruan Status &amp; Validasi
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status Laporan</label>
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value as 'baru' | 'proses' | 'selesai')}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-slate-800 font-semibold"
                      >
                        <option value="baru">Baru Masuk</option>
                        <option value="proses">Validasikan &amp; Proses Perbaikan</option>
                        <option value="selesai">Tandai Selesai Diperbaiki</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Disposisi Instansi</label>
                      <select
                        value={dinas}
                        onChange={e => setDinas(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-slate-800 font-semibold"
                      >
                        <option value="">Pilih Dinas Terkait</option>
                        <option value="Dinas PUPR">Dinas PUPR (Pekerjaan Umum)</option>
                        <option value="Dinas Perhubungan">Dinas Perhubungan</option>
                        <option value="Dinas Lingkungan Hidup">Dinas Lingkungan Hidup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Intervensi Teknis</label>
                      <textarea
                        required
                        rows={3}
                        value={catatan}
                        onChange={e => setCatatan(e.target.value)}
                        placeholder="Masukkan instruksi penanganan..."
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-slate-800 font-normal resize-none"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 px-5 rounded-lg text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">save</span> Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </div>

            {/* Right Column: Location & Logs */}
            <div className="lg:col-span-4 space-y-6">
              {/* Location */}
              <section className="page-card p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Lokasi Titik Aduan</h3>
                
                <MapDetailView lat={aduan.lat} lng={aduan.lng} kategori={aduan.kategori} />
                
                <div className="text-[11px] space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500 font-medium shrink-0">Alamat:</span>
                    <span className="text-slate-800 font-semibold text-right">{aduan.lokasi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Wilayah:</span>
                    <span className="text-slate-800 font-semibold text-right">{aduan.wilayah}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium"> GPS Akurasi:</span>
                    <span className="text-emerald-600 font-bold text-right flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span> Tinggi
                    </span>
                  </div>
                </div>
              </section>

              {/* Timeline Logs */}
              <section className="page-card p-6 rounded-2xl bg-white border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-6">Log Alur Riwayat</h3>
                <div className="relative pl-4 border-l-2 border-slate-200 ml-2 space-y-6">
                  {aduan.logs.map((log, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Bullet */}
                      <span className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-primary shadow-sm"></span>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-xs">{log.judul}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{log.aktor} • {log.waktu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function DetailLaporanWrapper() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id') || '';
  return <DetailContent key={reportId} reportId={reportId} />;
}

export default function DetailLaporanAdmin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DetailLaporanWrapper />
    </Suspense>
  );
}
export const dynamicType = 'force-dynamic';
