# Draft Balasan WhatsApp untuk Kak Fadhil
**Tanggal:** 11 Oktober 2026 — merespons pesan Kak Fadhil 18:57 s.d. 19:04
**Lingkup tugas:** **Avwan (Lead Developer)** — menjawab pertanyaan/konfirmasi teknis aplikasi.
**Dibuat oleh:** Avwan (dengan bantuan verifikasi dari kode aplikasi di `public/index.html`, `src/`, dan `database/`)

> Cara pakai: salin balasan per poin di bawah sesuai kebutuhan. Poin yang berisi teks masukan teknis untuk Bab 3 (3.4.3, Why-Why, PO Urgent, DFD, Use Case) bisa dicopas dari file **`03_Draf_Revisi_Bab_3.md`**.
>
> **Catatan pembagian tugas:** penyusunan/formatting final Bab 3 adalah tugas `@giren`; file `03` di sini hanya **masukan/verifikasi teknis dari sisi Avwan** (proses perancangan & implementasi + pengujian/evaluasi berdasarkan web sesuai permintaan Kak Fadhil 03/10).

---

## 1. Role & hak akses (pesan 18:57 "role-rolenyaa" + "officer = Supervisor 2")

**Draf balasan:**
> Gas kak! Ini justru udah sinkron banget sama yang diimplementasi di web. Ringkasan peran yang saya pake di aplikasi:
>
> - **Manager** — approval akhir/persetujuan BQ *Urgent*, user management (approval akun + tugaskan tim), monitoring Monthly Report.
> - **Supervisor 1** — verifikasi BQ tahap Supervisor + tentuin urgen/normal, PR Summary (akses doang, baca-saja), Monthly Report, Critical Part, On Hand Stock.
> - **Supervisor 2 & Officer** — sama aja: verifikasi BQ tahap Supervisor + tentuin urgen/normal, Critical Part, On Hand Stock. **Ga dapat PR Summary & Monthly Report.**
> - **Teknisi** — Form BQ personal, Status Pengajuan Saya (lacak sampai di-approve atasan), On Hand Stock, Layout Rak, Rekapan Pengajuan.
> - **Administrator (Dev / Sparepart Technician)** — kelola master data stok + min-max, terusin pengajuan Full-Approved ke purchasing, eksekusi status pengadaan.
>
> Jadi iya, di aplikasi sekarang menu sudah dibedain persis per role kayak gitu (cek `<public/index.html>` baris 2139 `getMenu()`). PR Summary cuma muncul buat Supervisor 1 dan Manager. Monthly Report cuma buat Supervisor 1 dan Manager.

---

## 2. Hapus poin "log transaksi Suggestion System" di Studi Dokumentasi (3.4.3)

**Draf balasan:**
> Oke kak, poin 5 di 3.4.3 saya ganti jadi tanpa nyebut Suggestion System — langsung "log sistem manual":

**Teks revisi 3.4.3 (draf):**

> **3.4.3 Studi Dokumentasi dan Analisis Historis**
> Studi dokumentasi dilakukan terhadap dokumen dan data historis berikut:
> 1. Log EJO historis periode Januari 2025 sampai April 2026, termasuk rekapan akumulasi downtime Mesin Cartoning Marchesini sebesar 305 menit.
> 2. Dokumen Purchase Request (PR) dan Purchase Order (PO).
> 3. Laporan On Hand Stock Min-Max untuk suku cadang kritis, dalam format sebelum dan sesudah revisi.
> 4. Laporan persentase permintaan PO Urgent tahun 2025 dan kuartal pertama 2026.
> 5. Log sistem manual tahun 2023–2024 sebagai kondisi sebelum dan log Master Dashboard tahun 2025 sebagai kondisi sesudah.

---

## 3. Why-Why (Why 3 & Why 4 kurang nyambung)

**Draf balasan:**
> Setuju kak, betul. Masalah intinya kan emang **downtime mesin** karena sparepart ga tersedia. Kenapa ga tersedia? kejawab di Why 3 (belum ada daftar critical sparepart yang terintegrasi + belum ada review kebutuhan min-max). Nah Why 4 pertanyaannya "kenapa sulit dipantau dan terlambat", jawabannya harusnya nunjuk ke akar yang sama, bukan "pengajuan manual ga termonitor". Saya ubah jadi gini:

**Teks revisi analisis Why-Why (draf):**

| Pertanyaan | Jawaban (revisi) |
| --- | --- |
| **Why 3:** Mengapa suku cadang tidak tersedia? | Belum ada daftar Critical Sparepart yang terintegrasi dengan pemantauan stok On-Hand terhadap Min-Max; pada format laporan lama juga belum ada kolom hasil review dari Sparepart Technician dan Supervisor Engineering. |
| **Why 4:** Mengapa pengadaan sulit dipantau dan terlambat? | Kebutuhan suku cadang kritis belum direview — belum ada keputusan part mana yang harus dijaga stoknya — sehingga bagian yang seharusnya di-stock baru diproses setelah mesin bermasalah (terlambat). Alur lama juga manual (email/Excel terpisah tanpa verifikasi). |

> Catatan penyelaras narasi: dengan revisi ini, **dua solusi** jadi jelas kelihatan — (1) sistem pengajuan barang digital + approval multi-tier, yang menyelesaikan Why 4 (alur terlambat/terlewat); dan (2) daftar critical sparepart terintegrasi + min-max, yang menyelesaikan Why 3 (stok kritis selalu dijaga, teknisi ga perlu nunggu breakdown / bahkan ga perlu ngajuin lagi karena emang harus di-stock).

---

## 4. Data PO Urgent (8,17 → 0,6)

**Draf balasan:**
> Betul kak, data PO Urgent yang emang punya Departemen Engineering itu cuma kategori **Urgent Sparepart Utility**. ATK, Labware, dan Produksi itu punya departemen lain, jadi yang turun cuma kategori engineering (dari 8,17% jadi 0,6% — sesuai data Kak Fadhil). Untuk sub bab-nya saya pendekin biar datanya langsung "ngomong":

**Teks revisi sub bab Permintaan PO Urgent (draf):**

> Permintaan PO Urgent menjadi indikator keberhasilan sistem karena berbanding lurus dengan kesiapan stok suku cadang. Pada tahun 2025, persentase permintaan PO Urgent untuk kategori Urgent Sparepart Utility yang ditangani Departemen Engineering tercatat **8,17%** dari total PO; setelah sistem pengajuan digital dan daftar critical sparepart diterapkan, persentase tersebut turun menjadi **0,6%** pada kuartal pertama 2026, jauh di bawah target <10%.

**Tabel 3.5.** Persentase PO Urgent Berdasarkan Kategori (revisi singkat)

| Kategori | YTD 2025 | YTD Q1 2026 | Terhadap Target <10% (Q1 2026) |
| --- | --- | --- | --- |
| Urgent Sparepart Utility (Dept. Engineering) | 8,17% | 0,6% | Di bawah target |

> Catatan: kategori lain (Labware, ATK, Produksi) tidak ditampilkan karena dikelola departemen berbeda. Untuk data pendukung tambahan (agar grafik 3.3 tetap kontekstual), saya bisa bantu ambilkan angka aktual dari aplikasi (menu Monthly Report / export Excel / PR Summary) kalau mau dicantumkan.

---

## 5. D1 (Data Store Master Stok & Critical Part) tidak terhubung ke 2.0 di DFD

**Draf balasan:**
> Bener banget kak, di aplikasi sekarang **form BQ emang ga nampilin jumlah stok**. Dropdown Item Code di form cuma nampilin kode + deskripsi aja, ga ada angka sisa stok-nya. Teknisi cek stok lewat menu **On Hand Stock / Layout Rak** yang terpisah. Jadi di DFD, D1 cukup nyambung ke proses 1.0 (Kelola Master Stok) dan 4.0 (monitoring critical part), **ga nyambung ke 2.0**. Udah saya sesuaikan.

> (Opsi ke depan: kalau mau, nanti saya bisa banget update webnya biar dropdown Item Code di Form BQ menampilkan sisa stok — baru saat itu D1 sah-sah aja terhubung ke 2.0.)

---

## 6. DFD Level 0 disesuaikan role

**Draf balasan:**
> Udah saya samain sama role tiap user. Hasil revisi ada di file `03_Draf_Revisi_Bab_3.md` (bagian "DFD Level 0"). Inti perubahannya:
> - Entitas eksternal: **Teknisi, Supervisor 1, Supervisor 2/Officer, Manager, Administrator** (+ Purchasing bila ditampilkan).
> - Proses 3.0 Verifikasi & Approval Multi-Tier: aliran approval SPV datang dari Supervisor 1/2/Officer; approval akhir Urgent dari Manager.
> - Proses 4.0 Monitoring & Reporting: PR Summary & Monthly Report hanya dari/ke Supervisor 1 dan Manager; Critical Part & Stok untuk semua peran yang relevan.
> - D1 tidak terhubung ke proses 2.0 (sesuai poin 5).

---

## 7. Use Case disesuaikan role

**Draf balasan:**
> Udah ikutin penjelasan Kak Fadhil — Officer disetarakan dengan Supervisor 2, dan proses pengadaan tetap di Administrator. Ringkasan use case yang saya pake:

| Aktor | Use Case |
| --- | --- |
| Teknisi (Lini Steril) | UC1 Isi Form BQ Digital; UC2 Pantau On-Hand Stock & Lokator Rak; UC3 Pantau BQ Summary Personal & status pengajuannya. |
| Supervisor 2 / Officer | UC4 Verifikasi & Approve BQ tahap Supervisor (termasuk penentuan Normal/Urgent); UC5 Akses Database Critical Sparepart; pantau stok On-Hand. |
| Supervisor 1 | UC4 (sama); UC6 Pantau PR Summary (baca-saja); UC7 Pantau Monthly Report; UC5. |
| Manager | UC8 Persetujuan akhir BQ Urgent; UC7 Pantau Monthly Report; persetujuan akun user baru. |
| Administrator (Sparepart Technician / Dev) | UC9 Kelola Master Data Stok & Parameter Min-Max; UC10 Meneruskan BQ Full-Approved ke Purchasing & eksekusi proses pengadaan. |
| Tim Purchasing (eksternal) | Proses Pengadaan Barang/Jasa (PR, Penawaran, PO, Pembelian) — menerima dari Administrator. |

> Catatan: UC8 (approval urgent) di-specify/di-include oleh UC4 (approve supervisor) karena manager hanya bisa bertindak setelah supervisor menyetujui.

---

## 8. Adv / koreksi tambahan yang saya temukan (rekomendasi — mohon disepakati)

**Draf balasan:**
>
> Ada **satu kontradiksi kecil** yang mau saya konfirmasi biar dokumen sama aplikasi konsisten pas demo:
>
> - Di aplikasi, yang bisa **ubah Status Pengadaan** (BQ Baru → Pending → Proses PO → ... → Selesai) itu bukan cuma Officer, tapi **Officer DAN Manager**. Dan di rekaman demo, akun **Officer (ANS)** yang eksekusi "Proses PO".
> - Sementara di pesan Kak Fadhil tadi: "*officer ituu sama kayaa supervisor 2 rolenya yaa, jadi yang proses pengadaan itu tetep saya sebagai administrator*".
>
> Jadi mau disamakan yang mana:
> - **(a)** Tabel 3.9 tetap ditulis "Proses Pengadaan = Administrator (Sparepart Technician)", dan di aplikasi peran tersebut dijalankan lewat akun Officer (ANS) yang dipegang Kak Fadhil → **tanpa ubah aplikasi**; atau
> - **(b)** opsi mendasar di aplikasi: saya tambah role **Administrator** yang benar-benar login (menu kelola master stok + eksekusi pengadaan), dan role Officer saya buat setara Supervisor 2 (tanpa menu ubah status pengadaan).
>
> Rekomendasi saya: **(b)**, biar Tabel 3.8/3.9, use case, dan aplikasi 100% satu suara. Tapi kalau waktu mepet, **(a)** juga aman — tinggal konsisten di narasi: "eksekusi status pengadaan dilakukan Administrator/Sparepart Technician melalui akun Officer".

---

## 9. Foto anggota (lingkup Avwan)

**Draf balasan:**
> Sip kak, foto Kak Fadhil udah kelihatan di folder "Foto Anggota" di folder CP baru (`CP Kelompok A 127-20261011T154435Z-1-001_BARU`).
> Untuk saya sendiri, nanti sore saya upload foto saya ke:
> `CP Kelompok A 127 > Poster, PPT dan Video > Foto Anggota`
> Untuk foto anggota lain ditunggu dari yang bersangkutan masing-masing. Makasih kak, semangat!