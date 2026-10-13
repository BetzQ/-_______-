# 07 — CRITICAL PART LIST

**URL: http://localhost:3000** · Login `ANS` / `ANS1805`

> ⚠️ Modul ini **tidak ada** untuk role Teknisi.

---

| # | Klik | Ketik |
|---|---|---|
| 1 | KPI merah **Critical Part** di dashboard | |
| 2 | Kolom **Cari** | `O-15554` |

**Tunggu:** tabel kritis. `O-15554-00` stok **0**, min **1**.

---

## TAMPILKAN YANG HABIS

| # | Klik | Hasil |
|---|---|---|
| 1 | Header kolom **Qty On Hand** | urut kecil → besar |
| 2 | Klik lagi | urut besar → kecil |

**Tunggu:** yang paling atas = stok 0 (`O-15554-00`, `O-15566-00`, `O-15586-00`).

---

## DAFTAR ITEM KRITIS UNTUK DEMO

| Item Code | Barang | Stok | Min |
|---|---|---|---|
| `O-15554-00` | AIRTIGHT DOOR MOTOR | 0 | 1 |
| `O-16731-00` | KIT Ricambi Valve DN10 (item demo utama) | 0 | 8 |
| `O-15566-00` | CAPS HOPPER SENSOR | 0 | 1 |
| `O-15586-00` | SIDE GUIDES CYLINDER | 0 | 1 |
| `O-15588-00` | SERVO MOTOR OMRON G5 | 0 | 1 |

---

## KALAU ERROR

| Gejala | Arti |
|---|---|
| Kartu KPI merah tidak ada | login sebagai Teknisi → ganti ke `ANS` |
| Tabel kosong | tidak ada data kritis |
| Warna tidak merah | stok masih di atas minimum |
