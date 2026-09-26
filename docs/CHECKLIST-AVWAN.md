# CHECKLIST TUGAS AVWAN (Anggota 1 — Lead Developer / Architect)

> Sumber tugas: `CP Kelompok A 127/CHECKLIST DAN TO DO LIST TUGAS CP.docx` (Rencana Kerja Mingguan Kelompok A 127).
> Status per **26 September 2026**. Semua tanda ✅ memiliki bukti fisik di repo ini.

## Status 8 item checklist mingguan

| Minggu | Item checklist (teks asli) | Status | Bukti |
|---|---|---|---|
| M1–M2 | Memahami rencana pengembangan ulang website hosting sendiri, struktur data, dan fitur sistem | ✅ | Chat 17–24 Sep (5 pertanyaan ke Fadhil terjawab), raw data & Flow Data dipelajari (`CP Kelompok A 127/.../Raw Data CP/`), arsitektur terimplementasi |
| M3 (Tugas 1) | Finalisasi arsitektur website hosting mandiri & sediakan mock-up/wireframe awal | ✅ | `docs/M3-ARSITEKTUR-DAN-WIREFRAME.md` + galeri 38 layar `docs/evidence/hasil-produk/galeri-mockup.html`; app live di Vercel |
| M4 | Pengujian & pengembangan produk website | ✅ | `LAPORAN_QA_TAHAP_1.md`, `LAPORAN_QA_TAHAP_2.md`, `GUIDE(S)_TEST_MANUAL_QA.md`, `tests/` + 16 screenshot UAT |
| M5 (Tugas 2) | Sediakan foto/data hasil produk website | ✅ | `docs/M5-HASIL-PRODUK.md` + `docs/evidence/hasil-produk/` (38 PNG, guide dimatikan) + `docs/evidence/data/` (CSV, JSON, ringkasan Bab IV) |
| M6 | Rekam screen record demo aplikasi website | ✅ | `docs/evidence/video/demo-aplikasi.mp4` (1 mnt 57 dtk, H.264, siap YouTube) + `catatan-video.md` |
| M7 (Tugas 3) | Latihan presentasi demo produk website | 🟡 80% | Skrip & panduan demo lengkap: `docs/M7-SKRIP-DEMO-PRESENTASI.md`; **tinggal latihan membawakan** (rubrik latihan di Bagian D dokumen tsb.) |
| M8 | Evaluasi produk website di Sesi 8 | 🟡 siap | Laporan evaluasi mandiri: `docs/M8-EVALUASI-PRODUK.md`; **tinggal hadir & presentasi di sesi** |
| — | (Bukan checklist, tapi kebiasaan) centang item mingguan di Google Drive | ⚠️ | Salinan docx **sudah terisi**: `CP Kelompok A 127/CHECKLIST DAN TO DO LIST TUGAS CP - update Avwan 26 Sep.docx` — unggah/salin centangannya ke versi Drive |

## Yang masih harus dikerjakan manual (tidak bisa oleh AI)

1. **Unggah centangan ke Google Drive** — buka file "update Avwan 26 Sep.docx" di atas, lalu centang 5 item Avwan (M1–M2 s/d M6) pada docx di Drive, atau unggah file tersebut sebagai versi terbaru. (Permintaan Fadhil, 22 Sep.)
2. **Latihan presentasi** — ikuti Bagian D `M7-SKRIP-DEMO-PRESENTASI.md` minimal 3 kali sebelum Sesi 8.
3. **Sampaikan bahan ke rekan** (WA grup):
   - Giren → `docs/M3-ARSITEKTUR-DAN-WIREFRAME.md` §7 (pemetaan Bab III: DFD, use case, ERD).
   - Fadhil → `docs/evidence/data/ringkasan-bab-iv.md` + CSV untuk Bab IV.
   - Wida → `docs/evidence/video/demo-aplikasi.mp4` + `galeri-mockup.html` untuk PPT/poster/YouTube.
4. **Sesi 8** — bawa `docs/M8-EVALUASI-PRODUK.md` sebagai bahan evaluasi; pastikan link YouTube (Wida) sudah aktif.

## Perintah regenerasi bukti (bila data berubah)

```bash
npm start                                # server di :3000
node scripts/otomatis_export_data.js     # data + ringkasan Bab IV
node scripts/otomatis_hasil_produk.js    # 38 tangkapan layar
node scripts/otomatis_rekam_demo.js      # rekam ulang video demo
```
