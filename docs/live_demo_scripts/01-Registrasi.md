# SKRIP LIVE DEMO 01 — Registrasi Akun & Persetujuan oleh Manager

> **Micropage E-Sparepart — PT Fonko International Pharmaceuticals**
> Modul: Manajemen User (Pendaftaran → Persetujuan → Penetapan Tim)
> Durasi Presentasi: **± 6 menit**
> Tanggal revisi skrip: **13 Oktober 2026**

---

## 🎯 Tujuan Sesi

Demonstrasikan 3 hal sekaligus:

1. **Self-service registration** — pengguna mendaftar sendiri, tanpa admin.
2. **Approval berlapis oleh Manager** — akun **tidak aktif** sampai Manager menyetujui.
3. **Penetapan peran (RBAC)** — Manager menugaskan akun ke tim **Supervisor 1 / Supervisor 2 / Administrator**, dan peran Administrator inilah yang memegang hak akses **mengubah status pengadaan**.

---

## ⚙️ PRA-SYARAT (sebelum demo)

| Item | Keterangan |
|---|---|
| Server | Sudah running (`node server.js`) di port **3000** |
| Browser | Chrome/Edge, ** Incognito window** (`Ctrl` + `Shift` + `N`) |
| URL | `http://localhost:3000` |
| Akun pembicara | **Manager** (KSW) — sudah login di tab/window **kedua** |
| Koneksi internet | **TIDAK diperlukan** (aplikasi 100% lokal) |

> 💡 **Trik presenter:** gunakan **dua jendela browser terpisah** — satu untuk
> performakan Manager, satu untuk performakan akun baru. Supaya terlihat
> seperti dua orang berbeda.

---

## BAGIAN A — Pendaftaran Akun Baru (Dilakukan oleh Calon Pengguna)

> 👤 **Perankan:** user baru — bicara seperti user biasa, bukan developer.

### Langkah 1 — Buka halaman login

1. Buka jendela **Incognito** baru (`Ctrl` + `Shift` + `N`).
2. Ketik `http://localhost:3000` pada address bar, tekan **Enter**.
3. Layar login gelap dengan logo Micropage E-Sparepart muncul.
4. Di bawah kolom password, ada teks biru: **"Daftar di sini"**.

> 🗣️ **Ucapkan:**
> *"Ini adalah aplikasi internal untuk pengelolaan sparepart. Setiap pengguna baru
> mendaftar sendiri lewat halaman login ini — tidak perlu hubungi admin satu per satu."*

### Langkah 2 — Buka form pendaftaran

1. **KLIK** pada link biru **"Daftar di sini"**.
2. Modal **"Daftar Akun Baru"** terbuka di tengah layar.
3. Tampilkan ada **3 kolom isian** (tidak ada kolom role/tim — itu diisi Manager nanti).

### Langkah 3 — Isi form (klik demi klik)

| # | Kolom | **KLIK** di | Lalu **KETIK** | Validasi |
|---|---|---|---|---|
| 1 | **Username** | kolom Username | `BDT01` | 3–50 karakter, huruf/angka/titik/garis bawah |
| 2 | **Nama Lengkap** | kolom Nama Lengkap | `Budi Santoso` | Wajib diisi |
| 3 | **Password** | kolom Password | `Budi12345` | Minimal **6 karakter** |

> 🗣️ **Ucapkan:**
> *"Perhatikan, di form pendaftaran ini **tidak ada** pilihan role. Ini disengaja —
> supaya user tidak bisa mendaftarkan dirinya langsung sebagai Administrator.
> Penetapan peran sepenuhnya wewenang Manager."*

### Langkah 4 — Kirim pendaftaran

1. **KLIK** tombol biru besar **"KIRIM PENDAFTARAN"**.
2. Tombol berubah abu-abu (*disabled*) sesaat — jangan buru-buru klik lagi.
3. Muncul **kotak hijau** di bawah form:

   > ✅ *"Pendaftaran berhasil! Akun aktif setelah Manager menyetujui — Anda boleh
   > login kapan saja untuk memeriksa status."*

> 🗣️ **Ucapkan:**
> *"Jadi pesan kuncinya: **'Akun aktif setelah Manager menyetujui'**.
> Pendaftaran berhasil, tapi belum tentu bisa dipakai."*

---

## BAGIAN B — Bukti Akun Belum Aktif (Layar Tunggu)

> Ini bagian **paling meyakinkan** untuk jury.

### Langkah 5 — Coba langsung login dengan akun baru

1. **KLIK** tombol **✕** untuk menutup modal pendaftaran.
2. **KLIK** kolom **Username** → **KETIK**: `BDT01`
3. **KLIK** kolom **Password** → **KETIK**: `Budi12345`
4. **KLIK** tombol **LOGIN / MASUK**.

### Langkah 6 — Tunjukkan layar kuning "menunggu persetujuan"

1. Login **BERHASIL** (tidak ditolak), tetapi:
2. **Tidak ada satu pun menu** yang muncul.
3. Yang tampil hanya **kotak kuning** di tengah dengan ikon jam:
   > *"Akun Anda sudah terdaftar, tapi belum diaktifkan. Manager akan menyetujui
   > pendaftaran dan menugaskan Anda ke tim (Supervisor 1 / Supervisor 2 /
   > Administrator). Setelah disetujui, login kembali — semua menu akan tersedia."*
4. Tidak ada tombol Logout, tidak ada grid modul — **halaman benar-benar kosong**.

> 🗣️ **Ucapkan:**
> *"Ini bukti paling penting. Akun **bisa login**, tapi **nol akses**.
> fitur di dalamnya masih terkunci. Yang mengaktifkan adalah Manager."*

### Langkah 7 — Tutup jendela ini (jangan logout!)

1. Biarkan jendela Incognito tetap terbuka di layar kuning.
2. Pindah ke **jendela Manager**.

> ⚠️ **Jangan klik Logout** di jendela Manager — nanti lächer akses approval.

---

## BAGIAN C — Persetujuan & Penetapan Tim (Performed oleh Manager)

> 👤 **Perankan:** Manager (KSW) — bicara dengan nada confident, sudah biasa.

### Langkah 8 — Buka menu Approval User

1. Di jendela **Manager**, pada grid menu, cari kartu:
   > 📋 **"Approval User"** — deskripsi: *"Setujui pendaftaran & tugaskan tim
   > (Supervisor 1 / 2 / Administrator)"*
2. **KLIK** kartu tersebut.
3. Modal **"Approval User"** terbuka dengan sub-teks yang sama.

### Langkah 9 — Kenali antrean pendaftaran

1. Di dalam modal, tampilkan **satu kartu pendaftaran** milik `BDT01`.
2. Perhatikan atribut yang tampil:
   - **Badge kuning "PENDING"**
   - Nama lengkap: *Budi Santoso*
   - Username: *BDT01*
   - Baris: **"Daftar: &lt;tanggal &amp; jam&gt;"** — jejak waktu pendaftaran
3. Di sisi kanan ada **3 kontrol**:

   | Kontrol | Isi default | Keterangan |
   |---|---|---|
   | **Role** | `Role: Teknisi` | Persamaan role akun |
   | **Tim** | `Tim: — pilih —` | **WAJIB** diisi Manager |
   | **Link BQ** | (kosong) | Link dokumen pengajuan BQ pribadi, opsional |

### Langkah 10 — Isi Tim (langkah paling penting)

1. **KLIK** pada dropdown **"Tim: — pilih —"**.
2. **TUNGGU** daftar pilihan muncul (Supervisor 1 / Supervisor 2 / Administrator).
3. **KLIK** pada **"Tim Administrator"**.
4. **TUNGGU** teks pada dropdown berubah menjadi **"Tim Administrator"**.

> 🗣️ **Ucapkan:**
> *"Di sinilah peran baru kita masuk. Dulu tim ketiga bernama **Officer**.
> Sekarang sudah diubah menjadi **Administrator** — karena orang yang memegang
> status pengadaan bukan sekadar ‘petugas’, tapi memang **`Administrator` sistem**."*

### Langkah 11 — Isi Link BQ (opsional, tapi cukup menarik)

1. **KLIK** kolom **Link BQ** (opsional) → **KETIK**: `BQ/2026/10/0147`

> 🗣️ **Ucapkan:**
> *"Sekalian saya tautkan nomor dokumen BQ pribadi, biar traceability dari
> pengguna sampai dokumen pengajuan langsung nyambung."*

### Langkah 12 — Klik Setujui

1. **KLIK** tombol hijau **"Setujui"**.
2. **Toast hijau** muncul: ✅ *"Pendaftaran disetujui"*.
3. Modal **refresh otomatis** — kartu `BDT01` **hilang** dari antrean.
4. Tampil pesan: *"Tidak ada pendaftaran yang menunggu persetujuan."*

### Langkah 13 — Buktikan validasi (opsional, 10 detik)

1. Daftarkan akun baru dengan username `BDT02`, role **Teknisi**, lalu **TIDAK** pilih tim.
2. **KLIK Setujui**.
3. Toast **merah** muncul: ❌ *"Pilih tim: Supervisor 1, Supervisor 2, atau Administrator"*

> 🗣️ **Ucapkan:**
> *"Validasi berlapis. Manager boleh lupa, tapi sistem tidak — kalau tim kosong, sistem menolak."*

---

## BAGIAN D — Verifikasi Akhir: Akun Baru Sudah Aktif

### Langkah 14 — Login ulang sebagai akun baru

1. Pindah ke jendela **Incognito** yang tadi menampilkan layar kuning.
2. **KLIK** **Refresh** (atau tutup & buka lagi).
3. Login lagi: Username `BDT01`, Password `Budi12345`.

### Langkah 15 — Tunjukkan menu sudah muncul

1. **Kartu-kartu modul** kini tampil (grid menu sudah tidak kosong).
2. **KLIK Logout** di kanan atas.

> 🗣️ **Ucapkan:**
> *"Perhatikan — hanya dengan **satu klik Setujui** oleh Manager, akun yang
> tadinya nol akses sekarang langsung punya menu. Inilah **alur approval
> user** kami."*

---

## BAGIAN E — Uji Silang RBAC: Efek Perubahan Role Officer → Administrator

> Bagian ini **wajib ditampilkan**, karena merupakan hasil modifikasi kode terbaru.

### Langkah 16 — Buktikan akun Administrator bisa ubah Status Pengadaan

1. Login dengan akun **berperan Administrator**.
2. **KLIK** menu **"Approval BQ Tahap Supervisor"**.
3. Pada tabel pengajuan, sorot kolom **Status Pengadaan**.
4. **Dropdown status Pengadaan AKTIF dan bisa diubah** — antara lain:
   `BQ Baru` → `Pending` → `Proses PO` → `PO Open` → `Mencari Penawaran` →
   `Barang Dikirim` → `Tiba di Gudang` → `Selesai`
5. **KLIK** satu nilai baru → hint: *"Status pengadaan diperbarui."*

### Langkah 17 — Buktikan akun lain tidak bisa

| Peran | Kolom Status Pengadaan | Expected |
|---|---|---|
| **Administrator** | Dropdown **aktif** | ✅ Bisa diubah |
| **Manager** | Dropdown **aktif** | ✅ Bisa diubah |
| **Supervisor 1/2** | Teks biasa (**read-only**) | ❌ Tidak bisa |
| **Teknisi** | Teks biasa | ❌ Tidak bisa |

> 🗣️ **Ucapkan:**
> *"Hak mengubah status pengadaan **hanya** milik Administrator dan Manager.
> Ini dikunci di dua lapis: **backend** menolak dengan HTTP 403 kalau bukan
> mereka, dan **frontend** men-disable dropdown-nya. Jadi mustahil lewat
> cara pintas /*Inspect*/ browser."*

### Langkah 18 — Buktikan pesan errornya benar

1. Ganti kolom Status Pengadaan via dropdown.
2. Bila pengujian dilakukan langsung ke API, pesan error yang tampil:
   > `"Status pengadaan hanya bisa diubah oleh Administrator / Manager."`

---

## BAGIAN F — Penolakan Pendaftaran (Opsional, jika ada waktu)

### Langkah 19 — Tolak akun yang tidak dikenal

1. Di modal **Approval User**, cari kartu pendaftaran
   `BDT99` yang dibuat-buat sebelum demo.
2. **KLIK** tombol merah **"Tolak"**.
3. Dialog konfirmasi: *"Tolak pendaftaran ini? Username tidak bisa dipakai lagi
   untuk mendaftar ulang."*
4. **KLIK** OK → Toast merah: *"Pendaftaran ditolak"*.

> 🗣️ **Ucapkan:**
> *"Sekali ditolak, username-nya terkunci permanen — tidak bisa didaftarkan
> ulang. Ini mencegah orang membuat akun baru terus menebak."*

---

## 📋 DAFTAR TEKS YANG BISA DIUCAPKAN (cheat sheet)

| Kapan | Kutipan |
|---|---|
| Pembuka | *"Di PT Fonko, sparepart adalah aset kritis. Aplikasi ini mengontrol alur pengajuannya, bukan sekadar basis data."* |
| Saat form registrasi | *"Tidak ada pilihan role di sini — penetapan peran sepenuhnya wewenang Manager."* |
| Saat login pending | *"Akun berhasil login, tapi nol fitur. Ini principle of least privilege."* |
| Saat pilih Tim | *"Dulu tim ketiga bernama Officer, sekarang **Administrator** — karena memegang wewenang sistem."* |
| Saat Setujui | *"Satu klik Manager mengaktifkan seluruh akses akun."* |
| Saat uji dropdown | *"Dropdown aktif = boleh ubah. Nonaktif = read-only. Dua lapis: backend 403 + frontend disable."* |
| Penutup | *"Registrasi otomatis, approval terpusat, akses minimum. Pemilik sparepart bisa fokus ke operasional."* |

---

## ⚠️ MASALAH YANG SERING MUNCUL & CARA ATASI

| Gejala | Penyebab | Solusi |
|---|---|---|
| Toast *"Gagal terhubung ke server"* | Server belum jalan | Jalankan `node server.js`, cek terminal |
| Tombol **Setujui** tidak merespons | **Tim** belum dipilih | Pilih Tim dahulu (wajib) |
| Akun baru tetap melihat layar kuning | Manager belum menyetujui | Login ulang sebagai Manager, buka **Approval User** |
| Menu tidak muncul setelah disetujui | Halaman belum di-refresh | Tekan **Refresh** (F5) pada jendela akun baru |
| Login ditolak | Password < 6 karakter saat daftar | Ulangi pendaftaran dengan password ≥ 6 karakter |

---

## ✅ CHECKLIST AKHIR SESI (sebelum tampil ke jury)

- [ ] Server running, `http://localhost:3000` terbuka normal
- [ ] Jendela Manager sudah **login** dan tidak di-logout
- [ ] Jendela Incognito siap di layar login
- [ ] Akun demo `BDT01` **belum** didaftarkan (atau sudah dihapus dari database)
- [ ] Data pengajuan BQ di tabel **sudah ada** agar dropdown bisa diperagakan
- [ ] Tidak ada credential Supabase yang terlihat di layar (run through `F12` → **Network** dulu)

---

## 📎 REFERENSI TEKNIS (untuk pertanyaan jury)

| Komponen | Lokasi |
|---|---|
| Endpoint pendaftaran | `POST /api/register` → `src/routes/api.js` |
| Endpoint antrean pending | `GET /api/users/registrations?status=pending` |
| Endpoint persetujuan | `POST /api/users/approve` → `approveUser()` |
| Endpoint penolakan | `POST /api/users/reject` → `rejectUser()` |
| Logika validasi tim | `src/controllers/userManagementController.js` — array `['supervisor 1','supervisor 2','administrator']` |
| Logika RBAC backend | `src/controllers/bqController.js` — `classifyRole()` & `updateStatusPengajuan()` |
| Logika RBAC frontend | `public/index.html` — `actorKey()`, `canProcure`, dropdown Tim |

---

*Dokumen ini bagian dari paket `docs/live_demo_scripts/`. Skrip terkait:
`02-...` (alur pengajuan BQ), `03-...` (approval SPV & Manager), dst.
Silakan sesuaikan nomor akun/tim dengan kondisi data saat demo.*