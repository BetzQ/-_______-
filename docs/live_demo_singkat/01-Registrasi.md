# 01 — REGISTRASI & PERSETUJUAN

**URL: http://localhost:3000**

---

## BAGIAN A — PENDAFTARAN

| # | Klik | Ketik |
|---|---|---|
| 1 | Login → link **Daftar di sini** | |
| 2 | Kolom **Username** | `BDT01` |
| 3 | Kolom **Nama Lengkap** | `Budi Santoso` |
| 4 | Kolom **Password** | `Budi12345` |
| 5 | Tombol **KIRIM PENDAFTARAN** | |

**Tunggu:** muncul kotak hijau "Pendaftaran berhasil".

---

## BAGIAN B — BUKTI BELUM AKTIF

| # | Klik | Ketik |
|---|---|---|
| 1 | Tombol **✕** | |
| 2 | Kolom Username | `BDT01` |
| 3 | Kolom Password | `Budi12345` |
| 4 | Tombol **LOGIN** | |

**Tunggu:** layar **KUNING** "menunggu persetujuan". Tidak ada menu sama sekali.

---

## BAGIAN C — PERSETUJUAN MANAGER

**Logout** → Login `KSW` / `01KSW10`

| # | Klik | Ketik |
|---|---|---|
| 1 | Kartu **Approval User** | |
| 2 | Dropdown **Tim** | pilih **Tim Administrator** |
| 3 | Kolom **Link BQ** | `EJO/2026/10/0147` |
| 4 | Tombol hijau **Setujui** | |

**Tunggu:** toast "Pendaftaran disetujui" + kartu `BDT01` hilang.

---

## BAGIAN D — VERIFIKASI

| # | Klik | Ketik |
|---|---|---|
| 1 | Tab Incognito → tekan **F5** | |
| 2 | Kolom Username | `BDT01` |
| 3 | Kolom Password | `Budi12345` |
| 4 | Tombol **LOGIN** | |

**Tunggu:** kartu menu **muncul** (dulu tidak ada).

---

## KALAU ERROR

| Pesan |Arti | Jalan|
|---|---|---|
| `Pilih tim dulu (Supervisor 1 / 2 / Administrator)` | dropdown Tim belum diisi | pilih Tim dulu |
| `Tidak ada pendaftaran yang menunggu` | sudah pernah di-approve | pakai username lain, misal `BDT02` |
| `Gagal terhubung ke server` | server mati | nyalakan `npm start` |