# Keputusan: Monthly Report (Chart.js di Web atau Looker Studio)

Status: **MENUNGGU KONFIRMASI KA FADHIL**
Tanggal: 30 Sep 2026
Penulis: Tim capstone (bahasan keputusan, belum ada perubahan kode)

Belum ada perubahan kode yang dibuat untuk keputusan ini.

---

## 1. Pertanyaan yang masuk

"Untuk Monthly Report, mendingan grafiknya ditampilkan di dalam web, atau
cukup arahkan saja ke Looker Studio?"

---

## 2. Temuan (hasil baca kode dan pengujian production)

### 2.1 Monthly Report internal sudah berjalan

- `public/index.html:3274` `openReportModal()` membuka modal Monthly Report.
- `renderReportChart()` (`index.html:3208`) memakai **Chart.js**, bukan gambar statis.
- Tipe chart bisa dipilih: `pie`, `doughnut`, `bar`, `line`.
- Pengelompokan bisa dipilih: per `month`, per `approval` (status SPV), atau
  per `pengadaan` (status pengadaan).
- Filter periode `report-month` diisi otomatis dari data yang ada
  (`populateReportMonths()`, `index.html:3177`).
- Empat kartu rekap: Total, Menunggu, Disetujui, Ditolak.
- Export CSV (`exportReportCsv()`) dan Excel `.xlsx` (`exportReportXlsx()`).
- Menu Monthly Report tersedia untuk role **Supervisor 1** dan **Manager**
  (`index.html:1953` dan `index.html:2066`).

Jadi kebutuhan "grafik di web" secara faktual **sudah terpenuhi**.

### 2.2 Temuan penting: chart di web tidak memakai endpoint laporan

- `loadReport()` (`index.html:3263`) memanggil `fetchPengajuan()`, yang menarik
  `/api/pengajuan/all` (**seluruh** pengajuan tanpa filter).
- Semua agregasi dan chart dihitung di sisi browser.
- Endpoint `/api/reports/monthly` (`src/routes/api.js:46`) sudah ada di backend
  (`bqController.js:705`), tetapi **tidak dipakai** oleh halaman Monthly Report.
  Endpoint itu sekarang hanya dipakai oleh QA test dan skrip export otomatis.

Dampaknya: browser menarik ribuan baris hanya untuk menggambar satu
grafik. Ini boros dan tidak scalable.

### 2.3 Temuan penting: ada dua definisi "disetujui" yang berbeda

| Sumber | Dasar hitung menunggu | Dasar hitung disetujui | Dasar hitung ditolak |
|---|---|---|---|
| Web (`summarize()`, `index.html:3146`) | `status_approval_spv` | `status_approval_spv` | `status_approval_spv` |
| Backend (`getMonthlyReport`, `bqController.js:738`) | `status_approval_spv` **dan** manager | `status_approval_manager` | manager **atau** SPV |

Artinya angka pada kartu di web bisa **berbeda** dari angka yang sama kalau
diambil dari `/api/reports/monthly`. Salah satu definisi harus dipilih dan
diseragamkan, kalau tidak laporan bisa dipertanyakan saat demo.

Angka yang terlihat sekarang (1525 total, 133 menunggu, 1127 disetujui,
265 ditolak) memakai definisi **SPV**. Perhatikan 133 + 1127 + 265 = 1525,
jadi konsisten dengan definisi SPV.

### 2.4 Link Looker Studio hidup, tapi tidak sinkron dengan aplikasi

- Link di `index.html:691` diarahkan ke
  `https://lookerstudio.google.com/reporting/9bb14be8-f9d4-458e-9811-a89e9c8bb216`.
- Pengujian production: **HTTP 200**, panjang 76.330 byte, redirect ke
  `datastudio.google.com`. Tidak ada pesan "you need access", tetapi halaman
  memuat alur login Google (`accounts.google.com`). Artinya pengguna harus punya
  akun Google dan **berhak akses** ke report tersebut.
- **Tidak ada sinkronisasi data** dari database aplikasi ke Google Sheets:
  - `src/config/googleSheets.js` ada, tetapi **tidak di-require** di mana pun
    pada `src/`. Modul ini sisa kode lama.
  - Tidak ada `vercel.json` dengan `crons`, dan tidak ada job terjadwal lain.
  - Satu-satunya hal yang tercatat terkait Google Sheets adalah
    `MASTER_SPREADSHEET_ID` di `.env.example`, yang tidak lagi dipakai.

Konsekuensi: angka di Looker Studio berasal dari Google Sheet terpisah yang
diisi manual. **Angka Looker tidak dijamin sama dengan angka aplikasi**, dan
justru itu risiko besar kalau dipakai sebagai laporan resmi presentasi.

### 2.5 Yang masih menggantung di dokumen pengujian

`tests/TEST-PLAN.md` baris 283 masih mencatat:

| ID | Kondisi sekarang | Yang diperlukan |
|---|---|---|
| REP-11 | Format mengikuti versi aplikasi | **Format final Monthly/Min-Max Report** dari Ka Fadhil |

Jadi keputusan ini memang masih menunggu jawaban Ka Fadhil.

---

## 3. Opsi yang dipertimbangkan

### Opsi A — Pertahankan chart di web, Looker jadi tautan sekunder (REKOMENDASI)
Chart.js tetap jadi Monthly Report resmi. Link Looker tetap ada di header modal,
diberi label bahwa itu laporan versi lama/mgmt.

- Kelebihan: data dijamin sama dengan sistem, karena satu sumber data.
- Kelebihan: tidak ada ketergantungan login Google.
- Kelebihan: sesuai dengan bukti yang sudah dikumpulkan (test REP lulus, UAT
  ekspor Excel lulus, screenshot sudah ada di `docs/evidence/`).
- Kelebihan: Looker tetap bisa dipakai manajemen tanpa menghapus jalan
  keluar tersebut.
- Kekurangan: analitik lanjutan (drill-down, filter kompleks) terbatas.

### Opsi B — Ganti dengan link langsung ke Looker Studio
Tombol Monthly Report langsung membuka Looker di tab baru.

- Kelebihan: cepat, tidak ada kode tambahan.
- Kekurangan: **data Looker tidak sinkron dengan database aplikasi** (bagian 2.4).
- Kekurangan: login Google dan hak akses masih diperlukan. Kalau penguji tidak
  punya akses, tombol tersebut bisa menjadi kendala saat pengujian.
- Kekurangan: menghapus rekap angka yang sudah jadi bagian dari klaim produk.
- **Ditolak.**

### Opsi C — Embed Looker Studio di dalam aplikasi via `iframe`
- Kekurangan: Looker Studio umumnya menolak pemuatan di dalam `iframe` tanpa
  allowlist pada header, dan tetap membutuhkan login Google.
- Kekurangan: tidak ada keuntungan nyata. **Ditolak.**

---

## 4. Keputusan yang diambil (menunggu persetujuan)

### 4.1 Monthly Report resmi tetap di dalam web
Chart.js di `index.html` menjadi sumber laporan bulanan yang dipakai saat
demo dan presentasi.

### 4.2 Link Looker tetap, tapi dilabeli
Label diubah dari sekadar "Looker Studio" menjadi
**"Looker Studio (laporan lama, dikelola mgmt)"** supaya tidak disalahartikan
sebagai laporan yang sama dengan aplikasi.

### 4.3 Rapikan dua masalah teknis (bukan perubahan fitur)
Keduanya perlu dikerjakan karena menyangkut laporan yang dipakai saat presentasi:

1. **Pakai endpoint laporan untuk chart, bukan menarik semua data.**
   Chart di web diubah agar mengambil `/api/reports/monthly?year=&month=`
   per periode terpilih, bukan `/api/pengajuan/all`. Ini mengurangi beban
   browser dan membuat sumber data chart eksplisit satu endpoint.
2. **Seragamkan definisi status.** Pilih satu definisi baku untuk
   menunggu/disetujui/ditolak, lalu pakai definisi yang sama di web dan backend.
   Rekomendasi: **status SPV** untuk kartu "Menunggu/Disetujui/Ditolak" pada
   Monthly Report, karena itu yang sedang dipantau bulanan, dan tambahkan
   metrik terpisah untuk yang sudah **full approve** (SPV + Manager) agar
   Rekapan Pengajuan dan Monthly Report tidak saling bertentangan.

### 4.4 Looker Studio tidak dijadikan sumber angka
Looker hanya ditampilkan sebagai tautan referensi/arsip, bukan bagian dari
jalur data aplikasi.

---

## 5. Pertanyaan untuk Ka Fadhil

1. **Format final Monthly Report** apa yang dipakai? Apakah cukup empat kartu
   rekap + satu grafik, atau perlu tambahan (misal grafik per mesin, per
   urgency, atau per status pengadaan dalam satu tampilan)?
2. Apakah **Looker Studio masih dipakai manajemen**? Kalau ya, mohon dibagikan
   link resmi yang aktif beserta hak aksesnya, karena link yang ada di aplikasi
   sekarang tampaknya milik satu akun dan tidak bisa diakses sembarang orang.
3. Siapa yang **boleh melihat seluruh data** laporan? Kalau Monthly Report
   untuk Supervisor 1 sudah hanya timnya sendiri, definisinya perlu
   disesuaikan dengan keputusan dasbor Supervisor (lihat
   `docs/KEPUTUSAN-DASBOR-SUPERVISOR.md`).
4. Apakah perlu ada **ekspor data mentah** (bukan hanya rekap per kategori)?
   Sekarang export hanya berisi kolom label + jumlah.

---

## 6. Estimasi dampak (jika disetujui)

- `public/index.html`:
  - Ganti pemanggilan `fetchPengajuan()` di `loadReport()` menjadi pemanggilan
    endpoint laporan per periode. Estimasi 40-70 baris berubah.
  - Ubah label tombol Looker. Estimasi 1 baris.
  - Widget `summarize()` untuk memakai definisi status baku. Estimasi
    10-15 baris.
- `src/controllers/bqController.js`:
  - Pastikan `getMonthlyReport()` mengembalikan metrik full approve dan
    per-urgency, sehingga web tidak perlu menghitung ulang dari data mentah.
    Estimasi 10-20 baris.
- `public/qa-test.html`:
  - Tambah test yang membandingkan angka kartu web dengan angka endpoint, supaya
    tidak lagi bisa berbeda diam-diam. Estimasi 15-25 baris.
- `tests/TEST-PLAN.md`:
  - REP-11 ditutup setelah format final dikonfirmasi.
- Tidak ada migrasi database. Tidak ada downtime.

---

## 7. Catatan bahwa ini belum final

Dokumen ini adalah **usulan teknis**, bukan keputusan final. Angka dan definisi
status yang dipakai masih menunggu jawaban Ka Fadhil untuk pertanyaan di
bagian 5. Jangan dipakai sebagai dasar klaim di dokumen Bab IV/M8 sebelum
disetujui.
