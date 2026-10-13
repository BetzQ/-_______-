# 04 — UBAH STATUS PENGADAAN (ADMINISTRATOR)

> **⭐ FILE INTI REVISI: role "Officer" → "Administrator"**
> **Peran yang performs:** **Administrator** (`ANS` / `ANS1805`)
> **Durasi:** ± 7 menit · **Paling penting untuk dipamerkan ke jury**

---

## 🎯 TUJUAN

Membuktikan 3 hal sekaligus:

1. **Administrator** boleh mengubah status pengadaan (`BQ Baru` → `Selesai`).
2. **Role lama "Officer" sudah tidak punya hak ini sama sekali** (403).
3. Penguncian dilakukan **dua lapis** — frontend (dropdown disembunyikan)
   **dan** backend (server menolak dengan HTTP 403).

---

## 📜 LATAR BELAKANG PERUBAHAN

| Sebelum (role lama) | Sesudah (role baru) |
|---|---|
| `Officer` | **`Administrator`** |
| Bertugas hanya ubah status pengadaan | Pemegang wewenang sistem: procurement + approval user |

> 📎 **Alasan bisnis:** di PT Fonko, orang yang memegang transaksi pengadaan
> (PO, penawaran, kontrak) punya wewenang sistem, bukan sekadar petugas
> lapangan. Karena itu perannya dinaikkan menjadi **Administrator**.

---

## ⚙️ SYARAT AWAL

- Sudah ada pengajuan **fully approved** (SPV Disetujui + Manager Disetujui)
  → lihat file `03`.
- ⚠️ **WAJIB:** kolom `role` akun `ANS` di tabel `users` harus sudah bernilai
  **`Administrator`** (bukan `Officer`). Cara cek & perbaikinya ada di
  **Cek A** dan **Cek B** pada `00-Panduan-Umum.md`.
  Kalau role belum diubah, **langsung ke bagian "PANEK KALAU MENU TIDAK MUNCUL"
  di akhir file ini.**

---

## BAGIAN A — YANG BISA DILAKUKAN ADMINISTRATOR

### LANGKAH 1 — Login sebagai Administrator

1. **KLIK** jendela browser (atau **Logout** dulu bila perlu).
2. **KLIK** kolom **Username** → **KETIK**: `ANS`
3. **KLIK** kolom **Password** → **KETIK**: `ANS1805`
4. **KLIK** **"LOGIN"**.
5. **TUNGGU** halaman termuat.
6. **PERHATIKAN** sapaan besar di kiri atas:

   > **"Selamat Datang, Administrator!"**

7. **PERHATIKAN** 5 kartu menu yang tampil:

| # | Kartu (judul yang tampil) | Sub-teks |
|---|---|---|
| 1 | **Rekapan Pengajuan** | Rekap pengajuan tim yang sudah disetujui penuh |
| 2 | **Approval BQ Tahap Supervisor** | Persetujuan, urgency & monitoring pengajuan |
| 3 | **Critical Part List** | Daftar sparepart kritis |
| 4 | **On Hand Stock** | Cek ketersediaan stok gudang |
| 5 | **Layout Rak** | Lokasi penyimpanan sparepart di gudang |

> PENTING: kartu kedua bernama **"Approval BQ Tahap Supervisor"**, bukan
> "Monitoring". "Monitoring" hanya sebutan singkat di dokumen, bukan
> teks yang tampil di layar. Pastikan Anda klik yangzur.

> **Ucapkan:**
> *"Ini yang berubah dari versi sebelumnya. Dulu role ini bernama **Officer**.
> Sekarang menjadi **Administrator** - dan label welcome screen-nya ikut
> menyesuaikan otomatis."*

---

### LANGKAH 2 — Buka Monitoring & Approval BQ

1. **KLIK** kartu **"Approval BQ Tahap Supervisor"** (kartu ke-2).
2. **TUNGGU** modal **"Monitoring & Approval BQ"** terbuka.
3. **KLIK** kolom pencarian di bagian atas tabel:
   > *"Cari no. registrasi / teknisi / item / EJO..."*
4. **KETIK**: `O-16731`
5. **TUNGGU** tabel ter-filter ke satu baris saja.
6. **GESER** tabel ke kanan sampai kolom **"Status Pengadaan"** terlihat.

> **Ucapkan:**
> *"Saya cari dulu pengajuan yang tadi sudah disetujui penuh, supaya
> demo-nya fokus ke satu dokumen saja."*
---

### LANGKAH 3 — Pastikan Dropdown TAMPIL (tidak read-only)

1. **LIHAT** kolom **Status Pengadaan**.
2. **PERHATIKAN:** kolom ini **BERUBAH** menjadi **dropdown** (kotak pilih),
   **bukan** badge teks warna seperti di role lain.

   | Peran | Tampilan kolom Status Pengadaan |
   |---|---|
   | Teknisi | Badge teks (read-only) |
   | Supervisor 1 / 2 | Badge teks (read-only) |
   | **Administrator** | ✅ **DROPDOWN AKTIF** |
   | Manager | ✅ **DROPDOWN AKTIF** |

> 🗣️ **Ucapkan:**
> *"Kolom status pengadaan bagi saya berupa **dropdown yang bisa diklik**.
> Bandingkan dengan role lain — mereka cuma teks, tidak bisa disentuh."*

---

### LANGKAH 4 — Jalankan Pipeline Pengadaan (LANGKAH DEMO UTAMA)

> Pipeline resmi: `BQ Baru → Pending → Proses PO → PO Open →
> Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai`

Ubah status **secara bertahap**, satu per satu. Setiap kali status diubah,
**tunggu toast muncul** sebelum lanjut ke status berikutnya.

| Urutan | **KLIK** dropdown → **PILIH** | **TUNGGU** toast | Per/badge |
|---|---|---|---|
| 1 | **Pending** | *"Status pengadaan diperbarui."* | Badge Abu |
| 2 | **Proses PO** | *"Status pengadaan diperbarui."* | Badge Biru |
| 3 | **PO Open** | *"Status pengadaan diperbarui."* | Badge Biru tua |
| 4 | **Mencari Penawaran** | *"Status pengadaan diperbarui."* | Badge Kuning |
| 5 | **Barang Dikirim** | *"Status pengadaan diperbarui."* | Badge Ungu |
| 6 | **Tiba di Gudang** | *"Status pengadaan diperbarui."* | Badge Hijau |
| 7 | **Selesai** | *"Status pengadaan diperbarui."* | ✅ **Badge Hijau Solid** |

> 💡 **Tidak wajib** semua 7 tahap. Minimal **tahap 1 → 2 → 3** sudah cukup
> untuk membuktikan hak aksesnya.

> 🗣️ **Ucapkan (setelah tahap 3):**
> *"Status bergerak dari **Pending** ke **Proses PO** lalu **PO Open**.
> Ini mencerminkan Purchase Order yang benar-benar sudah terbit ke supplier."*

> 🗣️ **Ucapkan (setelah tahap 7):**
> *"Sampai **Selesai** — barang sudah tiba di gudang dan pengajuan ditutup.
> Seluruh proses,**dari awal sampai akhir, tercatat otomatis.**"*

---

### LANGKAH 5 — Cek Riwayat (Audit Trail)

1. **KLIK** tombol kecil **ikon 🕘 (Riwayat)** di ujung baris tersebut.
2. **TUNGGU** modal **"Riwayat Approval"** terbuka.
3. **PERHATIKAN** daftar entri terbaru:

| Waktu | Aktor | Aksi |
|---|---|---|
| *baru saja* | **ANS** (Administrator) | Status Pengadaan: BQ Baru → Pending |
| *baru saja* | **ANS** (Administrator) | Status Pengadaan: Pending → Proses PO |
| *baru saja* | **ANS** (Administrator) | Status Pengadaan: Proses PO → PO Open |

4. **KLIK** tombol **✕** untuk menutup.

> 🗣️ **Ucapkan:**
> *"Setiap perubahan saya catat **siapa**, **kapan**, dan **dari status apa ke
> status apa**. Tidak ada perubahan status yang bisa dilakukan diam-diam."*

---

## BAGIAN B — BUKTI HAK AKSES INI **HANYA** UNTUK ADMINISTRATOR

> ⚠️ **PENTING:** setelah migrasi, **tidak ada lagi akun ber-role `Officer`** di
> database. Jadi cara lama ("login sebagai Officer") **sudah tidak bisa dipakai**.
> Gunakan salah satu dari 2 cara di bawah ini — keduanya sama kuatnya.

---

### CARA 1 — Buktikan role lain TIDAK punya hak ini (paling meyakinkan)

> Mencoba sebagai **Supervisor 1** dan **Supervisor 2** — mereka punya akses ke
> modul yang sama persis, tapi **tidak** boleh mengubah status pengadaan.

1. **KLIK** **Logout**.
2. **KLIK** kolom **Username** → **KETIK**: `INN`
3. **KLIK** kolom **Password** → **KETIK**: `30INN11`
4. **KLIK** **LOGIN** → **TUNGGU** halaman termuat.
5. **KLIK** kartu **"Approval BQ Tahap Supervisor"**.
6. **KLIK** kolom pencarian → **KETIK**: `O-16731`
7. **LIHAT** kolom **Status Pengadaan** pada baris tersebut.

   > **Hasil: TIDAK ADA dropdown.** Yang muncul hanya **badge teks** berwarna.

8. **KLIK** dropdown **Urgency** di baris itu — bisa dibuka (itu hak Supervisor).
9. **KLIK** dropdown **Status Pengadaan** — **tidak ada / tidak bisa diklik**.
10. Ulangi cepat dengan akun **Supervisor 2** `KAA` / `KAA1910` — hasilnya sama.

> **Ucapkan:**
> *"Saya login sebagai **Supervisor 1**. Kartu menunya sama persis, tapi kolom
> **Status Pengadaan** cuma teks — **tidak ada dropdown**. Bandingkan dengan
> kolom **Urgency** yang tetap berupa dropdown: jadi role ini memang punya
> izin pada kolom yang berbeda, bukan sekadar tampilan saja."*

> 💡 Kalau ditanya *"tapi role Officer lama?"* — jawab:
> *"Role lama sudah tidak ada. Yang kami lakukan adalah **menaikkan**
> wewenang dari Officer menjadi Administrator, dan bukti pengunciannya ada di
> cara kedua."*

---

### CARA 2 — Uji langsung ke API (paling teknis, paling kuat)

1. **TEKAN** `F12` → **KLIK** tab **Console**.

2. **KLIK** kanan di area Console → **KLIK** **Clear console** dulu supaya bersih.

3. **KLIK** di Console lalu **KETIK** (atau **PASTE**) kode ini, lalu **TEKAN** `Enter`.
   Kode ini **otomatis mencari nomor registrasi yang benar** dari database,
   jadi Anda tidak perlu menghafal nomor apa pun:

```javascript
(async () => {
  const all = await fetch('/api/pengajuan/all?actor=KSW').then(r => r.json());
  const no = (all.data || [])[0] && all.data[0].no_registrasi;
  if (!no) return console.log('Belum ada pengajuan sama sekali.');
  for (const u of ['ANS', 'INN', 'KAA', 'KSW']) {
    const r = await fetch('/api/pengajuan/' + encodeURIComponent(no) + '/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, status_pengadaan: 'Proses PO' })
    });
    const d = await r.json();
    console.log(u.padEnd(5), 'HTTP', r.status, '|', d.message || d.status);
  }
})();
```

4. **TUNGGU** 4 baris hasil muncul di Console:

```
ANS   HTTP 200 | Status pengadaan diperbarui.        <- Administrator BOLEH
INN   HTTP 403 | Status pengadaan hanya bisa diubah oleh Administrator / Manager.
KAA   HTTP 403 | Status pengadaan hanya bisa diubah oleh Administrator / Manager.
KSW   HTTP 200 | Status pengadaan diperbarui.        <- Manager BOLEH
```

> Perhatikan polanya: **Administrator (ANS) dan Manager (KSW) boleh**,
> sedangkan **Supervisor (INN, KAA) ditolak 403**. Ini ditulis di backend,
> jadi tidak bisa diakali dengan Inspector browser.

5. **KLIK** tab **Network** → **KLIK** ulang request yang gagal → **KLIK** tab
   **Response** → **TUNGGU** angka **403** terlihat.

> **Ucapkan:**
> *"Saya buktikan lewat request langsung ke server, tanpa lewat UI sama sekali.
> Empat role diuji berurutan: hanya yang berlabel Administrator dan Manager
> yang lolos, selain itu 403. Aturan ini di backend, jadiInspect browser
> tidak bisa diakali."*

> 💡 **Penting:** kode ini benar-benar mengubah status pengajuan pertama
> menjadi `Proses PO`. Kalau ingin menjaga data tetap bersih, jalankan kode ini
> **sebelum** demo, lalu kembalikan statusnya lewat UI.

## JAWABAN PERTANYAAN JURY: BAGAIMANA PENGUNCIANNYA BEKERJA

| Lapis | Mechanisme | Lokasi kode |
|---|---|---|
| **1. Frontend** | Dropdown disembunyikan / diganti badge untuk selain Administrator & Manager | `public/index.html` — `canProcure` |
| **2. Backend** | Server menolak dengan **HTTP 403** bila aktor bukan Administrator/Manager | `src/controllers/bqController.js` — `updateStatusPengajuan()` |
| **3. Database** | Kolom `status_pengadaan` punya **CHECK constraint** dengan 8 nilai yang diizinkan | `database/*.sql` |
| **4. Audit** | Semua perubahan dicatat di `pengajuan_log` + `activity_log` | `addPengajuanLog()`, `logActivity()` |

> 🗣️ **Ucapkan (kalau ditanya juri):**
> *"Kami tidak mengandalkan satu lapis saja. Yang kami pakai berlapis:
> **lapis pertama** menjaga pengalaman pengguna (dropdown disembunyikan),
> **lapis kedua** melindungi API (bisa diuji langsung), **lapis ketiga**
> menjaga integritas data di level database, **lapis keempat** memastikan audit."*

---

## 🆘 PANEK KALAU MENU TIDAK MUNCUL

> **Gejala:** setelah login `ANS`, kartu **"Approval BQ Tahap Supervisor"**
> **tidak ada**, atau hanya muncul menu lain.
>
> **Penyebab (99%):** role `ANS` di database masih **`Officer`**.

### Solusi — jalankan 2 perintah ini SEBELUM presentasi

1. **KLIK** terminal / VS Code Terminal di folder aplikasi ini.
2. **KETIK** lalu **TEKAN** `Enter`:

   ```
   node scripts/update_role_officer_to_administrator.js --apply
   ```

3. **TUNGGU** muncul: `[OK] Migrasi selesai. Tidak ada role "Officer" tersisa.`
4. **TEKAN** `F5` di browser, login ulang `ANS`.
5. **ULANGI** LANGKAH 1 file ini.

### Kalau tetap gagal

| Gejala | Tindakan |
|---|---|
| Pesan `[ERROR] DATABASE_URL tidak ditemukan` | `.env` kosong/bermasalah. Cek isi `.env`, pastikan ada baris `DATABASE_URL=` |
| Pesan `ENOTFOUND` / `ETIMEDOUT` | Koneksi database gagal. Cek internet |
| Menu sudah 5 kartu tapi dropdown tidak muncul | Pengajuan yang dipakai **belum full approve** → jalankan file `03` dulu |
| Kolom kosong / tidak ada data | Database kosong. Jalankan seed lebih dulu |

> ⏱️ **Sisakan waktu 5 menit** untuk langkah ini sebelum demo. Lebih baik
>uchi sekarang daripada gagal di depan jury.

---

## ✅ CHECKLIST SEBELUM PRESENTASI

- [ ] Sudah jalankan **Cek A** di `00-Panduan-Umum.md`
- [ ] Login `ANS` menampilkan **5 kartu** termasuk **Approval BQ Tahap Supervisor**
- [ ] Sapaan berbunyi **"Selamat Datang, Administrator!"**
- [ ] Minimal 1 pengajuan berstatus **fully approved** (SPV Disetujui + Manager Disetujui)
- [ ] Akun demo `BDT01` belum pernah didaftarkan
- [ ] Console browser (`F12`) **tidak** menampilkan merah
- [ ] Tidak ada kredensial yang terlihat di layar

---

## ➡️ LANJUT KE: `05-Rekapan-Pengajuan.md`

> **Atau**, bila waktu demo tinggal sedikit, langsung lompat ke
> `07-Critical-Part-List.md` supaya demo tetap merangkul modul stok.
