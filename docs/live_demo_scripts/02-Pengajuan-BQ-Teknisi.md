# 02 — FORM PENGAJUAN BQ (TEKNISI)

> **Peran yang performs:** **Teknisi** — akun `RIA` / password `14RIA05`
> **Durasi:** ± 6 menit · **Modul:** Pengajuan Barang (BQ)

---

## 🎯 TUJUAN

Menunjukkan bagaimana teknisi mengajukan kebutuhan sparepart/jasa, dan
membedakan pengajuan **Sparepart** vs **Jasa**.

---

## ⚙️ SYARAT AWAL

- Sudah login sebagai **Teknisi** (`RIA` / `14RIA05`).
- Jendela Manager (`KSW`) tetap terbuka di layar sebelah — jangan logout.

---

## LANGKAH 1 — Buka Form Pengajuan BQ
1. Di halaman utama, **KLIK** kartu menu berwarna biru (kartu pertama, kiri atas):
   > **"BQ Personal"**
   > *Sub-teks di bawahnya: "Input pengajuan barang baru"*

   > PENTING: yang tampil sebagai **kartu menu** bernama **"BQ Personal"**.
   > Yang muncul setelah diklik (judul modal) bernama **"Form Pengajuan BQ"**.
   > Keduanya menunjuk ke hal yang sama.

2. **TUNGGU** modal **"Form Pengajuan BQ"** terbuka.

> Teknisi punya **5 kartu menu**: `BQ Personal`, `Status Pengajuan Saya`,
> `On Hand Stock`, `Layout Rak`, `Rekapan Pengajuan`.
> Kartu **Critical Part List** sengaja **tidak ada** untuk teknisi.

> 🗣️ **Ucapkan:**
> *"Sekarang saya login sebagai teknisi. Untuk minta sparepart, teknisi
> mengisi form ini sendiri — tanpa perlu lewat kertas."*

---

## LANGKAH 2 — Isi Item Code (dengan pencarian langsung)

1. **KLIK** kolom **"Item Code"**.
2. **KETIK**: `O-16731-00`
3. **TUNGGU** ≈ 1 detik → muncul daftar saran di bawah kolom.
4. **KLIK** hasil yang muncul:
   > **KIT Ricambi Valv. DN10 ON-OFF FEDEGARI ASIA PTE LTD P/N : KK000301**

   Kolom terisi otomatis menjadi: `O-16731-00`

> 🗣️ **Ucapkan:**
> *"Teknisi tidak perlu hafal kode. Dia boleh ketik sebagian saja —
> misalnya `Pressure`, dan sistem akan mencarinya sendiri."*

**Bonus ( Demonstrasi pencarian alternatif):**

1. **KLIK** kolom **Item Code**.
2. **KETIK**: `Clamp`
3. **TUNGGU** daftar saran muncul.
4. **KLIK** `O-18687-00` — Clamp DN10/DN16.

> 💡 Pilih **salah satu** saja untuk demo. Jangan dua-duanya.

---

## LANGKAH 3 — Isi Qty & Satuan

| # | Kolom | Cara | Ketik |
|---|---|---|---|
| 1 | **Qty Diminta** | **KLIK** → **HAPUS** isi default → **KETIK** | `2` |
| 2 | **Satuan (UoM)** | **KLIK** → **KETIK** | `Set` |

> 💡 Kolom UoM punya *autocomplete* (`Pcs / Set / Pack / Unit / Meter / Liter`).
> **KLIK** `Set` dari daftar, atau ketik manual.

> 🗣️ **Ucapkan:**
> *"Item ini bentuknya kit, bukan satuan satuan. Satuannya **Set**,
> bukan Pcs — jadi yang dipesan adalah satu perangkat utuh untuk overhaul."*

---

## LANGKAH 4 — Isi Purpose & No. EJO

| # | Kolom | Cara | Nilai |
|---|---|---|---|
| 1 | **Purpose** | **KLIK** dropdown → **KLIK** opsi | **EJO (Engineering Job Order)** |
| 2 | **No. EJO** | **KLIK** → **KETIK** | `EJO/2026/10/0147` |

> 🗣️ **Ucapkan:**
> *"Setiap pengajuan wajib punya nomor EJO. Ini tie-nya ke dokumen
> Engineering Job Order resmi, jadi tidak ada permintaan sparepart yang
> tanpa jejak."*

---

## LANGKAH 5 — Isi Mesin / Area

1. **KLIK** kolom **"Mesin / Area"**.
2. **KETIK**: `Autoclave FVA2/A1 — Lini 2`
3. **TUNGGU** teks muncul utuh di kolom.

> 💡 Type dengan em-dash boleh, atau tulis saja `Autoclave FVA2/A1 Lini 2`.

---

## LANGKAH 6 — Pastikan Jenis Pengajuan = Sparepart

1. **KLIK** dropdown **"Jenis Pengajuan"**.
2. **KLIK** **"Sparepart"** (sudah default — konfirmasi saja).
3. **PERHATIKAN** kolom **"Status Urgensi"** — kotak abu-abu bertuliskan:
   > **"Diisi oleh Supervisor"**

> 🗣️ **Ucapkan:**
   > *"Perhatikan, urgency **tidak** bisa diisi teknisi. Status ini menentukan
   > prioritas, ditentukan Supervisor. Jadi teknisi tidak bisa
   > memprioritaskan pengajuannya sendiri."*

---

## LANGKAH 7 — Isi Spesifikasi Lengkap (WAJIB)

1. **KLIK** kotak teks **"Spesifikasi Lengkap"**.
2. **KETIK** (tekan `Enter` untuk baris baru):

```
KIT Ricambi Valve DN10 On-Off
Merk: Fedegari Asia Pte Ltd
P/N: KK000301
Untuk overhaul Autoclave FVA2/A1 (NB2963AT)
```

3. **TUNGGU** 4 baris terlihat.

> ⚠️ Kolom ini **wajib** dan tidak boleh kosong — kalau dikosongkan, server
> akan menolak dengan pesan *"Spesifikasi wajib diisi"*.

> 🗣️ **Ucapkan:**
> *"Spesifikasi wajib dan lengkap. Ini yang membedakan sistem ini dari
> chat WhatsApp — kalau barang datang tidak cocok, ada rujukan."*

---

## LANGKAH 8 — Isi Field Opsional (boleh dikosongkan)

| # | Kolom | Ketik / Klik |
|---|---|---|
| 1 | **Merk (opsional)** | **KETIK**: `Fedegari Asia Pte Ltd` |
| 2 | **Referensi / Penawaran (opsional)** | **KETIK**: `https://docs.google.com/spreadsheets/d/1cQjqA9e_ROK_DL6lhwLlY--XdPO9xNC43VbfdVxxWsE/edit` |

---

## LANGKAH 9 — Kirim Pengajuan

1. **KLIK** tombol biru besar **"KIRIM PENGAJUAN"**.
2. **TUNGGU** modal tertutup.
3. **TUNGGU** **Toast hijau** muncul:
   > **"Pengajuan terkirim"** *(atau pesan sejenis)*

4. **TUNGGU** angka di kanan atas layar berubah.

> 🗣️ **Ucapkan:**
> *"Selesai. Nomor registrasi dibuat otomatis dengan format
> BQ-Tahun-Bulan-Hari-Nomor urut. Contoh nyata dari seed: **BQ-2026-01-05-0007**."*

---

## LANGKAH 10 — Verifikasi Pengajuan Masuk ("Status Pengajuan Saya")

1. **KLIK** kartu menu:
   > 📋 **"Status Pengajuan Saya"**

2. **TUNGGU** modal **"Status Pengajuan Saya"** terbuka.
3. **CARI** nomor registrasi yang baru saja dibuat (paling atas).
4. **PERHATIKAN** kolom status:

| Kolom | Nilai yang tampil |
|---|---|
| Status Approval SPV | 🟡 **Menunggu** |
| Status Approval Manager | 🟡 **Menunggu** |
| Status Pengadaan | 🔵 **BQ Baru** |
| Urgency | ⚪ **Normal** |

> 🗣️ **Ucapkan:**
> *"Semua pengajuan otomatis berstatus **BQ Baru**, dan menunggu approval SPV.
> Tidak ada satu pun yang bisa langsung loncat ke Manager."*

---

## 🔀 VARIAN: PENGAJUAN JASA (opsional, 60 detik)

1. **KLIK** **"Form Pengajuan BQ"** lagi.
2. **KLIK** dropdown **Jenis Pengajuan** → **KLIK** **"Jasa (JA/BR)"**.
3. **PERHATIKAN**: kolom **Item Code** berubah jadi opsional, dan muncul
   kotak baru **"Keterangan Jasa"**.
4. **KLIK** kolom **Qty Diminta** → **KETIK** `1`.
5. **KLIK** **Satuan (UoM)** → **KETIK** `Unit`.
6. **KLIK** **Purpose** → **KLIK** **Lainnya**.
7. **KLIK** **No. EJO** → **KETIK** `EJO/2026/10/0148`.
8. **KLIK** **Mesin / Area** → **KETIK** `Capping VCM200 — Lini 1`.
9. **KLIK** **Keterangan Jasa** → **KETIK**:
   `P overhaul capping head VCM200, penggantian seal ring dan bearing`
10. **KLIK** **Spesifikasi Lengkap** → **KETIK**:
    `Jasa overhaul capping head, termasuk SGD, fitting, dan pelaporan`
11. **KLIK** **"KIRIM PENGAJUAN"** → **TUNGGU** toast hijau.

> 🗣️ **Ucapkan:**
> *"Sistem ini juga menangani pengajuan **jasa**, yang di aplikasi lama
> selalu jadi catatan yang dicatat manual di buku. Sekarang punya nomor
> registrasi dan bisa dimonitor sama seperti sparepart."*

---

## ⚠️ KESALAHAN YANG SERING TERJADI

| Gejala | Penyebab | Solusi |
|---|---|---|
| Toast merah *"Item Code tidak ditemukan"* | Kode salah ketik | **HAPUS** kolom, **KETIK** ulang `O-16731-00` |
| Kolom merah di **Spesifikasi** | Kosong | Isi minimal 1 kalimat |
| Tombol **KIRIM** tidak aktif | Field wajib belum lengkap | Lengkapi Qty, UoM, Purpose, No. EJO, Mesin/Area, Spesifikasi |
| Toast merah *"Gagal membuat pengajuan"* | Server mati | `Ctrl` + `Shift` + `N`, buka `http://localhost:3000` |

---

## ➡️ LANJUT KE: `03-Approval-SPV-dan-Manager.md`
