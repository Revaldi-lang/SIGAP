import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { encodeSession, SESSION_COOKIE, SESSION_MAX_AGE, SessionUser, SessionRole } from '@/lib/session';

const setSessionCookie = (response: NextResponse, user: SessionUser) => {
  response.cookies.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE
  });
};

// Rate limiting sederhana (in-memory). Berlaku per proses/serverless instance;
// cukup untuk memperlambat brute-force lokal. Untuk multi-instance gunakan
// penyimpanan bersama (mis. Redis/Upstash) atau penebalan per-akun di database.
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

const getClientKey = (request: NextRequest, email: string): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `${ip}:${email.toLowerCase()}`;
};

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record) return false;
  if (now >= record.resetAt) {
    attempts.delete(key);
    return false;
  }
  return record.count >= LOGIN_MAX_ATTEMPTS;
};

const recordFailure = (key: string) => {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now >= record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    record.count += 1;
  }
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) {
      if (Date.now() >= v.resetAt) attempts.delete(k);
    }
  }
};

const clearAttempts = (key: string) => {
  attempts.delete(key);
};

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  let body: { email?: string; password?: string; portal?: 'pelapor' | 'admin' };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const portal = body.portal === 'admin' ? 'admin' : 'pelapor';

  if (!email || !password) {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  const rateKey = getClientKey(request, email);
  if (isRateLimited(rateKey)) {
    return NextResponse.json(
      { success: false, reason: 'too_many_attempts' },
      { status: 429 }
    );
  }

  const { data: isValid, error: verifyError } = await supabase.rpc('verify_user_password', {
    p_email: email,
    p_password: password
  });

  if (verifyError || !isValid) {
    recordFailure(rateKey);
    return NextResponse.json({ success: false, reason: 'wrong_password' }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role, status')
    .eq('email', email)
    .single();

  if (userError || !user) {
    recordFailure(rateKey);
    return NextResponse.json({ success: false, reason: 'not_found' }, { status: 401 });
  }

  if (user.status === 'Blokir') {
    recordFailure(rateKey);
    return NextResponse.json({ success: false, reason: 'blocked' }, { status: 403 });
  }

  const isMasyarakat = user.role === 'Masyarakat';
  if ((portal === 'pelapor' && !isMasyarakat) || (portal === 'admin' && isMasyarakat)) {
    recordFailure(rateKey);
    return NextResponse.json({ success: false, reason: 'wrong_portal' }, { status: 403 });
  }

  clearAttempts(rateKey);

  const sessionUser: SessionUser = {
    id: String(user.id),
    email: user.email,
    username: user.name,
    role: user.role as SessionRole,
    status: user.status || 'Aktif'
  };

  const response = NextResponse.json({ success: true, user: sessionUser });
  setSessionCookie(response, sessionUser);
  return response;
}
