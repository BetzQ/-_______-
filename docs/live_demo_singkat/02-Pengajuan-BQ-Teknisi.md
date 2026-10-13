# 02 — PENGAJUAN BQ

**URL: http://localhost:3000** · Login `AAA` / `04AAA10`

---

## SPAREPART

| # | Klik | Ketik / Pilih |
|---|---|---|
| 1 | Kartu **BQ Personal** | |
| 2 | Kolom **Item Code** | `O-16731-00` → **klik hasil munculannya** |
| 3 | Kolom **Qty Diminta** | `2` |
| 4 | Kolom **Satuan (UoM)** | `Set` |
| 5 | Dropdown **Purpose** | `EJO (Engineering Job Order)` |
| 6 | Kolom **No. EJO** | `EJO/2026/10/0147` |
| 7 | Kolom **Mesin / Area** | `Autoclave FVA2/A1` |
| 8 | Dropdown **Jenis Pengajuan** | `Sparepart` |
| 9 | Kolom **Merk** | `Fedegari` |
| 10 | Kolom **Spesifikasi Lengkap** | `KIT Ricambi Valve DN10, P/N KK000301` |
| 11 | Tombol **KIRIM PENGAJUAN** | |

**Tunggu:** modal tertutup + toast hijau.

---

## CEK HASIL

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **Status Pengajuan Saya** | |
| 2 | Kolom **Cari** | `O-16731` |

**Tunggu:** nomor `BQ-2026-10-13-xxxx` muncul di atas.
Status: SPV **Menunggu** · Pengadaan **BQ Baru**.

---

## JASA (opsional)

| # | Klik | Ketik / Pilih |
|---|---|---|
| 1 | Kartu **BQ Personal** | |
| 2 | Dropdown **Jenis Pengajuan** | `Jasa (JA/BR)` |
| 3 | Kolom **Qty Diminta** | `1` |
| 4 | Kolom **Satuan** | `Unit` |
| 5 | Dropdown **Purpose** | `Lainnya` |
| 6 | Kolom **No. EJO** | `EJO/2026/10/0148` |
| 7 | Kolom **Mesin / Area** | `Capping VCM200` |
| 8 | Kolom **Keterangan Jasa** | `Overhaul capping head VCM200` |
| 9 | Kolom **Spesifikasi Lengkap** | `Jasa overhaul, termasuk SGD dan pelaporan` |
| 10 | Tombol **KIRIM PENGAJUAN** | |

---

## KALAU ERROR

| Pesan | Jalan |
|---|---|
| `Item Code tidak ditemukan` | hapus kolom → ketik ulang `O-16731-00` |
| Kolom merah | field wajib belum lengkap |
| Tombol KIRIM mati | Qty / UoM / Purpose / No.EJO / Mesin / Spesifikasi belum isi |