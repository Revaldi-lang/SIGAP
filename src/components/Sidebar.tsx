'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function Sidebar({ isOpen, onClose, isAdmin = false }: SidebarProps) {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const isLinkActive = (path: string) => pathname === path;

  const citizenMenus = [
    { name: 'Dashboard', path: '/dashboard-pelapor', icon: 'dashboard' },
    { name: 'Buat Laporan', path: '/buat-laporan', icon: 'description' },
    { name: 'Peta Dampak', path: '/peta-pelapor', icon: 'map' },
    { name: 'Pengaturan', path: '/pengaturan-profil-pelapor', icon: 'settings' }
  ];

  const adminMenus = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Manajemen Laporan', path: '/admin/laporan', icon: 'description' },
    { name: 'Peta Spasial', path: '/admin/peta', icon: 'map' },
    { name: 'Manajemen User', path: '/admin/manajemen-user', icon: 'group' },
    { name: 'Pengaturan', path: '/admin/pengaturan-profil', icon: 'settings' }
  ];

  const menus = isAdmin ? adminMenus : citizenMenus;

  return (
    <>
      {/* Dark Navy Sidebar — Tomorro-structured */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#001360' }}
      >
        {/* Brand Area */}
        <Link
          href="/"
          className="flex items-center gap-3 px-6 py-5 border-b min-h-[72px] shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
          onClick={onClose}
        >
          <div className="bg-white/10 p-2 rounded-xl border border-white/15 flex items-center justify-center w-10 h-10 shrink-0">
            <img alt="SIGAP Logo" className="h-7 w-auto object-contain" src="/assets/images/sigap.png" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">SIGAP</span>
        </Link>

        {/* User Profile Area */}
        <div
          className="px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs overflow-hidden shrink-0 border-2"
              style={{ background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.25)' }}
            >
              {currentUser?.foto ? (
                <img src={currentUser.foto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser?.username || 'User')
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-white text-xs truncate max-w-[140px]">
                {currentUser?.username || 'Budi Santoso'}
              </h3>
              <span
                className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {currentUser?.role || 'Masyarakat'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow px-3 py-4 space-y-1 overflow-y-auto">
          <p
            className="px-3 text-[9px] font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.30)' }}
          >
            Menu Utama
          </p>
          {menus.map(menu => {
            const active = isLinkActive(menu.path);
            return (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold`}
                style={
                  active
                    ? { background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderLeft: '3px solid rgba(255,255,255,0.8)' }
                    : { color: 'rgba(255,255,255,0.65)' }
                }
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                <span
                  className="material-symbols-outlined text-[18px] shrink-0"
                  style={{
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)'
                  }}
                >
                  {menu.icon}
                </span>
                <span>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Action for Citizens */}
        {!isAdmin && (
          <div
            className="px-4 py-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.10)' }}
          >
            <Link
              href="/buat-laporan"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-[28px] text-xs font-bold transition-all active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
              <span>Buat Laporan</span>
            </Link>
          </div>
        )}

        {/* Logout */}
        <div
          className="px-3 py-3 border-t shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-xs font-semibold"
            style={{ color: 'rgba(255,255,255,0.45)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
              (e.currentTarget as HTMLElement).style.color = '#ef4444';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '';
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
            }}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">logout</span>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
