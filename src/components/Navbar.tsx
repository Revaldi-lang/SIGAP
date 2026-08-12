'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react';
import NavbarLogo from '@/components/Logo';
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

  const navLinks = [
    { href: '/#info-section', label: 'Kegunaan' },
    { href: '/#alur-section', label: 'Cara Melapor' },
    { href: '/#proses-section', label: 'SOP Kerja' },
    { href: '/#suara-warga-section', label: 'Suara Warga' }
  ];

  return (
    <>
      <nav className="bg-white border-b border-outline fixed top-0 left-0 w-full z-50 transition-all duration-200 h-20 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1280px] mx-auto h-full">
          {/* Logo */}
          <NavbarLogo />

          {/* Desktop Links */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-semibold text-primary transition-colors" href="/">Beranda</Link>
              {navLinks.map(l => (
                <Link key={l.href} className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Action Button / Profile Dropdown */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              // User Profile Dropdown (Dynamic State)
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  aria-label="Menu profil pengguna"
                  className="w-9 h-9 rounded-full bg-primary/10 hover:opacity-90 text-primary font-semibold flex items-center justify-center text-xs transition-all active:scale-95 border border-outline overflow-hidden cursor-pointer"
                >
                  {currentUser.foto ? (
                    <img src={currentUser.foto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(currentUser.username)
                  )}
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-outline rounded-lg shadow-md py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-outline bg-surface/50">
                      <p className="font-semibold text-primary truncate text-sm">{currentUser.username}</p>
                      <p className="text-xs text-on-surface-variant truncate">{currentUser.email}</p>
                      <span className="inline-block bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1.5">
                        {currentUser.role}
                      </span>
                    </div>
                    <Link href={getDashboardUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface hover:bg-surface transition-colors border-b border-outline">
                      <LayoutDashboard className="w-4 h-4 text-on-surface-variant" aria-hidden="true" /> Dasbor Utama
                    </Link>
                    <Link href={getProfileUrl()} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-on-surface hover:bg-surface transition-colors border-b border-outline">
                      <User className="w-4 h-4 text-on-surface-variant" aria-hidden="true" /> Pengaturan Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-error hover:bg-error/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-error" aria-hidden="true" /> Keluar Sesi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Login Trigger
              <div className="hidden md:block">
                <button
                  onClick={onOpenAuthModal}
                  aria-label="Masuk ke portal SIGAP"
                  className="bg-primary text-white rounded-md px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all hover:bg-primary/90 shadow-sm cursor-pointer"
                >
                  Masuk Portal
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-primary flex items-center justify-center p-2 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline bg-white px-6 py-4 space-y-3 shadow-md max-h-[calc(100vh-80px)] overflow-y-auto">
            {!isDashboard && (
              <>
                {navLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={closeMobileMenu} className="block text-xs font-bold uppercase tracking-wider text-primary py-1 transition-colors hover:underline">
                    {l.label}
                  </Link>
                ))}
              </>
            )}

            {currentUser ? (
              <div className="pt-3 border-t border-outline mt-3 space-y-2">
                <div className="pb-2 border-b border-outline">
                  <p className="font-bold text-sm text-primary">{currentUser.username}</p>
                  <p className="text-xs text-on-surface-variant">{currentUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Link href={getDashboardUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-surface border border-outline rounded-md text-xs font-bold uppercase tracking-wider text-primary py-2 transition shadow-sm">
                    <LayoutDashboard className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Dasbor
                  </Link>
                  <Link href={getProfileUrl()} onClick={closeMobileMenu} className="flex items-center justify-center gap-2 bg-white hover:bg-surface border border-outline rounded-md text-xs font-bold uppercase tracking-wider text-primary py-2 transition shadow-sm">
                    <User className="w-3.5 h-3.5 text-primary" aria-hidden="true" /> Profil
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-error/10 hover:bg-error/15 text-error text-xs font-bold uppercase tracking-wider py-2.5 transition rounded-md border border-error/20"
                >
                  <LogOut className="w-3.5 h-3.5 text-error" aria-hidden="true" /> Keluar Sesi
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={() => { closeMobileMenu(); onOpenAuthModal?.(); }}
                  aria-label="Masuk ke portal SIGAP"
                  className="w-full bg-primary text-white font-bold text-xs py-3 transition text-center uppercase tracking-wider cursor-pointer rounded-md shadow-sm"
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
