# GUIDES TEST MANUAL QA - Micropage E-Sparepart

> **Total Test: 70** (NFR: 3, AUTH: 7, RBAC: 7, FORM: 6, APP: 8, STOK: 2, MON: 4, REP: 3, EXP: 6, UI: 11, E2E: 8)
>
> **Terakhir diperbarui:** 18 September 2026

---

## ✅ CARA MULAI JALAN

1. Pastikan server hidup (`node server.js`)
2. Buka browser di `http://localhost:3000/qa-test.html`
3. Login menggunakan kredensial di bawah ini
4. Klik **"Jalankan Semua"** atau test per-section

> **Tips:** Di qa-test.html bisa diubah ke **"Cepat"** (0.2x) untuk test lebih cepat, atau **"Mudah dilihat manusia"** (6x) untuk test lambat tapi jelas.

---

## 🔑 KREDENSIAL LOGIN (untuk test manual)

| Role | Username | Password | Group Test |
|---|---|---|---|
| Teknisi | AAA | 04AAA10 | AUTH, FORM, STOK, MON, UI, E2E |
| Supervisor 1 | INN | 30INN11 | AUTH, RBAC, APP, MON, E2E |
| Supervisor 2 | KAA | 30INN11 | RBAC, APP, MON |
| Officer | ANS | ANS1805 | AUTH, RBAC, FORM, STOK, E2E |
| Manager | KSW | 01KSW10 | AUTH, RBAC, APP, MON, REP, UI, E2E |

---

## 📋 DAFTAR TEST SESUAI DIJALANKAN

---

### ⚙️ SECTION 1: NFR (Kesiapan Sistem)

**NFR-07: Cek server hidup**
- Langkah: Klik tombol "Jalankan Semua" atau akses `/api/health`
- Expected: `{"status":"ok","message":"Server E-Sparepart Aktif"}`

**NFR-04: Endpoint tidak dikenal**
- Langkah: Akses `/api/qa-tidak-ada` (bukan rute yang ada)
- Expected: `{"status":"error","message":"Endpoint tidak ditemukan"}`

**NFR-06: Static app tersaji**
- Langkah: Akses root `/`
- Expected: Halaman HTML aplikasi terbuka (bukan kosong), content-type `text/html`

**NFR-10: Link Looker Studio diakses dengan sukses**
- Langkah: Akses link Looker Studio di index.html (`https://lookerstudio.google.com/reporting/9bb14be8-f9d4-458e-9811-a89e9c8bb216`)
- Expected: Link terbuka, konten Laporan Bulanan tampil (status 200 atau valid)

---

### 🔐 SECTION 2: AUTH (Login & Keluar)

**AUTH-01: Login Teknisi (AAA)**
- Langkah: Login dengan AAA / 04AAA10
- Expected: 200, role `teknisi`, name `AAA`, ada `bqLink`, password tidak bocor

**AUTH-02: Login Supervisor (INN)**
- Langkah: Login dengan INN / 30INN11
- Expected: 200, role `Supervisor 1`

**AUTH-03: Login Officer (ANS)**
- Langkah: Login dengan ANS / ANS1805
- Expected: 200, role `Officer`

**AUTH-04: Login Manager (KSW)**
- Langkah: Login dengan KSW / 01KSW10
- Expected: 200, role `manager`

**AUTH-05: Password salah ditolak**
- Langkah: Login dengan password salah (`salah-sekali`)
- Expected: 401, message `Kombinasi Username atau Password salah`

**AUTH-06: Username tak terdaftar**
- Langkah: Login dengan username gaada (`QA-TIDAK-ADA-XYZ`)
- Expected: 401, message sama seperti AUTH-05

**AUTH-07: Body login kosong**
- Langkah: Kirim body kosong `{}` ke `/api/login`
- Expected: 400, message `Parameter username dan password wajib diisi`

**AUTH-11: Rate limit (5 gagal -> 429)**
- Langkah: Coba login 5x salah, lalu 6x
- Expected: 5x 401, 6x 429 dengan `retryAfter > 0`

---

### 🛡️ SECTION 3: RBAC (Hak Akses per Peran)

**RBAC-08: Teknisi tidak boleh approval**
- Langkah: Login AAA, ambil `no_registrasi` dari `/api/pengajuan/all`, coba approve SPV
- Expected: 403 (ditolak)

**RBAC-09: Supervisor tidak boleh approval MGR**
- Langkah: Login INN, coba approve MGR
- Expected: 403 (ditolak, hanya Manager 1 yang boleh)

**RBAC-10: Officer tidak boleh approval**
- Langkah: Login ANS, coba approve SPV
- Expected: 403 (ditolak)

**RBAC-11: Manager menunggu approval SPV**
- Langkah: Login KSW, coba approve MGR saat SPV BELUM diapprove
- Expected: 400 dengan pesan "Manager hanya bisa menyetujui setelah Supervisor menyetujui"

**RBAC-12: User tak dikenal**
- Langkah: Login user gaada, coba ubah status
- Expected: 401, message `User tidak ditemukan`

**RBAC-13: Buat pengajuan tanpa login**
- Langkah: POST `/api/pengajuan` tanpa `username`
- Expected: 401, message `Anda harus login terlebih dahulu`

**RBAC-14: Hanya Manager & Supervisor 1 boleh akses PR Summary**
- Langkah: Coba akses `/api/pengajuan/summary` dengan tiap role:
  - AAA (teknisi) → 403
  - INN (Supervisor 1) → 200
  - KAA (Supervisor 2) → 403
  - ANS (Officer) → 403
  - KSW (Manager) → 200
- Expected: Hanya INN dan KSW yang dapat 200

**RBAC-15: Supervisor 2 (KAA) boleh approve SPV**
- Langkah: Login KAA, ambil pengajuan dengan status `Menunggu`, approve SPV
- Expected: 200 (KAA boleh approve SPV)

---

### 📝 SECTION 4: FORM (Form Pengajuan Barang)

**FORM-08: Field pelengkap wajib**
- Langkah: POST `/api/pengajuan` dengan `itemCode` valid, `qty: 1`, `spesifikasi: 'QA'` (tanpa uom, purpose, no_ejo, mesin_area)
- Expected: 400, message mengandung `UoM, Purpose`

**FORM-09: Item Code & spesifikasi wajib**
- Langkah: POST `/api/pengajuan` dengan `username: 'AAA'`, `itemCode: 'DUMMY'`, tanpa `spesifikasi`
- Expected: 400, message `Parameter itemCode dan spesifikasi wajib diisi`

**FORM-12: Item Code tak ada di DB**
- Langkah: POST dengan `itemCode: 'QA-TIDAK-ADA-999'`, `qty: 1`, `uom: 'Pcs'`, `purpose: 'EJO'`, `no_ejo: 'EJO/QA/0'`, `mesin_area: 'Area QA'`, `spesifikasi: 'QA'`
- Expected: 400, message `Item Code 'QA-TIDAK-ADA-999' tidak ditemukan di database.`

**FORM-05: Qty 0 ditolak**
- Langkah: POST dengan `itemCode` dari sparepart, `qty: 0`, `uom: 'Pcs'`, `purpose: 'EJO'`, `no_ejo: 'EJO/QA/0'`, `mesin_area: 'Area QA'`, `spesifikasi: 'QA'`
- Expected: 400, message `Qty harus berupa angka bulat lebih dari 0`

**FORM-06: Qty pecahan ditolak**
- Langkah: POST dengan `qty: 1.5`
- Expected: 400, message `Qty harus berupa angka bulat lebih dari 0`

**FORM-13: Buat pengajuan Jasa (tanpa item_code)**
- Langkah: POST dengan `username: 'AAA'`, `itemCode: null`, `qty: 1`, `uom: 'Pcs'`, `purpose: 'EJO'`, `no_ejo: 'EJO/QA/' + timestamp`, `mesin_area: 'Area QA Jasa'`, `spesifikasi: 'Jasa perawatan mesin'`, `jenis_pengajuan: 'jasa'`
- Expected: 201, ada `no_registrasi` di response

---

### 📦 SECTION 5: APP (Persetujuan & Perubahan Status)

**APP-09: Status pengadaan invalid ditolak**
- Langkah: Ambil `no_registrasi` dari `/api/pengajuan/all`, coba `status_pengadaan: 'Selesai'`
- Expected: 400, message `status_pengadaan tidak valid`

**APP-10: Nilai approval invalid ditolak**
- Langkah: Coba approve `status_approval_spv: 'setuju'` saat status belum sesuai
- Expected: 400, message `status_approval_spv tidak valid`

**APP-11: Tanpa status -> 400**
- Langkah: POST approve hanya dengan `username`, tanpa field status
- Expected: 400, message `Tidak ada status yang dikirim untuk diubah`

**APP-12: PR Summary menampilkan pengajuan menunggu**
- Langkah: GET `/api/pengajuan/summary?username=KSW`
- Expected: 200, data array

**APP-13: Buat pengajuan dengan urgency=Urgent**
- Langkah: POST dengan `urgency: 'Urgent'`, `itemCode` valid, field lengkap
- Expected: 201, `urgency = 'Urgent'` di response

**BQS-01: BQ Summary mengembalikan data lengkap**
- Langkah: GET `/api/pengajuan/bq-summary`
- Expected: 200, `summary.total > 0`, `summary.approval` ada, `summary.pipeline` ada

**BQS-02: BQ Summary bisa diakses tanpa auth**
- Langkah: GET `/api/pengajuan/bq-summary` (tanpa login)
- Expected: 200, data array

**MON-RPT: Monthly Report per periode**
- Langkah: GET `/api/reports/monthly?year=2026&month=9`
- Expected: 200, `period.year = 2026`, `period.month = 9`, `summary` ada

**MON-RPT2: Monthly Report bulan invalid ditolak**
- Langkah: GET `/api/reports/monthly?year=2026&month=13`
- Expected: 400, message mengandung `bulan tidak valid`

---

### 📊 SECTION 6: STOK (Data Stok & KPI)

**STOK-01: KPI ringkasan stok akurat**
- Langkah: Akses `/api/spareparts/summary`
- Expected: `total_item: 663`, `total_critical: 155`, `stok_rendah: 284`, `stok_habis: 140`, `low_stock` berisi array

**STOK-02: Daftar sparepart lengkap & berfield**
- Langkah: Akses `/api/spareparts`
- Expected: 663 item, tiap item punya field: `item_code`, `deskripsi`, `qty_on_hand`, `min_stock`, `max_stock`, `is_critical`, `lokasi_rak`

---

### 👁️ SECTION 7: MON (Pantau Pengajuan)

**MON-01: Monitoring memuat seluruh pengajuan**
- Langkah: GET `/api/pengajuan/all`
- Expected: >= 200 pengajuan, `count = jumlah data`, baris teratas ada `no_registrasi` dan `nama_teknisi`

**MON-02: Kolom monitoring lengkap**
- Langkah: Cek tiap baris memiliki kolom: `no_registrasi`, `timestamp`, `nama_teknisi`, `item_code`, `deskripsi_barang`, `qty_diminta`, `status_approval_spv`, `status_approval_manager`, `status_pengadaan`, `spesifikasi_lengkap`, `no_ejo`, `mesin_area`, `uom`, `purpose`, `jenis_pengajuan`, `urgency`
- Expected: Semua kolom ada di tiap baris

**MON-03: Kolom jenis & urgency di monitoring**
- Langkah: Cek setiap baris punya `jenis_pengajuan` (sparepart/jasa) dan `urgency` (Normal/Urgent) yang valid
- Expected: Semua baris punya kolom dengan nilai valid

**MON-09: Audit trail tersimpan**
- Langkah: Akses `/api/pengajuan/BQ-2026-09-01-0001/log`
- Expected: 3 entri riwayat, tiap entri punya field: `field`, `old_value`, `new_value`, `actor_name`, `actor_role`, `created_at`

---

### 📈 SECTION 8: REP (Laporan Bulanan)

**REP-05: Periode laporan tersedia**
- Langkah: Akses `/api/pengajuan/all`, cek bulan-bulan di data
- Expected: 21 bulan (Jan 2025 - Sep 2026)

**REP-06: Rekap Sep 2026**
- Langkah: Filter data Sep 2026
- Expected: Jumlah >= 8 (baseline 8)

**REP-07: Rekap Jan & Feb 2025**
- Langkah: Cek data Jan 2025 (>= 16) dan Feb 2025 (>= 20)
- Expected: Persyaratan terpenuhi

---

### 📤 SECTION 9: EXP (Ekspor Excel)

**EXP-01: Export Excel valid**
- Langkah: POST `/api/export/xlsx` dengan `{"filename": "qa-test", "sheet": "QA", "columns": [{"key": "a", "label": "A"}, {"key": "b", "label": "B"}], "rows": [{"a": 1, "b": "x"}, {"a": 2, "b": "y"}]}`
- Expected: 200, content-type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, magic bytes `PK`

**EXP-04: Export tanpa columns/rows ditolak**
- Langkah: POST `{filename: 'x'}`
- Expected: 400, message `Parameter columns dan rows wajib diisi`

**EXP-05: Batas ukuran export**
- Langkah: POST dengan 20001 baris
- Expected: 413, message `Data terlalu besar untuk diexport (maksimal 20000 baris)`

**EXP-06: Alert stok di bawah minimum**
- Langkah: GET `/api/spareparts/alert`
- Expected: 200, array sparepart defisit (qty_on_hand <= min_stock)

**EXP-07: Buat pengajuan Jasa (tanpa item_code)**
- Langkah: POST dengan `username: 'AAA'`, `itemCode: ''`, `qty: 1`, `uom: 'Pcs'`, `purpose: 'EJO'`, `no_ejo: 'EJO/QA/' + timestamp`, `mesin_area: 'Area QA Jasa'`, `spesifikasi: 'Jasa perawatan mesin'`, `jenis_pengajuan: 'jasa'`
- Expected: 201, ada `no_registrasi` di response

---

### 🖥️ SECTION 10: UI (Uji Tampilan Aplikasi)

**UI-01: Menu Manager (5 modul)**
- Langkah: Login KSW, cek dashboard
- Expected: 5 menu: **On Hand Stock, Monthly Report, BQ Summary, Approval BQ Urgent, Critical Part List**, badge role `manager` tampil

**UI-02: Buka BQ Monitoring**
- Langkah: Login KSW, klik menu BQ Monitoring
- Expected: Tabel terbuka, count terisi >= 200, pagination ada, tombol Riwayat ada

**UI-03: Pencarian di BQ Monitoring**
- Langkah: Login KSW, cari kolom pencarian, tulis `BQ-20260917-4463`
- Expected: Hasil filtering, baris mengandung kata kunci

**UI-04: Monthly Report tampil & periode terisi**
- Langkah: Login KSW, klik menu Monthly Report
- Expected: Ringkasan laporan terisi (lbl-total > 0), opsi periode >= 2, chart tetap muncul setelah ganti jenis

**UI-05: Menu Teknisi (3 modul) + KPI**
- Langkah: Login AAA (teknisi)
- Expected: 3 menu: **BQ Personal, On Hand Stock, BQ Summary**, KPI total = 663

**UI-06: On Hand Stock: daftar & pencarian**
- Langkah: Login AAA, klik menu On Hand Stock
- Expected: 663 item awal, cari `bearing` -> hasil menyusut (> 0 dan < 663)

**UI-07: Logout membersihkan sesi**
- Langkah: Login AAA, klik Logout
- Expected: Kembali ke form login, `sessionStorage.user` terhapus

**UI-08: Kartu KPI card membuka daftar sesuai mode**
- Langkah: Login KSW, klik kartu "Critical Part" di KPI
- Expected: Modal berjudul "Critical Part List", jumlah item = 155

**UI-09: Menu Supervisor 1 (6 modul)**
- Langkah: Login INN (supervisor 1)
- Expected: 6 menu: **PR Summary, Monthly Report, BQ Summary, Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock**

**UI-10: Menu Officer (4 modul)**
- Langkah: Login ANS (officer)
- Expected: 4 menu: **BQ Summary, Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock**
- Catatan: PR Summary **TIDAK BOLEH** ada untuk Officer

**UI-11: BQ Summary modal terbuka**
- Langkah: Login AAA, klik menu BQ Summary
- Expected: Modal terbuka dengan statistik approval & pipeline, data terisi

---

### 🔄 SECTION 11: E2E (Alur Lengkap: Buat sampai Setuju)

> ⚠️ **E2E harus dijalankan berurutan dari E2E-01 sampai E2E-08.** Test ini menulis data ke database.

**E2E-01: Teknisi membuat pengajuan BQ**
- Langkah: POST `/api/pengajuan` lengkap dengan `username: 'AAA'`, `itemCode` valid, `qty: 2`, field lengkap
- Expected: 201 + ada `no_registrasi` (disimpan di variabel `RUN.newNo`)

**E2E-02: Pengajuan muncul di monitoring**
- Langkah: GET `/api/pengajuan/all`, cari `RUN.newNo`
- Expected: Status awal: SPV=Menunggu, MGR=Menunggu, Pengadaan=BQ Baru, data lengkap

**E2E-03: Supervisor menyetujui (SPV)**
- Langkah: PUT `/api/pengajuan/{RUN.newNo}/status` dengan `username: 'INN'`, `status_approval_spv: 'approved'`
- Expected: 200, SPV=Disetujui

**E2E-04: Officer mengubah status pengadaan**
- Langkah: PUT `/api/pengajuan/{RUN.newNo}/status` dengan `username: 'ANS'`, `status_pengadaan: 'Proses PO'`
- Expected: 200, status_pengadaan=Proses PO

**E2E-05: Audit trail 2 aksi tercatat**
- Langkah: GET `/api/pengajuan/{RUN.newNo}/log`
- Expected: 2 entri log (approval SPV + status pengadaan), field: `status_approval_spv` dan `status_pengadaan`

**E2E-06: Manager menyetujui final (MGR)**
- Langkah: PUT `/api/pengajuan/{RUN.newNo}/status` dengan `username: 'KSW'`, `status_approval_manager: 'approved'`
- Expected: 200, MGR=Disetujui

**E2E-07: Audit trail 3 aksi tercatat**
- Langkah: GET `/api/pengajuan/{RUN.newNo}/log`
- Expected: 3 entri log (SPV, pengadaan, MGR), ada aktor `manager`

**E2E-08: Status akhir pengajuan konsisten**
- Langkah: GET `/api/pengajuan/all`, cari `RUN.newNo`
- Expected: SPV=Disetujui, MGR=Disetujui, Pengadaan=Proses PO

---

## 📝 CATATAN PENTING UNTUK TEST

1. **Speed test:** Di `qa-test.html` bisa diubah ke "Cepat" (0.2) untuk test lebih cepat, atau "Mudah dilihat manusia" (6) untuk test lambat tapi jelas.
2. **E2E test:** Test E2E (E2E-01 s.d. E2E-08) **menulis data ke database**. Jalankan berurutan dari E2E-01.
3. **Section order:** Test dijalankan berdasarkan section: NFR → AUTH → RBAC → FORM → APP → STOK → MON → REP → EXP → UI → E2E
4. **Prasyarat:** Beberapa test memerlukan test sebelumnya (lihat daftar `DEPS` di `qa-test.html`).
5. **Saran:** Mulai dari section NFR, lalu AUTH, lalu RBAC. Jika semua section lulus, berarti aplikasi full function.

---

## 📊 RINGKASAN PER SECTION

| Section | Jumlah Test | ID Test |
|---|---|---|
| NFR | 4 | NFR-07, NFR-04, NFR-06, NFR-10 |
| AUTH | 7 | AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-11 |
| RBAC | 7 | RBAC-08, RBAC-09, RBAC-10, RBAC-11, RBAC-12, RBAC-13, RBAC-14, RBAC-15 |
| FORM | 6 | FORM-05, FORM-06, FORM-08, FORM-09, FORM-12, FORM-13 |
| APP | 8 | APP-09, APP-10, APP-11, APP-12, APP-13, BQS-01, BQS-02, MON-RPT, MON-RPT2 |
| STOK | 2 | STOK-01, STOK-02 |
| MON | 4 | MON-01, MON-02, MON-03, MON-09 |
| REP | 3 | REP-05, REP-06, REP-07 |
| EXP | 5 | EXP-01, EXP-04, EXP-05, EXP-06, EXP-07 |
| UI | 11 | UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11 |
| E2E | 8 | E2E-01, E2E-02, E2E-03, E2E-04, E2E-05, E2E-06, E2E-07, E2E-08 |
| **TOTAL** | **65** | |

> **Catatan:** Beberapa test dalam satu ID mengandung beberapa assertion (contoh: RBAC-14 menguji 5 role sekaligus). Total assertion otomatis di qa-test.html = **70 test cases**.
