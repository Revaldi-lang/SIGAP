import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSession, SESSION_COOKIE, SessionRole } from '@/lib/session';

const STAFF_ROLES: SessionRole[] = ['Administrator', 'Petugas PUPR', 'Petugas'];

const ADMIN_PREFIX = '/admin';
const CITIZEN_PREFIXES = [
  '/dashboard-pelapor',
  '/buat-laporan',
  '/peta-pelapor',
  '/pengaturan-profil-pelapor',
  '/detail-laporan-pelapor'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isCitizenRoute = CITIZEN_PREFIXES.some(
    p => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isAdminRoute && !isCitizenRoute) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? decodeSession(token) : null;

  // No valid session -> redirect to the matching login portal.
  if (!user) {
    const loginPath = isAdminRoute ? '/login' : '/login-masyarakat';
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  // Role enforcement (server-side, not just client AuthGuard).
  const isStaff = STAFF_ROLES.includes(user.role as SessionRole);
  if (isAdminRoute && !isStaff) {
    return NextResponse.redirect(new URL('/dashboard-pelapor', request.url));
  }
  if (isCitizenRoute && isStaff) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard-pelapor/:path*',
    '/buat-laporan/:path*',
    '/peta-pelapor/:path*',
    '/pengaturan-profil-pelapor/:path*',
    '/detail-laporan-pelapor/:path*'
  ]
};
