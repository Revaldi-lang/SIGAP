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
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col p-6 z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <Link href="/" className="flex items-center gap-3 px-2 py-4 mb-6 min-h-[44px]" onClick={onClose}>
          <div className="bg-primary/5 p-2 rounded-lg border border-slate-100 flex items-center justify-center w-10 h-10 shrink-0">
            <img alt="SIGAP Logo" className="h-6 w-auto object-contain" src="/assets/images/sigap.png" />
          </div>
          <span className="font-extrabold text-xl text-primary tracking-tight font-sans uppercase">SIGAP</span>
        </Link>

        {/* User Profile Area */}
        <div className="px-2 mb-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs overflow-hidden">
              {currentUser?.foto ? (
                <img src={currentUser.foto} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser?.username || 'User')
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-slate-800 text-xs truncate max-w-[130px]">
                {currentUser?.username || 'Budi Santoso'}
              </h3>
              <p className="text-[9px] text-slate-500 tracking-wider uppercase font-bold mt-0.5">
                {currentUser?.role || 'Masyarakat'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow space-y-2">
          {menus.map(menu => {
            const active = isLinkActive(menu.path);
            return (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 transition-all text-xs font-semibold rounded-lg border ${
                  active
                    ? 'bg-primary text-white font-bold border-primary shadow-sm'
                    : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900'
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
              className="w-full bg-primary text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/95 transition-all text-xs font-semibold shadow-sm border border-primary"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>Buat Laporan</span>
            </Link>
          </div>
        )}

        {/* Logout Action */}
        <div className="border-t border-slate-100 pt-4 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-lg px-3.5 py-2.5 transition-all text-left text-xs font-semibold cursor-pointer"
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
