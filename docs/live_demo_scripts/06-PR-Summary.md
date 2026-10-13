# 06 — PR SUMMARY

> **Peran yang performs:** **Manager** (`KSW` / `01KSW10`)
> **Peran yang performs:** **Manager** (`KSW` / `01KSW10`)
> **Durasi:** ± 3 menit

---

## 🎯 TUJUAN

Menunjukkan modul **PR Summary** sebagai laporan eksekutif yang **read-only**,
serta membuktikan modul ini **tidak bisa diakses** role lain.

---

## ⚠️ PERINGATAN AKSES

Modul ini **hanya tampil** untuk:

| Peran | Bisa buka PR Summary? |
|---|:---:|
| Teknisi | ❌ TIDAK |
| Supervisor 2 | ❌ TIDAK |
| **Administrator** | ❌ **TIDAK** |
| **Supervisor 1** | ✅ YA |
| **Manager** | ✅ YA |

> 📎 Alasan: PR Summary berisi data **agregat manajemen** (komposisi &
> trend pengajuan), jadi dibatasi pada manajemen. Teknisi tidak boleh melihat
> agregat seluruh tim.

---

## LANGKAH 1 — Login sebagai Manager

1. **KLIK** jendela Manager.
2. **KLIK** kolom **Username** → **KETIK**: `KSW`
3. **KLIK** kolom **Password** → **KETIK**: `01KSW10`
4. **KLIK** **"LOGIN"** → **TUNGGU** grid menu tampil.

---

## LANGKAH 2 — Buka PR Summary

1. **CARI** kartu menu:
   > 📊 **"PR Summary"**

2. **KLIK** kartu tersebut.
3. **TUNGGU** modal **"PR Summary"** terbuka.

---

## LANGKAH 3 - Konfirmasi Sifat Read-Only

1. **PERHATIKAN** sub-teks di bawah judul:

   > *"Laporan & monitoring seluruh data pengajuan — **tampilan baca-saja**"*

2. **PERHATIKAN**: **TIDAK ADA** tombol **Setujui**, **Tolak**, **Approve**,
   maupun dropdown status di dalam tabel ini.
3. **KLIK** satu baris → **TIDAK ADA** yang berubah.

> 🗣️ **Ucapkan:**
> *"PR Summary sengaja dibuat **read-only**. Fungsinya untuk melihat
> dan mengambil keputusan, **bukan** untuk mengubah data.
> Kalau saya mau mengubah, saya harus ke modul Approval atau modul
> Pengadaan."*

---

## LANGKAH 4 — Baca Komposisi

1. **KLIK** tab **"Komposisi Status Pengajuan"**.
2. **TUNGGU** grafik/tabel komposisi tampil.
3. **TUNGGU** komposisi **Status Approval** tampil (Menunggu / Disetujui / Ditolak).

> 🗣️ **Ucapkan:**
> *"Dua sudut pandang: komposisi **status pengadaan** (sudah sejauh mana
> sudah sejauh mana ekspedisi berjalan) dan komposisi **status approval**
> (sudah disetujui atau belum). Manajer butuh keduanya."*

---

## LANGKAH 5 - Cari Pengajuan Tertentu

1. **KLIK** kolom pencarian di dalam modal:
   > 🔍 *"Cari no. registrasi / teknisi / item / EJO..."*
2. **KETIK**: `O-16731`
3. **TUNGGU** ≈ 0,5 detik → tabel ter-filter hanya baris terkait.
4. **HAPUS** teks pencarian → **TUNGGU** seluruh tabel kembali.

---

## LANGKAH 6 - Bukti Pembatasan Akses (bagian penting)

### CARA A — Login sebagai Administrator, tidak ada menunya

1. **KLIK** **Logout**.
2. **LOGIN** `ANS` / `ANS1805`.
3. **LIHAT** grid menu.

   > ❌ **TIDAK ADA kartu "PR Summary"** sama sekali.

> 🗣️ **Ucapkan:**
> *"Saya login sebagai Administrator. Kartu PR Summary **tidak ada**.
> Menu ini memang hanya untuk manajemen."*

### CARA B — Coba akses langsung via URL (lebih kuat)

1. Tekan **F12** → **KLIK** tab **Console**.
2. **KETIK**:

```javascript
fetch('/api/pengajuan/summary?username=ANS')
  .then(r => r.status)
  .then(s => console.log('HTTP', s));
```

3. **TEKAN** `Enter`.

   > ❌ Console: **`HTTP 403`**

4. **ULANGI** dengan `username=KSW`.

   > ✅ Console: **`HTTP 200`**

> 🗣️ **Ucapkan:**
> *"Saya coba paksa akses lewat API langsung. Role Administrator
> dapat **403 Forbidden**, Manager dapat **200 OK**.
> Pembatasan ditegakkan di server, bukan sekadar disembunyikan di menu."*

---

## ➡️ LANJUT KE: `07-Critical-Part-List.md`
