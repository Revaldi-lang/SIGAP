'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Callback Supabase Auth (Google OAuth / implicit flow).
// supabase-js membaca token dari URL fragment, lalu kita set cookie sesi
// server via /api/auth/oauth dan arahkan ke halaman sesuai role.
export default function AuthCallback() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login-masyarakat');
          return;
        }

        const res = await fetch('/api/auth/oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: session.access_token })
        });
        const data = await res.json();

        if (res.ok && data.user) {
          router.replace(data.user.role === 'Masyarakat' ? '/dashboard-pelapor' : '/admin');
        } else if (data.reason === 'blocked') {
          await supabase.auth.signOut().catch(() => undefined);
          router.replace('/login-masyarakat?blocked=1');
        } else {
          await supabase.auth.signOut().catch(() => undefined);
          router.replace('/login-masyarakat');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/login-masyarakat');
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#022159] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
