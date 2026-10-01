# Keputusan: Menu PR Summary (data keseluruhan, tanpa tombol approve)

Status: **MENUNGGU KONFIRMASI KA FADHIL**
Tanggal: 30 Sep 2026
Penulis: Tim capstone (bahasan keputusan, belum ada perubahan kode)

Belum ada perubahan kode yang dibuat untuk keputusan ini.

---

## 1. Pertanyaan Ka Fadhil

> "Terus ini di menu PR Summary, isinya data PR keseluruhan harusnya, soalnya
> di menu yang approval BQ ini ada lagi buat approve."

Artinya ada dua permintaan sekaligus:

1. **PR Summary harus berisi data PR keseluruhan**, bukan hanya yang menunggu.
2. **Tombol approve/reject di PR Summary sebaiknya dihapus**, karena sudah ada
   di menu Approval BQ.

---

## 2. Temuan (hasil baca kode dan pengujian production)

### 2.1 PR Summary sekarang hanya berisi pengajuan yang Menunggu

Query di `src/controllers/bqController.js:558-578` (kedua cabang) selalu
memakai kondisi:

```sql
WHERE bq.status_approval_spv = 'Menunggu'
```

Hasil pengujian production pada 30 Sep 2026:

| Angka | Nilai |
|---|---|
| Total pengajuan di sistem (`/api/pengajuan/all`) | **1.535** |
| `status_approval_spv = 'Menunggu'` | **140** |
| `status_approval_spv = 'Disetujui'` | 1.130 |
| `status_approval_spv = 'Ditolak'` | 265 |
| Jumlah yang ditampilkan PR Summary (`count`) | **140** |

Jadi PR Summary baru menampilkan sekitar **9%** dari total pengajuan.
Pernyataan Ka Fadhil benar.

### 2.2 PR Summary punya tombol approve/reject yang dobel dengan Approval BQ

- `renderPrSummary()` (`index.html:3308-3309`) membuat tombol Approve dan
  Reject pada setiap kartu.
- Handler di `index.html:3316-3329` mengirim
  `status_approval_spv: approved|rejected`.
- Menu **Approval BQ** (`openApprovalModal()`, `index.html:2769`) punya tombol
  approve/reject yang sama persis, plus tombol Riwayat, dropdown Urgensi, dan
  dropdown Status Pengadaan (`renderApprovalTable()`, `index.html:2927-3018`).

Artinya ada **dua tempat untuk melakukan aksi yang sama**, dan PR Summary yang
sederhana justru tidak bisa menentukan Urgensi saat itu juga. Ini berisiko:
Supervisor bisa menyetujui pengajuan dari PR Summary tanpa pernah mengisi
Urgensi, padahal Urgensi dipakai sebagai KPI di Monthly Report.

### 2.3 Approval BQ sudah mencakup semua isi PR Summary, dan lebih lengkap

`refreshApprovalTable()` (`index.html:2793`) memanggil `fetchPengajuan()` yang
mengambil `/api/pengajuan/all` **tanpa filter**, yaitu seluruh 1.535 baris.
Jadi tabel Approval BQ sudah memuat 140 baris yang sama dengan PR Summary,
ditambah 1.395 baris lainnya.

Perbandingan fitur:

| Fitur | PR Summary | Approval BQ |
|---|---|---|
| Cakupan data | 140 (hanya Menunggu) | 1.535 (semua) |
| Pencarian | Tidak ada | Ada (`approval-search`) |
| Filter status | Tidak ada | Ada (`approval-filter`) |
| Paginasi | Tidak ada | Ada, 25 baris per halaman |
| Export Excel | Tidak ada | Ada (`btn-approval-xlsx`) |
| Dropdown Urgensi | **Tidak ada** | Ada |
| Dropdown Status Pengadaan | Tidak ada | Ada |
| Tombol Riwayat / audit trail | Tidak ada | Ada |
| Refresh otomatis 20 detik | Tidak ada | Ada |
| Kolom `item_code` & deskripsi barang | **Tidak ada** | Ada |
| Kolom No. EJO | **Tidak ada** | Ada |
| Kolom status approval Manager | **Tidak ada** | Ada |

Kolom yang dikembalikan endpoint PR Summary hanya 11 field
(`no_registrasi, qty_diminta, spesifikasi_lengkap, mesin_area, purpose,
status_pengadaan, timestamp, jenis_pengajuan, urgency, nama_teknisi,
role_pengajuan`). Field `item_code`, `deskripsi_barang`, `no_ejo`,
`status_approval_manager`, dan `uom` **tidak diambil**, sehingga PR Summary
secara teknis tidak mungkin menampilkan data PR yang lengkap.

### 2.4 Ketidaksesuaian hak akses antara menu dan backend

| Lapisan | Supervisor 1 | Manager | Supervisor 2 | Officer | Teknisi |
|---|---|---|---|---|---|
| Backend `getPengajuanSummary()` | 200 | 200 | 403 | 403 | 403 |
| Menu di `getMenu()` (`index.html:1947`) | **ada** | **tidak ada** | tidak ada | tidak ada | tidak ada |

Backend mengizinkan Manager, tetapi menu PR Summary **hanya dimunculkan untuk
Supervisor 1**. Artinya Manager punya endpoint yang bisa diakses tapi tidak ada
tombolnya. Test `RBAC-14` di `public/qa-test.html:671-684` menguji endpoint,
bukan menu, jadi ketidaksesuaian ini tidak tertangkap test.

### 2.5 Catatan: angka total bergerak

Dokumen sebelumnya mencatat 1.525 total. Sekarang 1.535. Selisih 10 baris
berasal dari test QA yang membuat pengajuan baru (misalnya `RBAC-15` dan
`APP-13`). Ini bukan bug, tapi penting diketahui supaya angka yang dipakai di
presentasi selalu diambil dari database terbaru.

---

## 3. Opsi yang dipertimbangkan

### Opsi A — Hapus menu PR Summary (REKOMENDASI)
Hapus PR Summary sepenuhnya. Semua urusan approval dan pengamatan PR
pakai Approval BQ.

- Kelebihan: tidak ada duplikasi, tidak ada dua tempat approve, tidak ada
  risiko approve tanpa Urgensi.
- Kelebihan: satu tempat truth, mudah dijelaskan saat demo.
- Kekurangan: kehilangan nama "PR Summary" yang mungkin sudah dikenal
  manajemen dari sistem lama.
- Kekurangan: perlu meyakinkan bahwa Approval BQ memang sudah setara lengkap.

### Opsi B — PR Summary jadi tampilan baca-saja (read-only)
Pertahankan menunya, ubah isinya menjadi **data PR keseluruhan** dengan
pencarian, filter, paginasi, dan export. **Hapus tombol approve/reject**,
ganti dengan tombol "Buka di Approval BQ" untuk Featured.

- Kelebihan: memenuhi permintaan Ka Fadhil secara literal.
- Kelebihan: PR Summary jadi laporan, Approval BQ jadi tempat kerja.
- Kelebihan: tetap ada nama "PR Summary" untuk backwards compatibility.
- Kekurangan: ada dua tampilan atas data yang sama (risiko angka berbeda
  kalau filter tidak sinkron). Mitigasi: kedua tampilan wajib baca dari
  endpoint yang sama.

### Opsi C — Perbaiki sebagian saja
Biarkan PR Summary hanya menampilkan yang Menunggu, tapi hapus tombol
approve/reject saja.

- Kelebihan: perubahan paling kecil.
- Kekurangan: **tidak menjawab permintaan utama Ka Fadhil**, yaitu PR Summary
  harus berisi data PR keseluruhan.
- **Ditolak.**

---

## 4. Keputusan yang diambil (menunggu persetujuan)

### 4.1 Pemisahan tanggung jawab (prinsip utama)

| Menu | Peran | Tombol aksi |
|---|---|---|
| **PR Summary** | Melihat dan memantau seluruh data PR | **Tidak ada** |
| **Approval BQ** | Bekerja: approve/reject, isi Urgensi, ubah Status Pengadaan | Ada |

Aturan: **hanya Approval BQ yang boleh mengubah status pengajuan.** PR Summary
menjadi laporan.

### 4.2 PR Summary menampilkan data PR keseluruhan
- Sumber data: seluruh pengajuan, bukan hanya yang Menunggu.
- Wajib ada: pencarian, filter status, paginasi, export Excel.
- Wajib menampilkan `item_code`, deskripsi barang, No. EJO, status approval
  SPV **dan** Manager, Urgensi, dan Status Pengadaan. Kolom ini harus
  ditambahkan ke query backend.
- Default buka: filter status "Menunggu" supaya Supervisor tetap bisa
  fokus ke antrean, dengan angka total keseluruhan tetap terlihat.

### 4.3 Tombol approve/reject dihapus dari PR Summary
- Diganti tombol **"Buka di Approval BQ"** yang membuka Approval BQ pada
  nomor registrasi yang sama.
- Alasan teknis: PR Summary tidak punya dropdown Urgensi, jadi approve dari
  sana menghasilkan pengajuan tanpa Urgensi. Ini merusak KPI Monthly Report.

### 4.4 Satu sumber data untuk kedua menu
PR Summary dan Approval BQ **wajib** membaca dari endpoint yang sama agar
angka tidak pernah berbeda. Kalau keduanya memakai query terpisah, cepat atau
lambat angkanya akan tidak sinkron.

### 4.5 Sinkronkan menu dan hak akses
- Jika Manager memang perlu melihat PR Summary, tombolnya harus
  dimunculkan di `getMenu()` untuk Manager. Kalau tidak, hak akses backend
  untuk Manager sebaiknya dicabut supaya tidak ada endpoint yatim.
- Tambahkan test yang memeriksa **menu**, bukan hanya endpoint, supaya
  ketidaksesuaian seperti bagian 2.4 tertangkap.

---

## 5. Pertanyaan untuk Ka Fadhil

1. **Apakah "PR Summary" masih perlu ada sebagai nama menu**, atau boleh
   diganti nama yang lebih jelas misalnya "Laporan Pengajuan"? Kalau perlu
   dipertahankan, isi jadi read-only seperti usulan di atas.
2. **Apakah Manager juga boleh melihat PR Summary?** Saat ini backend mengizinkan
   Manager tetapi menunya tidak ada. Pilih salah satu: tampilkan menunya, atau
   cabah akses backend.
3. **Apakah PR Summary perlu difilter per tim** (Supervisor 1 hanya timnya
   sendiri) seperti keputusan dasbor Supervisor, atau tetap seluruh data?
   Supaya konsisten dengan `docs/KEPUTUSAN-DASBOR-SUPERVISOR.md`.
4. **Apakah PR Summary perlu menampilkan riwayat/audit trail**, atau cukup data
   status terakhir saja karena Riwayat sudah ada di Approval BQ?

---

## 6. Estimasi dampak (jika disetujui)

- `src/controllers/bqController.js`:
  - `getPengajuanSummary()` berubah dari query "Menunggu" menjadi query penuh
    dengan parameter filter dan paginasi. Estimasi 60-90 baris.
  - Tambah kolom `item_code`, `deskripsi_barang`, `no_ejo`, `uom`,
    `status_approval_manager`. Estimasi 5 baris per query.
- `public/index.html`:
  - `renderPrSummary()` dari daftar kartu sederhana menjadi tabel dengan
    pencarian, filter, dan paginasi. Estimasi 120-180 baris.
  - Hapus handler approve/reject PR Summary (sekitar 15 baris), ganti pintasan
    ke Approval BQ.
  - `getMenu()` disesuaikan untuk Manager bila disetujui.
- `public/qa-test.html`:
  - Ubah `APP-12` agar memeriksa jumlah data PR Summary, bukan hanya "array".
  - Tambah test yang membandingkan angka PR Summary dengan `/api/pengajuan/all`
    untuk status yang sama.
  - Tambah test ketersediaan menu per role.
  - Estimasi 40-60 baris.
- `docs/M3-ARSITEKTUR-DAN-WIREFRAME.md` dan `docs/M8-EVALUASI-PRODUK.md`:
  - Perlu diperbarui karena PR Summary berubah sifatnya.
- Tidak ada migrasi database. Tidak ada downtime.

---

## 7. Konfirmasi dari tangkapan layar "Monitoring & Approval BQ"

Ka Fadhil kemudian mengirim tangkapan layar menu **Monitoring & Approval BQ**
dengan pesan singkat: *"Nah ini ada lagi fitur buat approve."*

Tangkapan layar itu **membuat masalah di bagian 2.2 terkonfirmasi**. Dua tempat
approve yang dimaksud sudah terbukti keduanya ada di produk:

| Menu | Tombol approve | Dropdown Urgensi | Bukti |
|---|---|---|---|
| PR Summary | Ada (`index.html:3308-3309`) | **Tidak ada** | Tangkapan layar PR Summary |
| Monitoring & Approval BQ | Ada (`index.html:2967-2972`) | **Ada** | Tangkapan layar ini |

Jadi bukan lagi perkiraan: memang ada dua jalur approval yang sama-sama aktif.
Rekomendasi pada bagian 4.1 (hanya Approval BQ yang boleh mengubah status)
dipertahankan.

### 7.1 Kesesuaian tangkapan layar dengan kode

Seluruh elemen pada tangkapan layar sudah cocok dengan implementasi:

| Elemen di gambar | Lokasi di kode |
|---|---|
| Judul "Monitoring & Approval BQ" | `index.html:599` |
| Subjudul "Approval 2 tahap (Supervisor → Manager) - otomatis refresh tiap 20 detik" | `index.html:600` |
| Tombol Refresh | `index.html:603-606` |
| Placeholder "Cari no. registrasi / teknisi / item / EJO..." | `index.html:617` |
| Filter "Semua Status" | `index.html:622` |
| Tombol Excel | `index.html:627` |
| Sembilan kolom tabel | `index.html:640-648` |
| Badge SPV / MGR bertumpuk | `approvalBadgePair()`, dipakai `index.html:3013` |
| Badge "BQ BARU" / "PROSES PO" | `STATUS_PENGADAAN`, `index.html:2718` |

Tidak ada elemen di gambar yang tidak ada di kode.

### 7.2 Temuan baru: format nomor registrasi tidak konsisten

Dua tangkapan layar itu memperlihatkan dua format nomor registrasi berbeda:

| Format | Contoh dari gambar | Jumlah di production |
|---|---|---|
| Format baru `BQ-YYYYMMDD-NNNN` | `BQ-20260929-1374` (Approval BQ) | 70 |
| Format lama `BQ-YYYY-MM-DD-NNNN` | `BQ-2025-01-04-0004` (PR Summary) | 200 |
| Format impor asli `XXXYYNNNN` | `WAPBR0012`, `SFHRO0062` | **1.265** |

Script `buildNoRegistrasi()` di `src/controllers/bqController.js:4-10`
menghasilkan `BQ-${YYYYMMDD}-${suffix}` dengan suffix 4 digit terakhir dari
`Date.now()`. Dua masalah:

1. **Data lama tidak pernah dinormalisasi.** 1.465 dari 1.535 baris (95%)
   masih memakai format lama atau format impor asli.
2. **Suffix berpotensi bertabrakan.** `Date.now().toString().slice(-4)` hanya
   mengambil 4 digit terakhir milidetik, sehingga dua pengajuan pada milidetik
   yang sama bisa menghasilkan nomor sama. Tidak ada penomoran berurutan di
   database.

Dampaknya kecil untuk approve, tapi terlihat saat presentasi: nomor registrasi
pada tabel tidak seragam, dan reviewer bisa bertanya kenapa formatnya
berbeda-beda.

### 7.3 Angka pada tangkapan layar sudah lama

Tangkapan layar menampilkan "1525 pengajuan ditemukan". Angka di production
sekarang **1.535**. Bedanya 10 baris, berasal dari pengajuan yang dibuat oleh
test QA (`RBAC-15` dan `APP-13`). Angka di presentasi harus diambil ulang dari
database terbaru.

---

## 8. Gabungan dengan chat 4: tampilan "BQ Summary" versi lama

Ka Fadhil mengirim tangkapan layar modal **"BQ Summary"** dengan pesan
*"inii kaya kemaren yaa, tapi dikasih kaya gini jugaa gapapa sih"*.

### 8.1 Screenshot itu adalah versi lama, bukan bug

Diverifikasi lewat riwayat git. Commit `c51fd9d` mengubah modal ini.

| Aspek | Versi lama (`c51fd9d^`) | Versi sekarang (`c51fd9d`) |
|---|---|---|
| Judul modal | "BQ Summary" | "Rekapan Pengajuan" |
| Subjudul | "Ringkasan & status seluruh pengajuan BQ" | tidak ada |
| Label kartu pertama | "Total Pengajuan" | "Total Disetujui Penuh" |
| Cakupan data | **seluruh** pengajuan | **hanya yang full approve** |
| Endpoint | `/api/pengajuan/all` | `/api/pengajuan/bq-summary` |
| Isi rincian | Status SPV **dan** Manager, pipeline | Rekap per teknisi, pipeline |
| Banner penjelasan | tidak ada | "Hanya pengajuan yang sudah disetujui Supervisor dan Manager" |

Kode versi lama masih ada di `c51fd9d^:public/index.html`, jadi tidak ada
kemungkinan kehilangan. Sifat angka pada screenshot juga cocok dengan versi
lama: SPV Menunggu 132, Disetujui 1128, Ditolak 265 (total 1.525) — seluruhnya
menghitung semua pengajuan, bukan hanya yang disetujui penuh.

### 8.2 Ini mengubah proposals di bagian 4

Permintaan chat 4 ternyata **sama** dengan permintaan chat 3: Supervisor ingin
melihat seluruh data pengajuan, lengkap dengan rinciannya.

Tiga menu sekarang overlapping dan membingungkan:

| Menu | Cakupan | Ada aksi? | Nama mirip? |
|---|---|---|---|
| PR Summary | 140 (hanya Menunggu) | **Ya, approve** | ya |
| Monitoring & Approval BQ | 1.535 (semua) | Ya, approve | tidak |
| Rekapan Pengajuan | **30** (full approve saja) | tidak | ya |

Dua masalah nyata:

1. **PR Summary dan Rekapan Pengajuan sama-sama read-only**(sejak tombol
   approve dicabut) dan namanya mirip. Supervisor akan bingung memilih yang
   mana.
2. **Tampilan "semua pengajuan" yang lengkap justru hilang.** Versi lama BQ
   Summary punya rincian SPV + Manager + pipeline untuk seluruh data.
   Sekarang informasi itu tidak tersedia di mana pun dalam satu layar, karena
   PR Summary tidak punya rincian tersebut dan Rekapan Pengajuan hanya
   menampilkan yang full approve.

### 8.3 Usulan terbaru: satu menu, dua tab

Gabungkan PR Summary dan Rekapan Pengajuan menjadi **satu menu** dengan dua
tab, dan kembalikan tampilan versi lama sebagai tab pertama.

**Menu: "Rekapan Pengajuan"** (read-only, tidak ada tombol approve)

| Tab | Isi | Sumber |
|---|---|---|
| **Semua Pengajuan** | Kartu total, rincian Urgent/Normal, **rincian SPV + Manager**, pipeline pengadaan, filter periode | `/api/pengajuan/all` dengan agregasi server |
| **Disetujui Penuh** | Kartu total, **rekap per teknisi**, pipeline | `/api/pengajuan/bq-summary` (ada) |

Ditambah satu tombol **"Buka di Approval BQ"** untuk pengajuan yang perlu
ditindak.

**Kenapa ini lebih baik:**

- Menghapus duplikasi nama menu (PR Summary dan Rekapan Pengajuan hilang
  sebagai menu terpisah).
- Memenuhi permintaan chat 3: data keseluruhan ada, dan approve hanya di
  Approval BQ.
- Memenuhi permintaan chat 4: tampilan versi lama dikembalikan, justru
  dengan data yang lebih lengkap karena sekarang bisa difilter per periode.
- Hanya butuh satu endpoint tambahan untuk agregasi, kode versi lama sudah ada
  di riwayat git sebagai titik awal.

**Konsekuensi yang harus diterima:**

- Menu PR Summary sebagai nama akan hilang. Kalau nama itu harus tetap ada
  (misalnya sudah dikenal manajemen), alternatifnya PR Summary tetap menjadi
  menunya dan tab "Disetujui Penuh" yang dibuang, karena isinya paling sempit.
- Pemisahan tabel approval dengan tabel rekap per teknisi jadi satu modal.
  Kalau terlalu padat, bisa dibuat dua halaman dengan menu terpisah seperti
  sekarang, tapi dengan nama yang jelas.

---

## 9. Pertanyaan tambahan hasil penggabungan chat 3 dan chat 4

Lima pertanyaan ini menggantikan sebagian pertanyaan di bagian 5 supaya tidak
membingungkan:

1. **Nama menu mana yang dipakai**: "Rekapan Pengajuan" dengan dua tab
   (usulan di 8.3), atau tetap "PR Summary"?
2. **Apakah tab "Semua Pengajuan" perlu difilter per periode (bulan/tahun)?**
   Versi lama menampilkan seluruh riwayat sekaligus. Dengan 1.535 baris,
   filter periode kemungkinan besar lebih berguna daripada tanpa filter.
3. **Apakah rincian status Manager perlu ditambahkan ke tab "Semua Pengajuan"?**
   Versi lama sudah menampilkannya (Menunggu/Disetujui/Ditolak Manager), dan
   itu informasi berguna untuk melihat backlog approval.
4. **Tombol approve di PR Summary**: tetap dihapus sesuai bagian 4.3, atau
   dibiarkan dengan konfirmasi tambahan? Rekomendasi tetap dihapus karena
   tidak ada dropdown Urgensi di sana.
5. **Pertanyaan lama bagian 5 nomor 2 dan 4 masih berlaku**: hak akses Manager
   atas PR Summary, dan perlunya riwayat/audit trail.

---

## 11. Ka Fadhil melihat versi lama (cache browser)

Penyebab chat #4 sudah jelas: Ka Fadhil membuka web **sebelum** update terakhir
terdeploy, jadi yang dia lihat adalah tampilan versi lama.

### 11.1 Production sudah memakai kode terbaru

Pemeriksaan langsung ke `https://e-sparepart-system-tau.vercel.app/index.html`:

| Penanda versi baru | Ada di production? |
|---|---|
| Judul "Rekapan Pengajuan" | **Ya** |
| Label "Total Disetujui Penuh" | **Ya** |
| Judul lama "BQ Summary" | **Tidak** |
| Perbaikan Layout Rak (`const dobel`) | **Ya** |

Commit terbaru yang sudah live: `43d0675`. Artinya production **sudah benar**,
yang perlu diperbaiki hanya sisi klien Ka Fadhil.

### 11.2 Cara memastikan Ka Fadhil melihat versi terbaru

Minta Ka Fadhil membuka ulang dengan hard refresh:

- **Chrome/Edge di PC:** `Ctrl` + `Shift` + `R`
- **Chrome di HP:** buka menu tiga titik, pilih "Reload" (pada beberapa
  perangkat perlu tombol "Hard reload" di menu Developer)
- **Safari di iPhone:** tombol bagikan, lalu "Reload from Origin"
- Bila masih sama, buka lewat jendela penyamaran (incognito) untuk memastikan
  bukan cache.

### 11.3 Daftar perubahan yang harus dia lihat setelah refresh

Gunakan daftar ini sebagai alat verifikasi. Kalau salah satu tidak terlihat,
berarti masih cache.

| # | Yang harus terlihat | Lama → Baru |
|---|---|---|
| 1 | Nama menu | "BQ Summary" **tidak ada lagi**, diganti "Rekapan Pengajuan" |
| 2 | Kartu pertama di modal rekap | Label "Total Pengajuan" → **"Total Disetujui Penuh"** |
| 3 | Banner hijau di atas kartu | Muncul tulisan "Hanya pengajuan yang sudah disetujui Supervisor dan Manager yang dihitung di sini" |
| 4 | Bagian rincian | Rincian SPV/Manager diganti **"Rekap per Teknisi"** |
| 5 | Menu Teknisi | "Rekapan Pengajuan" dengan keterangan "Rekapan pengajuan tim yang sudah disetujui penuh" |
| 6 | Halaman Layout Rak | Kolom Lokator terisi dan rapi (perbaikan `43d0675`) |
| 7 | Halaman QA | `https://e-sparepart-system-tau.vercel.app/qa-test.html` — tombol "Jalankan Semua" bisa dipakai |

### 11.4 Konsekuensi untuk proses review

Karena tangkapan layar bisa berasal dari versi lama, **wajib diperiksa** setiap
tangkapan layar baru:

1. Cek apakah nama menu dan label di gambar masih cocok dengan kode sekarang.
2. Kalau tidak cocok, minta tangkapan layar ulang setelah hard refresh
   **sebelum** mencatatnya sebagai permintaan perubahan.
3. Jangan langsung mengubah kode untuk keluhan yang sebenarnya sudah diperbaiki.

Nomor registrasi pada tangkapan layar juga bisa berbeda karena test QA
menambah pengajuan baru. Ambil angka dari database saat ini.

---

## 12. Catatan bahwa ini belum final

Dokumen ini adalah **usulan teknis**. Keputusan soal nama menu, cakupan data
per tim, dan hak akses Manager masih menunggu jawaban Ka Fadhil untuk
pertanyaan di bagian 5 dan 9. Jangan dipakai sebagai dasar klaim di dokumen
Bab IV atau M8 sebelum disetujui.
