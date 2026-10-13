# Draf Masukan Teknis Revisi Bab 3 (lingkup Avwan)

Kumpulan teks masukan/verifikasi teknis dari sisi **Avwan (Lead Developer)** yang menjawab poin-poin Kak Fadhil (pesan 11/10/2026 18:57–19:04). Semua sudah diselaraskan dengan **implementasi aktual aplikasi** (lihat `02_Hasil_Verifikasi_Aplikasi.md`).

> **Catatan pembagian tugas:** penyusunan & formatting final Bab 3 adalah tugas `@giren`. Dokumen ini hanyalah **bahan masukan teknis dari Avwan** (proses perancangan & implementasi + pengujian/evaluasi berdasarkan web — sesuai pembagian peran: Lead Developer/Arsitektur). Silakan @giren menyesuaikan kalimat ke gaya dokumen Bab 3.

---

## 1. Revisi 3.4.3 Studi Dokumentasi (hapus "Suggestion System")

> **3.4.3 Studi Dokumentasi dan Analisis Historis**
>
> Studi dokumentasi dilakukan terhadap dokumen dan data historis berikut:
> 1. Log EJO historis periode Januari 2025 sampai April 2026, termasuk rekapan akumulasi downtime Mesin Cartoning Marchesini sebesar 305 menit.
> 2. Dokumen Purchase Request (PR) dan Purchase Order (PO).
> 3. Laporan On Hand Stock Min-Max untuk suku cadang kritis, dalam format sebelum dan sesudah revisi.
> 4. Laporan persentase permintaan PO Urgent tahun 2025 dan kuartal pertama 2026.
> 5. Log sistem manual tahun 2023–2024 sebagai kondisi sebelum dan log Master Dashboard tahun 2025 sebagai kondisi sesudah.

---

## 2. Revisi Analisis Why-Why (Why 3 & Why 4)

> Akar masalah utama yang diangkat adalah **tingginya downtime mesin** yang disebabkan oleh ketidaktersediaan suku cadang pada saat dibutuhkan. Analisis Why-Why menghasilkan dua akar masalah yang saling terkait:

| Pertanyaan | Jawaban |
| --- | --- |
| **Why 1:** Mengapa perbaikan mesin tertunda? | Suku cadang yang dibutuhkan tidak tersedia saat dilakukan closing EJO. |
| **Why 2:** Mengapa suku cadang tidak tersedia? | Tidak ada kepastian ketersediaan stok; on-hand stock dan parameter min-max tidak dipantau secara terpusat. |
| **Why 3:** Mengapa stok kritis tidak dijaga? | Belum ada daftar Critical Sparepart yang terintegrasi dengan pemantauan stok On-Hand terhadap Min-Max; pada format laporan lama juga belum ada kolom hasil review dari Sparepart Technician dan Supervisor Engineering. |
| **Why 4:** Mengapa pengadaan sulit dipantau dan terlambat? | Kebutuhan suku cadang kritis belum direview — belum ada keputusan part mana yang wajib dijaga stoknya — sehingga barang yang seharusnya di-stock baru diproses setelah mesin bermasalah. Alur pengajuan lama juga manual (email/Excel terpisah tanpa verifikasi, spesifikasi sering tidak lengkap, status tidak termonitor). |

> Berdasarkan analisis tersebut, solusi sistem dibangun dalam **dua modul utama**:
> 1. **Modul Pengajuan Barang Digital + Approval Multi-Tier** — menjawab Why 4 (alur pengajuan cepat, terverifikasi, dan termonitor).
> 2. **Modul Critical Sparepart List terintegrasi On-Hand & Min-Max** — menjawab Why 1–3 (suku cadang kritis otomatis dijaga stoknya, teknisi tidak perlu menunggu breakdown dan tidak perlu mengajukan ulang karena part tersebut memang wajib di-stock).

---

## 3. Revisi Sub Bab "Permintaan PO Urgent" (lebih ringkas, hanya kategori engineering)

> Permintaan PO Urgent menjadi salah satu indikator keberhasilan sistem karena berbanding lurus dengan kesiapan stok suku cadang. Data yang dianalisis dibatasi pada kategori yang dikelola Departemen Engineering, yaitu **Urgent Sparepart Utility**. Pada tahun 2025, persentase permintaan PO Urgent kategori tersebut tercatat **8,17%** dari total PO, kemudian menurun menjadi **0,6%** pada kuartal pertama 2026 setelah sistem pengajuan digital dan daftar critical sparepart terintegrasi diterapkan. Angka tersebut berada jauh di bawah target <10%.

**Tabel 3.5.** Persentase PO Urgent Berdasarkan Kategori

| Kategori | YTD 2025 | YTD Q1 2026 | Terhadap Target <10% (Q1 2026) |
| --- | --- | --- | --- |
| Urgent Sparepart Utility (Dept. Engineering) | 8,17% | 0,6% | Di bawah target |

> Catatan metodologis: kategori lain (Labware, ATK, Produksi) bukan merupakan tanggung jawab Departemen Engineering sehingga tidak dimasukkan. Untuk memperkuat, dapat ditambahkan satu paragraf dukungan berupa perbandingan komposisi status pengajuan sebelum/sesudah (dapat ditarik dari menu Monthly Report / ekspor Excel di aplikasi).

---

## 4. DFD Level 0 (disesuaikan role; D1 tidak terhubung ke 2.0)

> **Diagram Alir Data Level 0 — Micropage Sparepart System**
>
> **Entitas eksternal:** Administrator (Sparepart Technician / Dev), Teknisi (Lini Steril), Supervisor 1, Supervisor 2 / Officer, Manager, Tim Purchasing.
>
> **Proses:**
> - **1.0 Kelola Master Stok & Critical Part** — dioperasikan Administrator; memutakhirkan data sparepart, parameter min-max, dan status critical.
> - **2.0 Pengajuan Form BQ** — dioperasikan Teknisi; menghasilkan data pengajuan & nomor registrasi. *(Tidak membaca D1 pada implementasi saat ini.)*
> - **3.0 Verifikasi & Approval Multi-Tier** — Supervisor 1/2/Officer menyetujui tahap SPV dan menetapkan Normal/Urgent; Manager menyetujui tahap akhir khusus Urgent.
> - **4.0 Monitoring & Reporting** — pembacaan Rekapan Pengajuan, PR Summary, Monthly Report, Critical Part, On-Hand Stock sesuai hak akses role.
>
> **Data store:**
> - **D1 Master Stok & Critical Part** — ditulis oleh 1.0; dibaca oleh 4.0 (stok/critical) dan langsung oleh pengguna melalui tampilan On-Hand Stock. **Tidak terhadap 2.0.**
> - **D2 Pengajuan & Detail Barang** — ditulis oleh 2.0; dibaca/diubah oleh 3.0 dan 4.0.
> - **D3 Log Approval (pengajuan_log)** — ditulis oleh 3.0; dibaca oleh 4.0 (riwayat/audit trail).
>
> Aliran utama: Teknisi → 2.0 (isi form) → D2; D2 → 3.0 → (jika Urgent) Manager → D3; D2/D3 → 4.0 untuk Rekapan, PR Summary, Monthly Report; Administrator → 1.0 (master data); Administrator → D2 (eksekusi/meneruskan pengadaan ke Purchasing); Purchasing ↔ D2 (status pengadaan).

---

## 5. Use Case Diagram (disesuaikan role)

> Sistem: **Micropage Sparepart System**. Aktor dan use case-nya sebagai berikut.

**Tabel Use Case — Aktor vs Use Case**

| Aktor | Use Case |
| --- | --- |
| Teknisi (Lini Steril) | UC1 Mengisi Form BQ Digital; UC2 Memantau On-Hand Stock & Lokator Rak; UC3 Memantau BQ Summary Personal dan status pengajuannya (login: masukkan username & password). |
| Supervisor 2 / Officer | UC4 Melakukan Approval BQ Tahap Supervisor (termasuk menetapkan Normal/Urgent, include UC8 validasi); UC5 Mengakses Database Critical Sparepart; memantau stok On-Hand. |
| Supervisor 1 | UC4 (sama); UC6 Memantau PR Summary; UC7 Memantau Monthly Report Dashboard; UC5; memantau stok On-Hand. |
| Manager | UC8 Melakukan Approval BQ Urgent (final); UC7 Memantau Monthly Report; menyetujui pendaftaran akun baru dan menugaskan tim. |
| Administrator (Sparepart Technician / Dev) | UC9 Mengelola Master Data Stok & Parameter Min-Max; UC10 Meneruskan BQ Full-Approved ke Purchasing dan mengeksekusi proses pengadaan. |
| Tim Purchasing (eksternal) | Proses Pengadaan Barang/Jasa (PR, Penawaran, PO, Pembelian) — menerima data dari Administrator (include UC10). |

> Keterangan relasi: UC8 (persetujuan akhir Urgent oleh Manager) hanya dapat dieksekusi setelah persetujuan Supervisor (UC4) — dibuktikan di aplikasi dengan tombol Manager yang disable sebelum SPV menyetujui.

---

## 6. Tabel RBAC & Tahapan Persetujuan (penyesuaian konsisten)

**Tabel 3.8. Hak Akses Berdasarkan Peran (RBAC) — usulan final**

| Peran | Hak Akses Utama |
| --- | --- |
| Teknisi | Mengajukan Form BQ dan memantau pengajuannya sendiri; mencari ketersediaan stok dan lokator rak; melihat rekapan pengajuan. |
| Supervisor 2 / Officer | Melakukan persetujuan tahap 1 (`status_approval_spv`) dan menentukan Normal/Urgent; memantau stok dan Database Critical Sparepart. |
| Supervisor 1 | Hak Supervisor 2/Officer ditambah memantau PR Summary dan Monthly Report. |
| Manager | Melakukan persetujuan tahap 2 (`status_approval_manager`) khusus Urgent; memantau Monthly Report; menyetujui akun user baru. |
| Administrator | Mengelola master data stok, parameter Min-Max, mengeksekusi status pengadaan, dan meneruskan pengajuan *Full Approved* ke Purchasing. |

**Tabel 3.9. Tahapan Persetujuan dan Pengendalian Status — usulan final**

| Tahap | Pelaku | Field yang Dikendalikan | Catatan |
| --- | --- | --- | --- |
| 1. Verifikasi Supervisor | Supervisor 1 / Supervisor 2 / Officer | `status_approval_spv` (+ Normal/Urgent) | Harus disetujui lebih dahulu sebelum Manager dapat bertindak. |
| 2. Verifikasi Manager | Manager | `status_approval_manager` | Ditolak otomatis bila Supervisor belum menyetujui. |
| 3. Proses Pengadaan | Administrator (melalui akun Officer) | `status_pengadaan` | BQ Baru → Pending → Proses PO → PO Open → Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai. |
| Jejak audit | Sistem | `pengajuan_log` | Setiap perubahan status tercatat otomatis (pelaku dan waktu). |

> **Catatan konsistensi (titik keputusan, lihat `01_Draft_Balasan_Kak_Fadhil.md` poin 8):**
> Saat ini di aplikasi, role **Officer (dan Manager)** dapat mengubah `status_pengadaan`. Jika laporan ingin menegaskan "proses pengadaan dilakukan Administrator", gunakan rumusan di atas ("melalui akun Officer") — atau opsi pengembangan lanjutan: tambahkan role **Administrator** login khusus (menu kelola master data + eksekusi pengadaan) dan role Officer disetarakan penuh dengan Supervisor 2.