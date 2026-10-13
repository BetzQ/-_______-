# 00 — PANDUAN SINGKAT

**URL: http://localhost:3000**

---

## DAFTAR FILE

| # | File | Peran | Selesai |
|---|---|---|---|
| 01 | `01-Registrasi.md` | Teknisi + Manager | 4 mnt |
| 02 | `02-Pengajuan-BQ-Teknisi.md` | Teknisi | 4 mnt |
| 03 | `03-Approval-SPV-dan-Manager.md` | SPV + Manager | 4 mnt |
| 04 | `04-Status-Pengadaan-Administrator.md` | **Administrator** | 5 mnt |
| 05 | `05-Rekapan-Pengajuan.md` | Manager | 2 mnt |
| 06 | `06-PR-Summary.md` | Manager | 2 mnt |
| 07 | `07-Critical-Part-List.md` | ANS/KSW/INN | 2 mnt |
| 08 | `08-On-Hand-Stock.md` | semua | 2 mnt |
| 09 | `09-Layout-Rak-Gudang.md` | semua | 1 mnt |
| 10 | `10-Monthly-Report.md` | Manager | 2 mnt |
| 11 | `11-Log-Aktivitas.md` | Manager | 2 mnt |

**Waktu 15 menit** → jalankan `02` → `03` → `04`.

---

## AKUN

| Peran | Username | Password |
|---|---|---|
| Teknisi | `AAA` | `04AAA10` |
| Teknisi | `RIA` | `14RIA05` |
| Supervisor 1 | `INN` | `30INN11` |
| Supervisor 2 | `KAA` | `KAA1910` |
| **Administrator** | `ANS` | `ANS1805` |
| Manager | `KSW` | `01KSW10` |

---

## ITEM CODE (untuk demo)

| Item Code | Barang | Stok | Min |
|---|---|---|---|
| `O-16731-00` | KIT Ricambi Valve DN10 (kritis) | 0 | 8 |
| `O-18687-00` | Clamp DN10/DN16 | 8 | 3 |
| `O-18692-00` | Blind Size F1 | 1 | 1 |
| `O-15554-00` | AIRTIGHT DOOR MOTOR (kritis) | 0 | 1 |
| `O-15566-00` | CAPS HOPPER SENSOR (kritis) | 0 | 1 |
| `O-15586-00` | SIDE GUIDES CYLINDER (kritis) | 0 | 1 |

---

## SEBELUM MULAI (1 menit)

```
[ ] http://localhost:3000  →  halaman login muncul?
[ ] Login ANS / ANS1805     →  muncul 5 kartu menu?
[ ] Klik "Rekapan Pengajuan"  →  ada isi?
```

Kalau kartu **"Approval BQ Tahap Supervisor"** tidak muncul → jalankan:
```
node scripts/update_role_officer_to_administrator.js --apply
```
Lalu tekan `F5`.

---

## STATUS PENGADAAN (urutan)

```
BQ Baru → Pending → Proses PO → PO Open
       → Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai
```

---

*Versi lengkap ada di folder `live_demo_scripts/`.*
