// Migrasi akun SIGAP ke Supabase Auth (jalankan SEKALI, sebelum RLS ketat aktif)
// Cara pakai:
//   1. Pastikan SUPABASE_SERVICE_ROLE_KEY sudah ada di .env.local
//   2. node migrate-to-auth.mjs
//
// Yang dilakukan:
//   - User dengan password bcrypt ($2...) diimpor ke auth.users (hash ditetapkan
//     langsung, jadi password lama tetap valid tanpa perlu reset).
//   - auth_id di public.users di-backfill untuk SEMUA user (password & Google)
//     dengan mencocokkan email ke auth.users.
//   - User dengan password teks biasa (legacy) di-skip dan dicetak agar dibuat
//     ulang lewat menu Admin (atau login Google).
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8').replace(/^\uFEFF/, '');
const get = (k) => {
  const m = envFile.match(new RegExp(`^${k}=(.*)$`, 'm'));
  if (!m) return undefined;
  return m[1].trim().replace(/^["']|["']$/g, '');
};

const url = get('NEXT_PUBLIC_SUPABASE_URL');
const anonKey = get('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const serviceRole = get('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !anonKey || !serviceRole) {
  console.error('Gagal: pastikan NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_ROLE_KEY ada di .env.local');
  process.exit(1);
}

const db = createClient(url, anonKey);
const admin = createClient(url, serviceRole);

// 1) Indeks akun auth.users yang sudah ada (Google OAuth / pernah dibuat).
const emailToAuthId = new Map();
{
  let page = 0;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page: page + 1, perPage: 1000 });
    if (error) {
      console.error('Gagal membaca auth.users:', error.message);
      break;
    }
    for (const au of data.users) {
      if (au.email) emailToAuthId.set(au.email.toLowerCase(), au.id);
    }
    if (data.users.length < 1000 || page > 200) break;
    page++;
  }
  console.log(`auth.users: ${emailToAuthId.size} akun terindeks.`);
}

const { data: users, error: usersError } = await db.from('users').select('id, name, email, nik, role, password');
if (usersError) {
  console.error('Gagal membaca public.users:', usersError.message);
  process.exit(1);
}
console.log(`Ditemukan ${users.length} user di public.users.`);

let created = 0;
let already = [];
let skipped = [];
let errors = [];

for (const u of users) {
  const pwd = typeof u.password === 'string' ? u.password : '';
  const isBcrypt = pwd.startsWith('$2');
  const isOAuth = pwd === 'oauth_authenticated';

  if (emailToAuthId.has(u.email.toLowerCase())) {
    already.push(u.email);
    continue; // Sudah punya akun auth.users (Google / sebelumnya) — tinggal backfill
  }
  if (!isBcrypt && !isOAuth) {
    skipped.push({ email: u.email, reason: pwd ? 'password teks biasa (bukan bcrypt)' : 'tidak ada password' });
    continue;
  }

  const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
    email: u.email,
    password_hash: isBcrypt ? pwd : undefined,
    email_confirm: true,
    user_metadata: { full_name: u.name, nik: u.nik || undefined }
  });

  if (createError || !createdUser.user) {
    errors.push({ email: u.email, message: createError?.message || 'createUser gagal' });
  } else {
    emailToAuthId.set(u.email.toLowerCase(), createdUser.user.id);
    created++;
  }
}

// 3) Backfill auth_id untuk SEMUA user (bcrypt yang baru + Google) via email.
let backfilled = 0;
for (const u of users) {
  const authId = emailToAuthId.get(u.email.toLowerCase());
  if (!authId) continue;
  const { error } = await admin.from('users').update({ auth_id: authId }).eq('email', u.email);
  if (error) {
    errors.push({ email: u.email, message: `backfill auth_id gagal: ${error.message}` });
  } else {
    backfilled++;
  }
}

console.log('\n=== Hasil Migrasi ===');
console.log(`User password diimpor ke auth.users : ${created}`);
console.log(`Sudah punya akun auth (Google dll)   : ${already.length}`);
console.log(`auth_id di-backfill                  : ${backfilled}/${users.length}`);
console.log(`Di-skip (perlu reset/tindakan manual): ${skipped.length}`);
for (const s of skipped) console.log(`  - ${s.email} (${s.reason})`);
console.log(`Error                                 : ${errors.length}`);
for (const e of errors) console.log(`  - ${e.email}: ${e.message}`);
console.log('\nLangkah berikutnya (SQL Editor):');
console.log('1. Backfill pelapor_id, lihat bagian 6 di docs/SUPABASE_AUTH_RLS_MIGRATION.md');
console.log('2. Jalankan seluruh isi supabase_rls_phase2.sql');
