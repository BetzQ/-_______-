# M6 & M7 — Rekaman Demo, Skrip Presentasi, dan Panduan Demo Langsung

> **Peran:** Anggota 1 — Lead Developer (Avwan)
> **Checklist M6:** *"Rekam screen record demo aplikasi website."* — **Status: SELESAI**
> **Checklist M7:** *"Latihan presentasi demo produk website."* — **SELESAI 80%** (skrip + video tersedia; tinggal latihan pembawaan)
> Video demo: **`docs/evidence/video/demo-aplikasi.mp4`** (1 menit 57 detik, H.264, 1440×900, siap YouTube)

---

## Bagian A — Skrip Narasi Video Demo

> **Waktu total ± 3 menit** bila dibacakan dengan tempo normal sambil memperlihatkan layar.
> Baca dengan *nada ngobrol*, bukan membaca teks. Boleh dipotong sesuai kebutuhan YouTube.

### Menit 0:00–0:20 · Judul
> "Assalamu’alaikum, kami dari Kelompok A 127 Capstone Project Universitas Terbuka.
> Produk kami bernama **Micropage E-Sparepart** — sistem informasi Dashboard Terintegrasi untuk
> Departemen Engineering PT Fonko International Pharmaceuticals, lini steril."

### Menit 0:20–0:40 · Masalah & Tujuan *(rujuk Bab I)*
> "Permasalahan utamanya: pengajuan suku cadang dari teknisi sering **tidak lengkap** — spesifikasi,
> merk, dan kuantitas tidak jelas — sehingga verifikasi jadi sulit. Monitoring pengadaan pun masih manual
> via email dan pesan singkat, jadi dokumen rawan terselip. Akibatnya perbaikan mesin tertunda dan
> **downtime mesin menumpuk 305 menit** pada mesin Cartoning Marchesini.
> Tujuan sistem ini sederhana: **100% aksesibilitas data real-time** dan menurunkan pengadaan darurat
> sampai **di bawah 10%**."

### Menit 0:40–1:05 · Login & Peran (RBAC)
> "Sistem dipakai lima peran. Menu yang tampil otomatis menyesuaikan jabatan.
> Mari masuk sebagai Teknisi, kode **AAA**."

### Menit 1:05–1:30 · Teknisi: Cek Stok lalu Mengajukan
> "Sebelum mengajukan, teknisi mengecek **On Hand Stock**. Tampak jumlah stok fisik dan **lokasi rak**,
> jadi kalau barang ada, langsung diambil tanpa mengajukan apa pun.
> Karena barang tidak tersedia, teknisi membuka **Formulir Pengajuan Barang Digital**. Semua parameter
> **wajib** diisi — item code, qty, spesifikasi, purpose, nomor EJO, mesin area, merk — sehingga tidak ada
> lagi pengajuan yang tidak lengkap. Untuk kasus mendesak, teknisi menandai **Urgent**."

### Menit 1:30–1:45 · Teknisi: Memantau Status
> "Begitu dikirim, pengajuan langsung tampil di **BQ Summary** teknisi dengan status Menunggu Approval SPV.
> Teknisi tidak perlu lagi bertanya lewat email atau pesan singkat."

### Menit 1:45–2:05 · Supervisor: Monitoring & Persetujuan Tahap 1
> "Masuk sebagai Supervisor 1, kode **INN**. Di menu Monitoring & Approval, seluruh pengajuan dari teknisi
> masuk ke satu dasbor. Supervisor memeriksa kelengkapannya, lalu **menyetujui** dan menentukan kategori
> Normal atau Urgent."

### Menit 2:05–2:25 · Manager: Persetujuan Akhir (khusus Urgent)
> "Untuk pengajuan Urgent, keputusan berlanjut ke **Manager**, kode **KSW**. Manager memberi persetujuan
> akhir. Setelah itu status berlanjut ke proses pengadaan.
> Setiap keputusan tercatat di **Riwayat Approval** — ini *audit trail*, jadi semua jejak persetujuan dapat
> ditelusuri."

### Menit 2:25–2:45 · Dampak: Critical Part & Laporan Bulanan
> "Di menu **Critical Sparepart List**, 210 item kritis dipantau dengan parameter min–max stock.
> Bila stok menyentuh batas minimum, sistem sudah mengingatkan *sebelum* mesin rusak — ini inti pencegahan downtime.
> Terakhir, **Monthly Report** menyajikan tren pengajuan bulanan secara otomatis — duluan direkap manual."

### Menit 2:45–3:00 · Penutup
> "Dengan demikian, Micropage E-Sparepart menjawab dua akar masalah: pengajuan yang tidak lengkap dan
> tidak adanya Critical Sparepart List terpusat. Terima kasih, Wassalamu’alaikum."

---

## Bagian B — Panduan Demo Langsung (Sesi 8 / Ujian)

**Persiapan (5 menit sebelum tampil)**
1. Pastikan laptop terhubung ke internet.
2. Buka `https://e-sparepart-system-tau.vercel.app/?tour=off` di **dua** tab berbeda (agar mudah ganti peran).
   - **`?tour=off` penting:** menghentikan panduan (tour) onboarding yang muncul di login pertama per peran — kalau tidak dimatikan, overlay gelap + kartu panduan akan **menutupi aplikasi saat Anda mendemokannya** di depan penguji.
   - Kalau lupa memakai `?tour=off`, cukup klik tombol **Lewati** pada kartu panduan yang muncul.
3. Buka `docs/evidence/hasil-produk/galeri-mockup.html` sebagai cadangan bila jaringan bermasalah.

**Akun demo**

| Peran | Username | Password |
|---|---|---|
| Teknisi | `AAA` | `04AAA10` |
| Supervisor 1 | `INN` | `30INN11` |
| Supervisor 2 | `KAA` | `KAA1910` |
| Officer Penagihan | `ANS` | `ANS1805` |
| Manager | `KSW` | `01KSW10` |

**Alur demo 6 langkah (bila diminta mendemokan langsung)**
1. Login Teknisi → tunjukkan menu yang hanya boleh ia akses.
2. Cek On Hand Stock → tunjukkan lokasi rak.
3. Isi Form BQ → tunjukkan field wajib (inilah solusi masalah pengajuan tidak lengkap).
4. Logout → Login Supervisor → Monitoring → Approve.
5. Logout → Login Manager → Approve Urgent → buka Riwayat Approval.
6. Tunjukkan Monthly Report & Critical Part (poin dampak).

**Jawaban cepat untuk pertanyaan penguji**

| Pertanyaan | Jawaban inti |
|---|---|
| Di mana aplikasinya? | Vercel + data di Supabase (PostgreSQL); bisa dijalankan lokal dengan MySQL/XAMPP. |
| Bagaimana keamanannya? | Password di-hash scrypt, rate limit login, query berparameter, RBAC berjenjang (403 untuk akses tidak sah). |
| Apa bedanya dengan sistem lama? | Lama: Apps Script + Spreadsheet + monitoring email/pesan singkat. Baru: portal terpusat, real-time, ada audit trail. |
| Bukti berjalannya? | 1.503 pengajuan terproses; bukti transaksi `BQ-20260926-2814` berjalan Teknisi→SPV→Manager terekam lengkap. |
| Bisakah dipakai perusahaan lain? | Bisa — modul & skema dibuat generik (4 tabel). |

---

## Bagian C — Serah Terima untuk Wida (Visual & Media)

- **Video mentah:** `docs/evidence/video/demo-aplikasi.mp4` (MP4/H.264 — langsung bisa diunggah atau diedit).
- Disarankan: tambahkan **narasi suara** dari anggota 1–5 (tiap anggota satu bagian) + kartu judul branding
  kelompok, sesuai *poster A4* dan template PPT kelompok.
- Setelah final, unggah ke YouTube untuk **Tugas 3 (M7)** — pastikan tautan aktif saat **Sesi 8 (M8)**.

---

---

## Bagian D — Rubrik Latihan Mandiri (penyelesaian M7)

Lakukan **3 putaran** latihan. Centang bila sudah memenuhi kriteria di akhir baris.

**Putaran 1 — Hafalan alur (target ≤ 6 menit)**
- [ ] Menyebutkan judul & tujuan tanpa melihat catatan.
- [ ] Membuka Vercel dan login sebagai Teknisi tanpa terbata-bata.
- [ ] Menjalankan urutan: cek stok → isi Form BQ → BQ Summary.
- [ ] Logout lalu login SPV → Approve; login Manager → Approve Urgent → Riwayat.
- [ ] Menutup dengan Critical Part + Monthly Report.

**Putaran 2 — Narasi (target ± 3 menit, sesuai skrip Bagian A)**
- [ ] Setiap jeda antar bagian tidak lebih dari 3 detik.
- [ ] Angka kunci disebut lancar: 3.022 item, 210 critical part, 1.503 pengajuan, downtime 305 menit.
- [ ] Tidak ada satu pun bagian yang dibaca kata-per-kata dari kertas.
- [ ] Pengucapan akun demo benar: AAA / INN / KAA / ANS / KSW.

**Putaran 3 — Simulasi tanya jawab (5 menit)**
- [ ] Bisa menjawab 5 pertanyaan di Bagian B tanpa membuka catatan.
- [ ] Menunjukkan langsung di aplikasi saat ditanya "buktinya mana?" (transaksi `BQ-20260926-2814`, cari `EJO-DEMO-402106`).
- [ ] Siap pakai galeri cadangan (`galeri-mockup.html`) bila jaringan putus.
- [ ] Menyebutkan batasan & rencana perbaikan dari `M8-EVALUASI-PRODUK.md` §3 bila ditanya kelemahan.

> **Tanda lulus:** Putaran 1 tanpa berhenti lebih dari 2×, Putaran 2 ≤ 3 menit 30 detik,
> Putaran 3 menjawab minimal 4 dari 5 pertanyaan. Setelah itu item checklist M7 boleh dicentang.

---

*Dokumen & video diproduksi otomatis terintegrasi dengan aplikasi berjalan — 26 September 2026.*
