# MATERI TEKNIS BAB 3 — dari Avwan (Anggota 1 / Lead Developer)

> **Untuk:** Kak Giren (System Analyst — Bab III, DFD/UML/ERD)
> **Peran saya:** Lead Developer / Architect — perancangan arsitektur, kode, dan pengujian produk.
> **Cara pakai:** blok di bawah bisa langsung **copy-paste** ke dokumen Word. Tabel & bullet tinggal
> diformat font Times New Roman 12 spasi 1,5. Bagian 4 adalah catatan revisi — **tidak** ikut
> disalin ke laporan, cuma untuk koreksi isi.

---

## 0. Ringkasan Singkat (bisa dipakai sebagai pembuka sub-bab 3.7)

* Sistem Micropage E-Sparepart dibangun ulang dari sistem lama berbasis **Google Apps Script +
  Spreadsheet** menjadi **aplikasi web hosting mandiri** (self-hosted).
* Alasan: Apps Script tidak punya hak akses per jabatan (RBAC), tidak ada jejak audit
  (audit trail), dan tampilan di browser sering tidak sinkron dengan data di server.
* Arsitektur: **3 lapis** (presentasi – aplikasi – data), satu bahasa (JavaScript).
* Deploy ke **Vercel** + database **Supabase (PostgreSQL)** → bisa dibuka penguji tanpa instalasi.
* Pengujian otomatis: **114 skenario, 114 lulus, 0 gagal** di sistem production.

---

# BAGIAN 1 — PROSES PERANCANGAN

## 1.1 Alur kerja yang dijadikan acuan

1. Teknisi cek stok dulu (On-Hand Stock + lokasi rak).
2. Kalau stok **cukup** → ambil langsung dari gudang.
3. Kalau stok **kurang/tidak ada** → buat **Form BQ Digital** (Formulir Pengajuan Barang).
4. Pengajuan masuk ke **Supervisor** untuk persetujuan tahap 1.
5. Kalau Supervisor setujui dan menilai urgency-nya **Urgent** → naik ke **Manager** untuk tahap 2.
6. Officer + Manager jalankan **pipeline pengadaan** sampai barang tiba di gudang.
7. Semua perubahan status tercatat di **Riwayat Approval** + masuk ke laporan bulanan.

## 1.2 Arsitektur 3 lapis (three-tier)

```
[PRESENTASI / CLIENT]
  SPA 1 halaman: public/index.html
  Tailwind CSS (CDN) · Chart.js · Lucide Icons
  Menu otomatis menyesuaikan hak akses (RBAC)
        │  fetch() JSON over HTTPS
        ▼
[APLIKASI / SERVER]
  Node.js + Express (server.js) — REST API /api/*
  Rate limiting login · password hash scrypt
  Host: Vercel (serverless) — e-sparepart-system-tau.vercel.app
  Fallback lokal: XAMPP + `node server.js` di localhost:3000
        │  SQL (parameterized query)
        ▼
[DATA / DATABASE]
  4 tabel: users · spareparts · pengajuan_bq · pengajuan_log
  Produksi: Supabase (PostgreSQL) · Lokal: MySQL (XAMPP)
```

**Terminologi singkat biar aman saat presentasi:**

* **REST API** — jalur komunikasi antar program (browser ⇄ server) lewat alamat URL.
* **SPA (Single Page Application)** — satu halaman web; berganti menu tidak reload halaman.
* **RBAC (Role-Based Access Control)** — pembatasan hak akses sesuai jabatan.
* **Parameterized query** — cara menulis query SQL dengan "slot" data terpisah, sehingga aman dari
  serangan injeksi SQL.
* **Serverless** — server yang dinyalakan otomatis oleh penyedia hosting, tanpa perlu menyewa
  server fisik.

## 1.3 Alur persetujuan (approval) 2 tahap — inti dari perancangan

Sistem memakai **2 tahap persetujuan**, dipisahkan lewat dua kolom status yang berbeda:

| Tahap | Siapa | Field status | Keterangan |
|---|---|---|---|
| 1 | Supervisor 1 / Supervisor 2 / Officer | `status_approval_spv` | Wajib untuk **semua** pengajuan |
| 2 | Manager | `status_approval_manager` | Keputusan **final**, terutama Urgent |

**Aturan yang ditegakkan di server (bukan hanya di tampilan):**

1. **Urutan wajib.** Manager tidak bisa menyetujui sebelum Supervisor menyetujui.
   - Aturan di `bqController.js`: *"Manager hanya bisa menyetujui setelah Supervisor menyetujui
     pengajuan ini (SPV = Disetujui)."* → kalau dilanggar, server membalas `400`.
2. **Pemisahan hak akses tiap field.**
   - Supervisor → boleh ubah `status_approval_spv` saja.
   - Manager → boleh ubah `status_approval_spv` + `status_approval_manager`.
   - Officer → **tidak boleh** approval, hanya boleh ubah `status_pengadaan`.
   - Teknisi → tidak boleh mengubah status apa pun.
   - Pelanggaran → `403 Forbidden`.
3. **Urgensi ditetapkan atasan, bukan teknisi.** Teknisi saat submit hanya boleh `Normal`;
   Supervisor/Manager yang bisa menaikkan menjadi `Urgent`.
4. **Nilai status dibatasi** oleh *whitelist* (daftar putih) di server:
   `Menunggu`, `Disetujui`, `Ditolak`. Alias `approved`/`rejected`/`waiting` diterima lalu
   dinormalkan ke nilai baku.
5. **Audit trail otomatis.** Setiap field yang benar-benar berubah ditulis ke tabel
   `pengajuan_log` (siapa, kapan, dari nilai apa ke nilai apa). Kegagalan pencatatan log tidak
   menggagalkan pembaruan status.

## 1.4 Pipeline status pengadaan

`BQ Baru` → `Pending` → `Proses PO` → `PO Open` → `Mencari Penawaran` → `Barang Dikirim`
→ `Tiba di Gudang` → `Selesai`

* Daftar ini **wajib sinkron** dengan *check constraint* (aturan nilai yang diizinkan) di
  database. Kalau tidak, nilai yang sah akan ditolak.
* Yang boleh mengubah: **Officer** dan **Manager** saja.

## 1.5 Sinkronisasi data sparepart

* Sumber data: file Excel mentah departemen (`Raw Data CP/`) — 3.022 item + 1.500-an transaksi.
* Alur sinkronisasi dibuat **bertahap (7 langkah ETL — Extract, Transform, Load = ambil, rapikan,
  simpan)** supaya tidak menimpa data secara membuta tuli:

| # | Sumber file | Yang diimpor |
|---|---|---|
| 1 | `All Item Code on Going.xlsx` | Master data sparepart (kode, deskripsi) |
| 2 | `Critical Part (1).xlsx` | `min_stock`, `max_stock`, `is_critical` |
| 3 | `On Hand On Going.xlsx` | `qty_on_hand`, `lokasi_rak` (lokasi rak ikut diimpor) |
| 4 | 17 file `Form BQ Testing *.xlsx` | Transaksi pengajuan + kelengkapan formulir |
| 5 | `BQ On Going.xlsx` | Pengajuan berjalan |
| 6 | `BQ Summary (2).xlsx` | Rekap pengajuan |
| 7 | `Database Approval SPV BQ Testing.xlsx` | *Enrichment*: update status approval SPV |

* Mapping status file Excel (`Approve`/`Reject`/`Waiting`) → nilai baku sistem
  (`Disetujui`/`Ditolak`/`Menunggu`).
* Script bersifat **idempotent** (aman diulang) — hanya baris yang ada di file yang di-update.
* Approval Manager disinkronkan terpisah lewat `scripts/syncApprovalManager.js` (bisa `--dry`
  untuk pratinjau dulu).
* Data lebih dulu dibersihkan dan diseragamkan sebelum disimpan: baris kosong, tanggal tidak
  valid, dan nama sheet yang tidak seragam.

## 1.6 Perancangan hak akses (RBAC) — matriks yang sudah diuji

| Menu | Teknisi | SPV 1 | SPV 2 | Officer | Manager |
|---|:---:|:---:|:---:|:---:|:---:|
| Form BQ (pengajuan) | ✔ | – | – | – | – |
| On Hand Stock | ✔ | ✔ | ✔ | ✔ | ✔ |
| BQ Summary / Rekapan | ✔ | ✔ | ✔ | ✔ | ✔ |
| Approval tahap SPV | – | ✔ | ✔ | ✔ | ✔ |
| Approval tahap Manager | – | – | – | – | ✔ |
| PR Summary | – | ✔ | – | – | ✔ |
| Monthly Report | – | ✔ | – | – | ✔ |
| Critical Part List | – | ✔ | ✔ | ✔ | ✔ |
| Ubah status pengadaan | – | – | – | ✔ | ✔ |

## 1.7 Perancangan basis data (ERD)

| Tabel | Isi | Relasi |
|---|---|---|
| `users` | id, username, password (hash), role, name, `supervisor_id` | Supervisor → teknisi bawahan |
| `spareparts` | item_code (PK), deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak | — |
| `pengajuan_bq` | no_registrasi (PK), user_id, item_code, jenis_pengajuan, qty, uom, spesifikasi, purpose, no_ejo, mesin, merk, referensi, urgency, status SPV, status Manager, status pengadaan | `user_id` → users; `item_code` → spareparts |
| `pengajuan_log` | no_registrasi, actor, field, old_value, new_value, created_at | → pengajuan_bq (audit trail) |

Tambahan: tabel `catatan_checks` & `catatan_log` (untuk halaman catatan anggota tim).

* Relasi: `users (1) ──< pengajuan_bq >── (1) spareparts`
  dan `users (1) ──< pengajuan_log >── (1) pengajuan_bq`.
* 10+ *index* (indeks) dibuat agar tabel besar (1.500 baris) tetap cepat.

## 1.8 Kaitan dengan data Suggestion System (before–after)

File Suggestion System ada di Google Drive (tidak ada di repo ini), jadi **angka before–after
mohon Kak Giren ambil langsung dari file tersebut.** Agar mudah dipasangkan, ini tabel
sebelum–sesudah versi teknis yang datanya sudah ada di repo:

| Aspek | Sebelum (manual / Apps Script) | Sesudah (Micropage E-Sparepart) |
|---|---|---|
| Kelengkapan pengajuan | sering tidak komplit | field wajib divalidasi sistem |
| Monitoring | e-mail / pesan singkat | dashboard real-time, auto-refresh 20 detik |
| Persetujuan | manual, tidak terlacak | 2 tahap berjenjang + riwayat audit |
| Hak akses | semua orang bisa lihat semua | RBAC 5 peran, menu berbeda per jabatan |
| Critical part | tidak ada daftar terpusat | 210 item terpusat + alert stok minimum |
| Laporan bulanan | rekap manual | otomatis + grafik + ekspor Excel |
| Jejak audit | tidak ada | tabel audit trail per perubahan status |

---

# BAGIAN 2 — IMPLEMENTASI (Teknologi yang Dipakai)

## 2.1 Ringkasan tech stack

| Lapisan | Teknologi | Versi |
|---|---|---|
| Bahasa | JavaScript (satu bahasa, front & back) | ES6+ / Node.js 18+ |
| Front-end | HTML5 + Tailwind CSS (CDN) + Chart.js + Lucide Icons | — |
| Back-end | Node.js + Express.js | Express 5.2 |
| Protokol | REST API + JSON | — |
| Database produksi | Supabase (PostgreSQL), koneksi via `pg` | — |
| Database lokal | MySQL (XAMPP), koneksi via `mysql2` | — |
| Autentikasi | `sessionStorage` + password hash **scrypt** + rate limit | — |
| Deployment | Vercel (serverless, `@vercel/node`) | — |
| Testing | Puppeteer (Chrome headless) | 25.x |
| Impor data | `xlsx` (Excel) | — |
| Backup/legacy | `googleapis`, `mysql2`, `cors`, `body-parser`, `dotenv` | — |

## 2.2 Front-end

* **Satu berkas:** `public/index.html` (SPA). Tidak ada proses *build* — cukup `npm install` lalu jalan.
* **Tailwind CSS via CDN** — tata letak responsif otomatis (1 kolom di HP, 3 di desktop).
* **Chart.js** — grafik tren bulanan di Monthly Report.
* **Lucide Icons** — ikon menu.
* **Vanilla JavaScript** (tanpa React/Vue) → ringan, mudah di-host, tanpa proses *build*.
* Sesi login disimpan di **`sessionStorage`** (bukan `localStorage`) → otomatis terhapus saat tab ditutup.
* **Keamanan tampilan:** password `type="password"` (disembunyikan), link luar pakai
  `rel="noopener noreferrer"`, validasi input kosong sebelum request dikirim.

## 2.3 Back-end

* Entry point: `server.js` (Express). Server berjalan dua mode secara otomatis:
  * Di **Vercel** → diekspor sebagai Serverless Function.
  * Di **lokal** → `app.listen()` di port 3000.
* Struktur modular (pola MVC sederhana):
  * `src/config/` — konfigurasi koneksi database.
  * `src/routes/` — daftar endpoint.
  * `src/controllers/` — logika bisnis (auth, BQ, sparepart, user, ekspor, catatan).
  * `src/middleware/` — pembatas percobaan login.
  * `src/utils/` — utilitas password.
* Total **21 endpoint REST** (login, spareparts, pengajuan, approval, log, summary, report, export,
  register user, log login/aktivitas).
* **Keamanan back-end:**
  * Password di-*hash* dengan **scrypt** (algoritma pengaman password bawaan Node.js, pakai
    *salt* acak). Password lama yang masih teks biasa otomatis di-*upgrade* saat login.
  * **Rate limit login:** maksimal **5 kali gagal**, lalu terkunci **15 menit** (kunci dihitung per
    IP + username, jadi satu akun yang diserang tidak mengganggu yang lain).
  * Seluruh query SQL memakai **parameterized query** (anti injeksi SQL).
  * Endpoint sensitif (PR Summary) ditolak dengan **403 Forbidden** bila diakses role tidak berhak.

## 2.4 Database

* **Produksi:** Supabase (PostgreSQL) — terhubung lewat `DATABASE_URL` pada *environment variable*.
  Jenis *managed* (dikelola penyedia), sehingga tidak perlu server database sendiri.
* **Lokal (fallback):** MySQL di XAMPP, basis data `e_sparepart`.
* Skema ditulis **dual**: `database/schema.sql` (MySQL) & `database/supabase_schema.sql`
  (PostgreSQL) — strukturnya identik, supaya mudah dipindah.
* Isi database production (terverifikasi per 3 Okt 2026):
  * **3.022** item sparepart, total stok **11.932** unit
  * **210** item Critical Part, **356** item di bawah minimum, **1.887** item stok habis
  * **1.586** transaksi pengajuan (naik dari 1.535 karena pengujian otomatis 3 Okt)

## 2.5 Deployment ke production (Vercel)

1. Kode di-*push* ke repositori.
2. `vercel.json` menentukan *build* memakai runtime `@vercel/node`, dan semua request diarahkan ke
   `server.js`.
3. Kredensial & koneksi database disimpan sebagai **environment variable** di Vercel (bukan di
   dalam kode) → aman, tidak ikut ter-*commit*.
4. Hasil: aplikasi hidup di **`https://e-sparepart-system-tau.vercel.app`** (HTTPS, sertifikat
   otomatis).
5. Penguji cukup membuka link tersebut — **tanpa instalasi apa pun** di komputernya.
6. Tersedia jalur fallback lokal: `npm install` → `node server.js` → `localhost:3000`.

---

# BAGIAN 3 — PENGUJIAN DAN EVALUASI

## 3.1 Metode pengujian

| Metode | Penjelasan singkat |
|---|---|
| **Black Box Testing** | Menguji fungsi dari luar (sisi pengguna) tanpa membaca kode. 114 skenario otomatis + 86 skenario manual terpandu. |
| **Inspeksi Kode Statis** | Meninjau kode frontend mencari bug yang tidak terlihat saat pengujian biasa. |
| **UAT (User Acceptance Test)** | Simulasi alur kerja nyata oleh 5 peran (Teknisi, SPV1, SPV2, Officer, Manager). |
| **Uji Visual** | Menguji tampilan di browser secara otomatis pada 16 skenario dashboard. |

## 3.2 Rekap hasil eksekusi script pengujian otomatis

Tabel di bawah bukan angka manual — hasil eksekusi script QA yang baru saja dijalankan langsung
ke **sistem production**.

| Item | Nilai |
|---|---|
| Tanggal eksekusi | 3 Oktober 2026 |
| Target | `https://e-sparepart-system-tau.vercel.app` (production) |
| Total skenario | **114** |
| **Lulus** | **114** |
| **Gagal** | **0** |
| **Dilewat** | **0** |
| Durasi total | ± 218 detik (± 3,6 menit) |
| Tool | Puppeteer (Chrome headless) via `run-qa-test.js` → `public/qa-test.html` |

**Rincian lulus per kelompok uji:**

| Kelompok | Uji | Lulus | Isi |
|---|---:|---:|---|
| APP | 21 | 21 | Alur approval, PR Summary, filter, paginasi, agregasi |
| AUTH | 8 | 8 | Login, sesi, rate limit, hash password |
| USR | 17 | 17 | Registrasi, approval user, log aktivitas |
| RBAC | 8 | 8 | Pembatasan hak akses tiap peran (termasuk 403) |
| FORM | 6 | 6 | Validasi Form BQ Digital (wajib terisi) |
| UI | 22 | 22 | Tampilan di browser: dashboard, modal, grafik, layout rak |
| E2E | 8 | 8 | Alur ujung ke ujung nyata (tulis data) |
| EXP | 5 | 5 | Ekspor data ke Excel |
| RAK | 6 | 6 | Pemetaan lokasi rak gudang dari kolom Lokator |
| MON | 4 | 4 | Monitoring & definisi status |
| NFR | 4 | 4 | Non-fungsional (performa, respons, koneksi) |
| REP | 3 | 3 | Monthly Report & konsistensi angka |
| STOK | 2 | 2 | KPI stok (total, kritis, rendah, habis) |
| **TOTAL** | **114** | **114** | **0 gagal, 0 dilewat** |

**Berdasarkan prioritas (tingkat kepentingan):**

| Prioritas | Jumlah | Arti |
|---|---:|---|
| P0 | 53 | inti sistem — wajib 100% lulus |
| P1 | 57 | fitur pendukung |
| P2 | 4 | pelengkap / nice-to-have |

**Berdasarkan jenis eksekusi:**

| Jenis | Jumlah | Keterangan |
|---|---:|---|
| Read-only | 70 | hanya membaca data, tidak mengubah apa pun |
| Tulis data | 22 | membuat pengajuan & user uji (menulis ke DB production) |
| UI/browser | 22 | diklik langsung di browser sungguhan |

## 3.3 Pengujian manual & UAT (melengkapi uji otomatis)

| Skenario | Hasil |
|---|---|
| Login 5 peran + tampilan menu RBAC | Lulus (5/5) |
| Proteksi PR Summary (3 role ditolak 403, 2 diizinkan) | Lulus |
| Pembuatan pengajuan sparepart (status 201) | Lulus |
| Approval SPV → Manager (ujung ke ujung) | Lulus |
| Audit trail / Riwayat Approval | Lulus |
| Ekspor Excel | Lulus |
| QA Tahap 1 — uji API & integrasi | **16/16 lulus** |
| QA Tahap 2 — inspeksi statis frontend | **14/14 lulus** |
| UAT visual | 16 tangkapan layar, semua lulus |

**Bug yang berhasil ditemukan & diperbaiki (bukti pendekatan sistematis):**

1. Pencocokan role Supervisor pakai `=== 'supervisor'`, padahal database menyimpan
   `"Supervisor 1"` / `"Supervisor 2"` → Supervisor tidak melihat menu. Diperbaiki ke
   `startsWith('supervisor')`.
2. Logika tautan Google Sheets salah (URL non-spreadsheet terduplikasi). Diperbaiki.
3. Role "Officer" belum ditangani di frontend → mendapat layar kosong. Diperbaiki.
4. Subjudul modal stok menulis "database lokal" padahal production di server cloud. Diperbaiki
   (commit `386cdbf`).

## 3.4 Bukti alur ujung ke ujung (end-to-end)

Satu pengajuan nyata terbukti melewati **seluruh** tahapan:

`BQ-20260926-2814` (EJO-DEMO-402106, item kritis `P-50717-00`, kategori **Urgent**)

`Teknisi AAA buat pengajuan` → `Supervisor 1 (INN) setujui` → `Manager (KSW) setujui`
→ `status pengadaan = BQ Baru` → `tercatat di Riwayat Approval & Monthly Report`

* Semua tahap punya tangkapan layar (9 berkas `06-alur-*.png`).
* Video demo 1 menit 57 detik membuktikan transaksi kedua dengan alur sama.

## 3.5 Evaluasi sebelum – sesudah

| Aspek | Sebelum | Sesudah | Sumber angka |
|---|---|---|---|
| Jumlah data sparepart terpantau | tersebar di beberapa file Excel | 3.022 item terpusat + lokator rak | API production |
| Critical Part List | tidak ada | 210 item + alert 356 item di bawah minimum | API production |
| Persetujuan | manual, tidak terlacak | 2 tahap + audit trail setiap perubahan | `pengajuan_log` |
| Monitoring | e-mail / pesan | dashboard real-time (auto-refresh 20 detik) | UI production |
| Downtime Mesin Cartoning Marchesini | 305 menit (akumulasi historis) | target turun lewat *preventive replenishment* | Riset awal |

## 3.6 Catatan keterbatasan (siap kalau ditanya dosen)

1. **Notifikasi** — persetujuan masih dicek manual di dashboard; rencana: notifikasi e-mail/WhatsApp.
2. **Integrasi Looker Studio** — laporan lama masih dipakai manajemen; Monthly Report sekarang
   digambar di dalam web (Chart.js) agar angka pasti sama dengan sistem.
3. **Aplikasi mobile** — tampilan sudah responsif, tapi belum ada aplikasi khusus HP.
4. **Pemetaan `supervisor_id`** — sebagian teknisi belum terhubung ke Supervisor, jadi filter
   "Tim Saya" belum 100% tajam.
5. **Lokasi rak** — 74% sparepart (2.243 dari 3.022) belum punya lokator rak; sistem sudah
   menyediakan tab "Belum Ada Lokasi" untuk gradual filling.

---

# BAGIAN 4 — CATATAN REVISI untuk Kak Giren (jangan disalin ke laporan)

Draft Bab 3 yang sudah ada masih menyebut beberapa hal **yang sudah tidak sesuai** dengan sistem
sekarang. Mohon dikoreksi dulu:

| Sub-bab | Draft lama | Kenyataan / yang benar |
|---|---|---|
| 3.7.3 & 3.7.5 | "Back-End: Google Apps Script + Google Sheets" | Sudah diganti **Node.js + Express + Supabase (PostgreSQL)**. |
| 3.7.3 & 3.7.4 | "Monthly Report terintegrasi Looker Studio" | Grafik sekarang **di dalam web (Chart.js)**. Looker Studio hanya tautan laporan lama. |
| 3.7.2.3 (ERD) | Tabel: `FORM_BQ`, `DETAIL_BQ`, `STOCK_GUDANG_CRITICAL`, `APPROVAL_LOG` | Tabel sebenarnya: **`users`, `spareparts`, `pengajuan_bq`, `pengajuan_log`**. |
| 3.7.2.3 | `status_approval` Enum: `Pending SPV/Pending Manager/Full Approved/Rejected` | Enum sebenarnya ada **dua kolom terpisah**: `status_approval_spv` & `status_approval_manager` (Menunggu/Disetujui/Ditolak), plus `status_pengadaan` (8 status). |
| 3.7.2.4 | Menu Teknisi: "BQ Personal, BQ Monitoring, On Hand Stock" | Teknisi sekarang menu: **Form BQ, On Hand Stock, BQ Summary** (tanpa BQ Monitoring/PR Summary). |
| 3.7.4 | "Keberhasilan routing notifikasi e-mail" | **Belum ada** notifikasi e-mail (lihat keterbatasan 3.6). |

> **Saran:** gambar DFD/UML yang sudah ada di draft Bab 3 tetap bisa dipakai. Yang perlu
> diselaraskan hanya nama tabel, nama status, dan klaim teknologi.

---

## LAMPIRAN — Lokasi Bukti (kalau perlu dilampirkan)

| Kebutuhan | Lokasi file |
|---|---|
| Gambar screenshot 5 peran (semua menu) | `docs/evidence/hasil-produk/` (38 PNG) |
| Screenshot alur approval end-to-end | `docs/evidence/hasil-produk/06-alur-*.png` |
| Galeri mockup interaktif (bisa dibuka di browser) | `docs/evidence/hasil-produk/galeri-mockup.html` |
| Data & angka siap tempel ke Bab IV | `docs/evidence/data/ringkasan-bab-iv.md` + `hasil-produk-stats.json` |
| Video demo 1 mnt 57 dtk | `docs/evidence/video/demo-aplikasi.mp4` |
| Rincian pengujian manual 86 skenario | `GUIDES_TEST_MANUAL_QA.md` |
| Laporan QA Tahap 1 & 2 | `LAPORAN_QA_TAHAP_1.md`, `LAPORAN_QA_TAHAP_2.md` |
| Dokumen arsitektur lengkap | `docs/M3-ARSITEKTUR-DAN-WIREFRAME.md` |
| Laporan evaluasi produk | `docs/M8-EVALUASI-PRODUK.md` |
| Link demo + akun uji | `README_SUBMISSION.md` |

**Akun uji (untuk UAT dosen):**

| Peran | Username | Password |
|---|---|---|
| Teknisi | `AAA` | `04AAA10` |
| Supervisor 1 | `INN` | `30INN11` |
| Supervisor 2 | `KAA` | `KAA1910` |
| Officer | `ANS` | `ANS1805` |
| Manager | `KSW` | `01KSW10` |

---

## Pertanyaan yang perlu dikonfirmasi ke Kak Fadhil

1. File **Suggestion System** belum ada di repo — bisa minta tautan/filenya agar tabel
   before–after di §1.8 bisa diisi dengan angka aslinya?
2. Angka **kecepatan persetujuan** (hari) sebelum & sesudah — ada datanya dari observasi/
   wawancara? Saya belum punya angka pembanding yang terukur.
3. Klaim **penurunan jam downtime** — untuk saat ini sistem baru *go-live*, jadi angka
   *"sebelum = 305 menit, sesudah = …"* belum bisa diisi. Boleh dipakai sebagai **target**, bukan
   hasil.
4. Berapa lama sistem sudah dipakai di lapangan (minggu/bulan) sampai pengujian?

---

*Dokumen ini disusun oleh Avwan (Anggota 1 — Lead Developer / Architect) sebagai bahan Bab III.
Tanggal: 3 Oktober 2026.*
