# GUIDES TEST MANUAL QA - Fonko Gemini

> **Total Test: 68** (NFR: 4, AUTH: 8, RBAC: 8, FORM: 6, APP: 9, STOK: 2, MON: 4, REP: 3, EXP: 5, UI: 11, E2E: 8)
>
> **Terakhir diperbarui:** 23 September 2026
>
> **Tips kemudahan:** Semua data yang dibutuhkan (username, password, itemCode, `no_registrasi`, dst.) **sudah dicantumkan langsung di catatan ini** — cukup **copy-paste** dari tabel/data di bawah, TANPA perlu mengambil data dari API.

---

## ✅ CARA MULAI JALAN

1. Pastikan server hidup (`node server.js`)
2. Buka browser di `http://localhost:3000`
3. Login menggunakan kredensial di bawah ini
4. Jalankan test per-section dengan mengisi form / menjalankan aksi sesuai langkah (data sudah disiapkan)

---

## 📋 DATA UJI SIAP PAKAI (copy-paste dari sini)

### 1) Kredensial Login

| Role | Username | Password | Group Test |
|---|---|---|---|
| Teknisi | `AAA` | `04AAA10` | AUTH, FORM, STOK, MON, UI, E2E |
| Supervisor 1 | `INN` | `30INN11` | AUTH, RBAC, APP, MON, E2E |
| Supervisor 2 | `KAA` | `KAA1910` | RBAC, APP, MON |
| Officer | `ANS` | `ANS1805` | AUTH, RBAC, FORM, STOK, E2E |
| Manager | `KSW` | `01KSW10` | AUTH, RBAC, APP, MON, REP, UI, E2E |

### 2) Contoh `no_registrasi` (sudah ada di database)

| no_registrasi | Status SPV (acuan) | Status Pengadaan | Dipakai untuk |
|---|---|---|---|
| `BQ-2026-09-01-0001` | Menunggu | BQ Baru | RBAC-08, RBAC-09, RBAC-10, APP-09, APP-10, APP-11, MON-09 |
| `BQ-2025-01-01-0001` | Menunggu | BQ Baru | RBAC-11 |
| `BQ-2025-01-07-0007` | Menunggu | BQ Baru | RBAC-15 |

> Contoh di atas diambil dari data master (seed). Jika salah satu tidak ada di DB Anda, ganti dengan no registrasi yang **statusnya sama** yang terlihat di menu Monitoring.

### 3) Contoh `itemCode` sparepart

| itemCode | Keterangan |
|---|---|
| `O-50834-00` | Autoclave Fedegari (valid — untuk test yang harus berhasil) |
| `O-11181-00` | Bearing 626-2Z SKF (valid) |
| `QA-TIDAK-ADA-999` | Item palsu — untuk test yang harus ditolak |

---

## ⚙️ SECTION 1: NFR (Kesiapan Sistem)

**NFR-07: Cek server hidup**
- Langkah: Buka `/api/health` dari browser
- Expected: `{"status":"ok","message":"Server E-Sparepart Aktif"}`

**NFR-04: Endpoint tidak dikenal**
- Langkah: Buka `/api/qa-tidak-ada` (bukan rute yang ada)
- Expected: `{"status":"error","message":"Endpoint tidak ditemukan"}`

**NFR-06: Static app tersaji**
- Langkah: Buka alamat utama `/`
- Expected: Halaman HTML aplikasi terbuka (bukan kosong), content-type `text/html`

**NFR-10: Link Looker Studio diakses dengan sukses**
- Langkah: Klik link Looker Studio di halaman aplikasi → `https://lookerstudio.google.com/reporting/9bb14be8-f9d4-458e-9811-a89e9c8bb216`
- Expected: Link terbuka, konten Laporan Bulanan tampil

---

## 🔐 SECTION 2: AUTH (Login & Keluar)

**AUTH-01: Login Teknisi (AAA)**
- Input: Username `AAA` / Password `04AAA10`
- Expected: Login berhasil, role `teknisi`, ada `bqLink`, password tidak ditampilkan

**AUTH-02: Login Supervisor (INN)**
- Input: Username `INN` / Password `30INN11`
- Expected: Login berhasil, role `Supervisor 1`

**AUTH-03: Login Officer (ANS)**
- Input: Username `ANS` / Password `ANS1805`
- Expected: Login berhasil, role `Officer`

**AUTH-04: Login Manager (KSW)**
- Input: Username `KSW` / Password `01KSW10`
- Expected: Login berhasil, role `manager`

**AUTH-05: Password salah ditolak**
- Input: Username `AAA` / Password `salah-sekali`
- Expected: Ditolak (401), pesan `Kombinasi Username atau Password salah`

**AUTH-06: Username tak terdaftar**
- Input: Username `QA-TIDAK-ADA-XYZ` / Password `abc`
- Expected: Ditolak (401), pesan SAMA seperti AUTH-05

**AUTH-07: Body login kosong**
- Langkah: Submit form login tanpa username & password
- Expected: Ditolak (400), pesan `Parameter username dan password wajib diisi`

**AUTH-11: Rate limit (5 gagal -> 429)**
- Langkah: Coba login salah sebanyak 6x dengan Username `QA-RATE` / Password `SALAH` (user dummy agar akun asli tidak ikut terkunci)
- Expected: 5x ditolak (401), percobaan ke-6 → 429 dengan `retryAfter > 0`

---

## 🚪 SECTION 3: RBAC (Akses Berdasarkan Peran)

**RBAC-08: Teknisi dilarang ubah status (403)**
- Login: `AAA` / `04AAA10`
- Langkah: Coba ubah status pengajuan `BQ-2026-09-01-0001`
- Expected: Ditolak (403), pesan `Anda tidak memiliki akses untuk mengubah status pengajuan`

**RBAC-09: Supervisor dilarang approve manager (403)**
- Login: `INN` / `30INN11`
- Langkah: Coba set `status_approval_manager='approved'` pada `BQ-2026-09-01-0001`
- Expected: Ditolak (403), pesan `Supervisor tidak bisa approve/mengubah status Manager`

**RBAC-10: Manager dilarang approve SPV (403)**
- Login: `KSW` / `01KSW10`
- Langkah: Coba set `status_approval_spv='approved'` pada `BQ-2026-09-01-0001`
- Expected: Ditolak (403), pesan `Manager tidak bisa approve/mengubah status SPV`

**RBAC-11: Manager belum bisa approve karena SPV belum setuju (400)**
- Login: `KSW` / `01KSW10`
- Langkah: Set `status_approval_manager='approved'` pada `BQ-2025-01-01-0001` (SPV masih Menunggu)
- Expected: Ditolak (400), pesan `Manager hanya bisa menyetujui setelah Supervisor menyetujui`

**RBAC-12: Username tidak terdaftar ditolak (401)**
- Input: Username `QA-TIDAK-ADA-XYZ`
- Langkah: Coba ubah status pengajuan mana pun
- Expected: Ditolak (401), pesan `User tidak ditemukan`

**RBAC-13: Aksi tanpa login ditolak (401)**
- Langkah: Kirim ubah status tanpa username
- Expected: Ditolak (401), pesan `Anda harus login terlebih dahulu`

**RBAC-14: Rekap pengajuan milik sendiri (Teknisi)**
- Login: `AAA` / `04AAA10`
- Langkah: Akses summary untuk username `AAA`
- Expected: Berhasil (200), hanya data milik `AAA` yang tampil

**RBAC-15: KAA (Supervisor 2) berhasil approve SPV (200)**
- Login: `KAA` / `KAA1910`
- Langkah: Set `status_approval_spv='approved'` pada `BQ-2025-01-07-0007` (SPV masih Menunggu)
- Expected: Berhasil (200); status SPV menjadi `Disetujui`

---

## 🧾 SECTION 4: FORM (Validasi Isian Pengajuan)

**FORM-05: Pengajuan valid berhasil dibuat**
- Login: `AAA` / `04AAA10`
- Data: `itemCode: O-50834-00`, `qty: 2`, `uom: PCS`, `purpose: CONSUMABLE`, `no_ejo: EJO/QA/05/2026`, `mesin_area: Mesin Capping VCM200`, `merk: QATest`, `spesifikasi: Spesifikasi test manual QA`, `jenis_pengajuan: sparepart`, `urgency: Normal`
- Expected: Berhasil (201); `no_registrasi` tersedia (bentuk `BQ-2026-09-..-....`); qty_diminta harus sama dengan yang diinput

**FORM-06: Penyimpanan timestamp**
- Data: ikut hasil FORM-05
- Langkah: Lihat data baru yang dibuat pada FORM-05
- Expected: `timestamp` tersimpan (bukan kosong/null)

**FORM-08: itemCode kosong ditolak (400)**
- Data: `itemCode: ''` (kosong), qty `5`, uom `PCS`, dst. wajib diisi
- Expected: Ditolak (400), pesan berisi `Item Code`, `UoM, Purpose, No. EJO, dan Mesin/Area`

**FORM-09: qty di bawah 1 ditolak (400)**
- Data: `itemCode: O-50834-00`, `qty: 0`, uom `PCS`, purpose `CONSUMABLE`, `no_ejo: EJO/QA/09/2026`, `mesin_area: Capping`, `spesifikasi: Test qty nol`
- Expected: Ditolak (400), pesan `Quantity minimal 1`

**FORM-12: itemCode tidak ditemukan ditolak (400)**
- Data: `itemCode: QA-TIDAK-ADA-999`, qty `2`, uom `PCS`, dst. wajib diisi
- Expected: Ditolak (400), pesan `Item Code 'QA-TIDAK-ADA-999' tidak ditemukan di database.`

**FORM-13: Pengajuan jasa (tanpa itemCode) berhasil**
- Data: `jenis_pengajuan: jasa`, qty `1`, uom `Job`, purpose `EJO`, `no_ejo: EJO/QA/13/2026`, `mesin_area: Mesin Capping VCM200`, `spesifikasi: Jasa kalibrasi test manual QA`, `urgency: Normal`
- Expected: Berhasil (201), `no_registrasi` tersedia; itemCode tidak wajib

---

## 🔄 SECTION 5: APP (Alur Status Pengajuan)

**APP-09: Status pengadaan tidak valid ditolak (400)**
- Login: `ANS` / `ANS1805`
- Langkah: Set `status_pengadaan: SALAH-STATUS` pada `BQ-2026-09-01-0001`
- Expected: Ditolak (400), pesan `status_pengadaan tidak valid`

**APP-10: Status SPV tidak valid ditolak (400)**
- Login: `INN` / `30INN11`
- Langkah: Set `status_approval_spv: SALAH-STATUS` pada `BQ-2026-09-01-0001`
- Expected: Ditolak (400), pesan `status_approval_spv tidak valid`

**APP-11: Ubah status tanpa kirim status ditolak (400)**
- Login: `KSW` / `01KSW10`
- Langkah: Kirim update tanpa field `status_*` pada `BQ-2026-09-01-0001`
- Expected: Ditolak (400), pesan `Tidak ada status yang dikirim untuk diubah`

**APP-12: Rekap pengajuan per user (Database)**
- Login: `KSW` / `01KSW10` (untuk monitoring)
- Langkah: Cek data summary untuk Dashboard Bulanan
- Expected: Respons berisi array bulan + jumlah pengajuan (kurang-lebih sesuai total 1481)

**APP-13: Alur lengkap Teknisi -> SPV -> Officer -> Manager (BQS-01)**
- Login: `AAA` / `04AAA10`
- Data: `itemCode: O-50834-00`, `qty: 1`, `uom: PCS`, `purpose: CONSUMABLE`, `no_ejo: EJO/QA/E2E/2026`, `mesin_area: Mesin Capping VCM200`, `merk: QATest`, `spesifikasi: Spesifikasi untuk test alur lengkap`, `jenis_pengajuan: sparepart`, `urgency: Normal`
- Langkah: Buat pengajuan → catat `no_registrasi` hasilnya sebagai `[no]`
- Expected: Berhasil (201)

**BQS-02: SPV approve (INN)**
- Login: `INN` / `30INN11`
- Langkah: Set `status_approval_spv='approved'` pada `[no]`
- Expected: Berhasil (200)

**MON-RPT: Officer tandai 'Proses PO' (ANS)**
- Login: `ANS` / `ANS1805`
- Langkah: Set `status_pengadaan='Proses PO'` pada `[no]`
- Expected: Berhasil (200), status berubah

**MON-RPT2: Manager setujui final (KSW)**
- Login: `KSW` / `01KSW10`
- Langkah: Set `status_approval_manager='approved'` pada `[no]`
- Expected: Berhasil (200); status SPV & Manager `Disetujui`, Pengadaan `Proses PO`

---

## 📦 SECTION 6: STOK (Stok Sparepart)

**STOK-01: Buka data stok sparepart (Teknisi)**
- Login: `AAA` / `04AAA10`
- Langkah: Buka halaman stok sparepart
- Expected: Ada data, minimal kolom: `Kode` / Item Code, Nama, Stok Total, Satuan, Status Stok. Jumlah item utama terbaca (**3022**)

**STOK-02: Alert stok kritis tidak kosong (Officer)**
- Login: `ANS` / `ANS1805`
- Langkah: Buka data alert stok (maksimum 20 baris)
- Expected: Ada data dengan `stok_total` kecil / habis (total real: **210 kritis**, **356 rendah**, **1887 habis**) dan terdapat baris `stok_total: 0`

---

## 📊 SECTION 7: MON (Monitoring / Auditable)

**MON-01: Buka monitoring pengajuan (Teknisi)**
- Login: `AAA` / `04AAA10`
- Langkah: Buka halaman monitoring `AAA`
- Expected: Hanya data `AAA` yang muncul; total pengajuan = **1481-~an** (dari DB), kolom sesuai

**MON-02: Monitoring menampilkan kolom wajib (16)**
- Langkah: Periksa header tabel monitoring
- Expected: Kolom lengkap: `no_registrasi, timestamp, username_teknisi, nama_teknisi, item_code, nama_sparepart, qty_diminta, uom, spesifikasi_lengkap, purpose, no_ejo, mesin_area, status_approval_spv, status_pengadaan, status_approval_manager (ada log), dsb.`

**MON-03: Panel tanggal otomatis**
- Langkah: Lihat filter/panel tanggal pada monitoring
- Expected: Rentang tanggal terisi otomatis, minimal `2025-01-01` s.d. tanggal terbaru (21 bulan: Jan 2025–Sep 2026)

**MON-09: Log audit berukuran tetap (3)**
- Langkah: Buka detail log pengajuan `BQ-2026-09-01-0001`
- Expected: Log berisi **3 entri**: SPV approve, pengadaan ubah status, manager approve

---

## 📈 SECTION 8: REP (Laporan Bulanan)

**REP-05: Laporan bulan valid berhasil**
- Login: `KSW` / `01KSW10`
- Data: Bulan `9`, Tahun `2026`
- Langkah: Buka laporan bulan 9 tahun 2026
- Expected: Berhasil; jumlah pengajuan sesuai preview bulan itu (**>= 43**) dan tabel tanggal 1 s.d. akhir bulan muncul

**REP-06: Laporan satu entri (data kosong)**
- Data: Bulan `2`, Tahun `2025`
- Expected: Berhasil; tabel 28 baris (Feb 2025), tanpa data entri (atau data lama **>= 132**)

**REP-07: Bulan tidak valid ditolak**
- Data: Bulan `13`, Tahun `2026`
- Expected: Ditolak (400); pesan `Bulan tidak valid (1-12)` atau serupa

---

## 📤 SECTION 9: EXP (Export Data)

**EXP-01: Export row & kolom valid (spareparts)**
- Login: `AAA` / `04AAA10`
- Data (JSON payload export):
```json
{
  "columns": ["item_code", "nama_sparepart", "satuan"],
  "rows": [["O-50834-00", "Autoclave Fedegari", "pcs"]]
}
```
- Expected: Berhasil; data yang diexport sesuai isi `rows`

**EXP-04: Parameter kolom & baris kosong ditolak**
- Data: kirim export tanpa `columns`/`rows`
- Expected: Ditolak (400)
- Expected: pesan `Parameter columns dan rows wajib diisi`

**EXP-05: Data terlalu besar ditolak**
- Data: `rows` berisi lebih dari **20.000** entri (contoh: 20.001 baris dummy)
- Expected: Ditolak; pesan `Data terlalu besar untuk diexport (maksimal 20000 baris)`

**EXP-06: Ekspor seluruh pengajuan (Teknisi)**
- Login: `AAA` / `04AAA10`
- Langkah: Ekspor data monitoring `AAA`
- Expected: Berhasil; jumlah baris export sesuai data milik `AAA`, file dapat dibuka di Excel

**EXP-07: Ekspor pengajuan jasa (tanpa itemCode)**
- Langkah: Buat pengajuan jasa (lihat FORM-13) → ekspor datanya
- Data: kolom mencakup `no_registrasi` dan `spesifikasi_lengkap`
- Expected: Berhasil; baris jasa tampil, kolom itemCode tidak kosong/eror

---

## 🖥️ SECTION 10: UI (Antarmuka Halaman)

**UI-01: Halaman login tampil benar**
- Buka `/`
- Expected: Form login dengan field username & password, tombol Login

**UI-02: Header aplikasi brand baru**
- Expected: Header / navbar menampilkan **Fonko Gemini** (bukan Micropage E-Sparepart)

**UI-03: Navigasi menu lengkap**
- Login: `AAA` / `04AAA10`
- Expected: Menu lengkap: Home/Dashboard, Pengajuan, Monitoring, Stok, Laporan (sesuai role), dsb.

**UI-04: Search monitoring berfungsi**
- Login: `AAA` / `04AAA10`
- Kata kunci: `BQ-2025-01-07-0007`
- Expected: Hasil menemukan pengajuan dengan no tersebut

**UI-05: Badge status penting konsisten**
- Expected: Label: `BQ Baru` (biru/abu), `Proses PO` (kuning), `Disetujui` (hijau), `Ditolak`/`Selesai` (merah/abu); warna berbeda antarstatus

**UI-06: Pemilihan menu memfilter data**
- Login: `AAA` / `04AAA10`
- Expected: Filter pengajuan bisa diubah dan daftar berubah sesuai pilihan

**UI-07: Ceklis pemilihan untuk PQ**
- Expected: Ada checkbox dalam tabel monitoring (untuk pemilihan pengajuan)

**UI-08: Dropdown bulk action**
- Langkah: Pilih beberapa baris via checklist
- Expected: Muncul dropdown aksi (pilihan: *Proses PO*, *Ditolak*, *PO Open*, *Mencari Penawaran*, *Barang Dikirim*, *Tiba di Gudang*, *Completed* dsb.)

**UI-09: Tombol export**
- Login: `AAA` / `04AAA10`
- Expected: Tombol "Export" tampil (di halaman monitoring / stok), mengunduh file Excel

**UI-10: Logout berfungsi**
- Langkah: Klik tombol Logout
- Expected: Kembali ke halaman login, token login tersimpan tidak diperbarui/dipakai lagi

**UI-11: Halaman dashboard berisi 6 kartu info**
- Login: `KSW` / `01KSW10`
- Expected: 6 kartu data: Total Sparepart (**3022**), Kritis (**210**), Rendah (**356**), Habis (**1887**), Total Pengajuan (**1481**), Bulan Aktif (**21**)

---

## 🎬 SECTION 11: E2E (Alur Lengkap: Buat Sampai Setuju)

> ⚠️ Jalankan **berurutan E2E-01 → E2E-08** (hasil langkah 1 dipakai di langkah berikutnya).

**E2E-01: Teknisi membuat pengajuan**
- Login: `AAA` / `04AAA10`
- Data: `itemCode: O-50834-00`, `qty: 2`, `uom: PCS`, `purpose: EJO`, `no_ejo: EJO/QA/E2E/2026`, `mesin_area: Mesin Capping VCM200`, `merk: QATest`, `spesifikasi: Spesifikasi QA alur E2E`, `jenis_pengajuan: sparepart`, `urgency: Normal`
- Expected: Berhasil (201). **Catat `no_registrasi` hasilnya → pakai sebagai `[no]` di test berikutnya**

**E2E-02: Status awal pengajuan baru**
- Langkah: Buka monitoring, cari `[no]`
- Expected: SPV `Menunggu`, Manager `Menunggu`, Pengadaan `BQ Baru`, Teknisi: `AAA`, Qty: `2`

**E2E-03: Supervisor menyetujui**
- Login: `INN` / `30INN11`
- Langkah: Set `status_approval_spv='approved'` pada `[no]`
- Expected: Berhasil; SPV menjadi `Disetujui`

**E2E-04: Officer ubah status pengadaan**
- Login: `ANS` / `ANS1805`
- Langkah: Set `status_pengadaan='Proses PO'` pada `[no]`
- Expected: Berhasil; Pengadaan menjadi `Proses PO`

**E2E-05: Audit trail dua aksi tercatat**
- Langkah: Buka detail log pada `[no]`
- Expected: Terdapat **2 entri**: aksi SPV (INN) dan aksi pengadaan (ANS)

**E2E-06: Manager menyetujui final**
- Login: `KSW` / `01KSW10`
- Langkah: Set `status_approval_manager='approved'` pada `[no]`
- Expected: Berhasil; Manager `Disetujui`

**E2E-07: Audit trail tiga aksi tercatat**
- Langkah: Buka kembali detail log pada `[no]`
- Expected: **3 entri** (aksi SPV, pengadaan, manager); muncul aktor `manager`

**E2E-08: Status akhir konsisten**
- Langkah: Cek status `[no]` di monitoring
- Expected: SPV `Disetujui`, Manager `Disetujui`, Pengadaan `Proses PO`

---

## 📝 CATATAN PENTING UNTUK TEST

1. **Urutan aman:** AUTH → RBAC → FORM → APP → STOK → MON → REP → EXP → UI → E2E. Test APP & E2E **menulis data** ke database — jalankan terakhir bila concern.
2. **AUTH-11 (rate limit):** gunakan user dummy `QA-RATE` agar akun `AAA` dkk. tidak terkunci 15 menit (kunci = IP + username). Jika terkunci, tunggu 15 menit atau restart server.
3. **Rekap/MON multi-user:** RBAC-14 menggunakan data asli `AAA` — jumlah pasti tergantung DB, yang penting hanya milik `AAA` yang tampil.
4. **Data no_registrasi contoh:** berasal dari seed; bila tidak ada di DB Anda, salin dari baris yang statusnya sama di Monitoring.
5. **Baseline (update 22 Sep 2026):** sparepart 3022 / kritis 210 / rendah 356 / habis 1887; pengajuan 1481; 21 bulan (Jan 2025–Sep 2026); Sep 2026 `>= 43`; Jan 2025 `>= 63`; Feb 2025 `>= 132`; `BQ-2026-09-01-0001` = 3 log.

---

## 📊 RINGKASAN PER SECTION

| Section | Jumlah Test | ID Test |
|---|---|---|
| NFR | 4 | NFR-07, NFR-04, NFR-06, NFR-10 |
| AUTH | 8 | AUTH-01..07, AUTH-11 |
| RBAC | 8 | RBAC-08..RBAC-15 |
| FORM | 6 | FORM-05, FORM-06, FORM-08, FORM-09, FORM-12, FORM-13 |
| APP | 9 | APP-09..APP-13, BQS-01, BQS-02, MON-RPT, MON-RPT2 |
| STOK | 2 | STOK-01, STOK-02 |
| MON | 4 | MON-01, MON-02, MON-03, MON-09 |
| REP | 3 | REP-05, REP-06, REP-07 |
| EXP | 5 | EXP-01, EXP-04, EXP-05, EXP-06, EXP-07 |
| UI | 11 | UI-01..UI-11 |
| E2E | 8 | E2E-01..E2E-08 |
| **TOTAL** | **68** | |

> Semua field input sudah disiapkan di atas. Tinggal **copy-paste data** → isi → bandingkan hasil dengan Expected.
