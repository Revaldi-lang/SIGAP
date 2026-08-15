import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { decodeSession, SESSION_COOKIE } from '@/lib/session';

const VALID_ROLES = ['Masyarakat', 'Administrator', 'Petugas PUPR', 'Petugas'] as const;

// Pembuatan akun oleh admin memakai service role key (server-only) karena
// admin membuat akun untuk orang lain — auth_id ≠ auth.uid() admin, sehingga
// policy RLS "insert_own" tidak akan pernah lolos dari client.
export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const sessionUser = token ? decodeSession(token) : null;
  if (!sessionUser || sessionUser.role !== 'Administrator') {
    return NextResponse.json({ success: false, reason: 'forbidden' }, { status: 403 });
  }

  let body: { email?: string; password?: string; name?: string; nik?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const name = (body.name || '').trim();
  const nik = (body.nik || '').trim() || '-';
  const role = VALID_ROLES.includes((body.role || '') as typeof VALID_ROLES[number]) ? (body.role as typeof VALID_ROLES[number]) : 'Masyarakat';

  if (!email || !password || !name) {
    return NextResponse.json({ success: false, reason: 'invalid' }, { status: 400 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, nik }
  });

  if (createError || !created.user) {
    return NextResponse.json(
      { success: false, reason: createError?.message || 'create_failed' },
      { status: 400 }
    );
  }

  const { error: insertError } = await admin.from('users').insert({
    auth_id: created.user.id,
    id: Math.floor(Date.now() % 1000000000) || Math.floor(Math.random() * 100000),
    name,
    email,
    nik,
    role,
    status: 'Aktif'
  });

  if (insertError) {
    console.error('[admin-users] users insert failed:', insertError.message);
    return NextResponse.json({ success: false, reason: 'server_error' }, { status: 500 });
  }

  return NextResponse.json({ success: true, sandi: password });
}
