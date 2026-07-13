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
      <nav className="bg-surface border-b-border-width-main border-black fixed top-0 left-0 w-full z-50 transition-all duration-200 h-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-h-[44px]">
            <div className="bg-primary/10 p-2 border-2 border-black flex items-center justify-center w-12 h-12 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <img alt="SIGAP Logo" className="h-8 w-auto object-contain" src="/assets/images/sigap.png" />
            </div>
            <span className="font-black text-2xl text-primary tracking-tight font-display uppercase">SIGAP</span>
          </Link>

          {/* Desktop Links */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <a className="text-xs font-bold uppercase tracking-wider text-primary hover:underline hover:decoration-border-width-sub hover:underline-offset-4" href="#info-section">Kegunaan</a>
              <a className="text-xs font-bold uppercase tracking-wider text-primary hover:underline hover:decoration-border-width-sub hover:underline-offset-4" href="#alur-section">Cara Melapor</a>
              <a className="text-xs font-bold uppercase tracking-wider text-primary hover:underline hover:decoration-border-width-sub hover:underline-offset-4" href="#proses-section">SOP Kerja</a>
              <a className="text-xs font-bold uppercase tracking-wider text-primary hover:underline hover:decoration-border-width-sub hover:underline-offset-4" href="#suara-warga-section">Suara Warga</a>
            </div>
          )}

          {/* Action Button / Profile Dropdown */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              // User Profile Dropdown (Dynamic State)
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full bg-primary hover:bg-[#223aa8] text-white font-bold flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95 border-2 border-black overflow-hidden cursor-pointer"
                >
                  {currentUser.foto ? (
                    <img src={currentUser.foto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(currentUser.username)
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b-2 border-black bg-slate-50">
                      <p className="font-bold text-primary truncate text-sm">{currentUser.username}</p>
                      <p className="text-xs text-[#4E4639] truncate">{currentUser.email}</p>
                      <span className="inline-block bg-primary text-white text-[9px] font-bold px-2 py-0.5 border-2 border-black uppercase tracking-wider mt-1.5 animate-pulse">
                        {currentUser.role}
                      </span>
                    </div>
                    <Link href={getDashboardUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-slate-100 transition-colors border-b border-black/10">
                      <span className="material-symbols-outlined text-sm text-primary">dashboard</span> Dasbor Utama
                    </Link>
                    <Link href={getProfileUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-slate-100 transition-colors border-b border-black/10">
                      <span className="material-symbols-outlined text-sm text-primary">person</span> Pengaturan Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors text-left"
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
                  className="bg-primary text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
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
          <div className="md:hidden border-t-4 border-black bg-surface px-6 py-4 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-[calc(100vh-80px)] overflow-y-auto">
            {!isDashboard && (
              <>
                <a href="#info-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Kegunaan</a>
                <a href="#alur-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Cara Melapor</a>
                <a href="#proses-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">SOP Kerja</a>
                <a href="#suara-warga-section" onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">Suara Warga</a>
              </>
            )}

            {currentUser ? (
              <div className="pt-3 border-t-2 border-black mt-3 space-y-2">
                <div className="pb-2 border-b border-black/10">
                  <p className="font-bold text-sm text-primary">{currentUser.username}</p>
                  <p className="text-xs text-[#4E4639]">{currentUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href={getDashboardUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase tracking-wider text-primary py-2 transition">
                    <span className="material-symbols-outlined text-xs text-primary">dashboard</span> Dasbor
                  </Link>
                  <Link href={getProfileUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-bold uppercase tracking-wider text-primary py-2 transition">
                    <span className="material-symbols-outlined text-xs text-primary">person</span> Profil
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider py-2.5 transition border-2 border-red-300"
                >
                  <span className="material-symbols-outlined text-xs text-red-600">logout</span> Keluar Sesi
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    if (onOpenAuthModal) onOpenAuthModal();
                  }}
                  className="w-full bg-primary text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-xs py-3 transition text-center uppercase tracking-wider cursor-pointer"
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

