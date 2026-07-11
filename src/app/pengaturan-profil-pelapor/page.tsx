'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

export default function PengaturanProfilPelapor() {
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'umum' | 'keamanan'>('umum');

  // Informasi Umum States
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('081234567890');
  const [alamat, setAlamat] = useState('Jl. Ijen No. 12, Klojen, Kota Malang');

  // Keamanan States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      setNama(currentUser.username);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleSaveUmum = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Informasi profil umum Anda berhasil diperbarui!');
  };

  const handleSaveSandi = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Kata sandi baru harus minimal 8 karakter.');
      return;
    }
    alert('Kata sandi Anda berhasil diperbarui!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AuthGuard allowedRoles={['Masyarakat']}>
      <div className="min-h-screen page-shell">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-16 min-h-screen max-w-[1100px]">
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
                <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-1">Pengaturan Profil Saya</h1>
                <p className="text-xs text-[#4E4639]">Perbarui biodata profil warga Anda dan kata sandi keamanan.</p>
              </div>
            </div>
          </header>

          {/* Avatar Banner Card */}
          <div className="legacy-card p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-[#001360] text-white flex items-center justify-center text-2xl font-bold border border-white/20 shadow-md">
                {getInitials(currentUser?.username || 'User')}
              </div>
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h3 className="text-base font-bold text-[#1C1B18]">{currentUser?.username || 'Budi Santoso'}</h3>
              <p className="text-xs text-[#4E4639] mt-1">Status Akun: <span className="text-emerald-600 font-bold">Aktif (Terverifikasi NIK)</span></p>
              <p className="text-[10px] text-[#807667] mt-1.5 font-mono">ID Akun: {currentUser?.id || '35730123'}</p>
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
              <span className="material-symbols-outlined text-sm">security</span> Keamanan &amp; Sandi
            </button>
          </div>

          {/* Panel Informasi Umum */}
          {activeTab === 'umum' && (
            <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm transition-all duration-300">
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
                    <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">NIK (KTP)</label>
                    <input
                      type="text"
                      value={currentUser?.identitas || '3573012345670001'}
                      disabled
                      className="w-full px-3 py-2 bg-[#F6F3EC] border border-[#D3C5B1] rounded-lg text-[#807667] font-mono cursor-not-allowed text-xs"
                      title="NIK resmi tidak dapat diubah secara mandiri"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={telepon}
                      onChange={e => setTelepon(e.target.value)}
                      className="legacy-input w-full px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Alamat Domisili Warga</label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={e => setAlamat(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18]"
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
            <div className="bg-white border border-[#D3C5B1] rounded-2xl p-6 shadow-sm transition-all duration-300">
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
    </AuthGuard>
  );
}
