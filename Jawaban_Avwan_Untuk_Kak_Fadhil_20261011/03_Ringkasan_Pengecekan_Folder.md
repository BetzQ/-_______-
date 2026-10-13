# Ringkasan Pengecekan Folder (11 Oktober 2026) — untuk jawaban @Avwan

## A. Folder yang diminta dicek: "CP Kelompok A 127-20261011T154435Z-1-001_BARU"

Lokasi lengkap:
`Micropage E-Sparepart - app - deployed\CP Kelompok A 127\CP Kelompok A 127-20261011T154435Z-1-001_BARU\CP Kelompok A 127\`

Struktur yang terverifikasi:

```
CP Kelompok A 127/
├── Bahan Capstone Project/
│   ├── BAB 3 Tugas CP.docx            ← draf Bab 3 (garapan @giren)
│   ├── Draft Bab 3 CP 127 A.docx
│   ├── Draft Capstone Project Mochammad Fadhilah Hakim.docx
│   ├── Proposal Capstone Project Kelompok A.docx (+ "BAB 1 & 2" + Revisi)
│   ├── PROPOSAL CAPSTONE PROJECT.docx
│   ├── Proposal Penelitian Metodologi ... Hakim.docx
│   ├── Aps Script CP.docx
│   ├── jurnal/artikel PDF (… 20 file)
│   └── Raw Data CP/  (All Item Code, BQ On Going, BQ Summary, Critical Part,
│                      Database Approval SPV/MGR, Form BQ Testing tiap teknisi,
│                      On Hand, PR Summary …)
├── Poster, PPT dan Video_/
│   ├── Foto Anggota/                 ← ISI: IMG-20260322-WA0016.jpg + IMG_0041~photo.HEIC
│   ├── Poster/   (kosong)
│   ├── PPT/      (kosong)
│   └── Video/    (kosong)
├── Referensi Capstone Project/  (PDF laporan, poster jpg, pptx, rekaman/bukti)
├── Berita Acara Kerja Kelompok.docx
├── CHECKLIST DAN TO DO LIST TUGAS CP.docx
└── Data Lapangan.docx
```

### Relevansi dengan 2 pesan yang men-tag @Avwan

1. **Poin D1/DFD (18:57)** → tidak terkait folder; jawaban bersumber dari **cek kode aplikasi** (file `02_Verifikasi_Kode_FormBQ_tidak_ada_stok.md`).
2. **Poin foto (19:04)** → folder tujuan foto adalah `Poster, PPT dan Video_\Foto Anggota`. Saat dicek: sudah ada **2 file** (`IMG-20260322-WA0016.jpg`, `IMG_0041~photo.HEIC`), kemungkinan baru foto Kak Fadhil. **Foto anggota lain (Avwan, Giren, Sarifah, Wida) belum ada.** Sub-folder Poster/PPT/Video masih kosong.

---

## B. Isi seluruh folder kerja saat ini (`Micropage E-Sparepart - app - deployed`)

- **Aplikasi (esensial):** `server.js`, `src/`, `public/`, `database/`, `package.json` (+lock), `.env`, `.env.example`, `vercel.json`, `run-qa-test.js`.
- **Asset CP / laporan:** `CP Kelompok A 127/` (termasuk folder BARU 11/10), `Salinan_Spreadsheet_Sparepart/`, `README_SUBMISSION.md`, `README.md`, `CHECKLIST…docx`, draft Bab 3 (`Draft_Teknis_Bab3_Avwan.md`, `Catatan_Review_Bab3_Avwan.*`), laporan QA (`LAPORAN_QA_TAHAP_1/2.md`, `GUIDE_TEST_MANUAL_QA.md`), `KONFIRMASI_MANUAL_5_ITEM.md`, `Data_SPV_tidak_ada_di_DB_pengajuan.txt`, `analysis-report.txt`, `rekam-tour-qa-114tes.srt`.
- **Pengujian/rekaman:** `docs/` (arsitektur, keputusan, evidence video+clips), `tests/`, `scripts/`.

> Folder jawaban lama `Bantuan_Jawaban_Kak_Fadhil_20261011/` berisi 4 file (balasan lengkap 9 poin verifikasi aplikasi, draf revisi Bab 3, ringkasan folder). Folder **baru ini** (`Jawaban_Avwan_Untuk_Kak_Fadhil_20261011/`) berisi **versi update yang hanya menjawab 2 pesan yang men-tag @Avwan**.

---

## C. Daftar file dalam folder jawaban baru ini

| File | Isi |
|---|---|
| `01_Draft_Balasan_WhatsApp_Avwan_only_tag.md` | Draft balasan WhatsApp (2 poin: D1/DFD + foto) + tabel penjelasan mengapa poin lain tidak dijawab |
| `02_Verifikasi_Kode_FormBQ_tidak_ada_stok.md` | Bukti dari kode `index.html` bahwa Form BQ tidak menampilkan stok (D1 tidak connect ke 2.0) |
| `03_Ringkasan_Pengecekan_Folder.md` | File ini — hasil cek folder `…-BARU` + isi direktori kerja |