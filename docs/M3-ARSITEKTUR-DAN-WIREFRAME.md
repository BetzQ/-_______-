# M3 — Finalisasi Arsitektur Website Hosting Mandiri & Mock-up/Wireframe

> **Peran:** Anggota 1 — Lead Developer / Architect (Avwan)
> **Dokumen ini:** tugas checklist M3 *"Finalisasi arsitektur website hosting mandiri & sediakan mock-up/wireframe awal."*
> **Status: SELESAI** — aplikasi sudah lebih dari mock-up: seluruh arsitektur **terimplementasi, ter-deploy, dan teruji**.
> Disusun agar Bab III (Metodologi & Perancangan Sistem — Kak Giren) dapat langsung selaras dengan produk.

---

## 1. Keputusan Arsitektur Final

Sistem **Micropage E-Sparepart** dikembangkan ulang dari sistem lama berbasis **Apps Script & Spreadsheet
(Fonko Gemini)** menjadi **aplikasi web hosting mandiri** dengan arsitektur tiga lapis (three-tier):

```
┌────────────────────────────────────────────────────────────────────┐
│  PRESENTASI (Client)                                               │
│  SPA satu halaman: public/index.html                               │
│  Tailwind CSS (CDN) · Chart.js · Lucide Icons                      │
│  RBAC: menu tampil sesuai role yang login                          │
└──────────────┬─────────────────────────────────────────────────────┘
               │  fetch() — JSON over HTTPS
┌──────────────▼─────────────────────────────────────────────────────┐
│  APLIKASI (Server)                                                 │
│  Node.js + Express (server.js)                                     │
│  REST API /api/* · Rate limiting login · scrypt password hashing   │
│  Host: Vercel (serverless) — https://e-sparepart-system-tau.vercel.app │
│  (fallback lokal: XAMPP + node server.js di localhost:3000)        │
└──────────────┬─────────────────────────────────────────────────────┘
               │  SQL (parameterized query)
┌──────────────▼─────────────────────────────────────────────────────┐
│  DATA (Database)                                                   │
│  4 tabel: users · spareparts · pengajuan_bq · pengajuan_log        │
│  Produksi: Supabase (PostgreSQL) · Lokal: MySQL (XAMPP)            │
└────────────────────────────────────────────────────────────────────┘
```

**Alasan keputusan (bisa dikutip di Bab III):**

| Aspek | Keputusan | Alasan |
|---|---|---|
| Bahasa/ runtime | JavaScript (Node.js 18+) | Satu bahasa untuk front-end & back-end, mudah dikerjakan sendirian |
| Framework server | Express.js | Ringan, pola REST API jelas, mudah di-host di Vercel |
| Database | Supabase (PostgreSQL) utama; MySQL lokal (XAMPP) untuk pengembangan | Gratis, terkelola, SQL standar; skema identik di keduanya |
| Tampilan | SPA + Tailwind CSS CDN | Tanpa build step, cepat dimuat, konsisten dark-UI |
| Grafik | Chart.js | Monthly Report butuh grafik bulanan interaktif |
| Autentikasi | Session-side + scrypt hash + rate limit | Password tidak pernah plaintext; brute-force dibatasi |
| Deployment | Vercel + variabel lingkungan (.env) | Akses publik untuk penguji tanpa instalasi |

---

## 2. Struktur Direktori Aplikasi

```
├── server.js                  # entry point Express + static hosting
├── vercel.json                # konfigurasi deployment
├── src/
│   ├── config/database.js     # pool koneksi (Supabase/PostgreSQL/MySQL)
│   ├── routes/                # api.js, authRoutes.js
│   ├── controllers/           # authController, bqController,
│   │                          # sparepartController, exportController
│   ├── middleware/            # loginRateLimit.js
│   └── utils/password.js      # scrypt hash & verify
├── public/
│   ├── index.html             # SPA aplikasi (login + dashboard + modals)
│   ├── qa-test.html           # harness uji fungsional
│   └── analisis-kelompok/     # halaman catatan kerja anggota
├── database/
│   ├── schema.sql             # skema MySQL (XAMPP)
│   ├── seed.sql               # data awal
│   ├── supabase_schema.sql    # skema PostgreSQL (produksi)
│   └── supabase_seed_full.sql # data lengkap produksi
├── tests/                     # UAT otomatis + screenshot
└── docs/evidence/             # bukti M3/M5/M6 (galeri, data, video)
```

---

## 3. Perancangan Data (4 Tabel)

### 3.1 `users` — pengguna & peran
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT PK AI | identitas user |
| username | VARCHAR(50) UNIQUE | dipakai login (contoh: `AAA`, `KSW`) |
| password | VARCHAR(255) | hash scrypt (upgrade otomatis dari plaintext lama) |
| role | VARCHAR(50) | teknisi / Supervisor 1 / Supervisor 2 / Officer / manager |
| name | VARCHAR(100) | nama tampilan |
| bqLink | TEXT NULL | tautan form BQ pribadi teknisi (warisan Apps Script) |
| supervisor_id | INT NULL FK→users.id | tim/ supervisor yang menaungi teknisi |

### 3.2 `spareparts` — master item + On Hand Stock + Critical Part
| Kolom | Tipe | Keterangan |
|---|---|---|
| item_code | VARCHAR(50) PK | kode item |
| deskripsi | VARCHAR(255) | nama barang |
| qty_on_hand | INT | stok fisik gudang (real-time) |
| min_stock / max_stock | INT | parameter min–max stock (pemicu reorder preventif) |
| is_critical | TINYINT(1) | 1 = masuk Critical Sparepart List |
| lokasi_rak | VARCHAR(50) | lokator rak gudang |

### 3.3 `pengajuan_bq` — transaksi Formulir Pengajuan Barang Digital
| Kolom | Tipe | Keterangan |
|---|---|---|
| no_registrasi | VARCHAR(50) PK | format `BQ-YYYYMMDD-xxxx` |
| user_id | FK→users | pengaju (teknisi) |
| item_code | FK→spareparts NULL | NULL bila jenis `jasa` |
| jenis_pengajuan | ENUM | sparepart / jasa |
| qty_diminta, uom | INT, VARCHAR | jumlah & satuan |
| spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran | TEXT/VARCHAR | parameter wajib agar pengajuan tidak "tidak komplit" |
| urgency | ENUM | Normal / Urgent |
| status_approval_spv | VARCHAR | Menunggu / Disetujui / Ditolak (tahap 1) |
| status_approval_manager | VARCHAR | Menunggu / Disetujui / Ditolak (tahap 2, khusus Urgent) |
| status_pengadaan | VARCHAR | BQ Baru / Proses PO / Pending / Barang Dikirim / Tiba di Gudang / Selesai |
| timestamp | TIMESTAMP | waktu pengajuan |

### 3.4 `pengajuan_log` — audit trail
Mencatat setiap perubahan status (siapa, kapan, aksi apa) → sumber fitur **Riwayat Approval**.

**Relasi (ERD):** `users (1) ──< pengajuan_bq >── (1) spareparts`; `users (1) ──< pengajuan_log >── (1) pengajuan_bq`.

---

## 4. Antarmuka API (REST)

| Endpoint | Method | Fungsi | Akses |
|---|---|---|---|
| `/api/login` | POST | autentikasi + profil & role | semua |
| `/api/spareparts` | GET | daftar On Hand Stock + lokator rak | semua |
| `/api/spareparts/summary` | GET | KPI ringkasan stok untuk dashboard | semua |
| `/api/spareparts/alert` | GET | item di bawah min-stock (defisit terbesar) | semua |
| `/api/pengajuan` | POST | buat pengajuan BQ baru (sparepart/jasa) | teknisi |
| `/api/pengajuan/all` | GET | monitoring & tabel approval | SPV/Officer/Manager |
| `/api/pengajuan/:no/status` | PUT | ubah status approval/pengadaan | SPV/Officer/Manager (sesuai tahap) |
| `/api/pengajuan/:no/log` | GET | riwayat approval (audit trail) | semua |
| `/api/pengajuan/summary` | GET | PR Summary | **Manager & Supervisor 1 saja** |
| `/api/pengajuan/bq-summary` | GET | BQ Summary seluruh pengajuan | semua |
| `/api/reports/monthly` | GET | data grafik Monthly Report | SPV1 & Manager |
| `/api/export/xlsx` | POST | ekspor data ke Excel | semua |

---

## 5. Matriks Hak Akses (RBAC) — Hasil Uji Nyata

Menu yang benar-benar tampil per peran (terverifikasi otomatis, lihat `docs/evidence/hasil-produk/`):

| Menu | Teknisi | Supervisor 1 | Supervisor 2 | Officer | Manager |
|---|:---:|:---:|:---:|:---:|:---:|
| Form BQ (pengajuan) | ✔ | – | – | – | – |
| On Hand Stock | ✔ | ✔ | ✔ | ✔ | ✔ |
| BQ Summary | ✔ | ✔ | ✔ | ✔ | ✔ |
| Approval BQ (tahap SPV) | – | ✔ | ✔ | ✔ | ✔ |
| Approval Urgent (tahap MGR) | – | – | – | – | ✔ |
| PR Summary | – | ✔ | – | – | ✔ |
| Monthly Report | – | ✔ | – | – | ✔ |
| Critical Part List | – | ✔ | ✔ | ✔ | ✔ |
| Ubah status pengadaan | – | – | – | ✔ | ✔ |

Bukti proteksi (uji otomatis 26 Sep 2026): PR Summary mengembalikan **403 Forbidden** untuk
Teknisi, Supervisor 2, dan Officer — hanya Manager & Supervisor 1 yang diizinkan, sesuai rancangan.

---

## 6. Mock-up / Wireframe

Wireframe tidak lagi berupa gambar konsep — **produk akhirnya sudah jadi**. Galeri mock-up interaktif
(dapat dibuka di browser) tersedia di:

- **`docs/evidence/hasil-produk/galeri-mockup.html`** — 38 tangkapan layar seluruh menu × semua peran, dikelompokkan per bagian.

Wireframe per layar (untuk dipetakan ke use case / activity diagram Bab III):

| Layar | Elemen utama |
|---|---|
| Login | kartu tengah, input username/password, tombol Masuk |
| Dashboard | header (nama + badge role), KPI stok (total/kritis/menipis/kosong), grid menu sesuai role, tombol logout |
| Modal On Hand Stock | tabel: item code, deskripsi, qty on-hand, min, lokator rak; tombol export Excel |
| Modal Form BQ | autocomplete item code, qty, uom, purpose, no EJO, mesin/area, merk, spesifikasi, urgensi, kirim |
| Modal Monitoring/Approval | pencarian, filter status, tabel pengajuan, badge approval SPV & MGR, tombol Approve/Reject/Riwayat, refresh 20 detik |
| Modal BQ Summary | rekap seluruh pengajuan + status terkini |
| Modal PR Summary | daftar pengajuan menunggu approval SPV |
| Modal Monthly Report | grafik Chart.js tren bulanan + export |
| Modal Riwayat | audit trail per pengajuan |

---

## 7. Pemetaan ke Bab III (untuk Kak Giren)

Agar diagram di Bab III konsisten dengan produk, gunakan rujukan berikut:

- **DFD Level 0 (Context):** Teknisi/SPV/Officer/Manager → [Sistem BQ Digital] → data dari master sparepart; keluaran: status pengajuan, laporan.
- **DFD Level 1 proses:** (1) Autentikasi role; (2) Cek stok; (3) Buat pengajuan BQ; (4) Approval tahap SPV (Normal/Urgent); (5) Approval tahap Manager (khusus Urgent); (6) Update status pengadaan; (7) BQ/PR Summary & Monthly Report; (8) Ekspor Excel. Semua proses menulis ke `pengajuan_log`.
- **Use case diagram:** aktor = Teknisi, Supervisor 1/2, Officer, Manager; use case lihat §5 matriks RBAC; relasi «include» login untuk semua.
- **Activity diagram alur utama:** cek stok → (ada? ambil : buat BQ) → approval SPV → (Urgent? approval MGR) → eksekusi pengadaan → barang tiba → selesai. Skema persis kolom `status_approval_spv`/`status_approval_manager`/`status_pengadaan` di §3.3.
- **Flowchart data:** mengikuti endpoint §4.
- **ERD:** 4 tabel §3 dengan relasinya.

---

## 8. Penutup Checklist M3

| Item checklist M3 (Anggota 1) | Status |
|---|---|
| Finalisasi arsitektur website hosting mandiri | ✅ Selesai (dokumen ini, §1–§4) |
| Sediakan mock-up/wireframe awal | ✅ Selesai (galeri 38 layar + wireframe per layar §6) |
| (Bonus) Aplikasi ter-deploy & dapat diakses penguji | ✅ https://e-sparepart-system-tau.vercel.app |
| (Bonus) RBAC terverifikasi per peran | ✅ §5 |

*Dokumen disusun otomatis terintegrasi dengan aplikasi berjalan — 26 September 2026.*
