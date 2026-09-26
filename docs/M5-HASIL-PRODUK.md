# M5 — Foto & Data Hasil Produk Website (Paket Bukti Lengkap)

> **Peran:** Anggota 1 — Lead Developer (Avwan)
> **Checklist M5:** *"Sediakan foto/data hasil produk website."* — **Status: SELESAI**
> Tujuan paket ini: bahan siap pakai bagi Fadhil (Bab IV: Hasil & Analisis Dampak) dan Wida (PPT/poster/video).

---

## Lokasi paket bukti

| Berkas | Isi | Untuk |
|---|---|---|
| `docs/evidence/hasil-produk/galeri-mockup.html` | Galeri interaktif 38 tangkapan layar seluruh menu × 5 peran | PPT, poster, Bab IV, penguji |
| `docs/evidence/hasil-produk/*.png` | 40 PNG resolusi 1440×900 | sisipan laporan |
| `docs/evidence/hasil-produk/06-alur-*.png` | 9 tangkapan layar alur end-to-end (1 pengajuan nyata dari cek stok → approval → laporan) | bukti sistem berjalan |

> Catatan kualitas (26 Sep 2026): seluruh tangkapan layar & video **diproduksi ulang dengan
> panduan (tour) dimatikan** — bukti sebelumnya tertutup overlay guide saat login pertama per peran.
> Skrip kini otomatis menutup guide (`tour_done_*`) dan aplikasi mendukung link demo `?tour=off`.
| `docs/evidence/data/ringkasan-bab-iv.md` | Statistik terstruktur siap tempel ke Bab IV (tabel & angka) | Fadhil |
| `docs/evidence/data/hasil-produk-stats.json` | Statistik mentah machine-readable | Fadhil / Giren |
| `docs/evidence/data/master-sparepart.csv` | 3.022 item sparepart + stok + status kritis | lampiran |
| `docs/evidence/data/komposisi-status-pengajuan.csv` | komposisi status untuk grafik | Bab IV |
| `docs/evidence/data/stok-di-bawah-minimum.csv` | 356 item di bawah min-stock (defisit) | Bab IV dampak preventif |
| `docs/evidence/video/demo-aplikasi.mp4` | video demo 1 menit 57 detik (H.264) | Wida / YouTube M7 |

---

## Ringkasan angka kunci (per 26 Sep 2026)

### Data master yang berhasil diintegrasikan
- **3.022** item sparepart terdaftar (On Hand Stock, termasuk lokator rak)
- **11.932** unit stok tersedia total
- **210** item Critical Part (6,95%) — Critical Sparepart List terpusat
- **213** item di bawah min-stock → terdeteksi otomatis sebagai peringatan preventif
- **1.887** item stok kosong → visibilitas penuh real-time

### Kinerja digitalisasi alur pengajuan (1.503 pengajuan)
| Tahap | Hasil |
|---|---|
| Disetujui SPV | 1.115 (74,18%) |
| Ditolak SPV | 265 (17,63%) |
| Menunggu SPV | 123 (8,18%) |
| Urgent disetujui Manager | 24 |
| Status pengadaan terlacak | BQ Baru 462 · Barang Dikirim 765 · Proses PO 98 · Pending 130 · Tiba di Gudang 24 · Selesai 24 |
| Kategori urgensi | Normal 1.210 · Urgent 293 |

### Bukti alur end-to-end (transaksi demo terdokumentasi)
Pengajuan `BQ-20260926-2814` (EJO-DEMO-402106, item kritis `P-50717-00`, kategori **Urgent**):
dibuat Teknisi `AAA` → **Disetujui SPV** (`INN`) → **Disetujui Manager** (`KSW`) → status pengadaan
`BQ Baru` → tercatat di riwayat approval & Monthly Report. Seluruh tahap ada tangkapan layarnya
(berkas `06-alur-*.png`). Video demo membuktikan transaksi kedua `BQ-20260926-8026` dengan alur
yang sama.

### Uji akses per peran (RBAC)
| Username | Peran | Login | PR Summary |
|---|---|---|---|
| AAA | Teknisi | ✔ | ditolak (403) — sesuai rancangan |
| INN | Supervisor 1 | ✔ | diizinkan |
| KAA | Supervisor 2 | ✔ | ditolak (403) — sesuai rancangan |
| ANS | Officer | ✔ | ditolak (403) — sesuai rancangan |
| KSW | Manager | ✔ | diizinkan |

---

## Cara pakai

- **Fadhil (Bab IV):** salin tabel dari `data/ringkasan-bab-iv.md`; sisipkan PNG dari `hasil-produk/`
  (penamaan sudah `peran-menu.png`); angka agregat & CSV siap jadi lampiran/grafik.
- **Wida (PPT/poster/video):** buka `galeri-mockup.html` di browser untuk memilih visual terbaik;
  gunakan `video/demo-aplikasi.mp4` sebagai bahan rekaman YouTube M7.
- **Penguji:** buka demo live `https://e-sparepart-system-tau.vercel.app` dengan akun di
  `README_SUBMISSION.md`, lalu cocokkan dengan bukti di paket ini.

## Regenerasi (bila data bertambah)

```bash
npm start                                   # pastikan server jalan di :3000
node scripts/otomatis_export_data.js        # refresh data & ringkasan Bab IV
node scripts/otomatis_hasil_produk.js       # refresh 38 tangkapan layar
node scripts/otomatis_rekam_demo.js         # rekam ulang video demo
```

*Diproduksi otomatis dari aplikasi yang berjalan — tidak ada angka yang diketik manual.*
