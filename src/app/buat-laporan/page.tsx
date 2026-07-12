'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

const MapSelector = dynamic(() => import('@/components/MapSelector'), { ssr: false });

export default function BuatLaporan() {
  const { currentUser, tambahLaporan } = useApp();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kategori, setKategori] = useState<'jalan' | 'penerangan' | 'drainase' | 'fasilitas' | 'lainnya'>('jalan');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [urgensi, setUrgensi] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
  const [lat, setLat] = useState(-7.983908);
  const [lng, setLng] = useState(112.621391);
  const [wilayah, setWilayah] = useState('Klojen');
  const [foto, setFoto] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMapChange = (newLat: number, newLng: number, newAddress?: string, newWilayah?: string) => {
    setLat(newLat);
    setLng(newLng);
    if (newAddress) {
      setLokasi(newAddress);
    }
    if (newWilayah) {
      setWilayah(newWilayah);
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Strict MIME type whitelist — reject anything not in this list
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      alert('Format file tidak didukung. Hanya JPEG, PNG, WebP, dan GIF yang diperbolehkan.');
      e.target.value = '';
      return;
    }

    // 2. File size cap (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB.');
      e.target.value = '';
      return;
    }

    // 3. Magic-byte check — read the first 12 bytes and verify the real file signature
    //    This catches zip bombs or malicious files that spoof their extension.
    const headerReader = new FileReader();
    headerReader.onloadend = () => {
      const arr = new Uint8Array(headerReader.result as ArrayBuffer);
      const header = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');

      const isJpeg = header.startsWith('ffd8ff');
      const isPng  = header.startsWith('89504e47');
      const isGif  = header.startsWith('47494638');
      const isWebP = header.slice(0, 8) === '52494646' && header.slice(16, 24) === '57454250';

      if (!isJpeg && !isPng && !isGif && !isWebP) {
        alert('File ditolak: konten file tidak valid atau bukan gambar asli.');
        e.target.value = '';
        return;
      }

      // 4. All checks passed — read as Data URL to preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    };
    headerReader.readAsArrayBuffer(file.slice(0, 12));
  };

  const removeFoto = () => {
    setFoto('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lokasi.trim() || !deskripsi.trim()) {
      alert('Harap lengkapi semua kolom form.');
      return;
    }

    if (!lat || !lng) {
      alert('Harap pilih titik lokasi pada peta.');
      return;
    }

    setIsSubmitting(true);

    try {
      const actorName = currentUser?.username || 'Pelapor';
      await tambahLaporan({
        lat,
        lng,
        kategori,
        deskripsi,
        status: 'baru',
        pelapor: actorName,
        lokasi,
        wilayah,
        urgensi,
        foto: foto || ''
      });

      alert('Aduan berhasil dikirim!');
      router.push('/dashboard-pelapor');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim aduan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['Masyarakat']}>
      <div className="min-h-screen page-shell">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-10 min-h-screen">
          {/* Header */}
          <header className="flex items-center gap-3 mb-10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-xl flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-0.5">Buat Aduan Infrastruktur Baru</h1>
              <p className="text-sm text-[#807667]">Laporkan kendala kerusakan jalan, saluran air, dan fasilitas umum kota.</p>
            </div>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* Category selector */}
              <div className="bg-white border border-[#E5E2E1] p-6 rounded-2xl shadow-[0_2px_4px_rgba(0,19,96,0.04)]">
                <h2 className="text-sm font-semibold text-[#1C1B18] mb-4 uppercase tracking-wider">Kategori Laporan</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'jalan', label: 'Jalan & Trotoar', icon: 'road' },
                    { id: 'penerangan', label: 'Penerangan', icon: 'lightbulb' },
                    { id: 'drainase', label: 'Saluran Air', icon: 'water' },
                    { id: 'fasilitas', label: 'Fasum / Taman', icon: 'eco' }
                  ].map(cat => (
                    <label key={cat.id} className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat.id}
                        checked={kategori === cat.id}
                        onChange={() => setKategori(cat.id as 'jalan' | 'penerangan' | 'drainase' | 'fasilitas' | 'lainnya')}
                        className="peer sr-only"
                      />
                      <div className="p-4 border border-[#D3C5B1] rounded-xl text-center peer-checked:border-[#001360] peer-checked:bg-[#001360]/5 group-hover:bg-[#F6F3EC] transition-all h-full flex flex-col items-center justify-center min-h-[80px]">
                        <span className="material-symbols-outlined block mb-2 text-xl text-[#001360]">{cat.icon}</span>
                        <span className="text-xs font-semibold text-[#1C1B18] leading-tight">{cat.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Name & Details */}
              <div className="legacy-card p-6 rounded-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1C1B18] mb-2" htmlFor="input-lokasi">
                    Nama Jalan / Lokasi Kerusakan
                  </label>
                  <input
                    id="input-lokasi"
                    type="text"
                    required
                    value={lokasi}
                    onChange={e => setLokasi(e.target.value)}
                    placeholder="Contoh: Jl. Ijen No. 12 (depan gerbang Katedral)"
                    className="w-full bg-white border border-[#D3C5B1] rounded-lg p-3 text-sm text-[#1C1B18] focus:border-[#001360] focus:ring-2 focus:ring-[#001360]/15 outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C1B18] mb-2" htmlFor="input-deskripsi">
                    Deskripsi Kejadian
                  </label>
                  <textarea
                    id="input-deskripsi"
                    required
                    rows={5}
                    value={deskripsi}
                    onChange={e => setDeskripsi(e.target.value)}
                    placeholder="Jelaskan detail permasalahan yang Anda temukan secara rinci..."
                    className="w-full bg-white border border-[#D3C5B1] rounded-lg p-4 text-sm text-[#1C1B18] focus:border-[#001360] focus:ring-2 focus:ring-[#001360]/15 outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Tingkat Urgensi</label>
                  <div className="flex gap-6">
                    {[
                      { id: 'Rendah', label: 'Normal', colorClass: 'text-[#4E4639]' },
                      { id: 'Sedang', label: 'Penting', colorClass: 'text-[#001360]' },
                      { id: 'Tinggi', label: 'Mendesak', colorClass: 'text-red-600 font-bold' }
                    ].map(urg => (
                      <label key={urg.id} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                        <input
                          type="radio"
                          name="urgency"
                          value={urg.id}
                          checked={urgensi === urg.id}
                          onChange={() => setUrgensi(urg.id as 'Rendah' | 'Sedang' | 'Tinggi')}
                          className="w-4 h-4 text-[#001360] border-[#D3C5B1] focus:ring-[#001360]/20"
                        />
                        <span className={`${urg.colorClass}`}>{urg.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Upload Card */}
              <div className="bg-white border border-[#E5E2E1] p-6 rounded-2xl shadow-[0_2px_4px_rgba(0,19,96,0.04)]">
                <h2 className="text-sm font-semibold text-[#1C1B18] mb-1">Unggah Bukti</h2>
                <p className="text-xs text-[#807667] mb-4">Tambahkan foto visual lokasi untuk mempercepat verifikasi laporan.</p>

                {foto ? (
                  <div className="relative border border-[#D3C5B1] rounded-xl overflow-hidden max-w-sm">
                    <img src={foto} alt="Preview Bukti" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={removeFoto}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                    >
                      <span className="material-symbols-outlined text-xs block">delete</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-[#D3C5B1] hover:border-[#001360] bg-[#F6F3EC]/30 rounded-xl p-8 text-center cursor-pointer transition relative">
                    <input
                      type="file"
                      id="input-foto"
                      accept="image/*"
                      onChange={handleFotoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <span className="material-symbols-outlined text-4xl text-[#807667]">cloud_upload</span>
                      <p className="text-sm text-[#4E4639]"><span className="font-semibold text-[#001360]">Pilih berkas foto</span> atau tarik gambar ke sini</p>
                      <p className="text-xs text-[#807667]">Mendukung format PNG, JPG, JPEG maks 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Location & Submit */}
            <div className="lg:col-span-5 space-y-6">
              <div className="legacy-card rounded-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-[#E5E2E1]">
                  <h2 className="text-sm font-semibold text-[#1C1B18] mb-1">Lokasi Kejadian</h2>
                  <p className="text-xs text-[#807667]">Ketik alamat atau klik pada peta digital di bawah ini untuk menandai titik presisi kerusakan.</p>
                </div>
                
                {/* Dynamically Loaded Map */}
                <div className="p-4 border-b border-[#E5E2E1]">
                  <MapSelector lat={lat} lng={lng} onChange={handleMapChange} address={lokasi} />
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#807667] mb-1">Latitude</label>
                      <input
                        type="text"
                        readOnly
                        value={lat.toFixed(6)}
                        className="w-full bg-[#F6F3EC] border border-[#D3C5B1] rounded-lg px-3 py-2.5 text-xs font-mono text-[#4E4639] outline-none cursor-not-allowed"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#807667] mb-1">Longitude</label>
                      <input
                        type="text"
                        readOnly
                        value={lng.toFixed(6)}
                        className="w-full bg-[#F6F3EC] border border-[#D3C5B1] rounded-lg px-3 py-2.5 text-xs font-mono text-[#4E4639] outline-none cursor-not-allowed"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#001360] text-white font-semibold py-3.5 px-6 rounded-[28px] text-sm transition-all hover:bg-[#223aa8] flex items-center justify-center gap-2 uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50 min-h-[48px]"
                  >
                    {isSubmitting ? (
                      <>Mengirim Laporan...</>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span> Kirim Laporan Aduan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
}
