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
      // In this local mock setup, we register user as Masyarakat or custom roles in context
      const success = registerWarga(namaInput, emailInput, identitasInput, 'password123', roleInput);
      if (success) {
        // If they chose a custom role (like Admin/Petugas), we update their role
        // For local mock simplicity, this registers the user in Supabase users table!
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

  // Filter Logic
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
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isAdmin={true} />

        {/* Main Content Area */}
        <main className="ml-0 md:ml-64 p-6 md:p-12 min-h-screen max-w-[1440px]">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Manajemen Pengguna</h1>
                <p className="text-xs text-slate-500">Kelola akun, peran, dan status akses dari admin, petugas, serta warga.</p>
              </div>
            </div>
            <div className="flex items-center shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-primary text-white font-semibold py-2.5 px-5 rounded-lg text-xs transition-all hover:bg-primary/95 flex items-center justify-center gap-2 active:scale-[0.98] min-h-[40px] shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">person_add</span> Tambah Pengguna
              </button>
            </div>
          </header>

          {/* Search & Filter Card */}
          <section className="legacy-card p-6 rounded-xl mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Cari Pengguna</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, email, NIK/NIP..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Peran (Role)</label>
                <div className="flex gap-2">
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs text-slate-800 font-semibold"
                  >
                    <option value="semua">Semua Role</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Petugas PUPR">Petugas Lapangan</option>
                    <option value="Masyarakat">Masyarakat</option>
                  </select>
                  <button
                    onClick={handleResetFilters}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 rounded-lg flex items-center justify-center transition active:scale-[0.98] cursor-pointer"
                    title="Reset Filter"
                  >
                    <span className="material-symbols-outlined text-sm">filter_alt_off</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Users Table */}
          <section className="legacy-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-4 font-semibold">Profil Pengguna</th>
                    <th className="px-6 py-4 hidden md:table-cell font-semibold">Kontak &amp; NIK / NIP</th>
                    <th className="px-6 py-4 font-semibold">Peran (Role)</th>
                    <th className="px-6 py-4 font-semibold">Status Akun</th>
                    <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 font-bold text-slate-500">Menghubungkan ke database...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-500">Tidak ada pengguna yang cocok.</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs overflow-hidden">
                              {user.foto ? (
                                <img src={user.foto} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                getInitials(user.username)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{user.username}</p>
                              <p className="text-[10px] text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="font-mono text-slate-700 font-semibold">{user.identitas}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Kontak Resmi Pemda</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-700">{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={"inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider " + (
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
                              className={"px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition active:scale-95 cursor-pointer " + (
                                user.status === 'Blokir'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                                  : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                              )}
                            >
                              {user.status === 'Blokir' ? 'Buka Blokir' : 'Blokir'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-[10px] font-semibold transition active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative mx-4">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">person_add</span> Tambah Pengguna Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition text-2xl focus:outline-none">&times;</button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={namaInput}
                  onChange={e => setNamaInput(e.target.value)}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="contoh@sigap.go.id"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">NIK / NIP</label>
                <input
                  type="text"
                  required
                  value={identitasInput}
                  onChange={e => setIdentitasInput(e.target.value)}
                  placeholder="Masukkan NIK atau NIP..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Peran (Role)</label>
                <select
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value as 'Masyarakat' | 'Administrator' | 'Petugas' | 'Petugas PUPR')}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-xs font-semibold text-slate-800"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Petugas PUPR">Petugas Lapangan</option>
                  <option value="Masyarakat">Masyarakat</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg transition hover:bg-primary/95 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">save</span> Simpan Pengguna
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
