# Hasil Verifikasi Kode Aplikasi (Dasar Jawaban)

Dokumen ini berisi fakta-fakta dari kode **`Micropage E-Sparepart - app - deployed`** yang dijadikan landasan jawaban ke Kak Fadhil. Sumber utama: `public/index.html` (frontend + RBAC), `src/` (backend), `database/` (skema). Verifikasi tanggal 11 Oktober 2026.

**Lingkup tugas:** **Avwan (Lead Developer)** — ini murni domain teknis aplikasi, bukan dokumen anggota lain.

---

## A. Role yang benar-benar ada di aplikasi

Dari skema DB (`database/schema.sql:24`) dan menu per role (`public/index.html:2139` `getMenu()`), role login yang dikenali sistem:

`pending` (pendaftaran baru, menunggu Manager) → `teknisi` → `Supervisor 1` / `Supervisor 2` / `Officer` / `manager`

> **TIDAK ada role login "Administrator".** Peran "Administrator / Sparepart Technician / Lead Developer" (kelola master data, parameter min-max, meneruskan Full-Approved ke purchasing) di aplikasi dijalankan lewat *role Manager* (approval akun, log) dan *role Officer* (eksekusi status pengadaan) + manipulasi DB/import oleh pengembang. Ini sudah dicatat di dokumen jawaban sebagai **titik keputusan**.

---

## B. Menu tiap role (dari `getMenu()`)

### Teknisi
- BQ Personal (Input pengajuan barang baru)
- Status Pengajuan Saya (lacak sampai disetujui atasan)
- On Hand Stock
- Layout Rak
- Rekapan Pengajuan (BQ yang sudah disetujui penuh)
- **Critical Part List TIDAK muncul untuk teknisi** (sesuai feedback Kak Fadhil 29/09: "di-hide di level teknisi").

### Supervisor 1
- PR Summary, Monthly Report, Rekapan Pengajuan,
- Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock, Layout Rak

### Supervisor 2 DAN Officer (identik)
- Rekapan Pengajuan, Approval BQ Tahap Supervisor, Critical Part List, On Hand Stock, Layout Rak
- **TANPA PR Summary & TANPA Monthly Report** → persis dengan penjelasan Kak Fadhil "Supervisor 2 & Officer sama aja".

### Manager
- Approval User (setujui pendaftaran + tugaskan tim), Log Aktivitas,
- On Hand Stock, Layout Rak, Monthly Report, PR Summary, Rekapan Pengajuan,
- Approval BQ Urgent, Critical Part List

---

## C. Dashboard halaman depan

- Dashboard **teknisi** menampilkan **data pengajuan miliknya sendiri** (`my-bq-section`), KPI stok di-sembunyikan (`index.html:2454–2460`) — sesuai feedback Kak Fadhil 29/09.
- Antrean approval ("Approval Queue") di halaman depan **hanya untuk Supervisor 1** (`index.html:2462–2463`). Officer/Supervisor 2 tetap bisa approve via menu **Approval BQ Tahap Supervisor**.
- Role lain tetap memakai ringkasan stok (KPI).

---

## D. Form BQ vs Stok (jawaban poin D1 di DFD)

- Form BQ (`openBqModal`) punya dropdown/autocomplete **Item Code** yang memfilter data sparepart.
- Dropdown tersebut menampilkan **hanya `item_code` + `deskripsi`** — **TIDAK ada angka sisa stok (`qty_on_hand`)** (`index.html:1955–1965`).
- Kolom `qty_on_hand` hanya dipakai di modal **On Hand Stock / Critical Part** (`index.html:1165–1364`) dan dashboard KPI, bukan di form BQ.
- **Kesimpulan:** klaim Kak Fadhil benar — D1 (Master Stok & Critical Part) tidak terhubung ke proses 2.0 (Pengajuan Form BQ) di implementasi saat ini. Teknisi cek stok lewat menu terpisah (On Hand Stock / Layout Rak).

---

## E. PR Summary

- Menu PR Summary hanya muncul untuk **Supervisor 1 dan Manager**.
- **Baca-saja** — tidak ada tombol approve di PR Summary (tour di `index.html:3901`: "Tombol approve sengaja tidak ada di sini supaya urgency tidak pernah terlewat"). Konsisten dengan pesan Kak Fadhil "cuma punya aksesnya aja ga sampe ngedit".
- Default scope: Supervisor 1 = **Tim** sendiri; lainnya (Manager) = **Semua** (`index.html:3656`).
- Ada pencarian, filter status, pagination, dan **Export Excel** (`btn-prsummary-xlsx`).

---

## F. Approval BQ (proses 3.0) & status pengadaan

Di modal monitoring (`index.html:3206–3268`):

| Aksi | Pelaku (per kode) |
| --- | --- |
| Approve/Reject tahap SPV (`status_approval_spv`) | Supervisor **atau** Manager (`canSpv`) |
| Penentuan Normal/Urgent (`setUrgency`) | Supervisor **dan** Manager (`index.html:3412`) |
| Approve/Reject tahap MGR (`status_approval_manager`) | Manager saja; **disabled** selama SPV belum approve (`mgrDisabled`, `index.html:3239–3240`) |
| Ubah **Status Pengadaan** (`setPengadaanStatus`) | **Officer atau Manager** (`canProcure`, `index.html:3234`); Supervisor baca-saja |
| Riwayat / audit trail (`data-history`) | Semua role (`pengajuan_log`) |

Daftar status pengadaan (`index.html:3012`):
`BQ Baru → Pending → Proses PO → PO Open → Mencari Penawaran → Barang Dikirim → Tiba di Gudang → Selesai`

> **Poin penting:** di kode, Officer saat ini memang satu-satunya peran non-manager yang bisa mengubah status pengadaan. Ini bertentangan tipis dengan pesan terakhir Kak Fadhil ("officer = Supervisor 2", "proses pengadaan = Administrator"). Sudah diangkat sebagai titik keputusan (opsi a/b) di `01_Draft_Balasan_Kak_Fadhil.md` poin 8.

---

## G. Register & approval akun (Role-based onboarding)

- User daftar → role **`pending`**, tidak punya menu (tampilan "Menunggu Persetujuan Manager").
- Manager (menu **Approval User**) menyetujui sambil **menugaskan tim**: Supervisor 1 / Supervisor 2 / Officer, plus link BQ personal (`index.html:2674–2702`, `approveRegistration`).
- Konsisten dengan pesan Kak Fadhil sebelumnya (26/09): "menu register nanti approvalnya ke manager sekalian di assign ke tim mana".

---

## H. Log aktivitas / audit trail

- Manager punya menu **Log Aktivitas** dengan dua tab: **Log Login** dan **Log Aktivitas** (`openLogActivity('login')`).
- Setiap perubahan status approval & pengadaan tercatat di `pengajuan_log` (aktor + waktu) → mendukung Tabel 3.9 "Jejak audit".