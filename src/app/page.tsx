'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Map,
  Radar,
  ShieldCheck,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ModalAkses from '@/components/ModalAkses';
import { useApp } from '@/context/AppContext';

export default function LandingPage() {
  const { laporan, loading } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dynamic statistics from database with fallbacks
  const totalAduan = loading ? '15,642' : laporan.length.toLocaleString();
  const totalSelesai = loading ? '15,310' : laporan.filter(l => l.status === 'selesai').length.toLocaleString();

  const partnerLogos = [
    { src: '/assets/images/logo_dki.png', alt: 'Pemprov DKI Jakarta', className: 'h-16 w-36 object-contain' },
    { src: '/assets/images/logo_pupr.png', alt: 'Kementerian PUPR', className: 'h-16 w-16 object-contain' },
    { src: '/assets/images/logo_dishub.png', alt: 'Dinas Perhubungan', className: 'h-16 w-16 object-contain' },
    { src: '/assets/images/logo_dlh.png', alt: 'Dinas Lingkungan Hidup', className: 'h-16 w-16 object-contain' }
  ];

  const workOrder = [
    { n: '01', title: 'Lapor', desc: 'Unggah foto kerusakan dan sematkan lokasi di peta. Aduan masuk dan langsung mendapat nomor tiket.', chip: '± 3 menit' },
    { n: '02', title: 'Survei', desc: 'Dinas teknis memvalidasi kelayakan laporan dan men-disposisi ke unit penanganan yang tepat.', chip: '≤ 12 jam' },
    { n: '03', title: 'Kerjakan', desc: 'Tim lapangan PUPR, Dishub, dan DLH menjadwalkan serta mengerjakan perbaikan di lokasi.', chip: '24–48 jam' },
    { n: '04', title: 'Selesai', desc: 'Hasil perbaikan diverifikasi, ditayangkan, dan pelapor bisa memberi penilaian.', chip: 'transparan' }
  ];

  const services = [
    { icon: Radar, title: 'Pemantauan Aduan', desc: 'Pantau status tiketmu kapan saja, diterima, disurvei, dikerjakan, atau selesai.', href: '/dashboard-pelapor', cta: 'Buka dasbor pelapor' },
    { icon: Map, title: 'Peta Kerusakan Kota', desc: 'Kerusakan yang sudah dilaporkan tampil di peta terbuka, jadi seluruh warga ikut mengawasi.', href: '/peta-pelapor', cta: 'Lihat peta kota' },
    { icon: CheckCircle2, title: 'Akuntabilitas Publik', desc: 'Setiap tiket tayang dengan siapa yang menangani dan kapan dinyatakan selesai.', href: '/progress', cta: 'Cek akuntabilitas' }
  ];

  return (
    <div className="min-h-screen page-shell flex flex-col pt-20 bg-background text-on-background">
      {/* Navbar */}
      <Navbar onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* Access Selector Modal */}
      <ModalAkses isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <main className="flex-grow">
        {/* ============ HERO — real repair photo, asphalt drench ============ */}
        <section className="relative min-h-[720px] flex items-center overflow-hidden bg-primary border-b border-white/5">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/images/perbaikan_jalan.png"
              alt="Petugas memperbaiki jalan di Jakarta setelah aduan warga diproses"
              className="w-full h-full object-cover opacity-45 animate-slow-zoom"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/80 to-primary/30"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-transparent to-primary/40"></div>

          <div className="relative z-20 w-full px-6 md:px-20 max-w-[1280px] mx-auto py-28">
            <div className="max-w-3xl animate-fade-in">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300 mb-8">
                Portal Aduan Publik DKI Jakarta
              </p>
              <h1 className="font-display font-bold text-[42px] sm:text-6xl md:text-7xl leading-[1.02] tracking-tight text-white [font-stretch:110%] mb-8">
                Setiap kerusakan kota
                <br />
                <span className="text-accent-bright">punya nomor tiket.</span>
              </h1>
              <p className="font-normal text-base md:text-lg max-w-xl mb-10 text-slate-300 leading-relaxed">
                Lapor jalan, lampu, dan drainase yang rusak dengan foto dan lokasi.
                Aduan diteruskan ke dinas teknis dan kamu bisa pantau sampai tuntas.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="group inline-flex items-center gap-2.5 bg-accent text-white hover:bg-accent-strong px-7 py-4 rounded-md font-semibold text-sm transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-accent/20"
                >
                  Mulai Lapor
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
                <Link
                  href="/progress"
                  className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 px-7 py-4 rounded-md font-semibold text-sm transition-all"
                >
                  Lihat progres aduan
                </Link>
              </div>

              {/* Signature: live work-order strip with real SPM times */}
              <div className="mt-16 hidden sm:grid grid-cols-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden">
                {workOrder.map((step, i) => (
                  <div key={step.n} className="relative px-5 py-4">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="font-display text-lg font-bold text-accent-bright">{step.n}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wide">{step.chip}</p>
                    {i < workOrder.length - 1 && (
                      <ArrowRight
                        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 text-white/25 bg-transparent"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ PARTNER LOGOS MARQUEE ============ */}
        <section className="py-10 bg-white border-b border-outline overflow-hidden">
          <p className="max-w-6xl mx-auto px-6 mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
            Dioperasikan bersama instansi penyelenggara &amp; teknis
          </p>
          <div className="relative w-full overflow-hidden flex items-center">
            <div className="animate-marquee flex items-center">
              {[0, 1, 2, 3].map((setIdx) => (
                <div key={`set-${setIdx}`} className="flex items-center gap-12 md:gap-20 shrink-0 px-6 md:px-10" aria-hidden={setIdx > 0}>
                  {partnerLogos.map((logo, idx) => (
                    <img
                      key={`${setIdx}-${idx}`}
                      src={logo.src}
                      alt={setIdx === 0 ? logo.alt : ''}
                      loading="lazy"
                      className={`${logo.className} opacity-60 hover:opacity-100 transition-opacity duration-300`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ ALUR PELAPORAN — asymmetric sticky + work-order rail ============ */}
        <section id="alur-section" className="py-24 md:py-32 px-6 md:px-20 bg-surface border-b border-outline">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">Alur Pelaporan</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-on-surface tracking-tight leading-[1.05] mb-6">
                Dari foto di HP, sampai jalan mulus.
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-10 max-w-md">
                Empat tahap dengan standar waktu nyata, bukan janji. Setiap tiket tercatat
                dari sistem, kamu tidak perlu mengejar-ngejar status.
              </p>
              <div className="mb-10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">Total laporan masuk</p>
                <p className="font-display font-bold text-6xl text-on-surface tracking-tight">{totalAduan}</p>
              </div>
              <Link
                href="/buat-laporan"
                className="group inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-6 py-3.5 rounded-md font-semibold text-sm transition-all"
              >
                Buat laporan sekarang
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              {workOrder.map((step) => (
                <div key={step.n} className="group grid sm:grid-cols-12 gap-3 sm:gap-6 border-t border-outline py-9 first:border-t-0">
                  <div className="sm:col-span-2">
                    <span className="font-display font-bold text-4xl text-accent transition-colors group-hover:text-accent-strong">{step.n}</span>
                  </div>
                  <div className="sm:col-span-7">
                    <h3 className="font-display font-semibold text-xl text-on-surface mb-2">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="sm:col-span-3 sm:text-right">
                    <span className="inline-block bg-accent-tint text-accent-strong text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                      {step.chip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ LAYANAN — image + divide-y service rows ============ */}
        <section id="info-section" className="py-24 md:py-32 px-6 md:px-20 bg-white border-b border-outline">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-xl border border-outline bg-surface-container-low">
                <img
                  src="/assets/images/kategori_jalan.jpg"
                  alt="Dokumentasi kerusakan jalan yang dilaporkan warga melalui SIGAP"
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
                <span className="absolute top-0 left-0 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-br-lg">
                  Foto aduan kerusakan jalan
                </span>
              </div>
              <p className="mt-4 text-xs text-on-surface-variant leading-relaxed">
                Setiap foto aduan ditayangkan supaya proses perbaikan bisa diawasi bersama.
              </p>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-on-surface tracking-tight leading-[1.05] mb-12">
                Bukan cuma formulir aduan,<br className="hidden sm:block" /> ini catatan kerja kota.
              </h2>

              <div>
                {services.map((s) => (
                  <div key={s.title} className="group border-t border-outline py-7 first:border-t-0 last:border-b">
                    <div className="flex items-start gap-5">
                      <div className="w-11 h-11 shrink-0 bg-accent-tint text-accent-strong rounded-md flex items-center justify-center">
                        <s.icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-lg text-on-surface mb-1.5">{s.title}</h3>
                        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-lg">{s.desc}</p>
                      </div>
                      <Link
                        href={s.href}
                        className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent hover:text-accent-strong pt-1 transition-colors"
                      >
                        {s.cta}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ SOP & BUKTI LAPANGAN ============ */}
        <section id="proses-section" className="py-24 md:py-32 px-6 md:px-20 bg-surface border-b border-outline">
          <div className="max-w-[1280px] mx-auto">
            <div className="max-w-2xl mb-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-6">SOP &amp; Standar Waktu</p>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-on-surface tracking-tight leading-[1.05]">
                Standar waktu yang bisa kamu pegang.
              </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
              {/* SPM panel — ink drench */}
              <div className="lg:col-span-5 bg-primary text-white rounded-lg p-8 md:p-10 flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-bright mb-4">SPM DKI Jakarta</p>
                <h3 className="font-display font-bold text-2xl md:text-3xl leading-tight mb-8">
                  Standar Pelayanan Minimal
                </h3>
                <ul className="space-y-7">
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 bg-accent-bright shrink-0" aria-hidden="true"></div>
                    <div>
                      <p className="font-bold text-sm mb-1">Respon awal <span className="text-accent-bright">≤ 3 jam</span></p>
                      <p className="text-xs text-white/70 leading-relaxed">Validasi berkas dan kategori aduan.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 bg-accent-bright shrink-0" aria-hidden="true"></div>
                    <div>
                      <p className="font-bold text-sm mb-1">Survei teknis <span className="text-accent-bright">≤ 12 jam</span></p>
                      <p className="text-xs text-white/70 leading-relaxed">Kunjungan lokasi oleh PUPR, Dishub, atau DLH.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 bg-accent-bright shrink-0" aria-hidden="true"></div>
                    <div>
                      <p className="font-bold text-sm mb-1">Estimasi pekerjaan <span className="text-accent-bright">24–48 jam</span></p>
                      <p className="text-xs text-white/70 leading-relaxed">Pengerjaan untuk kerusakan umum.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Before/after + trust */}
              <div className="lg:col-span-7 flex flex-col gap-10">
                <div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-4">
                    <div className="overflow-hidden rounded-lg border border-outline bg-white">
                      <img src="/assets/images/jalanrusak.jpg" alt="Kondisi jalan berlubang sebelum diperbaiki" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-4 py-3">Sebelum</p>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-5 h-5 text-accent" aria-hidden="true" />
                    </div>
                    <div className="overflow-hidden rounded-lg border border-outline bg-white">
                      <img src="/assets/images/perbaikan_jalan.png" alt="Proses perbaikan jalan di lokasi yang sama" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent px-4 py-3">Dikerjakan</p>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-on-surface-variant leading-relaxed">
                    Dokumentasi pengerjaan dikembalikan ke pelapor sebagai bukti, bukan sekadar status teks.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-px bg-outline border border-outline rounded-lg overflow-hidden">
                  <div className="bg-white p-7 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-accent-tint text-accent-strong rounded-md flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h4 className="font-display font-semibold text-base text-on-surface">Keamanan data pelapor</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Identitas pelapor dienkripsi dan tidak dipublikasikan ke peta.</p>
                  </div>
                  <div className="bg-white p-7 flex flex-col gap-4">
                    <div className="w-11 h-11 bg-accent-tint text-accent-strong rounded-md flex items-center justify-center">
                      <Users className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h4 className="font-display font-semibold text-base text-on-surface">Audit masyarakat terbuka</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Setiap tahap terdokumentasi; warga bisa menilai kinerja dinas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SUARA WARGA — stats + testimonials ============ */}
        <section id="suara-warga-section" className="py-24 md:py-32 px-6 md:px-20 bg-primary text-white border-b border-white/5">
          <div className="max-w-[1280px] mx-auto grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-4xl md:text-5xl leading-[1.05] tracking-tight mb-14">
                Dampak nyata untuk kota kita.
              </h2>
              <dl className="grid grid-cols-2 gap-y-10 gap-x-6" aria-label="Statistik pencapaian SIGAP">
                <div className="border-l border-white/15 pl-5">
                  <dt className="font-display font-bold text-5xl md:text-6xl text-accent-bright mb-2">92%</dt>
                  <dd className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Aduan tuntas</dd>
                </div>
                <div className="border-l border-white/15 pl-5">
                  <dt className="font-display font-bold text-5xl md:text-6xl text-accent-bright mb-2">340+</dt>
                  <dd className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Mitra perbaikan</dd>
                </div>
                <div className="border-l border-white/15 pl-5">
                  <dt className="font-display font-bold text-5xl md:text-6xl text-accent-bright mb-2">15 mnt</dt>
                  <dd className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Respon awal rata-rata</dd>
                </div>
                <div className="border-l border-white/15 pl-5">
                  <dt className="font-display font-bold text-5xl md:text-6xl text-accent-bright mb-2">{totalSelesai}</dt>
                  <dd className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Laporan selesai</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <figure className="bg-white text-slate-800 border border-outline rounded-lg p-8">
                <blockquote className="text-sm sm:text-base italic leading-relaxed text-slate-600 mb-7">
                  &quot;Lubang jalan di depan rumah yang sudah berbulan-bulan rusak akhirnya diperbaiki
                  dalam waktu tiga hari setelah saya lapor lewat SIGAP. Tiap tahapnya ada kabarnya.&quot;
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-md bg-accent-tint text-accent-strong font-bold text-sm flex items-center justify-center shrink-0">BS</span>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-slate-800">Budi Santoso</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Warga Jakarta Selatan</p>
                  </div>
                </figcaption>
              </figure>

              <figure className="bg-white/5 border border-white/15 text-white rounded-lg p-8 md:translate-x-6">
                <blockquote className="text-sm sm:text-base italic leading-relaxed text-slate-200 mb-7">
                  &quot;Lampu jalan mati membuat kawasan kami rawan. Lewat peta aduan, warga bisa
                  memantau kapan petugas datang memperbaiki, tidak perlu menunggu diam-diam.&quot;
                </blockquote>
                <figcaption className="flex items-center gap-4">
                  <span className="w-11 h-11 rounded-md bg-accent text-white font-bold text-sm flex items-center justify-center shrink-0">AW</span>
                  <div>
                    <p className="font-bold text-xs uppercase tracking-wider text-white">Ani Wijaya</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Ketua RW, Jakarta Pusat</p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ============ CTA — full-bleed hi-vis band ============ */}
        <section className="bg-accent text-white">
          <div className="max-w-[1280px] mx-auto px-6 md:px-20 py-24 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 mb-8">
              Mari bergerak bersama
            </p>
            <h2 className="font-display font-bold text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-4">
              Bangun lingkungan yang lebih SIGAP.
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-12 leading-relaxed">
              Semakin banyak warga melapor, semakin cepat kota menindaklanjuti.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="group inline-flex items-center gap-2.5 bg-white text-accent-strong hover:bg-slate-100 px-8 py-4 rounded-md font-bold text-sm transition-all active:scale-95 cursor-pointer"
              >
                Mulai Lapor
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <Link
                href="/kontak-darurat"
                className="inline-flex items-center gap-2.5 border border-white/40 hover:border-white/70 text-white px-8 py-4 rounded-md font-bold text-sm transition-all"
              >
                Kontak darurat 112
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
