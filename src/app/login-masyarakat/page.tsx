'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useApp } from '@/context/AppContext';

export default function LoginMasyarakat() {
  const { currentUser, login, loginGoogle, loading } = useApp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Safety fallback: ensure form is displayed if loading takes > 1.5s
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && currentUser) {
      if (currentUser.role === 'Masyarakat') {
        router.replace('/dashboard-pelapor');
      } else {
        router.replace('/admin');
      }
    }
  }, [currentUser, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const result = await login(email, password, 'pelapor');
    if (result.success) {
      router.push('/dashboard-pelapor');
    } else if (result.reason === 'wrong_portal') {
      setErrorMsg('Akun ini bukan akun masyarakat. Gunakan portal Admin / Petugas untuk masuk.');
    } else if (result.reason === 'blocked') {
      setErrorMsg('Akun Anda telah diblokir. Hubungi administrator untuk informasi lebih lanjut.');
    } else {
      setErrorMsg('Alamat email atau kata sandi salah / akun belum terdaftar.');
    }
  };

  if ((loading && !pageReady) || currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-semibold animate-pulse">Memuat Portal Warga...</p>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md legacy-card rounded-[1.25rem] p-4 sm:p-8 animate-fade-in">
        <div className="text-center mb-6">
          <Logo size="md" showWordmark={false} className="mx-auto mb-3 justify-center" />
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Portal Warga / Pelapor</h2>
          <p className="text-xs text-slate-500 mt-1">Silakan masuk untuk membuat aduan atau melacak proses laporan Anda.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 mb-4 font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#5c6268] uppercase tracking-wider mb-2">Alamat Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#5c6268] text-sm" aria-hidden="true">mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="budi.santoso@gmail.com"
                className="w-full bg-white border border-[#e4e2dc] rounded-lg pl-10 pr-4 py-2.5 text-xs text-[#0f172a] focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-[#5c6268] uppercase tracking-wider">Kata Sandi</label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Fitur pemulihan sandi masyarakat sedang disinkronkan.'); }}
                className="text-[10px] font-bold text-[#0c0f12] hover:underline"
              >
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#5c6268] text-sm" aria-hidden="true">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-white border border-[#e4e2dc] rounded-lg pl-10 pr-10 py-2.5 text-xs text-[#0f172a] focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5c6268] hover:text-[#0f172a] transition eye-icon-wrapper p-2"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-[#e4e2dc] text-[#0c0f12] focus:ring-accent h-4 w-4 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-[10px] text-[#5c6268] cursor-pointer select-none font-medium">
              Ingat sesi masuk saya di perangkat ini
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0c0f12] text-white font-bold py-3 px-4 rounded-lg text-xs transition shadow-lg hover:opacity-90 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer uppercase tracking-wider"
            >
              Masuk Sekarang <span className="material-symbols-outlined text-sm" aria-hidden="true">login</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#e4e2dc]/50"></div>
            <span className="flex-shrink mx-4 text-[10px] text-[#5c6268] font-semibold uppercase">atau</span>
            <div className="flex-grow border-t border-[#e4e2dc]/50"></div>
          </div>

          <div>
            <button
              type="button"
              onClick={loginGoogle}
              className="w-full bg-white border border-[#e4e2dc] text-[#0f172a] hover:bg-slate-50 font-bold py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" className="w-4 h-4 object-contain" alt="Google Logo" />
              Masuk dengan Google
            </button>
          </div>
        </form>

        <div className="space-y-3 mt-6 pt-4 border-t border-[#e4e2dc]/50 text-center text-xs">
          <div className="text-[#5c6268] text-[11px]">
            Belum memiliki akun? <Link href="/register" className="text-[#0c0f12] font-bold hover:underline">Daftar di sini</Link>
          </div>
          <div>
            <Link href="/" className="text-[#5c6268] hover:text-[#0c0f12] transition flex items-center justify-center gap-1 font-semibold text-[11px]">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
