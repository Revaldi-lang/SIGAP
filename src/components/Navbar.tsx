'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

interface NavbarProps {
  onOpenAuthModal?: () => void;
  isDashboard?: boolean;
}

export default function Navbar({ onOpenAuthModal, isDashboard = false }: NavbarProps) {
  const { currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const getDashboardUrl = () => {
    if (!currentUser) return '/';
    return currentUser.role === 'Masyarakat' ? '/dashboard-pelapor' : '/admin';
  };

  const getProfileUrl = () => {
    if (!currentUser) return '/';
    return currentUser.role === 'Masyarakat' ? '/pengaturan-profil-pelapor' : '/admin/pengaturan-profil';
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 w-full z-50 transition-all duration-200 h-20 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-h-[44px]">
            <div className="bg-primary/5 p-2 rounded-lg border border-slate-100 flex items-center justify-center w-10 h-10 shrink-0">
              <img alt="SIGAP Logo" className="h-6 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-extrabold text-xl text-primary tracking-tight font-sans uppercase">SIGAP</span>
          </Link>

          {/* Desktop Links */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <a className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors" href="#info-section">Kegunaan</a>
              <a className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors" href="#alur-section">Cara Melapor</a>
              <a className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors" href="#proses-section">SOP Kerja</a>
              <a className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-primary transition-colors" href="#suara-warga-section">Suara Warga</a>
            </div>
          )}

          {/* Action Button / Profile Dropdown */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              // User Profile Dropdown (Dynamic State)
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-9 h-9 rounded-full bg-primary/10 hover:opacity-90 text-primary font-semibold flex items-center justify-center text-xs transition-all active:scale-95 border border-slate-200 overflow-hidden cursor-pointer"
                >
                  {currentUser.foto ? (
                    <img src={currentUser.foto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(currentUser.username)
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-md py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
                      <p className="font-semibold text-primary truncate text-sm">{currentUser.username}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
                        {currentUser.role}
                      </span>
                    </div>
                    <Link href={getDashboardUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100">
                      <span className="material-symbols-outlined text-sm text-slate-500">dashboard</span> Dasbor Utama
                    </Link>
                    <Link href={getProfileUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100">
                      <span className="material-symbols-outlined text-sm text-slate-500">person</span> Pengaturan Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-sm text-red-600">logout</span> Keluar Sesi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login Trigger
              <div className="hidden md:block">
                <button
                  onClick={onOpenAuthModal}
                  className="bg-primary text-white rounded-lg px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:bg-primary/95 shadow-sm cursor-pointer"
                >
                  Masuk Portal
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-primary flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3 shadow-md max-h-[calc(100vh-80px)] overflow-y-auto">
            {!isDashboard && (
              <>
                <a href="#info-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Kegunaan</a>
                <a href="#alur-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Cara Melapor</a>
                <a href="#proses-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">SOP Kerja</a>
                <a href="#suara-warga-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Suara Warga</a>
              </>
            )}

            {currentUser ? (
              <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
                <div className="pb-2 border-b border-slate-100">
                  <p className="font-bold text-sm text-primary">{currentUser.username}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href={getDashboardUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-primary py-2 transition shadow-sm">
                    <span className="material-symbols-outlined text-xs text-primary">dashboard</span> Dasbor
                  </Link>
                  <Link href={getProfileUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-primary py-2 transition shadow-sm">
                    <span className="material-symbols-outlined text-xs text-primary">person</span> Profil
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider py-2.5 transition rounded-lg border border-red-200"
                >
                  <span className="material-symbols-outlined text-xs text-red-600">logout</span> Keluar Sesi
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={closeMobileMenu}
                  className="w-full bg-primary text-white font-bold text-xs py-3 transition text-center uppercase tracking-wider cursor-pointer rounded-lg shadow-sm"
                >
                  Masuk Portal
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[40] md:hidden" onClick={closeMobileMenu}></div>
      )}
    </>
  );
}

