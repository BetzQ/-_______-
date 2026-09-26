# M8 — Evaluasi Produk & Kesiapan Sesi 8

> **Peran:** Anggota 1 — Lead Developer (Avwan)
> **Checklist M8:** *"Evaluasi produk website di Sesi 8."*
> Dokumen ini adalah **laporan evaluasi mandiri** yang dapat langsung dibawa/ dirujuk saat sesi evaluasi
> bersama dosen pembimbing, plus daftar tindak lanjut bila ada temuan.

---

## 1. Ringkasan Evaluasi Produk

| Dimensi | Temuan | Status |
|---|---|---|
| Fungsional | Semua fitur inti berjalan: login & RBAC, Form BQ digital (sparepart & jasa), approval 2 tahap, status pengadaan, BQ/PR Summary, On Hand Stock, Critical Part, Monthly Report, audit trail, ekspor Excel | ✅ |
| Alur end-to-end | 1 pengajuan nyata dibuktikan menempuh seluruh tahapan (BQ-20260926-2814: Teknisi → SPV disetujui → Manager disetujui) | ✅ |
| Keamanan | Password scrypt + upgrade otomatis, rate limit login, SQL berparameter, proteksi PR Summary (403) | ✅ |
| Data riil | 3.022 item master, 1.503 transaksi, 210 critical part, 356 alert stok — diambil dari data departemen | ✅ |
| Aksesibilitas | Ter-deploy publik (Vercel + Supabase); tanpa instalasi untuk penguji; jalur lokal XAMPP tersedia | ✅ |
| Performa | Rata-rata <2 dtk untuk tabel besar (1.500 baris, paginasi 25 baris); refresh otomatis 20 dtk | ✅ |
| Dokumentasi | README, README_SUBMISSION, dokumen M3/M5/M6/M7, QA 2 tahap, UAT visual | ✅ |

**Kesimpulan evaluasi:** produk **siap dinilai** pada Sesi 8. Tidak ada temuan pemblokir.

## 2. Perbandingan Sebelum–Sesudah (untuk laporan dampak)

| Aspek | Sebelum (manual/ Apps Script) | Sesudah (produk) |
|---|---|---|
| Kelengkapan pengajuan | sering tidak komplit | field wajib divalidasi sistem |
| Monitoring | email/ pesan singkat | dashboard real-time, refresh 20 dtk |
| Persetujuan | manual, tidak terlacak | 2 tahap berjenjang + audit trail |
| Critical part | tidak ada daftar terpusat | 210 item terpusat, alert min-stock |
| Laporan bulanan | rekap manual | otomatis + grafik + ekspor Excel |
| Downtime akibat stok | 305 menit (Cartoning Marchesini) | target turun (preventive replenishment) |

## 3. Batasan & Rencana Perbaikan (bila ditanya)

1. **Notifikasi** — persetujuan masih cek manual; rencana: notifikasi email/ WhatsApp Gateway.
2. **Integrasi Looker Studio** — Monthly Report internal (Chart.js) sudah jalan; tautan Looker lama masih
   dipakai manajemen untuk laporan lain.
3. **Mobile** — responsif dasar sudah ada; aplikasi mobile khusus belum.
4. **Kolom `supervisor_id`** — pemetaan tim sebagian teknisi belum lengkap (lihat `Data_SPV_tidak_ada_di_DB_pengajuan.txt`);
   mempengaruhi filter tim di PR Summary.

## 4. Uji Penerimaan (ringkas)

| Skenario UAT | Hasil |
|---|---|
| Login 5 peran + tampilan menu RBAC | Lulus (5/5) |
| Proteksi menu PR Summary | Lulus (3 ditolak 403, 2 diizinkan) |
| Pembuatan pengajuan sparepart | Lulus (status 201) |
| Approval SPV → Manager (end-to-end) | Lulus |
| Riwayat/ audit trail | Lulus |
| Ekspor Excel | Lulus |
| QA Tahap 1 & 2 (lihat `LAPORAN_QA_TAHAP_1.md`, `LAPORAN_QA_TAHAP_2.md`) | Lulus |
| UAT visual (16 tangkapan layar skenario lama) | Lulus |

## 5. Tindak lanjut pasca-Sesi 8 (dari arsip evaluasi)

- [ ] Verifikasi link YouTube demo tetap aktif (dikerjakan Wida).
- [ ] Arsip dokumen final ke Google Drive tim (dikerjakan Fadhil/ Sarifah).
- [ ] Cabut akses read sementara penguji ke repo bila sebelumnya diberikan (Avwan).
- [ ] (Opsional) Migrasi data demo/ bersihkan transaksi uji sebelum serah terima ke PT Fonko.

---

*Dokumen evaluasi disusun berbasis hasil uji otomatis 26 September 2026 — seluruh klaim terdapat bukti pendukung di `docs/evidence/`.*
