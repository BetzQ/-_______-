# Keputusan: Dasbor Supervisor 1

Status: **SELESAI — DITERAPKAN DI KODE**
Tanggal: 30 Sep 2026 | Diperbarui: 10 Okt 2026
Penulis: Tim capstone (bahasan keputusan)
Implementasi: commit `0b1d5a5` dan `2e64030` (2 Okt 2026), QA 114/114 lulus

> **Catatan 10 Okt 2026:** Ka Fadhil tidak memberi jawaban tertulis atas
> pertanyaan bagian 5, sehingga keputusan di bagian 4 **diputuskan sendiri
> oleh tim** dengan pertimbangan teknis terbaik dan **sudah diterapkan**.
> Seluruh pertanyaan bagian 5 ditandai terjawab di bawah.

---

## 1. Pertanyaan yang masuk

"Dasbor Supervisor sekarang hanya berisi empat kartu stok. Perlukah ditambah
Antrean Approval / BQ Summary supaya Supervisor langsung tahu apa yang menunggu
aksinya tanpa harus klik PR Summary dulu? Bagaimana sebaiknya?"

---

## 2. Temuan (hasil baca kode dan data)

### Struktur saat ini

- `public/index.html` — section `kpi-section` (baris 216-264) berisi empat kartu
  stok global: **Total Sparepart**, **Critical Part**, **Stok Rendah (≤ Min)**
  dengan badge jumlah item di bawah minimum, dan **Stok Kosong (Habis)**.
  Untuk role `supervisor 1` tidak ada kartu approval di layar depan.
- Antrean approval sudah ada, tetapi tersembunyi di dalam modal PR Summary
  (`openPrSummaryModal()` lalu `renderPrSummary()`, sekitar baris 3280-3315).
- `src/controllers/bqController.js` — `getPengajuanSummary()` sudah menyediakan
  data antrean, **tetapi tidak punya parameter `filterTim` sama sekali**
  (sekitar baris 542-578).
- `src/controllers/userManagementController.js` — sudah ada relasi
  `users.supervisor_id`.
- `database/schema.sql` — kolom `users.supervisor_id` tersedia untuk filter
  per tim.

### Bukti masalah filter tim (production)

```
GET /api/pengajuan/summary?username=INN  -> count = 140
GET /api/pengajuan/summary?username=KSW  -> count = 140   (data identik)
GET /api/pengajuan/summary?username=ANS  -> 403
```

INN dan KSW mengembalikan 140 baris dengan isi sama persis. Ini **dua bug
terpisah**, keduanya perlu diperbaiki:

> ✅ **Status 10 Okt 2026 — dua-duanya sudah diperbaiki.** Bug A: cabang filter
> kini memakai `u.supervisor_id = actor.id` (`bqController.js:621`) dan
> menyalakan flag `filterTimAktif`. Bug B: penentuan tim diserahkan ke
> `scripts/setSupervisorIds.js` berbasis **username** sehingga hasilnya tidak
> bergantung urutan id. Bukti lama di bawah dipertahankan sebagai riwayat
> temuan.

**Bug A — branch filter salah membandingkan kolom.**
`bqController.js:565-567`:

```sql
WHERE bq.status_approval_spv = 'Menunggu' AND u.supervisor_id = $1
-- $1 diisi: actor.supervisor_id
```

`u.supervisor_id` berisi **id user supervisor** milik si teknisi. Seharusnya
dicocokkan dengan `actor.id` (id supervisor yang sedang login), bukan dengan
`actor.supervisor_id` (id supervisor dari si supervisor — yang wajar `null`).

Konsekuensinya, cabang ini mustahil benar:
- `supervisor_id` null → masuk `else`, lihat **seluruh** data (bocor antar tim).
- `supervisor_id` terisi → membandingkan dengan id yang salah, hasilnya
  0 baris, bukan data tim sendiri.

**Bug B — `resolveSupervisorId()` selalu memilih supervisor yang sama.**
`userManagementController.js:322-329` menerima nama role, lalu:

```sql
SELECT id FROM users WHERE LOWER(role) = {1} ORDER BY id ASC LIMIT 1
```

Dengan `LIMIT 1` dan `ORDER BY id ASC`, hanya ada **satu** supervisor yang
pernah bisa ditunjuk. Kalau ada Supervisor 1 (INN) dan Supervisor 2 (KAA),
semua teknisi yang di-approve pasti tertaut ke supervisor dengan `id` terkecil,
dan Supervisor 2 tidak akan punya teknisi sama sekali.

**Kesimpulan:** fitur filter tim belum pernah bekerja. Gejala "INN melihat 140
baris" konsisten dengan Bug A (`supervisor_id` INN null).

`GET /api/users` di production membalas 404, jadi nilai `supervisor_id` INN
tidak bisa dikonfirmasi langsung lewat API. ~~Perlu konfirmasi daftar pasangan
supervisor dan teknisi ke tim agar data `supervisor_id` bisa diperbaiki.~~
**Selesai 10 Okt 2026:** daftar pasangan ditetapkan sendiri oleh tim (bagian 5
nomor 1) dan sudah diterapkan ke produksi lewat `scripts/setSupervisorIds.js`.

---

## 3. Opsi yang dipertimbangkan

### Opsi A — Status quo
Empat kartu stok tetap. Supervisor harus klik PR Summary bila ingin tahu antrean.

- Kelebihan: tanpa perubahan, tanpa risiko.
- Kekurangan: Supervisor tidak tahu ada antrean yang perlu diproses sampai dia
  ingat untuk membuka PR Summary. Untuk role yang tugasnya approval, ini
  masalah operasional nyata.

### Opsi B — Tambah blok "Antrean Approval Saya" (REKOMENDASI)
Kartu stok tetap. Di bawahnya ditambah satu blok ringkas berisi pengajuan yang
menunggu approval Supervisor, diambil dari `getPengajuanSummary()` yang sudah ada.

- Kelebihan: data sudah tersedia di backend, tidak perlu endpoint baru.
- Kelebihan: menutup celah UX "Supervisor tidak tahu ada antrean".
- Kelebihan: risiko rendah, karena modal PR Summary yang sudah berjalan tetap
  dipakai sebagai halaman detail. Blok di dasbor hanya ringkasan dan pintasan.
- Kekurangan: perlu menentukan perilaku filter tim (lihat bagian 4).

### Opsi C — Ganti kartu stok dengan kartu approval
Kartu stok dihilangkan dari dasbor Supervisor.

- Kekurangan: kehilangan konteks kondisi stok yang selama ini menjadi nilai
  utama modul Critical Sparepart List. Tidak sebanding dengan tabel penilaian
  capstone. **Ditolak.**

---

## 4. Keputusan yang diambil (SUDAH DITERAPKAN, 2 Okt 2026)

### 4.1 Kartu stok tetap global
Empat kartu stok tidak diubah. Alasannya: kartu stok menampilkan kondisi
persediaan departemen, bukan milik satu tim. Membatasi atau menghilangkannya
akan mengurangi informasi tanpa alasan bisnis yang kuat.

### 4.2 Blok baru: "Antrean Approval Saya"
Letak: di bawah baris kartu stok, hanya untuk role `supervisor 1`.

Isi minimal yang masuk akal:
- Jumlah pengajuan yang menunggu approval.
- Tiga sampai lima baris terbaru (no registrasi, urgency, nama teknisi, qty).
- Tombol "Lihat Semua" yang memanggil `openPrSummaryModal()` yang sudah ada.

Logika approve/reject tidak dibuat ulang. Tetap dikerjakan di PR Summary.

### 4.3 Perilaku filter tim

| Role | Default | Sakelar |
|---|---|---|
| Supervisor 1 | **Tim Saya** | Ada toggle **Semua Tim** |
| Manager / Administrator | **Semua Tim** | Tidak perlu |

Alasannya:
- Default "Tim Saya" karena Supervisor hanya berwenang atas teknisi di
  bawahnya. Ini sejalan dengan konsep approval berjenjang dan prinsip RBAC
  yang sudah dipakai sistem.
- Toggle "Semua Tim" tetap disediakan karena ada Supervisor yang secara
  operasional perlu melihat seluruh departemen, misalnya saat menggantikan
  rekan yang cuti.
- Manager dan Administrator memang sudah berwenang atas seluruh tim, jadi tidak
  perlu filter tambahan.

### 4.4 `supervisor_id` kosong harus eksplisit
Ketika `supervisor_id` null di production, sistem tidak boleh diam-diam
menampilkan seluruh data. Minimal salah satu dari berikut harus dilakukan:
- Tampilkan peringatan di UI: "Filter tim tidak aktif karena supervisor_id
  belum diisi."
- Dan/atau fallback ke "Semua Tim" dengan penanda visual.

Rekomendasi: tampilkan peringatan eksplisit supaya masalah konfigurasi terlihat
dan tidak tersembunyi.

---

## 5. Pertanyaan untuk Ka Fadhil — SEMUA SUDAH DIJAWAB SENDIRI (10 Okt 2026)

Ka Fadhil tidak menjawab, jadi tim memutuskan sendiri. Jawaban di bawah sudah
menjadi bagian dari produk dan diuji QA.

| # | Pertanyaan lama | Keputusan tim (pengganti jawaban Ka Fadhil) | Status |
|---|---|---|---|
| 1 | Supervisor mana yang punya teknisi bawahan? | Pemetaan tim **hanya** lewat `scripts/setSupervisorIds.js`: **INN** = AAA, ANO, BDU, MOB, MRN, NDS · **MUN** = RIA, ROS, SFH, KFF, ERA · **KAA** = WAP, MCL. Sudah diterapkan ke produksi (13 teknisi nyata punya `supervisor_id`, 37 akun `qa_*` sisa uji otomatis mengikuti INN). Perubahan tim cukup edit MAPPING lalu `node scripts/setSupervisorIds.js --apply`. | ✅ selesai |
| 2 | INN — seharusnya punya tim atau tidak? | **INN memang punya tim** (6 teknisi). Gejala "INN melihat semua baris" dulu disebabkan Bug A (bandingan kolom salah) dan Bug B (`resolveSupervisorId`), **bukan** karena INN tanpa tim. Keduanya sudah lewat: antrean kini menyaring `supervisor_id` aktor dan menampilkan peringatan bila null. | ✅ selesai |
| 3 | Ada Supervisor yang default-nya "Semua Tim"? | **Tidak.** Seragam: semua Supervisor default **Tim Saya** + toggle **Semua Tim** (alasannya: persetujuan berjenjang + RBAC). Kalau nanti ada kebutuhan khusus, tinggal tambah satu baris konfigurasi per akun. | ✅ selesai |
| 4 | Antrean ringkasan 3–5 baris atau tabel lengkap? | **Ringkasan**: 1 kartu KPI + maksimal 5 baris terbaru + tombol **Lihat Semua** menuju modal Rekapan Pengajuan (tabel lengkap dengan cari/filter/export). Dasbor tetap ringkas, detail tetap tersedia satu klik. Diuji test **UI-23** ( Supervisor 1 tampil, Manager/Administrator/Teknisi disembunyikan). | ✅ selesai |

Bukti di kode: blok `approval-queue-section` (`public/index.html:286`),
sakelar `data-scope="tim"|"semua"` (`public/index.html:298`), pesan peringatan
`supervisor_id` kosong (`public/index.html:1403`).

---

## 6. Realisasi (bukan lagi estimasi)

- `public/index.html`: blok "Antrean Approval Saya" + wiring toggle filter — **sudah ada**.
- `src/controllers/bqController.js`: `getPengajuanSummary()` mendapat parameter
  filter tim dan pembanding `u.supervisor_id = actor.id` — **sudah ada**.
- `src/controllers/userManagementController.js`: `resolveSupervisorId()`
  memetakan tim ke akun supervisor; ketidakpastian akun `Supervisor 2` (MUN/KAA)
  diselesaikan oleh `scripts/setSupervisorIds.js` yang memakai **username**,
  bukan id — **sudah ada**.
- `public/qa-test.html`: test blok antrean, filter tim, dan penyembunyian blok
  untuk non-supervisor — **sudah ada** (UI-23).
- Tidak ada migrasi database. Tidak ada downtime.
