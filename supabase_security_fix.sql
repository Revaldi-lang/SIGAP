-- =====================================================================
-- SKRIP MIGRASI KEAMANAN DATABASE SUPABASE - SIGAP-PRODUCTION
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase Anda.
-- =====================================================================

-- 1. Aktifkan Row Level Security (RLS) pada semua tabel utama
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_admin ENABLE ROW LEVEL SECURITY;

-- 2. Buat kebijakan (policies) akses publik agar aplikasi client-side tetap berfungsi normal
-- Tabel: users
DROP POLICY IF EXISTS "Allow public select" ON public.users;
DROP POLICY IF EXISTS "Allow public insert" ON public.users;
DROP POLICY IF EXISTS "Allow public update" ON public.users;
DROP POLICY IF EXISTS "Allow public delete" ON public.users;

CREATE POLICY "Allow public select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.users FOR DELETE USING (true);

-- Tabel: laporan
DROP POLICY IF EXISTS "Allow public select" ON public.laporan;
DROP POLICY IF EXISTS "Allow public insert" ON public.laporan;
DROP POLICY IF EXISTS "Allow public update" ON public.laporan;
DROP POLICY IF EXISTS "Allow public delete" ON public.laporan;

CREATE POLICY "Allow public select" ON public.laporan FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.laporan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.laporan FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.laporan FOR DELETE USING (true);

-- Tabel: activity_log
DROP POLICY IF EXISTS "Allow public select" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public insert" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public update" ON public.activity_log;
DROP POLICY IF EXISTS "Allow public delete" ON public.activity_log;

CREATE POLICY "Allow public select" ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.activity_log FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.activity_log FOR DELETE USING (true);

-- Tabel: foto_laporan
DROP POLICY IF EXISTS "Allow public select" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public insert" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public update" ON public.foto_laporan;
DROP POLICY IF EXISTS "Allow public delete" ON public.foto_laporan;

CREATE POLICY "Allow public select" ON public.foto_laporan FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.foto_laporan FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.foto_laporan FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.foto_laporan FOR DELETE USING (true);

-- Tabel: feedback_admin
DROP POLICY IF EXISTS "Allow public select" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public insert" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public update" ON public.feedback_admin;
DROP POLICY IF EXISTS "Allow public delete" ON public.feedback_admin;

CREATE POLICY "Allow public select" ON public.feedback_admin FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.feedback_admin FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.feedback_admin FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.feedback_admin FOR DELETE USING (true);

-- 3. Batasi akses pembacaan langsung pada kolom password untuk role publik (anon & authenticated)
REVOKE SELECT ON COLUMN public.users.password FROM anon, authenticated;

-- 4. Buat fungsi RPC aman di database untuk melakukan verifikasi password di sisi server
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION verify_user_password(p_email text, p_password text)
RETURNS boolean AS $$
DECLARE
  v_password_hash text;
BEGIN
  SELECT password INTO v_password_hash FROM public.users WHERE lower(email) = lower(p_email);
  IF v_password_hash IS NULL THEN
    RETURN false;
  END IF;
  IF v_password_hash = 'oauth_authenticated' THEN
    RETURN false;
  END IF;
  
  -- Mendukung pencocokan bcrypt modern maupun password teks biasa lama
  IF v_password_hash LIKE '$2%' THEN
    RETURN v_password_hash = crypt(p_password, v_password_hash);
  ELSE
    RETURN v_password_hash = p_password;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_user_password(p_email text)
RETURNS boolean AS $$
DECLARE
  v_password_hash text;
BEGIN
  SELECT password INTO v_password_hash FROM public.users WHERE lower(email) = lower(p_email);
  IF v_password_hash IS NULL OR v_password_hash = 'oauth_authenticated' THEN
    RETURN false;
  END IF;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
