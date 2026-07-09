/* =========================================================================
   SIGAP - SISTEM INFORMASI GERAK ADUAN PUBLIK
   Core JavaScript Engine (localStorage Database & Dynamic Page Sync)
   ========================================================================= */

// =========================================
// SECURITY UTILITIES (XSS Mitigation & Input Sanitization)
// =========================================
function sanitizeInput(str) {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '').trim();
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Ensure light mode is always active
document.documentElement.classList.remove('dark');
localStorage.removeItem('sigap_theme');

// Simple URL helper (no theme param, kept for compatibility with redirect calls)
function getRedirectUrl(url) {
    return url;
}

// Global SIGAP Logo Click Handler — navigates to index.html from any page
document.addEventListener('DOMContentLoaded', function() {
    const logoImgs = document.querySelectorAll('img[src="sigap.png"], img[src="sigap.jpg"]');
    logoImgs.forEach(function(img) {
        // Jika logo sudah dibungkus <a href="index.html">, skip (sudah benar)
        const parent = img.closest('a');
        if (parent && (parent.getAttribute('href') === 'index.html' || parent.getAttribute('href') === './index.html')) {
            return;
        }
        // Tambahkan gaya klik dan navigasi
        img.style.cursor = 'pointer';
        img.title = 'Kembali ke Halaman Utama';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.replace('index.html');
        });
        // Jika logo dibungkus <a> ke halaman lain, override juga parentnya
        if (parent) {
            parent.style.cursor = 'pointer';
            parent.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.replace('index.html');
            });
        }
    });
});


// =========================================
// 0. AUTHENTICATION & ROLE GUARD ENGINE
// =========================================
(function checkSessionGuard() {
    const path = window.location.pathname;
    
    // Daftar Halaman Admin
    const adminPages = ['sigap.html', 'laporan.html', 'manajemen-user.html', 'peta.html', 'pengaturan-profil.html', 'detail-laporan.html'];
    // Daftar Halaman Pelapor
    const pelaporPages = ['dashboard-pelapor.html', 'buat-laporan.html', 'peta-pelapor.html', 'pengaturan-profil-pelapor.html', 'detail-laporan-pelapor.html'];
    
    // Ambil nama file secara presisi (bersihkan query string dan hash, default ke index.html)
    let pageName = path.substring(path.lastIndexOf('/') + 1).split('?')[0].split('#')[0].toLowerCase();
    if (!pageName) {
        pageName = 'index.html';
    }
    // Jika Vercel cleanUrls memotong ekstensi .html, tambahkan kembali untuk validasi
    if (!pageName.includes('.')) {
        pageName += '.html';
    }
    
    const sessionStr = localStorage.getItem('sigap_session');
    let session = null;
    if (sessionStr) {
        try {
            const parsedSession = JSON.parse(sessionStr);
            const usersStr = localStorage.getItem('sigap_users');
            const users = usersStr ? JSON.parse(usersStr) : [];
            const matchedUser = users.find(u => u.email.toLowerCase() === parsedSession.email.toLowerCase());
            if (matchedUser && matchedUser.status === 'Aktif') {
                const expectedRole = (matchedUser.role === 'Administrator' || matchedUser.role === 'Petugas PUPR') ? 'admin' : 'pelapor';
                if (parsedSession.role === expectedRole) {
                    session = parsedSession;
                }
            }
        } catch (e) {
            session = null;
        }
    }
    
    const isAdminPage = adminPages.includes(pageName);
    const isPelaporPage = pelaporPages.includes(pageName);
    
    // Auto-redirect jika sudah login dan mengunjungi halaman login
    if (pageName === 'login.html' && session && session.role === 'admin') {
        window.location.replace('sigap.html');
        return;
    }
    if (pageName === 'login-masyarakat.html' && session && session.role === 'pelapor') {
        window.location.replace('dashboard-pelapor.html');
        return;
    }
    
    if (isAdminPage) {
        if (!session) {
            window.location.replace('login.html');
            return;
        } else if (session.role !== 'admin') {
            window.location.replace('dashboard-pelapor.html');
            return;
        }
    } else if (isPelaporPage) {
        if (!session) {
            window.location.replace('login-masyarakat.html');
            return;
        } else if (session.role !== 'pelapor') {
            window.location.replace('sigap.html');
            return;
        }
    }

    // Logika Manajemen Sesi 1 Menit (Inactivity Timeout)
    if (session && (isAdminPage || isPelaporPage)) {
        const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 menit
        const WARNING_THRESHOLD_MS = 60 * 1000; // 60 detik terakhir untuk peringatan
        
        // Cek apakah sesi sudah kedaluwarsa sejak load awal
        const lastActivityStr = localStorage.getItem('sigap_session_last_activity');
        let lastActivity = lastActivityStr ? parseInt(lastActivityStr) : Date.now();
        
        // Inisialisasi jika belum ada timestamp aktivitas
        if (!lastActivityStr) {
            localStorage.setItem('sigap_session_last_activity', Date.now().toString());
            lastActivity = Date.now();
        }
        
        const now = Date.now();
        if (now - lastActivity >= SESSION_TIMEOUT_MS) {
            // Sesi sudah mati sebelum halaman dimuat
            localStorage.removeItem('sigap_session');
            localStorage.removeItem('sigap_session_last_activity');
            const redirectTarget = session.role === 'admin' ? 'login.html' : 'login-masyarakat.html';
            window.location.replace(redirectTarget);
            return;
        }
        
        // Logika monitoring aktivitas pengguna
        let lastLoggedActivity = Date.now();
        function updateActivity() {
            const currentTime = Date.now();
            // Throttle penulisan ke localStorage maksimal 1 detik sekali untuk optimasi
            if (currentTime - lastLoggedActivity > 1000) {
                localStorage.setItem('sigap_session_last_activity', currentTime.toString());
                lastLoggedActivity = currentTime;
            }
        }
        
        // Dengarkan berbagai event interaksi user
        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(evt => {
            document.addEventListener(evt, updateActivity, { passive: true });
        });
        
        // Setup Modal Peringatan Sesi
        let warningModal = null;
        
        function showWarningModal() {
            if (document.getElementById('session-warning-modal')) return;
            
            warningModal = document.createElement('div');
            warningModal.id = 'session-warning-modal';
            warningModal.className = 'fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 opacity-0 scale-95';
            
            warningModal.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 transform transition-all duration-300 p-6 flex flex-col items-center">
                    <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 text-2xl animate-pulse">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Sesi Anda Hampir Berakhir</h3>
                    <p class="text-slate-600 dark:text-slate-300 text-sm mb-6 text-center leading-relaxed">
                        Anda tidak melakukan aktivitas selama beberapa saat. Sesi akan otomatis ditutup dalam 
                        <span id="session-countdown-timer" class="font-extrabold text-amber-600 dark:text-amber-400 text-lg px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 inline-block animate-bounce">15</span> detik.
                    </p>
                    <div class="flex gap-3 w-full">
                        <button id="session-logout-now-btn" class="flex-1 py-2.5 px-4 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 font-semibold transition-all active:scale-95 text-center text-sm">
                            Keluar Sekarang
                        </button>
                        <button id="session-continue-btn" class="flex-1 py-2.5 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-center text-sm">
                            Lanjutkan Sesi
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(warningModal);
            
            // Trigger animation fade-in
            setTimeout(() => {
                warningModal.classList.remove('opacity-0', 'scale-95');
                warningModal.classList.add('opacity-100', 'scale-100');
            }, 10);
            
            // Pasang event listener tombol
            document.getElementById('session-continue-btn').addEventListener('click', () => {
                localStorage.setItem('sigap_session_last_activity', Date.now().toString());
                lastLoggedActivity = Date.now();
                removeWarningModal();
            });
            
            document.getElementById('session-logout-now-btn').addEventListener('click', () => {
                autoLogout();
            });
        }
        
        function removeWarningModal() {
            const modal = document.getElementById('session-warning-modal');
            if (modal) {
                modal.classList.remove('opacity-100', 'scale-100');
                modal.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
        }
        
        function autoLogout() {
            clearInterval(checkInterval);
            activityEvents.forEach(evt => {
                document.removeEventListener(evt, updateActivity);
            });
            removeWarningModal();
            localStorage.removeItem('sigap_session');
            localStorage.removeItem('sigap_session_last_activity');
            const redirectTarget = session.role === 'admin' ? 'login.html' : 'login-masyarakat.html';
            window.location.replace(redirectTarget);
        }
        
        // Loop pengecekan sesi berkala
        const checkInterval = setInterval(() => {
            const currentActivity = parseInt(localStorage.getItem('sigap_session_last_activity') || '0');
            const timeElapsed = Date.now() - currentActivity;
            
            if (timeElapsed >= SESSION_TIMEOUT_MS) {
                autoLogout();
            } else if (timeElapsed >= SESSION_TIMEOUT_MS - WARNING_THRESHOLD_MS) {
                // Tampilkan modal jika belum ada
                showWarningModal();
                // Hitung mundur sisa detik
                const secondsLeft = Math.ceil((SESSION_TIMEOUT_MS - timeElapsed) / 1000);
                const timerEl = document.getElementById('session-countdown-timer');
                if (timerEl) {
                    timerEl.innerText = secondsLeft;
                }
            } else {
                // Jika user aktif di tab lain, sembunyikan modal jika sedang tampil
                removeWarningModal();
            }
        }, 1000);
    }
})();

function handleLogout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('sigap_session');
    localStorage.removeItem('sigap_session_last_activity');
    if (supabaseClient) {
        supabaseClient.auth.signOut();
    }
    window.location.replace('index.html');
}

// Auto-bind logout buttons on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLogoutTriggers);
} else {
    bindLogoutTriggers();
}

function bindLogoutTriggers() {
    document.querySelectorAll('a[href="login.html"], a[href="login-masyarakat.html"]').forEach(btn => {
        const hasLogoutIcon = btn.querySelector('.fa-right-from-bracket') || btn.querySelector('.fa-right-to-bracket');
        const hasLogoutTitle = btn.title === 'Keluar' || btn.title === 'Logout';
        const hasLogoutText = btn.innerHTML.includes('Keluar') || btn.innerHTML.includes('Logout');
        
        // Hanya bind jika benar-benar merupakan tombol keluar
        if (hasLogoutIcon || hasLogoutTitle || hasLogoutText) {
            btn.addEventListener('click', handleLogout);
        }
    });
}

// 1. DATA DEFAULT (MOCK DATABASE)
const defaultLaporan = [
    {
        id: "0148",
        lat: -7.97662,
        lng: 112.63263,
        kategori: "jalan",
        kategoriLabel: "Jalan Berlubang",
        deskripsi: "Ada lubang dengan diameter sekitar 1 meter dan kedalaman mencapai 15 cm di tengah jalan utama. Kondisi ini sangat membahayakan bagi pengendara sepeda motor, terutama saat malam hari karena minimnya penerangan di sekitar area tersebut. Tadi pagi hampir terjadi kecelakaan beruntun karena rem mendadak.",
        status: "baru",
        pelapor: "Budi Santoso",
        waktu: "Hari ini, 10:15 WIB",
        lokasi: "Jl. Merdeka No. 42",
        wilayah: "Kec. Klojen, Kota Malang",
        urgensi: "Tinggi",
        dinas: "Dinas PUPR (Pekerjaan Umum)",
        foto: "assets/images/jalanrusak.jpg", // fallback ke jalanrusak.jpg di root jika file assets tidak ada
        logs: [
            { judul: "Validasi Masuk Sistem", waktu: "Hari ini, 10:16 WIB", aktor: "Sistem Otomatis" },
            { judul: "Aduan Dikirim", waktu: "Hari ini, 10:15 WIB", aktor: "Budi Santoso (Mobile App)" }
        ]
    },
    {
        id: "0147",
        lat: -7.96210,
        lng: 112.62510,
        kategori: "penerangan",
        kategoriLabel: "Penerangan Jalan",
        deskripsi: "3 Lampu merkuri padam total membuat jalanan gelap gulita saat malam, rawan tindakan kriminalitas jalanan.",
        status: "proses",
        pelapor: "Siti Rahma",
        waktu: "Kemarin, 16:40 WIB",
        lokasi: "Pojok Alun-Alun Utara",
        wilayah: "Kec. Lowokwaru, Kota Malang",
        urgensi: "Sedang",
        dinas: "Dinas Perhubungan",
        foto: "assets/images/jalanrusak.jpg",
        logs: [
            { judul: "Pengiriman Regu Lapangan", waktu: "Kemarin, 18:00 WIB", aktor: "Admin Utama" },
            { judul: "Aduan Diverifikasi", waktu: "Kemarin, 17:10 WIB", aktor: "Admin Utama" },
            { judul: "Aduan Dikirim", waktu: "Kemarin, 16:40 WIB", aktor: "Siti Rahma" }
        ]
    },
    {
        id: "0146",
        lat: -7.99320,
        lng: 112.61890,
        kategori: "drainase",
        kategoriLabel: "Drainase rusak",
        deskripsi: "Selokan tersumbat sampah beton sisa proyek perbaikan ruko, air meluap ke aspal saat hujan deras mengguyur wilayah Klojen.",
        status: "selesai",
        pelapor: "Ahmad Dhani",
        waktu: "04 Juni 2026, 09:10 WIB",
        lokasi: "Jl. Borobudur Gang 4",
        wilayah: "Kec. Blimbing, Kota Malang",
        urgensi: "Sedang",
        dinas: "Dinas PUPR (Pekerjaan Umum)",
        foto: "assets/images/jalanrusak.jpg",
        logs: [
            { judul: "Perbaikan Selesai & Konfirmasi Fisik", waktu: "06 Juni 2026, 14:00 WIB", aktor: "Petugas Lapangan" },
            { judul: "Regu Lapangan Meluncur", waktu: "05 Juni 2026, 08:30 WIB", aktor: "Admin Utama" },
            { judul: "Aduan Diverifikasi", waktu: "04 Juni 2026, 11:00 WIB", aktor: "Admin Utama" }
        ]
    },
    {
        id: "0149",
        lat: -7.98100,
        lng: 112.63500,
        kategori: "fasilitas",
        kategoriLabel: "Fasilitas Sosial / Taman",
        deskripsi: "Ayunan anak di area pojok timur Alun-Alun rusak berat dan terputus rantainya, membahayakan anak-anak yang bermain.",
        status: "baru",
        pelapor: "Diana Putri",
        waktu: "2 Hari Lalu",
        lokasi: "Alun-Alun Kota Malang",
        wilayah: "Kec. Klojen, Kota Malang",
        urgensi: "Tinggi",
        dinas: "Dinas Lingkungan Hidup",
        foto: "assets/images/jalanrusak.jpg",
        logs: [
            { judul: "Validasi Masuk Sistem", waktu: "2 Hari Lalu", aktor: "Sistem Otomatis" },
            { judul: "Aduan Dikirim", waktu: "2 Hari Lalu", aktor: "Diana Putri" }
        ]
    }
];

const defaultUsers = [
    {
        id: "user-admin",
        username: "Admin Utama",
        email: "admin@sigap.go.id",
        identitas: "-",
        role: "Administrator",
        status: "Aktif",
        registered: "01 Jan 2026",
        password: "admin123"
    },
    {
        id: "user-hw",
        username: "Hendra Wijaya",
        email: "hendra.pupr@sigap.go.id",
        identitas: "NIP: 198504232010121005",
        role: "Petugas PUPR",
        status: "Aktif",
        registered: "15 Feb 2026",
        password: "petugas123"
    },
    {
        id: "user-bs",
        username: "Budi Santoso",
        email: "budi.santoso99@gmail.com",
        identitas: "NIK: 3573012345670001",
        role: "Masyarakat",
        status: "Aktif",
        registered: "Hari ini",
        password: "warga123"
    }
];

// =========================================
// SUPABASE CLIENT-SIDE SYNCHRONIZATION ENGINE
// =========================================
const SUPABASE_URL = "https://qoojwiiioxaesvgqtkyw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb2p3aWlpb3hhZXN2Z3F0a3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTQ4NDgsImV4cCI6MjA5OTA5MDg0OH0.3MeuyAjWLZHNfWJXY757TjBvWBQ2tlA5LssY0MreBgU";
let supabaseClient = null;

// Dynamically load external scripts (Supabase and Bcrypt)
(function loadExternalLibraries() {
    // Load Supabase JS SDK
    if (typeof supabase === 'undefined') {
        const supScript = document.createElement('script');
        supScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        supScript.onload = () => {
            initSupabaseAndSync();
        };
        document.head.appendChild(supScript);
    } else {
        initSupabaseAndSync();
    }

    // Load Bcrypt JS for secure client-side password hashing
    if (typeof dcodeIO === 'undefined') {
        const bcryptScript = document.createElement('script');
        bcryptScript.src = "https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js";
        document.head.appendChild(bcryptScript);
    }
})();

function initSupabaseAndSync() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Listen for Supabase Auth state changes (useful for Google OAuth redirect)
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                const user = session.user;
                
                // Map Google user profile to standard SIGAP session format
                const sessionData = {
                    role: 'pelapor',
                    email: user.email,
                    username: user.user_metadata.full_name || user.email.split('@')[0],
                    id: user.id
                };
                localStorage.setItem('sigap_session', JSON.stringify(sessionData));
                localStorage.setItem('sigap_session_last_activity', Date.now().toString());

                // Create user profile in our custom database table if it doesn't exist
                const dbUsers = getUsers();
                const userExists = dbUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase());
                
                if (!userExists) {
                    const newUser = {
                        id: user.id.toString(),
                        username: user.user_metadata.full_name || user.email.split('@')[0],
                        email: user.email,
                        identitas: "-",
                        role: "Masyarakat",
                        status: "Aktif",
                        registered: "Google Sign-In",
                        password: "oauth_authenticated"
                    };
                    dbUsers.push(newUser);
                    saveUsers(dbUsers);
                }

                // If currently on login page, redirect to dashboard
                if (window.location.pathname.includes('login-masyarakat.html')) {
                    window.location.replace('dashboard-pelapor.html');
                }
            }
        });

        pullFromSupabase();
    }
}

// Function to trigger Google Sign-In redirect via Supabase
async function loginDenganGoogle() {
    if (!supabaseClient) {
        alert("Koneksi database sedang disiapkan, silakan coba beberapa saat lagi.");
        return;
    }
    
    try {
        const redirectUrl = window.location.origin + window.location.pathname.replace('login-masyarakat.html', 'dashboard-pelapor.html');
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        
        if (error) throw error;
    } catch (err) {
        console.error("Error logging in with Google:", err.message);
        alert("Gagal masuk dengan Google: " + err.message);
    }
}

// Function to map kategori code to human readable label
function getKategoriLabel(kategori) {
    const labels = {
        'jalan': 'Jalan Berlubang',
        'penerangan': 'Penerangan Jalan',
        'drainase': 'Drainase rusak',
        'fasilitas': 'Fasilitas Sosial / Taman',
        'lainnya': 'Laporan Lainnya'
    };
    return labels[kategori] || 'Laporan Umum';
}

// Helper to check if a string is a valid bcrypt hash
function isBcryptHash(str) {
    return typeof str === 'string' && (str.startsWith('$2b$') || str.startsWith('$2a$'));
}

// Pull data from Supabase and cache locally in localStorage
async function pullFromSupabase() {
    if (!supabaseClient) return;

    try {
        console.log("Supabase: Syncing database state...");

        // 1. Fetch Users
        const { data: dbUsers, error: errUsers } = await supabaseClient
            .from('users')
            .select('*');

        if (!errUsers && dbUsers) {
            const mappedUsers = dbUsers.map(u => ({
                id: u.id.toString(),
                username: u.name,
                email: u.email,
                identitas: u.nik || "-",
                role: u.role,
                status: u.status === 'Menunggu' ? 'Menunggu Verifikasi' : u.status,
                registered: "Terdaftar",
                password: u.password
            }));
            localStorage.setItem('sigap_users', JSON.stringify(mappedUsers));
        }

        // 2. Fetch Laporan with nested logs and photos
        const { data: dbLaporan, error: errLaporan } = await supabaseClient
            .from('laporan')
            .select(`
                *,
                users ( name ),
                activity_log ( * ),
                foto_laporan ( * )
            `);

        if (!errLaporan && dbLaporan) {
            const mappedLaporan = dbLaporan.map(l => {
                // Map activity logs
                const mappedLogs = (l.activity_log || []).map(log => {
                    let waktuStr = "Baru Saja";
                    let aktorStr = "Sistem";
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

                // Map photo
                let fotoUrl = "assets/images/jalanrusak.jpg";
                if (l.foto_laporan && l.foto_laporan.length > 0) {
                    fotoUrl = l.foto_laporan[0].file_path;
                }

                return {
                    id: l.nomor_laporan.replace("RPT-", ""),
                    lat: parseFloat(l.lat),
                    lng: parseFloat(l.lng),
                    kategori: l.kategori,
                    kategoriLabel: getKategoriLabel(l.kategori),
                    deskripsi: l.deskripsi,
                    status: l.status,
                    pelapor: l.users ? l.users.name : "Masyarakat",
                    waktu: "Tersinkron",
                    lokasi: l.lokasi,
                    wilayah: l.wilayah,
                    urgensi: l.urgensi,
                    dinas: l.dinas_tujuan,
                    foto: fotoUrl,
                    logs: mappedLogs.length > 0 ? mappedLogs : [
                        { judul: "Aduan Dikirim", waktu: "Baru Saja", aktor: l.users ? l.users.name : "Pelapor" }
                    ]
                };
            });

            localStorage.setItem('sigap_laporan', JSON.stringify(mappedLaporan));
        }

        console.log("Supabase: Sync complete!");
        
        // Re-render UI elements to show the synced database state
        reRenderActivePage();

    } catch (err) {
        console.error("Error pulling data from Supabase:", err);
    }
}

// Push local changes of Laporan to Supabase
async function pushLaporanToSupabase(listAduan) {
    if (!supabaseClient) return;

    try {
        // Fetch current users to map user_id from pelapor name
        const { data: dbUsers } = await supabaseClient.from('users').select('id, name');
        const userMap = {};
        if (dbUsers) {
            dbUsers.forEach(u => {
                userMap[u.name.toLowerCase()] = u.id;
            });
        }

        const session = getSession();
        const currentUserId = session ? parseInt(session.id) : null;

        for (const aduan of listAduan) {
            let mappedUserId = userMap[aduan.pelapor.toLowerCase()] || currentUserId || 3;
            const nomorLaporan = `RPT-${aduan.id}`;

            // 1. Upsert Laporan
            const { data: upserted, error: errU } = await supabaseClient
                .from('laporan')
                .upsert({
                    nomor_laporan: nomorLaporan,
                    user_id: mappedUserId,
                    kategori: aduan.kategori,
                    deskripsi: aduan.deskripsi,
                    lokasi: aduan.lokasi,
                    wilayah: aduan.wilayah,
                    lat: parseFloat(aduan.lat),
                    lng: parseFloat(aduan.lng),
                    urgensi: aduan.urgensi,
                    status: aduan.status,
                    dinas_tujuan: aduan.dinas
                }, { onConflict: 'nomor_laporan' })
                .select();

            if (upserted && upserted.length > 0) {
                const dbLaporanId = upserted[0].id;

                // 2. Sync activity logs
                if (aduan.logs && aduan.logs.length > 0) {
                    const logsToInsert = aduan.logs.map(log => {
                        let logActorId = userMap[log.aktor.toLowerCase()] || null;
                        let actorType = 'system';
                        if (log.aktor.toLowerCase().includes('admin') || log.aktor.toLowerCase().includes('petugas')) {
                            actorType = 'admin';
                        } else if (logActorId) {
                            actorType = 'pelapor';
                        }
                        return {
                            laporan_id: dbLaporanId,
                            actor_id: logActorId,
                            actor_type: actorType,
                            judul: log.judul,
                            deskripsi: `${log.waktu} | Oleh ${log.aktor}`
                        };
                    });

                    // Clear old logs and insert new ones
                    await supabaseClient.from('activity_log').delete().eq('laporan_id', dbLaporanId);
                    await supabaseClient.from('activity_log').insert(logsToInsert);
                }

                // 3. Sync foto
                if (aduan.foto && aduan.foto !== 'assets/images/jalanrusak.jpg') {
                    const fotoToInsert = {
                        laporan_id: dbLaporanId,
                        file_path: aduan.foto,
                        file_name: aduan.foto.split('/').pop(),
                        file_size: 1024 * 100 // dummy size
                    };
                    await supabaseClient.from('foto_laporan').delete().eq('laporan_id', dbLaporanId);
                    await supabaseClient.from('foto_laporan').insert(fotoToInsert);
                }
            }
        }
    } catch (err) {
        console.error("Error pushing laporan to Supabase:", err);
    }
}

// Push local changes of Users to Supabase
async function pushUsersToSupabase(listUsers) {
    if (!supabaseClient) return;

    try {
        for (const u of listUsers) {
            let userPassword = u.password;
            
            // Hash password securely in client if not already hashed
            if (userPassword && !isBcryptHash(userPassword) && typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
                const salt = dcodeIO.bcrypt.genSaltSync(10);
                userPassword = dcodeIO.bcrypt.hashSync(userPassword, salt);
            }

            const isNumericId = !isNaN(u.id);

            const userObj = {
                name: u.username,
                email: u.email,
                password: userPassword,
                nik: u.identitas === '-' ? null : u.identitas,
                role: u.role === 'Administrator' ? 'Administrator' : (u.role === 'Petugas PUPR' ? 'Petugas PUPR' : 'Masyarakat'),
                status: u.status === 'Menunggu Verifikasi' ? 'Menunggu' : (u.status === 'Menunggu' ? 'Menunggu' : u.status)
            };

            if (isNumericId) {
                userObj.id = parseInt(u.id);
            }

            await supabaseClient.from('users').upsert(userObj, { onConflict: 'email' });
        }
    } catch (err) {
        console.error("Error pushing users to Supabase:", err);
    }
}

// Get session helper
function getSession() {
    const sessionStr = localStorage.getItem('sigap_session');
    if (!sessionStr) return null;
    try {
        return JSON.parse(sessionStr);
    } catch {
        return null;
    }
}

// Trigger render functions dynamically based on current page context
function reRenderActivePage() {
    if (document.getElementById('current-date')) {
        renderDashboard();
    }
    if (document.getElementById('search-input') || document.getElementById('filter-kategori')) {
        renderLaporanTable();
    }
    if (document.getElementById('mapDetail')) {
        initDetailPage();
    }
    if (document.getElementById('search-user')) {
        renderUsersTable();
    }
    if (document.getElementById('mapPeta')) {
        initPetaDampak();
    }
    if (document.getElementById('pelapor-total-laporan')) {
        renderDasborPelapor();
    }
    if (document.getElementById('mapPetaPelapor')) {
        initPetaDampakPelapor();
    }
    if (document.getElementById('mapDetailPelapor')) {
        initDetailPagePelapor();
    }
    if (document.getElementById('pelapor-name-display')) {
        initProfilePelapor();
    }
}

// 2. INITIALIZATION ENGINE
function getLaporan() {
    if (!localStorage.getItem('sigap_laporan')) {
        localStorage.setItem('sigap_laporan', JSON.stringify(defaultLaporan));
    }
    return JSON.parse(localStorage.getItem('sigap_laporan'));
}

function saveLaporan(data) {
    localStorage.setItem('sigap_laporan', JSON.stringify(data));
    pushLaporanToSupabase(data);
}

function getUsers() {
    if (!localStorage.getItem('sigap_users')) {
        localStorage.setItem('sigap_users', JSON.stringify(defaultUsers));
    }
    return JSON.parse(localStorage.getItem('sigap_users'));
}

function saveUsers(data) {
    localStorage.setItem('sigap_users', JSON.stringify(data));
    pushUsersToSupabase(data);
}

// Initial sync call
getLaporan();
getUsers();

// =========================================
// 3. FUNGSI HALAMAN LOGIN & REGISTER
// =========================================
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const eyeIcon = document.getElementById('eyeIcon');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        if (confirmPasswordInput) confirmPasswordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.className = "fa-solid fa-eye-slash text-xs";
        } else {
            eyeIcon.className = "fa-solid fa-eye text-xs";
        }
    });
}

function handleLogin(event) {
    event.preventDefault();
    const emailInput = sanitizeInput(document.getElementById('email').value.trim());
    const passwordInput = sanitizeInput(document.getElementById('password').value);
    const btn = event.target.querySelector('button[type="submit"]');

    const users = getUsers();
    const matchedUser = users.find(u => {
        if (u.email.toLowerCase() !== emailInput.toLowerCase()) return false;
        if (isBcryptHash(u.password) && typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
            return dcodeIO.bcrypt.compareSync(passwordInput, u.password);
        }
        return u.password === passwordInput;
    });

    if (!matchedUser) {
        alert("Gagal Masuk! Alamat email atau kata sandi yang Anda masukkan salah.");
        return;
    }

    if (matchedUser.status !== 'Aktif') {
        alert("Akses Ditolak! Akun Anda sedang menunggu verifikasi oleh Administrator. Silakan tunggu beberapa saat atau hubungi dukungan teknis.");
        return;
    }

    // Role guard: hanya Administrator dan Petugas PUPR yang boleh masuk lewat portal admin
    if (matchedUser.role !== 'Administrator' && matchedUser.role !== 'Petugas PUPR') {
        alert("Akses Ditolak! Akun Anda terdaftar sebagai " + matchedUser.role + ". Silakan masuk melalui Portal Masyarakat.");
        return;
    }

    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memverifikasi...';
        btn.classList.add('opacity-80', 'cursor-not-allowed');
        btn.disabled = true;
    }

    setTimeout(() => {
        const sessionData = {
            role: 'admin',
            email: matchedUser.email,
            username: matchedUser.username,
            id: matchedUser.id
        };
        localStorage.setItem('sigap_session', JSON.stringify(sessionData));
        localStorage.setItem('sigap_session_last_activity', Date.now().toString());
        window.location.replace('sigap.html');
    }, 150);
}

function handleLoginMasyarakat(event) {
    event.preventDefault();
    const emailInput = sanitizeInput(event.target.querySelector('input[type="email"]').value.trim());
    const passwordInput = sanitizeInput(document.getElementById('password').value);
    const btn = document.getElementById('btnLogin');

    const users = getUsers();
    const matchedUser = users.find(u => {
        if (u.email.toLowerCase() !== emailInput.toLowerCase()) return false;
        if (isBcryptHash(u.password) && typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) {
            return dcodeIO.bcrypt.compareSync(passwordInput, u.password);
        }
        return u.password === passwordInput;
    });

    if (!matchedUser) {
        alert("Gagal Masuk! Alamat email atau kata sandi yang Anda masukkan salah.");
        return;
    }

    if (matchedUser.status !== 'Aktif') {
        alert("Akses Ditolak! Akun Anda belum diaktifkan atau sedang menunggu verifikasi oleh Administrator.");
        return;
    }

    // Role guard: hanya Masyarakat yang boleh masuk lewat portal pelapor
    if (matchedUser.role !== 'Masyarakat') {
        alert("Akses Ditolak! Akun Anda terdaftar sebagai " + matchedUser.role + ". Silakan masuk melalui Portal Admin.");
        return;
    }

    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengautentikasi...';
        btn.classList.add('opacity-80', 'cursor-not-allowed');
        btn.disabled = true;
    }

    setTimeout(() => {
        const sessionData = {
            role: 'pelapor',
            email: matchedUser.email,
            username: matchedUser.username,
            id: matchedUser.id
        };
        localStorage.setItem('sigap_session', JSON.stringify(sessionData));
        localStorage.setItem('sigap_session_last_activity', Date.now().toString());
        window.location.replace('dashboard-pelapor.html');
    }, 150);
}

function handleRegister(event) {
    event.preventDefault();
    const rawNama = event.target.querySelectorAll('input')[0].value;
    const rawNik = event.target.querySelectorAll('input')[1].value;
    const rawEmail = event.target.querySelectorAll('input')[2].value;
    const rawPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const nama = sanitizeInput(rawNama);
    const nik = sanitizeInput(rawNik);
    const email = sanitizeInput(rawEmail);
    const password = sanitizeInput(rawPassword);

    if (nama.length < 3) {
        alert("Gagal Mendaftar! Nama Lengkap minimal harus terdiri dari 3 karakter.");
        return;
    }

    if (!/^\d{16}$/.test(nik)) {
        alert("Gagal Mendaftar! NIK harus berupa angka sepanjang 16 digit.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Gagal Mendaftar! Format alamat email tidak valid.");
        return;
    }

    if (password.length < 8) {
        alert("Gagal Mendaftar! Kata sandi minimal harus terdiri dari 8 karakter.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Gagal! Konfirmasi kata sandi tidak cocok.");
        return;
    }

    const btn = document.getElementById('btnRegister');

    // Tambahkan pengguna baru ke database lokal
    const dbUsers = getUsers();

    // Validasi duplikasi email
    if (dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Gagal! Alamat email ini sudah terdaftar.");
        return;
    }

    // Validasi duplikasi NIK
    if (dbUsers.some(u => u.identitas === 'NIK: ' + nik)) {
        alert("Gagal! NIK ini sudah terdaftar.");
        return;
    }

    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mendaftarkan...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    btn.disabled = true;

    const newUser = {
        id: 'user-' + Date.now(),
        username: nama,
        email: email,
        identitas: 'NIK: ' + nik,
        role: "Masyarakat",
        status: "Aktif",
        registered: "Baru Saja",
        password: password
    };
    dbUsers.push(newUser);
    saveUsers(dbUsers);

    setTimeout(() => {
        alert("Pendaftaran Berhasil!\nAkun Anda telah aktif. Silakan masuk.");
        window.location.replace('login-masyarakat.html');
    }, 300);
}

// =========================================
// 4. LOGIKA DASBOR ADMIN (sigap.html)
// =========================================
function renderDashboard() {
    const listAduan = getLaporan();
    
    // Hitung statistik
    const total = listAduan.length;
    const baru = listAduan.filter(x => x.status === 'baru').length;
    const proses = listAduan.filter(x => x.status === 'proses').length;
    const selesai = listAduan.filter(x => x.status === 'selesai').length;

    const elTotal = document.querySelector('h3.text-gray-900');
    const elBaru = document.querySelector('h3.text-red-600');
    const elProses = document.querySelector('h3.text-amber-500');
    const elSelesai = document.querySelector('h3.text-green-600');

    if (elTotal) elTotal.innerText = total.toLocaleString('id-ID');
    if (elBaru) elBaru.innerText = baru;
    if (elProses) elProses.innerText = proses;
    if (elSelesai) elSelesai.innerText = selesai.toLocaleString('id-ID');

    // Render tabel
    const tbody = document.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '';
        listAduan.slice(0, 5).forEach(aduan => {
            let badgeClass = 'bg-red-50 text-red-600';
            let dotClass = 'bg-red-500';
            let labelStatus = 'Baru';

            if (aduan.status === 'proses') {
                badgeClass = 'bg-amber-50 text-amber-600';
                dotClass = 'bg-amber-500';
                labelStatus = 'Diproses';
            } else if (aduan.status === 'selesai') {
                badgeClass = 'bg-green-50 text-green-600';
                dotClass = 'bg-green-500';
                labelStatus = 'Selesai';
            }

            const row = `
                <tr class="aduan-row hover:bg-gray-50 transition">
                    <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <p class="font-medium text-gray-800">${escapeHTML(aduan.pelapor)}</p>
                        <span class="text-xs text-gray-400">${escapeHTML(aduan.waktu)}</span>
                    </td>
                    <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">${escapeHTML(aduan.kategoriLabel)}</span>
                    </td>
                    <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <p class="text-gray-700 max-w-xs truncate">${escapeHTML(aduan.lokasi)}</p>
                        <a href="peta.html" class="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                            <i class="fa-solid fa-location-dot"></i> Lihat di Peta
                        </a>
                    </td>
                    <td class="px-4 sm:px-6 py-3 sm:py-4">
                        <span class="inline-flex items-center gap-1.5 ${badgeClass} px-2 py-1 rounded-md text-xs font-semibold">
                            <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}
                        </span>
                    </td>
                    <td class="px-4 sm:px-6 py-3 sm:py-4 text-right space-x-2">
                        ${aduan.status === 'baru' ? `<button onclick="prosesLaporanDasbor('${aduan.id}')" class="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-600 hover:text-white transition">Proses</button>` : ''}
                        ${aduan.status === 'proses' ? `<button onclick="selesaikanLaporanDasbor('${aduan.id}')" class="bg-green-50 text-green-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-600 hover:text-white transition">Selesaikan</button>` : ''}
                        <a href="detail-laporan.html?id=${aduan.id}" class="inline-block bg-gray-50 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200 transition text-center">Detail</a>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }
}

function prosesLaporanDasbor(id) {
    const listAduan = getLaporan();
    const target = listAduan.find(x => x.id === id);
    if (target) {
        target.status = 'proses';
        target.logs.unshift({ judul: "Aduan Diproses & Penugasan Tim", waktu: "Baru Saja", aktor: "Admin Utama" });
        saveLaporan(listAduan);
        renderDashboard();
        alert(`Sukses! Laporan ID #${id} berhasil diubah statusnya menjadi 'Diproses'.`);
    }
}

function selesaikanLaporanDasbor(id) {
    const listAduan = getLaporan();
    const target = listAduan.find(x => x.id === id);
    if (target) {
        target.status = 'selesai';
        target.logs.unshift({ judul: "Perbaikan Selesai & Diarsipkan", waktu: "Baru Saja", aktor: "Admin Utama" });
        saveLaporan(listAduan);
        renderDashboard();
        alert(`Sukses! Laporan ID #${id} ditutup dengan hasil 'Selesai'.`);
    }
}

// Inisialisasi dasbor jika berada di halaman dasbor
if (document.getElementById('current-date')) {
    renderDashboard();
}

// =========================================
// 5. LOGIKA FILTER & TABEL LAPORAN (laporan.html)
// =========================================
function renderLaporanTable() {
    const listAduan = getLaporan();
    const tbody = document.getElementById('tbody-laporan');
    if (!tbody) return;

    tbody.innerHTML = '';
    listAduan.forEach(aduan => {
        let badgeClass = 'bg-red-50 text-red-600';
        let dotClass = 'bg-red-500';
        let labelStatus = 'Baru';

        if (aduan.status === 'proses') {
            badgeClass = 'bg-amber-50 text-amber-600';
            dotClass = 'bg-amber-500';
            labelStatus = 'Diproses';
        } else if (aduan.status === 'selesai') {
            badgeClass = 'bg-green-50 text-green-600';
            dotClass = 'bg-green-500';
            labelStatus = 'Selesai';
        }

        const row = `
            <tr data-kategori="${escapeHTML(aduan.kategori)}" data-status="${escapeHTML(aduan.status)}" class="laporan-row hover:bg-gray-50 transition">
                <td class="px-4 sm:px-6 py-3 sm:py-4 font-mono font-bold text-gray-400">#${escapeHTML(aduan.id)}</td>
                <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <p class="font-semibold text-gray-900 target-pencarian">${escapeHTML(aduan.pelapor)}</p>
                    <span class="text-xs text-gray-400">${escapeHTML(aduan.waktu)}</span>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mb-1">${escapeHTML(aduan.kategoriLabel)}</span>
                    <p class="text-gray-600 text-xs max-w-xs truncate">${escapeHTML(aduan.deskripsi)}</p>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 text-gray-600">
                    <p class="font-medium target-pencarian">${escapeHTML(aduan.lokasi)}</p>
                    <span class="text-xs text-gray-400">${escapeHTML(aduan.wilayah)}</span>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4">
                    <span class="inline-flex items-center gap-1 ${badgeClass} px-2 py-1 rounded-md text-xs font-semibold">
                        <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}
                    </span>
                </td>
                <td class="px-4 sm:px-6 py-3 sm:py-4 text-center">
                    <a href="detail-laporan.html?id=${aduan.id}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition text-center">Tinjau</a>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    const countVisible = document.getElementById('count-visible');
    if (countVisible) countVisible.innerText = listAduan.length;
}

function jalankanFilterLaporan() {
    const searchVal = document.getElementById('searchAduan').value.toLowerCase();
    const kategoriVal = document.getElementById('filterKategori').value;
    const statusVal = document.getElementById('filterStatus').value;
    const rows = document.querySelectorAll('.laporan-row');
    let count = 0;

    rows.forEach(row => {
        const rowKategori = row.getAttribute('data-kategori');
        const rowStatus = row.getAttribute('data-status');
        const searchTargetText = Array.from(row.querySelectorAll('.target-pencarian'))
                                      .map(x => x.innerText.toLowerCase())
                                      .join(' ');

        const matchSearch = searchTargetText.includes(searchVal);
        const matchKategori = (kategoriVal === 'semua') || (rowKategori === kategoriVal);
        const matchStatus = (statusVal === 'semua') || (rowStatus === statusVal);

        if (matchSearch && matchKategori && matchStatus) {
            row.style.display = '';
            count++;
        } else {
            row.style.display = 'none';
        }
    });

    const countVisible = document.getElementById('count-visible');
    if (countVisible) countVisible.innerText = count;
}

if (document.getElementById('tbody-laporan')) {
    renderLaporanTable();
    document.getElementById('searchAduan').addEventListener('input', jalankanFilterLaporan);
    document.getElementById('filterKategori').addEventListener('change', jalankanFilterLaporan);
    document.getElementById('filterStatus').addEventListener('change', jalankanFilterLaporan);
}

function resetFilters() {
    document.getElementById('searchAduan').value = '';
    document.getElementById('filterKategori').value = 'semua';
    document.getElementById('filterStatus').value = 'semua';
    jalankanFilterLaporan();
    alert('Semua filter pencarian dibersihkan.');
}

// =========================================
// 6. LOGIKA DETAIL LAPORAN DINAMIS (detail-laporan.html)
// =========================================
function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const aduanId = urlParams.get('id') || "0148"; // fallback ke ID 0148
    const listAduan = getLaporan();
    const aduan = listAduan.find(x => x.id === aduanId);

    if (!aduan) return;

    // Judul & Header
    document.title = `SIGAP - Detail Laporan #${aduan.id}`;
    const headerTitle = document.querySelector('h2.text-xl');
    if (headerTitle) headerTitle.innerHTML = `Detail Validasi Aduan #${aduan.id}`;

    // Lencana Status Header
    const statusBadge = document.getElementById('status-badge');
    if (statusBadge) {
        if (aduan.status === "baru") {
            statusBadge.className = "inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200";
            statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> BARU MASUK';
        } else if (aduan.status === "proses") {
            statusBadge.className = "inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200";
            statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-500 animate-spin"></span> SEDANG DIPROSES';
        } else if (aduan.status === "selesai") {
            statusBadge.className = "inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-200";
            statusBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-500"></span> SELESAI DIPERBAIKI';
        }
    }

    // Detail Konten Kiri
    const tidElement = document.querySelector('.font-mono.text-gray-400');
    if (tidElement) tidElement.innerText = `TID-${aduan.id}`;

    const titleElement = document.querySelector('h3.text-lg.font-bold');
    if (titleElement) titleElement.innerText = aduan.kategoriLabel;

    const reporterMeta = document.querySelector('.text-xs.text-gray-500.mt-1');
    if (reporterMeta) {
        reporterMeta.innerHTML = `
            <span><i class="fa-solid fa-user text-gray-400"></i> ${escapeHTML(aduan.pelapor)}</span>
            <span class="mx-2 text-gray-300">|</span>
            <span><i class="fa-solid fa-calendar text-gray-400"></i> ${escapeHTML(aduan.waktu)}</span>
        `;
    }

    const urgencyBadge = document.querySelector('.bg-red-100.text-red-700');
    if (urgencyBadge) {
        urgencyBadge.innerText = `Urgensi ${aduan.urgensi}`;
        if (aduan.urgensi === "Tinggi") {
            urgencyBadge.className = "bg-red-100 text-red-700 text-xs px-3 py-1 rounded-md font-semibold";
        } else {
            urgencyBadge.className = "bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-md font-semibold";
        }
    }

    const descBox = document.querySelector('.text-gray-700.text-sm.leading-relaxed');
    if (descBox) descBox.innerText = aduan.deskripsi;

    // Foto Bukti
    const imgElement = document.querySelector('img[alt="Foto Jalan Berlubang"]');
    if (imgElement) {
        imgElement.src = 'jalanrusak.jpg';
    }

    // Dropdown Action Form
    const inputStatus = document.getElementById('inputStatus');
    if (inputStatus) {
        inputStatus.value = aduan.status;
    }

    // Info Koordinat Kanan
    const lokasiDetailText = document.querySelector('.text-xs.space-y-2');
    if (lokasiDetailText) {
        lokasiDetailText.innerHTML = `
            <div class="flex justify-between"><span class="text-gray-400 font-medium">Jalan:</span> <span class="text-gray-800 font-semibold text-right">${escapeHTML(aduan.lokasi)}</span></div>
            <div class="flex justify-between"><span class="text-gray-400 font-medium">Wilayah:</span> <span class="text-gray-800 font-semibold text-right">${escapeHTML(aduan.wilayah)}</span></div>
            <div class="flex justify-between"><span class="text-gray-400 font-medium">Akurasi GPS:</span> <span class="text-green-600 font-bold text-right"><i class="fa-solid fa-circle-check"></i> Tinggi (~4 meter)</span></div>
        `;
    }

    // Timeline Logs
    const timelineContainer = document.querySelector('.relative.border-l-2');
    if (timelineContainer) {
        timelineContainer.innerHTML = '';
        aduan.logs.forEach(log => {
            const logItem = `
                <div class="relative mb-4">
                    <span class="absolute -left-[21px] top-0 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]"><i class="fa-solid fa-circle"></i></span>
                    <p class="font-bold text-gray-800">${escapeHTML(log.judul)}</p>
                    <p class="text-gray-500">${escapeHTML(log.waktu)} <span class="mx-1 text-gray-300">|</span> Oleh ${escapeHTML(log.aktor)}</p>
                </div>
            `;
            timelineContainer.insertAdjacentHTML('beforeend', logItem);
        });
    }

    // Inisialisasi Peta Detail Leaflet
    const mapDetailDiv = document.getElementById('mapDetail');
    if (mapDetailDiv && typeof L !== 'undefined') {
        if (mapDetailDiv._leaflet_id) {
            mapDetailDiv.outerHTML = `<div id="mapDetail" class="w-full h-60 rounded-xl border border-gray-200 overflow-hidden z-0"></div>`;
        }

        setTimeout(() => {
            var mapDetail = L.map('mapDetail').setView([aduan.lat, aduan.lng], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: 'Â© OpenStreetMap'
            }).addTo(mapDetail);

            var pinColor = aduan.status === 'baru' ? '#ef4444' : aduan.status === 'proses' ? '#f59e0b' : '#22c55e';
            var customIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: ${pinColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });

            L.marker([aduan.lat, aduan.lng], {icon: customIcon}).addTo(mapDetail)
             .bindPopup(`<div class="text-center"><p class="font-bold text-gray-800 text-sm">Lokasi Laporan #${aduan.id}</p><p class="text-xs text-gray-500">${aduan.lokasi}</p></div>`).openPopup();
        }, 100);
    }
}

function updateStatusAduan(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const aduanId = urlParams.get('id') || "0148";
    const statusSelect = document.getElementById('inputStatus').value;
    const dinasSelect = event.target.querySelector('select:nth-of-type(2)').value;
    const catatan = event.target.querySelector('textarea').value;

    const listAduan = getLaporan();
    const aduan = listAduan.find(x => x.id === aduanId);

    if (aduan) {
        aduan.status = statusSelect;
        
        let labelDinas = dinasSelect === 'pupr' ? 'Dinas PUPR' : dinasSelect === 'dishub' ? 'Dinas Perhubungan' : dinasSelect === 'dlh' ? 'Dinas Lingkungan Hidup' : 'Dinas Terkait';
        if (dinasSelect) aduan.dinas = labelDinas;

        let logTitle = 'Validasi Laporan';
        if (statusSelect === 'proses') {
            logTitle = `Pembaruan: Diproses & Disposisi ke ${labelDinas}`;
        } else if (statusSelect === 'selesai') {
            logTitle = 'Pembaruan: Perbaikan Selesai';
        }

        aduan.logs.unshift({
            judul: logTitle,
            waktu: "Hari ini, " + new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + " WIB",
            aktor: "Admin Utama"
        });

        saveLaporan(listAduan);
        initDetailPage(); // Re-render

        event.target.querySelector('textarea').value = '';
        alert(`Sukses! Perubahan status aduan #${aduanId} berhasil disimpan secara permanen di database lokal.`);
    }
}

if (document.getElementById('mapDetail')) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initDetailPage);
    } else {
        initDetailPage();
    }
    const actForm = document.getElementById('actionForm');
    if (actForm) {
        actForm.addEventListener('submit', updateStatusAduan);
    }
}

// =========================================
// 7. LOGIKA MANAJEMEN USER (manajemen-user.html)
// =========================================
function renderUsersTable() {
    const listUsers = getUsers();
    const tbody = document.getElementById('daftar-user');
    if (!tbody) return;

    tbody.innerHTML = '';
    listUsers.forEach(user => {
        let roleBadge = '';
        if (user.role === 'Administrator') {
            roleBadge = `<span class="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-purple-200">Administrator</span>`;
        } else if (user.role === 'Petugas PUPR') {
            roleBadge = `<span class="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-amber-200">Petugas PUPR</span>`;
        } else {
            roleBadge = `<span class="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-gray-200">Masyarakat</span>`;
        }

        let statusBadge = user.status === 'Aktif' ? 
            `<span class="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold"><span class="w-2 h-2 rounded-full bg-green-500"></span> Aktif</span>` :
            `<span class="inline-flex items-center gap-1.5 text-gray-500 text-xs font-semibold"><span class="w-2 h-2 rounded-full bg-gray-400"></span> Menunggu Verifikasi</span>`;

        const words = user.username.split(' ');
        const initials = (words[0] ? words[0][0] : 'U') + (words[1] ? words[1][0] : '');

        let verifyBtn = '';
        if (user.status === 'Menunggu Verifikasi') {
            verifyBtn = `<button onclick="verifikasiPengguna('${user.id}')" class="text-emerald-500 hover:text-emerald-700 transition" title="Verifikasi Akun"><i class="fa-solid fa-circle-check"></i></button>`;
        }

        const row = `
            <tr id="${user.id}" data-role="${escapeHTML(user.role)}" class="user-row hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">${initials}</div>
                        <div>
                            <p id="name-${user.id}" class="font-bold text-gray-900">${escapeHTML(user.username)}</p>
                            <span class="text-xs text-gray-500">Terdaftar: ${escapeHTML(user.registered)}</span>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <p id="email-${user.id}" class="text-gray-800 font-medium text-sm">${escapeHTML(user.email)}</p>
                    <span class="text-xs text-gray-400 font-mono">${escapeHTML(user.identitas)}</span>
                </td>
                <td class="px-6 py-4">${roleBadge}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        ${verifyBtn}
                        <button onclick="editPengguna('${user.id}')" class="text-blue-500 hover:text-blue-700 transition" title="Edit Pengguna"><i class="fa-solid fa-pen-to-square"></i></button>
                        ${user.id === 'user-admin' ? 
                            `<button class="text-gray-400 cursor-not-allowed" title="Admin Utama Tidak Bisa Dihapus" disabled><i class="fa-solid fa-trash"></i></button>` :
                            `<button onclick="hapusPengguna('${user.id}')" class="text-red-500 hover:text-red-700 transition" title="Hapus Pengguna"><i class="fa-solid fa-trash"></i></button>`
                        }
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function jalankanFilterUser() {
    const searchVal = document.getElementById('cari-input').value.toLowerCase();
    const roleVal = document.getElementById('filter-role-select').value;
    const rows = document.querySelectorAll('.user-row');

    rows.forEach(row => {
        const id = row.getAttribute('id');
        const roleBaris = row.getAttribute('data-role');
        const nama = document.getElementById('name-' + id).innerText.toLowerCase();
        const email = document.getElementById('email-' + id).innerText.toLowerCase();

        const matchSearch = nama.includes(searchVal) || email.includes(searchVal);
        const matchRole = (roleVal === 'semua') || (roleBaris === roleVal);

        if (matchSearch && matchRole) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function resetFilterUser() {
    document.getElementById('cari-input').value = "";
    document.getElementById('filter-role-select').value = "semua";
    jalankanFilterUser();
}

function simpanUserBaru(event) {
    event.preventDefault();
    const rawName = document.getElementById('input-nama').value.trim();
    const rawEmail = document.getElementById('input-email').value.trim();
    const rawIdentitas = document.getElementById('input-identitas').value.trim();
    const role = document.getElementById('input-role').value;

    const name = sanitizeInput(rawName);
    const email = sanitizeInput(rawEmail);
    const identitas = sanitizeInput(rawIdentitas);

    if (name.length < 3) {
        alert("Gagal Menyimpan! Nama Lengkap minimal harus terdiri dari 3 karakter.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Gagal Menyimpan! Format alamat email tidak valid.");
        return;
    }

    const dbUsers = getUsers();

    // Validasi duplikasi email
    if (dbUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("Gagal! Alamat email ini sudah terdaftar.");
        return;
    }

    // Tentukan sandi default berdasarkan peran
    let defaultPass = "warga123";
    if (role === 'Administrator') {
        defaultPass = "admin123";
    } else if (role === 'Petugas PUPR') {
        defaultPass = "petugas123";
    }

    const newUser = {
        id: 'user-' + Date.now(),
        username: name,
        email: email,
        identitas: identitas,
        role: role,
        status: "Aktif",
        registered: "Baru Saja",
        password: defaultPass
    };

    dbUsers.push(newUser);
    saveUsers(dbUsers);
    renderUsersTable();
    tutupModal();
    alert(`Sukses! Akun untuk "${name}" berhasil ditambahkan secara permanen dengan sandi default "${defaultPass}".`);
}

function editPengguna(rowId) {
    const dbUsers = getUsers();
    const target = dbUsers.find(x => x.id === rowId);
    if (!target) return;

    const newName = prompt("Ubah Nama Pengguna:", target.username);
    if (newName === null) return;
    
    const newEmail = prompt("Ubah Email Pengguna:", target.email);
    if (newEmail === null) return;

    const sanitizedName = sanitizeInput(newName);
    const sanitizedEmail = sanitizeInput(newEmail);

    if (sanitizedName !== "" && sanitizedEmail !== "") {
        target.username = sanitizedName;
        target.email = sanitizedEmail;
        saveUsers(dbUsers);
        renderUsersTable();
        alert("Sukses! Data pengguna berhasil diperbarui di database lokal.");
    } else {
        alert("Gagal! Nama dan Email tidak boleh kosong.");
    }
}

function verifikasiPengguna(rowId) {
    const dbUsers = getUsers();
    const target = dbUsers.find(x => x.id === rowId);
    if (!target) return;

    const konfirmasi = confirm(`Apakah Anda yakin ingin memverifikasi dan mengaktifkan akun milik "${target.username}"?`);
    if (konfirmasi) {
        target.status = 'Aktif';
        saveUsers(dbUsers);
        renderUsersTable();
        alert(`Sukses! Akun "${target.username}" telah aktif dan kini dapat digunakan untuk masuk ke portal.`);
    }
}

function hapusPengguna(rowId) {
    const dbUsers = getUsers();
    const target = dbUsers.find(x => x.id === rowId);
    if (!target) return;

    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus akun milik "${target.username}"?`);
    if (konfirmasi) {
        const filtered = dbUsers.filter(x => x.id !== rowId);
        saveUsers(filtered);
        
        const rowElement = document.getElementById(rowId);
        if (rowElement) {
            rowElement.style.transition = "all 0.4s ease";
            rowElement.style.opacity = "0";
            rowElement.style.backgroundColor = "#fee2e2"; 
            setTimeout(() => {
                renderUsersTable();
            }, 400);
        }
    }
}

if (document.getElementById('daftar-user')) {
    renderUsersTable();
    document.getElementById('cari-input').addEventListener('input', jalankanFilterUser);
    document.getElementById('filter-role-select').addEventListener('change', jalankanFilterUser);
}

// =========================================
// 8. LOGIKA PETA DAMPAK (peta.html)
// =========================================
function initPetaDampak() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof L === 'undefined') return;

    // Inisialisasi Peta
    var map = L.map('map', {
        zoomControl: false 
    }).setView([-7.983908, 112.621391], 13);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Tambahkan Layer Peta
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Â© OpenStreetMap contributors - Proyek SIGAP'
    }).addTo(map);

    // Konfigurasi Warna Pin Marker
    function createIcon(color) {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    var iconMerah = createIcon('#ef4444'); 
    var iconKuning = createIcon('#f59e0b'); 
    var iconHijau = createIcon('#22c55e'); 

    // Buat Wadah (Layer Group) Khusus untuk Pin
    var markerLayer = L.layerGroup().addTo(map);

    // Fungsi Utama Filter & Render Pin
    function renderPeta() {
        markerLayer.clearLayers(); // Bersihkan peta sebelum pasang pin baru

        const listAduan = getLaporan();
        
        var cbBaru = document.getElementById('filter-baru');
        var cbProses = document.getElementById('filter-proses');
        var cbSelesai = document.getElementById('filter-selesai');

        var showBaru = cbBaru ? cbBaru.checked : true;
        var showProses = cbProses ? cbProses.checked : true;
        var showSelesai = cbSelesai ? cbSelesai.checked : true;

        listAduan.forEach(function(laporan) {
            var isVisible = 
                (laporan.status === 'baru' && showBaru) ||
                (laporan.status === 'proses' && showProses) ||
                (laporan.status === 'selesai' && showSelesai);

            if (isVisible) {
                var pinIcon = laporan.status === 'baru' ? iconMerah : 
                              laporan.status === 'proses' ? iconKuning : iconHijau;
                              
                var marker = L.marker([laporan.lat, laporan.lng], {icon: pinIcon});
                
                var statusText = laporan.status === 'baru' ? '<span class="text-red-600 font-bold">Baru Masuk</span>' : 
                                 laporan.status === 'proses' ? '<span class="text-amber-500 font-bold">Sedang Diproses</span>' : 
                                 '<span class="text-green-600 font-bold">Selesai</span>';

                var idUrl = laporan.id.replace('#', '');
                var popupContent = `
                    <div class="font-sans text-sm">
                        <p class="font-mono text-xs text-gray-400 font-bold">#${laporan.id}</p>
                        <h4 class="font-bold text-gray-800 text-base mb-1">${laporan.kategoriLabel}</h4>
                        <p class="text-gray-600 text-xs mb-2">Dilaporkan oleh: ${laporan.pelapor}</p>
                        <p class="text-xs mb-2">Status: ${statusText}</p>
                        <a href="detail-laporan.html?id=${idUrl}" class="block w-full text-center bg-blue-600 text-white py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 mt-2">Lihat Detail</a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                markerLayer.addLayer(marker); 
            }
        });
    }

    // Jalankan pertama kali saat halaman dibuka
    renderPeta();

    // Pasang event listener pada checkbox jika ada
    var filterBaru = document.getElementById('filter-baru');
    var filterProses = document.getElementById('filter-proses');
    var filterSelesai = document.getElementById('filter-selesai');

    if (filterBaru) filterBaru.addEventListener('change', renderPeta);
    if (filterProses) filterProses.addEventListener('change', renderPeta);
    if (filterSelesai) filterSelesai.addEventListener('change', renderPeta);
}

// Inisialisasi peta dampak jika di halaman peta
if (document.getElementById('map')) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initPetaDampak);
    } else {
        initPetaDampak();
    }
}

// =========================================
// 9. LOGIKA KONTROL MODAL LUPA SANDI (login.html)
// =========================================
function bukaModalLupaSandi() {
    const modal = document.getElementById('modal-lupa-sandi');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

function tutupModalLupaSandi() {
    const modal = document.getElementById('modal-lupa-sandi');
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('form-lupa-sandi').reset();
    }, 300);
}

function handleResetSandi(event) {
    event.preventDefault();
    const emailTarget = document.getElementById('email-reset').value;
    const btn = document.getElementById('btnResetSandi');

    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    btn.disabled = true;

    setTimeout(() => {
        alert(`Sukses! Tautan pengaturan ulang kata sandi berhasil dikirim ke email: ${emailTarget}.\nSilakan periksa kotak masuk atau folder spam email Anda.`);
        tutupModalLupaSandi();
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Link';
        btn.classList.remove('opacity-80', 'cursor-not-allowed');
        btn.disabled = false;
    }, 200);
}

// =========================================
// 10. LOGIKA DASBOR PELAPOR (dashboard-pelapor.html)
// =========================================
function renderDasborPelapor() {
    const listAduan = getLaporan();
    const sessionStr = localStorage.getItem('sigap_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    const pelaporAktif = session ? session.username : "Budi Santoso";
    const aduanSaya = listAduan.filter(x => x.pelapor === pelaporAktif);

    const total = aduanSaya.length;
    const baru = aduanSaya.filter(x => x.status === 'baru').length;
    const proses = aduanSaya.filter(x => x.status === 'proses').length;
    const selesai = aduanSaya.filter(x => x.status === 'selesai').length;

    const elTotal = document.getElementById('stat-total');
    const elBaru = document.getElementById('stat-baru');
    const elProses = document.getElementById('stat-proses');
    const elSelesai = document.getElementById('stat-selesai');

    if (elTotal) elTotal.innerText = total;
    if (elBaru) elBaru.innerText = baru;
    if (elProses) elProses.innerText = proses;
    if (elSelesai) elSelesai.innerText = selesai;

    const countBadge = document.getElementById('aduan-saya-count');
    if (countBadge) {
        countBadge.innerText = `${total} ADUAN AKTIF`;
    }

    const container = document.getElementById('list-aduan-saya');
    if (container) {
        container.innerHTML = '';
        if (aduanSaya.length === 0) {
            container.innerHTML = `
                <div class="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                    <i class="fa-solid fa-folder-open text-slate-700 text-4xl mb-3 block animate-bounce"></i>
                    <p class="text-slate-400 text-sm font-semibold">Belum Ada Laporan</p>
                    <p class="text-xs text-slate-500 mt-1">Anda belum pernah mengirimkan laporan aduan infrastruktur.</p>
                </div>
            `;
            return;
        }

        aduanSaya.forEach(aduan => {
            let badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
            let dotClass = 'bg-red-500';
            let labelStatus = 'Baru Masuk';

            if (aduan.status === 'proses') {
                badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                dotClass = 'bg-amber-500 animate-pulse';
                labelStatus = 'Sedang Diproses';
            } else if (aduan.status === 'selesai') {
                badgeClass = 'bg-green-500/10 text-green-400 border-green-500/20';
                dotClass = 'bg-green-500';
                labelStatus = 'Selesai Diperbaiki';
            }

            // Atur icon kategori kerusakan secara spesifik & estetik
            let iconClass = 'fa-solid fa-road text-blue-400';
            let iconBg = 'bg-blue-500/10';
            let iconBorder = 'border-blue-500/30';

            if (aduan.kategori === 'penerangan') {
                iconClass = 'fa-solid fa-lightbulb text-amber-400';
                iconBg = 'bg-amber-500/10';
                iconBorder = 'border-amber-500/30';
            } else if (aduan.kategori === 'drainase') {
                iconClass = 'fa-solid fa-droplet text-cyan-400';
                iconBg = 'bg-cyan-500/10';
                iconBorder = 'border-cyan-500/30';
            } else if (aduan.kategori === 'fasilitas') {
                iconClass = 'fa-solid fa-tree text-emerald-400';
                iconBg = 'bg-emerald-500/10';
                iconBorder = 'border-emerald-500/30';
            }

            const card = `
                <div class="group bg-slate-900/20 hover:bg-slate-900/50 border-2 border-slate-700 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-sm backdrop-blur-md">
                    <div class="flex items-start gap-4">
                        <div class="p-3.5 rounded-xl ${iconBg} border-2 ${iconBorder} text-base flex items-center justify-center shrink-0">
                            <i class="${iconClass}"></i>
                        </div>
                        <div>
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="text-[10px] font-mono font-bold text-slate-500">#${escapeHTML(aduan.id)}</span>
                                <span class="bg-blue-500/10 text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-bold border-2 border-blue-500/20 uppercase tracking-wider">${escapeHTML(aduan.kategoriLabel)}</span>
                                <span class="text-slate-600 text-xs font-mono"><span class="mx-1 text-slate-500">|</span> ${escapeHTML(aduan.waktu)}</span>
                            </div>
                            <h4 class="font-bold text-white text-base mt-1.5 leading-snug">${escapeHTML(aduan.lokasi)}</h4>
                            <p class="text-slate-400 text-xs mt-1 max-w-xl leading-relaxed">${escapeHTML(aduan.deskripsi)}</p>
                        </div>
                    </div>
                    
                    <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t-2 sm:border-t-0 border-slate-900/50 pt-3 sm:pt-0 shrink-0">
                        <span class="inline-flex items-center gap-1.5 ${badgeClass} px-3 py-1 rounded-full text-[10px] font-bold border-2 uppercase tracking-wider">
                            <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}
                        </span>
                        <a href="detail-laporan-pelapor.html?id=${aduan.id}" class="bg-slate-950/60 hover:bg-blue-600 text-slate-300 hover:text-white border-2 border-slate-700 hover:border-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm">
                            Tinjau Log <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', card);
        });
    }
}

// =========================================
// 11. LOGIKA FORM ADUAN BARU (buat-laporan.html)
// =========================================
let selectorMapMarker = null;

function initMapSelector() {
    const mapSelectorDiv = document.getElementById('mapSelector');
    if (!mapSelectorDiv || typeof L === 'undefined') return;

    var mapSelector = L.map('mapSelector', { zoomControl: false }).setView([-7.983908, 112.621391], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(mapSelector);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Â© OpenStreetMap contributors'
    }).addTo(mapSelector);

    var pinColor = '#ef4444';
    var selectorIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${pinColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    mapSelector.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        document.getElementById('input-lat').value = lat;
        document.getElementById('input-lng').value = lng;

        if (selectorMapMarker) {
            selectorMapMarker.setLatLng(e.latlng);
        } else {
            selectorMapMarker = L.marker(e.latlng, {icon: selectorIcon}).addTo(mapSelector)
                                .bindPopup(`<div class="text-center text-xs font-bold text-gray-800"><p>Titik Kerusakan Terpilih</p></div>`).openPopup();
        }
    });
}

function kirimAduanBaru(event) {
    event.preventDefault();
    const kategori = document.getElementById('input-kategori').value;
    const urgensi = document.getElementById('input-urgensi').value;
    const lokasi = document.getElementById('input-lokasi').value.trim();
    const deskripsi = document.getElementById('input-deskripsi').value.trim();
    const lat = document.getElementById('input-lat').value;
    const lng = document.getElementById('input-lng').value;

    if (!lat || !lng) {
        alert("Gagal mengirim! Anda wajib memilih titik lokasi kerusakan terlebih dahulu dengan mengklik peta di sisi kanan.");
        return;
    }

    let kategoriLabel = "Jalan Berlubang";
    if (kategori === "penerangan") kategoriLabel = "Penerangan Jalan";
    else if (kategori === "drainase") kategoriLabel = "Drainase rusak";
    else if (kategori === "fasilitas") kategoriLabel = "Fasilitas Sosial / Taman";

    const listAduan = getLaporan();
    const nextIdNum = Math.max(...listAduan.map(x => parseInt(x.id))) + 1;
    const nextId = "0" + nextIdNum;

    const newAduan = {
        id: nextId,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        kategori: kategori,
        kategoriLabel: kategoriLabel,
        deskripsi: deskripsi,
        status: "baru",
        pelapor: "Budi Santoso",
        waktu: "Hari ini, " + new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) + " WIB",
        lokasi: lokasi,
        wilayah: "Kota Malang",
        urgensi: urgensi,
        dinas: "Dinas Terkait (Menunggu Verifikasi)",
        foto: "assets/images/jalanrusak.jpg",
        logs: [
            { judul: "Laporan Terkirim & Menunggu Verifikasi", waktu: "Baru Saja", aktor: "Budi Santoso" }
        ]
    };

    listAduan.unshift(newAduan);
    saveLaporan(listAduan);

    alert(`Sukses! Aduan Anda dengan ID #${nextId} berhasil dikirimkan ke pusat data SIGAP.`);
    window.location.replace('dashboard-pelapor.html');
}

// =========================================
// 12. LOGIKA PETA DAMPAK WARGA (peta-pelapor.html)
// =========================================
function initPetaDampakPelapor() {
    const mapContainer = document.getElementById('mapPelapor');
    if (!mapContainer || typeof L === 'undefined') return;

    var map = L.map('mapPelapor', { zoomControl: false }).setView([-7.983908, 112.621391], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Â© OpenStreetMap contributors - Proyek SIGAP'
    }).addTo(map);

    function createIcon(color) {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    }

    var iconMerah = createIcon('#ef4444');
    var iconKuning = createIcon('#f59e0b');
    var iconHijau = createIcon('#22c55e');

    var markerLayer = L.layerGroup().addTo(map);

    function renderPeta() {
        markerLayer.clearLayers();
        const listLaporan = getLaporan();

        var cbBaru = document.getElementById('filter-baru');
        var cbProses = document.getElementById('filter-proses');
        var cbSelesai = document.getElementById('filter-selesai');

        var showBaru = cbBaru ? cbBaru.checked : true;
        var showProses = cbProses ? cbProses.checked : true;
        var showSelesai = cbSelesai ? cbSelesai.checked : true;

        listLaporan.forEach(function(laporan) {
            var isVisible = 
                (laporan.status === 'baru' && showBaru) ||
                (laporan.status === 'proses' && showProses) ||
                (laporan.status === 'selesai' && showSelesai);

            if (isVisible) {
                var pinIcon = laporan.status === 'baru' ? iconMerah : 
                              laporan.status === 'proses' ? iconKuning : iconHijau;
                var marker = L.marker([laporan.lat, laporan.lng], {icon: pinIcon});
                var statusText = laporan.status === 'baru' ? '<span class="text-red-400 font-bold">Baru Masuk</span>' : 
                                 laporan.status === 'proses' ? '<span class="text-amber-400 font-bold">Sedang Diproses</span>' : 
                                 '<span class="text-green-400 font-bold">Selesai</span>';

                var popupContent = `
                    <div class="font-sans text-sm p-1 text-slate-200">
                        <p class="font-mono text-xs text-slate-500 font-bold">#${laporan.id}</p>
                        <h4 class="font-bold text-white text-base mb-1">${laporan.kategoriLabel}</h4>
                        <p class="text-slate-400 text-xs mb-1">Status: ${statusText}</p>
                        <a href="detail-laporan-pelapor.html?id=${laporan.id}" class="block w-full text-center bg-blue-600 text-white py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 mt-2">Lihat Detail</a>
                    </div>
                `;
                marker.bindPopup(popupContent);
                markerLayer.addLayer(marker);
            }
        });
    }

    renderPeta();

    var filterBaru = document.getElementById('filter-baru');
    var filterProses = document.getElementById('filter-proses');
    var filterSelesai = document.getElementById('filter-selesai');

    if (filterBaru) filterBaru.addEventListener('change', renderPeta);
    if (filterProses) filterProses.addEventListener('change', renderPeta);
    if (filterSelesai) filterSelesai.addEventListener('change', renderPeta);
}

if (document.getElementById('mapPelapor')) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initPetaDampakPelapor);
    } else {
        initPetaDampakPelapor();
    }
}

// =========================================
// 13. LOGIKA DETAIL LAPORAN WARGA (detail-laporan-pelapor.html)
// =========================================
function initDetailPagePelapor() {
    const urlParams = new URLSearchParams(window.location.search);
    const aduanId = urlParams.get('id');
    if (!aduanId) {
        alert("Parameter ID aduan tidak valid.");
        window.location.replace('dashboard-pelapor.html');
        return;
    }

    const listAduan = getLaporan();
    const aduan = listAduan.find(x => x.id === aduanId);
    if (!aduan) {
        alert("Laporan aduan tidak ditemukan di database lokal.");
        window.location.replace('dashboard-pelapor.html');
        return;
    }

    const elId = document.getElementById('aduan-id');
    const elKategori = document.getElementById('aduan-kategori');
    const elPelapor = document.getElementById('aduan-pelapor');
    const elWaktu = document.getElementById('aduan-waktu');
    const elUrgensi = document.getElementById('aduan-urgensi');
    const elDeskripsi = document.getElementById('aduan-deskripsi');
    const elFoto = document.getElementById('aduan-foto');
    const elLokasi = document.getElementById('aduan-lokasi');
    const elWilayah = document.getElementById('aduan-wilayah');
    const elStatusBadge = document.getElementById('status-badge');

    if (elId) elId.innerText = "#" + aduan.id;
    if (elKategori) elKategori.innerText = aduan.kategoriLabel;
    if (elPelapor) elPelapor.innerText = aduan.pelapor;
    if (elWaktu) elWaktu.innerText = aduan.waktu;
    if (elDeskripsi) elDeskripsi.innerText = aduan.deskripsi;
    if (elLokasi) elLokasi.innerText = aduan.lokasi;
    if (elWilayah) elWilayah.innerText = aduan.wilayah;

    if (elUrgensi) {
        elUrgensi.innerText = "Urgensi " + aduan.urgensi;
        if (aduan.urgensi === 'Tinggi') {
            elUrgensi.className = "bg-red-500/10 text-red-400 text-xs px-3 py-1 rounded-md font-semibold border border-red-500/10";
        } else if (aduan.urgensi === 'Sedang') {
            elUrgensi.className = "bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-md font-semibold border border-amber-500/10";
        } else {
            elUrgensi.className = "bg-green-500/10 text-green-400 text-xs px-3 py-1 rounded-md font-semibold border border-green-500/10";
        }
    }

    if (elFoto) {
        elFoto.src = aduan.foto || 'jalanrusak.jpg';
        elFoto.onerror = function() {
            this.src = 'jalanrusak.jpg';
        };
    }

    if (elStatusBadge) {
        let badgeClass = 'bg-red-500/10 text-red-400 border-red-500/20';
        let dotClass = 'bg-red-500';
        let labelStatus = 'BARU MASUK';

        if (aduan.status === 'proses') {
            badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            dotClass = 'bg-amber-500 animate-pulse';
            labelStatus = 'SEDANG DIPROSES';
        } else if (aduan.status === 'selesai') {
            badgeClass = 'bg-green-500/10 text-green-400 border-green-500/20';
            dotClass = 'bg-green-500';
            labelStatus = 'SELESAI DIPERBAIKI';
        }

        elStatusBadge.className = `inline-flex items-center gap-1.5 ${badgeClass} px-3 py-1 rounded-full text-xs font-bold border`;
        elStatusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}`;
    }

    if (document.getElementById('mapDetailPelapor') && typeof L !== 'undefined') {
        var mapDetail = L.map('mapDetailPelapor', { zoomControl: false, attributionControl: false }).setView([aduan.lat, aduan.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapDetail);

        var markerColor = aduan.status === 'baru' ? '#ef4444' : aduan.status === 'proses' ? '#f59e0b' : '#22c55e';
        var markerIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        L.marker([aduan.lat, aduan.lng], { icon: markerIcon }).addTo(mapDetail);
    }

    const timeline = document.getElementById('timeline-pelapor');
    if (timeline) {
        timeline.innerHTML = '';
        if (aduan.logs && aduan.logs.length > 0) {
            aduan.logs.forEach((log, index) => {
                const dotBg = index === 0 ? 'bg-blue-500' : 'bg-slate-700';
                const logHtml = `
                    <div class="relative">
                        <span class="absolute -left-[21px] top-0 ${dotBg} text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px]"><i class="fa-solid fa-circle"></i></span>
                        <p class="font-bold text-slate-200">${escapeHTML(log.judul)}</p>
                        <p class="text-slate-500">${escapeHTML(log.waktu)} <span class="mx-1 text-slate-600">|</span> Oleh ${escapeHTML(log.aktor)}</p>
                    </div>
                `;
                timeline.insertAdjacentHTML('beforeend', logHtml);
            });
        }
    }
}

if (document.getElementById('mapDetailPelapor')) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initDetailPagePelapor);
    } else {
        initDetailPagePelapor();
    }
}

// =========================================
// 14. LOGIKA PENGATURAN PROFIL WARGA (pengaturan-profil-pelapor.html)
// =========================================
function initProfilePelapor() {
    const sessionStr = localStorage.getItem('sigap_session');
    if (!sessionStr) return;
    const session = JSON.parse(sessionStr);

    const users = getUsers();
    const user = users.find(x => x.email === session.email || x.id === 'user-bs') || {
        username: session.username,
        email: session.email,
        identitas: "NIK: 3573012345670001",
        telepon: "081234567890",
        alamat: "Jl. Ijen No. 12, Klojen, Kota Malang"
    };

    const elName = document.getElementById('profile-name');
    const elEmail = document.getElementById('profile-email');
    const elPhone = document.getElementById('profile-phone');
    const elAddress = document.getElementById('profile-address');

    if (elName) elName.value = user.username;
    if (elEmail) elEmail.value = user.email;
    if (elPhone) elPhone.value = user.telepon || '081234567890';
    if (elAddress) elAddress.value = user.alamat || 'Jl. Ijen No. 12, Klojen, Kota Malang';
}

function simpanProfilUmumPelapor(event) {
    event.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();

    const sessionStr = localStorage.getItem('sigap_session');
    if (!sessionStr) return;
    const session = JSON.parse(sessionStr);

    const users = getUsers();
    const userIndex = users.findIndex(x => x.email === session.email || x.id === 'user-bs');
    
    if (userIndex !== -1) {
        users[userIndex].username = name;
        users[userIndex].email = email;
        users[userIndex].telepon = phone;
        users[userIndex].alamat = address;
        saveUsers(users);
    }

    session.username = name;
    session.email = email;
    localStorage.setItem('sigap_session', JSON.stringify(session));

    const btn = document.getElementById('btn-simpan-umum');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    setTimeout(() => {
        alert("Sukses! Informasi profil umum Anda berhasil diperbarui.");
        btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
        btn.disabled = false;
        
        const avatarInitials = document.getElementById('avatar-initials');
        if (avatarInitials) {
            const initials = name.split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();
            avatarInitials.innerText = initials;
        }
    }, 200);
}

function simpanProfilSandiPelapor(event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
        alert("Gagal! Konfirmasi kata sandi baru tidak cocok.");
        return;
    }

    if (newPassword.length < 8) {
        alert("Gagal! Kata sandi baru minimal harus berjumlah 8 karakter.");
        return;
    }

    const sessionStr = localStorage.getItem('sigap_session');
    if (!sessionStr) {
        alert("Gagal! Sesi aktif tidak ditemukan.");
        return;
    }
    const session = JSON.parse(sessionStr);

    const users = getUsers();
    const userIndex = users.findIndex(x => x.email.toLowerCase() === session.email.toLowerCase());

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsers(users);
    } else {
        alert("Gagal! Akun Anda tidak ditemukan di database lokal.");
        return;
    }

    const btn = document.getElementById('btn-simpan-sandi');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memperbarui...';
    btn.disabled = true;

    setTimeout(() => {
        alert("Sukses! Keamanan akun diperbarui secara aman.");
        event.target.reset(); 
        btn.innerHTML = '<i class="fa-solid fa-key"></i> Perbarui Kata Sandi';
        btn.disabled = false;
    }, 200);
}

// =========================================
// 15. DYNAMIC NAVBAR USER PROFILE (index.html)
// =========================================
function updateNavbarSession() {
    const desktopContainer = document.getElementById('nav-portal-container-desktop');
    const mobileContainer = document.getElementById('nav-portal-container-mobile');
    
    // Only proceed if at least one container is found
    if (!desktopContainer && !mobileContainer) return;
    
    const sessionStr = localStorage.getItem('sigap_session');
    if (!sessionStr) return; // Keep default "Masuk Portal" button
    
    try {
        const session = JSON.parse(sessionStr);
        if (!session || !session.username || !session.role) return;
        
        // Calculate initials
        const nameParts = session.username.trim().split(/\s+/);
        const initials = nameParts.map(x => x[0]).join('').substring(0, 2).toUpperCase();
        
        // Setup URLs and labels based on role
        let dashboardUrl = 'dashboard-pelapor.html';
        let profileUrl = 'pengaturan-profil-pelapor.html';
        let roleLabel = 'Masyarakat / Pelapor';
        
        if (session.role === 'admin') {
            dashboardUrl = 'sigap.html';
            profileUrl = 'pengaturan-profil.html';
            roleLabel = 'Administrator';
        }
        
        // Render desktop profile dropdown
        if (desktopContainer) {
            desktopContainer.innerHTML = `
                <div class="relative inline-block text-left" id="user-profile-menu">
                    <button type="button" onclick="toggleProfileDropdown(event)" class="flex items-center gap-3 bg-white hover:bg-slate-50 border border-[#E6DFD5] rounded-xl px-3 py-1.5 transition duration-200 focus:outline-none">
                        <div class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner tracking-wider">
                            ${initials}
                        </div>
                        <div class="text-left hidden lg:block">
                            <p class="text-[11px] font-bold text-[#1E1B18] leading-tight max-w-[120px] truncate">${escapeHTML(session.username)}</p>
                            <p class="text-[9px] text-[#6B645C] font-semibold leading-tight">${roleLabel}</p>
                        </div>
                        <i class="fa-solid fa-chevron-down text-[10px] text-[#6B645C] ml-1"></i>
                    </button>
                    
                    <div id="profile-dropdown-menu" class="hidden absolute right-0 mt-2 w-56 origin-top-right divide-y divide-[#E6DFD5] rounded-2xl bg-white border border-[#E6DFD5] shadow-lg ring-1 ring-black/5 focus:outline-none z-50 transform scale-95 opacity-0 transition-all duration-200">
                        <div class="px-4 py-3">
                            <p class="text-[10px] text-[#6B645C] font-semibold">Masuk sebagai</p>
                            <p class="text-xs font-bold text-[#1E1B18] truncate mt-0.5">${escapeHTML(session.username)}</p>
                            <span class="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mt-1.5">${roleLabel}</span>
                        </div>
                        <div class="py-1">
                            <a href="${dashboardUrl}" class="group flex items-center px-4 py-2 text-xs text-[#1E1B18] hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <i class="fa-solid fa-gauge text-slate-400 group-hover:text-blue-600 mr-2.5 text-xs w-4"></i>
                                Dasbor Anda
                            </a>
                            <a href="${profileUrl}" class="group flex items-center px-4 py-2 text-xs text-[#1E1B18] hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <i class="fa-solid fa-user-gear text-slate-400 group-hover:text-blue-600 mr-2.5 text-xs w-4"></i>
                                Pengaturan Profil
                            </a>
                        </div>
                        <div class="py-1">
                            <a href="#" onclick="handleLogout(event)" class="group flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
                                <i class="fa-solid fa-right-from-bracket text-red-400 group-hover:text-red-600 mr-2.5 text-xs w-4"></i>
                                Keluar Sesi
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Render mobile profile options
        if (mobileContainer) {
            mobileContainer.innerHTML = `
                <div class="pt-3 border-t border-[#E6DFD5] mt-3 space-y-2">
                    <div class="flex items-center gap-3 px-1 py-2">
                        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-inner tracking-wider">
                            ${initials}
                        </div>
                        <div class="text-left">
                            <p class="text-xs font-bold text-[#1E1B18]">${escapeHTML(session.username)}</p>
                            <p class="text-[10px] text-[#6B645C] font-semibold">${roleLabel}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <a href="${dashboardUrl}" onclick="toggleMobileMenu()" class="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-[#E6DFD5] text-xs font-bold text-[#1E1B18] py-2.5 rounded-xl transition text-center">
                            <i class="fa-solid fa-gauge text-blue-600"></i> Dasbor
                        </a>
                        <a href="${profileUrl}" onclick="toggleMobileMenu()" class="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-[#E6DFD5] text-xs font-bold text-[#1E1B18] py-2.5 rounded-xl transition text-center">
                            <i class="fa-solid fa-user-gear text-blue-600"></i> Profil
                        </a>
                    </div>
                    <button onclick="handleLogout(event)" class="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl transition text-center border border-red-200">
                        <i class="fa-solid fa-right-from-bracket"></i> Keluar Sesi
                    </button>
                </div>
            `;
        }
    } catch (e) {
        console.error("Error parsing user session in navbar:", e);
    }
}

function toggleProfileDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('profile-dropdown-menu');
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
        dropdown.classList.remove('hidden');
        // Let it render first before applying transition classes
        setTimeout(() => {
            dropdown.classList.remove('scale-95', 'opacity-0');
            dropdown.classList.add('scale-100', 'opacity-100');
        }, 10);
    } else {
        dropdown.classList.remove('scale-100', 'opacity-100');
        dropdown.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 200);
    }
}

// Close dropdown if clicked outside
window.addEventListener('click', function(event) {
    const menu = document.getElementById('user-profile-menu');
    const dropdown = document.getElementById('profile-dropdown-menu');
    if (menu && dropdown && !menu.contains(event.target)) {
        dropdown.classList.remove('scale-100', 'opacity-100');
        dropdown.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            dropdown.classList.add('hidden');
        }, 200);
    }
});

// Auto-run updateNavbarSession on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        updateNavbarSession();
        initMobileSidebar();
    });
} else {
    updateNavbarSession();
    initMobileSidebar();
}

// =========================================
// 16. MOBILE SIDEBAR NAVIGATION
// =========================================
function initMobileSidebar() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (!btn || !sidebar) return;
    
    // Create overlay dynamically if it doesn't exist
    let overlay = document.getElementById('sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 hidden md:hidden transition-opacity duration-300 opacity-0';
        document.body.appendChild(overlay);
    }
    
    function toggleSidebar() {
        const isOpen = sidebar.classList.contains('translate-x-0');
        const icon = btn.querySelector('i');
        
        if (isOpen) {
            // Close
            sidebar.classList.remove('translate-x-0');
            sidebar.classList.add('-translate-x-full');
            
            // Hide Overlay
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
            
            // Toggle Icon
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        } else {
            // Open
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            
            // Show Overlay
            overlay.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.remove('opacity-0');
                overlay.classList.add('opacity-100');
            }, 10);
            
            // Toggle Icon
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        }
    }
    
    btn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
}
