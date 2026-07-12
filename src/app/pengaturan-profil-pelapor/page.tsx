'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function PengaturanProfilPelapor() {
  return (
    <AuthGuard allowedRoles={['Masyarakat']}>
      <PengaturanProfilPelaporForm />
    </AuthGuard>
  );
}

function PengaturanProfilPelaporForm() {
  const { currentUser, updateUserProfile, updateUserPassword } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'keamanan'>('umum');

  // Informasi Umum States - Initialize directly from currentUser (guaranteed non-null)
  const [nama, setNama] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [telepon, setTelepon] = useState(currentUser?.telepon || '');
  const [alamat, setAlamat] = useState(currentUser?.alamat || '');
  const [foto, setFoto] = useState(currentUser?.foto || '');
  const [uploading, setUploading] = useState(false);

  // Keamanan States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sync state if currentUser gets updated asynchronously (e.g., from DB sync on mount)
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.username) setNama(currentUser.username);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.telepon) setTelepon(currentUser.telepon);
      if (currentUser.alamat) setAlamat(currentUser.alamat);
      if (currentUser.foto) setFoto(currentUser.foto);
    }
  }, [currentUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Strict MIME type whitelist — reject anything not in this list
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      alert('Format file tidak didukung. Hanya JPEG, PNG, WebP, dan GIF yang diperbolehkan.');
      e.target.value = '';
      return;
    }

    // 2. File size cap (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB.');
      e.target.value = '';
      return;
    }

    if (!currentUser?.id) return;

    // 3. Magic-byte check — verify actual file signature before uploading to Supabase
    const validateAndUpload = async () => {
      const headerBuffer = await file.slice(0, 12).arrayBuffer();
      const arr = new Uint8Array(headerBuffer);
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

      // 4. All checks passed — upload file to Supabase Storage
      setUploading(true);
      try {
        const ext = file.name.split('.').pop();
        const filePath = `avatars/${currentUser.id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true, contentType: file.type });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        // 5. Immediately persist avatar_url to the database so it syncs across ALL devices.
        const { error: dbError } = await supabase
          .from('users')
          .update({ avatar_url: publicUrl })
          .eq('email', currentUser.email);

        if (dbError) {
          console.error('[Avatar] Failed to save avatar_url to DB:', dbError.message);
        }

        // 6. Update localStorage cache for offline/same-device use
        localStorage.setItem('sigap_user_foto_' + currentUser.id, publicUrl);

        // 7. Update local form state (add cache-buster so UI shows new photo immediately)
        const cacheBustedUrl = publicUrl + (publicUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
        setFoto(cacheBustedUrl);
      } catch (err) {
        console.error('Upload foto gagal:', err);
        alert('Gagal mengunggah foto. Silakan coba lagi.');
      } finally {
        setUploading(false);
      }
    };

    validateAndUpload();
  };

  const handleSaveUmum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      alert('Harap tunggu, foto sedang diunggah...');
      return;
    }
    const success = await updateUserProfile(nama, email, telepon, alamat, foto);
    if (success) {
      alert('Informasi profil umum Anda berhasil diperbarui!');
    } else {
      alert('Gagal memperbarui informasi profil.');
    }
  };

  const handleSaveSandi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Kata sandi baru harus minimal 8 karakter.');
      return;
    }
    
    const result = await updateUserPassword(currentPassword, newPassword);
    alert(result.message);
    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen page-shell">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen max-w-[1024px] flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-lg flex items-center justify-center shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-1">Pengaturan Profil</h1>
              <p className="text-xs text-[#4E4639]">Kelola data diri, foto profil, dan keamanan sandi akun pelapor Anda.</p>
            </div>
          </div>
        </header>

        {/* Avatar Banner Card */}
        <div className="legacy-card p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 mb-8 shrink-0">
          <div className="relative group">
            {foto ? (
              <img
                src={foto}
                alt="Foto Profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#001360] text-white font-bold flex items-center justify-center text-xl border-2 border-white shadow-md select-none">
                {nama ? nama.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'U'}
              </div>
            )}
            <label
              htmlFor="upload-avatar-pelapor"
              className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-[10px] transition cursor-pointer font-bold ${uploading ? 'bg-black/60' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}
            >
              {uploading
                ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                : <span className="material-symbols-outlined text-xs">photo_camera</span>
              }
            </label>
            <input
              type="file"
              id="upload-avatar-pelapor"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h3 className="text-base font-bold text-[#1C1B18]">
              {uploading ? 'Sedang mengunggah foto...' : (nama || 'Nama Pengguna')}
            </h3>
            <p className="text-xs text-[#4E4639] mt-0.5">
              {uploading ? 'Mohon tunggu sebentar...' : (email || 'email@domain.com')}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('upload-avatar-pelapor')?.click()}
                disabled={uploading}
                className="bg-[#001360] text-white text-[10px] font-bold py-2 px-4 rounded-lg hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Mengunggah...' : 'Ganti Foto'}
              </button>
              <button
                type="button"
                onClick={() => setFoto('')}
                disabled={uploading || !foto}
                className="bg-[#F6F3EC] border border-[#D3C5B1] hover:bg-white text-[#4E4639] text-[10px] font-bold py-2 px-4 rounded-lg transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Hapus
              </button>
            </div>
            <span className="inline-block bg-[#001360]/10 text-[#001360] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#001360]/10 uppercase tracking-wider mt-3">
              Pelapor / Warga
            </span>
          </div>
        </div>

        {/* Tab Selector Header */}
        <div className="border-b border-[#D3C5B1] flex gap-6 mb-6 shrink-0">
          <button
            onClick={() => setActiveTab('umum')}
            className={"pb-3 font-bold text-xs transition focus:outline-none flex items-center gap-1.5 border-b-2 " + (
              activeTab === 'umum'
                ? 'border-[#001360] text-[#001360]'
                : 'border-transparent text-[#4E4639] hover:text-[#1C1B18]'
            )}
          >
            <span className="material-symbols-outlined text-sm">badge</span> Informasi Umum
          </button>
          <button
            onClick={() => setActiveTab('keamanan')}
            className={"pb-3 font-bold text-xs transition focus:outline-none flex items-center gap-1.5 border-b-2 " + (
              activeTab === 'keamanan'
                ? 'border-[#001360] text-[#001360]'
                : 'border-transparent text-[#4E4639] hover:text-[#1C1B18]'
            )}
          >
            <span className="material-symbols-outlined text-sm">lock</span> Keamanan Akun
          </button>
        </div>

        {/* Panel Informasi Umum */}
        {activeTab === 'umum' && (
          <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm flex-grow">
            <form onSubmit={handleSaveUmum} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={telepon}
                    onChange={e => setTelepon(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">NIK Penduduk (KTP)</label>
                  <input
                    type="text"
                    value={currentUser?.identitas || '-'}
                    disabled
                    className="w-full px-3 py-2 bg-[#F6F3EC] border border-[#D3C5B1] rounded-lg text-[#807667] font-mono cursor-not-allowed text-xs"
                    title="NIK terverifikasi tidak dapat diubah secara mandiri"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Alamat Domisili</label>
                <textarea
                  rows={3}
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                  placeholder="Masukkan alamat domisili lengkap Anda..."
                  className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18] resize-none"
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-[#D3C5B1]/50">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#001360] text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-all hover:opacity-90 flex items-center gap-2 cursor-pointer uppercase tracking-wider shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm font-bold">save</span> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Panel Keamanan */}
        {activeTab === 'keamanan' && (
          <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm flex-grow">
            <form onSubmit={handleSaveSandi} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Kata Sandi Sekarang</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini..."
                  className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter..."
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru..."
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-[#D3C5B1]/50">
                <button
                  type="submit"
                  className="bg-[#001360] text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-all hover:opacity-90 flex items-center gap-2 cursor-pointer uppercase tracking-wider shadow-md"
                >
                  <span className="material-symbols-outlined text-sm font-bold">key</span> Perbarui Kata Sandi
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
