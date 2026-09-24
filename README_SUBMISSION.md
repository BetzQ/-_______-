# Pengumpulan Capstone Project - Micropage E-Sparepart

**Program Studi:** Sistem Informasi - Universitas Terbuka (UT)
**Kelompok / Tim:** Kelompok A 127
**Pembimbing:** Pak Purwanto
**Mata Kuliah:** Tugas Akhir Program Sarjana (TAPS) - MKKI4450
**Judul:** Sistem Manajemen Suku Cadang (Sparepart) Terintegrasi - Micropage E-Sparepart

**Pembagian peran (sesuai Rencana Kerja Mingguan Kelompok A 127 - 5 anggota):**

| No | Peran | Nama | Tanggung jawab |
|----|-------|------|----------------|
| 1 | Lead Developer / Architect | Avwan | Arsitektur & pengembangan ulang website hosting, kode, pengujian produk |
| 2 | Idea Initiator, Business Analyst & Technical Writer | Fadhil | Pemaparan sistem Fonko Gemini, kebutuhan fitur, laporan teknis |
| 3 | Literature Researcher & General Writer | Sarifah | Bab I, II, V & formatting |
| 4 | Visual & Media Specialist | Wida | PPT, poster A4, skrip/video demo |
| 5 | System Analyst & Modeling Specialist | Giren | Bab III, DFD/flowchart/use case/activity diagram |

> Dokumen ini adalah panduan pengumpulan (submission) untuk dosen pembimbing /
> penguji dan anggota tim. Ditujukan agar penilaian dapat dilakukan TANPA perlu
> menyalin atau menerima seluruh source code.

---

## 1. Pengumpulan sesuai Checklist Mingguan (M3/M5/M7/M8)

Rujukan: `CP Kelompok A 127/CHECKLIST DAN TO DO LIST TUGAS CP.docx`

| Minggu | Tugas | Artifact |
|--------|-------|----------|
| M3 | Tugas 1 | Proposal (PDF) — Bab I, II, III |
| M5 | Tugas 2 | Laporan Kemajuan (PDF) + slide PPT 8-12 |
| M7 | Tugas 3 | Karya Ilmiah (PDF) + Berita Acara + video YouTube + poster A4 |
| M8 | Sesi 8 | Evaluasi produk, arsip dokumen, link YouTube aktif |

Ringkasan artifact yang dinilai penilai:

| No | Artifact | Keterangan | Wajib? |
|----|----------|------------|--------|
| 1 | Laporan TAP / Karya Ilmiah (PDF) | Laporan lengkap sesuai panduan UT MKKI4450 | Ya |
| 2 | Demo Aplikasi (link live) | URL aplikasi yang sudah ter-deploy | Ya |
| 3 | Video demo YouTube | Rekaman penjelasan fitur end-to-end (M7) | Ya |
| 4 | PPT Laporan Kemajuan (8-12 slide) | Menyusul di M5 | sesuai jadwal |
| 5 | Poster A4 | Menyusul di M7 | sesuai jadwal |
| 6 | Berita Acara | Menyusul di M7 | sesuai jadwal |
| 7 | Source code (zip) | Hanya bila tutor/penguji meminta | Opsional |

Catatan resmi: capstone UT menilai **laporan + aplikasi berjalan**, bukan
kewajiban menyerahkan source code. Bila source diminta, cukup berikan akses
`read` sementara pada repo privat, lalu dicabut setelah penilaian.

---

## 2. Demo Aplikasi (link live)

**URL utama:** `https://e-sparepart-system-tau.vercel.app`

Backend data tersimpan di **Supabase (PostgreSQL)**, sehingga aplikasi dapat
dijalankan dari link tersebut tanpa instalasi apa pun di komputer penguji.

### Akun demo (copy-paste untuk penguji)

| Role | Username | Password |
|------|----------|----------|
| Teknisi | `AAA` | `04AAA10` |
| Supervisor 1 | `INN` | `30INN11` |
| Supervisor 2 | `KAA` | `KAA1910` |
| Officer Penagihan | `ANS` | `ANS1805` |
| Manager | `KSW` | `01KSW10` |

---

## 3. Langkah Penguji (dosen/pembimbing)

1. Buka URL demo (bagian 2).
2. Login menggunakan akun demo (misal Manager `KSW`).
3. Jelajahi menu: Stok (KPI), Pengajuan BQ, Approval Supervisor, Approval
   Manager, PR Summary, BQ Summary, Monitoring, Critical Part, Report.
4. Verifikasi laporan berjalan ("menunggu", "disetujui", dsb.) sesuai tahap.

Alur persetujuan yang dinilai:
- Teknisi mengajukan BQ, Supervisor 1 menyetujui, Manager menyetujui, lalu
  status Pengadaan / BQ Summary.

---

## 4. Menjalankan di Lokal (fallback bila link live tidak tersedia)

Prasyarat: Node.js 18+, PostgreSQL (atau Supabase), file `.env`.

```bash
# install dependency
npm install

# siapkan file .env (lihat .env.example)
# Isi DATABASE_URL dengan koneksi Supabase/PostgreSQL

# jalankan server
node server.js
# akses di http://localhost:3000
```

File QA tersedia di `public/qa-test.html` dan `run-qa-test.js` untuk
verifikasi fungsional (dokumentasi di `GUIDES_TEST_MANUAL_QA.md`).

---

## 5. Daftar Repositori (akses privat)

Repositori yang terkait dengan pengembangan aplikasi:

| Repositori | Isi | Status |
|------------|-----|--------|
| `-_______-` (BetzQ) | Versi deployed Supabase (utama, live demo) | Public |
| `Micropage-E-Sparepart---app---LCL` | Versi local MySQL | Public |
| `Micropage-E-Sparepart-` | Varian keamanan tinggi (host binding + time bomb) | Privat |
| `aplikasi`, `Micropage-E-Sparepart---app` | Varian awal/lokal | Privat |

Kebijakan akses: seluruh repo dimiliki dan dikelola oleh **Avwan (Anggota 1 /
Lead Developer)** atas nama kelompok. Anggota tim lain tidak memerlukan akses
source code (peran mereka di laporan & media), sehingga akses diberikan hanya
bila diminta.

Bila penguji meminta bukti source code: owner mengundang (invite) username
penguji dengan hak **Read**, kemudian **di-remove setelah penilaian selesai**.

---

## 6. Pernyataan Kepemilikan

- Seluruh source code, data, dan dokumentasi merupakan hasil pengerjaan
  Kelompok A 127 (kode & pengujian oleh Avwan; laporan & media oleh tim).
- Repositori GitHub menyimpan riwayat commit (git history) yang dapat
  diverifikasi sebagai bukti orisinalitas.
- Aplikasi dikunci dengan **host binding** dan **batas waktu (time bomb)**
  untuk mencegah penggunaan di luar keperluan akademik.

---

_Disiapkan untuk keperluan penilaian Tugas Akhir Program Sarjana (TAPS)
Universitas Terbuka - Program Studi Sistem Informasi._