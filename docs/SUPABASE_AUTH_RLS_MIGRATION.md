# Panduan Migrasi Keamanan Database — Supabase Auth + RLS Ketat (Fase 2)

Dokumen ini adalah panduan langkah demi langkah untuk menutup celah keamanan
paling kritis di SIGAP: **RLS database yang terbuka untuk anon key**.

## 1. Masalah yang Ditutup

Saat ini `supabase_security_fix.sql` mengaktifkan RLS tetapi dengan policy
`Allow public *` (terbuka). Karena anon key bersifat publik (terpajang di
bundle browser), **siapa pun bisa memanggil Supabase API langsung** — membaca
NIK/email semua warga, mengubah status/role, menghapus laporan — tanpa lewat
aplikasi. Login, session cookie, dan proxy hanya melindungi *halaman*, bukan
*data*.

Target: semua akses data hanya melalui user terautentikasi (Supabase Auth)
dengan batasan per-peran dan per-pemilik.

## 2. Arsitektur Target

```
┌─ Browser (client) ─────────────────────────────┐
│  supabase client (anon)                        │
│   ├─ auth.signUp / signInWithPassword / OAuth  │  ← identitas = Supabase Auth
│   └─ from('users'|'laporan'|...)               │  ← setiap query membawa JWT
└──────────────┬─────────────────────────────────┘
               │ JWT (access token)
               ▼
┌─ Supabase ─────────────────────────────────────┐
│  auth.users  ← identitas (auth.uid())          │
│  public.users.auth_id  → referensi ke auth.users│
│  RLS ketat: SELECT/INSERT/UPDATE/DELETE        │
│    dibatasi auth.uid() + peran (is_staff)      │
│  Storage: baca publik, tulis hanya authenticated│
└─────────────────────────────────────────────────┘

Layer server (Next.js /api/*) tetap memakai session cookie HMAC
untuk proteksi halaman (proxy) dan endpoint admin.
```

- Identitas = **Supabase Auth** (`auth.users`). `public.users` menjadi tabel
  profil + peran, terhubung via kolom `auth_id`.
- Login password & Google sama-sama menghasilkan session Supabase Auth;
  aplikasi tetap menyetel cookie sesi server (HMAC) sebagai lapisan kedua.
- RLS diterapkan dengan prinsip **least privilege**.

## 3. Keputusan yang Sudah Diambil

| Keputusan | Pilihan |
|---|---|
| Verifikasi email saat daftar | **Nonaktif** (user langsung aktif, seperti sekarang) |
| Penyimpanan panduan | Repo ini: `docs/SUPABASE_AUTH_RLS_MIGRATION.md` |
| Migrasi data | Impor hash bcrypt lama ke Supabase Auth via Admin API |
| Log "Aduan Dikirim" | Otomatis via trigger DB (bukan insert manual dari client) |

## 4. Fase 0 — Persiapan (± 10 menit)

1. **Snapshot data (pengganti backup — tidak tersedia di free plan)**:
   Table Editor → buka tiap tabel (`users`, `laporan`, `activity_log`,
   `foto_laporan`) → menu ⋮ → Export → CSV/JSON, simpan di folder aman.
   Skrip migrasi hanya mengubah cara login (tidak menghapus data), dan semua
   perubahan SQL terekam di repo ini, jadi resiko sebenarnya kecil; snapshot
   ini cadangan ekstra. Migrasi tetap bisa di-rollback dengan menjalankan
   ulang `supabase_security_fix.sql`.
2. **Ambil service role key**: Dashboard → Settings → API → `service_role`
   (rahasiakan; hanya dipakai server-side/script migrasi, jangan pernah di
   bundle client atau dipublish).
3. **Matikan konfirmasi email** (agar daftar langsung bisa login):
   Dashboard → Authentication → Providers → Email → **Confirm email: OFF**.
4. **Periksa tabel**: pastikan kolom `telepon`, `alamat`, `avatar_url` sudah
   ada (sudah ada dari `supabase_security_fix.sql`).
5. Tambahkan ke `.env.local` (server-only, bukan `NEXT_PUBLIC_`):
   ```
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>
   ```

## 5. Fase 1 — Perubahan Kode Aplikasi

Kerjakan perubahan ini TERLEBIH DAHULU sebelum RLS ketat diaktifkan. Semua
query client harus menjadi *authenticated* (membawa JWT).

> **Status: seluruh perubahan 5.1–5.6 sudah diterapkan di repo**
> (`commit` menyusul). Bagian ini tetap dipertahankan sebagai dokumentasi
> alur & alasan, bukan instruksi yang harus dikerjakan ulang.

### 5.1 Daftar (`registerWarga` di `src/context/AppContext.tsx`)

Ubah dari: hash bcrypt client-side + insert anon.
Menjadi: `supabase.auth.signUp` (langsung mendapat sesi karena confirm email
OFF), lalu insert `public.users` dengan `auth_id` memakai client yang sudah
authenticated.

```ts
// type: Promise<boolean>
const registerWarga = async (
  username: string, email: string, identitas: string, sandi: string,
  role: 'Masyarakat' | 'Administrator' | 'Petugas' | 'Petugas PUPR' = 'Masyarakat'
): Promise<boolean> => {
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) return false;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: sandi,
    options: { data: { full_name: username, nik: identitas } }
  });
  if (signUpError || !signUpData.user) return false;

  const { error: insertError } = await supabase.from('users').insert({
    auth_id: signUpData.user.id,
    id: Math.floor(Date.now() % 1000000000) || Math.floor(Math.random() * 100000),
    name: username,
    email,
    nik: identitas,
    role,
    status: 'Aktif'
  });
  if (insertError) {
    console.error('Supabase user insert error:', insertError);
    return false;
  }
  // Pasang cookie sesi server secara eksplisit (bukan menunggu event listener)
  if (signUpData.session) await handleSupabaseSession(signUpData.session);
  await pullFromSupabase();
  return true;
};
```

Catatan:
- Pemanggil di `src/app/register/page.tsx` diubah jadi `await` + redirect ke
  dashboard (akun langsung aktif, bukan lagi ke halaman login).
- `bcrypt.hashSync` tidak dipakai lagi (password ditangani Supabase Auth).
- Halaman register publik hanya membuat role `Masyarakat` — aman.
- Pembuatan akun staf/admin dipindah ke endpoint server (lihat 5.4).

### 5.2 Login password (`login` di AppContext)

Ubah dari: POST `/api/auth/login` (RPC `verify_user_password`).
Menjadi: `supabase.auth.signInWithPassword` → reuse alur OAuth sync
(`handleSupabaseSession`) agar cookie sesi server tetap terpasang.

```ts
const login = async (email: string, password: string, portal: 'pelapor' | 'admin') => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      return { success: false, reason: 'wrong_password' };
    }
    const result = await handleSupabaseSession(data.session); // → { success, reason }
    if (!result.success) {
      await supabase.auth.signOut().catch(() => undefined);
      return result;
    }
    return { success: true };
  } catch {
    return { success: false, reason: 'server_error' };
  }
};
```

Catatan:
- `handleSupabaseSession` diubah mengembalikan `{ success: boolean; reason?: string }`
  (sebelumnya `void`). `success: true` bila `res.ok && data.user`.
- Bila akun diblokir/ditolak, sesi client di-sign-out agar tidak bisa dipakai
  untuk query data setelah RLS ketat.
- Route `/api/auth/login` beserta RPC `verify_user_password` / `has_user_password`
  menjadi legacy dan bisa dihapus pada langkah akhir (lihat Fase 3).
- Cek "portal" (pelapor vs admin) sudah ditangani redirect halaman via
  `currentUser.role` + proxy — tidak perlu RPC khusus.
- Status `Blokir` sudah ditolak di `/api/auth/oauth` (respons 403 `blocked`).

### 5.3 Route `/api/auth/oauth` (validasi token + cookie) & callback Google

Route ini memakai client **anon** untuk query `public.users` — setelah RLS
ketat query anon ditolak. Diubah menjadi client authenticated dari token yang
dikirim user, sekaligus backfill `auth_id`:

```ts
// setelah supabase.auth.getUser(accessToken) berhasil
const authedClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
);
// gunakan authedClient untuk .from('users').select(...) / .insert(...)
```

Perubahan lain:
- Insert user baru kini menyertakan `auth_id: authUser.id` (lolos policy
  `users_insert_own`).
- User Google existing dengan `auth_id` kosong di-backfill saat login berikutnya
  (`update({ auth_id })` by email).
- **Login Google** diubah `redirectTo`-nya dari `/login-masyarakat` ke halaman
  baru `/auth/callback`. Alasannya: sebelumnya redirect ke route API berarti
  browser supabase client TIDAK pernah menerima sesi (token hanya sampai di
  server), sehingga query client tetap anon dan bakal ditolak RLS ketat.
  `/auth/callback` (client page) menangkap fragment token dari flow implicit,
  lalu memanggil `/api/auth/oauth` untuk memasang cookie dan mengarahkan sesuai
  role. File: `src/app/auth/callback/page.tsx`.

### 5.4 Admin membuat user (`src/app/admin/manajemen-user/page.tsx`)

Pembuatan akun oleh admin harus lewat **server** (memakai service role), karena
admin membuat akun untuk orang lain (auth_id ≠ auth.uid() admin).

1. Endpoint `POST /api/admin/users` (sudah dibuat, `src/app/api/admin/users/route.ts`):
   - Memeriksa sesi admin (decode cookie `sigap_session`, cek role
     `Administrator`).
   - `admin.auth.admin.createUser({ email, password, email_confirm: true })`.
   - Insert `public.users` dengan `auth_id` (pakai admin/service-role client).
   - Mengembalikan `{ sandi }` sekali pakai.

```ts
// src/app/api/admin/users/route.ts (ringkas)
import { createClient } from '@supabase/supabase-js';

const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: NextRequest) {
  // ... cek sesi admin (decodeSession dari cookie) ...
  const { email, password, name, nik, role } = await request.json();
  const { data: authUser, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name: name, nik }
  });
  if (error) return Response.json({ success: false, reason: error.message }, { status: 400 });
  await admin.from('users').insert({
    auth_id: authUser.user.id,
    id: Math.floor(Date.now() % 1000000000) || Math.floor(Math.random() * 100000),
    name, email, nik, role, status: 'Aktif'
  });
  return Response.json({ success: true, sandi: password });
}
```

2. `manajemen-user` memanggil endpoint ini (ganti `registerWarga`):
   ```ts
   const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailInput, password: sandi, name: namaInput, nik: identitasInput, role: roleInput }) });
   const data = await res.json();
   if (data.success) alert(`Pengguna ditambahkan! Kata sandi akun: ${data.sandi}`);
   ```

### 5.5 Laporan (`tambahLaporan` di AppContext)

1. Tambahkan `pelapor_id` pada insert laporan (identitas = auth uid):
   ```ts
   const { data: { user: authUser } } = await supabase.auth.getUser();
   // di insert laporan:
   pelapor_id: authUser?.id,
   ```
2. **Hapus** insert manual `activity_log` "Aduan Dikirim" (baris ~532) — log
   awal kini dibuat trigger DB (bagian 3b `supabase_rls_phase2.sql`).
   Insert log disposisi oleh staf (baris ~630) TETAP dipertahankan.

### 5.6 Storage (upload foto)

Tidak ada perubahan kode: setelah login/daftar, client `supabase` sudah
memegang sesi, sehingga `supabase.storage.from('avatars').upload(...)`
membawa JWT dan lolos policy `authenticated` (diterapkan di Fase 3).

## 6. Fase 2 — Migrasi Data (script sekali jalan)

Script sudah disiapkan di repo: **`migrate-to-auth.mjs`**. Isi
`SUPABASE_SERVICE_ROLE_KEY` di `.env.local` (sudah dilakukan), lalu jalankan
**sebelum RLS ketat**:

```
node migrate-to-auth.mjs
```

Yang dilakukan script:
- Mengimpor user password bcrypt ke `auth.users` (hash ditetapkan langsung —
  password lama tetap valid tanpa reset).
- Meng-backfill `auth_id` untuk SEMUA user (password + Google) dengan
  mencocokkan email ke `auth.users`.
- Mencetak daftar user yang di-skip (password teks biasa legacy — buat ulang
  lewat menu Admin, atau mereka bisa login Google) dan error jika ada.

Rincian teknik (untuk referensi / versi lama yang inline di commit awal):
```js
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env.local', 'utf8').replace(/^\uFEFF/, '');
const get = k => env.match(new RegExp('^' + k + '=(.*)$', 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '');
const url = get('NEXT_PUBLIC_SUPABASE_URL');
const anon = get('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const serviceRole = get('SUPABASE_SERVICE_ROLE_KEY');

const db = createClient(url, anon);                    // baca users (anon, RLS masih terbuka)
const admin = createClient(url, serviceRole);          // buat akun auth

const { data: users } = await db.from('users').select('id, name, email, nik, role, password');
let created = 0, skipped = 0, errors = [];

for (const u of users) {
  const isBcrypt = typeof u.password === 'string' && u.password.startsWith('$2');
  const isOAuth = u.password === 'oauth_authenticated';
  if (!isBcrypt && !isOAuth) { skipped++; continue; }  // plaintext lama → reset manual

  if (isOAuth) {
    // Sudah punya akun auth.users (dibuat saat login Google). Tinggal backfill nanti via SQL.
    continue;
  }

  const { data: createdUser, error } = await admin.auth.admin.createUser({
    email: u.email,
    password_hash: u.password,   // impor hash bcrypt existing
    email_confirm: true,
    user_metadata: { full_name: u.name, nik: u.nik }
  });
  if (error) { errors.push({ email: u.email, error: error.message }); continue; }
  await admin.from('users').update({ auth_id: createdUser.user.id }).eq('email', u.email);
  created++;
}

console.log({ created, skipped, errors: errors.length });
```

Catatan:
- Import hash bcrypt (`password_hash`) hanya mendukung format `$2a$/$2b$`
  (hash bcrypt aplikasi sudah sesuai).
- User dengan password teks biasa (legacy lama) tidak bisa diimpor → tandai,
  lalu buat ulang lewat endpoint admin (5.4).
- User Google OAuth: `auth.users` sudah ada; `auth_id` di-backfill oleh SQL
  berikut, dan yang belum sempat login Google lagi akan terisi otomatis saat
  mereka login Google (route OAuth menyimpan `auth_id`).

### Backfill `auth_id` & `pelapor_id` (SQL)

Jalankan di SQL Editor setelah script selesai:

```sql
-- 1. auth_id untuk akun Google yang belum terisi (cocokkan by email)
UPDATE public.users u
SET auth_id = au.id
FROM auth.users au
WHERE u.auth_id IS NULL
  AND lower(u.email) = lower(au.email);

-- 2. pelapor_id di laporan dari auth_id pemiliknya (by user_id numerik)
UPDATE public.laporan l
SET pelapor_id = u.auth_id
FROM public.users u
WHERE l.user_id = u.id
  AND l.pelapor_id IS NULL;
```

## 7. Fase 3 — Terapkan RLS Ketat (SQL)

1. Jalankan `supabase_rls_phase2.sql` di SQL Editor (Dashboard → SQL Editor →
   New query → tempel → Run). Skrip ini:
   - Menambah kolom `auth_id` / `pelapor_id` (idempoten, `IF NOT EXISTS`).
   - Membuat fungsi `is_staff()` / `is_admin()` (SECURITY DEFINER).
   - Mencabut akses anon; grant hanya ke `authenticated`.
   - Menghapus policy `Allow public *` dan membuat policy ketat.
   - Membuat trigger log "Aduan Dikirim".
   - Membuat policy storage `avatars`.
2. Setelah berhasil, verifikasi cepat dari dashboard: lihat beberapa table →
   pastikan tidak ada lagi policy dengan nama `Allow public *`.
3. (Opsional, langkah akhir setelah semua user login normal) Bersihkan legacy:
   ```sql
   ALTER TABLE public.users DROP COLUMN IF EXISTS password;
   DROP FUNCTION IF EXISTS public.verify_user_password(text, text);
   DROP FUNCTION IF EXISTS public.has_user_password(text);
   ```
   Hapus juga route `/api/auth/login` dan kode login RPC di aplikasi.

## 8. Fase 4 — Verifikasi & Rollback

### Matriks pengujian (harus lolos semua)

| No | Uji | Cara | Harapan |
|---|---|---|---|
| 1 | Anon tidak bisa baca data | Browser DevTools → console: `fetch(supabaseUrl + '/rest/v1/users', { headers: { apikey: anonKey } })` | **401 / RLS menolak** (bukan data) |
| 2 | Anon tidak bisa insert | coba `POST /rest/v1/users` anon | **Ditolak** |
| 3 | Daftar user baru | Halaman `/register` | Langsung login & data masuk |
| 4 | Login password user lama | Halaman `/login-masyarakat` | Masuk, cookie sesi terpasang |
| 5 | Login Google user | `/login-masyarakat` → Google | Masuk, `auth_id` terisi |
| 6 | Admin lihat semua user | `/admin/manajemen-user` | Semua user tampil |
| 7 | Pelapor hanya lihat profil sendiri | cek respons `users` saat login pelapor | Hanya 1 baris (dirinya) |
| 8 | Pelapor buat laporan + foto | `/buat-laporan` | Laporan masuk, log "Aduan Dikirim" otomatis, foto tampil |
| 9 | Staf ubah status laporan | `/admin/laporan` → proses/selesai | Berhasil, log disposisi masuk |
| 10 | Upload avatar | halaman profil | Muncul, tersimpan di `avatars/` |
| 11 | URL foto diakses publik | buka URL `getPublicUrl` di tab baru | Foto tampil tanpa login |

### Rollback (jika terjadi masalah)

Jalankan ulang `supabase_security_fix.sql` (mengembalikan policy `Allow public *`).
Kode aplikasi yang sudah bermigrasi ke Supabase Auth **tidak wajib di-revert** —
tanpa RLS ketat ia tetap berfungsi; risiko keamanan kembali seperti sebelumnya
hingga diperbaiki lagi. Backup Fase 0 memungkinkan restore penuh jika diperlukan.

## 9. Hardening Lanjutan (opsional, setelah stabil)

- **Rate limit persisten**: ganti limiter in-memory (hilang saat restart /
  multi-instance) dengan Upstash Redis / DB-backed untuk login, register, oauth.
- **Rotasi kunci**: regenerate anon key (Dashboard → Settings → API) setelah
  migrasi stabil; paksa redeploy.
- **Batas upload storage**: atur kuota per bucket; tambahkan validasi ukuran
  server-side di endpoint jika upload dipindah server-side.
- **Tighten `foto_laporan`**: policy insert sebaiknya diverifikasi bahwa
  `laporan_id` milik si pemilik (via subquery `EXISTS`), bukan sekadar
  `auth.uid() IS NOT NULL`.
- **Hapus anon key lama dari git history** (rewrite `git filter-repo`) bila
  sudah berencana rotasi penuh.
- **Endpoint admin**: pastikan semua `/api/admin/*` memeriksa sesi + role
  (bukan hanya halaman yang di-guard proxy).
