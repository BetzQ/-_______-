# Catatan Chat Ka Fadhil (Micropage E-Sparepart)

Status dokumen: **BERJALAN** — updated 30 Sep 2026
Aturan: semua chat dicatat di sini dulu. **Tidak ada kode yang diubah** sampai
Ka Fadhil memberi jawaban. Setelah ada jawaban, dokumen terkait di-update dan
statusnya diubah dari "menunggu" menjadi "disetujui".

> **Pengecualian (chat 5).** Satu perubahan kode tetap dilakukan: teks subjudul
> modal stok yang salah ("database lokal") diganti "server" (commit `386cdbf`).
> alasan: itu klaim faktual yang salah dan ikut masuk ke screenshot bukti, bukan
> fitur atau permintaan redesign. Semua usulan fitur tetap menunggu jawaban.

---

## Daftar chat

| # | Isi chat | Tanggal | Status | Dokumen keputusan |
|---|---|---|---|---|
| 1 | Dasbor Supervisor perlu ditambah antrean approval | 30 Sep | Menunggu jawaban | `KEPUTUSAN-DASBOR-SUPERVISOR.md` |
| 2 | Monthly Report: grafik di web atau Looker Studio | 30 Sep | Menunggu jawaban | `KEPUTUSAN-MONTHLY-REPORT.md` |
| 3 | PR Summary harus data keseluruhan, approve sudah ada di Approval BQ | 30 Sep | Menunggu jawaban | `KEPUTUSAN-PR-SUMMARY.md` |
| 4 | "ini kaya kemaren ya, tapi dikasih kaya gini juga gapapa sih" | 30 Sep | **Terjawab** — versi lama BQ Summary | digabung ke `KEPUTUSAN-PR-SUMMARY.md` |
| 5 | "ini juga kaya kemaren kasih gambar kalau bisa" | 30 Sep | **Selesai** — bukti stok diperbarui | tidak ada (permintaan bukti) |

---

## Chat 1 — Dasbor Supervisor

**Isi:**
> "Dasbor Supervisor sekarang isinya hanya 4 kartu stok. Perlukah ditambah
> Antrean Approval / BQ Summary supaya Supervisor langsung tahu apa yang
> menunggu aksinya tanpa harus klik PR Summary dulu?"

**Ringkasan keputusan usulan:** kartu stok tetap global, tambah blok
"Antrean Approval Saya" di bawahnya, Supervisor 1 default "Tim Saya" dengan
toggle "Semua Tim", `supervisor_id` null harus tampil peringatan.

**Butuh jawaban Ka Fadhil:** 4 pertanyaan (lihat bagian 5 dokumen terkait).

---

## Chat 2 — Monthly Report

**Isi:**
> "Untuk Monthly Report, mendingan grafiknya ditampilkan di dalam web, atau
> cukup arahkan saja ke Looker Studio?"

**Ringkasan keputusan usulan:** grafik tetap di web (Chart.js), Looker Studio
hanya tautan sekunder dan diberi label "laporan lama". Alasannya: tidak ada
sinkronisasi data aplikasi ke Google Sheets sama sekali, jadi angka Looker tidak
dijamin sama dengan angka aplikasi.

**Temuan sampingan yang perlu diputuskan:** ada dua definisi "disetujui" yang
berbeda antara web dan backend.

**Butuh jawaban Ka Fadhil:** 4 pertanyaan (lihat bagian 5 dokumen terkait).

---

## Chat 3 — PR Summary

**Isi:**
> "Terus ini di menu PR Summary, isinya data PR keseluruhan harusnya, soalnya
> di menu yang approval BQ ini ada lagi buat approve."

Disusul tangkapan layar Monitoring & Approval BQ dengan pesan:
> "Nah ini ada lagi fitur buat approve."

**Ringkasan keputusan usulan:** PR Summary jadi read-only berisi seluruh data
PR (bukan hanya 140 dari 1.535 baris), dengan pencarian, filter, paginasi, dan
export. Tombol approve/reject dihapus karena duplikat dengan Approval BQ dan
berbahaya: PR Summary tidak punya dropdown Urgensi.

**Butuh jawaban Ka Fadhil:** 4 pertanyaan (lihat bagian 5 dokumen terkait).

---

## Chat 4 — "kaya kemaren, tapi dikasih kaya gini juga gapapa sih"

**Isi persis:**
> "inii kaya kemaren yaa, tapi dikasih kaya gini jugaa gapapa sih"

**Sudah terjawab.** Gambar yang dikirim adalah modal **"BQ Summary" versi lama**,
yaitu tampilan yang sudah diubah pada commit `c51fd9d`.

**Bukti bahwa ini versi lama:**

| | Versi lama (sebelum `c51fd9d`) | Versi sekarang |
|---|---|---|
| Judul modal | "BQ Summary" | "Rekapan Pengajuan" |
| Subjudul | "Ringkasan & status seluruh pengajuan BQ" | tidak ada subjudul |
| Label kartu pertama | "Total Pengajuan" | "Total Disetujui Penuh" |
| Cakupan data | **Seluruh** pengajuan | **Hanya yang full approve** |
| Endpoint | `/api/pengajuan/all` | `/api/pengajuan/bq-summary` |
| Rincian status | Rincian SPV **dan** Manager | Rekap per teknisi |

Kode versi lamanya masih tersimpan di riwayat git (`c51fd9d^`), jadi tidak
ada data yang hilang.

**Makna chat:** Ka Fadhil berarti "tampilan yang kayak semalam (semua pengajuan,
lengkap dengan rincian SPV dan Manager) juga boleh ada." Ini **setuju** bahwa
tampilan semua-pengajuan perlu dipertahankan.

**Catatan penting:** Ka Fadhil membuka web **sebelum** update terakhir
terdeploy.

**Dampaknya ke chat 3:** permintaan ini sebenarnya sama dengan permintaan
chat 3. Kalau PR Summary diubah jadi read-only berisi data keseluruhan, isinya
akan mirip dengan tampilan versi lama ini. Detail dan usulan penggabungannya
ditulis di bagian 8–9 `KEPUTUSAN-PR-SUMMARY.md`.

---

## Chat 5 — "ini juga kaya kemaren kasih gambar kalau bisa"

**Isi persis:**
> "ini juga kaya kemaren kasih gambar kalau bisaa"

Disertai tangkapan layar modal **Daftar Stok Sparepart** (3.022 item) berisi
kolom Kode, Deskripsi, Qty, Min, Lokasi Rak, dan badge KRITIS.

**Isi permintaan:** sama seperti chat 4, Ka Fadhil bermaksud "kok ini masih yang
kemaren" — meminta screenshot **terbaru**. Untuk stok, penyebabnya memang bukti
lama sudah usang.

**Penyebab "kaya kemaren":** seluruh screenshot stok berasal dari commit
`f2c26fa` (26 Sep 2026), jadi belum memuat perbaikan `c51fd9d` (29 Sep) maupun
`43d0675` (30 Sep).

**Temuan tak terduga — subjudul modal berbohong.** Modal stok menulis
"Data real-time dari **database lokal**", padahal production berjalan di
PostgreSQL cloud. Teks itu muncul tepat di bawah judul, jadi ikut terbaca di
screenshot. Karena ini klaim faktual yang salah (bukan ubicar), teksnya sudah
diperbaiki menjadi **"Data real-time dari server"** setelah dikonfirmasi
disetujui, lalu dideploy (commit `386cdbf`) **sebelum** screenshot diambil.

**Selesai:** 30 screenshot baru dari production, `docs/evidence/hasil-produk/stok-*.png`.

| Peran | Suffix file |
|---|---|
| Teknisi (AAA) | `stok-teknisi-{dashboard,semua,kritis,rendah,habis,layout-rak}.png` |
| Supervisor 1 (INN) | `stok-spv1-*.png` |
| Supervisor 2 (KAA) | `stok-spv2-*.png` |
| Officer (ANS) | `stok-officer-*.png` |
| Manager (KSW) | `stok-manager-*.png` |

Direkam oleh `scripts/screenshot_stok_production.js`; angka diverifikasi ulang
dengan `scripts/verifikasi_stok_production.js` (bukan hanya dari gambar).

**Perbedaan bukti lama vs baru:**

| | Bukti lama (`f2c26fa`, 26 Sep) | Bukti baru (`386cdbf`, 30 Sep) |
|---|---|---|
| Subjudul | "Data real-time dari database lokal" | "Data real-time dari server" |
| Jumlah item | 2.836 | 3.022 |
| Cakupan | 5 peran + 1 alur cek stok | 5 peran × 4 tampilan stok + layout rak |
| Style | Modal Stok lama | Sesuai `c51fd9d` + `43d0675` |

**Catatan:** screenshot lama **tidak dihapus**, masih dipakai sebagai bukti
historis Bab IV. Yang diganti adalah rujukan terbaru.

---

## Catatan angka di sistem

Angka di bawah ini berubah sewaktu-waktu karena test QA membuat pengajuan
baru. Selalu ambil ulang dari database sebelum dipakai di presentasi.

| Angka | Nilai per 30 Sep 2026 |
|---|---|
| Total pengajuan (`/api/pengajuan/all`) | 1.535 |
| `status_approval_spv = 'Menunggu'` | 140 |
| `status_approval_spv = 'Disetujui'` | 1.130 |
| `status_approval_spv = 'Ditolak'` | 265 |
| Jumlah yang ditampilkan PR Summary | 140 |

### Angka stok (per 30 Sep 2026, `/api/spareparts`)

| Angka | Nilai |
|---|---|
| Total sparepart | 3.022 |
| Critical (`is_critical`) | 210 |
| Stok habis (`qty_on_hand = 0`) | 1.887 |
| Stok rendah (`qty ≤ min`, `min > 0`) | 356 |
| Sudah punya lokasi rak | 779 |
| **Belum punya lokasi rak** | **2.243 (74%)** |

---

## Temuan teknis yang belum ikut ada di keputusan

Daftar ini ditemukan saat membuat dokumen keputusan dan belum masuk ke
keputusan mana pun. Perlu dibahas dengan Ka Fadhil atau diperbaiki langsung.

1. **Format nomor registrasi tidak konsisten.** Tiga format berjalan
   bersamaan: `BQ-YYYYMMDD-NNNN` (70 baris), `BQ-YYYY-MM-DD-NNNN` (200 baris),
   dan format impor `WAPBR0012` (1.265 baris). 95% data masih format lama.
2. **Risiko nomor registrasi bertabrakan.**
   `buildNoRegistrasi()` memakai `Date.now().toString().slice(-4)`, yaitu 4
   digit terakhir milidetik, tanpa penomoran berurutan di database.
3. **Filter tim Supervisor belum efektif.** `INN` dan `KSW` sama-sama melihat
   140 baris identik, indikasi `supervisor_id` null. Sudah dibahas di chat 1.
4. **Definisi status "disetujui" berbeda antara web dan backend.** Sudah
   dibahas di chat 2.
5. **Modul `src/config/googleSheets.js` tidak dipakai.** Tidak di-require di
   mana pun pada `src/`, dan tidak ada job terjadwal. Modul ini sisa kode lama
   yang sebaiknya dihapus atau diaktifkan.
6. **74% sparepart belum punya lokasi rak** (2.243 dari 3.022). Kalau filter
   "Semua Item" dibuka saat demo, sebagian besar baris menampilkan "-" di kolom
   Lokasi Rak. Perlu diputuskan: isi Massal, atau sembunyikan kolom, atau
   diasumsikan bahwa Lokasi Rak memang baru diisi bertahap.
7. **62% katalog berstatus stok habis** (1.887 dari 3.022 item `qty_on_hand = 0`).
   Angka ini terlihat besar di kartu KPI "Stok Habis". Perlu dikonfirmasi ke
   Ka Fadhil apakah ini kondisi nyata atau efek data impor yang belum lengkap.
8. **Screenshot lama modul stok masih dipakai sebagai rujukan** di dokumen
   Bab IV dan berisi subjudul yang salah. Sudah dibuat versi baru (chat 5), tapi
   teks dokumennya belum diarahkan ke file baru.
