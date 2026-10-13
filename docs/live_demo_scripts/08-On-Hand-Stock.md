# 08 — ON HAND STOCK

> **Peran yang performs:** **Siapa pun** (disarankan **Administrator** `ANS`)
> **Durasi:** ± 3 menit

---

## 🎯 TUJUAN

Menampilkan **seluruh daftar stok sparepart** beserta:
pencarian cepat, filter status, penentuan warna status, dan export ke Excel/CSV.

---

## LANGKAH 1 — Buka Modul

1. **KLIK** kartu menu:
   > 📦 **"On Hand Stock"**

2. **TUNGGU** modal **"Daftar Stok Sparepart"** terbuka.
3. **PERHATIKAN** sub-teks:
   > *"Data real-time dari server"*

---

## LANGKAH 2 — Baca Struktur Tabel

| Kolom | Contoh nilai |
|---|---|
| **Item Code** | `O-18687-00` |
| **Deskripsi** | `Autoclave Fedegari FVA2/A1 NB2963AT - DN10/DN16 CLAMP P/N: GM100017` |
| **Qty On Hand** | `8` |
| **Min** | `3` |
| **Max** | `6` |
| **Lokasi Rak** | *(terisi bila ada)* |
| **Status** | 🟢 **Aman** |

**Warna status otomatis:**

| Warna | Artinya |
|---|---|
| 🟢 Hijau | `Qty >= Min` → stok aman |
| 🟠 Kuning/oranye | `0 < Qty < Min` → **menipis** |
| 🔴 Merah | `Qty = 0` → **habis** |

> 🗣️ **Ucapkan:**
> *"Warna dihitung otomatis dari perbandingan Qty dengan Min.
> Tidak ada yang perlu input manual — jadi tidak bisa salah."*

---

## LANGKAH 3 — Cari Barang (bukti fitur live-search)

1. **KLIK** kolom pencarian / kotak **"Cari..."**.
2. **KETIK**: `O-18687`
3. **TUNGGU** ≈ 0,5 detik → tabel ter-filter jadi **satu baris**.
4. **KLIK** kolom **"Deskripsi"** → **KLIK** lagi untuk urut A→Z.
5. **HAPUS** teks di kolom pencarian → **TUNGGU** seluruh tabel kembali.

> 🗣️ **Ucapkan:**
> *"Pencarian langsung saat mengetik — tidak perlu tekan tombol search.
> Untuk gudang dengan ratusan item, ini yang bikin cepat."*

---

## LANGKAH 4 — Filter Status Stok

1. **KLIK** dropdown **Status**.
2. **PILIH** salah satu:

| Pilihan | Arti |
|---|---|
| **Semua** | Tampilkan semua barang |
| **Aman** | Hanya yang `Qty >= Min` |
| **Menipis** | Hanya yang `0 < Qty < Min` |
| **Habis** | Hanya yang `Qty = 0` |

3. **KLIK** **"Habis"** → **TUNGGU** hanya item stok nol yang tampil.
4. **KLIK** **"Semua"** untuk mengembalikan tampilan.

> 💡 **Trik demo:** pilih **"Habis"**, lalu **KLIK** tombol **Export**.
> Hasilnya = daftar Shopping List untuk bagian pembelian.

---

## LANGKAH 5 — Export Data (fitur andalan)

### Opsi A — Export ke Excel

1. **KLIK** tombol hijau **"Export Excel"** (ikon 📗).
2. **TUNGGU** file `.xlsx` terunduh, nama file:
   ```
   stock_semua_2026-10-13.xlsx
   ```
3. **BUKA** file tersebut di Excel/Google Sheets.

### Opsi B — Export ke CSV

1. **KLIK** tombol **"Export CSV"** (ikon ⬇).
2. **TUNGGU** file `.csv` terunduh.
3. **BUKA** file tersebut.

> 🗣️ **Ucapkan:**
> *"Stok bisa diekspor ke Excel sekaligus CSV. Ini yang dipakai untuk
> stock opname — cocokkan dengan fisik di gudang, lalu langsung
> saya unduh dan analisis sendiri."*

---

## ➡️ LANJUT KE: `09-Layout-Rak-Gudang.md`