# Ringkasan Pengecekan Folder (11 Oktober 2026)

## A. Folder "CP Kelompok A 127-20261011T154435Z-1-001_BARU"

Lokasi: `Micropage E-Sparepart - app - deployed\CP Kelompok A 127\CP Kelompok A 127-20261011T154435Z-1-001_BARU\CP Kelompok A 127\`

Struktur yang terverifikasi:

```
CP Kelompok A 127/
├── Bahan Capstone Project/
│   ├── BAB 3 Tugas CP.docx            ← draf Bab 3 (yang sedang digarap @giren)
│   ├── Draft Bab 3 CP 127 A.docx
│   ├── Draft Capstone Project Mochammad Fadhilah Hakim.docx
│   ├── Proposal Capstone Project Kelompok A.docx (+ "BAB 1 & 2" + Revisi)
│   ├── PROPOSAL CAPSTONE PROJECT.docx
│   ├── Proposal Penelitian Metodologi ... Hakim.docx
│   ├── Aps Script CP.docx
│   ├── jurnal/artikel PDF (… 20 file)
│   └── Raw Data CP/  (All Item Code, BQ On Going, BQ Summary, Critical Part,
│                      Database Approval SPV/MGR, Form BQ Testing tiap teknisi,
│                      On Hand, PR Summary)
├── Poster, PPT dan Video_/
│   ├── Foto Anggota/      ← SEMENTARA ADA 2 FILE:
│   │         IMG-20260322-WA0016.jpg
│   │         IMG_0041~photo.HEIC
│   │         (Kak Fadhil bilang sudah upload fotonya — cek apakah 2 file ini
│   │          sudah keseluruhan atau baru sebagian)
│   ├── Poster/  (kosong?)
│   ├── PPT/     (kosong?)
│   └── Video/   (kosong?)
├── Referensi Capstone Project/
│   ├── Salinan LAPORAN CAPSTONE PROJECT KELOMPOK A.pdf
│   ├── Salinan POSTER Infographic ... (29.7 x 21 cm).jpg
│   ├── Salinan POWERPOINT CAPSTONE PROJECT KELOMPOK A.pptx
│   ├── Salinan Rekapan Laporan Excel.jpg
│   ├── Salinan Antrean Siswa.jpg
│   ├── Salinan input manual perhari.jpg
│   ├── Salinan wawancara bersama manajemen sekolah.jpg
│   └── Salinan Wawancara manajemen (...).mp3
├── Berita Acara Kerja Kelompok.docx
├── CHECKLIST DAN TO DO LIST TUGAS CP.docx
└── Data Lapangan.docx
```

Catatan:
- File **foto anggota** yang sudah ada kemungkinan baru foto Kak Fadhil; foto anggota lain (Avwan, Giren, Sarifah, Wida) belum terlihat → perlu tanggal & checklist lagi.
- Ganda dengan folder lama di `CP Kelompok A 127/` root (`Bahan Capstone Project-20260925...LAMA2`, `...-20261003...BARU`, `Bahan Capstone Project_LAMA`, plus 2 file .zip). Folder BARU tanggal 11/10 ini versi terbaru yang bisa dipakai sebagai sumber utama.

## B. Isi seluruh folder kerja saat ini (`Micropage E-Sparepart - app - deployed`)

- **Aplikasi (esensial):** `server.js`, `src/`, `public/`, `database/`, `package.json` (+lock), `.env`, `.env.example`, `vercel.json`. *(Folder utuh "Micropage E-Sparepart - app - utama" sudah dipisah ke `App-list\`. folder bersih.)*
- **Asset CP / laporan:** `CP Kelompok A 127/`, `Salinan_Spreadsheet_Sparepart/`, `README_SUBMISSION.md`, `README.md`, `CHECHKLIST...docx`, draft Bab 3, laporan QA (`*.md`), `analysis-report.txt`, `Catatan_Review_Bab3_Avwan.*`, `Draft_Teknis_Bab3_Avwan.md`, `Data_SPV_tidak_ada_di_DB_pengajuan.txt`, `rekam-tour-qa-114tes.srt`.
- **Pengujian/rekaman:** `docs/`, `tests/`, `scripts/`, `run-qa-test.js`, `verify-controller.js`, `server_pid.txt`.
- **Versi folder:** `-Micropage E-Sparepart-`, `aplikasi`, `Micropage E-Sparepart - app`, `- LCL`, `- LCL - 2`, `- utama` (di `App-list\`).

## C. Hal yang perlu ditindaklanjuti (atas dasar chat Kak Fadhil 11/10)

1. Upload foto seluruh anggota ke `Poster, PPT dan Video_\Foto Anggota`.
2. Revisi Bab 3 sesuai poin 1–7 (draf tersedia di `01` dan `03`).
3. Sepakati titipan poin 8 (Officer vs Administrator untuk status pengadaan) antara Kak Fadhil (business owner) dan Avwan (dev).