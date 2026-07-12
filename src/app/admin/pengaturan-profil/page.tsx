'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function AdminPengaturanProfil() {
  return (
    <AuthGuard allowedRoles={['Administrator', 'Petugas', 'Petugas PUPR']}>
      <PengaturanProfilForm />
    </AuthGuard>
  );
}

function PengaturanProfilForm() {
  const { currentUser, updateUserProfile, updateUserPassword } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'keamanan'>('umum');

  // Form States - Initialize directly from currentUser (guaranteed non-null)
  const [nama, setNama] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [telepon, setTelepon] = useState(currentUser?.telepon || '');
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
      if (currentUser.foto) setFoto(currentUser.foto);
    }
  }, [currentUser]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB.');
      return;
    }

    if (!currentUser?.id) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `avatars/${currentUser.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setFoto(data.publicUrl);
    } catch (err) {
      console.error('Upload foto gagal:', err);
      alert('Gagal mengunggah foto. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveUmum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) {
      alert('Harap tunggu, foto sedang diunggah...');
      return;
    }
    const success = await updateUserProfile(nama, email, telepon, undefined, foto || undefined);
    if (success) {
      alert('Informasi profil umum administrator berhasil diperbarui!');
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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

      {/* Main Content Area */}
      <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen max-w-[1024px]">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
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
              <p className="text-xs text-[#4E4639]">Kelola data diri, foto profil, dan keamanan sandi login Anda.</p>
            </div>
          </div>
        </header>

        {/* Avatar Banner Card */}
        <div className="legacy-card p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="relative group">
            {foto ? (
              <img
                src={foto}
                alt="Foto Profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#001360] text-white font-bold flex items-center justify-center text-xl border-2 border-white shadow-md select-none">
                {nama ? nama.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'A'}
              </div>
            )}
            <label
              htmlFor="upload-avatar"
              className={`absolute inset-0 rounded-full flex items-center justify-center text-white text-[10px] transition cursor-pointer font-bold ${uploading ? 'bg-black/60' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}
            >
              {uploading
                ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                : <span className="material-symbols-outlined text-xs">photo_camera</span>
              }
            </label>
            <input
              type="file"
              id="upload-avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              className="hidden"
            />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h3 className="text-base font-bold text-[#1C1B18]">Foto Profil Anda</h3>
            <p className="text-xs text-[#4E4639] mt-1">
              {uploading ? 'Sedang mengunggah foto...' : 'Disarankan format PNG/JPG rasio 1:1 maks 2MB.'}
            </p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => document.getElementById('upload-avatar')?.click()}
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
          </div>
        </div>

        {/* Tab Selector Header */}
        <div className="border-b border-[#D3C5B1] flex gap-6 mb-6">
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
          <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSaveUmum} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    placeholder="Masukkan nama lengkap..."
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
                    placeholder="Contoh: admin@pemda.go.id"
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nomor Telepon Kerja</label>
                  <input
                    type="text"
                    value={telepon}
                    onChange={e => setTelepon(e.target.value)}
                    placeholder="Masukkan nomor telepon kerja..."
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">NIP Pegawai</label>
                  <input
                    type="text"
                    value={currentUser?.identitas || ''}
                    disabled
                    className="legacy-input w-full px-3 py-2 text-xs font-mono"
                    placeholder="NIP belum diatur"
                    title="NIP tidak dapat diubah secara mandiri"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Instansi / Satuan Kerja</label>
                <input
                  type="text"
                  value={currentUser?.role === 'Petugas PUPR' ? 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)' : currentUser?.role === 'Administrator' ? 'Administrator Sistem SIGAP' : currentUser?.role || ''}
                  disabled
                  className="w-full px-3 py-2 bg-[#F6F3EC] border border-[#D3C5B1] rounded-lg text-[#807667] cursor-not-allowed text-xs"
                  title="Instansi ditentukan berdasarkan peran akun Anda"
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-[#D3C5B1]/50">
                <button
                  type="submit"
                  className="bg-[#001360] text-white font-bold py-2.5 px-6 rounded-lg text-xs transition-all hover:opacity-90 flex items-center gap-2 cursor-pointer uppercase tracking-wider shadow-md"
                >
                  <span className="material-symbols-outlined text-sm font-bold">save</span> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Panel Keamanan */}
        {activeTab === 'keamanan' && (
          <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm">
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
                    className="w-full bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
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
                    className="w-full bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
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
