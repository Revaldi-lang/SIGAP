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
    return currentUser.role === 'Masyarakat' ? '/pengaturan-profil-pelapor' : '/pengaturan-profil';
  };

  return (
    <>
      <nav className="bg-[#FEFDF8] border-b border-[#D3C5B1] fixed top-0 left-0 w-full z-50 transition-all duration-200 h-20">
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <div className="bg-[#001360]/10 p-2 rounded-xl border border-[#001360]/20 flex items-center justify-center">
              <img alt="SIGAP Logo" className="h-8 w-auto object-contain" src="/assets/images/sigap.png" style={{ height: '32px', width: 'auto' }} />
            </div>
            <span className="font-bold text-xl text-[#001360] tracking-tight">SIGAP</span>
          </Link>

          {/* Desktop Links */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium text-[#4E4639] hover:text-[#001360] transition-colors" href="#info-section">Kegunaan</a>
              <a className="text-sm font-medium text-[#4E4639] hover:text-[#001360] transition-colors" href="#alur-section">Cara Melapor</a>
              <a className="text-sm font-medium text-[#4E4639] hover:text-[#001360] transition-colors" href="#proses-section">SOP Kerja</a>
              <a className="text-sm font-medium text-[#4E4639] hover:text-[#001360] transition-colors" href="#suara-warga-section">Suara Warga</a>
            </div>
          )}

          {/* Action Button / Profile Dropdown */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              // User Profile Dropdown (Dynamic State)
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full bg-[#001360] hover:bg-[#223aa8] text-white font-bold flex items-center justify-center text-sm shadow-md transition-all active:scale-95 border border-white/20"
                >
                  {getInitials(currentUser.username)}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-[#D3C5B1] rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#D3C5B1]/50">
                      <p className="font-bold text-[#1C1B18] truncate text-sm">{currentUser.username}</p>
                      <p className="text-xs text-[#4E4639] truncate">{currentUser.email}</p>
                      <span className="inline-block bg-[#001360]/10 text-[#001360] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#001360]/10 uppercase tracking-wider mt-1.5">
                        {currentUser.role}
                      </span>
                    </div>
                    <Link href={getDashboardUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1C1B18] hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-sm text-[#001360]">gauge</span> Dasbor Utama
                    </Link>
                    <Link href={getProfileUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1C1B18] hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-sm text-[#001360]">person</span> Pengaturan Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full border-t border-[#D3C5B1]/50 mt-1 flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
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
                  className="bg-[#001360] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 hover:opacity-90"
                >
                  Masuk Portal
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-[#001360]"
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#D3C5B1] bg-[#FEFDF8] px-6 py-4 space-y-3 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
            {!isDashboard && (
              <>
                <a href="#info-section" onClick={closeMobileMenu} className="block text-sm font-bold text-[#4E4639] hover:text-[#001360] py-1 transition-colors">Kegunaan</a>
                <a href="#alur-section" onClick={closeMobileMenu} className="block text-sm font-bold text-[#4E4639] hover:text-[#001360] py-1 transition-colors">Cara Melapor</a>
                <a href="#proses-section" onClick={closeMobileMenu} className="block text-sm font-bold text-[#4E4639] hover:text-[#001360] py-1 transition-colors">SOP Kerja</a>
                <a href="#suara-warga-section" onClick={closeMobileMenu} className="block text-sm font-bold text-[#4E4639] hover:text-[#001360] py-1 transition-colors">Suara Warga</a>
              </>
            )}

            {currentUser ? (
              <div className="pt-3 border-t border-[#D3C5B1]/50 mt-3 space-y-2">
                <div className="pb-2">
                  <p className="font-bold text-sm text-[#1C1B18]">{currentUser.username}</p>
                  <p className="text-xs text-[#4E4639]">{currentUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href={getDashboardUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-[#D3C5B1] text-xs font-bold text-[#1C1B18] py-2.5 rounded-xl transition text-center">
                    <span className="material-symbols-outlined text-xs text-[#001360]">gauge</span> Dasbor
                  </Link>
                  <Link href={getProfileUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-[#D3C5B1] text-xs font-bold text-[#1C1B18] py-2.5 rounded-xl transition text-center">
                    <span className="material-symbols-outlined text-xs text-[#001360]">person</span> Profil
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl transition text-center border border-red-200"
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
                  className="w-full bg-[#001360] text-white font-bold text-xs py-3 rounded-lg transition text-center uppercase tracking-wider"
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
