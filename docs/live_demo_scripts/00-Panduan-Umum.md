# 00 — PANDUAN UMUM LIVE DEMO

> **Micropage E-Sparepart — PT Fonko International Pharmaceuticals**
> Baca file ini **PERTAMA** sebelum membuka skrip fitur lainnya.

---

## 📂 DAFTAR SKRIP (buka sesuai urutan)

| # | File | Fitur yang ditunjukkan | Peran showcase | Estimasi |
|---|---|---|---|---|
| 00 | `00-Panduan-Umum.md` | Persiapan sebelum demo | - | 3 mnt |
| 01 | `01-Registrasi.md` | Pendaftaran akun + persetujuan Manager | Calon user + Manager | 6 mnt |
| 02 | `02-Pengajuan-BQ-Teknisi.md` | Form Pengajuan BQ (sparepart & jasa) | Teknisi | 6 mnt |
| 03 | `03-Approval-SPV-dan-Manager.md` | Approval berjenjang SPV → Manager | Supervisor 1 + Manager | 5 mnt |
| 04 | `04-Status-Pengadaan-Administrator.md` | **Ubah Status Pengadaan (inti revisi)** | Administrator | 7 mnt |
| 05 | `05-Rekapan-Pengajuan.md` | Rekapan pengajuan yang sudah full-approve | Administrator / SPV2 | 3 mnt |
| 06 | `06-PR-Summary.md` | PR Summary (khusus Manager & SPV 1) | Manager | 3 mnt |
| 07 | `07-Critical-Part-List.md` | Daftar sparepart kritis | Supervisor 1 / Administrator / Manager | 3 mnt |
| 08 | `08-On-Hand-Stock.md` | Stok terkini + pencarian | Semua role | 3 mnt |
| 09 | `09-Layout-Rak-Gudang.md` | Peta lokasi rak gudang | Semua role | 2 mnt |
| 10 | `10-Monthly-Report.md` | Laporan bulanan (grafik) | Manager / Supervisor 1 | 3 mnt |
| 11 | `11-Log-Aktivitas.md` | Riwayat login & audit trail | Manager | 3 mnt |

**Total: ± 47 menit.** Jika waktu demo hanya 20 menit, cukup files **01 → 02 → 03 → 04**.
---

## 🚨 WAJIB DILAKUKAN SEBELUM DEMO (batas waktu 2 menit)

> Demo **PASTI GAGAL** di tengah jalan kalau langkah ini dilewati.

### Cek A — Role `ANS` sudah `Administrator`?

1. **KLIK** jendela browser → buka `http://localhost:3000`.
2. **KLIK** kolom Username → **KETIK**: `ANS`
3. **KLIK** kolom Password → **KETIK**: `ANS1805`
4. **KLIK** **LOGIN** → **TUNGGU** halaman termuat.
5. **LIHAT** kartu menu yang tampil:

   | Hasil | Arti | Tindakan |
   |---|---|---|
   | Ada **Rekapan Pengajuan**, **Approval BQ Tahap Supervisor**, **Critical Part List**, **On Hand Stock**, **Layout Rak** (5 kartu) | ✅ Role sudah benar | Lanjut demo |
   | Menu berbeda, atau **Approval BQ Tahap Supervisor** tidak ada | ❌ Role masih `Officer` | Jalankan **Cek B** |

### Cek B — Perbaiki role di database (hanya perlu sekali)

1. Buka terminal atau VS Code Terminal di folder aplikasi ini.
2. **KETIK** perintah berikut lalu **TEKAN** `Enter` (hanya menampilkan, tidak mengubah apa pun):

   ```
   node scripts/update_role_officer_to_administrator.js
   ```

3. **TUNGGU** tampil daftar akun yang akan diubah.
4. **KETIK** perintah berikut lalu **TEKAN** `Enter`:

   ```
   node scripts/update_role_officer_to_administrator.js --apply
   ```

5. **TUNGGU** muncul baris `Officer -> Administrator : 1 baris diperbarui`.
6. **TUNGGU** muncul `[OK] Migrasi selesai. Tidak ada role "Officer" tersisa.`
7. **TEKAN** `F5` di browser, lalu login ulang `ANS`.
8. **ULANGI** **Cek A** sampai hasilnya yang ✅.

> 💡 **Kalau tidak bisa menjalankan perintah** (mis. demo di komputer orang),
> buka **Supabase Dashboard → SQL Editor** dan jalankan:

> ```sql
> UPDATE users SET role = 'Administrator' WHERE role = 'Officer';
> ```

### Cek C — Server menyala

1. **KLIK** address bar → **KETIK**: `http://localhost:3000` → **TEKAN** `Enter`.
2. **TUNGGU** halaman login tampil. Kalau tidak muncul, server belum jalan.

### Cek D — Sudah ada pengajuan FULL APPROVE

Kalau belum ada, file `03`, `04`, `05` akan terlihat kosong.

1. Login sebagai **Manager** (`KSW` / `01KSW10`).
2. **KLIK** kartu **Rekapan Pengajuan**.
3. **LIHAT** hasilnya:

   - Ada tabel berisi pengajuan → ✅ **sudah ada** data, lanjut demo.
   - Muncul teks **"Belum ada pengajuan disetujui penuh"** → jalankan dulu
     file `02` (buat pengajuan) lalu file `03` (SPV approve → Manager approve).

### Cek E — Akun demo tidak terpakai

- Username `BDT01` **belum** pernah didaftarkan. Kalau sudah ada dari demo
  sebelumnya, pakai username lain, misalnya `BDT02`.

---

## 🔑 DAFTAR AKUN DEMO (data asli dari seed database)

| Peran | Username | Password | Nama |
|---|---|---|---|
| **Teknisi** | `RIA` | `14RIA05` | Ria |
| **Teknisi** | `SFH` | `SFH0306` | Safi |
| **Teknisi** | `AAA` | `04AAA10` | AAA |
| **Supervisor 1** | `INN` | `30INN11` | INN |
| **Supervisor 2** | `KAA` | `KAA1910` | KAA |
| **Administrator** | `ANS` | `ANS1805` | ANS |
| **Manager** | `KSW` | `01KSW10` | KSW |

> ⚠️ **SEBELUM DEMO:** pastikan nilai `role` akun `ANS` di tabel `users` sudah
> **`Administrator`**. migrated dari `Officer` setelah perubahan role.
> Jika belum, akun tersebut akan terbaca sebagai role tak dikenal dan
> dropdown status pengadaan tidak akan muncul.

---

## 🗄️ DATA RIIL YANG DIGUNAKAN DI SELURUH SKRIP

**Item code valid** (ketik persis seperti ini di kolom Item Code):

| Item Code | Deskripsi | Stok | Min | Kritis |
|---|---|---|---|---|
| `O-50834-00` | Pressure Transducer P/N. GM805664 (Autoclave Fedegari FOF/6 AC) | 0 | 1 | ✅ YA |
| `O-16731-00` | KIT Ricambi Valve DN10 On-Off Fedegari Asia Pte Ltd | 0 | 8 | ✅ YA |
| `O-19214-00` | Freeze Dryer MBE1207 — Expansi Valve TE-5 | 2 | 2 | ✅ YA |
| `O-18687-00` | Clamp DN10/DN16 P/N. GM100017 (Autoclave FVA2/A1) | 8 | 3 | — |
| `O-18688-00` | Clamp DN20/DN22 P/N. GM100067 | 3 | 3 | — |
| `O-18692-00` | Blind Size F1 (Autoclave Service NA2247AU) | 1 | 1 | — |
| `O-16647-00` | Oring Silicone Merah 23×18×2.5 mm (Washing RAR4) | 391 | 40 | — |

**Pipeline status pengadaan** (dipakai file 04):

```
BQ Baru → Pending → Proses PO → PO Open → Mencari Penawaran
        → Barang Dikirim → Tiba di Gudang → Selesai
```

**Nomor EJO & mesin** (dipakai file 02):

| Field | Nilai riil |
|---|---|
| No. EJO | `EJO/2026/10/0147` |
| Mesin / Area | `Autoclave FVA2/A1 — Lini 2` |
| Link penawaran | `https://docs.google.com/spreadsheets/d/1cQjqA9e_ROK_DL6lhwLlY/edit` |

---

## ⚙️ PERSIAPAN TEKNIS (10 MENIT SEBELUM DEMO)

1. **KLIK** dua kali `server.js` atau jalankan `npm start` di terminal →
   harus muncul `Server berjalan di http://localhost:3000`.
2. **KLIK** Chrome → **KLIK** `Ctrl` + `Shift` + `N` (jendela Incognito).
3. Di address bar **KETIK** `http://localhost:3000` → **TEKAN** `Enter`.
4. **KLIK** ikon **🗨️ Restore** / split layar agar bisa lihat 2 jendela sekaligus.
5. Di jendela kedua, **LOGIN** sebagai **Manager (`KSW` / `01KSW10`)**.
6. **KLIK** `F12` → **KLIK** tab **Console** → pastikan **tidak ada** merah.
7. **KLIK** `F11` (Fullscreen) untukBersih dari address bar.

> 💡 **Saran:** pakai **satu monitor**, dua jendela bersebelahan
> (Window Snap `Win` + `←` / `→`).

---

## 🎤 CARA BERKOMUNIKASI

| ✅ Lakukan | ❌ Hindari |
|---|---|
| Klik satu per satu, lambat & jelas | Klik cepat beruntun |
| Sebutkan nama tombol sebelum klik | Tunjuk layar sambil diam |
| Ucapkan hasil yang muncul di layar | Diam dan biarkan menu terbuka |
| Akui kalau ada error - itu bagian demo | Panik atau langsung tutup browser |
| Ulangi sekali kalau gagal | Klik 5 kali kalau gagal |

**Kalimat pembuka yang disarankan:**

> *"Selamat pagi. Aplikasi ini menggantikan proses pengajuan sparepart manual
> di PT Fonko International Pharmaceuticals - mulai dari registrasi, approval
> berjenjang, sampai monitoring pengadaan — semuanya dalam satu sistem."*

---

## ⚠️ MASALAH SERING MUNCUL

| Gejala | Solusi |
|---|---|
| Halaman putih / *"Gagal terhubung ke server"* | Jalankan ulang `npm start`, tunggu sampai port 3000 aktif |
| Login ditolak | Cek username & password (huruf besar-kecil berpengaruh) |
| Dropdown **Status Pengadaan** tidak muncul | Akun bukan Administrator/Manager, **atau** belum full-approve |
| Menu **PR Summary** tidak ada | Hanya Manager & Supervisor 1 |
| Toast *"Pilih tim: Supervisor 1, Supervisor 2, atau Administrator"* | lupa pilih Tim saat menyetujui pendaftaran |
| Tombol **Setujui** tidak merespons |dropdown **Tim** masih kosong |

---

*Lanjut ke: **`01-Registrasi.md`** →*
