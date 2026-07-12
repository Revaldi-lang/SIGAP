'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function LoginMasyarakat() {
  const { currentUser, login, loginGoogle, loading } = useApp();
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

    const result = login(email, password, 'pelapor');
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

  if (loading || currentUser) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#001360] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="page-shell flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md legacy-card rounded-2xl p-6 sm:p-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex bg-[#001360]/10 p-2.5 rounded-xl mb-4 w-14 h-14 items-center justify-center border border-[#001360]/15 hover:bg-[#001360]/15 transition shrink-0">
            <img src="/assets/images/sigap.png" alt="Logo SIGAP" className="h-8 w-auto object-contain" />
          </Link>
          <h2 className="text-2xl font-bold text-[#1C1B18] tracking-tight">Portal Warga / Pelapor</h2>
          <p className="text-sm text-[#807667] mt-1.5 leading-relaxed">Silakan masuk untuk membuat aduan atau melacak berkas laporan Anda.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 mb-5 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#1C1B18] mb-2">Alamat Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="budi.santoso@gmail.com"
                className="w-full bg-white border border-[#D3C5B1] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1C1B18] focus:border-[#001360] focus:ring-2 focus:ring-[#001360]/15 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-[#1C1B18]">Kata Sandi</label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Fitur pemulihan sandi masyarakat sedang disinkronkan.'); }}
                className="text-sm font-semibold text-[#001360] hover:underline"
              >
                Lupa Sandi?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#807667] text-sm">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#D3C5B1] rounded-xl pl-10 pr-12 py-3 text-sm text-[#1C1B18] focus:border-[#001360] focus:ring-2 focus:ring-[#001360]/15 outline-none transition"
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

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-[#D3C5B1] text-[#001360] focus:ring-[#001360]/20 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-[#4E4639] cursor-pointer select-none font-medium">
              Ingat sesi masuk saya di perangkat ini
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#001360] text-white font-semibold py-3.5 px-4 rounded-[28px] text-sm transition shadow-lg hover:bg-[#223aa8] flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer min-h-[48px]"
            >
              Masuk Sekarang <span className="material-symbols-outlined text-sm">login</span>
            </button>
          </div>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#D3C5B1]/50"></div>
            <span className="flex-shrink mx-4 text-[10px] text-[#4E4639] font-semibold uppercase">atau</span>
            <div className="flex-grow border-t border-[#D3C5B1]/50"></div>
          </div>

          <div>
            <button
              type="button"
              onClick={loginGoogle}
              className="w-full bg-white border border-[#D3C5B1] text-[#1C1B18] hover:bg-[#F6F3EC] font-semibold py-3 px-4 rounded-[28px] text-sm transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm min-h-[48px]"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" className="w-4 h-4 object-contain" alt="Google Logo" />
              Masuk dengan Google
            </button>
          </div>
        </form>

        <div className="space-y-3 mt-6 pt-5 border-t border-[#E5E2E1] text-center">
          <div className="text-sm text-[#807667]">
            Belum memiliki akun? <Link href="/register" className="text-[#001360] font-semibold hover:underline">Daftar di sini</Link>
          </div>
          <div>
            <Link href="/" className="text-sm text-[#807667] hover:text-[#001360] transition flex items-center justify-center gap-1 font-medium">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
