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

const contactTypes = [
  { key: 'polisi', label: 'Polisi', icon: '', image: '/assets/images/logo_polri.png', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { key: 'damkar', label: 'Damkar', icon: 'local_fire_department', color: 'bg-red-100 text-red-700 border-red-200' },
  { key: 'ambulans', label: 'Ambulans', icon: 'ambulance', color: 'bg-green-100 text-green-700 border-green-200' },
  { key: 'bpbd', label: 'BPBD', icon: 'emergency', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { key: 'pln', label: 'PLN', icon: '', image: '/assets/images/logo_pln.png', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { key: 'pdam', label: 'PDAM', icon: '', image: '/assets/images/logo_pdam.png', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
];

const nationalContacts = [
  { label: 'Polisi Nasional', number: '110', icon: '', image: '/assets/images/logo_polri.png', color: 'from-blue-600 to-blue-800', desc: 'Panggilan darurat kepolisian' },
  { label: 'Pemadam Kebakaran', number: '113', icon: 'local_fire_department', color: 'from-red-500 to-red-700', desc: 'Darurat kebakaran & bencana' },
  { label: 'Ambulans / SPGDT', number: '118', icon: 'ambulance', color: 'from-green-500 to-green-700', desc: 'Kegawatdaruratan medis' },
  { label: 'BNPB / Bencana', number: '117', icon: 'emergency', color: 'from-orange-500 to-orange-700', desc: 'Badan Nasional Penanggulangan Bencana' },
  { label: 'PLN Nasional', number: '123', icon: '', image: '/assets/images/logo_pln.png', color: 'from-yellow-500 to-yellow-700', desc: 'Gangguan listrik nasional' },
  { label: 'SAR Nasional', number: '115', icon: 'sos', color: 'from-purple-500 to-purple-700', desc: 'Search & Rescue nasional' },
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar isDashboard={false} />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-primary py-14 px-6 md:px-20 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="material-symbols-outlined text-base text-white">sos</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Darurat</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Kontak Darurat
              <br />
              <span className="text-white/80">Seluruh Indonesia</span>
            </h1>
            <p className="text-base text-white/70 max-w-xl mx-auto mt-4">
              Temukan nomor darurat resmi dari setiap provinsi di Indonesia — polisi, pemadam kebakaran, ambulans, BPBD, PLN, dan PDAM.
            </p>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </section>

        {/* National Emergency Numbers */}
        <section className="py-12 px-6 md:px-20 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">star</span>
              Nomor Darurat Nasional
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {nationalContacts.map((c) => (
                <a
                  key={c.number}
                  href={`tel:${c.number}`}
                  className={`bg-gradient-to-br ${c.color} text-white rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95`}
                >
                  {'image' in c && c.image ? (
                    <img src={c.image} alt={c.label} className="w-10 h-10 object-contain drop-shadow-md" />
                  ) : (
                    <span className="material-symbols-outlined text-3xl">{c.icon}</span>
                  )}
                  <span className="text-2xl font-extrabold tracking-tight">{c.number}</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90 leading-tight">{c.label}</span>
                  <span className="text-xs opacity-70 leading-tight hidden sm:block">{c.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Province Contacts */}
        <section className="py-12 px-6 md:px-20">
          <div className="max-w-6xl mx-auto">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                Kontak per Provinsi
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari provinsi..."
                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-full sm:w-52"
                  />
                </div>
              </div>
            </div>

            {/* Island Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {pulauGroups.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPulau(p)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                    selectedPulau === p
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-6">
              {contactTypes.map((t) => (
                <div key={t.key} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${t.color}`}>
                  {'image' in t && t.image ? (
                    <img src={t.image} alt={t.label} className="w-4 h-4 object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-sm">{t.icon}</span>
                  )}
                  {t.label}
                </div>
              ))}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                <p className="text-sm font-medium">Provinsi tidak ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((prov) => (
                  <div key={prov.provinsi} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-800 text-base leading-tight">{prov.provinsi}</h3>
                          <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {prov.pulau}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 text-2xl mt-0.5">location_city</span>
                      </div>
                    </div>
                    <div className="px-5 py-4 grid grid-cols-2 gap-2.5">
                      {contactTypes.map((ct) => {
                        const number = prov[ct.key as keyof ProvinceContact];
                        return (
                          <a
                            key={ct.key}
                            href={`tel:${number.replace(/[^0-9+]/g, '')}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all hover:shadow-sm active:scale-95 ${ct.color}`}
                          >
                            {'image' in ct && ct.image ? (
                              <img src={ct.image} alt={ct.label} className="w-5 h-5 object-contain shrink-0" />
                            ) : (
                              <span className="material-symbols-outlined text-sm shrink-0">{ct.icon}</span>
                            )}
                            <div className="min-w-0">
                              <div className="text-xs uppercase tracking-wide opacity-70 leading-none mb-0.5">{ct.label}</div>
                              <div className="font-bold leading-tight truncate">{number}</div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-center text-xs text-slate-400 mt-12">
              Data kontak bersumber dari instansi resmi daerah. Dalam kondisi darurat, selalu utamakan nomor nasional:{' '}
              <strong>110</strong>, <strong>113</strong>, <strong>118</strong>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
