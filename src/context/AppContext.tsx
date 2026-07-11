'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  username: string;
  email: string;
  identitas: string;
  role: 'Masyarakat' | 'Administrator' | 'Petugas PUPR' | 'Petugas';
  status: 'Aktif' | 'Blokir' | 'Menunggu Verifikasi';
  registered: string;
  password?: string;
}

export interface ActivityLog {
  judul: string;
  waktu: string;
  aktor: string;
}

export interface Laporan {
  id: string;
  lat: number;
  lng: number;
  kategori: 'jalan' | 'penerangan' | 'drainase' | 'fasilitas' | 'lainnya';
  kategoriLabel: string;
  deskripsi: string;
  status: 'baru' | 'proses' | 'selesai';
  pelapor: string;
  waktu: string;
  lokasi: string;
  wilayah: string;
  urgensi: 'Rendah' | 'Sedang' | 'Tinggi';
  dinas?: string;
  foto: string;
  logs: ActivityLog[];
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  laporan: Laporan[];
  loading: boolean;
  login: (email: string, role: string) => boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  registerWarga: (username: string, email: string, identitas: string, sandi: string) => boolean;
  tambahLaporan: (laporanBaru: Omit<Laporan, 'id' | 'kategoriLabel' | 'waktu' | 'logs'>) => void;
  updateStatusLaporan: (id: string, status: 'baru' | 'proses' | 'selesai', dinas: string, catatan: string) => void;
  updateStatusUser: (email: string, status: 'Aktif' | 'Blokir' | 'Menunggu Verifikasi') => void;
  hapusUserPermanen: (email: string) => Promise<boolean>;
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data from localstorage & sync with Supabase
  useEffect(() => {
    const initializeData = async () => {
      // 1. LocalStorage Auth Session
      const cachedSession = localStorage.getItem('sigap_session');
      if (cachedSession) {
        try {
          const parsed = JSON.parse(cachedSession);
          const mappedRole = parsed.role === 'pelapor' ? 'Masyarakat' : parsed.role;
          setCurrentUser({
            id: parsed.id,
            username: parsed.username,
            email: parsed.email,
            identitas: '-',
            role: mappedRole,
            status: 'Aktif',
            registered: 'Cached Session'
          });
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Local cache
      const cachedUsers = localStorage.getItem('sigap_users');
      if (cachedUsers) setUsers(JSON.parse(cachedUsers));

      const cachedLaporan = localStorage.getItem('sigap_laporan');
      if (cachedLaporan) setLaporan(JSON.parse(cachedLaporan));

      // 3. Supabase Sync on mount
      if (supabase) {
        // Handle Google OAuth session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          await handleSupabaseSession(session);
        }

        // Listen to Auth Changes
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (localStorage.getItem('sigap_logged_out') === 'true') {
            if (session) await supabase.auth.signOut();
            localStorage.removeItem('sigap_logged_out');
            return;
          }
          if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session && session.user) {
            await handleSupabaseSession(session);
          }
        });

        await pullFromSupabase();
      }

      setLoading(false);
    };

    initializeData();
  }, []);

  const handleSupabaseSession = async (session: any) => {
    const user = session.user;
    const mappedUser: User = {
      id: user.id,
      username: user.user_metadata.full_name || user.email.split('@')[0],
      email: user.email,
      identitas: '-',
      role: 'Masyarakat',
      status: 'Aktif',
      registered: 'Google Sign-In'
    };

    setCurrentUser(mappedUser);

    const sessionData = {
      role: 'pelapor',
      email: user.email,
      username: mappedUser.username,
      id: user.id
    };
    localStorage.setItem('sigap_session', JSON.stringify(sessionData));
    localStorage.setItem('sigap_session_last_activity', Date.now().toString());

    try {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!existing) {
        await supabase.from('users').insert({
          id: user.id,
          name: mappedUser.username,
          email: user.email,
          role: 'Masyarakat',
          status: 'Aktif',
          password: 'oauth_authenticated'
        });
      }
    } catch (err) {
      console.error('Supabase user upsert error:', err);
    }

    await pullFromSupabase();
  };

  const pullFromSupabase = async () => {
    try {
      const { data: dbUsers } = await supabase.from('users').select('*');
      if (dbUsers) {
        const mappedUsers: User[] = dbUsers.map(u => ({
          id: u.id.toString(),
          username: u.name,
          email: u.email,
          identitas: u.nik || '-',
          role: u.role,
          status: u.status === 'Menunggu' ? 'Menunggu Verifikasi' : u.status,
          registered: 'Terdaftar'
        }));
        setUsers(mappedUsers);
        localStorage.setItem('sigap_users', JSON.stringify(mappedUsers));
      }

      const { data: dbLaporan } = await supabase.from('laporan').select(`
        *,
        users ( name ),
        activity_log ( * ),
        foto_laporan ( * )
      `);

      if (dbLaporan) {
        const mappedLaporan: Laporan[] = dbLaporan.map(l => {
          const mappedLogs = (l.activity_log || []).map((log: any) => {
            let waktuStr = 'Baru Saja';
            let aktorStr = 'Sistem';
            if (log.deskripsi && log.deskripsi.includes('|')) {
              const parts = log.deskripsi.split('|');
              waktuStr = parts[0].trim();
              aktorStr = parts[1].replace('Oleh', '').trim();
            }
            return {
              judul: log.judul,
              waktu: waktuStr,
              aktor: aktorStr
            };
          });

          let fotoUrl = getKategoriFoto(l.kategori);
          if (l.foto_laporan && l.foto_laporan.length > 0) {
            fotoUrl = l.foto_laporan[0].file_path;
          }

          return {
            id: l.nomor_laporan.replace('RPT-', ''),
            lat: parseFloat(l.lat),
            lng: parseFloat(l.lng),
            kategori: l.kategori,
            kategoriLabel: getKategoriLabel(l.kategori),
            deskripsi: l.deskripsi,
            status: l.status,
            pelapor: l.users ? l.users.name : 'Masyarakat',
            waktu: 'Tersinkron',
            lokasi: l.lokasi,
            wilayah: l.wilayah,
            urgensi: l.urgensi,
            dinas: l.dinas_tujuan,
            foto: fotoUrl,
            logs: mappedLogs.length > 0 ? mappedLogs : [
              { judul: 'Aduan Dikirim', waktu: 'Baru Saja', aktor: l.users ? l.users.name : 'Pelapor' }
            ]
          };
        });
        setLaporan(mappedLaporan);
        localStorage.setItem('sigap_laporan', JSON.stringify(mappedLaporan));
      }
    } catch (e) {
      console.error('Error pulling from Supabase:', e);
    }
  };

  const getKategoriLabel = (kategori: string) => {
    const labels: Record<string, string> = {
      'jalan': 'Jalan Berlubang',
      'penerangan': 'Penerangan Jalan',
      'drainase': 'Drainase rusak',
      'fasilitas': 'Fasilitas Sosial / Taman',
      'lainnya': 'Laporan Lainnya'
    };
    return labels[kategori] || 'Laporan Umum';
  };

  const getKategoriFoto = (kategori: string) => {
    const images: Record<string, string> = {
      'jalan': '/assets/images/kategori_jalan.jpg',
      'penerangan': '/assets/images/kategori_penerangan.jpg',
      'drainase': '/assets/images/kategori_drainase.jpg',
      'fasilitas': '/assets/images/kategori_fasilitas.jpg',
      'lainnya': '/assets/images/kategori_lainnya.jpg'
    };
    return images[kategori] || '/assets/images/kategori_jalan.jpg';
  };

  const login = (email: string, role: string): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) return false;

    const mappedRole = matched.role === 'Masyarakat' ? 'pelapor' : matched.role;
    const sessionData = {
      role: mappedRole,
      email: matched.email,
      username: matched.username,
      id: matched.id
    };

    localStorage.setItem('sigap_session', JSON.stringify(sessionData));
    localStorage.setItem('sigap_session_last_activity', Date.now().toString());

    setCurrentUser(matched);
    return true;
  };

  const loginGoogle = async () => {
    const redirectUrl = window.location.origin + '/login-masyarakat';
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
  };

  const logout = async () => {
    localStorage.setItem('sigap_logged_out', 'true');
    localStorage.removeItem('sigap_session');
    localStorage.removeItem('sigap_session_last_activity');
    setCurrentUser(null);
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const registerWarga = (username: string, email: string, identitas: string, sandi: string): boolean => {
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) return false;

    const id = Date.now().toString();
    const newUser: User = {
      id,
      username,
      email,
      identitas,
      role: 'Masyarakat',
      status: 'Aktif',
      registered: 'Pendaftaran Mandiri'
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('sigap_users', JSON.stringify(updated));

    supabase.from('users').insert({
      id: parseInt(id) || Math.floor(Math.random() * 100000),
      name: username,
      email,
      nik: identitas,
      role: 'Masyarakat',
      status: 'Aktif',
      password: sandi
    }).then(({ error }) => {
      if (error) console.error('Supabase user insert error:', error);
      pullFromSupabase();
    });

    return true;
  };

  const tambahLaporan = (laporanBaru: any) => {
    const id = (laporan.length > 0 ? (Math.max(...laporan.map(x => parseInt(x.id))) + 1).toString().padStart(4, '0') : '0149');
    const fullLaporan: Laporan = {
      ...laporanBaru,
      id,
      kategoriLabel: getKategoriLabel(laporanBaru.kategori),
      waktu: 'Baru Saja',
      logs: [
        { judul: 'Aduan Dikirim', waktu: 'Baru Saja', aktor: laporanBaru.pelapor }
      ]
    };

    const updated = [fullLaporan, ...laporan];
    setLaporan(updated);
    localStorage.setItem('sigap_laporan', JSON.stringify(updated));

    supabase.from('users').select('id').eq('name', laporanBaru.pelapor).single().then(({ data: userObj }) => {
      const uId = userObj ? userObj.id : (currentUser ? currentUser.id : 3);
      supabase.from('laporan').insert({
        nomor_laporan: `RPT-${id}`,
        user_id: uId,
        kategori: laporanBaru.kategori,
        deskripsi: laporanBaru.deskripsi,
        lokasi: laporanBaru.lokasi,
        wilayah: laporanBaru.wilayah,
        lat: parseFloat(laporanBaru.lat),
        lng: parseFloat(laporanBaru.lng),
        urgensi: laporanBaru.urgensi,
        status: 'baru'
      }).then(({ error }) => {
        if (error) {
          console.error('Supabase insert aduan error:', error);
        } else {
          supabase.from('laporan').select('id').eq('nomor_laporan', `RPT-${id}`).single().then(({ data: lapObj }) => {
            if (lapObj) {
              supabase.from('activity_log').insert({
                laporan_id: lapObj.id,
                judul: 'Aduan Dikirim',
                deskripsi: `Baru Saja | Oleh ${laporanBaru.pelapor}`
              });
              if (laporanBaru.foto) {
                supabase.from('foto_laporan').insert({
                  laporan_id: lapObj.id,
                  file_path: laporanBaru.foto
                });
              }
            }
          });
        }
        pullFromSupabase();
      });
    });
  };

  const updateStatusLaporan = (id: string, status: 'baru' | 'proses' | 'selesai', dinas: string, catatan: string) => {
    const updated = laporan.map(l => {
      if (l.id === id) {
        const logMsg = catatan || (status === 'proses' ? 'Laporan sedang ditindaklanjuti' : 'Laporan selesai diperbaiki');
        const actorName = currentUser ? currentUser.username : 'Petugas';
        return {
          ...l,
          status,
          dinas: dinas || l.dinas,
          logs: [
            { judul: status === 'proses' ? 'Disposisi Kedinasan' : 'Pekerjaan Selesai', waktu: 'Baru Saja', aktor: actorName },
            ...l.logs
          ]
        };
      }
      return l;
    });

    setLaporan(updated);
    localStorage.setItem('sigap_laporan', JSON.stringify(updated));

    const nomorLaporan = `RPT-${id}`;
    supabase.from('laporan').update({
      status,
      dinas_tujuan: dinas
    }).eq('nomor_laporan', nomorLaporan).then(({ error }) => {
      if (error) console.error('Supabase update status error:', error);
      
      supabase.from('laporan').select('id').eq('nomor_laporan', nomorLaporan).single().then(({ data: lap }) => {
        if (lap) {
          const logTitle = status === 'proses' ? 'Disposisi Kedinasan' : 'Pekerjaan Selesai';
          const logDesc = `Baru Saja | Oleh ${currentUser ? currentUser.username : 'Petugas'}`;
          supabase.from('activity_log').insert({
            laporan_id: lap.id,
            judul: logTitle,
            deskripsi: logDesc
          }).then(() => pullFromSupabase());
        }
      });
    });
  };

  const updateStatusUser = (email: string, status: 'Aktif' | 'Blokir' | 'Menunggu Verifikasi') => {
    const updated = users.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, status };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('sigap_users', JSON.stringify(updated));

    const mappedStatus = status === 'Menunggu Verifikasi' ? 'Menunggu' : status;
    supabase.from('users').update({ status: mappedStatus }).eq('email', email).then(() => {
      pullFromSupabase();
    });
  };

  const hapusUserPermanen = async (email: string): Promise<boolean> => {
    try {
      const updated = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
      setUsers(updated);
      localStorage.setItem('sigap_users', JSON.stringify(updated));

      if (supabase) {
        const { error } = await supabase.from('users').delete().eq('email', email);
        if (error) throw error;
        await pullFromSupabase();
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const syncData = async () => {
    await pullFromSupabase();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      laporan,
      loading,
      login,
      loginGoogle,
      logout,
      registerWarga,
      tambahLaporan,
      updateStatusLaporan,
      updateStatusUser,
      hapusUserPermanen,
      syncData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
