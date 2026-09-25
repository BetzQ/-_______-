/* ============================================================
   Catatan Kerja Anggota — Capstone Kelompok A 127 (STSI4401)
   Data kontribusi disusun dari arsip chat grup + dokumen tim,
   per tanggal 25 September 2026 (Minggu ke-2 / M1–M2).
   ============================================================ */

const PROJEK = {
  judul: "Pengembangan Micropage Dashboard Terintegrasi melalui Formulir Pengajuan Barang Digital, Critical Sparepart List, dan Monthly Report di Departemen Engineering PT Fonko International Pharmaceuticals (Lini Steril)",
  matkul: "Capstone Project — STSI4401",
  universitas: "Program Studi Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Terbuka",
  pembimbing: "Purwanto, S.Kom., M.Kom",
  periode: "Minggu ke-1 s.d. ke-8 (M1–M8), dimulai 15 September 2026",
  status: "Sedang berjalan — berada di rentang M1–M2, menuju penyusunan dan submit Proposal (Tugas 1) pada M3.",
  lingkupTitik: [
    "Latar belakang masalah: pengajuan barang manual yang sering tidak lengkap, monitoring berbasis email yang lemah, dan belum adanya Critical Sparepart List terintegrasi.",
    "Bukti terukur yang dipakai tim: akumulasi downtime mesin Cartoning Marchesini sebesar 305 menit (± 5,08 jam) dari enam dokumen EJO, sebagai dasar kebutuhan sistem.",
    "Sistem sasaran: Formulir Pengajuan Barang Digital (BQ) + alur approval berjenjang, dasbor monitoring real-time, modul Critical Sparepart List dengan On-Hand Stock, serta Monthly Report.",
    "Tolok ukur keberhasilan: aksesibilitas data 100% real-time; pengajuan tidak terproses dan pengadaan urgent diturunkan hingga di bawah 10%.",
  ],
};

const MEMBERS = [
  {
    id: "fadhil",
    nama: "Fadhil",
    namaLengkap: "Mochammad Fadhillah Hakim",
    nim: "053220047",
    anggota: "Anggota 2",
    peran: "Idea Initiator, Business Analyst & Technical Writer",
    warna: "#2f6b5f",
    tagline: "Penggagas topik, pemegang pemahaman sistem (Fonko Gemini / CI), serta pengumpul & penyunting laporan tim.",
    ringkasan: [
      "Fadhil adalah sumber utama ide dan pengetahuan sistem. Topik proyek lahir dari dua proyek perbaikan nyata (Continual Improvement) yang pernah ia kerjakan selaku Sparepart Technician di Departemen Engineering PT Fonko, yaitu PI pertama pada 2025 dan PI kedua pada periode Januari–Agustus 2026.",
      "Perannya di kelompok adalah memastikan setiap anggota memahami masalah, alur sistem, kebutuhan data, dan fitur wajib — kemudian menampung seluruh tulisan anggota dan menyatukannya menjadi laporan resmi (formatting & submit).",
      "Ia inisiatif membangun infrastruktur kerja tim sejak hari pertama: membuat grup, polling jadwal diskusi, menyiapkan Google Drive lengkap dengan checklist mingguan, referensi kating, folder bahan, draf proposal, dan dokumen bahan teknis untuk developer aplikasi.",
    ],
    timeline: [
      { tgl: "15 Sep 2026", judul: "Mendirikan dan mengarahkan tim di hari pertama", isi: [
        "Membuat grup WhatsApp dan mengingatkan jadwal Tuweb sesi 1 (Jumat malam).",
        "Mengadakan polling waktu diskusi perdana dan memastikan seluruh anggota ikut menentukan topik serta pembagian tugas.",
        "Menyelenggarakan Google Meet perdana (pbh-numf-tku) dan menegaskan bahwa agenda meet dicatat ke dalam berita acara sebagai lampiran laporan CP.",
      ], evid: "Chat 15 Sep — pembuatan grup, polling, link Meet, dan aturan berita acara." },
      { tgl: "15 Sep 2026 (malam)", judul: "Menyiapkan Google Drive + pembagian tugas awal", isi: [
        "Menyiapkan Drive CP lengkap: checklist & to-do list mingguan, referensi dari kating, dan folder bahan.",
        "Membuatkan draf 'kasar' proposal capstone dan draf laporan capstone untuk didevelop anggota lain.",
        "Menyusun Google Docs 'Aps Script CP' (berisi tautan aplikasi Apps Script + source code) sebagai bahan pengembangan utama untuk developer aplikasi.",
        "Mengarahkan teman-teman: Sarifah → melengkapi jurnal 5 tahun terakhir; Avwan → mempelajari Aps Script; Giren → meninjau bahan untuk draf PPT/poster.",
      ], evid: "Chat 15 Sep, 20:46 — pesan pengenalan Google Drive." },
      { tgl: "16 Sep 2026", judul: "Memaparkan latar belakang & problem statement resmi", isi: [
        "Menjelaskan akar masalah (Why-Why Analysis): (1) pengajuan tidak lengkap & monitoring lemah; (2) belum ada Critical Sparepart List terintegrasi.",
        "Menyampaikan dampak operasional: downtime tinggi, temporary action berulang, dan pembengkakan biaya overtime.",
        "Menjabarkan inti sistem yang akan dibangun: Formulir Pengajuan Barang Digital + approval, dasbor monitoring status, modul Critical Sparepart List/On-Hand Stock, dan Monthly Report.",
        "Berjanji menyuplai data pendukung kapan pun developer aplikasi membutuhkannya.",
      ], evid: "Chat 16 Sep, 09:14 — paparan problem statement (panjang, hasil penyusunan pribadi)." },
      { tgl: "17 Sep 2026", judul: "Menjawab 5 pertanyaan kebutuhan fungsional dari developer", isi: [
        "Monthly Report: menyertakan tautan Looker Studio dan raw data sebagai rujukan.",
        "Status Normal/Urgent: dibutuhkan pada tiap pengajuan untuk keperluan approval & pelaporan.",
        "Approval SPV: 3 orang (Supervisor 1, Supervisor 2, Officer) masing-masing punya tim sendiri.",
        "Menu PR Summary: dipakai untuk hak akses Manager dan Supervisor 1.",
        "Jenis Jasa (JA): termasuk pengajuan, sehingga perlu masuk ke dalam sistem.",
      ], evid: "Chat 17 Sep, 17:09 — jawaban rinci atas daftar pertanyaan Avwan (14:07)." },
      { tgl: "17 Sep 2026 (malam)", judul: "Melengkapi tim: mengundang Wida & mengatur ulang pembagian tugas", isi: [
        "Mengundang anggota ke-5, Ni Komang Widastri, yang berprofesi UI/UX Designer.",
        "Mengusulkan reshuffle agar Giren memegang penyusunan Bab III yang memuat banyak diagram (DFD, flowchart, dll.), dan Wida menangani sisi visual/media.",
        "Meminta persetujuan Giren terlebih dahulu ketimbang memutuskan sepihak (Giren menyetujui).",
      ], evid: "Chat 17 Sep, 20:12 — pesan + gambar pembagian tugas baru." },
      { tgl: "18 Sep 2026", judul: "Mendokumentasikan alur kerja & hak akses (RBAC) seluruh peran", isi: [
        "Menu per role: Teknisi (Form BQ Personal, On Hand Stock, BQ Summary); Officer & SPV 2 (BQ Summary, Approval SPV, On Hand Stock, Critical Part); SPV 1 (PR Summary, Monthly Report, BQ Summary, Approval SPV, Critical Part, On Hand Stock); Manager (On Hand Stock, Monthly Report, BQ Summary, Approval BQ Urgent, Critical Part); Administrator (backend).",
        "Menjelaskan alur pengajuan barang (cek stok → isi Form BQ → approval SPV → approval Manager khusus Urgent → eksekusi pengadaan) dan alur preventive replenishment critical part berbasis min-max stock.",
        "Menjadikan paparan ini acuan bersama bagi developer aplikasi dan penyusun Bab III.",
      ], evid: "Chat 18 Sep, 09:06 — penjelasan flow & RBAC (ditujukan utk Avwan & Giren)." },
      { tgl: "19 Sep 2026", judul: "Menentukan daftar topik kajian pustaka & mengunci pembagian Bab", isi: [
        "Memberi Sarifah 9 topik pencarian jurnal (5 bahasa Indonesia, 4 bahasa Inggris): sistem informasi pengadaan berbasis web, RAD, min-max stock, otomasi workflow, analisis downtime, RBAC, dll.",
        "Mengunci pembagian: Sarifah → Bab I & II; Giren → Bab III; Wida → PPT & poster.",
      ], evid: "Chat 19 Sep, 20:35–20:38." },
      { tgl: "20 Sep 2026", judul: "Memberikan draf kerangka Bab III + diagram awal untuk Giren", isi: [
        "Menyusun draf 'kasar' Bab III dan diagram awal, lalu menyerahkannya kepada Giren untuk dirapikan memakai Visio/DrawIO.",
        "Memberi arahan agar diagram disesuaikan dengan pengembangan aplikasi yang sedang dikerjakan Avwan.",
      ], evid: "Chat 20 Sep, 10:44 — rujukan file 'Draft Bab 3 CP 127 A'." },
      { tgl: "21 Sep 2026", judul: "Mengingatkan tenggat submission Proposal (Tugas 1)", isi: [
        "Mengonfirmasi format dan isi proposal yang diminta tutor pada minggu berikutnya.",
        "Menargetkan Bab I & II selesai pekan ini dari Sarifah agar Fadhil dapat melakukan formatting dan submit.",
      ], evid: "Chat 21 Sep, 09:15 — remider + foto format proposal." },
      { tgl: "22 Sep 2026", judul: "Mengunggah semua raw data untuk developer aplikasi", isi: [
        "Menyimpan seluruh data mentah (raw data) ke folder 'Bahan Capstone Project > Raw Data CP' di Drive.",
        "Menjaga ritme tim lewat reminder checklist & to-do list mingguan.",
      ], evid: "Chat 22 Sep, 09:43." },
      { tgl: "24 Sep 2026", judul: "Membuatkan flow data pengajuan barang untuk developer", isi: [
        "Menyusun dokumen alur data pengajuan barang sebagai panduan implementasi aplikasi.",
        "Mengkomunikasikan bahwa modul On-Hand & Critical Part jauh lebih sederhana dan menyusul.",
      ], evid: "Chat 24 Sep, 09:35." },
      { tgl: "25 Sep 2026", judul: "Review & koreksi Bab I–II dari Sarifah (5 catatan revisi)", isi: [
        "Meminta dicantumkan ilustrasi/maksud Why-Why Analysis pada Bab I.",
        "Menyesuaikan jadwal menjadi 8 minggu sesuai CP.",
        "Menghapus penulisan rentang waktu yang tidak cocok dengan jadwal kegiatan.",
        "Mengurangi penyebutan IoT & Blockchain agar fokus pada pengajuan barang digital + approval.",
        "Menyelaraskan poin pertanyaan penelitian dan tujuan penelitian.",
      ], evid: "Chat 25 Sep, 10:03–10:07 — umpan balik + 5 gambar anotasi." },
    ],
    langkah: [
      { tag: "Pemahaman Domain", judul: "Memindahkan pengetahuan sistem asli (Fonko Gemini / Apps Script & Spreadsheet) menjadi spesifikasi proyek", isi: "Fadhil menjelaskan sistem terdahulu yang bekerja di tempatnya — alur pengajuan, keterbatasan monitoring email, dan data friction-nya — sehingga seluruh anggota memahami latar belakang sesungguhnya, bukan sekadar ide di atas kertas." },
      { tag: "Analisis Bisnis", judul: "Menetapkan problem statement, akar masalah, dan tolok ukur keberhasilan", isi: "Merumuskan 2 akar masalah (pengajuan tidak lengkap + monitoring lemah; tidak adanya critical list terintegrasi) beserta target terukur: pengajuan tak terproses & pengadaan urgent < 10%, aksesibilitas 100% real-time." },
      { tag: "Spesifikasi Sistem", judul: "Menyusun flow, menu, dan hak akses setiap peran (RBAC)", isi: "Mendefinisikan 6 peran pengguna dan menu masing-masing, lengkap dengan alur pengajuan reguler/urgent dan alur preventive replenishment—menjadi kontrak implementasi antara analis, penyusun Bab III, dan developer." },
      { tag: "Data & Bahan", judul: "Menyuplai data mentah dan bukti terukur kepada tim", isi: "Menyediakan raw data, tautan Looker Studio, rekaman downtime EJO (305 menit), min-max stock report, dan flow data—bahan yang dipakai developer aplikasi dan penulis Bab IV." },
      { tag: "Koordinasi Tim", judul: "Menjaga ritme kerja dan pembagian tanggung jawab antar anggota", isi: "Membuat grup, polling, Google Drive, checklist mingguan, referensi kating, draf awal dokumen untuk masing-masing penulis, serta mengundang dan menempatkan anggota ke-5 (Wida) secara adil." },
      { tag: "Teknik Menulis", judul: "Menyusun kerangka laporan dan menggabungkan tulisan anggota", isi: "Menyiapkan draf laporan capstone (struktur resmi: sampul, halaman pengesahan, daftar isi, daftar istilah, Bab I–IV, lampiran berita acara), lalu bertindak sebagai editor & submitter pada tiap tuton." },
      { tag: "Quality Control", judul: "Mereview hasil tulisan anggota sebelum dikirim", isi: "Membaca setiap kiriman (mis. Bab I–II Sarifah pada 25 September) dan memberikan umpan balik teknis yang spesifik agar isi dokumen konsisten dengan jadwal 8 minggu dan fokus sistem sebenarnya." },
      { tag: "Dokumen Ilmiah", judul: "Menghasilkan karya tulis pendukung dari pengalaman teknisnya", isi: "Menulis proposal penelitian Metodologi (STSI4310) tentang RAD & arsitektur data terpusat, serta dua dokumen CI (2025 & 2026) yang menjadi fondasi data dan pembenaran ilmiah topik." },
    ],
    keterkaitan: [
      { fokus: "ke Avwan (developer)", isi: "Memberi draf 'Aps Script CP', raw data, dan flow data; menjawab pertanyaan fungsional agar aplikasi tepat gunanya." },
      { fokus: "ke Sarifah", isi: "Memberi daftar topik jurnal & kerangka, lalu mereview Bab I–II yang dikerjakan Sarifah." },
      { fokus: "ke Giren", isi: "Menyerahkan draf kerangka Bab III + diagram awal untuk dirapikan Giren, sekaligus memasok flow/RBAC agar diagramnya selaras." },
      { fokus: "ke Wida", isi: "Memberi outline materi (latar belakang dll.) untuk dasar pembuatan PPT & poster, dan menyetujui rencana tampil foto anggota." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Memaparkan sistem yang sudah ada (Fonko Gemini) kepada seluruh anggota; menjelaskan alur pengembangan ke website hosting serta kebutuhan data & fitur.", done: true, bukti: "Paparan 16 & 18 Sep di chat grup." },
      { minggu: "M1–M2", teks: "Menyiapkan infrastruktur tim: Google Drive, checklist mingguan, referensi kating, draf proposal/laporan, dan bahan teknis 'Aps Script CP'.", done: true, bukti: "Chat 15 Sep." },
      { minggu: "M3", teks: "Review dan validasi kesesuaian perancangan fitur & data pada Bab III.", done: false, sedang: true, bukti: "Draf Bab III sudah dibuatkan; tinggal harmonisasi dengan aplikasi." },
      { minggu: "M4", teks: "Draf Bab IV (Hasil & Analisis Dampak).", done: false, bukti: "Menunggu hasil pengujian aplikasi dari developer." },
      { minggu: "M5", teks: "Tulis Bab IV Laporan Kemajuan (Tugas 2).", done: false },
      { minggu: "M6", teks: "Finalisasi Bab IV Laporan Akhir.", done: false },
      { minggu: "M7", teks: "Konversi Bab IV ke seksi Teknis Karya Ilmiah.", done: false },
      { minggu: "M8", teks: "Evaluasi laporan teknis.", done: false },
    ],
  },

  {
    id: "sarifah",
    nama: "Sarifah",
    namaLengkap: "Sarifah Masian Intani",
    nim: "048923008",
    anggota: "Anggota 3",
    peran: "Literature Researcher & General Writer",
    warna: "#9a5b4f",
    tagline: "Peneliti pustaka & penulis umum — menyusun Bab I, II, V serta bertanggung jawab atas formatting dan pengunggahan dokumen.",
    ringkasan: [
      "Sarifah bertugas mengangkat landasan ilmiah: mencari 5–10 jurnal relevan, menyusun Bab I (Pendahuluan) dan Bab II (Kajian Pustaka & Landasan Teori), kemudian meneruskannya pada Bab V serta pengelolaan format dan unggahan dokumen.",
      "Hingga 25 September, ia telah mengunggah Bab I dan Bab II yang dilengkapi beberapa jurnal tambahan, dan sedang menyempurnakan hasil revisi atas catatan dari Fadhil.",
      "Pekerjaannya menjadi gerbang kelayakan Proposal: tanpa Bab I & II yang utuh, ketua kelompok tidak dapat melakukan formatting dan submission pada tenggat Tugas 1.",
    ],
    timeline: [
      { tgl: "17 Sep 2026", judul: "Bergabung aktif dalam sesi tanya-jawab kebutuhan sistem", isi: [
        "Merespons ajakan Fadhil agar anggota tidak sungkan bertanya (bukti kesiapan berpartisipasi).",
      ], evid: "Chat 17 Sep, 19:38 — balasan 'Oke'." },
      { tgl: "19 Sep 2026", judul: "Menerima daftar topik kajian pustaka & ditekankan penguncian pembagian Bab", isi: [
        "Menerima 9 topik pencarian jurnal dari Fadhil (5 ID, 4 EN) sebagai peta riset literatur.",
        "Terindikasi sebagai penanggung jawab Bab I & II dalam pembagian resmi (konfirmasi 20:36).",
      ], evid: "Chat 19 Sep, 20:35–20:37." },
      { tgl: "21 Sep 2026", judul: "Ditetapkan menjadi penentu kelancaran submit Proposal", isi: [
        "Fadhil menyampaikan harapan agar Bab I & II selesai pekan ini sehingga ia dapat melakukan formatting dan submit pada minggu berikutnya.",
      ], evid: "Chat 21 Sep, 09:15 — reminder tenggat Proposal." },
      { tgl: "25 Sep 2026 · 00:40", judul: "Mengunggah Bab I & II lengkap dengan tambahan jurnal", isi: [
        "Menyelesaikan draf Bab I (Pendahuluan) dan Bab II (Kajian Pustaka & Landasan Teori) dengan beberapa jurnal pendukung.",
        "Meminta review dan koreksi dari Fadhil atas kekeliruan atau ketidaksesuaian.",
      ], evid: "Chat 25 Sep, 12:40 — 'sudah upload, boleh bantu dicek dan dikoreksi'." },
      { tgl: "25 Sep 2026 · pagi", judul: "Menerima 5 catatan revisi dan menyiapkan penyempurnaan", isi: [
        "Review Fadhil: (1) cantumkan ilustrasi Why-Why Analysis; (2) jadwal dibuat 8 minggu; (3) hapus rentang waktu yang tidak cocok dengan jadwal; (4) fokus pada pengajuan barang digital & approval, hapus penyebutan IoT/Blockchain; (5) selaraskan pertanyaan & tujuan penelitian.",
      ], evid: "Chat 25 Sep, 10:03–10:07." },
    ],
    langkah: [
      { tag: "Riset Pustaka", judul: "Menelusuri jurnal 5 tahun terakhir sesuai daftar topik dari ketua kelompok", isi: "Mencari dan menyeleksi literatur dalam bahasa Indonesia & Inggris yang membahas pengadaan berbasis web, RAD, min-max stock, otomasi workflow, dan analisis downtime sebagai fondasi sains pada Bab II." },
      { tag: "Bab I", judul: "Menyusun Pendahuluan: latar belakang, rumusan masalah, tujuan SMART, manfaat, ruang lingkup, jadwal", isi: "Menulis Bab I berbasis problem statement Fadhil — termasuk data terukur downtime 305 menit dan target <10% — dalam format resmi proposal." },
      { tag: "Bab II", judul: "Menyusun Kajian Pustaka & Landasan Teori", isi: "Mensintesis referensi per pilar (sentralisasi data, digital form workflow, critical sparepart management, preventive maintenance) dengan tabel perbandingan dan keterkaitan tiap studi terhadap proyek." },
      { tag: "Pertanyaan & Hipotesis", judul: "Merumuskan pertanyaan penelitian dan hipotesis", isi: "Menyusun tiga pertanyaan dan tiga hipotesis (H1–H3) yang akan diuji pada Bab IV." },
      { tag: "Iterasi Review", judul: "Menyempurnakan isi berdasarkan umpan balik ketua kelompok", isi: "Merevisi Bab I & II sesuai catatan koreksi (why-why, jadwal 8 minggu, penghapusan rentang waktu & sebutan IoT/Blockchain, penyelarasan rumusan-tujuan)." },
      { tag: "Format & Submit", judul: "Melengkapi formatting dan pengunggahan dokumen resmi", isi: "Menjaga kerapian dokumen (Bab I, II, V, daftar pustaka) sebelum disatukan dan disubmit oleh ketua kelompok pada tiap tenggat tugas." },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima topik jurnal, kerangka dokumen, dan review; hasil tulisannya menjadi bahan format/submit Fadhil." },
      { fokus: "ke Giren", isi: "Landasan teori di Bab II saling melengkapi dengan metode & perancangan sistem di Bab III." },
      { fokus: "ke Wida", isi: "Konten proposal hasil tinjauan pustaka dipakai Wida sebagai sumber penyusunan PPT/poster." },
      { fokus: "ke Avwan (developer)", isi: "Definisi masalah & tujuan pada Bab I menjadi acuan arah pengembangan aplikasi." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Cari 5–10 referensi jurnal relevan berdasarkan materi yang sudah ada; susun Bab I & II.", done: true, bukti: "Bab I & II diunggah 25 Sep dengan tambahan jurnal." },
      { minggu: "M1–M2", teks: "Menerima & memetakan daftar topik kajian dari ketua kelompok.", done: true, bukti: "Topik diterima 19 Sep." },
      { minggu: "M3", teks: "Tulis Bab I & II, kembangkan jadwal kegiatan, lakukan formatting & submit Proposal.", done: false, sedang: true, bukti: "Isi Bab I–II selesai; menunggu finalisasi revisi + formatting oleh Fadhil." },
      { minggu: "M4", teks: "Revisi Bab I & II sesuai feedback tutor + kelola daftar pustaka.", done: false, bukti: "Revisi tahap pertama (catatan Fadhil 25 Sep) sedang dikerjakan." },
      { minggu: "M5", teks: "Tulis Bab I, II, V Laporan Kemajuan + formatting & submit.", done: false },
      { minggu: "M6", teks: "Finalisasi Bab I, II, V, VI Laporan Akhir.", done: false },
      { minggu: "M7", teks: "Konversi Bab I, II, V ke seksi Umum Karya Ilmiah + Berita Acara.", done: false },
      { minggu: "M8", teks: "Arsipkan dokumen final.", done: false },
    ],
  },

  {
    id: "wida",
    nama: "Wida",
    namaLengkap: "Ni Komang Widastri",
    nim: "050780858",
    anggota: "Anggota 4",
    peran: "Visual & Media Specialist",
    warna: "#6f5b93",
    tagline: "Spesialis visual & media (UI/UX Designer di pekerjaannya) — PPT, poster A4, skrip video demo, dan keaktifan forum.",
    ringkasan: [
      "Wida bergabung pada 17 September sebagai anggota kelima. Karena berprofesi UI/UX Designer, Fadhil menempatkan penanganan Bab III yang sarat diagram ke Giren dan mempercayakan sisi visual & media kepada Wida.",
      "Tanggung jawab utamanya: template PPT, poster A4, skrip & video demo aplikasi, serta keaktifan di forum diskusi. Ia juga turut membantu tata letak visual proposal.",
      "Sampai 25 September, ia belum lama bergabung dan baru memulai penjajakan (mis. keputusan pemakaian foto anggota di slide PPT) — output visualnya akan tampak pada M3–M7.",
    ],
    timeline: [
      { tgl: "17 Sep 2026 · 20:08", judul: "Bergabung ke grup sebagai anggota kelima", isi: [
        "Diundang oleh Fadhil; diperkenalkan sebagai UI/UX Designer yang turut memperkuat sisi desain tim.",
      ], evid: "Chat 17 Sep, 20:08 — 'added +62 857-3919-0436'." },
      { tgl: "17 Sep 2026 · 20:18", judul: "Perkenalan dan penyesuaian diri", isi: [
        "Menyapa seluruh anggota dan menyampaikan permintaan maaf karena baru bergabung.",
      ], evid: "Chat 17 Sep, 20:18 — 'Halo semua, Saya Wida...'." },
      { tgl: "19 Sep 2026", judul: "Menerima amanah memulai PPT & poster", isi: [
        "Fadhil mempersilakan Wida mulai 'nyicil' PPT dan poster; outline (latar belakang, dll.) tersedia di folder bahan.",
      ], evid: "Chat 19 Sep, 20:38." },
      { tgl: "24 Sep 2026", judul: "Menjajaki kelengkapan visual: foto anggota pada slide PPT", isi: [
        "Menanyakan kesediaan anggota menampilkan foto di slide anggota kelompok.",
        "Mendapat persetujuan dari Fadhil dan Avwan.",
      ], evid: "Chat 24 Sep, 21:10; konfirmasi 21:48 & 21:52." },
      { tgl: "M3–M7", judul: "Pekerjaan visual yang menanti (jadwal ke depan)", isi: [
        "Template PPT & poster (M1–M2), tata letak visual Proposal & forum M3 (M3), skrip video & draf Poster A4 (M4), 8–12 slide PPT Laporan Kemajuan (M5), rekaman video/suara anggota (M6), edit video YouTube + poster A4 + PPT final + upload (M7).",
      ], evid: "Berdasarkan checklist resmi tim." },
    ],
    langkah: [
      { tag: "Timeline Visual", judul: "Menyiapkan template PPT & poster sejak awal proyek", isi: "Membangun kerangka slide dan poster berbasis outline materi (latar belakang, tujuan, alur sistem) dari folder bahan, agar sejak awal tim sudah memiliki wajah visual yang konsisten." },
      { tag: "Tata Letak Proposal", judul: "Membantu tata letak visual Proposal (M3)", isi: "Menyumbang keahlian desain untuk kerapian dokumen proposal sebelum di-submit." },
      { tag: "Media Presentasi", judul: "Menyusun 8–12 slide PPT Laporan Kemajuan (M5) dan PPT final", isi: "Menurunkan isi laporan menjadi slide yang komunikatif sesuai kebutuhan tiap tugas." },
      { tag: "Poster A4", judul: "Merancang poster A4", isi: "Membuat satu halaman poster yang memuat latar belakang, solusi, alur sistem, dan hasil — diperkuat visualisasi data (mis. penurunan downtime/urgent)." },
      { tag: "Video", judul: "Skrip & editing video demo (M4–M7)", isi: "Menulis skrip demo aplikasi, mengumpulkan rekaman video/suara anggota, lalu mengediting dan mengunggah video presentasi ke YouTube." },
      { tag: "Forum", judul: "Menjaga keaktifan diskusi forum tuton", isi: "Berpartisipasi pada diskusi resmi (mis. M3) sebagai bagian penilaian aktivitas kelompok." },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima outline materi & persetujuan kebijakan visual (foto anggota); output videonya dilaporkan lewat checklist mingguan Fadhil." },
      { fokus: "ke Sarifah", isi: "Konten Bab I–II menjadi narasi utama slide & poster." },
      { fokus: "ke Giren", isi: "Diagram Bab III (DFD, flowchart, use case) dipakai sebagai bahan visual PPT/poster." },
      { fokus: "ke Avwan (developer)", isi: "Demo aplikasi direkam dari aplikasi yang dikembangkan Avwan; masukan UI/UX dari Wida dapat ikut menyempurnakan tampilan." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Siapkan template PPT & poster; buat diagram alur/arsitektur pengembangan website.", done: false, sedang: true, bukti: "Baru penjajakan (foto slide anggota, 24 Sep)." },
      { minggu: "M1–M2", teks: "Pahami outline materi (latar belakang, alur sistem) dari folder bahan.", done: true, bukti: "Instruksi 19 Sep." },
      { minggu: "M3", teks: "Bantu tata letak visual Proposal & aktif di forum diskusi M3.", done: false },
      { minggu: "M4", teks: "Susun skrip video & draf Poster A4.", done: false },
      { minggu: "M5", teks: "Susun 8–12 Slide PPT Laporan Kemajuan.", done: false },
      { minggu: "M6", teks: "Kumpulkan rekaman video/suara anggota 1–5.", done: false },
      { minggu: "M7", teks: "Edit Video YouTube, Poster A4, PPT Final, & upload.", done: false },
      { minggu: "M8", teks: "Pastikan link YouTube aktif.", done: false },
    ],
  },

  {
    id: "giren",
    nama: "Giren",
    namaLengkap: "Girenda Agung Rahman",
    nim: "051411226",
    anggota: "Anggota 5",
    peran: "System Analyst & Modeling Specialist",
    warna: "#4a6994",
    tagline: "Analis sistem & spesialis pemodelan — Bab III, DFD, flowchart, use case, dan activity diagram.",
    ringkasan: [
      "Giren bertanggung jawab atas Bab III (Metodologi & Perancangan Sistem) beserta seluruh diagram pemodelan: context diagram/DFD, flowchart, use case diagram, activity diagram, dan ERD.",
      "Ia bersikap proaktif sejak hari pertama dan fleksibel: menerima pergeseran tugas ketika anggota ke-5 bergabung, lalu mengambil alih penyusunan Bab III yang sebelumnya masuk bagian penugasan lain.",
      "Draft Bab III yang ia kembangkan mengikuti metode RAD + Continual Improvement (CI), dan rancangan sistemnya diselaraskan dengan fitur aplikasi web yang sedang dibangun developer.",
    ],
    timeline: [
      { tgl: "15 Sep 2026", judul: "Kontribusi perdana: antusias dan terbuka terhadap ide", isi: [
        "Menyatakan siap dan mengajak anggota berbagi ide untuk didiskusikan bersama — salah satu nada paling awal dan terbuka di grup.",
        "Ikut serta dalam polling jadwal diskusi (menjadi peserta pemungutan suara terakhir yang ditunggu ketua).",
      ], evid: "Chat 15 Sep, 11:57 & 13:13." },
      { tgl: "17 Sep 2026", judul: "Menyetujui pergeseran tugas ke Bab III", isi: [
        "Saat Wida bergabung sebagai UI/UX Designer, Fadhil mengusulkan agar penyusunan Bab III (yang memuat banyak diagram) berpindah ke Giren.",
        "Menjawab 'Bebas ka atur aja' — menerima tanpa keberatan demi kelancaran tim.",
      ], evid: "Chat 17 Sep, 21:36." },
      { tgl: "20 Sep 2026", judul: "Menerima kerangka Bab III + diagram awal dan arahan penyempurnaan", isi: [
        "Fadhil menyerahkan draf 'kasar' Bab III beserta diagram awal (file 'Draft Bab 3 CP 127 A').",
        "Instruksi: rapikan dengan Visio/DrawIO dan selaraskan tentatif dengan pengembangan aplikasi oleh Avwan.",
      ], evid: "Chat 20 Sep, 10:44." },
      { tgl: "Ongoing M1–M2", judul: "Mengembangkan Draft Bab III yang selaras dengan aplikasi aktual", isi: [
        "Struktur Bab III yang dikerjakan mengikuti kebutuhan fungsional & non-fungsional nyata (RBAC, approval berjenjang, On-Hand Stock, integrasi Looker Studio).",
      ], evid: "Draf 'Draft_Bab_3_CP_127_A.docx' di folder Bahan Capstone Project." },
    ],
    langkah: [
      { tag: "Metodologi", judul: "Menetapkan pendekatan Mixed Methods + RAD + Continual Improvement", isi: "Menggabungkan kualitatif (observasi, wawancara, FGD) dan kuantitatif (pengukuran target: 100% aksesibilitas, <10% urgent) dalam kerangka pengembangan RAD empat fase (requirements planning, user design, construction, cutover)." },
      { tag: "Subjek & Data", judul: "Menentukan subjek penelitian (6 role) & teknik pengumpulan data", isi: "Teknik Purposive Sampling pada 6 peranan (Engineering Manager, SPV 1, SPV 2, Engineering Officer, 10 Teknisi Lini Steril, Administrator) dengan 4 teknik: observasi lapangan, wawancara/FGD, studi dokumentasi (log EJO 305 menit), dan kuesioner dikotomis/Likert." },
      { tag: "Analisis Data", judul: "Menyusun teknik analisis: why-why & fishbone, min-max, content analysis, statistik komparatif", isi: "Menghubungkan metode analisis dengan bukti lapangan (log downtime, min-max stock, transkrip wawancara) sebagai bekal Bab IV." },
      { tag: "Perancangan Arsitektur", judul: "Membuat DFD level 0 (context diagram) & level 1", isi: "Memetakan 4 proses inti: Kelola Master Stok & Critical Part, Pengajuan Form BQ, Verifikasi & Approval Multi-Tier, dan Monitoring & Reporting." },
      { tag: "Pemodelan UML", judul: "Menyusun flowchart system, use case diagram, dan activity diagram", isi: "Melengkapi alur pengajuan BQ & verification loop, alur preventive replenishment critical part, aktor-aktor sistem, serta aktivitas pengadaan (draf sesuai referensi CI 2025–2026)." },
      { tag: "Perancangan Data", judul: "Merancang ERD & spesifikasi tabel", isi: "Tabel inti: USERS (role + bq_link), FORM_BQ (status approval), DETAIL_BQ (spesifikasi wajib), STOCK_GUDANG_CRITICAL (min-max, lokator), APPROVAL_LOG (jejak audit)." },
      { tag: "Pengujian & Implementasi", judul: "Merencanakan Black Box, UAT, migrasi data, dan go-live", isi: "Skenario uji validasi input, autentikasi RBAC, routing email approval, dan filter pencarian stok; lalu tahap migrasi data, penerbitan kredensial, sosialisasi SOP, dan go-live." },
      { tag: "Keselarasan Produk", judul: "Menyelaraskan diagram dengan aplikasi yang dikembangkan", isi: "Menyesuaikan rancangan antarmuka (halaman login, dashboard RBAC, BQ personal, on-hand search, critical part, monthly report) dengan hasil nyata pengembangan oleh Avwan." },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima kerangka & diagram awal Bab III dari Fadhil; berkoordinasi soal flow/RBAC." },
      { fokus: "ke Avwan (developer)", isi: "Diagram & perancangan sistem diselaraskan dengan menu dan fitur aplikasi aktual." },
      { fokus: "ke Sarifah", isi: "Landasan teori (Bab II) dipakai sebagai dasar istilah/metode yang dirinci di Bab III." },
      { fokus: "ke Wida", isi: "Output diagram (use case, flowchart) menjadi bahan visual PPT/poster dan video demo." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Pelajari alur sistem untuk persiapan penyusunan metodologi perancangan & pemodelan diagram (DFD, flowchart, use case).", done: true, bukti: "Aktif di grup sejak 15 Sep; menerima babak desain 20 Sep." },
      { minggu: "M1–M2", teks: "Menyetujui & mengambil alih penyusunan Bab III (uses reshuffle pembagian tugas).", done: true, bukti: "Konfirmasi 17 Sep 'Bebas ka atur aja'." },
      { minggu: "M3", teks: "Menyusun Bab III Proposal (Metodologi & Perancangan Sistem: DFD, Flowchart, Use Case, Activity Diagram).", done: false, sedang: true, bukti: "Draf lengkap tersusun; harmonisasi + perapian diagram ongoing." },
      { minggu: "M4", teks: "Revisi Bab III & pemodelan diagram sesuai umpan balik tutor.", done: false },
      { minggu: "M5", teks: "Tulis Bab III Laporan Kemajuan (Pembaruan Perancangan & Pemodelan Sistem).", done: false },
      { minggu: "M6", teks: "Finalisasi Bab III Laporan Akhir & penyempurnaan seluruh diagram perancangan.", done: false },
      { minggu: "M7", teks: "Konversi Bab III ke seksi Metodologi Karya Ilmiah & integrasi diagram.", done: false },
      { minggu: "M8", teks: "Evaluasi kesesuaian dokumen metodologi & pemodelan final.", done: false },
    ],
  },
];

/* ---------------------------------- render helpers ---------------------------------- */

const $app = document.getElementById("app");
const $nav = document.getElementById("nav");
let current = "home";
const savedChecks = JSON.parse(localStorage.getItem("ck_a127") || "{}");

function svgDot() { return ""; }

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderNav() {
  const homeBtn = `<button class="${current === "home" ? "active" : ""}" data-slug="home"><span class="dot"></span>Beranda &amp; Konteks Grup</button>`;
  const btns = MEMBERS.map((m) => {
    const active = current === m.id;
    return `<button class="${active ? "active" : ""}" data-slug="${m.id}" style="--ac:${m.warna}"><span class="dot"></span>${esc(m.nama)}</button>`;
  }).join("");
  $nav.innerHTML = homeBtn + btns;
  $nav.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => navigate(b.dataset.slug))
  );
}

function navigate(slug) {
  current = slug;
  renderNav();
  window.scrollTo({ top: 0 });
  $app.innerHTML = slug === "home" ? renderHome() : renderMember(MEMBERS.find((m) => m.id === slug));
  document.title = slug === "home"
    ? "Catatan Kerja Anggota · Capstone Kelompok A 127"
    : `${MEMBERS.find((m) => m.id === slug).nama} · Kelompok A 127`;
}

function checkboxState(key) {
  if (key in savedChecks) return savedChecks[key];
  return null;
}

function bindChecks(scope) {
  scope.querySelectorAll("[data-ck]").forEach((cb) => {
    cb.addEventListener("change", () => {
      const key = cb.dataset.ck;
      const val = cb.checked;
      savedChecks[key] = val;
      localStorage.setItem("ck_a127", JSON.stringify(savedChecks));
      const item = cb.closest(".ck-item");
      item.classList.toggle("done", val);
      const fill = document.getElementById("pfill-" + cb.dataset.group);
      const label = document.getElementById("plabel-" + cb.dataset.group);
      if (fill && label) updateProgress(cb.dataset.group, fill, label);
    });
  });
}

function updateProgress(group, fill, label) {
  const boxes = Array.from(document.querySelectorAll('[data-group="' + group + '"]'));
  const checked = boxes.filter((b) => checkboxState(b.dataset.ck) === true).length;
  const pct = boxes.length ? Math.round((checked / boxes.length) * 100) : 0;
  fill.style.width = pct + "%";
  label.textContent = checked + " dari " + boxes.length + " item tuntas (" + pct + "%)";
}

/* ---------------------------------- Home ---------------------------------- */

function renderHome() {
  const cards = MEMBERS.map((m) => `
    <article class="member-card" style="--ac:${m.warna}" data-go="${m.id}">
      <div style="display:flex;align-items:center;gap:10px;">
        <div>
          <span class="member-role">${esc(m.peran)}</span>
        </div>
      </div>
      <h3>${esc(m.namaLengkap)}</h3>
      <div class="nim">${esc(m.nama)} · NIM ${m.nim}</div>
      <p class="desc">${esc(m.tagline)}</p>
    </article>`).join("");

  const html = `
    <div class="hero">
      <p class="page-kicker">Catatan Kontribusi Anggota</p>
      <h1>Kelompok A 127 — Capstone Project</h1>
      <p class="lead">${esc(PROJEK.judul)}</p>
      <div class="tags" style="margin-top:14px;">
        <span class="tag">${esc(PROJEK.matkul)}</span>
        <span class="tag">${esc(PROJEK.universitas)}</span>
        <span class="tag">Bimbingan ${esc(PROJEK.pembimbing)}</span>
        <span class="tag">${esc(PROJEK.periode)}</span>
      </div>
    </div>

    <div class="section">
      <h2>Status &amp; konteks proyek</h2>
      <p class="lead">${esc(PROJEK.status)}</p>
      <ul class="crosslist" style="font-size:15px;color:var(--ink-soft);padding-left:22px;">
        ${PROJEK.lingkupTitik.map((t) => `<li>${esc(t)}</li>`).join("")}
      </ul>
      <p class="small muted" style="margin-top:16px;">Halaman ini menyajikan peran, bukti kerja di grup, langkah demi langkah kontribusi, serta checklist mingguan tiap anggota (sesuai dokumen <em>Rencana Kerja Mingguan</em> kelompok). Klik nama anggota di menu sebelah kiri untuk membuka halamannya.</p>
    </div>

    <div class="section">
      <h2>Anggota yang dianalisis</h2>
      <p class="muted">Empat anggota selain developer aplikasi, dengan uraian kontribusi dari awal proyek hingga kini.</p>
      <div class="member-cards">${cards}</div>
    </div>

    <div class="section">
      <h2>Garis waktu kelompok (ringkas)</h2>
      <div class="timeline" style="--ac:#26241f;">
        <div class="t-item"><div class="t-date">15 Sep 2026</div><div class="t-title">Grup dibentuk</div><div class="t-body">Fadhil membuat grup, polling jadwal, Google Meet perdana, dan Google Drive tim.</div></div>
        <div class="t-item"><div class="t-date">16–18 Sep 2026</div><div class="t-title">Penyamaan pemahaman</div><div class="t-body">Paparan problem statement (Why-Why), flow sistem &amp; RBAC semua peran.</div></div>
        <div class="t-item"><div class="t-date">17 Sep 2026</div><div class="t-title">Tim lengkap</div><div class="t-body">Wida bergabung; Giren mengambil alih Bab III; pembagian tugas dikunci.</div></div>
        <div class="t-item"><div class="t-date">19–20 Sep 2026</div><div class="t-title">Materi disiapkan</div><div class="t-body">Sarifah mendapat topik jurnal; Giren menerima draf Bab III &amp; diagram awal; Wida mulai PPT/poster.</div></div>
        <div class="t-item"><div class="t-date">21–24 Sep 2026</div><div class="t-title">Data &amp; bahan teknis</div><div class="t-body">Reminder submit proposal; raw data &amp; flow data untuk aplikasi diunggah ke Drive.</div></div>
        <div class="t-item"><div class="t-date">25 Sep 2026</div><div class="t-title">Bab I–II masuk</div><div class="t-body">Sarifah mengunggah Bab I–II; Fadhil memberi 5 catatan revisi; menuju submit Proposal di M3.</div></div>
      </div>
    </div>`;

  const scope = document.createElement("div");
  scope.innerHTML = html;
  scope.querySelectorAll("[data-go]").forEach((c) => c.addEventListener("click", () => navigate(c.dataset.go)));
  return scope.innerHTML;
}

/* ---------------------------------- Member page ---------------------------------- */

function renderMember(m) {
  const activeCount = m.checklist.filter((c) => c.done || checkboxState(itemKey(m, c)) === true).length;

  const timeline = m.timeline.map((t) => `
    <div class="t-item">
      <div class="t-date">${esc(t.tgl)}</div>
      <div class="t-title">${esc(t.judul)}</div>
      <div class="t-body">
        <ul>${t.isi.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        ${t.evid ? `<div class="evidence"> Bukti: ${esc(t.evid)}</div>` : ""}
      </div>
    </div>`).join("");

  const langkah = m.langkah.map((s, i) => `
    <div class="step">
      <div class="step-num">${i + 1}</div>
      <div>
        <div class="step-tag">${esc(s.tag)}</div>
        <h4>${esc(s.judul)}</h4>
        <p>${esc(s.isi)}</p>
      </div>
    </div>`).join("");

  const checklist = m.checklist.map((c, i) => {
    const key = itemKey(m, c);
    const checked = c.done || checkboxState(key) === true;
    return `
    <label class="ck-item ${checked ? "done" : ""}">
      <input type="checkbox" data-ck="${key}" data-group="${m.id}" ${checked ? "checked" : ""} />
      <div class="ck-main">
        <div class="ck-meta">
          <span class="ck-minggu">${esc(c.minggu)}</span>
          ${c.bukti ? `<span class="ck-verified">terverifikasi · ${esc(c.bukti)}</span>` : ""}
        </div>
        <div class="ck-text">${esc(c.teks)}</div>
      </div>
    </label>`;
  }).join("");

  const keterkaitan = m.keterkaitan.map((k) => `
    <li><b>${esc(k.fokus)}:</b> ${esc(k.isi)}</li>`).join("");

  const html = `
    <button class="backlink" data-go="home">← Kembali ke Beranda</button>

    <p class="page-kicker" style="color:${m.warna};">${esc(m.anggota)} · ${m.nim ? "NIM " + esc(m.nim) : ""}</p>
    <h1>${esc(m.namaLengkap)}</h1>
    <p class="lead" style="margin-top:10px;">${esc(m.peran)}</p>
    <div class="tags" style="margin-top:6px;">
      <span class="tag" style="border-color:${m.warna}33;color:${m.warna};">${esc(m.nama)}</span>
      <span class="tag">${esc(m.tagline.split("—")[0].trim())}</span>
    </div>

    <div class="section">
      <h2>Ringkasan peran</h2>
      ${m.ringkasan.map((p) => `<p>${esc(p)}</p>`).join("")}
    </div>

    <div class="section">
      <h2>Catatan kerja di grup (berurutan)</h2>
      <div class="timeline" style="--ac:${m.warna};">${timeline}</div>
    </div>

    <div class="section">
      <h2>Kontribusi langkah demi langkah</h2>
      <p class="muted">Rincian tahapan kontribusi anggota ini dari awal hingga akhir proyek.</p>
      <div class="steps">${langkah}</div>
    </div>

    <div class="section">
      <h2>Checklist mingguan (M1–M8)</h2>
      <div class="card">
        <div class="ck-header">
          <div class="ck-progress">
            <div class="pbar"><div class="pfill" id="pfill-${m.id}"></div></div>
            <div class="plabel" id="plabel-${m.id}">${activeCount} dari ${m.checklist.length} item tuntas</div>
          </div>
          <button class="backlink" data-reset="${m.id}" style="margin:0;">Reset</button>
        </div>
        ${checklist}
      </div>
      <p class="small muted" style="margin-top:10px;">Centang dapat diubah untuk mencatat perkembangan; status tersimpan di perangkat ini. Tanda <strong>terverifikasi</strong> berarti telah terlihat pengerjaannya di chat atau dokumen tim per 25 Sep 2026.</p>
    </div>

    <div class="section">
      <h2>Keterkaitan pekerjaan dengan anggota lain</h2>
      <ul class="crosslist" style="font-size:15px;color:var(--ink-soft);padding-left:22px;">
        ${keterkaitan}
      </ul>
    </div>`;

  const scope = document.createElement("div");
  scope.innerHTML = html;
  scope.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => navigate(el.dataset.go)));
  const reset = scope.querySelector("[data-reset]");
  if (reset) reset.addEventListener("click", () => {
    m.checklist.forEach((c) => { delete savedChecks[itemKey(m, c)]; });
    localStorage.setItem("ck_a127", JSON.stringify(savedChecks));
    $app.innerHTML = renderMember(m);
    bindChecks($app);
    updateProgress(m.id, document.getElementById("pfill-" + m.id), document.getElementById("plabel-" + m.id));
  });
  bindChecks(scope);
  updateProgress(m.id, document.getElementById("pfill-" + m.id), document.getElementById("plabel-" + m.id));
  return scope.innerHTML;
}

function itemKey(m, c) {
  return m.id + "|" + c.minggu + "|" + c.teks.slice(0, 40);
}

/* ---------------------------------- init ---------------------------------- */
navigate("home");