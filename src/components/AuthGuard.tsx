'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('Masyarakat' | 'Administrator' | 'Petugas' | 'Petugas PUPR')[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { currentUser, loading } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!currentUser) {
      if (pathname.startsWith('/admin')) {
        router.replace('/login');
      } else {
        router.replace('/login-masyarakat');
      }
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      if (currentUser.role === 'Masyarakat') {
        router.replace('/dashboard-pelapor');
      } else {
        router.replace('/admin');
      }
    }
  }, [currentUser, loading, router, pathname, allowedRoles]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#001360] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold mt-4 text-[#4E4639]">Menyelaraskan data sesi...</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}
