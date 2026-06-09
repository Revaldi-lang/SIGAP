/* =========================================
   1. FUNGSI HALAMAN LOGIN
========================================= */
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
}

function handleLogin(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memverifikasi...';
    btn.classList.add('opacity-80', 'cursor-not-allowed');

    setTimeout(() => {
        window.location.href = 'SIGAP.html';
    }, 1500);
}

/* =========================================
   2. FUNGSI HALAMAN DAFTAR LAPORAN
========================================= */
function resetFilters() {
    document.getElementById('searchAduan').value = '';
    document.getElementById('filterKategori').value = 'semua';
    document.getElementById('filterStatus').value = 'semua';
    alert('Semua filter pencarian dibersihkan.');
}

/* =========================================
   3. FUNGSI HALAMAN DETAIL & VALIDASI
========================================= */
function updateStatusAduan(event) {
    event.preventDefault();
    const statusSelect = document.getElementById('inputStatus').value;
    const badge = document.getElementById('status-badge');
    
    if(statusSelect === "proses") {
        badge.className = "inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-200";
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-500 animate-spin"></span> SEDANG DIPROSES';
        alert('Sukses! Status aduan berhasil diperbarui ke "Sedang Diproses".');
    } else if(statusSelect === "selesai") {
        badge.className = "inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-200";
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-green-500"></span> SELESAI DIPERBAIKI';
        alert('Sukses! Status laporan ditutup dengan hasil "Selesai Diperbaiki".');
    }
}

// Inisialisasi Peta Detail
const mapDetailContainer = document.getElementById('mapDetail');
if (mapDetailContainer) {
    var mapDetail = L.map('mapDetail').setView([-7.96662, 112.63263], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(mapDetail);

    var redIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([-7.96662, 112.63263], {icon: redIcon}).addTo(mapDetail)
     .bindPopup(`<div class="text-center"><p class="font-bold text-gray-800 text-sm">Lokasi Laporan #0148</p></div>`).openPopup();
}

/* =========================================
   4. FUNGSI HALAMAN PETA DAMPAK BESAR
========================================= */
const mapContainer = document.getElementById('map');
if (mapContainer && mapContainer.id === 'map') {
    var map = L.map('map', { zoomControl: false }).setView([-7.983908, 112.621391], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
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

    var laporanMasuk = [
        { id: "#0148", lat: -7.97662, lng: 112.63263, kategori: "Jalan Berlubang", status: "baru", pelapor: "Budi Santoso", warna: iconMerah },
        { id: "#0147", lat: -7.96210, lng: 112.62510, kategori: "Penerangan Jalan", status: "proses", pelapor: "Siti Rahma", warna: iconKuning },
        { id: "#0146", lat: -7.99320, lng: 112.61890, kategori: "Drainase Rusak", status: "selesai", pelapor: "Ahmad Dhani", warna: iconHijau },
        { id: "#0149", lat: -7.98100, lng: 112.63500, kategori: "Fasilitas Publik", status: "baru", pelapor: "Diana Putri", warna: iconMerah }
    ];

    // --- MULAI LOGIKA FILTER PETA ---
    
    // 1. Buat "Wadah" untuk menyimpan pin marker
    var markerLayer = L.layerGroup().addTo(map);

    // 2. Fungsi utama untuk menampilkan pin berdasarkan filter
    function renderPeta() {
        // Bersihkan semua pin di dalam wadah
        markerLayer.clearLayers();

        // Cari elemen checkbox
        var cbBaru = document.getElementById('filter-baru');
        var cbProses = document.getElementById('filter-proses');
        var cbSelesai = document.getElementById('filter-selesai');

        // Cek status centang (jika di halaman peta, ikuti centang. Jika tidak, anggap true)
        var showBaru = cbBaru ? cbBaru.checked : true;
        var showProses = cbProses ? cbProses.checked : true;
        var showSelesai = cbSelesai ? cbSelesai.checked : true;

        // 3. Looping data laporan
        laporanMasuk.forEach(function(laporan) {
            // Logika untuk menentukan apakah pin ini boleh tampil
            var isVisible = 
                (laporan.status === 'baru' && showBaru) ||
                (laporan.status === 'proses' && showProses) ||
                (laporan.status === 'selesai' && showSelesai);

            // Jika boleh tampil, pasang pin ke peta
            if (isVisible) {
                var marker = L.marker([laporan.lat, laporan.lng], {icon: laporan.warna});
                
                var statusText = laporan.status === 'baru' ? '<span class="text-red-600 font-bold">Baru Masuk</span>' : 
                                 laporan.status === 'proses' ? '<span class="text-amber-500 font-bold">Sedang Diproses</span>' : 
                                 '<span class="text-green-600 font-bold">Selesai</span>';

                // Hapus tanda # dari ID untuk dijadikan parameter URL (contoh: #0148 jadi 0148)
                var idUrl = laporan.id.replace('#', '');

                var popupContent = `
                    <div class="font-sans text-sm">
                        <p class="font-mono text-xs text-gray-400 font-bold">${laporan.id}</p>
                        <h4 class="font-bold text-gray-800 text-base mb-1">${laporan.kategori}</h4>
                        <p class="text-gray-600 text-xs mb-2">Dilaporkan oleh: ${laporan.pelapor}</p>
                        <p class="text-xs mb-2">Status: ${statusText}</p>
                        <a href="detail-laporan.html?id=${idUrl}" class="block w-full text-center bg-blue-600 text-white py-1.5 rounded-md text-xs font-semibold hover:bg-blue-700 mt-2">Lihat Detail</a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                markerLayer.addLayer(marker); // Masukkan pin ke wadah
            }
        });
    }

    // 4. Jalankan fungsi renderPeta pertama kali saat halaman dimuat
    renderPeta();

    // 5. Pasang 'pendengar' pada kotak centang (hanya jika elemennya ada di halaman tersebut)
    var filterBaru = document.getElementById('filter-baru');
    var filterProses = document.getElementById('filter-proses');
    var filterSelesai = document.getElementById('filter-selesai');

    if (filterBaru) filterBaru.addEventListener('change', renderPeta);
    if (filterProses) filterProses.addEventListener('change', renderPeta);
    if (filterSelesai) filterSelesai.addEventListener('change', renderPeta);
}