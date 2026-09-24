# KONFIRMASI MANUAL — 5 ITEM (untuk diserahkan & diproses ulang)

Dibuat: 24 Sep 2026
Tujuan: 5 hal yang belum saya (AI) ketahui / belum bisa diverifikasi 100%, supaya tim bisa cek manual dan hasilnya dikasih ke saya.

> Cara pakai: untuk tiap item ada [LOKASI CEK] + [CEK MANUAL] + [PROMPT AI]. Salin isi kotak `PROMPT AI` ke AI chat (ChatGPT/Gemini/Claude), tempel juga isi file yang diminta, lalu kirim hasil outputnya (hasil jawaban AI) ke saya apa adanya.

---

## ITEM 1 — Isi diagram alur "Flow Data Pengajuan Barang"

**Kenapa perlu:** Saya tidak bisa membaca file gambar (PNG), jadi alur sebenarnya di diagram belum saya ketahui. Saya sudah memastikan kode aplikasi mengikuti alur "Teknisi → SPV → Manager → Officer", tapi perlu dikonfirmasi kesamaan dengan diagram buatan ka Fadhil.

**LOKASI CEK:**
```
CP Kelompok A 127\Bahan Capstone Project\Raw Data CP-20260924T053522Z-1-001_v2_baru\Raw Data CP\Flow Data Pengajuan Barang.drawio.png
```
(Ada juga diagram lain yang mungkin berguna: `CP Kelompok A 127\Bahan Capstone Project\Diagram Tanpa Judul.drawio (5).png`, `(6).png`, `Activity Diagram SS.drawio.png`)

**CEK MANUAL:** Buka file PNG di atas, lihat alurnya, lalu salin ke AI chat (lihat prompt di bawah). Kalau bisa, minta ka Fadhil juga mengirim file editor drawio (`.drawio` / `.xml`) karena versi teksnya jauh lebih akurat.

```
PROMPT AI (ITEM 1):
"Baca file gambar `Flow Data Pengajuan Barang.drawio.png` lalu transkripsikan SEMUA isi diagram ke teks. Wajib keluarkan:
1) Daftar semua kotak/node (deploy: nama aktor/role, aksi, judul dokumen).
2) Semua keputusan (belah ketupat/decision) dan kondisinya.
3) Urutan panah/alur dari awal sampai akhir (beri nomor langkah).
4) Semua status yang tampil (misal: Menunggu, Disetujui, Ditolak, BQ Baru, Proses PO, dll).
5) Ada berapa level approval dan siapa approvernya.
6) Kotak/judul persis seperti di gambar (jangan diterjemahkan).
Format output: teks bernomor, tanpa mengarang-inventaris, hanya dari isi gambar."
```

**Output yang dikasih ke saya:** Jawaban teks AI di atas.

---

## ITEM 2 — Anomali `ROSBR0007` (SPV tolak vs MGR setuju)

**Kenapa perlu:** Data mentah saling bertentangan untuk 1 pengajuan. Saya sudah mengeksekusi sesuai file MGR (Disetujui), tapi perlu kepastian dari ka Fadhil.

**LOKASI CEK:**
```
CP Kelompok A 127\Bahan Capstone Project\Raw Data CP-20260924T053522Z-1-001_v2_baru\Raw Data CP\Database Approval SPV BQ Testing.xlsx  → sheet "Gform Aproval SPV BQ Testing"
CP Kelompok A 127\Bahan Capstone Project\Raw Data CP-20260924T053522Z-1-001_v2_baru\Raw Data CP\Database Approval MGR BQ Testing.xlsx  → sheet "Gform Aproval SPV BQ Testing"
```

**CEK MANUAL:** Buka kedua file, cari baris `Nomor Registrasi BQ = ROSBR0007`, lihat kolom `Status Approval` + `Note` di keduanya. Konfirmasi ke ka Fadhil: **yang benar yang mana** (SPV Reject atau MGR Approve)? Atau apakah ada alur revisi/override sehingga keduanya valid?

```
PROMPT AI (ITEM 2):
"Buka file Excel `Database Approval SPV BQ Testing.xlsx` dan `Database Approval MGR BQ Testing.xlsx` (sheet masing-masing 'Gform Aproval SPV BQ Testing'). Cari SEMUA baris di kedua file yang kolom 'Nomor Registrasi BQ'-nya = ROSBR0007. Untuk setiap baris keluarkan: file, Timestamp, Nomor Registrasi BQ, Status Approval, Kategori (jika ada), Note. Lalu jawab: apakah di kedua file ada yang bertentangan (SPV Reject tapi MGR Approve)? Jika ya, rangkum konfliknya apa."
```

**Output yang dikasih ke saya:** Jawaban AI + keputusan ka Fadhil (yang benar = Approve atau Reject?).

---

## ITEM 3 — Cek dashboard aplikasi di browser (bagian Manager)

**Kenapa perlu:** Backend & DB sudah saya verifikasi via API, tapi tampilan browser belum bisa saya cek.

**LOKASI CEK (aplikasi):**
```
Server  : jalankan dari folder project:   node server.js
URL     : http://localhost:3000
Halaman QA otomatis : http://localhost:3000/qa-test.html
Kode    : public\index.html
```
**Akun yang bisa dipakai untuk cek (dari seed data):**
```
Manager     : username KSW  password 01KSW10
Supervisor 1: username INN  password 30INN11
Officer     : username ANS  password ANS1805
```

**CEK MANUAL (urutan):**
1. `node server.js` lalu buka `http://localhost:3000`.
2. Login sebagai **Manager (KSW)**.
3. Buka menu monitoring/approval BQ. Pastikan:
   - Kolom **"Approval Manager"** tampil (ada badge Menunggu/Disetujui/Ditolak).
   - Filter status (Menunggu / Disetujui / Ditolak) bekerja untuk Approval Manager.
   - Pada filter **Disetujui**, muncul pengajuan contoh hasil data baru (mis: `SFHRO0001`, `AAARO0023`, `AAARO0024`) — status Manager = Disetujui.
   - Role Manager bisa menolak/menyetujui pengajuan yang `status_approval_spv = Disetujui` dan `status_approval_manager = Menunggu`.
4. (Opsional) Jalankan `http://localhost:3000/qa-test.html` dan pastikan tidak ada item merah P0/P1.

```
PROMPT AI (ITEM 3) — OPSIONAL, kalau screen tidak dinilai cukup:
"Lihat screenshot halaman dashboard E-Sparepart (mode Manager) yang saya tempel. Laporkan: (1) apakah ada kolom/panel 'Approval Manager', (2) angka yang tertampil pada badge Menunggu/Disetujui/Ditolak untuk Approval Manager, (3) apa yang perlu diperbaiki agar konsisten dengan data."
```

**Output yang dikasih ke saya:** Screenshot halaman (atau jawaban prompt di atas) + catatan hal yang rusak/tidak tampil.

---

## ITEM 4 — Update ke-2 dari ka Fadhil (cek On Hand & Critical Part)

**Kenapa perlu:** Belum ada filenya. Ini alur kedua yang ka Fadhil bilang "ga seribet pengajuan". Begitu file masuk, kirim ke saya — aplikasi (tabel `spareparts` + API `/spareparts/alert` & `/spareparts/summary`) sudah siap.

**Yang perlu dikirim nanti:** Lokasi folder/file raw data baru (biasanya folder `Raw Data CP-<timestamp>_v3` atau sejenisnya di `CP Kelompok A 127\Bahan Capstone Project\`), plus konteks perubahan apa yang ka Fadhil maksud.

```
PROMPT AI (ITEM 4) — PAKAI SAAT FILE UPDATE KE-2 SUDAH DATANG:
"Ada folder raw data baru: <tempel lokasi folder>. Bandingkan dengan folder sebelumnya <tempel lokasi folder lama>. Sebutkan: 1) file apa saja yang baru/berubah, 2) isi sheet dan header tiap file baru, 3) apakah ada perubahan struktur kolom untuk On Hand Stock / Critical Part List, 4) 10 baris contoh tiap sheet. Jangan simpulkan, hanya ekstrak datanya."
```

**Output yang dikasih ke saya:** Jawaban AI + lokasi folder.

---

## ITEM 5 — 440 no-registrasi file SPV yang tidak ada di tabel pengajuan

**Kenapa perlu:** File `Database Approval SPV BQ Testing.xlsx` berisi 1.677 no-registrasi unik, tapi 1.237 di antaranya cocok dengan tabel `pengajuan_bq` dan **440 tidak ada pasangannya**. Kemungkinan: item_code tidak ada di master spareparts (foreign key), baris latihan/sample, atau data pengajuan memang belum masuk.

**LOKASI CEK:**
```
File data  (sumber SPV): CP Kelompok A 127\Bahan Capstone Project\Raw Data CP-20260924T053522Z-1-001_v2_baru\Raw Data CP\Database Approval SPV BQ Testing.xlsx
Daftar 440 yang TIDAK ada di DB (sudah saya generate): Data_SPV_tidak_ada_di_DB_pengajuan.txt
DB tujuan: tabel pengajuan_bq (Supabase) & e_sparepart_local (XAMPP MySQL)
```

**CEK MANUAL:** Buka file `Data_SPV_tidak_ada_di_DB_pengajuan.txt` untuk lihat daftarnya (contoh: `290x493x46`, `INNRO0001`, `MFHBR0002` ... `MFHBR0011`, dll). Beberapa tampak data latihan (mis. `290x493x46` aneh, `INNRO0001` nilai "Deskripsi"). Konfirmasi ke ka Fadhil: 440 ini perlu diimpor juga atau memang data sample yang tidak dipakai?

```
PROMPT AI (ITEM 5):
"Buka `Database Approval SPV BQ Testing.xlsx` (sheet 'Gform Aproval SPV BQ Testing') dan file teks `Data_SPV_tidak_ada_di_DB_pengajuan.txt` yang berisi daftar 440 no-registrasi. Bandingkan daftar itu dengan isi Excel, lalu untuk TIAP no-registrasi di daftar 440 keluarkan barisnya dari Excel (No Registrasi BQ, Timestamp, Status Approval, Kategori, Note). Jika ada baris yang isinya terlihat tidak valid / placeholder (seperti '290x493x46' atau berisi kata 'Deskripsi'), tandai khusus sebagai 'kemungkinan data latihan'. Ringkas akhir: berapa yang valid vs placeholder."
```

**Output yang dikasih ke saya:** Jawaban AI + keputusan tim (440 ini diimpor atau diabaikan?).

---

## Lampiran — Lokasi file yang sudah saya buat / ubah (kali ini)

```
scripts\syncApprovalManager.js            ← script sync keputusan Manager (sudah dieksekusi)
Data_SPV_tidak_ada_di_DB_pengajuan.txt    ← daftar 440 untuk ITEM 5
scripts\gen_missing_spv_list.js           ← pembuat daftar 440 (bisa dijalankan ulang)
scripts\import_raw_data.js                ← path diarahkan ke folder v2_baru
scripts\read-excel.js                     ← path diarahkan ke folder v2_baru
scripts\comparison-analysis.js            ← path diarahkan ke folder v2_baru + komentar MGR
Backup MySQL (jika gagal perlu restore):
C:\Users\avwan\AppData\Local\Temp\opencode\mysql_data_backup_20260924
```