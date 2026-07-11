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
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#FCF9F8] border-r border-[#E5E1DA] flex flex-col p-6 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="bg-[#001360]/10 p-2 rounded-xl border border-[#001360]/20 flex items-center justify-center">
            <img alt="SIGAP Logo" className="h-8 w-auto object-contain" src="/assets/images/sigap.png" style={{ height: '32px', width: 'auto' }} />
          </div>
          <span className="font-bold text-lg text-[#001360]">SIGAP</span>
        </div>

        {/* User Profile Area */}
        <div className="px-2 mb-6 border-b border-[#D3C5B1]/50 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#001360] flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
              {getInitials(currentUser?.username || 'User')}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-[#1C1B18] text-xs truncate max-w-[130px]">
                {currentUser?.username || 'Budi Santoso'}
              </h3>
              <p className="text-[9px] text-[#4E4639] tracking-wider uppercase font-bold mt-0.5">
                {currentUser?.role || 'Masyarakat'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow space-y-1">
          {menus.map(menu => {
            const active = isLinkActive(menu.path);
            return (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-xs font-semibold ${
                  active
                    ? 'bg-[#001360] text-white font-bold shadow-md'
                    : 'text-[#4E4639] hover:bg-[#FEFDF8] hover:text-[#001360]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
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
          <div className="px-2 pb-4">
            <Link
              href="/buat-laporan"
              onClick={onClose}
              className="w-full bg-[#001360] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all text-xs font-bold shadow-md"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Buat Laporan</span>
            </Link>
          </div>
        )}

        {/* Logout Action */}
        <div className="border-t border-[#D3C5B1]/50 pt-4 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors text-left text-xs font-bold"
          >
            <span className="material-symbols-outlined text-sm text-red-600">logout</span>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[40] md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}
