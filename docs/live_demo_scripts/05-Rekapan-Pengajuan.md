# 05 — REKAPEN PENGAJUAN

> **Peran yang performs:** **Administrator** (`ANS`) atau **Supervisor 2** (`KAA`)
> **Durasi:** ± 3 menit

---

## 🎯 TUJUAN

Menunjukkan **ringkasan pengajuan yang sudah disetujui penuh** (SPV ✅ + Manager ✅),
serta **distribusi status pengadaan** dari pipeline yang tadi Anda jalankan.

---

## ⚙️ SYARAT AWAL

- Sudah menyelesaikan file `04` sehingga ada pengajuan berstatus **Selesai**.

---

## LANGKAH 1 — Buka Modul (lewat pencarian dashboard)

1. **KLIK** kolom pencarian di bagian atas dashboard:
   > 🔍 *"Cari menu."*
2. **KETIK**: `Rekap`
3. **TUNGGU** ≈ 0,5 detik → grid menu ter-filter, hanya kartu
   **"Rekapan Pengajuan"** yang tersisa.
4. **KLIK** kartu **"Rekapan Pengajuan"**.
5. **TUNGGU** modal **"Rekapan Pengajuan"** terbuka.
6. **HAPUS** teks pencarian agar semua menu kembali tampil.

> 🗣️ **Ucapkan:**
> *"Menu bisa dicari. Untuk aplikasi dengan banyak modul, ini mempercepat
> navigasi saat presentasi."*

---

## LANGKAH 2 — Baca Sub-teks (poin penting)

1. **ARAHKAN** kursor ke sub-teks di bawah judul:

   > *"Rekap keseluruhan pengajuan dari semua teknisi yang **sudah disetujui
   > penuh** (SPV + Manager)"*

> 🗣️ **Ucapkan:**
> *"Modul ini **tidak** menampilkan semua pengajuan. Hanya yang sudah
> **full approve** — jadi datanya bersih, bukan setengah jadi."*

---

## LANGKAH 3 — Baca Isi Rekapan

1. **PERHATIKAN** bagian atas modal. Ada **4 kartu angka** (KPI):

   | KPI | Arti |
   |---|---|
   | **Total** | Jumlah pengajuan yang sudah full approve |
   | **Urgent** | Berapa yang berstatus urgensi Urgent |
   | **Normal** | Berapa yang berstatus urgensi Normal |
   | **Sparepart / Jasa** | Pecah menurut jenis barang |

2. **PERHATIKAN** bagian bawah: **pipeline status pengadaan** ditampilkan
   sebagai daftar chip — hanya status yang **punya isinya** yang muncul, misalnya:
   `BQ Baru (2)` · `Proses PO (1)` · `Selesai (1)`.

3. **Bandingkan** dengan file `04`. Pipeline di sini **cuma status yang ada
   isinya** — jadi kalau Anda baru mengubah 3 tahap tadi, di sini pun
   angkanya langsung ikut berubah.

> **Ucapkan:**
> *"Ini komposisi **real-time** dari database. Bar **Selesai** bertambah
> karena saya yang mengisinya di modul sebelumnya. Angka di sini bukan
> dihitung manual — langsung dari query."*

---

## LANGKAH 4 — Perhatikan Rincian Per Teknisi

1. **GESER** ke bawah, cari bagian **rincian per teknisi**.
2. **PERHATIKAN** nama teknisi beserta jumlah pengajuannya.

> **Ucapkan:**
> *"Rincian per teknisi membantu Manager melihat siapa yang paling sering
> mengajukan. Dari sini bisa dievaluasi, apakah volume permintaan itu wajar."*

---

## LANGKAH 5 — Demonstrasi Export

> ⚠️ **Catatan:** tombol Export ada di modul **On Hand Stock** (file `08`),
> bukan di modul ini. Kalau ingin menunjukkan export, lewati ke file `08`.

1. **KLIK** tombol **✕** di kanan atas untuk menutup modal.

---

## 📌 CATATAN PENTING

- Modul ini **tidak punya kolom pencarian**. Kalau ingin mencari pengajuan
  tertentu, gunakan **"Approval BQ Tahap Supervisor"** (file `03` / `04`) yang
  punya kolom "Cari no. registrasi / teknisi / item / EJO...".
- Kalau muncul teks **"Belum ada pengajuan disetujui penuh"**, artinya belum
  ada yang full approve → jalankan file `02` lalu `03` lebih dulu.
