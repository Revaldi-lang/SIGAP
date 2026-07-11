'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function AdminLogin() {
  const { currentUser, login, loading } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

    // Call Context Login
    const success = login(email, 'admin');
    if (success) {
      router.push('/admin');
    } else {
      setErrorMsg('Kredensial email atau kata sandi administrator salah.');
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
    <div className="flex items-center justify-center min-h-screen p-4 page-shell">
      <div className="legacy-card rounded-[1.25rem] flex w-full max-w-4xl overflow-hidden min-h-[500px] animate-fade-in">
        {/* Left Banner Area */}
        <div className="w-1/2 bg-[#001360] text-white p-12 hidden md:flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>

          <div className="relative z-10 space-y-6">
            <Link href="/" className="flex items-center gap-3 w-max">
              <div className="bg-white/10 p-2 rounded-xl border border-white/10 flex items-center justify-center">
                <img src="/assets/images/sigap.png" alt="Logo SIGAP" className="h-8 w-auto object-contain" style={{ height: '32px', width: 'auto' }} />
              </div>
              <span className="font-bold text-lg text-white">SIGAP</span>
            </Link>
            <h2 className="text-xl font-bold text-slate-100">Sistem Informasi Gerak Aduan Publik</h2>
            <p className="text-slate-300 leading-relaxed text-xs">
              Portal admin terpadu untuk memantau, memverifikasi, dan mengelola pelaporan kerusakan infrastruktur
              publik secara real-time demi pelayanan masyarakat yang lebih baik.
            </p>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1C1B18] mb-1">Selamat Datang Kembali!</h2>
            <p className="text-xs text-[#4E4639]">Silakan masukkan kredensial admin Anda untuk masuk.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 mb-4 font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider mb-2">Email Administrator</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sigap.go.id"
                  className="block w-full pl-10 pr-3 py-2.5 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => alert('Sandi di-reset oleh Admin Utama (admin@sigap.go.id)')}
                  className="text-[10px] font-bold text-[#001360] hover:underline focus:outline-none"
                >
                  Lupa Sandi?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="********"
                  className="block w-full pl-10 pr-10 py-2.5 bg-white border border-[#D3C5B1] rounded-lg focus:ring-2 focus:ring-[#001360] focus:border-transparent outline-none text-xs text-[#1C1B18] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center text-[#807667] hover:text-[#1C1B18] focus:outline-none eye-icon-wrapper"
                >
                  <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#001360] border-[#D3C5B1] focus:ring-[#001360] rounded cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 block text-[10px] text-[#4E4639] cursor-pointer select-none font-semibold">
                Ingat saya di perangkat ini
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#001360] text-white rounded-lg font-bold text-xs transition shadow-lg hover:opacity-90 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer uppercase tracking-wider"
              >
                Masuk Dasbor <span className="material-symbols-outlined text-sm">login</span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-[#D3C5B1]/50 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-[#4E4639] hover:text-[#001360] transition font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
