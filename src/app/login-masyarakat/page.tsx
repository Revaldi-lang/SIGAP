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
    
    const success = login(email, 'pelapor');
    if (success) {
      router.push('/dashboard-pelapor');
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
      <div className="w-full max-w-md bg-white border border-[#E5E1DA] rounded-[1.5rem] shadow-[0_18px_50px_rgba(0,19,96,0.08)] p-4 sm:p-8 animate-fade-in">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex bg-[#001360]/10 p-2 rounded-xl mb-3 w-16 h-16 items-center justify-center border border-[#001360]/20 hover:bg-[#001360]/20 transition" style={{ width: '64px', height: '64px' }}>
            <img src="/assets/images/sigap.png" alt="Logo SIGAP" className="w-full h-full object-contain" style={{ height: '48px', width: 'auto' }} />
          </Link>
          <h2 className="text-2xl font-bold text-[#1C1B18] tracking-tight">Portal Warga / Pelapor</h2>
          <p className="text-xs text-[#4E4639] mt-1">Silakan masuk untuk membuat aduan atau melacak berkas laporan Anda.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 mb-4 font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-[#4E4639] uppercase tracking-wider">Kata Sandi</label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Fitur pemulihan sandi masyarakat sedang disinkronkan.'); }}
                className="text-[10px] font-bold text-[#001360] hover:underline"
              >
                Lupa Sandi?
              </a>
            </div>
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

          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="remember"
              className="rounded border-[#D3C5B1] text-[#001360] focus:ring-[#001360] h-4 w-4 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-[10px] text-[#4E4639] cursor-pointer select-none font-medium">
              Ingat sesi masuk saya di perangkat ini
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#001360] text-white font-bold py-3 px-4 rounded-lg text-xs transition shadow-lg hover:opacity-90 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer uppercase tracking-wider"
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
              className="w-full bg-white border border-[#D3C5B1] text-[#1C1B18] hover:bg-slate-50 font-bold py-2.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" className="w-4 h-4 object-contain" alt="Google Logo" />
              Masuk dengan Google
            </button>
          </div>
        </form>

        <div className="space-y-3 mt-6 pt-4 border-t border-[#D3C5B1]/50 text-center text-xs">
          <div className="text-[#4E4639] text-[11px]">
            Belum memiliki akun? <Link href="/register" className="text-[#001360] font-bold hover:underline">Daftar di sini</Link>
          </div>
          <div>
            <Link href="/" className="text-[#4E4639] hover:text-[#001360] transition flex items-center justify-center gap-1 font-semibold text-[11px]">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
