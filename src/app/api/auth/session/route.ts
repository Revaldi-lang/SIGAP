import { NextRequest, NextResponse } from 'next/server';
import { decodeSession, encodeSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? decodeSession(token) : null;

  // Sliding session: while the user is active, extend the cookie expiry.
  if (user) {
    const response = NextResponse.json({ user });
    response.cookies.set(SESSION_COOKIE, encodeSession(user, SESSION_MAX_AGE), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE
    });
    return response;
  }

  return NextResponse.json({ user: null });
}
