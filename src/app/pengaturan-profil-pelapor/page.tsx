'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

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
  const [telepon, setTelepon] = useState(currentUser?.telepon || '081234567890');
  const [alamat, setAlamat] = useState(currentUser?.alamat || 'Jl. Ijen No. 12, Klojen, Kota Malang');

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
    }
  }, [currentUser]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleSaveUmum = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateUserProfile(nama, email, telepon, alamat);
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
              <p className="text-xs text-[#4E4639]">Kelola data diri dan keamanan sandi akun pelapor Anda.</p>
            </div>
          </div>
        </header>

        {/* Avatar Banner Card */}
        <div className="legacy-card p-6 rounded-xl flex items-center gap-6 mb-8 shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#001360] text-white font-bold flex items-center justify-center text-lg border-2 border-white shadow-md">
            {getInitials(nama)}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1C1B18]">{nama || 'Nama Pengguna'}</h3>
            <p className="text-xs text-[#4E4639] mt-0.5">{email || 'email@domain.com'}</p>
            <span className="inline-block bg-[#001360]/10 text-[#001360] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#001360]/10 uppercase tracking-wider mt-2">
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
                  className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18] resize-none"
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
