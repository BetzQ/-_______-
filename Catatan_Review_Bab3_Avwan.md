# Catatan Review Bab 3 — dari Avwan ( buat Kak Giren )

Singkat aja, ini contekan fakta teknis biar nggak salah nulis Bab 3.
Kalau butuh versi panjang/tabel lengkap → ada di `Draft_Teknis_Bab3_Avwan.md`.

---

## 1. Perancangan

**Bentuk web-nya**
- Web app, bukan desktop. Tipenya: SPA (Single Page Application) — 1 halaman doang, ganti menu ga reload.
- Arsitektur 3 lapis (three-tier):
  - Client (browser) → Tailwind CSS + Chart.js + Vanilla JS
  - Server → Node.js + Express, REST API `/api/*`
  - Database → PostgreSQL (Supabase)
- Modular, MVC-ish: `routes` → `controllers` → `config`/`utils`

**Approval 2 tahap (ini yang paling sering keliru digambar)**
- Ada **DUA kolom status terpisah**, bukan satu:
  - `status_approval_spv` → tahap 1, oleh **Supervisor**
  - `status_approval_manager` → tahap 2, oleh **Manager**
- Urutan itu **dipaksa server**: Manager gabisa approve sebelum SPV approve. Kalau dilanggar → error 400.
- Beda role:
  - Teknisi → ga boleh ubah status apa pun
  - Supervisor → ubah `status_approval_spv` doang
  - Officer → **nggak boleh approval**, cuma ubah `status_pengadaan`
  - Manager → boleh keduanya + ubah `status_pengadaan`
- **Urgensi (Normal/Urgent) ditetapkan atasan**, bukan teknisi pas submit.
- Officer **bukan** approver. Kalau di diagram digambar jadi approval tahap 1, itu salah.
- Semua perubahan status otomatis ke-table `pengajuan_log` (audit trail: siapa, kapan, dari → ke).

**Pipeline status pengadaan** (8 status, urut)
`BQ Baru` → `Pending` → `Proses PO` → `PO Open` → `Mencari Penawaran` → `Barang Dikirim` → `Tiba di Gudang` → `Selesai`
- Yang boleh geser: Officer + Manager.

**Sinkronisasi data**
- Data masuk dari file Excel mentah departemen (`Raw Data CP/`).
- Diimpor bertahap 7 langkah (bukan sekali import) — master item dulu, critical part, on hand, baru transaksi.
- Yang sinkron: master sparepart, `min_stock`/`max_stock`/`is_critical`, `qty_on_hand` + `lokasi_rak`, transaksi pengajuan, dan status approval SPV.
- Status dari Excel (`Approve`/`Reject`) dipemapin ke nilai sistem (`Disetujui`/`Ditolak`).
- Script designed **idempotent** → aman dijalankan ulang, ga dobel-import.
- Ada juga importer lokasi rak yg parser-nya layered, soalnya format `Lokator` di data asli emberek:
  `A-4-15B` → rak A baris 4 kolom 15B · `M3` → ringkas · `G-3-7 dan G-3-8` → satu item multi-lokasi · `Ruang Filter` → zona · `Not Located` → masuk tab "Belum Ada Lokasi".

**Struktur data (penting buat ERD)**
- Cuma **4 tabel utama**: `users`, `spareparts`, `pengajuan_bq`, `pengajuan_log`.
- Plus 2 tabel kecil: `catatan_checks`, `catatan_log`.
- `users.supervisor_id` → relasi Supervisor ↔ teknisi bawahan (dipakai filter "Tim Saya").

---

## 2. Implementasi

- **Bahasa:** JavaScript, satu buat front-end + back-end. HTML5/CSS buat tampilan.
- **Front-end:** Tailwind CSS (CDN), Chart.js (grafik), Lucide (ikon). Vanilla JS — **nggak pakai React/Vue**. Nggak ada proses build.
- **Back-end:** Node.js 18+ + Express.js (REST API, ~21 endpoint).
- **Database:** Supabase / PostgreSQL (produksi). MySQL XAMPP cuma fallback lokal. Skema ditulis dual.
- **Hosting:** Vercel (serverless) → `https://e-sparepart-system-tau.vercel.app`
  - `vercel.json` nunjukin semua request ke `server.js`, runtime `@vercel/node`
  - Kredensial DB disimpan sebagai env var di Vercel, bukan di dalam kode
  - Penguji tinggal buka link, **nggak perlu instalasi apa pun**
- **Auth:** login → session disimpan di `sessionStorage` (auto hilang pas tab ditutup)
- **Keamanan:**
  - Password di-hash **scrypt** (+ auto-upgrade password lama yg masih plaintext)
  - Rate limit login: max **5x gagal → kunci 15 menit** (kunci per IP+username)
  - Semua query SQL pakai parameterized query (anti SQL injection)
  - Menu/PR Summary yang ga rightful → **403 Forbidden**

---

## 3. Pengujian & Evaluasi

**Hasil QA otomatis — ini angka real, bukan estimasi**
- Dijalankan langsung ke **sistem production** (Vercel), 3 Okt 2026.
- **114 / 114 skenario PASS — 0 gagal, 0 dilewat.**
- Durasi ±3,6 menit. Tool: Puppeteer (Chrome headless), via `public/qa-test.html`.
- Breakdown kelompok: UI 22 · APP 21 · USR 17 · AUTH 8 · RBAC 8 · E2E 8 · FORM 6 · RAK 6 · EXP 5 · MON 4 · NFR 4 · REP 3 · STOK 2
- 70 read-only · 22 tulis-data · 22 klik langsung di browser
- Prioritas: P0 53 · P1 57 · P2 4 — semuanya lulus, termasuk P0.

**Pengujian manual pelengkap**
- QA Tahap 1: **16/16 lulus**
- QA Tahap 2 (inspeksi kode statis): **14/14 lulus**
- UAT visual: 16 screenshot, semua lulus

**Bukti alur end-to-end (1 pengajuan nyata, lengkap semua tahap)**
`BQ-20260926-2814` → Teknisi `AAA` ajukan → SPV1 `INN` approve → Manager `KSW` approve → status `BQ Baru` → masuk Riwayat Approval & Monthly Report. Ada video + 9 screenshot.

**Bug yang ketemu & sudah diperbaiki (bukti pengujian beneran jalan)**
- Role Supervisor nggak kebaca → menu kosong (akibatnya DB nyimpen `"Supervisor 1"`, bukan `"supervisor"`)
- Role Officer belum ditangani di front-end → layar "Menu tidak ditemukan"
- Subjudul modal stok nulis "database lokal" padahal server cloud → klaim salah
- Link Google Sheets ke-duplikasi URL

**Angka data production (3 Okt 2026)**
- 3.022 item sparepart · 210 critical part · 356 di bawah min stock · 1.887 stok habis
- 1.586 transaksi pengajuan (naik dari 1.535 karena run QA)

**Keterbatasan (siap kalau ditanya dosen)**
- Belum ada notifikasi email/WhatsApp — approval masih dicek manual
- Looker Studio masih dipakai manajemen, tapi Monthly Report sekarang digambar di dalam web (Chart.js)
- Belum ada app mobile khusus (responsif sudah)
- `supervisor_id` belum lengkap → filter "Tim Saya" belum 100% tajam
- 74% sparepart (2.243 item) belum punya lokator rak

---

## 4. Jejak nail (penting!)

Draft Bab 3 yang udah ada masih nyebut hal yang **udah nggak sesuai** dengan sistem sekarang. Tolong dikoreksi dulu:

| Draft lama | Kenyataan sekarang |
|---|---|
| Back-end "Google Apps Script + Google Sheets" | **Node.js + Express + Supabase (PostgreSQL)** |
| Monthly Report "terintegrasi Looker Studio" | Grafik **di dalam web** (Chart.js); Looker Studio cm tautan laporan lama |
| Tabel: `FORM_BQ`, `DETAIL_BQ`, `STOCK_GUDANG_CRITICAL`, `APPROVAL_LOG` | **`users`, `spareparts`, `pengajuan_bq`, `pengajuan_log`** |
| Enum `Pending SPV / Pending Manager / Full Approved / Rejected` | **Dua kolom terpisah**: `status_approval_spv` & `status_approval_manager` (Menunggu/Disetujui/Ditolak), plus `status_pengadaan` 8 status |
| Menu Teknisi: "BQ Personal, BQ Monitoring, On Hand Stock" | Teknisi: **Form BQ, On Hand Stock, BQ Summary** (nggak ada PR Summary/Monitoring) |
| "Keberhasilan routing notifikasi email" | **Belum ada** fitur notifikasi email |

- Gambar DFD/UML di draft lama masih bisa dipake — yg perlu diselarasin cm nama tabel, nama status, dan klaim teknologi.

---

## 5. Yang perlu ditanyain ke Kak Fadhil

1. **File Suggestion System** — di Drive ya, belum ada di repo. Kirih biar angka before–after bisa diisi aslinya.
2. **Lama persetujuan** (hari) sebelum vs sesudah — ada angka terukurnya? Saya blm punya.
3. **Jam downtime** — sistem baru go-live, jadi angka "305 menit → …" blm bisa diisi. Dipakai jadi **target**, bukan hasil.
4. Sudah berapa lama sistem dipakai di lapangan s/d pengujian?

---

*— Avwan (Anggota 1, Lead Developer). Bukti lengkap ada di `docs/M3-ARSITEKTUR-DAN-WIREFRAME.md`, `docs/M8-EVALUASI-PRODUK.md`, `docs/evidence/`.*
