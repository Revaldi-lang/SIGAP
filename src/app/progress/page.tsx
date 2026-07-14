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
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
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
      ? 'bg-emerald-100 text-emerald-700 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
      : 'bg-amber-100 text-amber-700 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
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
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
            Beranda
          </Link>
          <span className="mx-2 text-xs font-bold text-on-surface-variant">/</span>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">Progres Pembenahan</span>
        </div>

        {/* Heading Section */}
        <header className="mb-12">
          <span className="inline-block bg-primary text-on-primary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-1 font-bold text-xs uppercase tracking-wider mb-4 w-fit">
            Pantau Hasil Kerja Dinas
          </span>
          <h1 className="font-black text-3xl sm:text-5xl uppercase mb-6 leading-[0.9] text-primary tracking-tight font-display">
            Progres & Pembenahan <span className="text-white bg-secondary px-2 border-4 border-black block sm:inline-block mt-2 sm:mt-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Fasilitas Publik</span>
          </h1>
          <p className="font-medium text-sm md:text-base max-w-2xl text-on-surface-variant leading-relaxed">
            Halaman ini memuat transparansi aksi nyata perbaikan infrastruktur di seluruh wilayah kota. Setiap laporan yang tuntas atau sedang dikerjakan dapat Anda pantau progres fisiknya di bawah ini.
          </p>
        </header>

        {/* Search & Filter bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch font-space">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari berita pembenahan jalan, pipa, jembatan..."
              className="pl-10 pr-4 py-3 bg-white border-2 border-black rounded-none outline-none w-full text-xs text-[#1C1B18] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 border-2 border-black text-xs font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="border-4 border-black p-12 text-center bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-5xl text-primary mb-4">folder_open</span>
            <h3 className="font-black text-lg uppercase mb-2">Berita Tidak Ditemukan</h3>
            <p className="text-xs text-on-surface-variant font-semibold">Silakan coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredNews.map(news => (
              <article 
                key={news.id}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              >
                {/* Image header */}
                <div className="w-full aspect-[16/9] border-b-4 border-black relative overflow-hidden bg-slate-50">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-secondary text-white text-[10px] font-black border-2 border-black px-2.5 py-1 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider">
                      {news.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-none text-[10px] font-black border-2 uppercase tracking-wider ` + getStatusBadgeClass(news.status)}>
                      {news.status}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-on-surface-variant opacity-75 uppercase tracking-wider mb-2 font-space">
                      {news.date} • Dipantau oleh: {news.officer}
                    </p>
                    <h3 className="font-black text-xl text-primary uppercase mb-4 leading-snug font-display">
                      {news.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-semibold leading-relaxed mb-6">
                      {news.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="border-t-2 border-black/10 pt-6">
                    <div className="flex justify-between items-center mb-2 font-space">
                      <span className="text-[10px] font-black uppercase tracking-wider">Progres Fisik Lapangan</span>
                      <span className="text-xs font-black text-primary">{news.progress}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 border-2 border-black rounded-none overflow-hidden">
                      <div 
                        className={`h-full border-r-2 border-black transition-all duration-500 ${
                          news.progress === 100 ? 'bg-emerald-400' : 'bg-secondary'
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
        <section className="mt-20 border-4 border-black p-8 md:p-12 bg-primary text-white text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-black text-2xl md:text-3xl uppercase mb-4 leading-none font-display">Ada Kerusakan Baru di Sekitar Anda?</h2>
          <p className="text-xs md:text-sm max-w-xl mx-auto opacity-80 font-semibold mb-8">
            Laporkan segera ke sistem SIGAP agar petugas dinas terkait dapat menjadwalkan peninjauan teknis dan aksi perbaikan.
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-space">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-secondary border-2 border-black text-white font-black px-8 py-4 text-xs uppercase shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
            >
              Mulai Buat Laporan
            </button>
            <Link
              href="/"
              className="bg-white border-2 border-black text-primary font-black px-8 py-4 text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
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
