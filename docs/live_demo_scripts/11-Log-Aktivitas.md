# 11 — LOG AKTIVITAS (AUDIT TRAIL)

> **Peran yang performs:** **Manager** (`KSW` / `01KSW10`)
> **Durasi:** ± 3 menit · **Penutup demo yang kuat**

---

## 🎯 TUJUAN

Menunjukkan **dua tab riwayat** yang membuktikan aplikasi ini **auditable**:

| Tab | Isi |
|---|---|
| **Riwayat Login** | Siapa yang login, kapan, dari mana |
| **Riwayat Aktivitas** | Siapa melakukan apa |

---

## LANGKAH 1 — Buka Modul

1. **LOGIN** sebagai **Manager** (`KSW` / `01KSW10`).
2. **KLIK** kartu menu:
   > 🕓 **"Log Aktivitas"**
   > *Sub-teks: "Riwayat login & aksi seluruh user"*

3. **TUNGGU** modal **"Log Aktivitas"** terbuka.

---

## LANGKAH 2 — Tab RIWAYAT LOGIN

1. **KLIK** tab **"Riwayat Login"** (tombol di kiri atas modal).
2. **TUNGGU** tabel tampil. Kolom-kolomnya:

| Kolom | Arti |
|---|---|
| Username | Akun |
| Waktu | Timestamp login |
| Status | ✅ **Berhasil** / ❌ **Gagal** |
| Info | Detail (mis. login saat masih pending) |

3. **PERHATIKAN** baris paling atas — itu adalah **login Anda sendiri** beberapa detik lalu.
4. **TUNGGU** baris dengan status **Gagal** (percobaan login salah password).

> 🗣️ **Ucapkan:**
> *"Perhatikan, **login gagal** juga tercatat. Ini penting untuk keamanan —
> kalau ada yang berulang-ulang gagal, kami tahu sebelum terjadi masalah."*

---

## LANGKAH 3 — Tab RIWAYAT AKTIVITAS (bagian utama)

1. **KLIK** tab **"Riwayat Aktivitas"**.
2. **TUNGGU** tabel tampil. Kolomnya:

| Kolom | Contoh |
|---|---|
| Waktu | `13/10/2026 19:30` |
| Username | `ANS` |
| Aksi | `UPDATE STATUS PENGADAAN` |
| Detail | `BQ-2026-01-05-0007: BQ Baru -> Pending` *(nomor & tanggal ikut berubah)* |

3. **CARI** entri atas nama **`ANS`** — itu dari file `04`.
4. **PERHATIKAN** detailnya menyebut **nilai sebelum → nilai sesudah**.

> 🗣️ **Ucapkan:**
> *"Inilah bukti audit. Setiap perubahan status tercatat **siapa**, **kapan**,
> dan **dari nilai apa ke nilai apa**. Notifikasi email maupun tidak perlu —
> jejaknya ada di sistem."*

---

## LANGKAH 4 — Tunjukkan Jejak Lengkap Satu Pengajuan

1. **KLIK** baris aktivitas mana pun milik `ANS`.
2. **CATAT** nomor registrasi yang disebut (nomor.today, mis. `BQ-2026-01-05-0007`).
3. **KLIK** **✕** → tutup modal Log Aktivitas.
4. **KLIK** kartu menu **"Approval BQ Tahap Supervisor"** (untuk Administrator) atau **"Approval BQ Urgent"** (untuk Manager).
5. **KLIK** tombol ikon **🕘 (Riwayat)** pada baris pengajuan yang sama.
6. **Bandingkan** — **riwayat per-pengajuan** dan **riwayat global** konsisten.

> 🗣️ **Ucapkan:**
> *"Ada dua tingkat audit: **global** (semua aktivitas semua user, untuk manajemen)
> dan **per-pengajuan** (riwayat satu dokumen, untuk yang sedang dikejar)."*

---

## LANGKAH 5 — Penutup Demo

1. **KLIK** **Logout** di kanan atas.
2. **KETIK** password **SALAH** secara sengaja, misal `salahsalah`.
3. **KLIK** **LOGIN** → **TUNGGU** toast merah *"Username atau password salah"*.
4. **LOGIN** lagi dengan benar.
5. **KLIK** **"Log Aktivitas"** → **KLIK** tab **Riwayat Login**.
6. **PERHATIKAN**: percobaan gagal tadi **tercatat** di sana.

> **Ucapkan penutup:**
> *"Terakhir, sistem ini tertutup penuh: setiap percobaan login, setiap
> perubahan data, tercatat. Jadi siapa pun yang mencoba, jejaknya ada.
> Itulah cara kami memenuhi persyaratan audit internal PT Fonko."*

---

## 📋 RANGKUMAN SELURUH MODUL (untuk slide penutup)

| # | Modul | Fungsi inti |
|---|---|---|
| 1 | Registrasi & Approval User | Registrasi mandiri, persetujuan berlapis |
| 2 | Form Pengajuan BQ | Pengajuan sparepart & jasa oleh teknisi |
| 3 | Monitoring & Approval BQ | Approval SPV → Manager + urgency |
| 4 | **Status Pengadaan** | **Pipeline 8 tahap oleh Administrator/Manager** |
| 5 | Rekapan Pengajuan | Rekap full-approve |
| 6 | PR Summary | Laporan eksekutif read-only |
| 7 | Critical Part List | Pencegahan barang habis |
| 8 | On Hand Stock | Stok real-time + export |
| 9 | Layout Rak | Peta lokasi fisik |
| 10 | Monthly Report | Laporan per periode + grafik |
| 11 | Log Aktivitas | Audit trail 2 tingkat |

---

## ✅ CHECKLIST PENUTUP SESI

- [ ] Semua 11 skrip sudah didemokan (atau yang inti 01–04)
- [ ] Role **Administrator** sudah diperagakan diubah status
- [ ] Role **Officer** sudah diperagakan kehilangan hak
- [ ] Console (`F12`) bersih dari error merah
- [ ] Tidak ada kredensial yang terlihat di layar

---

**SELAMAT BERHASIL LIVE DEMO!** 🎉

*Butuh skrip tambahan? Buat file baru bernomor berikutnya di folder ini.
Formatnya sama: tujuan → syarat awal → langkah klik demi klik → teks yang
diucapkan → troubleshooting.*
