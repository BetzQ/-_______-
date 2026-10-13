# 03 — APPROVAL SPV & MANAGER

**URL: http://localhost:3000**

---

## BAGIAN A — SUPERVISOR 1

Logout → Login `INN` / `30INN11`

| # | Klik | Ketik / Pilih |
|---|---|---|
| 1 | Kartu **Approval BQ Tahap Supervisor** | |
| 2 | Kolom **Cari** | `O-16731` |
| 3 | Dropdown **Urgency** di baris itu | `Urgent` |
| 4 | Tombol **Approve** (kolom SPV) | |

**Tunggu:** toast. Status SPV → **Disetujui**, Manager → tetap **Menunggu**.

---

## BAGIAN B — MANAGER

Logout → Login `KSW` / `01KSW10`

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **Approval BQ Urgent** | |
| 2 | Kolom **Cari** | `O-16731` |

### Bukti aturan (tunjukkan)

| # | Aksi | Hasil |
|---|---|---|
| 1 | Cari baris SPV = **Menunggu** | |
| 2 | Lihat kolom **Manager** | tombol **Approve abu-abu, tidak bisa diklik** |
| 3 | Arahkan kursor ke tombolnya | tooltip: **"Menunggu persetujuan Supervisor (SPV)"** |
| 4 | Klik paksa | tidak terjadi apa-apa |

### Approve final

| # | Klik | Ketik |
|---|---|---|
| 1 | Cari baris SPV = **Disetujui** | |
| 2 | Tombol **Approve** (kolom Manager) | |

**Tunggu:** Status Manager → **Disetujui** (hijau).

---

## HASIL AKHIR

```
SPV        : Disetujui
Manager    : Disetujui
Pengadaan  : BQ Baru
```

---

## KALAU ERROR

| Gejala | Jalan |
|---|---|
| Tombol Approve Manager abu-abu | SPV belum disetujui → balik ke Bagian A |
| Dropdown Urgency tidak muncul | bukan role Supervisor |
| Baris tidak ketemu | ganti kata kunci `Cari`, misal `O-1673` |