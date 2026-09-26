# Data Hasil Produk — Micropage E-Sparepart

> Sumber: hasil ekspor langsung dari aplikasi yang berjalan (`http://localhost:3000`)
> Dihasilkan otomatis: `26/9/2026, 19.44.35`
> Dipakai untuk: **Bab IV (Hasil dan Analisis Dampak)** — diminta Fadhil kepada Lead Developer.

## A. Cakupan Data Master yang Berhasil Diintegrasikan

| Indikator | Nilai | Keterangan |
|---|---:|---|
| Jumlah item sparepart terdaftar | 3.022 | Database #1 — master sparepart & On Hand Stock |
| Total unit tersedia di gudang (on-hand) | 11.932 | Akumulasi qty_on_hand seluruh item |
| Item kategori Critical Part | 210 (6.95%) | Database #2 — Critical Sparepart List |
| Item di bawah min-stock (butuh reorder) | 213 | Pemicu preventif tanpa menunggu breakdown |
| Item dengan stok kosong | 1.887 | Visibilitas ketersediaan secara real-time |

## B. Kinerja Digitalisasi Alur Pengajuan (Form BQ → Approval)

### B.1 Status Persetujuan Supervisor (tahap 1)

| Approval SPV | Jumlah | Persentase |
|---|---:|---:|
| Disetujui | 1.115 | 74.18% |
| Ditolak | 265 | 17.63% |
| Menunggu | 123 | 8.18% |

### B.2 Status Persetujuan Manager (tahap 2, khusus Urgent)

| Approval Manager | Jumlah | Persentase |
|---|---:|---:|
| Menunggu | 1.465 | 97.47% |
| Disetujui | 24 | 1.60% |
| Ditolak | 14 | 0.93% |

### B.3 Status Pengadaan (alur hingga barang diterima)

| Status pengadaan | Jumlah | Persentase |
|---|---:|---:|
| Barang Dikirim | 765 | 50.90% |
| BQ Baru | 462 | 30.74% |
| Pending | 130 | 8.65% |
| Proses PO | 98 | 6.52% |
| Selesai | 24 | 1.60% |
| Tiba di Gudang | 24 | 1.60% |
| **Total** | **1.503** | **100%** |

### B.4 Kategori Urgensi

| Urgensi | Jumlah |
|---|---:|
| Normal | 1.210 |
| Urgent | 293 |

Agregat alur persetujuan berjenjang (SPV + Manager):

- Keputusan **disetujui**: 1.139
- Keputusan **menunggu**: 1.588
- Keputusan **ditolak**: 279
- Baris BQ Summary terproses: 1.503

## C. Distribusi Pengajuan per Bulan

| Bulan | Jumlah pengajuan |
|---|---:|
| 2025-01 | 63 |
| 2025-02 | 132 |
| 2025-03 | 64 |
| 2025-04 | 66 |
| 2025-05 | 75 |
| 2025-06 | 56 |
| 2025-07 | 70 |
| 2025-08 | 129 |
| 2025-09 | 75 |
| 2025-10 | 70 |
| 2025-11 | 61 |
| 2025-12 | 41 |
| 2026-01 | 100 |
| 2026-02 | 75 |
| 2026-03 | 52 |
| 2026-04 | 71 |
| 2026-05 | 42 |
| 2026-06 | 99 |
| 2026-07 | 51 |
| 2026-08 | 50 |
| 2026-09 | 61 |

## D. Partisipasi Pengaju per Peran

| Peran pengaju | Jumlah pengajuan |
|---|---:|
| teknisi | 1.442 |
| Supervisor 1 | 61 |

## E. Contoh Item yang Terpantau di Bawah Minimum (Preventive Replenishment)

| Item Code | Deskripsi | On Hand | Min | Kekurangan | Rak |
|---|---|---:|---:|---:|---|
| P-50717-00 | General - Kabel UTP 4 Pairs Cat 6; Belden; -; 305m/roll | 0 | 100 | 100 | - |
| P-51559-00 | General - Lampu TL T5 14 W White; Philips; -; 1 unt | 0 | 30 | 30 | - |
| T-80109-00 | Cellotape / Lakban Kertas 1 inch warna Putih ; No Brand ; pack size pe | 0 | 30 | 30 | - |
| O-21720-00 | General - Sleeves CSM 001642 M200/90 Y 550 E4 Bt5/5 Thikness 4/10; Pie | 0 | 24 | 24 | - |
| O-16007-00 | Silicone Sucker 01.10.10; P/N : 201119; ; ; | 0 | 20 | 20 | - |
| O-20950-00 | Capping VCM200 - Silicone Sucker 01.10.10; Steriline; 201119; 1 Pc | 0 | 20 | 20 | - |
| P-14877-00 | General - Kabel NYYHY 3 x 2.5mm; SUPREME; -; 1 meter | 0 | 20 | 20 | - |
| S-11400-00 | Majun AA, No Brand, Budhi Supplies, pack size per kg | 0 | 20 | 20 | - |
| P-53102-00 | Lampu PLC 13watt/E27 Putih; Phillips; ; | 0 | 10 | 10 | - |
| O-15696-00 | SILICONE SUCKER 01.11.16; PART NO :202082 | 0 | 10 | 10 | - |

## F. Uji Akses per Peran (RBAC)

| Username | Peran | Role dari server | Login | Akses PR Summary |
|---|---|---|---|---|
| AAA | Teknisi | teknisi | Berhasil | ditolak (403) - sesuai RBAC |
| INN | Supervisor 1 | Supervisor 1 | Berhasil | ok |
| KAA | Supervisor 2 | Supervisor 2 | Berhasil | ditolak (403) - sesuai RBAC |
| ANS | Officer Penagihan | Officer | Berhasil | ditolak (403) - sesuai RBAC |
| KSW | Manager | manager | Berhasil | ok |

## G. Berkas Lampiran Pendukung

- `hasil-produk-stats.json` — seluruh statistik mentah (machine-readable)
- `master-sparepart.csv` — seluruh item sparepart beserta stok & status kritis
- `komposisi-status-pengajuan.csv` — komposisi status untuk grafik Bab IV
- `stok-di-bawah-minimum.csv` — daftar item yang menyentuh batas minimum
- `../hasil-produk/*.png` — bukti visual setiap menu per peran (lihat `M5-HASIL-PRODUK.md`)
- `../video/` — rekaman demo alur end-to-end
