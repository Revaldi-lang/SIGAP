-- =====================================================================
-- FASE 2: RLS KETAT BERBASIS SUPABASE AUTH - SIGAP
-- =====================================================================
--
-- ⚠️ JANGAN DIJALANKAN SEKARANG!
-- Skrip ini HANYA berlaku setelah aplikasi bermigrasi ke Supabase Auth
-- (lihat "PRASYARAT" di bawah). Menerapkannya sebelum migrasi selesai
-- akan MEMUTUS seluruh fungsi aplikasi karena RLS akan menolak semua
-- query yang datang dari anon key tanpa auth.uid().
--
-- ---------------------------------------------------------------------
-- PRASYARAT (wajib dikerjakan di sisi aplikasi dulu):
--   1. Auth password dipindah ke Supabase Auth: daftar pakai
--      supabase.auth.signUp, login pakai supabase.auth.signInWithPassword.
--      (Skrip yang meng-hash bcrypt di aplikasi & RPC verify_user_password
--       menjadi warisan/legacy; bisa dihapus belakangan.)
--   2. Tabel public.users diberi kolom auth_id uuid yang mereferensikan
--      auth.users.id, dan diisi untuk setiap user (baik via Google OAuth,
--      yang sudah otomatis punya auth.uid(), maupun hasil migrasi akun
--      password lama melalui Admin API / endpoint /api/auth/oauth).
--   3. Tabel public.laporan diberi kolom pelapor_id uuid yang mereferensikan
--      auth.users.id, diisi saat laporan dibuat.
--   4. Semua penulisan/update di aplikasi disesuaikan sehingga berjalan
--      sebagai authenticated user (bukan anon).
--   5. Aplikasi TIDAK lagi menulis log "Aduan Dikirim" secara manual;
--      log awal dibuat otomatis oleh trigger (bagian 3b di bawah). Insert
--      activity_log di tambahLaporan() HARUS dihapus sebelum skrip ini
--      dijalankan, atau policy insert_staff akan menolak milik pelapor.
-- ---------------------------------------------------------------------

-- 0) KOLOM PENDUKUNG MIGRASI ------------------------------------------
-- Jalankan baris ini SEBAGAI LANGKAH PERSIAPAN sebelum menutup akses anon.
-- (Aman dijalankan kapan saja; tidak menghapus akses yang ada.)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS auth_id uuid REFERENCES auth.users(id);

ALTER TABLE public.laporan
  ADD COLUMN IF NOT EXISTS pelapor_id uuid REFERENCES auth.users(id);

-- 1) HELPER ROLE ------------------------------------------------------
-- Cek apakah pemanggil (auth.uid()) adalah Administrator/Petugas.
-- SECURITY DEFINER agar policy bisa membaca public.users tanpa rekursi RLS.
-- Petugas disetujui update laporan & activity log; hanya Administrator
-- yang boleh menghapus.
-- CATATAN: nilai role berasal dari enum role_user yang ADA di DB.
-- 'Petugas' TIDAK ada di enum (hanya 'Masyarakat' | 'Administrator' |
-- 'Petugas PUPR'), jadi jangan dimasukkan di sini. Bila kelak role
-- 'Petugas' diperlukan, tambahkan ke enum dulu:
--   ALTER TYPE public.role_user ADD VALUE IF NOT EXISTS 'Petugas';

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid()
      AND role IN ('Administrator', 'Petugas PUPR')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid() AND role = 'Administrator'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) REVOKE AKSES ANON -------------------------------------------------
-- Setelah prasyarat terpenuhi, cabut semua akses anon (hanya autentikasi
-- yang tersisa). Ini mencegah siapa pun yang tidak login membaca data.

REVOKE ALL ON public.users, public.laporan, public.activity_log,
          public.foto_laporan, public.feedback_admin
FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users, public.laporan,
     public.activity_log, public.foto_laporan, public.feedback_admin
TO authenticated;

-- 3) RLS + POLICIES ----------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_admin ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama "Allow public *" yang terbuka total
DROP POLICY IF EXISTS "Allow public select" ON public.users;
DROP POLICY IF EXISTS "Allow public insert" ON public.users;
DROP POLICY IF EXISTS "Allow public update" ON public.users;
DROP POLICY IF EXISTS "Allow public delete" ON public.users;

DROP POLICY IF EXISTS "Allow public select" ON public.laporan;
DROP POLICY IF EXISTS "Allow public insert" ON public.laporan;
DROP POLICY IF EXISTS "Allow public update" ON public.laporan;
DROP POLICY IF EXISTS "Allow public delete" ON public.laporan;

DROP POLICY IF EXISTS "Allow public select" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public insert" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public update" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public delete" ON public.activity_log;

DROP POLICY IF EXISTS "Allow public select" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public insert" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public update" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public delete" ON public.foto_laporan;

DROP POLICY IF EXISTS "Allow public select" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public insert" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public update" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public delete" ON public.feedback_admin;

-- Tabel: users ---------------------------------------------------------
-- Pelapor melihat/mengubah profilnya sendiri; staf melihat semua.
CREATE POLICY "users_select_own_or_staff" ON public.users
  FOR SELECT USING (auth_id = auth.uid() OR public.is_staff());

CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

CREATE POLICY "users_update_own_or_staff" ON public.users
  FOR UPDATE USING (auth_id = auth.uid() OR public.is_staff())
  WITH CHECK (auth_id = auth.uid() OR public.is_staff());

CREATE POLICY "users_delete_admin" ON public.users
  FOR DELETE USING (public.is_admin());

-- Tabel: laporan --------------------------------------------------------
-- Peta publik tetap bisa dibaca siapa pun yang login; pembuatan hanya
-- oleh pengguna terautentikasi (pelapor_id = auth.uid()).
CREATE POLICY "laporan_select_any_authenticated" ON public.laporan
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "laporan_insert_authenticated" ON public.laporan
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "laporan_update_staff_or_owner" ON public.laporan
  FOR UPDATE USING (public.is_staff() OR pelapor_id = auth.uid())
  WITH CHECK (public.is_staff() OR pelapor_id = auth.uid());

CREATE POLICY "laporan_delete_admin" ON public.laporan
  FOR DELETE USING (public.is_admin());

-- Tabel: activity_log --------------------------------------------------
CREATE POLICY "activity_log_select_any_authenticated" ON public.activity_log
  FOR SELECT USING (auth.role() = 'authenticated');

-- Insert log "Aduan Dikirim" dibuat trigger (3b) sebagai SECURITY DEFINER.
-- Staff masih menulis log disposisi/selesai lewat policy ini.
CREATE POLICY "activity_log_insert_staff" ON public.activity_log
  FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "activity_log_update_staff" ON public.activity_log
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "activity_log_delete_admin" ON public.activity_log
  FOR DELETE USING (public.is_admin());

-- Tabel: foto_laporan ---------------------------------------------------
CREATE POLICY "foto_select_any_authenticated" ON public.foto_laporan
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "foto_insert_authenticated" ON public.foto_laporan
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "foto_update_staff" ON public.foto_laporan
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "foto_delete_admin" ON public.foto_laporan
  FOR DELETE USING (public.is_admin());

-- Tabel: feedback_admin -------------------------------------------------
CREATE POLICY "feedback_select_any_authenticated" ON public.feedback_admin
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "feedback_insert_authenticated" ON public.feedback_admin
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "feedback_update_staff" ON public.feedback_admin
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

CREATE POLICY "feedback_delete_admin" ON public.feedback_admin
  FOR DELETE USING (public.is_admin());

-- 3b) TRIGGER LOG "ADUAN DIKIRIM" ----------------------------------------
-- Log awal sebuah laporan dibuat otomatis saat INSERT laporan (oleh pelapor),
-- sehingga tidak perlu policy INSERT publik untuk activity_log.
-- SECURITY DEFINER agar bisa membaca public.users tanpa rekursi RLS.

CREATE OR REPLACE FUNCTION public.log_laporan_dikirim()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_log (laporan_id, judul, deskripsi)
  VALUES (
    NEW.id,
    'Aduan Dikirim',
    'Baru Saja | Oleh ' || COALESCE(
      (SELECT name FROM public.users WHERE id = NEW.user_id),
      'Pelapor'
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_laporan_dikirim ON public.laporan;
CREATE TRIGGER trg_laporan_dikirim
  AFTER INSERT ON public.laporan
  FOR EACH ROW EXECUTE FUNCTION public.log_laporan_dikirim();

-- 3c) STORAGE POLICY (bucket 'avatars') -----------------------------------
-- Upload ke bucket 'avatars' (folder avatars/ dan reports/) harus datang
-- dari user terautentikasi; URL-nya tetap bisa dibaca publik.
-- Jalankan HANYA setelah bucket 'avatars' ada dan RLS storage aktif.

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_write" ON storage.objects;
CREATE POLICY "avatars_auth_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] IN ('avatars', 'reports')
  );

DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
CREATE POLICY "avatars_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());

DROP POLICY IF EXISTS "avatars_owner_delete" ON storage.objects;
CREATE POLICY "avatars_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND owner = auth.uid());

-- 4) KOLOM PASSWORD -----------------------------------------------------
-- Kolom password bcrypt lama TIDAK LAGI dibutuhkan setelah migrasi ke
-- Supabase Auth. Pindahkan nilainya ke auth.users (via Admin API:
-- supabase.auth.admin.createUser({ email, password })) lalu hapus kolom:
--
--   ALTER TABLE public.users DROP COLUMN IF EXISTS password;
--   REVOKE SELECT (password) ON public.users FROM anon, authenticated;
--
-- Verifikasi login kemudian seluruhnya ditangani Supabase Auth, sehingga
-- RPC verify_user_password / has_user_password bisa dihapus:
--
--   DROP FUNCTION IF EXISTS public.verify_user_password(text, text);
--   DROP FUNCTION IF EXISTS public.has_user_password(text);
--
-- ---------------------------------------------------------------------
-- ROLLBACK (jika terjadi masalah):
--   Kembalikan akses anon terbuka dengan menjalankan ULANG file
--   supabase_security_fix.sql. Trigger & storage policy baru tidak
--   menghalangi (policy hanya menambah aturan; supabase_security_fix.sql
--   hanya DROP/CREATE policy public). Setelah rollback, pastikan aplikasi
--   yang sudah bermigrasi ke Supabase Auth tetap bekerja — tidak wajib
--   me-revert kode aplikasi, cukup RLS-nya.
