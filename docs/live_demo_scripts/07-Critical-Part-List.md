# 07 — CRITICAL PART LIST

> **Peran yang performs:** **Administrator** (`ANS` / `ANS1805`), Supervisor 1, atau Manager
> **Durasi:** 3 menit  |  **CATATAN: modul ini tidak tersedia untuk Teknisi**

---

## TUJUAN

Menampilkan daftar **sparepart kritis** - barang yang kalau habis akan
menghambat produksi. Ini fitur preventif, bukan sekadar laporan.

## ⚙️ CARA MEMBUKA

> ⚠️ **PENTING:** modul ini **TIDAK tersedia untuk role Teknisi**.
> Kartu **Critical Part List** dan KPI **Critical Part** sengaja disembunyikan
> di level teknisi. Kalau Anda login sebagai teknisi dan tidak menemukan
> kartu ini, itu **bukan bug** — memang begitu desainnya.

### Role yang bisa membuka modul ini

| Role | Bisa? | Cara membuka |
|---|:---:|---|
| Teknisi | ❌ | Tidak ada kartu & KPI tersembunyi |
| Supervisor 1 (`INN`) | ✅ | Kartu **Critical Part List** |
| **Administrator (`ANS`)** | ✅ | Kartu **Critical Part List** |
| Supervisor 2 (`KAA`) | ✅ | Kartu **Critical Part List** |
| Manager (`KSW`) | ✅ | Kartu **Critical Part List** |

### Cara 1 — Lewat kartu menu (semua role di atas)

1. **LOGIN** sebagai salah satu role yang boleh (disarankan **`ANS`** / `ANS1805`).
2. **KLIK** kartu menu:
   > **"Critical Part List"**
   > *Sub-teks: "Daftar sparepart kritis"*

3. **TUNGGU** modal **"Daftar Stok Sparepart"** terbuka.

### Cara 2 — Lewat KPI merah di dashboard

1. Di halaman utama, **LIHAT** deretan KPI di bagian atas.
2. **KLIK** kartu KPI berwarna **merah** berlabel **"Critical Part"**.
3. **TUNGGU** tabel terbuka dalam mode **Kritis**.

> 💡 Cara 2 ini otomatis memfilter tabel hanya untuk `is_critical = Ya`.

---


## LANGKAH 1 — Pahami Kolom Tabel

| Kolom | Arti |
|---|---|
| **Item Code** | Kode barang unik, contoh `O-16731-00` |
| **Deskripsi** | Nama lengkap barang |
| **Qty On Hand** | Stok saat ini |
| **Min** | Batas minimum (di bawah ini = bahaya) |
| **Max** | Batas maksimum penyimpanan |
| **Lokasi Rak** | Letak fisik di gudang |
| **Status** | Amber =descriptor menipis, Merah = habis |

---

## LANGKAH 2 — Cari Barang Kritis

1. **KLIK** kolom pencarian:
   > 🔍 *"Cari item code / deskripsi / lokasi..."*
2. **KETIK**: `O-50834`
3. **TUNGGU** ≈ 0,5 detik → hanya baris `O-50834-00` yang tampil.
4. **HAPUS** teks pencarian → **TUNGGU** seluruh daftar kembali.

---

## LANGKAH 3 — Tunjukkan Barang yang STOK HABIS

1. **KLIK** kolom **"Qty On Hand"** → **KLIK** lagi untuk urut **ascending**.

   > 💡 Tips: klik header kolom sekali = urut **A → Z / kecil → besar**,
   > klik lagi = **Z → A / besar → kecil**.

2. **PERHATIKAN** baris teratas:

| Item Code | Deskripsi | Qty | Min | Status |
|---|---|:---:|:---:|---|
| `O-50834-00` | Pressure Transducer P/N. GM805664 | **0** | 1 | 🔴 **HABIS** |
| `O-16731-00` | KIT Ricambi Valve DN10 | **0** | 8 | 🔴 **HABIS** |

3. **ARAHKAN** kursor ke baris `O-16731-00` — baris berubah warna merah muda.

> 🗣️ **Ucapkan:**
> *"Ini dua barang **habis total**. Salah satunya **Pressure Transducer**,
> tanpa itu autoclave tidak bisa memverifikasi tekanan - artinya
> produksi berhenti."*

---

## LANGKAH 4 - Hitung Dampaknya

1. **KLIK** satu item, misal `O-16731-00`.
2. **PERHATIKAN** kolom **Min** = **8**, kolom **Qty** = **0**.

   > **Kekurangan: 8 set.**

3. **Ucapkan** (atau tulis di papan):
   > *"Item ini ada di daftar Critical Part List, artinya kalau kosong
   > dampaknya langsung ke produksi. Yang perlu diprioritaskan adalah
   > item dengan Qty di bawah Min."*

---

## LANGKAH 5 - Filter Hanya yang Kritis

1. **KLIK** dropdown filter (bila ada) → **KLIK** **"Kritis"**.
2. **TUNGGU** tabel ter-filter hanya menampilkan `is_critical = Ya`.

> 🗣️ **Ucapkan:**
> *"Jadi dua modul ini saling melengkapi: **Critical Part List** memberi
> daftar barang vital, **On Hand Stock** memberi angka stok terkini-nya."*

---

## ➡️ LANJUT KE: `08-On-Hand-Stock.md`
