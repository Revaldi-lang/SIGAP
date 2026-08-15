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

export async function POST(request: NextRequest) {
  let body: { access_token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  const accessToken = body.access_token;
  if (!accessToken) {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  // Server-side token validation. The JWT cannot be forged without the
  // Supabase project secret, unlike the previous client-only sync.
  const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
  const authUser = authData.user;
  if (authError || !authUser || !authUser.email) {
    return NextResponse.json({ success: false, reason: 'unauthorized' }, { status: 401 });
  }

  const email = authUser.email.toLowerCase();

  const { data: existing } = await supabase
    .from('users')
    .select('id, name, email, role, status')
    .eq('email', email)
    .maybeSingle();

  let user = existing;
  if (!user) {
    const fullName = authUser.user_metadata?.full_name as string | undefined;
    const userName = fullName || authUser.email.split('@')[0] || 'User';
    const { data: inserted, error: insertError } = await supabase
      .from('users')
      .insert({
        id: Math.floor(100000 + Math.random() * 900000),
        name: userName,
        email,
        role: 'Masyarakat',
        status: 'Aktif',
        password: 'oauth_authenticated',
        nik: '-',
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || undefined
      })
      .select('id, name, email, role, status')
      .single();

    if (insertError) {
      return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
    }
    user = inserted;
  }

  if (!user) {
    return NextResponse.json({ success: false, reason: 'not_found' }, { status: 401 });
  }

  if (user.status === 'Blokir') {
    return NextResponse.json({ success: false, reason: 'blocked' }, { status: 403 });
  }

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
