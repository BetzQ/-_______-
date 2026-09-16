# LAPORAN HASIL QA TAHAP 1
## Micropage E-Sparepart System — Backend Autentikasi (Node.js + Google Sheets)

| | |
|---|---|
| **Proyek** | Micropage E-Sparepart System (Departemen Engineering) |
| **Kelompok** | CP Kelompok A 127 |
| **Tahap** | Tahap 1 — Backend, Server Express & Modul Autentikasi Dinamis |
| **Tanggal Audit** | 16 September 2026 (Revisi 2 — re-audit pasca-optimasi kinerja) |
| **Auditor** | Lead QA & Senior Fullstack Auditor (mandiri) |
| **Pihak Evaluasi** | Lead Developer (Kak Fadhil) & Project Manager |
| **Lingkungan** | Windows 11 / Node.js v24.16.0 / npm 11.13.0 |
| **Dependensi** | express 5.2.1, cors 2.8.6, dotenv 17.4.2, body-parser 2.3.0, googleapis 181.0.0, xlsx 0.18.5 |

---

## 1. STATUS PENGUJIAN

> ## ✅ STATUS: **LULUS** — 16/16 skenario pengujian lulus, 0 gagal
> **Keterangan:** Tidak ada catatan blokir. QA dijalankan sebanyak **2 kali** (sebelum & sesudah optimasi) dengan hasil identik **16/16 LULUS**. Seluruh temuan audit (4 temuan) telah diperbaiki dan ditambah 1 optimasi kinerja (lazy-load `googleapis`) yang memangkas waktu nyala server dari ±10 detik menjadi **±0,6 detik** (lihat Bagian 3 & 6).

---

## 2. LINGKUP AUDIT

### 2.1. Checklist Kesesuaian Struktur Tahap 1

| No | Instruksi Tahap 1 | Kode | Status |
|---|---|---|---|
| 1 | Express.js aktif sebagai server inti | `server.js:10-11,32-35` | ✅ Terpasang & berjalan (port 3000) |
| 2 | `dotenv` dimuat paling awal | `server.js:1` | ✅ Terpasang |
| 3 | CORS diaktifkan | `server.js:13` | ✅ Terpasang |
| 4 | JSON body parser (body-parser) | `server.js:14` | ✅ Terpasang |
| 5 | Endpoint uji `GET /api/health` | `server.js:17-19` | ✅ Mengembalikan `{"status":"ok","message":"Server E-Sparepart Aktif"}` |
| 6 | Modul koneksi Google Sheets (Service Account) | `src/config/googleSheets.js` | ✅ Inisialisasi `google.auth.GoogleAuth` dgn SCOPES `spreadsheets` |
| 7 | Controller autentikasi `verifyLogin` | `src/controllers/authController.js` | ✅ Membaca sheet **Users** kolom `username, password, role, name, bqLink` |
| 8 | Routing `POST /api/login` terdaftar | `src/routes/authRoutes.js` + `server.js:21` | ✅ Terhubung ke controller |
| 9 | ID spreadsheet dari env `MASTER_SPREADSHEET_ID` | `authController.js:57` | ✅ Dibaca dari `process.env` |
| 10 | Hak akses dinamis (role) | `authController.js:106-127` | ✅ Profil dikembalikan tanpa password |

**Verdict struktur:** Struktur folder `/public`, `/src/config`, `/src/controllers`, `/src/routes` lengkap dan sinkron antar-modul (`googleSheets.js` ↔ `authController.js` — konsumsi `getSheetsClient()` & `isCloudConfigured()` teruji).

### 2.2. Sinkronisasi Sumber Data
- **Mode Cloud (Google Sheets API):** Auth Service Account via `credentials.json` → membaca `MASTER_SPREADSHEET_ID` sheet `Users`.
- **Mode Lokal (snapshot Excel):** Fallback otomatis membaca `Salinan_Spreadsheet_Sparepart/Master DB_User.xlsx` (sheet `Users`, 18 user) — data asli perusahaan dari USERS_DB dokumen **Aps Script CP.docx**.
- Sistem otomatis memilih **cloud dulu**, dan **fail-safe ke lokal** bila cloud gagal (terbukti di uji T14).

---

## 3. TEMUAN AUDIT KODE & PERBAIKAN

Hasil code review mandiri sebelum QA eksekusi:

| Kode | Severity | Temuan | Tindakan | Status |
|---|---|---|---|---|
| **A** | Sedang | Jika kolom `username`/`password` hilang dari sheet, seluruh pengguna menjadi kosong → **seluruh login gagal 401 secara membingungkan** (silent mass failure) | Tambah validasi kolom wajib: melempar error jelas bila header tidak ditemukan (`authController.js:38-42`) | ✅ Diperbaiki & teruji |
| **B** | Rendah | Range cloud `A:E` — jika kolom `bqLink` berpindah posisi, data terlewat | Perlebar ke `A:Z` (`authController.js:58`) | ✅ Diperbaiki |
| **C** | Rendah | `detail: error.message` (path file / internal) bocor ke client | Detail error hanya ditampilkan di mode non-production (`authController.js:131-135`) | ✅ Diperbaiki |
| **D** | Kosmetik | Username dikembalikan lowercase & ada alias duplikat | Pertahankan kasus asli username di respons; bersihkan alias duplikat | ✅ Diperbaiki |
| **E** | Kinerja | `require('googleapis')` dieksekusi di awal startup meskipun mode cloud tidak dipakai → server nyala ±10 detik | **Lazy-load** `googleapis` via `getGoogleLib()` — hanya dimuat saat mode cloud benar-benar digunakan (`googleSheets.js:6-8`) | ✅ Optimasi diterapkan — startup **±0,6 dtk** |

> Tidak ada temuan **kritis** (keamanan bocor password, injeksi, dsb.) pada seluruh siklus audit.

### 3.1. Uji Kinerja Startup (Pasca-Optimasi)
| Metrik | Sebelum Optimasi | Sesudah Optimasi (lazy-load) |
|---|---|---|
| Waktu siap melayani request (`node server.js` → respon `/api/health`) | ±10 detik | **±0,6 detik** |
| Beban memory saat mode lokal | Memuat `googleapis` (±8 dtk) walau tak dipakai | Hanya memuat saat mode cloud diaktifkan |

---

## 4. HASIL PENGUJIAN QA TEST (TABEL RESMI)

Metode uji: **Black-box / API functional automated** menggunakan request HTTP asli ke server berjalan (Node `fetch`), bukan simulasi mock.

| # | Skenario | Metode Uji | Hasil Aktual | Status |
|---|---|---|---|---|
| T1 | Health check server | `GET /api/health` | `200 → {"status":"ok","message":"Server E-Sparepart Aktif"}` | ✅ Lulus |
| T2 | Login valid — Teknisi `AAA` | `POST /api/login` | `200`, `data {role:"teknisi", name:"AAA", bqLink:...}` | ✅ Lulus |
| T2a | Verifikasi password **tidak bocor** (positif) | Inspeksi body respons | Field `"password"` **tidak ada** di JSON respons | ✅ Lulus |
| T3 | Login valid — Manager `KSW` | `POST /api/login` | `200`, `role:"manager"` | ✅ Lulus |
| T4 | Login valid — Supervisor `INN` | `POST /api/login` | `200`, `role:"Supervisor 1"` | ✅ Lulus |
| T5 | Password salah | `POST /api/login` (pass `salah`) | `401 → "Kombinasi Username atau Password salah"` | ✅ Lulus |
| T5a | Verifikasi password **tidak bocor** (negatif) | Inspeksi body respons | Field `"password"` tidak ada di JSON respons | ✅ Lulus |
| T6 | Username tidak dikenal (`XYZ99`) | `POST /api/login` | `401` (ditolak) | ✅ Lulus |
| T7 | Username case-insensitive (`aaa`) | `POST /api/login` | `200` — login tetap berhasil | ✅ Lulus |
| T8 | Username dengan spasi (`  AAA  `) | `POST /api/login` | `200` — spasi diabaikan (trim) | ✅ Lulus |
| T9 | Username kosong | `POST /api/login` | `400 → "Parameter username dan password wajib diisi"` | ✅ Lulus |
| T10 | Password kosong | `POST /api/login` | `400` (ditolak validasi) | ✅ Lulus |
| T11 | Body objek kosong `{}` | `POST /api/login` | `400` (ditolak validasi) | ✅ Lulus |
| T12 | Metode salah `GET /api/login` | `GET /api/login` | `404 → "Endpoint tidak ditemukan"` | ✅ Lulus |
| T13 | Endpoint tidak dikenal | `GET /api/nope` | `404` (handler 404 berfungsi) | ✅ Lulus |
| T14 | **Fail-safe**: mode cloud dikonfigurasi tapi cloud gagal (kredensial palsu) | `POST /api/login` (port terpisah, ID dummy) | `200` — otomatis **fallback ke file lokal**, layanan tetap melayani login | ✅ Lulus |

### Ringkasan Kuantitatif
```
Total Skenario : 16
Lulus          : 16  (100%)
Gagal          : 0
Kesimpulan     : SEMUA LULUS
```

---

## 5. PENJELASAN RAMAH NON-TEKNIS (untuk Manajemen)

**Apa yang sudah dibangun:** Tahap 1 adalah **"pintu gerbang keamanan"** sistem E-Sparepart. Setiap orang yang ingin masuk harus melalui satu pintu terpusat di server — bukan langsung menyentuh file spreadsheet perusahaan.

**Bukti bahwa sistem aman & siap:**
- 🛡️ **Password tidak pernah bocor.** Setelah log-in berhasil, server hanya mengirim data profil (nama, jabatan/role, tautan Bill of Quantity) — kata sandi disembunyikan, tidak pernah ikut dikirim keluar.
- 🚪 **Penolakan yang jelas.** Jika kombinasi username/password salah, pintu menolak masuk dengan **status 401 dan pesan ramah** ("Kombinasi Username atau Password salah"), tanpa memberi petunjuk bagian mana yang salah.
- 🧹 **Perlakuan sama untuk semua input.** Spasi kosong dan huruf besar/kecil pada username dirapikan otomatis, sehingga teknisi tidak perlu menghafal huruf kapital.
- 📱 **Selalu tersedia.** Server dirancang membaca data dari spreadsheet **cloud Google**, dan bila koneksi cloud terganggu, **otomatis beralih ke file cadangan lokal** tanpa menghentikan layanan login (uji T14). Ini artinya kegagalan teknis kecil tidak akan membuat teknisi terhenti bekerja.
- 🧯 **Permintaan invalid ditolak sejak awal** (body kosong, kolom kosong → status 400), sehingga sistem tidak memroses data "sampah".

**Kesimpulan non-teknis:** Komponen keamanan (login berbasis peran sesuai data di database) **sudah berfungsi dan sudah teruji otomatis** untuk digunakan sebagai fondasi dashboard.

---

## 6. ANALISIS RISIKO & REKOMENDASI (untuk Tahap 2)

| Risiko/Catatan | Rekomendasi | Prioritas |
|---|---|---|
| Password tersimpan **plain text** di sheet (warisan arsitektur lama) | Untuk produksi, terapkan hashing (`bcrypt`) pada kolom password | Sedang (tujuan akademik saat ini) |
| Belum ada pembatasan percobaan login berulang | Tambahkan rate-limiting sederhana (`express-rate-limit`) sebelum publikasi | Sedang |
| ~~`googleapis` memuat ±8 detik saat startup~~ | ✅ **TERATASI** — lazy-load diterapkan (`src/config/googleSheets.js`, item E) | Selesai |
| `credentials.json` & `.env` wajib dikecualikan dari git | Sudah ada di `.gitignore` — **pastikan tidak pernah ter-commit** | Wajib |
| Kredensial Service Account belum dimasukkan di `.env` (mode cloud belum dinyalakan — saat ini aktif mode lokal) | Tim menyiapkan `credentials.json` + isi `MASTER_SPREADSHEET_ID` lalu uji ulang uji silang cloud↔lokal | PRASYARAT Tahap 2 |

---

## 7. REKOMENDASI KESIAPAN → TAHAP 2 (Frontend & Dashboard Role-Based Access)

> ## ✅ **VERDICT: LAYAK (READY) — 100% untuk Tahap 1**
>
> **Pernyataan:** Hasil audit dan 16 skenario pengujian menunjukkan seluruh fungsi Tahap 1 **bekerja sesuai spesifikasi** (server aktif, autentikasi dinamis dari spreadsheet `Users`, hak akses per peran, anti-bocor password, dan fallback cadangan lokal). **Tidak ada cacat fungsional tersisa.**
>
> Tim dapat **melanjutkan ke Tahap 2** (pembangunan frontend dashboard berbasis role dengan memanfaatkan `data.role` dan `data.bqLink`/profil dari `POST /api/login`).
>
> **Prasyarat (wajib sebelum produksi/deploy, opsional untuk demonstrasi):**
> 1. Siapkan **Google Service Account** (`credentials.json`) dan isi `MASTER_SPREADSHEET_ID` di `.env` untuk mengaktifkan mode cloud asli perusahaan.
> 2. Pastikan `Master DB_User.xlsx` (atau sheet `Users` di cloud) memiliki baris terkini data pegawai.
> 3. Batasi akses `credentials.json` dan file `.env` dari publik/git.

---

## 8. LAMPIRAN — CARA MENGULANG PENGUJIAN

### 8A. Jalankan server
```powershell
node server.js            # atau: npm start / npm run dev
# Server kini siap dalam ±0,6 detik (lazy-load googleapis)
```

### 8B. Uji cepat via terminal
```powershell
# Health check
curl.exe http://localhost:3000/api/health

# Login valid (Teknisi AAA)
curl.exe -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  --data-binary "@login.json"
# login.json: {"username":"AAA","password":"04AAA10"}

# Login gagal (harus 401)
# file neg.json  -> {"username":"AAA","password":"salah"}
curl.exe -X POST http://localhost:3000/api/login `
  -H "Content-Type: application/json" `
  --data-binary "@neg.json"
```

### 8C. Visual API Dashboard (test-runner.html)
Buka `http://localhost:3000/test-runner.html` di browser untuk menjalankan 5 skenario pengujian secara otomatis dengan animasi langkah-demi-langkah. Terdapat menu **Kecepatan** untuk mengatur jeda antar-pengujian (0 s / 0,5 s / 1,5 s).

### 8D. QA otomatis lengkap (16 skenario)
Jalankan script Node.js untuk mengulang seluruh uji QA termasuk uji fail-safe cloud→lokal:
```powershell
node scripts/qa_tahap1.js
```

---
*Dokumen QA disusun oleh Lead QA & Senior Fullstack Auditor — Micropage E-Sparepart System, CP Kelompok A 127. Revisi 2 terakhir diperbarui: 16 September 2026.*