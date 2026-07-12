'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
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
  telepon?: string;
  alamat?: string;
  foto?: string;
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
  hapusLaporan: (id: string) => Promise<boolean>;
  syncData: () => Promise<void>;
  updateUserProfile: (username: string, email: string, telepon?: string, alamat?: string, foto?: string) => Promise<boolean>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  const pullFromSupabase = useCallback(async () => {
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
          registered: 'Terdaftar',
          password: u.password,
          telepon: u.telepon || localStorage.getItem('sigap_user_phone_' + u.id) || '',
          alamat: u.alamat || localStorage.getItem('sigap_user_address_' + u.id) || '',
          foto: u.avatar_url || localStorage.getItem('sigap_user_foto_' + u.id) || undefined
        }));
        setUsers(mappedUsers);
        localStorage.setItem('sigap_users', JSON.stringify(mappedUsers));

        // Sync currentUser with their updated database info (e.g. for profile photo updates across devices)
        setCurrentUser(prev => {
          if (!prev) return null;
          const matched = mappedUsers.find(u => u.id === prev.id);
          if (matched) {
            const updatedUser: User = {
              ...prev,
              username: matched.username,
              email: matched.email,
              role: matched.role,
              identitas: matched.identitas,
              // Prefer DB value; fall back to prev state (which may come from localStorage)
              telepon: matched.telepon || prev.telepon || localStorage.getItem('sigap_user_phone_' + prev.id) || '',
              alamat: matched.alamat || prev.alamat || localStorage.getItem('sigap_user_address_' + prev.id) || '',
              foto: matched.foto || prev.foto || localStorage.getItem('sigap_user_foto_' + prev.id) || undefined,
            };
            const sessionData = {
              role: updatedUser.role === 'Masyarakat' ? 'pelapor' : updatedUser.role,
              email: updatedUser.email,
              username: updatedUser.username,
              id: updatedUser.id,
              telepon: updatedUser.telepon,
              alamat: updatedUser.alamat,
              foto: updatedUser.foto
            };
            localStorage.setItem('sigap_session', JSON.stringify(sessionData));
            return updatedUser;
          }
          return prev;
        });
      }

      const { data: dbLaporan } = await supabase.from('laporan').select(`
        *,
        users ( name ),
        activity_log ( * ),
        foto_laporan ( * )
      `);

      if (dbLaporan) {
        const mappedLaporan: Laporan[] = dbLaporan.map(l => {
          const mappedLogs = (l.activity_log || []).map((log: { judul: string; deskripsi: string | null }) => {
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
            const rawPath = l.foto_laporan[0].file_path;
            if (rawPath && rawPath.startsWith('local_storage_ref_')) {
              const reportIdRef = rawPath.replace('local_storage_ref_', '');
              const cachedFoto = localStorage.getItem('sigap_foto_data_' + reportIdRef);
              fotoUrl = cachedFoto || getKategoriFoto(l.kategori);
            } else {
              fotoUrl = rawPath || getKategoriFoto(l.kategori);
            }
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
  }, []);

  const handleSupabaseSession = useCallback(async (session: Session) => {
    const user = session.user;
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      let dbUserId: string;
      let dbUserRole: 'Masyarakat' | 'Administrator' | 'Petugas PUPR' | 'Petugas' = 'Masyarakat';
      let dbUserStatus: 'Aktif' | 'Blokir' | 'Menunggu Verifikasi' = 'Aktif';
      let dbUserNik = '-';
      let dbUserName = (user.user_metadata.full_name as string) || user.email?.split('@')[0] || 'User';
      const dbUserAvatar = existing?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

      if (!existing) {
        const generatedId = Math.floor(100000 + Math.random() * 900000);
        dbUserId = generatedId.toString();
        await supabase.from('users').insert({
          id: generatedId,
          name: dbUserName,
          email: user.email,
          role: 'Masyarakat',
          status: 'Aktif',
          password: 'oauth_authenticated',
          nik: '-',
          avatar_url: dbUserAvatar
        });
      } else {
        dbUserId = existing.id.toString();
        dbUserRole = (existing.role as 'Masyarakat' | 'Administrator' | 'Petugas PUPR' | 'Petugas') || 'Masyarakat';
        const rawStatus = existing.status || 'Aktif';
        dbUserStatus = (rawStatus === 'Menunggu' ? 'Menunggu Verifikasi' : rawStatus) as 'Aktif' | 'Blokir' | 'Menunggu Verifikasi';
        dbUserNik = existing.nik || '-';
        dbUserName = existing.name || dbUserName;
      }

      const mappedUser: User = {
        id: dbUserId,
        username: dbUserName,
        email: user.email || '',
        identitas: dbUserNik,
        role: dbUserRole,
        status: dbUserStatus,
        registered: 'Google Sign-In',
        telepon: existing?.telepon || '',
        alamat: existing?.alamat || '',
        foto: dbUserAvatar || undefined
      };

      setCurrentUser(mappedUser);

      const sessionData = {
        role: dbUserRole === 'Masyarakat' ? 'pelapor' : dbUserRole,
        email: user.email,
        username: dbUserName,
        id: dbUserId,
        telepon: mappedUser.telepon,
        alamat: mappedUser.alamat,
        foto: mappedUser.foto
      };
      localStorage.setItem('sigap_session', JSON.stringify(sessionData));
      localStorage.setItem('sigap_session_last_activity', Date.now().toString());

    } catch (err) {
      console.error('Supabase user upsert error:', err);
    }

    await pullFromSupabase();
  }, [pullFromSupabase]);

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
            registered: 'Cached Session',
            telepon: parsed.telepon || '',
            alamat: parsed.alamat || '',
            foto: parsed.foto || undefined
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

      // 3. Supabase Sync on mount (non-blocking)
      if (supabase) {
        // Run session check and data pull in background
        Promise.all([
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
              return handleSupabaseSession(session);
            }
          }),
          pullFromSupabase()
        ]).catch(err => console.error('Background sync error:', err));

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
      }

      setLoading(false);
    };

    initializeData();
  }, [handleSupabaseSession, pullFromSupabase]);

  const login = (email: string, role: string): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) return false;

    const mappedRole = matched.role === 'Masyarakat' ? 'pelapor' : matched.role;
    const sessionData = {
      role: mappedRole,
      email: matched.email,
      username: matched.username,
      id: matched.id,
      telepon: matched.telepon || '',
      alamat: matched.alamat || '',
      foto: matched.foto || undefined
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

  const tambahLaporan = async (laporanBaru: Omit<Laporan, 'id' | 'kategoriLabel' | 'waktu' | 'logs'>) => {
    const id = (laporan.length > 0 ? (Math.max(...laporan.map(x => parseInt(x.id))) + 1).toString().padStart(4, '0') : '0149');
    
    const getDinasTujuan = (kategori: string) => {
      switch (kategori) {
        case 'jalan':
        case 'drainase':
          return 'Dinas PUPR';
        case 'penerangan':
          return 'Dinas Perhubungan';
        case 'fasilitas':
          return 'Dinas Lingkungan Hidup';
        default:
          return 'Dinas PUPR';
      }
    };

    const targetDinas = getDinasTujuan(laporanBaru.kategori);

    const fullLaporan: Laporan = {
      ...laporanBaru,
      id,
      kategoriLabel: getKategoriLabel(laporanBaru.kategori),
      waktu: 'Baru Saja',
      dinas: targetDinas,
      logs: [
        { judul: 'Aduan Dikirim', waktu: 'Baru Saja', aktor: laporanBaru.pelapor }
      ]
    };

    const updated = [fullLaporan, ...laporan];
    setLaporan(updated);
    localStorage.setItem('sigap_laporan', JSON.stringify(updated));
    if (laporanBaru.foto) {
      localStorage.setItem('sigap_foto_data_' + id, laporanBaru.foto);
    }

    try {
      const { data: userObj } = await supabase
        .from('users')
        .select('id')
        .eq('name', laporanBaru.pelapor)
        .single();

      const uId = userObj ? userObj.id : (currentUser ? parseInt(currentUser.id.toString()) || 3 : 3);
      
      const { error: insertError } = await supabase.from('laporan').insert({
        nomor_laporan: `RPT-${id}`,
        user_id: uId,
        kategori: laporanBaru.kategori,
        deskripsi: laporanBaru.deskripsi,
        lokasi: laporanBaru.lokasi,
        wilayah: laporanBaru.wilayah,
        lat: laporanBaru.lat,
        lng: laporanBaru.lng,
        urgensi: laporanBaru.urgensi,
        status: 'baru',
        dinas_tujuan: targetDinas
      });

      if (insertError) {
        console.error('Supabase insert aduan error:', insertError);
        return;
      }

      const { data: lapObj } = await supabase
        .from('laporan')
        .select('id')
        .eq('nomor_laporan', `RPT-${id}`)
        .single();

      if (lapObj) {
        await supabase.from('activity_log').insert({
          laporan_id: lapObj.id,
          judul: 'Aduan Dikirim',
          deskripsi: `Baru Saja | Oleh ${laporanBaru.pelapor}`
        });

        if (laporanBaru.foto) {
          const timestamp = Date.now();
          const fileName = `foto_${timestamp}.png`;
          const fileSize = laporanBaru.foto.length;

          await supabase.from('foto_laporan').insert({
            laporan_id: lapObj.id,
            file_path: laporanBaru.foto,
            file_name: fileName,
            file_size: fileSize
          });
        }
      }
    } catch (err) {
      console.error('Error in tambahLaporan transaction:', err);
    } finally {
      await pullFromSupabase();
    }
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

  const hapusLaporan = async (id: string): Promise<boolean> => {
    try {
      const updated = laporan.filter(l => l.id !== id);
      setLaporan(updated);
      localStorage.setItem('sigap_laporan', JSON.stringify(updated));

      // Remove the base64 photo if stored locally
      localStorage.removeItem('sigap_foto_data_' + id);

      if (supabase) {
        const { data: lapObj } = await supabase
          .from('laporan')
          .select('id')
          .eq('nomor_laporan', `RPT-${id}`)
          .single();

        if (lapObj) {
          await supabase.from('foto_laporan').delete().eq('laporan_id', lapObj.id);
          await supabase.from('activity_log').delete().eq('laporan_id', lapObj.id);
          await supabase.from('laporan').delete().eq('id', lapObj.id);
        } else {
          await supabase.from('laporan').delete().eq('nomor_laporan', `RPT-${id}`);
        }
        await pullFromSupabase();
      }
      return true;
    } catch (err) {
      console.error('Error deleting report:', err);
      return false;
    }
  };

  const updateUserProfile = async (username: string, email: string, telepon?: string, alamat?: string, foto?: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      if (supabase) {
        // Step 1: Update core fields that always exist in the schema
        const coreUpdate: Record<string, string | null | undefined> = {
          name: username,
          email: email,
        };
        if (foto !== undefined) coreUpdate.avatar_url = foto || null;

        const { error: coreError } = await supabase
          .from('users')
          .update(coreUpdate)
          .eq('id', parseInt(currentUser.id));

        if (coreError) {
          console.error('[updateUserProfile] Core update failed:', coreError.message, coreError.code);
          throw coreError;
        }

        // Step 2: Try to update telepon and alamat (columns may not exist yet)
        if (telepon !== undefined || alamat !== undefined) {
          const extraUpdate: Record<string, string | undefined> = {};
          if (telepon !== undefined) extraUpdate.telepon = telepon;
          if (alamat !== undefined) extraUpdate.alamat = alamat;

          const { error: extraError } = await supabase
            .from('users')
            .update(extraUpdate)
            .eq('id', parseInt(currentUser.id));

          if (extraError) {
            // Column may not exist yet — log warning but don't fail the whole operation
            console.warn(
              '[updateUserProfile] Could not save telepon/alamat to DB (column may not exist yet).',
              'Error:', extraError.message,
              '\nSQL to fix: ALTER TABLE users ADD COLUMN IF NOT EXISTS telepon TEXT; ALTER TABLE users ADD COLUMN IF NOT EXISTS alamat TEXT;'
            );
          }
        }
      }

      // Always save to localStorage as a reliable cross-session cache
      if (telepon !== undefined) localStorage.setItem('sigap_user_phone_' + currentUser.id, telepon);
      if (alamat !== undefined)  localStorage.setItem('sigap_user_address_' + currentUser.id, alamat);
      if (foto   !== undefined)  localStorage.setItem('sigap_user_foto_' + currentUser.id, foto);

      const updatedUser: User = {
        ...currentUser,
        username,
        email,
        telepon: telepon !== undefined ? telepon : currentUser.telepon,
        alamat:  alamat  !== undefined ? alamat  : currentUser.alamat,
        foto:    foto    !== undefined ? foto    : currentUser.foto,
      };

      setCurrentUser(updatedUser);
      
      const sessionData = {
        role: updatedUser.role === 'Masyarakat' ? 'pelapor' : updatedUser.role,
        email: updatedUser.email,
        username: updatedUser.username,
        id: updatedUser.id,
        telepon: updatedUser.telepon,
        alamat: updatedUser.alamat,
        foto: updatedUser.foto
      };
      localStorage.setItem('sigap_session', JSON.stringify(sessionData));

      // Update in users list
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            username,
            email,
            telepon: telepon !== undefined ? telepon : u.telepon,
            alamat:  alamat  !== undefined ? alamat  : u.alamat,
            foto:    foto    !== undefined ? foto    : u.foto,
          };
        }
        return u;
      });
      setUsers(updatedUsers);
      localStorage.setItem('sigap_users', JSON.stringify(updatedUsers));

      return true;
    } catch (err) {
      console.error('[updateUserProfile] Failed:', err);
      return false;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'User tidak teridentifikasi.' };
    
    // Find the user in users array to get the password
    const userInDb = users.find(u => u.id === currentUser.id);
    if (!userInDb) return { success: false, message: 'Data user tidak ditemukan.' };

    // If password is set in DB, check it
    if (userInDb.password && userInDb.password !== 'oauth_authenticated' && userInDb.password !== currentPassword) {
      return { success: false, message: 'Kata sandi saat ini salah.' };
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update({ password: newPassword })
          .eq('id', parseInt(currentUser.id));
        if (error) throw error;
      }

      // Update in users state & localStorage
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          return { ...u, password: newPassword };
        }
        return u;
      });
      setUsers(updatedUsers);
      localStorage.setItem('sigap_users', JSON.stringify(updatedUsers));

      return { success: true, message: 'Kata sandi Anda berhasil diperbarui!' };
    } catch (err) {
      console.error('Failed to update password:', err);
      return { success: false, message: 'Terjadi kesalahan sistem saat memperbarui kata sandi.' };
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
      hapusLaporan,
      syncData,
      updateUserProfile,
      updateUserPassword
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
