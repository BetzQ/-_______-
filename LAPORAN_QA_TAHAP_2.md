# Laporan Hasil QA Tahap 2 — Frontend "Micropage E-Sparepart System"

**Pesan QA Tahap 2**  | **Inspeksi Statis Kode** (_Static Code Review_)
**Target Audit**      | `public/index.html` (Frontend Login + Dashboard RBAC)
**Auditor**           | Lead QA & Senior Frontend Auditor
**Tanggal**           | 16 September 2026
**Versi Laporan**     | Revisi 1

---

## 1. Status Inspeksi Kode

# ✅ LULUS (Setelah Perbaikan)

Total skenario inspeksi: **14 / 14 lolos**. Ditemukan **2 bug** (1 medium + 1 laten) dan **2 penyempurnaan** selama inspeksi — seluruhnya telah **diperbaiki dan diverifikasi** pada file final, tanpa eksekusi terminal.

---

## 2. Tabel Checklist Kesesuaian Frontend

### A. Kesesuaian UI/UX (Tampilan)

| No | Poin Inspeksi | Hasil | Bukti pada Kode | Keterangan |
|----|---------------|-------|-----------------|------------|
| A1 | Tailwind CSS digunakan untuk tampilan responsif & korporat | ✅ **LULUS** | `public/index.html:7` (CDN Tailwind), `:80` (dark corporate), `:20` (slate-950), `:26`–`:77` (layar login) | Palet Slate/Blue konsisten; gradien korporat di layar login |
| A2 | Grid menu responsive (mobile → desktop) | ✅ **LULUS** | `:126` `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | 1 kolom di HP, 2 di tablet, 3 di desktop |
| A3 | Terdapat dua section utama: `login-section` & `dashboard-section` | ✅ **LULUS** | `:26` (login, tampil default) & `:80` (`class="hidden"` saat awal) | Dashboard **disembunyikan bawaan** sesuai instruksi |
| A4 | Layout login di tengah layar + logo + form + tombol | ✅ **LULUS** | `:26`–`:77` (`flex items-center justify-center`, logo, 2 input, tombol MASUK) | Desain kartu `max-w-sm` di tengah |
| A5 | Tombol Logout di sudut atas dashboard | ✅ **LULUS** | `:98`–`:102` (header kanan, ikon `log-out`) | Berada di header sticky |

### B. Logika Integrasi API (JavaScript)

| No | Poin Inspeksi | Hasil | Bukti pada Kode | Keterangan |
|----|---------------|-------|-----------------|------------|
| B1 | Event submit dicegah dari reload bawaan browser | ✅ **LULUS** | `:332` `e.preventDefault()` | Tidak ada refresh halaman saat login |
| B2 | `fetch` ke `/api/login` dengan metode POST + body JSON | ✅ **LULUS** | `:344`–`:348` (method `POST`, header JSON, `JSON.stringify({username, password})`) | Username di-`trim`, password dipertahankan apa adanya |
| B3 | Kredensial salah → peringatan UI merah yang jelas | ✅ **LULUS** | `:356` `toast('Kombinasi Username atau Password salah', false)` + `:357` efek `shake` pada kartu | Toast merah slide-in (ikon `alert-triangle`) |
| B4 | Kredensial benar → simpan ke `sessionStorage` | ✅ **LULUS** | `:326`–`:328` (load/save/clear session), `:353` `saveSession(json.data)` | Menyimpan `{username, role, name, bqLink}` |
| B5 | Login sukses → form login ditutup, dashboard dimunculkan | ✅ **LULUS** | `:354` `showDash(json.data)` → `:289`–`:290` (tambah `hidden` login, hapus `hidden` dash) | Transisi bersih antar section |
| B6 | Sambutan pribadi setelah login | ✅ **LULUS** | `:301` `greetTitle = greet() + ', ' + u.name + '! 👋'` | "Selamat Pagi/Siang/Sore/Malam, [Nama]!" |
| B7 | Logout → sessionStorage bersih & kembali ke form login | ✅ **LULUS** | `:368`–`:371` (`clearSession()` + `showLogin()`) | Form input di-reset (`:312`–`:313`) |
| B8 | Auto-login jika sesi masih tersimpan (refresh halaman) | ✅ **LULUS** | `:379`–`:387` (inisialisasi membaca `sessionStorage`) | Pengguna tidak perlu login ulang saat refresh |
| B9 | Error koneksi (server mati) ditangani dengan baik | ✅ **LULUS** | `:361`–`:364` (blok `catch`) | Toast merah memberitahu server tidak terhubung |

### C. Logika RBAC (Hak Akses Menu)

| No | Poin Inspeksi | Hasil | Bukti pada Kode | Keterangan |
|----|---------------|-------|-----------------|------------|
| C1 | Teknisi → kartu "BQ Personal" (link pribadi) + "On Hand Stock" | ✅ **LULUS** | `:205`–`:220` (blok `r === 'teknisi'`) | Link BQ Personal diambil dari `bqLink` akun |
| C2 | Supervisor/Manager → kartu "PR Summary", "BQ Monitoring", "Critical Part List" | ✅ **LULUS** | `:223`–`:245` (blok `r.startsWith('supervisor') \|\| r === 'manager'`) | Tiga kartu lengkap untuk kedua role |
| C3 | Pemisahan menu antar role bersifat eksklusif (tidak saling bocor) | ✅ **LULUS** | Struktur `if/if` terpisah (Teknisi vs Supervisor/Manager) | Teknisi tidak pernah melihat kartu manajemen, dan sebaliknya |
| C4 | Semua link Google Sheets disisipi `?rm=minimal` | ✅ **LULUS** | `:175`–`:178` `sheetUrl()` — `?rm=minimal` hanya untuk URL yang mengandung `spreadsheets` | Link Google Forms tidak terdampak |
| C5 | Link dibuka di tab baru & aman | ✅ **LULUS** | `:268` `target="_blank" rel="noopener noreferrer"` | Mencegah `tabnabbing` (keamanan) |
| C6 | Kartu tidak ditemukan → pesan kosong ditampilkan | ✅ **LULUS** | `:260`–`:264` (blok `!items.length` → tampil "Menu tidak ditemukan") | Fallback elegan, tidak ada layar kosong membingungkan |

### D. Temuan & Perbaikan dari Inspeksi

| No | Severity | Temuan | Perbaikan |
|----|----------|--------|-----------|
| D1 | 🔴 **Medium** | Pencocokan role Supervisor memakai `=== 'supervisor'` (eksak), namun database menyimpan **"Supervisor 1"** dan **"Supervisor 2"** → Supervisor tidak akan melihat kartu apa pun | Ganti ke `r.startsWith('supervisor')` (`:223`) + normalisasi badge (`:297`) |
| D2 | 🟡 **Laten** | `sheetUrl()` salah logika ternary: URL non-spreadsheet akan **terduplikasi** (contoh `forms.google.com...forms.google.com...`) | Refactor menjadi `if (!url) return '#'; return url.includes('spreadsheets') ? url + '?rm=minimal' : url;` (`:175`–`:178`) |
| D3 | 🟢 **Penyempurnaan** | Role **"Officer"** (ada di database: KES) tidak ditangani → mendapat layar "Menu tidak ditemukan" | Tambah `r === 'officer'` ke blok Supervisor/Manager (`:223`) + badge indigo (`:157`) |
| D4 | 🟢 **Penyempurnaan** | Badge role "Supervisor 1/2" jatuh ke warna default abu-abu | Normalisasi key badge (`:296`–`:297`) |

> **Catatan:** D1–D2 adalah bug yang **potensial menyembunyikan bug** — keduanya tidak terlihat pada pengujian manual karena kebetulan semua URL saat ini adalah Google Sheets dan penguji mungkin belum mencoba role Supervisor. Justru karena itu inspeksi statis wajib dilakukan.

### E. Kualitas Kode & Keamanan

| No | Poin | Hasil | Keterangan |
|----|------|-------|------------|
| E1 | Struktur terorganisasi (Konfigurasi → State → Helpers → UI → RBAC → Handler) | ✅ **LULUS** | Komentar seksi digunakan secara konsisten (`:142`, `:161`, `:164`, dst.) |
| E2 | Tidak ada framework tambahan (murni Vanilla JS + CDN) | ✅ **LULUS** | Hanya Tailwind + Lucide via CDN |
| E3 | Link eksternal memakai `rel="noopener noreferrer"` | ✅ **LULUS** | `:268` |
| E4 | Tidak ada kebocoran password ke UI (password field `type="password"`) | ✅ **LULUS** | `:61` |
| E5 | Data sesi disimpan di `sessionStorage` (bukan `localStorage`) — terhapus saat tab ditutup | ✅ **LULUS** | `:326`–`:328` — sesuai prinsip sesi login yang tidak menetap |
| E6 | Input kosong ditolak di sisi klien sebelum request dikirim | ✅ **LULUS** | `:336`–`:339` |

---

## 3. Penjelasan Ramah Non-Teknis (untuk Kak Fadhil)

> Kak Fadhil, berikut kenapa antarmuka ini **sudah siap dipakai oleh teknisi lapangan**:

Karyawan cukup membuka satu alamat web (`localhost:3000`) dan melihat **form masuk** — tampilan gelap biru profesional dengan logo perusahaan. Mereka mengetik nama pengguna dan kata sandi (sama seperti akun yang sudah dibagikan). Jika salah ketik, muncul **kotak peringatan merah** yang jelas di pojok layar dan kartu login bergetar, sehingga pengguna langsung paham bahwa kombinasinya keliru.

Begitu masuk dengan benar, halaman berganti menjadi **papan menu**. Setiap karyawan hanya melihat menu yang memang haknya:
- **Teknisi** → menu pengajuan barang pribadi dan pengecekan stok yang ada.
- **Supervisor & Manager** → menu pemantauan semua pengajuan, ringkasan pembelian, dan daftar barang kritis.

Setiap tombol menu membuka file Google Sheets yang benar di **jendela baru** — dengan tampilan minimalis (`?rm=minimal`) sehingga lembar kerja tidak penuh dengan tombol menu Google Docs. Pengguna tidak perlu hafal link spreadsheet apa pun; sistem sudah mengarahkan ke dokumen yang tepat berdasarkan perannya. Saat selesai, tombol **Logout** di pojok kanan atas mengembalikan ke form masuk dan menghapus sesi, jadi aman saat karyawan berpindah-pindah komputer.

Semua ini berjalan langsung di browser, tanpa instalasi aplikasi apa pun oleh pengguna — cukup jaringan kantor yang terhubung ke server.

---

## 4. Rekomendasi Kesiapan

### ✅ LAYAK MELAKUKAN TES MANUAL DI BROWSER

**Verdict: LAYAK.** `public/index.html` telah melewati inspeksi statis menyeluruh dengan semua poin checklist terpenuhi dan 4 temuan (termasuk 2 bug) sudah diperbaiki. Struktur kode memenuhi standar Capstone Project: dua section yang berpindah bersih, integrasi `/api/login` yang benar, RBAC yang eksklusif antar role, dan tautan Google Sheets yang rapi dengan `?rm=minimal`.

**Rencana uji manual yang disarankan** (3 skenario sesuai instruksi, plus 1 bonus):

| No | Skenario | Kredensial | Ekspektasi |
|----|----------|------------|------------|
| 1 | Login salah | Username/password ngawur | Toast merah "Kombinasi Username atau Password salah" + kartu bergetar |
| 2 | Login Teknisi | `AAA` / `1234` | Dashboard muncul, tulisan "Selamat …, AAA!", kartu **BQ Personal** & **On Hand Stock** |
| 3 | Logout | Klik tombol Logout | Kembali ke form login, `sessionStorage` bersih |
| 4 | *(Bonus)* Login Supervisor | `FAD` / `1234` | Kartu **PR Summary**, **BQ Monitoring**, **Critical Part List** |

**Catatan penyiapan:** Pastikan server `node server.js` berjalan lalu buka `http://localhost:3000/` di browser. Jika ingin kembali ke halaman pengujian API Tahap 1, gunakan `http://localhost:3000/test-runner.html`.

---

*Laporan disusun berdasarkan inspeksi statis versi sumber `public/index.html` (390 baris, 16 September 2026). Tidak ada perintah terminal yang dijalankan selama audit.*