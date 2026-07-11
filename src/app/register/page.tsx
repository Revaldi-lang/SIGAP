'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function RegisterWarga() {
  const { currentUser, registerWarga, loading } = useApp();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [identitas, setIdentitas] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.role === 'Masyarakat') {
        router.replace('/dashboard-pelapor');
      } else {
        router.replace('/admin');
      }
    }
  }, [currentUser, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // NIK validation
    if (identitas.length !== 16 || !/^d+$/.test(identitas)) {
      setErrorMsg('NIK (KTP) harus berupa 16 digit angka.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Kata sandi harus minimal 6 karakter.');
      return;
    }

    // Call Context Register
    const success = registerWarga(username, email, identitas, password);
    if (success) {
      setSuccessMsg('Akun warga baru berhasil dibuat! Dialihkan ke halaman login...');
      setTimeout(() => {
        router.push('/login-masyarakat');
      }, 2000);
    } else {
      setErrorMsg('Gagal mendaftar: Alamat email sudah digunakan.');
    }
  };

  if (loading || currentUser) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#001360] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-xl legacy-card rounded-[1.25rem] p-4 sm:p-8 animate-fade-in">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex bg-[#001360]/10 p-2 rounded-xl mb-3 w-16 h-16 items-center justify-center border border-[#001360]/20 hover:bg-[#001360]/20 transition" style={{ width: '64px', height: '64px' }}>
            <img src="/assets/images/sigap.png" alt="Logo SIGAP" className="w-full h-full object-contain" style={{ height: '48px', width: 'auto' }} />
          </Link>
          <h2 className="text-2xl font-bold text-[#1C1B18] tracking-tight">Daftar Akun SIGAP</h2>
          <p className="text-xs text-[#4E4639] mt-1">Lengkapi data diri Anda untuk mulai melaporkan aduan infrastruktur.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 mb-4 font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-600 text-xs p-3 rounded-lg border border-green-200 mb-4 font-semibold text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Nama Lengkap</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">person</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Budi Santoso"
                  className="w-full bg-white border border-[#D3C5B1] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1C1B18] focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">NIK (KTP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">badge</span>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={identitas}
                  onChange={e => setIdentitas(e.target.value.replace(/D/g, ''))}
                  placeholder="3573xxxxxxxxxxxx"
                  className="w-full bg-white border border-[#D3C5B1] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1C1B18] focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none transition font-mono tracking-wider"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Alamat Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="budi.santoso@gmail.com"
                className="w-full bg-white border border-[#D3C5B1] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1C1B18] focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Kata Sandi</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-white border border-[#D3C5B1] rounded-lg pl-10 pr-10 py-2.5 text-xs text-[#1C1B18] focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#807667] hover:text-[#1C1B18] transition eye-icon-wrapper"
                >
                  <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Konfirmasi Sandi</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">verified_user</span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-white border border-[#D3C5B1] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#1C1B18] focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              required
              id="agree"
              className="rounded border-[#D3C5B1] text-[#001360] focus:ring-[#001360] h-4 w-4 mt-0.5 cursor-pointer"
            />
            <label htmlFor="agree" className="ml-2 text-[10px] text-[#4E4639] cursor-pointer select-none leading-normal font-medium">
              Saya menyatakan bahwa data yang saya masukkan adalah benar dan siap mematuhi <a href="#" onClick={(e) => { e.preventDefault(); alert('Ketentuan Penggunaan Platform SIGAP'); }} className="text-[#001360] font-bold hover:underline">Syarat &amp; Ketentuan</a> penggunaan platform SIGAP.
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#001360] text-white font-bold py-3 px-4 rounded-lg text-xs transition shadow-lg hover:opacity-90 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">person_add</span> Buat Akun Baru
            </button>
          </div>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[#D3C5B1]/50 text-xs text-[#4E4639]">
          Sudah memiliki akun? <Link href="/login-masyarakat" className="text-[#001360] font-bold hover:underline">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
