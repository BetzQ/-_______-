# 04 — UBAH STATUS PENGADAAN (ADMINISTRATOR)

**URL: http://localhost:3000** · Login `ANS` / `ANS1805`

> Bagian ini yang berubah dari versi lama: dulu role-nya **Officer**.

---

## 1. MASUK

| # | Klik | Ketik |
|---|---|---|
| 1 | Kolom Username | `ANS` |
| 2 | Kolom Password | `ANS1805` |
| 3 | Tombol **LOGIN** | |

**Tunggu:** baca tulisan besar → **"Selamat Datang, Administrator!"**
**Cek:** muncul **5 kartu** (Rekapan, Approval BQ Tahap Supervisor, Critical Part, On Hand Stock, Layout Rak).

---

## 2. BUKA TABEL

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **Approval BQ Tahap Supervisor** | |
| 2 | Kolom **Cari** | `O-16731` |
| 3 | Geser ke kanan | sampai kolom **Status Pengadaan** |

**Cek:** kolom itu **dropdown**, bukan teks.

---

## 3. UBAH STATUS

| # | Klik | Pilih |
|---|---|---|
| 1 | Dropdown **Status Pengadaan** | `Pending` |
| 2 | Tunggu toast | |
| 3 | Dropdown **Status Pengadaan** | `Proses PO` |
| 4 | Tunggu toast | |
| 5 | Dropdown **Status Pengadaan** | `PO Open` |
| 6 | Tunggu toast | |
| 7 | Dropdown **Status Pengadaan** | `Mencari Penawaran` |
| 8 | Tunggu toast | |
| 9 | Dropdown **Status Pengadaan** | `Barang Dikirim` |
| 10 | Tunggu toast | |
| 11 | Dropdown **Status Pengadaan** | `Tiba di Gudang` |
| 12 | Tunggu toast | |
| 13 | Dropdown **Status Pengadaan** | `Selesai` |
| 14 | Tunggu toast | |

> Minimal 3 tahap cukup: `Pending` → `Proses PO` → `PO Open`.

---

## 4. LIHAT RIWAYAT

| # | Klik |
|---|---|
| 1 | Tombol **🕘 (Riwayat)** di ujung baris |
| 2 | Baca daftar perubahan (nilai lama → baru) |

---

## 5. BUKTI ROLE LAIN TIDAK BISA

Logout → Login `INN` / `30INN11`

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **Approval BQ Tahap Supervisor** | |
| 2 | Kolom **Cari** | `O-16731` |
| 3 | Lihat kolom **Urgency** | → **dropdown** (boleh) |
| 4 | Lihat kolom **Status Pengadaan** | → **teks biasa, tidak bisa diklik** |

---

## KALAU MENU "APPROVAL BQ TAHAP SUPERVISOR" TIDAK MUNCUL

```
node scripts/update_role_officer_to_administrator.js --apply
```
Lalu tekan **F5**, login ulang.

---

## KALAU ERROR

| Gejala | Arti | Jalan |
|---|---|---|
| Kolom Status Pengadaan cuma teks | bukan Administrator / Manager | cek login |
| Dropdown tidak berubah | nilai sama dengan yang sekarang | pilih status berbeda |
| Toast merah | nilai di luar daftar | pilih dari dropdown saja |