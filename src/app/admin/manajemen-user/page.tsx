'use client';

import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { useApp, User } from '@/context/AppContext';

export default function AdminManajemenUser() {
  const { users, updateStatusUser, hapusUserPermanen, registerWarga, loading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('semua');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaInput, setNamaInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [identitasInput, setIdentitasInput] = useState('');
  const [roleInput, setRoleInput] = useState<'Masyarakat' | 'Administrator' | 'Petugas' | 'Petugas PUPR'>('Masyarakat');

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('semua');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaInput || !emailInput || !identitasInput) {
      alert('Mohon lengkapi semua input.');
      return;
    }

    try {
      const success = registerWarga(namaInput, emailInput, identitasInput, 'password123');
      if (success) {
        alert('Pengguna baru berhasil ditambahkan! Kata sandi bawaan: password123');
        setIsModalOpen(false);
        setNamaInput('');
        setEmailInput('');
        setIdentitasInput('');
        setRoleInput('Masyarakat');
      } else {
        alert('Gagal menambahkan: Email sudah terdaftar.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan pengguna.');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini secara permanen dari sistem?')) {
      const success = await hapusUserPermanen(email);
      if (success) {
        alert('Pengguna berhasil dihapus.');
      } else {
        alert('Gagal menghapus pengguna.');
      }
    }
  };

  const handleToggleBlock = (user: User) => {
    const nextStatus = user.status === 'Blokir' ? 'Aktif' : 'Blokir';
    const actionText = user.status === 'Blokir' ? 'membuka blokir' : 'memblokir';
    if (confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.username}?`)) {
      updateStatusUser(user.email, nextStatus);
      alert(`Status akun ${user.username} diubah menjadi ${nextStatus}.`);
    }
  };

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.identitas.includes(query);
    const matchesRole = selectedRole === 'semua' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <AuthGuard allowedRoles={['Administrator']}>
      <div className="min-h-screen page-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        <main className="ml-0 md:ml-64 p-6 md:p-10 min-h-screen">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-[#001360] hover:bg-[#001360]/5 rounded-xl flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#001360] mb-0.5">Manajemen Pengguna</h1>
                <p className="text-sm text-[#807667]">Kelola akun, peran, dan status akses dari admin, petugas, serta warga.</p>
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#001360] text-white font-semibold py-2.5 px-6 rounded-[28px] text-sm transition-all hover:bg-[#223aa8] flex items-center justify-center gap-2 active:scale-[0.98] min-h-[44px] shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Tambah Pengguna
              </button>
            </div>
          </header>

          {/* Search & Filter */}
          <section className="legacy-card p-6 rounded-2xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Cari Pengguna</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, email, NIK/NIP..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm text-[#1C1B18]"
                    style={{ minHeight: '44px' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Peran (Role)</label>
                <div className="flex gap-2">
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm text-[#1C1B18] font-medium"
                    style={{ minHeight: '44px' }}
                  >
                    <option value="semua">Semua Role</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Petugas PUPR">Petugas Lapangan</option>
                    <option value="Masyarakat">Masyarakat</option>
                  </select>
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#F6F3EC] border border-[#D3C5B1] hover:bg-white text-[#1C1B18] px-3 rounded-xl flex items-center justify-center transition active:scale-[0.98] cursor-pointer min-h-[44px]"
                    title="Reset Filter"
                  >
                    <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Users Table */}
          <section className="legacy-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F6F3EC] text-[10px] font-bold uppercase tracking-wider text-[#807667] border-b border-[#E5E2E1]">
                    <th className="px-6 py-4">Profil Pengguna</th>
                    <th className="px-6 py-4 hidden md:table-cell">Kontak &amp; NIK / NIP</th>
                    <th className="px-6 py-4">Peran (Role)</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2E1] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 font-medium text-[#807667]">Menghubungkan ke database...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[#807667]">Tidak ada pengguna yang cocok.</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-[#F6F3EC] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#001360] text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                              {user.foto ? (
                                <img src={user.foto} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                getInitials(user.username)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1C1B18]">{user.username}</p>
                              <p className="text-[10px] text-[#807667] mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="font-mono text-[#1C1B18] font-semibold">{user.identitas}</p>
                          <p className="text-[10px] text-[#807667] mt-0.5">Kontak Resmi Pemda</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider bg-[#001360]/08 text-[#001360] border-[#001360]/15">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={'inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ' + (
                            user.status === 'Aktif'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          )}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleBlock(user)}
                              className={'px-3 py-1.5 rounded-[28px] text-[10px] font-semibold border transition active:scale-95 cursor-pointer ' + (
                                user.status === 'Blokir'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                              )}
                            >
                              {user.status === 'Blokir' ? 'Buka Blokir' : 'Blokir'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="px-3 py-1.5 bg-white border border-[#D3C5B1] text-[#4E4639] hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-[28px] text-[10px] font-semibold transition active:scale-95 cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1B18]/70 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in p-4">
          <div className="legacy-card rounded-2xl shadow-[0_16px_48px_rgba(0,19,96,0.18)] w-full max-w-md overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-[#001360] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Tambah Pengguna Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={namaInput}
                  onChange={e => setNamaInput(e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-4 py-3 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm text-[#1C1B18]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="contoh@sigap.go.id"
                  className="w-full px-4 py-3 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm text-[#1C1B18]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">NIK / NIP</label>
                <input
                  type="text"
                  required
                  value={identitasInput}
                  onChange={e => setIdentitasInput(e.target.value)}
                  placeholder="Masukkan NIK atau NIP..."
                  className="w-full px-4 py-3 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm font-mono text-[#1C1B18]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Peran (Role)</label>
                <select
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value as 'Masyarakat' | 'Administrator' | 'Petugas' | 'Petugas PUPR')}
                  className="w-full px-4 py-3 bg-white border border-[#D3C5B1] rounded-xl focus:ring-2 focus:ring-[#001360]/20 focus:border-[#001360] outline-none text-sm font-medium text-[#1C1B18]"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Petugas PUPR">Petugas Lapangan</option>
                  <option value="Masyarakat">Masyarakat</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E2E1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-[#4E4639] bg-[#F6F3EC] border border-[#D3C5B1] rounded-[28px] hover:bg-white transition cursor-pointer min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#001360] rounded-[28px] transition hover:bg-[#223aa8] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}

export const dynamicType = 'force-dynamic';
