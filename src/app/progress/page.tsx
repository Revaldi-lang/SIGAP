'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModalAkses from '@/components/ModalAkses';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  progress: number;
  status: 'Selesai' | 'Diproses';
  image: string;
  description: string;
  officer: string;
}

export default function ProgressPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const newsData: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Penambalan Lubang Jalan Protokol A. Yani Tuntas 100%',
      category: 'Jalan',
      date: '14 Juli 2026',
      progress: 100,
      status: 'Selesai',
      image: '/assets/images/perbaikan_a_yani.png',
      description: 'Tim reaksi cepat dinas PUPR menyelesaikan pengaspalan dan penambalan 12 lubang besar di sepanjang jalur protokol Ahmad Yani dalam waktu 24 jam setelah aduan divalidasi.',
      officer: 'Dinas Pekerjaan Umum'
    },
    {
      id: 'news-2',
      title: 'Dinas PUPR Atasi Kebocoran Pipa Air Bersih Jalan Sudirman',
      category: 'Pipa Air',
      date: '13 Juli 2026',
      progress: 75,
      status: 'Diproses',
      image: '/assets/images/perbaikan_jalan.png',
      description: 'Petugas teknis sedang mengisolasi kebocoran saluran pipa distribusi air utama untuk mencegah genangan jalan lebih lanjut dan mengembalikan aliran air bersih bagi warga sekitar.',
      officer: 'Tim Teknis PDAM & PUPR'
    },
    {
      id: 'news-3',
      title: 'Pemasangan 24 Titik Lampu PJU Baru di Kawasan Pasar Induk',
      category: 'Penerangan',
      date: '11 Juli 2026',
      progress: 100,
      status: 'Selesai',
      image: '/assets/images/perbaikan_pju.jpg',
      description: 'Kawasan rawan kecelakaan di sekitar Pasar Induk kini telah terpasang penerangan jalan pintar hemat energi untuk meningkatkan keamanan aktivitas jual beli malam hari.',
      officer: 'Dinas Perhubungan'
    },
    {
      id: 'news-4',
      title: 'Pekerjaan Struktur Jembatan Penyeberangan Orang Terminal',
      category: 'Jembatan',
      date: '09 Juli 2026',
      progress: 40,
      status: 'Diproses',
      image: '/assets/images/perbaikan_jembatan.png',
      description: 'Pembenahan karat struktur baja dan penggantian alas pijakan kayu JPO Terminal Kota sedang berjalan. Konstruksi saat ini difokuskan pada pengelasan balok penopang utama.',
      officer: 'Dinas Tata Kota'
    }
  ];

  const categories = ['Semua', 'Jalan', 'Pipa Air', 'Penerangan', 'Jembatan'];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          news.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeClass = (status: 'Selesai' | 'Diproses') => {
    return status === 'Selesai' 
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : 'bg-amber-50 text-amber-600 border-amber-200';
  };

  return (
    <div className="min-h-screen page-shell flex flex-col pt-20 bg-background text-on-background">
      {/* Navbar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Access Modal */}
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow py-16 px-6 md:px-20 max-w-6xl mx-auto w-full">
        {/* Breadcrumbs */}
        <div className="mb-8 font-space">
          <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
            Beranda
          </Link>
          <span className="mx-2 text-xs font-bold text-slate-400">/</span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Progres Pembenahan</span>
        </div>

        {/* Heading Section */}
        <header className="mb-12">
          <span className="inline-block bg-primary/10 text-primary px-3 py-1.5 font-semibold text-xs rounded-full uppercase tracking-wider mb-4 w-fit">
            Pantau Hasil Kerja Dinas
          </span>
          <h1 className="font-bold text-3xl sm:text-5xl tracking-tight mb-6 text-slate-900">
            Progres & Pembenahan <span className="text-primary bg-primary/5 px-3 py-1 rounded-lg inline-block mt-2 sm:mt-0 font-medium">Fasilitas Publik</span>
          </h1>
          <p className="font-normal text-sm md:text-base max-w-2xl text-slate-500 leading-relaxed">
            Halaman ini memuat transparansi aksi nyata perbaikan infrastruktur di seluruh wilayah kota. Setiap laporan yang tuntas atau sedang dikerjakan dapat Anda pantau progres fisiknya di bawah ini.
          </p>
        </header>

        {/* Search & Filter bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch font-space">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm" aria-hidden="true">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari berita pembenahan jalan, pipa, jembatan..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full text-xs text-slate-800 shadow-sm transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="border border-slate-200 rounded-2xl p-12 text-center bg-white shadow-sm">
            <span className="material-symbols-outlined text-5xl text-primary mb-4" aria-hidden="true">folder_open</span>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Berita Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 font-normal">Silakan coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredNews.map(news => (
              <article 
                key={news.id}
                className="bg-white border border-slate-200/80 shadow-sm rounded-2xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-slate-200"
              >
                {/* Image header */}
                <div className="w-full aspect-[16/9] border-b border-slate-100 relative overflow-hidden bg-slate-50">
                  <img
                    src={news.image}
                    alt={news.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-white text-slate-800 text-[10px] font-semibold rounded-md border border-slate-200 px-2.5 py-1 uppercase shadow-sm tracking-wider">
                      {news.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider ` + getStatusBadgeClass(news.status)}>
                      {news.status}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-space">
                      {news.date} • Dipantau oleh: {news.officer}
                    </p>
                    <h3 className="font-bold text-xl text-slate-800 mb-3 leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed mb-6">
                      {news.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex justify-between items-center mb-2 font-space">
                      <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Progres Fisik Lapangan</span>
                      <span className="text-xs font-bold text-primary">{news.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          news.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${news.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA section */}
        <section className="mt-20 p-8 md:p-12 bg-primary rounded-3xl text-white text-center shadow-xl">
          <h2 className="font-bold text-2xl md:text-3xl mb-4 leading-none">Ada Kerusakan Baru di Sekitar Anda?</h2>
          <p className="text-xs md:text-sm max-w-xl mx-auto opacity-85 font-normal mb-8">
            Laporkan segera ke sistem SIGAP agar petugas dinas terkait dapat menjadwalkan peninjauan teknis dan aksi perbaikan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-space">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-primary font-semibold px-8 py-4 rounded-xl text-xs uppercase transition-all shadow-md hover:bg-slate-50 cursor-pointer active:scale-95"
            >
              Mulai Buat Laporan
            </button>
            <Link
              href="/"
              className="bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-xs uppercase transition-all cursor-pointer active:scale-95"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
