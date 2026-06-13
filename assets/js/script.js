/* =========================================================================
   SIGAP - SISTEM INFORMASI GERAK ADUAN PUBLIK
   Core JavaScript Engine (localStorage Database & Dynamic Page Sync)
   ========================================================================= */

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
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    const isAdminPage = adminPages.includes(pageName);
    const isPelaporPage = pelaporPages.includes(pageName);
    
    if (isAdminPage) {
        if (!session) {
            alert("Akses ditolak! Sesi tidak ditemukan. Silakan masuk sebagai Admin.");
            window.location.href = 'login.html';
        } else if (session.role !== 'admin') {
            alert("Akses Ditolak! Halaman ini khusus untuk Administrator.");
            window.location.href = 'dashboard-pelapor.html';
        }
    } else if (isPelaporPage) {
        if (!session) {
            alert("Akses ditolak! Sesi tidak ditemukan. Silakan masuk sebagai Pelapor.");
            window.location.href = 'login-masyarakat.html';
        } else if (session.role !== 'pelapor') {
            alert("Akses Ditolak! Halaman ini khusus untuk Pelapor.");
            window.location.href = 'sigap.html';
        }
    }
})();

function handleLogout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('sigap_session');
    alert("Anda telah berhasil keluar dari sistem SIGAP.");
    window.location.href = 'index.html';
}

// Auto-bind logout buttons on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLogoutTriggers);
} else {
    bindLogoutTriggers();
}

function bindLogoutTriggers() {
    document.querySelectorAll('a[href="login.html"], a[href="login-masyarakat.html"]').forEach(btn => {
        if (btn.querySelector('.fa-right-from-bracket') || btn.title === 'Keluar' || btn.classList.contains('text-red-400') || btn.parentElement.classList.contains('border-t') || btn.innerHTML.includes('Keluar')) {
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
        status: "Menunggu Verifikasi",
        registered: "Hari ini",
        password: "warga123"
    }
];

// 2. INITIALIZATION ENGINE
function getLaporan() {
    if (!localStorage.getItem('sigap_laporan')) {
        localStorage.setItem('sigap_laporan', JSON.stringify(defaultLaporan));
    }
    return JSON.parse(localStorage.getItem('sigap_laporan'));
}

function saveLaporan(data) {
    localStorage.setItem('sigap_laporan', JSON.stringify(data));
}

function getUsers() {
    if (!localStorage.getItem('sigap_users')) {
        localStorage.setItem('sigap_users', JSON.stringify(defaultUsers));
    }
    let users = JSON.parse(localStorage.getItem('sigap_users'));
    
    // Pastikan semua defaultUsers tersinkronisasi dan aktif di local storage
    let updated = false;
    defaultUsers.forEach(defUser => {
        const index = users.findIndex(u => u.email.toLowerCase() === defUser.email.toLowerCase());
        if (index === -1) {
            users.push(defUser);
            updated = true;
        } else {
            // Jika user default ada tapi password, role, atau statusnya tidak sinkron, perbarui
            if (users[index].password !== defUser.password || 
                users[index].role !== defUser.role || 
                users[index].status !== defUser.status) {
                users[index].password = defUser.password;
                users[index].role = defUser.role;
                users[index].status = defUser.status;
                updated = true;
            }
        }
    });
    
    // Migrasi: Pastikan semua pengguna default/lama di localStorage memiliki sandi
    users.forEach(user => {
        if (!user.password) {
            const matchedDefault = defaultUsers.find(d => d.email === user.email);
            if (matchedDefault) {
                user.password = matchedDefault.password;
                updated = true;
            } else {
                user.password = "warga123"; // Sandi cadangan default
                updated = true;
            }
        }
    });
    
    if (updated) {
        localStorage.setItem('sigap_users', JSON.stringify(users));
    }
    return users;
}

function saveUsers(data) {
    localStorage.setItem('sigap_users', JSON.stringify(data));
}

// Jalankan inisialisasi awal saat script dimuat
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
    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value;
    const btn = event.target.querySelector('button[type="submit"]');

    // Cari user di database lokal
    const users = getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passwordInput);

    if (!matchedUser) {
        alert("Gagal Masuk! Alamat email atau kata sandi yang Anda masukkan salah.");
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
        window.location.href = 'sigap.html';
    }, 1200);
}

function handleLoginMasyarakat(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]').value.trim();
    const passwordInput = document.getElementById('password').value;
    const btn = document.getElementById('btnLogin');

    // Cari user di database lokal
    const users = getUsers();
    const matchedUser = users.find(u => u.email.toLowerCase() === emailInput.toLowerCase() && u.password === passwordInput);

    if (!matchedUser) {
        alert("Gagal Masuk! Alamat email atau kata sandi yang Anda masukkan salah.");
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
        alert("Login Sukses!\nSelamat datang di platform SIGAP. Anda sekarang dapat mengakses Dasbor Warga.");
        window.location.href = 'dashboard-pelapor.html';
    }, 1200);
}

function handleRegister(event) {
    event.preventDefault();
    const nama = event.target.querySelectorAll('input')[0].value;
    const nik = event.target.querySelectorAll('input')[1].value;
    const email = event.target.querySelectorAll('input')[2].value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

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

    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mendaftarkan...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');
    btn.disabled = true;

    const newUser = {
        id: 'user-' + Date.now(),
        username: nama,
        email: email,
        identitas: 'NIK: ' + nik,
        role: "Masyarakat",
        status: "Menunggu Verifikasi",
        registered: "Baru Saja",
        password: password
    };
    dbUsers.push(newUser);
    saveUsers(dbUsers);

    setTimeout(() => {
        alert("Pendaftaran Berhasil!\nAkun Anda telah terdaftar dan menunggu verifikasi admin. Silakan masuk.");
        window.location.href = 'login-masyarakat.html';
    }, 1500);
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
                    <td class="px-6 py-4">
                        <p class="font-medium text-gray-800">${aduan.pelapor}</p>
                        <span class="text-xs text-gray-400">${aduan.waktu}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">${aduan.kategoriLabel}</span>
                    </td>
                    <td class="px-6 py-4">
                        <p class="text-gray-700 max-w-xs truncate">${aduan.lokasi}</p>
                        <a href="peta.html" class="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                            <i class="fa-solid fa-location-dot"></i> Lihat di Peta
                        </a>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center gap-1.5 ${badgeClass} px-2 py-1 rounded-md text-xs font-semibold">
                            <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
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
            <tr data-kategori="${aduan.kategori}" data-status="${aduan.status}" class="laporan-row hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-mono font-bold text-gray-400">#${aduan.id}</td>
                <td class="px-6 py-4">
                    <p class="font-semibold text-gray-900 target-pencarian">${aduan.pelapor}</p>
                    <span class="text-xs text-gray-400">${aduan.waktu}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mb-1">${aduan.kategoriLabel}</span>
                    <p class="text-gray-600 text-xs max-w-xs truncate">${aduan.deskripsi}</p>
                </td>
                <td class="px-6 py-4 text-gray-600">
                    <p class="font-medium target-pencarian">${aduan.lokasi}</p>
                    <span class="text-xs text-gray-400">${aduan.wilayah}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1 ${badgeClass} px-2 py-1 rounded-md text-xs font-semibold">
                        <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span> ${labelStatus}
                    </span>
                </td>
                <td class="px-6 py-4 text-center">
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
            <span><i class="fa-solid fa-user text-gray-400"></i> ${aduan.pelapor}</span>
            <span>•</span>
            <span><i class="fa-solid fa-calendar text-gray-400"></i> ${aduan.waktu}</span>
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
            <div class="flex justify-between"><span class="text-gray-400 font-medium">Jalan:</span> <span class="text-gray-800 font-semibold text-right">${aduan.lokasi}</span></div>
            <div class="flex justify-between"><span class="text-gray-400 font-medium">Wilayah:</span> <span class="text-gray-800 font-semibold text-right">${aduan.wilayah}</span></div>
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
                    <p class="font-bold text-gray-800">${log.judul}</p>
                    <p class="text-gray-500">${log.waktu} • Oleh ${log.aktor}</p>
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
                attribution: '© OpenStreetMap'
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

        const row = `
            <tr id="${user.id}" data-role="${user.role}" class="user-row hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">${initials}</div>
                        <div>
                            <p id="name-${user.id}" class="font-bold text-gray-900">${user.username}</p>
                            <span class="text-xs text-gray-500">Terdaftar: ${user.registered}</span>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <p id="email-${user.id}" class="text-gray-800 font-medium text-sm">${user.email}</p>
                    <span class="text-xs text-gray-400 font-mono">${user.identitas}</span>
                </td>
                <td class="px-6 py-4">${roleBadge}</td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
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
    const name = document.getElementById('input-nama').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const identitas = document.getElementById('input-identitas').value.trim();
    const role = document.getElementById('input-role').value;

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

    if (newName.trim() !== "" && newEmail.trim() !== "") {
        target.username = newName.trim();
        target.email = newEmail.trim();
        saveUsers(dbUsers);
        renderUsersTable();
        alert("Sukses! Data pengguna berhasil diperbarui di database lokal.");
    } else {
        alert("Gagal! Nama dan Email tidak boleh kosong.");
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
        attribution: '© OpenStreetMap contributors - Proyek SIGAP'
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
    }, 1200);
}

// =========================================
// 10. LOGIKA DASBOR PELAPOR (dashboard-pelapor.html)
// =========================================
function renderDasborPelapor() {
    const listAduan = getLaporan();
    const pelaporAktif = "Budi Santoso";
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
                                <span class="text-[10px] font-mono font-bold text-slate-500">#${aduan.id}</span>
                                <span class="bg-blue-500/10 text-blue-400 text-[9px] px-2 py-0.5 rounded-full font-bold border-2 border-blue-500/20 uppercase tracking-wider">${aduan.kategoriLabel}</span>
                                <span class="text-slate-600 text-xs font-mono">• ${aduan.waktu}</span>
                            </div>
                            <h4 class="font-bold text-white text-base mt-1.5 leading-snug">${aduan.lokasi}</h4>
                            <p class="text-slate-400 text-xs mt-1 max-w-xl leading-relaxed">${aduan.deskripsi}</p>
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
        attribution: '© OpenStreetMap contributors'
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
    window.location.href = 'dashboard-pelapor.html';
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
        attribution: '© OpenStreetMap contributors - Proyek SIGAP'
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
        window.location.href = 'dashboard-pelapor.html';
        return;
    }

    const listAduan = getLaporan();
    const aduan = listAduan.find(x => x.id === aduanId);
    if (!aduan) {
        alert("Laporan aduan tidak ditemukan di database lokal.");
        window.location.href = 'dashboard-pelapor.html';
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
                        <p class="font-bold text-slate-200">${log.judul}</p>
                        <p class="text-slate-500">${log.waktu} • Oleh ${log.aktor}</p>
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
    }, 1200);
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
    }, 1200);
}