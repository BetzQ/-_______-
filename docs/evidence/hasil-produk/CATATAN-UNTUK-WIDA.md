# Catatan untuk Ka Wida (Visual & Media) — Kumpulan Tangkapan Layar Aplikasi

Halo ka Wida, ini semua tangkapan layar aplikasi **Micropage E-Sparepart** yang udah jadi dan udah online.
Semua gambar diambil otomatis dari aplikasi yang benar-benar berjalan (bukan desain konsep), jadi bisa langsung dipakai
untuk PPT, poster A4, dan video YouTube Tugas 3.

---

## Cara paling gampang (tanpa bingung nama file)

**Buka aja file `galeri-mockup.html`** — klik dua kali, nanti kebuka di browser.
Di situ semua gambar sudah ditata rapi per bagian (masuk aplikasi → dashboard tiap peran → tiap menu → alur cerita),
jadi ka Wida tinggal lihat-lihat dan pilih yang paling cocok.

---

## Kalau mau buka file gambarnya langsung: arti nama filenya

Pola namanya sederhana: **`nomor-peran-menu.png`**

- **Nomor depan** = siapa yang sedang memakai aplikasi

| Nomor | Arti | Akun yang dipakai |
|---|---|---|
| `00` | Belum masuk aplikasi (halaman login) | — |
| `01` | **Teknisi** (yang mengajukan barang) | AAA |
| `02` | **Supervisor 1** | INN |
| `03` | **Supervisor 2** | KAA |
| `04` | **Officer Penagihan** (urusi pembelian) | ANS |
| `05` | **Manager** (pimpinan, persetujuan terakhir) | KSW |
| `06` | **Alur cerita** 1 pengajuan dari awal sampai selesai (campur semua peran) | — |

- **Kata bagian belakang** = menu yang sedang dibuka

| Nama menu | Artinya (bahasa sederhana) |
|---|---|
| `dashboard` | Beranda / tampilan utama setelah masuk aplikasi |
| `stok` | Daftar suku cadang yang ada di gudang + jumlahnya (On Hand Stock) |
| `bq` | Formulir pengajuan barang (Form BQ) |
| `bqsummary` | Ringkasan semua pengajuan + statusnya sekarang |
| `prsummary` | Daftar pengajuan yang menunggu persetujuan Supervisor |
| `monitoring` | Menu persetujuan (approve/tolak pengajuan dari teknisi) |
| `critical` | Daftar suku cadang kritis yang wajib selalu ada (Critical Part List) |
| `report` | Laporan bulanan dalam bentuk grafik (Monthly Report) |
| `riwayat` | Jejak persetujuan / catatan siapa menyetujui apa dan kapan |

---

## Daftar lengkap file → isinya

### Sebelum masuk aplikasi
| File | Isi gambar |
|---|---|
| `00-login.png` | Halaman masuk, kolomnya masih kosong |
| `00-login-terisi.png` | Halaman masuk dengan username & password terisi |

### Teknisi (`01-teknisi-*.png`)
| File | Isi gambar |
|---|---|
| `01-teknisi-dashboard.png` | Beranda Teknisi — menu yang boleh diakses teknisi |
| `01-teknisi-stok.png` | Teknisi mengecek stok di gudang sebelum mengajukan |
| `01-teknisi-bq.png` | Formulir pengajuan barang (yang wajib diisi lengkap) |
| `01-teknisi-bqsummary.png` | Teknisi memantau status pengajuannya sendiri |

### Supervisor 1 (`02-spv1-*.png`) — akses paling lengkap setelah Manager
| File | Isi gambar |
|---|---|
| `02-spv1-dashboard.png` | Beranda Supervisor 1 |
| `02-spv1-stok.png` | Daftar stok gudang |
| `02-spv1-prsummary.png` | Pengajuan yang menunggu persetujuan (PR Summary) |
| `02-spv1-monitoring.png` | Menu persetujuan pengajuan dari teknisi |
| `02-spv1-critical.png` | Daftar suku cadang kritis |
| `02-spv1-report.png` | Grafik laporan bulanan |
| `02-spv1-bqsummary.png` | Ringkasan semua pengajuan |

### Supervisor 2 (`03-spv2-*.png`)
| File | Isi gambar |
|---|---|
| `03-spv2-dashboard.png` | Beranda Supervisor 2 |
| `03-spv2-stok.png` | Daftar stok gudang |
| `03-spv2-monitoring.png` | Menu persetujuan pengajuan |
| `03-spv2-critical.png` | Daftar suku cadang kritis |
| `03-spv2-bqsummary.png` | Ringkasan semua pengajuan |

### Officer Penagihan (`04-officer-*.png`)
| File | Isi gambar |
|---|---|
| `04-officer-dashboard.png` | Beranda Officer |
| `04-officer-stok.png` | Daftar stok gudang |
| `04-officer-monitoring.png` | Memantau perjalanan pengajuan |
| `04-officer-critical.png` | Daftar suku cadang kritis |
| `04-officer-bqsummary.png` | Ringkasan semua pengajuan |

### Manager (`05-manager-*.png`)
| File | Isi gambar |
|---|---|
| `05-manager-dashboard.png` | Beranda Manager |
| `05-manager-stok.png` | Daftar stok gudang |
| `05-manager-monitoring.png` | Persetujuan terakhir untuk pengajuan mendesak (Urgent) |
| `05-manager-critical.png` | Daftar suku cadang kritis |
| `05-manager-report.png` | Grafik laporan bulanan |
| `05-manager-bqsummary.png` | Ringkasan semua pengajuan |

### Alur cerita 1 pengajuan nyata (`06-alur-*.png`) — paling cocok buat slide "cara kerja sistem"
Nomor transaksinya: **BQ-20260926-2814** (mesin Cartoning Marchesini 305, kategori Urgent).

| Urutan | File | Ceritanya |
|---|---|---|
| 1 | `06-alur-cek-stok.png` | Teknisi cek stok dulu |
| 2 | `06-alur-form-bq-terisi.png` | Barangnya kosong → teknisi isi formulir pengajuan lengkap |
| 3 | `06-alur-bqsummary-teknisi.png` | Pengajuan langsung muncul dengan status "menunggu persetujuan" |
| 4 | `06-alur-approval-spv-sebelum.png` | Tampilan Supervisor sebelum menyetujui |
| 5 | `06-alur-approval-spv-sesudah.png` | Setelah Supervisor menyetujui |
| 6 | `06-alur-approval-manager-sebelum.png` | Tampilan Manager sebelum menyetujui |
| 7 | `06-alur-approval-manager-sesudah.png` | Setelah Manager menyetujui (untuk Urgent) |
| 8 | `06-alur-riwayat-approval.png` | Jejak persetujuan: siapa menyetujui, kapan |
| 9 | `06-alur-monthly-report.png` | Pengajuan tercatat otomatis di grafik laporan bulanan |

---

## Rekomendasi pilihan cepat

- **Slide "tampilan aplikasi"**: `01-teknisi-dashboard.png` atau `05-manager-dashboard.png`
- **Slide "alur kerja"**: pakai urutan `06-alur-*` no. 1 → 9
- **Slide "dampak/keunggulan"**: `02-spv1-critical.png` (pencegahan kerusakan mesin) + `06-alur-monthly-report.png` (laporan otomatis)
- **Poster A4**: login (`00-login.png`), dashboard Teknisi, dashboard Manager, dan Critical Part List

## Catatan penting

- Semua tangkapan layar diambil **bersih tanpa panduan/guide**, jadi isinya aplikasi asli saja.
- Versi video demo (1 menit 57 detik, siap YouTube) ada di folder sebelah: `../video/demo-aplikasi.mp4`.
- Butuh tangkapan layar lain (misalnya di HP/ukuran lain)? Bilang saja, bisa dibuat ulang otomatis.

---

_Dihimpun 26 September 2026 oleh Avwan (Lead Developer) untuk kebutuhan visual Wida._
