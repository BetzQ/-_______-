# Catatan Revisi Bab 3 — Penyesuaian dengan Aplikasi (Sub-bab 3.6 s/d bawah)

**Dari:** Avwan (Anggota 1 — Lead Developer)
**Tanggal:** 12 Oktober 2026
**Sumber draft:** `BAB 3 Tugas CP.docx` (versi yang diupload Kak Fadhil 11 Okt 2026)
**Ruang lingkup:** hanya aspek teknis aplikasi Micropage E-Sparepart (production: https://e-sparepart-system-tau.vercel.app).
Catatan Kak Fadhil yang **bukan** soal aplikasi (hapus FGD, why-why analysis, log Suggestion System, sub-bab PO Urgent)
sengaja **tidak disentuh** di catatan ini.

> Cara pakai: tiap item ada **Teks lama → Teks baru** yang bisa langsung disalin-tempel. Nomor item = R1, R2, dst.
> Kalau nomor tabel/gambar ikut bergeser setelah revisi lain, sesuaikan rujukannya (lihat catatan di akhir).

---

## Ringkasan cepat

| # | Lokasi | Masalah | Prioritas |
|---|---|---|---|
| R1 | 3.7.1 & 3.7.4 | Klaim "notifikasi email" — fitur tidak ada di aplikasi | **Wajib** |
| R2 | 3.7.1, 3.7.2, Tabel 3.8 | Istilah "BQ Summary" → nama di aplikasi sekarang "Rekapan Pengajuan" | **Wajib** |
| R3 | 3.7.1 | Kata "peringatan" stok menyesatkan (tidak ada notifikasi otomatis) | Sebaiknya |
| R4 | 3.7.2 | Daftar menu per peran tidak sama dengan aplikasi (5/5/7/9 menu) | **Wajib** |
| R5 | 3.7.2 | Nomor sub-bab melompat: 3.7.2.2 → 3.7.2.4 | **Wajib** |
| R6 | 3.7.2.4 | Rujukan "Tabel 3.14" padahal tabelnya berlabel Tabel 3.9 | **Wajib** |
| R7 | Tabel 3.8 | Baris Supervisor/Manager/Officer kurang lengkap & ada istilah lama | Sebaiknya |
| R8 | Tabel 3.9 | Status "Closing PR/Proses PR/Deliver" bukan status aplikasi | **Wajib** |
| R9 | Tabel 3.10 | "Google Sheets dan Apps Script" bukan bagian sistem (tidak dipakai runtime) | Sebaiknya |
| R10 | 3.7.3 | Hash password ditulis **bcrypt**, aplikasi pakai **scrypt** | **Wajib** |
| R11 | 3.7.4 | Skenario black box memuat "kirim notifikasi email" | **Wajib** |
| R12 | 3.7.1 s/d 3.7.4 | Tambahan fakta yang belum ditulis (Approval User, Log Aktivitas, Layout Rak, angka stok habis) | Opsional |

---

## R1 — Klaim "notifikasi email" (3.7.1 dan 3.7.4)

**Fakta:** aplikasi **tidak memiliki fitur email sama sekali** (tidak ada pustaka pengirim email; pendaftaran akun pun
dicatat "tanpa notifikasi email" di kode `src/controllers/userManagementController.js:8`). Approval hanya terlihat di
menu masing-masing peran. Fitur ini benar posisinya hanya di 3.7.6 sebagai *pengembangan lanjutan*.

### R1a — 3.7.1 Kebutuhan Fungsional

> **Teks lama:**
> "Otomatisasi persetujuan berjenjang (Approval Workflow) oleh Supervisor dan Manager, dilengkapi pemisahan kategori Normal dan Urgent, serta notifikasi email kepada pihak yang menyetujui."

> **Teks baru:**
> "Otomatisasi persetujuan berjenjang (Approval Workflow) oleh Supervisor dan Manager, dilengkapi penetapan kategori Normal dan Urgent oleh Supervisor/Manager."

### R1b — 3.7.4 Black Box Testing

> **Teks lama:**
> "Skenario uji mencakup validasi input formulir digital (mencegah kolom wajib kosong), autentikasi login berbasis peran, pembatasan hak akses menu, keberhasilan pengiriman notifikasi email kepada pihak penyetuju, dan akurasi filter pencarian pada menu On-Hand Stock."

> **Teks baru:**
> "Skenario uji mencakup validasi input formulir digital (mencegah kolom wajib kosong), autentikasi login berbasis peran, pembatasan hak akses menu dan endpoint di sisi server, alur persetujuan berjenjang (Manager tidak dapat menyetujui sebelum Supervisor), penguncian sementara setelah percobaan login gagal berulang, serta akurasi filter pencarian pada menu On-Hand Stock."

---

## R2 — Istilah "BQ Summary" → "Rekapan Pengajuan"

**Fakta:** halaman rekap di aplikasi sudah resmi bernama **"Rekapan Pengajuan"** (judul modal di
`public/index.html:564`), menampilkan pengajuan yang sudah disetujui penuh SPV + Manager. "BQ Summary" adalah nama lama.

### R2a — 3.7.1 Kebutuhan Fungsional

> **Teks lama:**
> "Rangkuman status pengajuan yang transparan (BQ Summary dan PR Summary) dengan penelusuran status per tahap."

> **Teks baru:**
> "Rangkuman status pengajuan yang transparan (Rekapan Pengajuan dan PR Summary) dengan penelusuran status per tahap."

### R2b — Tabel 3.8, baris Supervisor

> **Teks lama:**
> "Melakukan persetujuan tahap 1 (status_approval_spv); memantau BQ Summary dan, untuk Supervisor 1, PR Summary dan Monthly Report."

> **Teks baru:**
> "Melakukan persetujuan tahap 1 (status_approval_spv) dan menetapkan urgensi Normal/Urgent; memantau Rekapan Pengajuan dan, untuk Supervisor 1, PR Summary serta Monthly Report."

*(Perbaikan "dan, untuk" → "serta" sekaligus. Penetapan urgensi oleh Supervisor ini benar secara kode:
`src/controllers/bqController.js:436`.)*

---

## R3 — Kata "peringatan" pada 3.7.1 (opsional, biar tidak ditanya dosen)

**Fakta:** aplikasi **tidak** mengirim peringatan otomatis. Yang ada: KPI "Stok Rendah (≤ Min)" dan "Stok Habis",
daftar item paling defisit, serta ikon peringatan di layout rak (`src/controllers/sparepartController.js:28-66`,
`public/index.html:1845`). Jadi lebih tepat disebut *indikator visual*.

> **Teks lama:**
> "Pengelolaan katalog Critical Sparepart List berbasis evaluasi Min–Max Stock beserta peringatan ketika stok berada di bawah batas minimum."

> **Teks baru:**
> "Pengelolaan katalog Critical Sparepart List berbasis evaluasi Min–Max Stock beserta indikator visual pada dasbor dan daftar item ketika stok berada pada atau di bawah batas minimum."

---

## R4 — Daftar menu per peran di 3.7.2 (WAJIB, paling sering dilihat dosen)

**Fakta:** sumber kebenaran = konfigurasi menu aplikasi (`public/index.html:2139-2342`).
Menu asli sekarang:

| Peran | Menu di aplikasi |
|---|---|
| Teknisi (5) | BQ Personal · Status Pengajuan Saya · On Hand Stock · Layout Rak · Rekapan Pengajuan |
| Supervisor 2 & Officer (5) | Rekapan Pengajuan · Approval BQ Tahap Supervisor · Critical Part List · On Hand Stock · Layout Rak |
| Supervisor 1 (7) | PR Summary · Monthly Report · Rekapan Pengajuan · Approval BQ Tahap Supervisor · Critical Part List · On Hand Stock · Layout Rak |
| Manager (9) | Approval User · Log Aktivitas · On Hand Stock · Layout Rak · Monthly Report · PR Summary · Rekapan Pengajuan · Approval BQ Urgent · Critical Part List |

> **Teks lama (paragraf menu di butir "Halaman Menu Utama (Dashboard RBAC)"):**
> "Teknisi memperoleh menu BQ Personal, BQ Monitoring, dan On Hand Stock; Officer dan Supervisor 2 memperoleh BQ Monitoring, On Hand Stock, Critical Part List, dan Approval SPV; Supervisor 1 memperoleh BQ Monitoring, Approval SPV, Critical Part List, On Hand Stock, PR Summary, dan Monthly Report; Manager memperoleh BQ Monitoring, Approval Manager, Monthly Report, On Hand Stock, dan Critical Part List."

> **Teks baru:**
> "Teknisi memperoleh menu BQ Personal, Status Pengajuan Saya, On Hand Stock, Layout Rak, dan Rekapan Pengajuan; Officer dan Supervisor 2 memperoleh menu Rekapan Pengajuan, Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock, dan Layout Rak; Supervisor 1 memperoleh menu PR Summary, Monthly Report, Rekapan Pengajuan, Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock, dan Layout Rak; Manager memperoleh menu Approval User, Log Aktivitas, On Hand Stock, Layout Rak, Monthly Report, PR Summary, Rekapan Pengajuan, Approval BQ Urgent, dan Critical Part List."

**Sekaligus perbaiki butir-butir halaman di bawahnya:**

> **Teks lama:** "Halaman BQ Personal dan Summary: lembar input tabel interaktif bagi teknisi serta halaman pemantauan status pengajuan yang transparan."
> **Teks baru:** "Halaman BQ Personal, Status Pengajuan Saya, dan Rekapan Pengajuan: lembar input tabel interaktif bagi teknisi, pelacakan status pengajuan pribadi, serta halaman pemantauan pengajuan yang sudah disetujui penuh (SPV + Manager)."

> **Teks lama:** "Monthly Report Dashboard: tampilan dasbor analitik laporan bulanan."
> **Teks baru:** "Monthly Report Dashboard: dasbor analitik laporan bulanan dengan grafik interaktif, filter periode, dan ekspor Excel; tautan Looker Studio dipertahankan sebagai laporan lama/alternatif."

*(Tambahan opsional untuk kelengkapan — sisipkan setelah butir On-Hand Stock:)*
> "Halaman Layout Rak Gudang: peta lokasi penyimpanan per rak/baris/kolom yang dibaca dari kolom lokator On Hand Stock, dilengkapi tab daftar item yang belum memiliki lokasi."

---

## R5 — Nomor sub-bab melompat: 3.7.2.2 → 3.7.2.4

**Fakta:** dokumen tidak punya 3.7.2.3. Bagian "Perancangan Antarmuka Pengguna (UI)" belum diberi nomor.

> **Teks lama:**
> "Perancangan Antarmuka Pengguna (UI)" *(heading tanpa nomor, setelah Activity Diagram)*

> **Teks baru:**
> "3.7.2.3 Perancangan Antarmuka Pengguna (UI)"

*(Dengan ini 3.7.2.4 Perancangan Hak Akses tetap valid, tidak perlu diubah.)*

---

## R6 — Rujukan "Tabel 3.14" tidak ada (3.7.2.4)

> **Teks lama:**
> "Alur persetujuan berjenjang dikendalikan melalui tiga tahap dan satu jejak audit pada Tabel 3.14."

> **Teks baru:**
> "Alur persetujuan berjenjang dikendalikan melalui tiga tahap dan satu jejak audit pada Tabel 3.9."

*(Pada draft ini tabel yang dimaksud memang berlabel Tabel 3.9. Kalau nomor tabel bergeser akibat revisi lain,
samakan rujukannya.)*

---

## R7 — Tabel 3.8 (RBAC): baris Manager & Officer kurang lengkap

**Fakta:** menu **Approval User** dan **Log Aktivitas** adalah fitur nyata yang hanya dimiliki Manager
(persetujuan pendaftaran akun + penugasan tim; riwayat login/aktivitas). Manager juga boleh mengubah status
pengadaan (`src/controllers/bqController.js:430`).

> **Teks lama (baris Manager):**
> "Melakukan persetujuan tahap 2 (status_approval_manager); memantau Monthly Report."

> **Teks baru (baris Manager):**
> "Melakukan persetujuan tahap 2 (status_approval_manager) termasuk pengajuan Urgent; dapat ikut mengubah status pengadaan; menyetujui pendaftaran akun baru dan menugaskan tim (Approval User); memantau Monthly Report, PR Summary, dan Log Aktivitas."

> **Teks lama (baris Officer):**
> "Mengeksekusi Closing PR pada tahap pengadaan dan mengawasi data Critical Sparepart; tidak berperan sebagai penyetuju."

> **Teks baru (baris Officer):**
> "Mengubah status pengadaan pada pipeline pengadaan (BQ Baru sampai Selesai) dan mengawasi data Critical Sparepart; tidak berperan sebagai penyetuju."

---

## R8 — Tabel 3.9: status pengadaan yang ditulis bukan status aplikasi

**Fakta:** status aplikasi hanya 8 nilai ini (`src/controllers/bqController.js:186-195`):
`BQ Baru → Pending → Proses PO → PO Open → Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai`.
Istilah "Closing PR", "Proses PR", dan "Deliver" tidak ada di sistem.
Status pengadaan hanya bisa diubah **Officer dan Manager** (`bqController.js:430-435`).

> **Teks lama (baris 3):**
> "3. Proses Pengadaan | Officer | status_pengadaan | Closing PR, PO Open, Proses PR, hingga Deliver."

> **Teks baru (baris 3):**
> "3. Proses Pengadaan | Officer dan Manager | status_pengadaan | Delapan status baku: BQ Baru → Pending → Proses PO → PO Open → Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai."

*(Opsional — tambah satu baris setelah baris 2:)*
> "Penetapan urgensi | Supervisor dan Manager | urgency | Normal/Urgent; teknisi tidak menentukan saat submit (pengajuan baru selalu mulai dari Normal)."

---

## R9 — Tabel 3.10: "Google Sheets dan Apps Script" (opsional tapi sebaiknya)

**Fakta:** sistem berjalan penuh di Node.js + Express + PostgreSQL/Supabase. File `src/config/googleSheets.js`
ada, tapi **tidak diimpor/dipakai** oleh modul mana pun (sisa pengembangan awal). Monthly Report sekarang digambar
di dalam web (Chart.js); Looker Studio hanya tautan laporan lama.

> **Teks lama (baris Integrasi):**
> "Integrasi (opsional) | Google Sheets dan Apps Script | Sinkronisasi data master; Looker Studio dapat diaktifkan sebagai visualisasi tambahan."

> **Teks baru (baris Integrasi):**
> "Integrasi (opsional) | Looker Studio | Tautan laporan lama pada menu Monthly Report; visualisasi utama (grafik) digambar langsung di dalam web menggunakan Chart.js."

---

## R10 — 3.7.3: bcrypt → scrypt (WAJIB)

**Fakta:** password di-hash **scrypt** bawaan Node (`src/utils/password.js:5`), bukan bcrypt.
Password lama berformat teks biasa otomatis di-upgrade ke hash saat login (`src/controllers/authController.js:66-76`).

> **Teks lama:**
> "Keamanan: kata sandi pengguna disimpan dalam bentuk hash (bcrypt) dan tidak pernah sebagai teks biasa; percobaan login dibatasi (rate limiting) untuk menahan serangan brute force; otorisasi diperiksa di server pada setiap endpoint sensitif sehingga pembatasan pada antarmuka hanyalah lapisan kenyamanan."

> **Teks baru:**
> "Keamanan: kata sandi pengguna disimpan dalam bentuk hash scrypt dan tidak pernah sebagai teks biasa (akun lama berformat plaintext otomatis di-upgrade saat login pertama); percobaan login dibatasi maksimal 5 kali kegagalan per 15 menit per kombinasi IP dan username untuk menahan serangan brute force; otorisasi diperiksa di server pada setiap endpoint sensitif sehingga pembatasan pada antarmuka hanyalah lapisan kenyamanan."

*(Batas 5 kali / 15 menit sesuai `src/middleware/loginRateLimit.js:5-6`.)*

---

## R11 — sudah tergabung di R1b (3.7.4)

---

## R12 — Tambahan fakta (opsional, memperkuat "sesuai aplikasi")

1. **3.7.1 Kebutuhan Fungsional** — bisa ditambah 1 butir:
   > "Pendaftaran akun mandiri (self-registration) oleh calon pengguna baru dengan persetujuan Manager, sekaligus penugasan tim (Supervisor 1, Supervisor 2, atau Officer)."

2. **3.7.1 Kebutuhan Fungsional** — butir audit trail bisa diperluas:
   > **Lama:** "Pencatatan jejak audit (audit trail) untuk setiap perubahan status pengajuan."
   > **Baru:** "Pencatatan jejak audit (audit trail) untuk setiap perubahan status pengajuan serta riwayat login dan aktivitas pengguna, yang dapat dipantau Manager melalui menu Log Aktivitas."

3. **3.7.4 nomor 4 (Evaluasi Data Production)** — bisa ditambah angka stok habis:
   > **Lama:** "...basis data production memuat 3.022 item, 210 suku cadang kritis, dan 356 item berstok rendah."
   > **Baru:** "...basis data production memuat 3.022 item, 210 suku cadang kritis, 356 item berstok rendah (≤ Min), dan 1.887 item berstok nol."

4. **3.7.6 Pemeliharaan** — bisa ditambah 1 butir keterbatasan data (jujur & sesuai temuan 1 Okt 2026):
   > "Penuntasan data lokasi rak: sekitar 74% item (2.243 dari 3.022) belum memiliki lokator rak sehingga perlu dilengkapi bertahap."

---

## Lampiran A — Temuan format di luar cakupan aplikasi (opsional, biarkan Kak Fadhil/Giren yang putuskan)

Bukan soal aplikasi, tapi ada di bagian yang sama (3.5–3.7):

1. Judul **"Subjek Penelitian"** belum bernomor — usul: **3.3 Subjek Penelitian**.
2. **"Tabel 3.2" muncul dua kali** (Analisis Isi Wawancara di 3.5.1 dan Rekapitulasi Kuesioner di 3.5.2) — tabel riset setelahnya jadi ikut bergeser.
3. **Gambar 3.9 tidak ada** — lompat dari Gambar 3.8 (Flowchart) ke Gambar 3.10 (Use Case).
4. Typo kecil di 3.6–3.7: "Fingsional" → "Fungsional", "Fungisonal" → "Fungsional", "Ssupervisor 2" → "Supervisor 2", "Obserfasi" → "Observasi" (3.4.1), "kenisi" → "teknisi" (3.4.2).

*(Sesuai arahan, catatan Kak Fadhil yang bukan soal aplikasi — hapus FGD, why-why, log Suggestion System,
sub-bab PO Urgent — tidak dimasukkan ke sini.)*

---

## Lampiran B — Pesan WhatsApp siap kirim

> Malam semuanya 🙏 Aku sudah review Bab 3 bagian **3.6 sampai bawah** sesuai pembagian Kak Fadhil. Fokus review-ku memastikan isi Bab 3 sinkron dengan aplikasi yang jalan di production sekarang, jadi temuan-temuamannya soal teknis:
>
> 1. Klaim **notifikasi email** di 3.7.1 & 3.7.4 dihapus dulu ya — fiturnya memang belum ada di aplikasi.
> 2. **BQ Summary** diganti jadi **Rekapan Pengajuan** (nama menu di aplikasi sekarang).
> 3. Daftar **menu per role** di 3.7.2 aku lengkapi sesuai aplikasi (Teknisi 5 menu, SPV2/Officer 5, SPV1 7, Manager 9).
> 4. **bcrypt → scrypt** di 3.7.3, dan status pengadaan di Tabel 3.9 disamakan dengan 8 status aplikasi.
> 5. Nomor sub-bab 3.7.2.3 yang hilang + rujukan "Tabel 3.14" yang salah sudah aku tandai.
>
> Lengkapnya (teks lama → teks baru per item) aku taruh di catatan ya, biar tinggal copas. Terima kasih! 🙌

---

*Bukti kode: `src/controllers/bqController.js` · `src/controllers/authController.js` · `src/middleware/loginRateLimit.js` · `src/utils/password.js` · `src/controllers/sparepartController.js` · `public/index.html`.*