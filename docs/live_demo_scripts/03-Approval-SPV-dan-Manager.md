# 03 — APPROVAL BERJENJANG: SUPERVISOR → MANAGER

> **Peran yang performs:** **Supervisor 1** (`INN` / `30INN11`) lalu **Manager** (`KSW` / `01KSW10`)
> **Durasi:** ± 5 menit

---

## 🎯 TUJUAN

Menunjukkan **dua lapis approval** dan membuktikan bahwa **Manager tidak bisa
final-approve sebelum Supervisor menyetujui** (aturan alur di backend, bukan sekadar UI).

---

## ⚙️ SYARAT AWAL

- Sudah ada pengajuan **"Menunggu"** di SPV (dari file `02`).
- Dua jendela siap: **Supervisor 1** dan **Manager**.

---

## BAGIAN A — APPROVAL OLEH SUPERVISOR 1

### LANGKAH 1 — Login sebagai Supervisor 1

1. **KLIK** jendela browser → buka `http://localhost:3000`.
2. **KLIK** kolom **Username** → **KETIK**: `INN`
3. **KLIK** kolom **Password** → **KETIK**: `30INN11`
4. **KLIK** tombol **"LOGIN"**.
5. **TUNGGU** grid menu tampil. Sapaan terbaca: **"Selamat Datang, Supervisor 1!"**

> 💡 **TIPS:** di halaman Supervisor 1 juga tampil blok
> **"Antrean Approval Saya"** — lengkap dengan KPI jumlah antrean,
> 5 pengajuan terbaru, dan tombol sakelar **Tim Saya / Semua Tim**.

---

### LANGKAH 2 — Buka Monitoring & Approval BQ

1. **KLIK** kartu menu:
   > 📊 **"Approval BQ Tahap Supervisor"**

2. **TUNGGU** modal **"Monitoring & Approval BQ"** terbuka.

---

### LANGKAH 3 — Cari Pengajuan Menunggu

1. **KLIK** kolom pencarian di dalam modal:
   > 🔍 *"Cari no. registrasi / teknisi / item / EJO..."*
2. **KETIK**: `O-16731`
3. **TUNGGU** ≈ 0,5 detik → tabel ter-filter ke pengajuan tersebut.
4. **CARI** baris dengan badge 🟡 **"Menunggu"** pada kolom **SPV**.
5. **KLIK** baris tersebut bila perlu untuk menyorot.

---

### LANGKAH 4 — Ubah Urgency (khusus Supervisor)

1. **KLIK** dropdown **Urgency** pada baris tersebut.
2. Pilih salah satu:

| Pilihan | Kapan dipilih |
|---|---|
| ⚪ **Normal** | Kebutuhan rutin, ada stok pengganti |
| 🔴 **Urgent** | Mesin berhenti, sparepart kritis habis |

3. **KLIK** **"Urgent"** untuk pengajuan `O-16731-00` (stok **0**, min **8**).
4. **TUNGGU** toast muncul: *"Urgency diperbarui."*
5. **PERHATIKAN** kolom **Urgency** berubah jadi badge 🔴 **Urgent**.

> 🗣️ **Ucapkan:**
> *"Supervisor punya satu hak khusus: menentukan **urgency**. Teknisi tidak
> boleh. Dan di sini urgency-nya benar-benar **Urgent**, karena stok item ini
> nol sementara minimum-nya 8."*

---

### LANGKAH 5 — Setujui sebagai Supervisor

1. **KLIK** tombol **"Setujui"** pada kolom **SPV**.
2. **TUNGGU** toast hijau: ✅ **"Status approval SPV diperbarui."**
3. **PERHATIKAN**:

| Kolom | Sebelum | Sesudah |
|---|---|---|
| SPV | 🟡 Menunggu | 🟢 **Disetujui** |
| Manager | 🟡 Menunggu | 🟡 **Menunggu** *(tidak berubah!)* |

> 🗣️ **Ucapkan:**
> *"Perhatikan — status Manager **tidak ikut berubah**. Approval itu berjenjang,
> satu tahap satu tahap. Satu klik SPV belum cukup untuk sampai Manager."*

---

### LANGKAH 6 — Uji Penolakan (opsional, 30 detik)

1. **KLIK** **"Tolak"** pada baris lain yang masih Menunggu.
2. **KLIK** **"Ya"** di dialog konfirmasi.
3. **TUNGGU** badge SPV berubah jadi 🔴 **Ditolak**.

> 🗣️ **Ucapkan:**
> *"Supervisor juga punya hak menolak, dan penolakannya tercatat di riwayat —
> bukan hilang begitu saja."*

---

## BAGIAN B — FINAL APPROVAL OLEH MANAGER

### LANGKAH 7 — Login sebagai Manager

1. **KLIK** jendela Manager.
2. **KLIK** **Logout** di kanan atas bila perlu.
3. **KLIK** kolom **Username** → **KETIK**: `KSW`
4. **KLIK** kolom **Password** → **KETIK**: `01KSW10`
5. **KLIK** **"LOGIN"** → **TUNGGU** grid menu Manager tampil.

> 💡 **Perhatikan perbedaan nama kartu Manager:**
>
> | Role | Nama kartu untuk membuka tabel approval |
> |---|---|
> | Supervisor 1 / 2 / **Administrator** | **"Approval BQ Tahap Supervisor"** |
> | **Manager** | **"Approval BQ Urgent"** |
>
> Keduanya membuka modal yang sama (**"Monitoring & Approval BQ"**), hanya
> judul kartunya berbeda. Jangan sampai salah klik.
5. **KLIK** **"LOGIN"** → **TUNGGU** grid menu Manager tampil.

---

### LANGKAH 8 — Uji Aturan Alur (BUKTI PENTING)

1. **KLIK** kartu **"Approval BQ Urgent"** (kartu milik Manager).
2. **TUNGGU** modal **"Monitoring & Approval BQ"** terbuka.
3. **KLIK** kolom pencarian → **KETIK**: `O-16731`
4. **CARI** baris yang kolom **SPV** masih **"Menunggu"**.
5. **PERHATIKAN** kolom **Manager** pada baris itu:
   - Tombol **Approve** dan **Reject** tampil **pucat / tidak bisa diklik**
     (-grey, cursor-not-allowed).
   - **ARAHKAN** kursor ke tombolnya → muncul tooltip:
     > *"Menunggu persetujuan Supervisor (SPV)"*

6. **KLIK** paksa tombolnya — **tidak terjadi apa-apa**.

> **Ucapkan:**
> *"Saya login sebagai Manager. Tombol Approve-nya **ter-disable** karena
> Supervisor belum menyetujui. Saya klik paksa — tetap tidak terjadi apa-apa.
> Dan kalau dicek dari Network, server mengembalikan **HTTP 400** dengan pesan:
> 'Manager hanya bisa menyetujui setelah Supervisor menyetujui pengajuan ini.'
> Aturan ini ditegakkan di backend, jadi tidak bisa diakali dari browser."*

---

### LANGKAH 9 — Final Approval yang Berhasil

1. **CARI** baris dengan **SPV = "Disetujui"** (tombol Manager sudah aktif).
2. **KLIK** tombol hijau **"Approve"** di kolom **Manager**.

   > 💡 Untuk Manager **bukan dropdown** — melainkan **tombol Approve / Reject**,
   > sama seperti tombol SPV. Bedanya hanya Manager memakai dua tombol.

3. **TUNGGU** toast hijau muncul: *"Status approval Manager diperbarui."*
4. **PERHATIKAN** kolom **Manager** berubah jadi badge hijau **Disetujui**.
### LANGKAH 10 — Verifikasi Hasil Akhir

1. **TUNGGU** toast hijau muncul.
2. **PERHATIKAN**:

| Kolom | Nilai akhir |
|---|---|
| SPV | 🟢 Disetujui |
| Manager | 🟢 **Disetujui** |
| Status Pengadaan | 🔵 **BQ Baru** *(siap masuk tahap pengadaan)* |

3. **CATAT:** baris ini sekarang **fully approved**, sehingga akan muncul di
   **Rekapan Pengajuan** (file `05`).

> 🗣️ **Ucapkan:**
> *"Sekarang pengajuan ini **fully approved**. Dia masuk antrean pengadaan —
> dan tahap berikutnya hanya boleh dijalankan oleh **Administrator**."*

---

## 📊 TABEL RINGKAS HAK AKSES

| Aksi | Teknisi | Supervisor | **Administrator** | Manager |
|---|:---:|:---:|:---:|:---:|
| Buat pengajuan BQ | ✅ | — | — | — |
| Ubah **Urgency** | ❌ | ✅ | ❌ | ✅ |
| Approval **SPV** | ❌ | ✅ | ❌ | ✅ |
| Approval **Manager** | ❌ | ❌ | ❌ | ✅ |
| **Status Pengadaan** | ❌ | ❌ | ✅ **KAHUASA** | ✅ |
| PR Summary | ❌ | ❌ | ❌ | ✅ |
| Kelola user | ❌ | ❌ | ❌ | ✅ |

---

## ➡️ LANJUT KE: `04-Status-Pengadaan-Administrator.md`

> **PENTING:** file berikutnya adalah **inti revisi role Officer → Administrator**.
> Pastikan alur file ini sudah berhasil sampai Manager final-approve.
