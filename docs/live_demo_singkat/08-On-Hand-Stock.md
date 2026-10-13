# 08 — ON HAND STOCK

**URL: http://localhost:3000** · Login bebas

---

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **On Hand Stock** | |
| 2 | Kolom **Cari** | `O-18687` |

**Tunggu:** `O-18687-00` Clamp DN10/DN16, stok **8**, min **3**, status hijau.

---

| # | Klik | Hasil |
|---|---|---|
| 1 | Tombol **hapus** di kolom Cari | seluruh 3.022 item kembali |
| 2 | Dropdown **Status** | pilih `Habis` |
| 3 | Tunggu | hanya barang stok 0 yang tampil |
| 4 | Tombol **Export Excel** | file `.xlsx` terunduh |
| 5 | Tombol **Export CSV** | file `.csv` terunduh |

---

## WARNA STATUS

| Warna | Arti |
|---|---|
| 🟢 Hijau | stok ≥ minimum (aman) |
| 🟠 Kuning | stok > 0 tapi < minimum (menipis) |
| 🔴 Merah | stok 0 (habis) |

---

## KALAU ERROR

| Gejala | Arti |
|---|---|
| Hasil pencarian kosong | kode salah, coba `O-186` |
| File tidak terunduh | pop-up download diblokir browser |
| Kolom Lokasi Kosong | barang belum punya lokator rak |