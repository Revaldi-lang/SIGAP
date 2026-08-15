import { createClient, SupabaseClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_* dibaca secara LAZY agar evaluasi modul saat `next build`
// (page data collection) tidak pernah gagal walau environment belum di-set —
// misalnya di CI/VPS tempat .env.local (yang ter-ignore git) belum ada.
// Error konfigurasi baru muncul saat client benar-benar dipakai (runtime).
const getSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY wajib di-set di environment.'
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

let client: SupabaseClient | null = null;

// Proxy lazy singleton: semua pemakaian `supabase.from(...)`, `supabase.rpc(...)`,
// `supabase.auth`, dsb. tetap bekerja tanpa mengubah kode pemakai.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!client) client = getSupabaseClient();
    return Reflect.get(client, prop, client);
  }
});
