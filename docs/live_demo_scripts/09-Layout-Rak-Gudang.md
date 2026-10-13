# 09 — LAYOUT RAK GUDANG

> **Peran yang performs:** **Siapa pun**
> **Durasi:** ± 2 menit

---

## 🎯 TUJUAN

Meminta orang Showing **di mana fisik** sebuah sparepart disimpan, supaya
pengambilan barang di gudang tidak perlu searching.

---

## LANGKAH 1 — Buka Modul

1. **KLIK** kartu menu:
   > 🗄️ **"Layout Rak"**

2. **TUNGGU** modal **"Layout Rak Gudang"** terbuka.
3. **PERHATIKAN** sub-teks:
   > *"Pemetaan lokasi rak sparepart (dari kolom **Lokator** On Hand Stock)"*

> 🗣️ **Ucapkan:**
> *"Sumbernya tetap satu: kolom Lokator di On Hand Stock.
> Jadi tidak ada data rak terpisah yang bisa tidak sinkron dengan stok."*

---

## LANGKAH 2 — Baca Peta Rak

1. **TUNGGU** peta rak tampil (grid kotak).
2. **PERHATIKAN** tiap kotak memuat:

| Elemen | Contoh |
|---|---|
| Kode rak | `A1`, `B2`, `C3`, dst. |
| Keterisi | `8 item` atau nama rak |

3. **KLIK** salah satu kotak rak.
4. **TUNGGU** daftar isi rak tersebut muncul di bawah/samping:

| Item Code | Deskripsi | Qty |
|---|---|:---:|
| `O-18687-00` | Clamp DN10/DN16 P/N. GM100017 | `8` |
| `O-18688-00` | Clamp DN20/DN22 P/N. GM100067 | `3` |
| `O-18690-00` | Clamp DN48/DN50 P/N. GM100049 | `5` |

> 🗣️ **Ucapkan:**
> *"Tinggal klik rak, langsung tahu isinya apa saja.
> Untuk picker barang, tidak perlu cek sistem satu per satu."*

---

## LANGKAH 3 — Cari Barang di Peta Rak

1. **KLIK** kolom pencarian di dalam modal:
   > 🔍 *"Cari item code atau nama barang."*
2. **KETIK**: `O-18687`
3. **TUNGGU** ≈ 0,5 detik → peta & daftar ter-filter ke item yang cocok.
4. **HAPUS** teks di kolom pencarian → **TUNGGU** peta kembali penuh.

---

## LANGKAH 4 — Korelasikan dengan Stok

1. **KLIK** tombol **"Muat Ulang"** (ikon 🔄) di kanan atas modal.
2. **TUNGGU** peta rak ter-refresh.
3. **Bandingkan** dengan modul `08-On-Hand-Stock.md`:
   - Peta rak menunjukkan **lokasi**.
   - On Hand Stock menunjukkan **angka**.

> 🗣️ **Ucapkan:**
> *"Dua modul ini saling melengkapi: peta rak menjawab **di mana**,
> On Hand Stock menjawab **berapa banyak**."*

---

## LANGKAH 5 — Tunjukkan Barang Tanpa Lokasi (opsional)

1. **KLIK** filter / cari rak **"Unlocated"** (barang tanpa lokasi rak).
2. **TUNGGU** daftar barang yang **belum punya lokasi** tampil.

> 🗣️ **Ucapkan:**
> *"Ada juga daftar barang yang belum punya lokasi rak.
> Ini **self-correcting**: begitu tim gudang mengisi kolom Lokator,
> barangnya otomatis muncul di peta."*

---

## ➡️ LANJUT KE: `10-Monthly-Report.md`
