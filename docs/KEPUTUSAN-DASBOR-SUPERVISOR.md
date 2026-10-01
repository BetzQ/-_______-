# Keputusan: Dasbor Supervisor 1

Status: **MENUNGGU KONFIRMASI KA FADHIL**
Tanggal: 30 Sep 2026
Penulis: Tim capstone (bahasan keputusan, belum ada perubahan kode)

Belum ada perubahan kode yang dibuat untuk keputusan ini.

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
tidak bisa dikonfirmasi langsung lewat API. Perlu konfirmasi daftar pasangan
supervisor dan teknisi ke tim agar data `supervisor_id` bisa diperbaiki.

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

## 4. Keputusan yang diambil (menunggu persetujuan)

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
| Manager / Officer | **Semua Tim** | Tidak perlu |

Alasannya:
- Default "Tim Saya" karena Supervisor hanya berwenang atas teknisi di
  bawahnya. Ini sejalan dengan konsep approval berjenjang dan prinsip RBAC
  yang sudah dipakai sistem.
- Toggle "Semua Tim" tetap disediakan karena ada Supervisor yang secara
  operasional perlu melihat seluruh departemen, misalnya saat menggantikan
  rekan yang cuti.
- Manager dan Officer memang sudah berwenang atas seluruh tim, jadi tidak
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

## 5. Pertanyaan untuk Ka Fadhil

1. **Supervisor mana saja** yang punya teknisi bawahan? Mohon daftar pasangan
   username supervisor dan username teknisi, atau data `supervisor_id` yang
   sudah benar.
2. **INN** — apakah memang seharusnya punya tim, atau memang tidak punya teknisi
   bawahan? Kalau memang tidak punya, kenapa datanya masih terlihat 140
   pengajuan?
3. Apakah ada Supervisor yang perlu melihat **Semua Tim** sebagai default,
   bukan hanya lewat toggle?
4. Blok "Antrean Approval Saya" cukup ringkasan 3-5 baris dengan tombol, atau
   perlu tabel lengkap langsung di dasbor?

---

## 6. Estimasi dampak (jika disetujui)

- `public/index.html`: tambah blok baru dan wiring toggle filter. Estimasi
  150-200 baris.
- `src/controllers/bqController.js`: perubahan sedang. `getPengajuanSummary()`
  perlu **ditambah** parameter filter tim (saat ini belum ada), dan kolom
  pembandingnya harus `u.supervisor_id = actor.id`.
- `src/controllers/userManagementController.js`: `resolveSupervisorId()` perlu
  diubah agar bisa menunjuk supervisor tertentu, bukan `ORDER BY id ASC LIMIT 1`.
- Perbaikan data: technician yang sudah tertaut ke supervisor yang salah harus
  ditelusuri ulang. Perlu akses `/api/users` atau kueri database langsung.
- `public/qa-test.html`: tambah test untuk blok baru, filter tim, dan kasus
  `supervisor_id` null.
- Tidak ada migrasi database karena kolom sudah ada.
- Tidak ada downtime.
