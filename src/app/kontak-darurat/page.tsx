'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProvinceContact {
  provinsi: string;
  pulau: string;
  polisi: string;
  damkar: string;
  ambulans: string;
  bpbd: string;
  pln: string;
  pdam: string;
}

const kontakDarurat: ProvinceContact[] = [
  // Sumatera
  { provinsi: 'Aceh', pulau: 'Sumatera', polisi: '(0651) 7555', damkar: '113', ambulans: '118', bpbd: '(0651) 7551888', pln: '123', pdam: '(0651) 7551' },
  { provinsi: 'Sumatera Utara', pulau: 'Sumatera', polisi: '(061) 4158686', damkar: '113', ambulans: '118', bpbd: '(061) 4568000', pln: '123', pdam: '(061) 4158000' },
  { provinsi: 'Sumatera Barat', pulau: 'Sumatera', polisi: '(0751) 22110', damkar: '113', ambulans: '118', bpbd: '(0751) 7050359', pln: '123', pdam: '(0751) 7050' },
  { provinsi: 'Riau', pulau: 'Sumatera', polisi: '(0761) 31110', damkar: '113', ambulans: '118', bpbd: '(0761) 7891919', pln: '123', pdam: '(0761) 7891' },
  { provinsi: 'Kepulauan Riau', pulau: 'Sumatera', polisi: '(0778) 450110', damkar: '113', ambulans: '118', bpbd: '(0778) 471919', pln: '123', pdam: '(0778) 471000' },
  { provinsi: 'Jambi', pulau: 'Sumatera', polisi: '(0741) 23110', damkar: '113', ambulans: '118', bpbd: '(0741) 7551919', pln: '123', pdam: '(0741) 7551' },
  { provinsi: 'Sumatera Selatan', pulau: 'Sumatera', polisi: '(0711) 712110', damkar: '113', ambulans: '118', bpbd: '(0711) 7221919', pln: '123', pdam: '(0711) 7221' },
  { provinsi: 'Bangka Belitung', pulau: 'Sumatera', polisi: '(0717) 422110', damkar: '113', ambulans: '118', bpbd: '(0717) 422919', pln: '123', pdam: '(0717) 422000' },
  { provinsi: 'Bengkulu', pulau: 'Sumatera', polisi: '(0736) 21110', damkar: '113', ambulans: '118', bpbd: '(0736) 341919', pln: '123', pdam: '(0736) 341000' },
  { provinsi: 'Lampung', pulau: 'Sumatera', polisi: '(0721) 254110', damkar: '113', ambulans: '118', bpbd: '(0721) 7691919', pln: '123', pdam: '(0721) 7691' },
  // Jawa
  { provinsi: 'DKI Jakarta', pulau: 'Jawa', polisi: '(021) 1120', damkar: '113', ambulans: '118', bpbd: '(021) 164', pln: '123', pdam: '(021) 5798000' },
  { provinsi: 'Banten', pulau: 'Jawa', polisi: '(0254) 200110', damkar: '113', ambulans: '118', bpbd: '(0254) 207919', pln: '123', pdam: '(0254) 207000' },
  { provinsi: 'Jawa Barat', pulau: 'Jawa', polisi: '(022) 7207110', damkar: '113', ambulans: '118', bpbd: '(022) 7271919', pln: '123', pdam: '(022) 7271' },
  { provinsi: 'DI Yogyakarta', pulau: 'Jawa', polisi: '(0274) 512110', damkar: '113', ambulans: '118', bpbd: '(0274) 581919', pln: '123', pdam: '(0274) 581000' },
  { provinsi: 'Jawa Tengah', pulau: 'Jawa', polisi: '(024) 8442110', damkar: '113', ambulans: '118', bpbd: '(024) 8313919', pln: '123', pdam: '(024) 8313' },
  { provinsi: 'Jawa Timur', pulau: 'Jawa', polisi: '(031) 8280110', damkar: '113', ambulans: '118', bpbd: '(031) 8291919', pln: '123', pdam: '(031) 8291' },
  // Bali & Nusa Tenggara
  { provinsi: 'Bali', pulau: 'Bali & Nusa Tenggara', polisi: '(0361) 224111', damkar: '113', ambulans: '118', bpbd: '(0361) 7809119', pln: '123', pdam: '(0361) 7809' },
  { provinsi: 'Nusa Tenggara Barat', pulau: 'Bali & Nusa Tenggara', polisi: '(0370) 632110', damkar: '113', ambulans: '118', bpbd: '(0370) 640919', pln: '123', pdam: '(0370) 640000' },
  { provinsi: 'Nusa Tenggara Timur', pulau: 'Bali & Nusa Tenggara', polisi: '(0380) 833110', damkar: '113', ambulans: '118', bpbd: '(0380) 833919', pln: '123', pdam: '(0380) 833000' },
  // Kalimantan
  { provinsi: 'Kalimantan Barat', pulau: 'Kalimantan', polisi: '(0561) 732110', damkar: '113', ambulans: '118', bpbd: '(0561) 748919', pln: '123', pdam: '(0561) 748000' },
  { provinsi: 'Kalimantan Tengah', pulau: 'Kalimantan', polisi: '(0536) 3231110', damkar: '113', ambulans: '118', bpbd: '(0536) 3231919', pln: '123', pdam: '(0536) 3231' },
  { provinsi: 'Kalimantan Selatan', pulau: 'Kalimantan', polisi: '(0511) 3352110', damkar: '113', ambulans: '118', bpbd: '(0511) 3350919', pln: '123', pdam: '(0511) 3350' },
  { provinsi: 'Kalimantan Timur', pulau: 'Kalimantan', polisi: '(0541) 733110', damkar: '113', ambulans: '118', bpbd: '(0541) 7271919', pln: '123', pdam: '(0541) 7271' },
  { provinsi: 'Kalimantan Utara', pulau: 'Kalimantan', polisi: '(0551) 21110', damkar: '113', ambulans: '118', bpbd: '(0551) 51919', pln: '123', pdam: '(0551) 51000' },
  // Sulawesi
  { provinsi: 'Sulawesi Utara', pulau: 'Sulawesi', polisi: '(0431) 862110', damkar: '113', ambulans: '118', bpbd: '(0431) 862919', pln: '123', pdam: '(0431) 862000' },
  { provinsi: 'Gorontalo', pulau: 'Sulawesi', polisi: '(0435) 822110', damkar: '113', ambulans: '118', bpbd: '(0435) 824919', pln: '123', pdam: '(0435) 824000' },
  { provinsi: 'Sulawesi Tengah', pulau: 'Sulawesi', polisi: '(0451) 421110', damkar: '113', ambulans: '118', bpbd: '(0451) 428919', pln: '123', pdam: '(0451) 428000' },
  { provinsi: 'Sulawesi Barat', pulau: 'Sulawesi', polisi: '(0426) 2323110', damkar: '113', ambulans: '118', bpbd: '(0426) 2325919', pln: '123', pdam: '(0426) 2325' },
  { provinsi: 'Sulawesi Selatan', pulau: 'Sulawesi', polisi: '(0411) 3611110', damkar: '113', ambulans: '118', bpbd: '(0411) 3620919', pln: '123', pdam: '(0411) 3620' },
  { provinsi: 'Sulawesi Tenggara', pulau: 'Sulawesi', polisi: '(0401) 321110', damkar: '113', ambulans: '118', bpbd: '(0401) 326919', pln: '123', pdam: '(0401) 326000' },
  // Maluku
  { provinsi: 'Maluku', pulau: 'Maluku & Papua', polisi: '(0911) 352110', damkar: '113', ambulans: '118', bpbd: '(0911) 355919', pln: '123', pdam: '(0911) 355000' },
  { provinsi: 'Maluku Utara', pulau: 'Maluku & Papua', polisi: '(0921) 3121110', damkar: '113', ambulans: '118', bpbd: '(0921) 3124919', pln: '123', pdam: '(0921) 3124' },
  // Papua
  { provinsi: 'Papua Barat', pulau: 'Maluku & Papua', polisi: '(0986) 213110', damkar: '113', ambulans: '118', bpbd: '(0986) 215919', pln: '123', pdam: '(0986) 215000' },
  { provinsi: 'Papua Barat Daya', pulau: 'Maluku & Papua', polisi: '(0951) 321110', damkar: '113', ambulans: '118', bpbd: '(0951) 321919', pln: '123', pdam: '(0951) 321000' },
  { provinsi: 'Papua', pulau: 'Maluku & Papua', polisi: '(0967) 534110', damkar: '113', ambulans: '118', bpbd: '(0967) 533919', pln: '123', pdam: '(0967) 533000' },
  { provinsi: 'Papua Pegunungan', pulau: 'Maluku & Papua', polisi: '112', damkar: '113', ambulans: '118', bpbd: '119', pln: '123', pdam: '(0969) 31000' },
  { provinsi: 'Papua Tengah', pulau: 'Maluku & Papua', polisi: '112', damkar: '113', ambulans: '118', bpbd: '119', pln: '123', pdam: '(0901) 21000' },
  { provinsi: 'Papua Selatan', pulau: 'Maluku & Papua', polisi: '112', damkar: '113', ambulans: '118', bpbd: '119', pln: '123', pdam: '(0971) 21000' },
];

const pulauGroups = ['Semua', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'];

interface ContactType {
  key: string;
  label: string;
  icon?: string;
  image?: string;
}

const contactTypes: ContactType[] = [
  { key: 'polisi', label: 'Polisi', image: '/assets/images/logo_polri.png' },
  { key: 'damkar', label: 'Damkar', icon: 'local_fire_department' },
  { key: 'ambulans', label: 'Ambulans', icon: 'ambulance' },
  { key: 'bpbd', label: 'BPBD', icon: 'emergency' },
  { key: 'pln', label: 'PLN', image: '/assets/images/logo_pln.png' },
  { key: 'pdam', label: 'PDAM', image: '/assets/images/logo_pdam.png' },
];

interface NationalContact {
  label: string;
  number: string;
  icon?: string;
  image?: string;
  desc: string;
}

const nationalContacts: NationalContact[] = [
  { label: 'Kepolisian', number: '110', image: '/assets/images/logo_polri.png', desc: 'Darurat kepolisian' },
  { label: 'Pemadam Kebakaran', number: '113', icon: 'local_fire_department', desc: 'Kebakaran & bencana' },
  { label: 'Ambulans', number: '118', icon: 'ambulance', desc: 'Kegawatdaruratan medis' },
  { label: 'BNPB', number: '117', icon: 'emergency', desc: 'Penanggulangan bencana' },
  { label: 'PLN', number: '123', image: '/assets/images/logo_pln.png', desc: 'Gangguan listrik' },
  { label: 'SAR Nasional', number: '115', icon: 'sos', desc: 'Search & Rescue' },
];

export default function KontakDaruratPage() {
  const [search, setSearch] = useState('');
  const [selectedPulau, setSelectedPulau] = useState('Semua');

  const filtered = useMemo(() => {
    return kontakDarurat.filter((p) => {
      const matchSearch = p.provinsi.toLowerCase().includes(search.toLowerCase());
      const matchPulau = selectedPulau === 'Semua' || p.pulau === selectedPulau;
      return matchSearch && matchPulau;
    });
  }, [search, selectedPulau]);

  const renderIcon = (ct: ContactType | NationalContact, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeMap = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-10 h-10' };
    const iconSizeMap = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
    if (ct.image) {
      return <img src={ct.image} alt={ct.label} className={`${sizeMap[size]} object-contain`} style={{ mixBlendMode: 'multiply' }} />;
    }
    return <span className={`material-symbols-outlined ${iconSizeMap[size]} text-slate-500`}>{ct.icon}</span>;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar isDashboard={false} />

      <main className="flex-1 pt-20">

        {/* Hero — clean, minimal */}
        <section className="border-b border-slate-100 py-12 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors mb-6 font-medium uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Beranda
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Direktori Darurat</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Kontak Darurat Indonesia
                </h1>
                <p className="mt-3 text-sm text-slate-500 max-w-lg leading-relaxed">
                  Nomor darurat resmi dari setiap provinsi di Indonesia. Tap nomor untuk langsung menghubungi.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="material-symbols-outlined text-sm text-slate-400">info</span>
                <span className="text-xs text-slate-400">{kontakDarurat.length} provinsi tercatat</span>
              </div>
            </div>
          </div>
        </section>

        {/* National Numbers — clean table style */}
        <section className="py-10 px-6 md:px-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Nomor Darurat Nasional</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {nationalContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center gap-2.5 hover:border-slate-300 hover:shadow-sm transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    {renderIcon(c, 'lg')}
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{c.number}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-700 leading-tight">{c.label}</p>
                    <p className="text-xs text-slate-400 leading-tight mt-0.5 hidden sm:block">{c.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Province Contacts */}
        <section className="py-10 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Kontak per Provinsi</p>
              <div className="relative w-full sm:w-56">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-base">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari provinsi..."
                  className="pl-9 pr-4 h-9 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-400 w-full transition-colors"
                />
              </div>
            </div>

            {/* Island Pills */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {pulauGroups.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPulau(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    selectedPulau === p
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Legend row */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 pb-6 border-b border-slate-100">
              {contactTypes.map((t) => (
                <div key={t.key} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {renderIcon(t, 'sm')}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Province Cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-24 text-slate-300">
                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                <p className="text-sm font-medium text-slate-400">Provinsi tidak ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((prov) => (
                  <div key={prov.provinsi} className="border border-slate-200 rounded-xl bg-white hover:border-slate-300 hover:shadow-sm transition-all">
                    {/* Card Header */}
                    <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{prov.provinsi}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{prov.pulau}</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-200 text-xl">location_city</span>
                    </div>
                    {/* Contact Grid */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {contactTypes.map((ct) => {
                        const number = prov[ct.key as keyof ProvinceContact];
                        return (
                          <a
                            key={ct.key}
                            href={`tel:${number.replace(/[^0-9+]/g, '')}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all active:scale-95 group"
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              {renderIcon(ct, 'sm')}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-slate-400 leading-none mb-0.5">{ct.label}</div>
                              <div className="text-xs font-bold text-slate-700 leading-tight truncate">{number}</div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-xs text-slate-300 mt-12 pb-4">
              Dalam kondisi darurat, utamakan nomor nasional: <span className="font-bold text-slate-400">110</span> · <span className="font-bold text-slate-400">113</span> · <span className="font-bold text-slate-400">118</span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
