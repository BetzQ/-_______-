/* ============================================================
   Catatan Kerja Anggota — Capstone Kelompok A 127 (STSI4401)
   Analisa per anggota: kerangka kerja lengkap dari awal sampai
   selesai. Disusun dari arsip chat grup (obrolan chat), dokumen
   resmi (checklist & to-do list), dan dokumen hasil kerja tim.
   Per tanggal 25 September 2026 (minggu ke-2 / M1–M2).
   ============================================================ */

const PROJEK = {
  judul: "Pengembangan Micropage Dashboard Terintegrasi melalui Formulir Pengajuan Barang Digital, Critical Sparepart List, dan Monthly Report di Departemen Engineering PT Fonko International Pharmaceuticals (Lini Steril)",
  matkul: "Capstone Project — STSI4401",
  universitas: "Program Studi Sistem Informasi, Fakultas Sains dan Teknologi, Universitas Terbuka",
  pembimbing: "Purwanto, S.Kom., M.Kom",
  periode: "Jadwal 8 minggu (M1–M8), dimulai 15 September 2026",
  status: "Sedang berjalan — kini berada di M1–M2, menuju penyusunan dan submit Proposal (Tugas 1) pada M3.",
  lingkupTitik: [
    "Latar belakang masalah: pengajuan barang manual yang sering tidak lengkap (spesifikasi, merek, qty), monitoring berbasis email yang lemah, dan belum ada Critical Sparepart List terintegrasi.",
    "Bukti terukur yang dipakai tim: akumulasi downtime mesin Cartoning Marchesini 305 menit (± 5,08 jam) dari enam dokumen EJO, sebagai dasar kebutuhan sistem.",
    "Sistem sasaran: Formulir Pengajuan Barang Digital (BQ) + alur approval berjenjang (SPV/Officer/Manager), dasbor monitoring real-time, modul Critical Sparepart List dengan On-Hand Stock, dan Monthly Report (Looker Studio).",
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
    avatar: "FH",
    kondisi: "Sudah aktif sejak hari pertama; pekerjaan utamanya (sampai 25 Sep) tuntas untuk tahap penyamaan pemahaman, tinggal menuntaskan formatting & submit Proposal di M3.",
    tagline: "Inisiator ide sekaligus pemegang pengetahuan sistem (Fonko Gemini / CI) — yang menyiapkan panggung tim dan menyatukan seluruh tulisan menjadi laporan resmi.",
    ringkasan: [
      "Fadhil adalah sumber utama ide dan pengetahuan sistem. Topik proyek lahir dari dua proyek perbaikan nyata (Continual Improvement) yang pernah ia kerjakan selaku Sparepart Technician di Departemen Engineering PT Fonko, yaitu proyek pertama pada 2025 dan proyek kedua periode Januari–Agustus 2026.",
      "Perannya di kelompok: menerangkan sistem yang sudah ada (Fonko Gemini berbasis Apps Script & Spreadsheet), memandu alur pengembangan website, mendefinisikan kebutuhan data dan fitur wajib, lalu menampung seluruh tulisan anggota dan menyatukannya menjadi laporan resmi (formatting & submit).",
      "Ia juga berperan sebagai fasilitator: membangun grup, mengatur jadwal diskusi, menyiapkan Google Drive, membagi tugas, mengundang anggota, menyerahkan kerangka dokumen ke setiap penulis, dan memberi umpan balik teknis pada hasil kerja anggota.",
    ],
    fase: [
      {
        judul: "Membangun panggung tim",
        rentang: "M1–M2",
        desc: "Langkah-langkah kecil seorang pemimpin proyek dari nol: membentuk grup sampai membagi tugas.",
        langkah: [
          { k: "Membentuk grup WhatsApp Capstone", a: "Buat grup baru, undang seluruh calon anggota satu per satu, lalu kirim pesan pembuka: mengingatkan jadwal Tuweb sesi 1 dan mengajak semua menentukan topik paling lambat Kamis." },
          { k: "Menggelar polling jadwal diskusi", a: "Buat polling pilihan waktu diskusi perdana (malam ini / besok / Kamis), beri batas waktu voting, lalu ingatkan anggota yang belum memilih sampai semua ikut." },
          { k: "Menyelenggarakan Google Meet perdana", a: "Buat link Meet, bagikan ke grup, pastikan kehadiran semua anggota, dan tegaskan bahwa isi pertemuan dicatat untuk lampiran berita acara laporan CP." },
          { k: "Menyiapkan Google Drive tim", a: "Buat folder Drive yang rapi: checklist & to-do list mingguan, folder referensi (contoh CP kating), dan folder bahan pendukung, lalu bagikan tautannya ke seluruh anggota." },
          { k: "Menyiapkan kerangka dokumen awal", a: "Buat draf 'kasar' proposal capstone dan draf laporan capstone sebagai kerangka yang akan dikembangkan penulis; buat dokumen 'Aps Script CP' berisi tautan aplikasi dan source code untuk developer." },
          { k: "Membagi tanggung jawab perdana", a: "Sebarkan tugas awal: penulis melengkapi jurnal, developer mempelajari bahan teknis, dan anggota lain meninjau bahan untuk PPT/poster — sambil mempertegas bahwa progres dicentang di checklist Drive." },
        ],
      },
      {
        judul: "Menyamakan pemahaman seluruh tim",
        rentang: "M1–M2",
        desc: "Langkah seorang business analyst yang memastikan setiap anggota melihat masalah dan sistem dari sudut yang sama.",
        langkah: [
          { k: "Memaparkan problem statement resmi", a: "Jelaskan di grup: sparepart sering tidak tersedia saat dibutuhkan; uraikan dua akar masalah dari Why-Why Analysis (pengajuan tidak lengkap + monitoring lemah; belum ada critical sparepart list) beserta solusi dan target sistemnya." },
          { k: "Menawarkan dukungan data", a: "Umumkan bahwa semua data pendukung (raw data, contoh report, log) bisa diminta kapan saja, terutama untuk kebutuhan developer aplikasi." },
          { k: "Melengkapi tim dan menata ulang tugas", a: "Undang anggota yang belum masuk (Wida), kenalkan kelebihannya (UI/UX Designer), lalu ajukan penyesuaian pembagian tugas: Bab III yang sarat diagram dialihkan ke Giren, dan mintalah persetujuan anggota yang bersangkutan." },
          { k: "Menjawab pertanyaan kebutuhan fungsional", a: "Jawab satu per satu pertanyaan developer: format Monthly Report (ada contoh + link Looker), pemakaian status Normal/Urgent, siapa saja yang boleh approval (SPV1, SPV2, Officer), pemakaian PR Summary, dan status Jenis Jasa." },
          { k: "Mendokumentasikan flow & hak akses (RBAC)", a: "Tuliskan menu setiap peran pengguna (Teknisi, Officer, SPV1, SPV2, Manager, Administrator), alur pengajuan barang reguler/urgent, dan alur preventive replenishment critical part — sebagai kontrak bersama antara analis, penulis Bab III, dan developer." },
          { k: "Memberi peta literatur ke penulis", a: "Susun daftar topik pencarian jurnal (bahasa Indonesia dan Inggris) dan serahkan ke penulis Bab I-II; kunci pembagian Bab agar tidak tumpang tindih." },
          { k: "Menyerahkan kerangka Bab III + diagram awal", a: "Siapkan draf kerangka Bab III dan diagram awal, serahkan ke penyusun Bab III, lengkap dengan arahan: rapikan pakai Visio/DrawIO dan selaraskan dengan aplikasi yang tengah dikembangkan." },
          { k: "Menyuplai data mentah & flow data", a: "Unggah seluruh raw data ke Drive (folder Raw Data CP) untuk developer; buat dokumen flow data pengajuan barang, dan janjikan flow modul stok/critical part yang lebih sederhana menyusul." },
          { k: "Mereview hasil tulisan anggota", a: "Baca kiriman penulis (Bab I–II), beri penilaian singkat yang menumbuhkan semangat, lalu beri catatan koreksi yang spesifik (contoh: cantumkan ilustrasi Why-Why, buat jadwal 8 minggu, hapus sebutan IoT/Blockchain, samakan pertanyaan & tujuan penelitian)." },
        ],
      },
      {
        judul: "Tugas 1 — Mengantarkan Proposal",
        rentang: "M3",
        desc: "Menjadi editor, penyusun format, dan submitter dokumen resmi pertama kelompok.",
        langkah: [
          { k: "Menggabungkan seluruh bagian proposal", a: "Rangkai Bab I–II dari penulis, Bab III dari penyusun sistem, daftar pustaka, dan jadwal kegiatan menjadi satu dokumen utuh." },
          { k: "Memvalidasi kesesuaian fitur & data pada Bab III", a: "Periksa bahwa perancangan dan diagram di Bab III benar-benar cocok dengan fitur serta data yang sudah ditetapkan (flow & RBAC), sebelum dikirim." },
          { k: "Melakukan formatting resmi", a: "Rapikan sampul, halaman pengesahan, daftar isi, daftar tabel/gambar, dan penomoran sesuai pedoman UT." },
          { k: "Submit Proposal sebagai Tugas 1", a: "Unggah proposal sesuai ketentuan tuton pada pekan M3 dan umumkan ke anggota." },
        ],
      },
      {
        judul: "Pengujian & draf hasil",
        rentang: "M4",
        desc: "Menjembatani produk aplikasi menjadi bab analisis.",
        langkah: [
          { k: "Mengumpulkan data & foto hasil produk", a: "Minta developer menyediakan tangkapan layar dan data hasil pengujian aplikasi untuk dijadikan bahan tulisan." },
          { k: "Menyusun Draf Bab IV", a: "Tulis Bab IV berisi hasil pengembangan, hasil uji (misal black box), dan analisis dampaknya terhadap downtime/efisiensi." },
        ],
      },
      {
        judul: "Tugas 2 — Laporan Kemajuan",
        rentang: "M5",
        desc: "Merangkai kemajuan proyek menjadi laporan resmi kedua.",
        langkah: [
          { k: "Menulis Bab IV Laporan Kemajuan", a: "Perbarui hasil pengembangan dan uji sampai pekan M5 ke dalam Bab IV." },
          { k: "Menyatukan dan formatting", a: "Rangkai Bab I–V dari semua anggota sesuai pembagian, rapikan format, lalu submit sebagai Tugas 2." },
        ],
      },
      {
        judul: "Finalisasi laporan akhir",
        rentang: "M6",
        desc: "Menutup bagian teknis laporan utama.",
        langkah: [
          { k: "Finalisasi Bab IV", a: "Sempurnakan Bab IV Laporan Akhir dengan data nilai yang sudah final." },
        ],
      },
      {
        judul: "Karya ilmiah & presentasi",
        rentang: "M7",
        desc: "Mengubah bagian laporan menjadi artikel ilmiah.",
        langkah: [
          { k: "Konversi Bab IV ke seksi Teknis Karya Ilmiah", a: "Sesuaikan isi Bab IV dengan format artikel ilmiah (bagian teknis), siap untuk digabung dengan seksi lainnya." },
        ],
      },
      {
        judul: "Penutup & evaluasi",
        rentang: "M8",
        desc: "Memastikan seluruh laporan teknis sah dan lengkap.",
        langkah: [
          { k: "Evaluasi laporan teknis", a: "Tinjau ulang kelengkapan Bab IV beserta lampiran (surat pernyataan, berita acara, log kegiatan) sebelum pengumpulan akhir." },
        ],
      },
    ],
    bukti: [
      { tgl: "15 Sep · 09:02", judul: "Membuat grup & memulai agenda tuweb", isi: "Pengingat Tuweb sesi 1; target menentukan topik sebelum Kamis." },
      { tgl: "15 Sep · 20:46", judul: "Menyiapkan Google Drive + kerangka dokumen", isi: "Checklist mingguan, referensi kating, draf proposal/laporan, dan dokumen 'Aps Script CP' untuk developer." },
      { tgl: "16 Sep · 09:14", judul: "Paparan problem statement & Why-Why", isi: "Dua akar masalah + solusi, dan inti sistem sasaran; menawarkan data ke developer." },
      { tgl: "17 Sep · 17:09", judul: "Menjawab 5 pertanyaan fungsional", isi: "Monthly Report (link Looker), Normal/Urgent, approval SPV, PR Summary, Jenis Jasa." },
      { tgl: "17 Sep · 20:12", judul: "Mengundang Wida & mengusulkan reshuffle Bab III", isi: "Giren diminta menyusun Bab III; Giren menyetujui." },
      { tgl: "18 Sep · 09:06", judul: "Flow & RBAC semua peran", isi: "Menu, hak akses, alur pengajuan reguler/urgent, dan alur critical part." },
      { tgl: "19 Sep · 20:35", judul: "Peta literatur + penguncian pembagian bab", isi: "9 topik jurnal (ID/EN) untuk penulis; penguncian Bab I-II, III, PPT/poster." },
      { tgl: "20 Sep · 10:44", judul: "Kerangka Bab III + diagram awal", isi: "Diserahkan ke Giren untuk dirapikan (Visio/DrawIO) dan diselaraskan dengan aplikasi." },
      { tgl: "21 Sep · 09:15", judul: "Reminder tenggat submit Proposal", isi: "Menargetkan Bab I-II selesai agar bisa di-format dan di-submit." },
      { tgl: "22 Sep · 09:43", judul: "Upload raw data untuk developer", isi: "Folder 'Raw Data CP' di Drive + reminder checklist." },
      { tgl: "24 Sep · 09:35", judul: "Flow data pengajuan barang", isi: "Panduan alur data untuk implementasi aplikasi; modul stok menyusul." },
      { tgl: "25 Sep · 10:03", judul: "Review Bab I–II: 5 catatan revisi", isi: "Why-why, jadwal 8 minggu, hapus rentang waktu, hapus IoT/Blockchain, samakan pertanyaan-tujuan." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Bentuk grup, atur jadwal diskusi, siapkan Google Drive + checklist mingguan.", done: true, bukti: "15 Sep" },
      { minggu: "M1–M2", teks: "Siapkan draf proposal/laporan dan dokumen Aps Script CP sebagai kerangka.", done: true, bukti: "15 Sep" },
      { minggu: "M1–M2", teks: "Paparkan problem statement, Why-Why, dan inti sistem kepada seluruh anggota.", done: true, bukti: "16 Sep" },
      { minggu: "M1–M2", teks: "Jawab pertanyaan kebutuhan fungsional developer (monthly report, urgent, approval, PR Summary, jasa).", done: true, bukti: "17 Sep" },
      { minggu: "M1–M2", teks: "Lengkapi tim (Wida) dan susun ulang pembagian tugas (Giren → Bab III).", done: true, bukti: "17 Sep" },
      { minggu: "M1–M2", teks: "Dokumentasikan flow & RBAC semua peran pengguna.", done: true, bukti: "18 Sep" },
      { minggu: "M1–M2", teks: "Berikan peta literatur ke penulis & kunci pembagian bab.", done: true, bukti: "19 Sep" },
      { minggu: "M1–M2", teks: "Serahkan kerangka Bab III + diagram awal.", done: true, bukti: "20 Sep" },
      { minggu: "M1–M2", teks: "Unggah raw data + buat flow data untuk developer.", done: true, bukti: "22–24 Sep" },
      { minggu: "M1–M2", teks: "Review Bab I–II penulis dan beri catatan revisi.", done: true, bukti: "25 Sep" },
      { minggu: "M3", teks: "Gabungkan semua bagian + validasi Bab III sesuai fitur & data.", done: false, sedang: true },
      { minggu: "M3", teks: "Formatting resmi (sampul, pengesahan, daftar isi) & submit Proposal.", done: false },
      { minggu: "M4", teks: "Kumpulkan data/foto hasil produk dari developer.", done: false },
      { minggu: "M4", teks: "Draf Bab IV (Hasil & Analisis Dampak).", done: false },
      { minggu: "M5", teks: "Tulis Bab IV Laporan Kemajuan + gabungkan & formatting seluruh bab.", done: false },
      { minggu: "M6", teks: "Finalisasi Bab IV Laporan Akhir.", done: false },
      { minggu: "M7", teks: "Konversi Bab IV ke seksi Teknis Karya Ilmiah.", done: false },
      { minggu: "M8", teks: "Evaluasi laporan teknis & kelengkapan lampiran.", done: false },
    ],
    keterkaitan: [
      { fokus: "ke Avwan (developer)", isi: "Memberi draf 'Aps Script CP', raw data, dan flow data; menjawab pertanyaan fungsional agar aplikasi tepat guna, lalu meminta data hasil untuk Bab IV." },
      { fokus: "ke Sarifah", isi: "Memberi peta topik jurnal & kerangka dokumen; mereview Bab I–II yang dikerjakan Sarifah." },
      { fokus: "ke Giren", isi: "Menyerahkan kerangka Bab III + diagram awal untuk dirapikan Giren; memasok flow/RBAC agar diagram selaras." },
      { fokus: "ke Wida", isi: "Memberi outline materi untuk PPT/poster dan menyetujui keputusan visual (foto anggota); menerima video sebagai bagian lampiran laporan." },
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
    avatar: "SM",
    kondisi: "Riset dan draf Bab I–II sudah diunggah (25 Sep); saat ini menyempurnakan revisi berdasarkan 5 catatan dari ketua kelompok, menuju finalisasi Proposal di M3.",
    tagline: "Peneliti pustaka & penulis umum — menyusun Bab I, II, dan V, serta mengelola kerapian dan pengunggahan dokumen.",
    ringkasan: [
      "Sarifah bertanggung jawab atas sisi ilmiah dan naratif laporan: mencari 5–10 jurnal relevan, merangkumnya menjadi kajian pustaka, dan menulis Bab I (Pendahuluan) serta Bab II (Kajian Pustaka & Landasan Teori).",
      "Ia juga memegang Bab V (penutup), mengelola daftar pustaka, menjaga kerapian format, dan mengelola pengunggahan dokumen ke jalur resmi.",
      "Pekerjaannya menjadi pintu kelayakan Proposal: Bab I & II perlu utuh dan benar sebelum ketua kelompok bisa melakukan formatting dan submit pada tenggat Tugas 1.",
    ],
    fase: [
      {
        judul: "Riset — menyiapkan fondasi pustaka",
        rentang: "M1–M2",
        desc: "Langkah kecil seorang peneliti pustaka, dimulai dari menerima peta literatur.",
        langkah: [
          { k: "Menerima peta topik pencarian jurnal", a: "Catat daftar topik yang diberikan ketua kelompok (5 topik bahasa Indonesia dan 4 topik bahasa Inggris) sebagai panduan pencarian." },
          { k: "Mencari jurnal 5 tahun terakhir", a: "Cari 5–10 jurnal yang relevan per pilar topik: sistem informasi pengadaan berbasis web, metode RAD, pengendalian stok min-max, otomasi workflow approval, dan analisis downtime." },
          { k: "Menyeleksi dan mengunduh sumber", a: "Pilih jurnal yang benar-benar mendukung pembahasan, simpan referensinya, dan siapkan daftar pustaka yang bisa dilacak (penulis, tahun, judul, jurnal, tautan)." },
        ],
      },
      {
        judul: "Menulis Bab I & II",
        rentang: "M1–M2",
        desc: "Langkah seorang penulis menyusun bab pembuka laporan.",
        langkah: [
          { k: "Menyusun Bab I — Pendahuluan", a: "Tulis latar belakang masalah (pakai problem statement dan data downtime 305 menit dari ketua kelompok), rumusan masalah, tujuan (SMART), manfaat, ruang lingkup, dan jadwal kegiatan." },
          { k: "Menyusun Bab II — Kajian Pustaka & Landasan Teori", a: "Sintesis literatur yang ditemukan menjadi kajian pustaka per pilar, susun landasan teori, lalu tutup dengan pertanyaan penelitian dan hipotesis (H1–H3)." },
          { k: "Mengunggah hasil & meminta review", a: "Simpan Bab I dan II ke Google Drive (lengkap dengan jurnal pendukung), lalu beri tahu ketua kelompok dan minta dicek/dikoreksi." },
          { k: "Menyempurnakan hasil revisi", a: "Kerjakan catatan revisi satu per satu: cantumkan ilustrasi Why-Why, ubah jadwal jadi 8 minggu, hapus rentang waktu yang tidak cocok, hilangkan sebutan IoT/Blockchain, dan samakan poin pertanyaan dengan tujuan penelitian." },
        ],
      },
      {
        judul: "Tugas 1 — Finalisasi Proposal",
        rentang: "M3",
        desc: "Menutup bab pendahuluan yang dijadikan syarat submit.",
        langkah: [
          { k: "Finalisasi Bab I & II + jadwal kegiatan", a: "Pastikan isi Bab I–II sudah sesuai arahan dan jadwal kegiatan memakai rentang 8 minggu CP." },
          { k: "Menyerahkan ke ketua untuk format & submit", a: "Berikan bab final ke ketua kelompok agar digabung, di-format, dan di-submit sebagai Tugas 1." },
        ],
      },
      {
        judul: "Iterasi berdasarkan umpan balik",
        rentang: "M4",
        desc: "Perawatan kualitas bab pendahuluan.",
        langkah: [
          { k: "Revisi Bab I & II sesuai feedback tutor", a: "Terjemahkan komentar dosen/tutor menjadi perbaikan isi." },
          { k: "Kelola daftar pustaka", a: "Rapikan referensi, tambahkan yang baru, dan pastikan semua sitasi tercantum lengkap." },
        ],
      },
      {
        judul: "Tugas 2 — Laporan Kemajuan",
        rentang: "M5",
        desc: "Menulis kembali bab pendahuluan dalam dokumen kemajuan.",
        langkah: [
          { k: "Tulis Bab I, II, V Laporan Kemajuan", a: "Perbarui konten sesuai perkembangan proyek; tulis Bab V (penutup sementara)." },
          { k: "Formatting & submit", a: "Rapikan sesuai pedoman, gabungkan dengan bab lain, lalu submit bersama ketua." },
        ],
      },
      {
        judul: "Laporan Akhir",
        rentang: "M6",
        desc: "Mencerahkan versi final laporan.",
        langkah: [
          { k: "Finalisasi Bab I, II, V, VI", a: "Sempurnakan seluruh bab pendahuluan dan penutup untuk Laporan Akhir." },
        ],
      },
      {
        judul: "Karya Ilmiah",
        rentang: "M7",
        desc: "Menyesuaikan tulisan dengan format artikel.",
        langkah: [
          { k: "Konversi Bab I, II, V ke seksi Umum Karya Ilmiah", a: "Sesuaikan isi dengan format karya ilmiah yang diminta." },
          { k: "Menyusun Berita Acara", a: "Siapkan berita acara kerja kelompok sebagai lampiran." },
        ],
      },
      {
        judul: "Arsip akhir",
        rentang: "M8",
        desc: "Mengamankan seluruh dokumen resmi.",
        langkah: [
          { k: "Arsipkan dokumen final", a: "Simpan semua versi final laporan dan karya ilmiah di tempat yang rapi dan dapat diaudit." },
        ],
      },
    ],
    bukti: [
      { tgl: "17 Sep · 19:38", judul: "Pertama aktif di grup", isi: "Merespons ajakan ketua agar anggota tidak sungkan bertanya." },
      { tgl: "19 Sep · 20:37", judul: "Menerima peta topik jurnal", isi: "Balasan 'Oke terima kasih' atas daftar topik riset (5 ID + 4 EN)." },
      { tgl: "21 Sep · 09:15", judul: "Dibebani target Bab I–II", isi: "Ketua menargetkan Bab I & II selesai pekan ini demi submit proposal minggu berikutnya." },
      { tgl: "25 Sep · 00:40", judul: "Mengunggah Bab I & II + jurnal", isi: "Upload ke Google Drive lengkap dengan jurnal pendukung; minta dicek dan dikoreksi." },
      { tgl: "25 Sep · 10:03", judul: "Menerima 5 catatan revisi", isi: "Why-why, jadwal 8 minggu, hapus rentang waktu, hapus IoT/Blockchain, samakan pertanyaan-tujuan." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Terima dan pahami peta topik riset dari ketua kelompok.", done: true, bukti: "19 Sep" },
      { minggu: "M1–M2", teks: "Cari 5–10 jurnal relevan (5 tahun terakhir, ID & EN).", done: true, bukti: "Jurnal dilampirkan saat upload 25 Sep" },
      { minggu: "M1–M2", teks: "Susun Bab I: latar belakang, rumusan masalah, tujuan SMART, manfaat, ruang lingkup, jadwal.", done: true, bukti: "Upload 25 Sep" },
      { minggu: "M1–M2", teks: "Susun Bab II: kajian pustaka, landasan teori, pertanyaan penelitian & hipotesis.", done: true, bukti: "Upload 25 Sep" },
      { minggu: "M1–M2", teks: "Unggah hasil ke Drive & minta review ketua.", done: true, bukti: "25 Sep 00:40" },
      { minggu: "M3", teks: "Kerjakan catatan revisi (why-why, jadwal 8 minggu, hapus IoT/Blockchain, samakan pertanyaan-tujuan).", done: false, sedang: true, bukti: "Catatan diterima 25 Sep" },
      { minggu: "M3", teks: "Finalisasi Bab I & II + jadwal kegiatan untuk submit Proposal.", done: false },
      { minggu: "M4", teks: "Revisi Bab I & II sesuai feedback tutor.", done: false },
      { minggu: "M4", teks: "Kelola daftar pustaka.", done: false },
      { minggu: "M5", teks: "Tulis Bab I, II, V Laporan Kemajuan + formatting & submit.", done: false },
      { minggu: "M6", teks: "Finalisasi Bab I, II, V, VI Laporan Akhir.", done: false },
      { minggu: "M7", teks: "Konversi Bab I, II, V ke seksi Umum Karya Ilmiah + Berita Acara.", done: false },
      { minggu: "M8", teks: "Arsipkan dokumen final.", done: false },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima peta literatur, kerangka dokumen, dan review; hasilnya disatukan dan di-submit oleh Fadhil." },
      { fokus: "ke Giren", isi: "Landasan teori di Bab II menjadi dasar istilah dan metode yang diperinci di Bab III." },
      { fokus: "ke Wida", isi: "Konten Bab I–II dipakai Wida sebagai narasi utama slide PPT dan poster." },
      { fokus: "ke Avwan (developer)", isi: "Definisi masalah dan tujuan di Bab I menjadi arah pengembangan aplikasi." },
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
    avatar: "NW",
    kondisi: "Baru bergabung (17 Sep) dan dalam tahap awal: sudah mengenali peran, mempelajari outline, dan memutuskan kebijakan visual (foto anggota). Output visual dimulai dari sini menuju M3–M7.",
    tagline: "Spesialis visual & media (UI/UX Designer di pekerjaannya) — mengurus PPT, poster A4, skrip & video demo, serta keaktifan forum.",
    ringkasan: [
      "Wida bergabung pada 17 September sebagai anggota kelima. Karena berprofesi UI/UX Designer, pembagian tugas disesuaikan: Bab III yang sarat diagram ditangani Giren, sedangkan sisi visual & media dipercayakan kepada Wida.",
      "Tanggung jawab utamanya: template PPT, poster A4, skrip dan video demo aplikasi, serta keaktifan di forum diskusi; ia juga membantu tata letak visual proposal.",
      "Perannya bersifat 'pendukung wajah proyek': semua materi presentasi dan publikasi yang dinilai di tuton dikerjakan olehnya, berbahan konten dari anggota lain.",
    ],
    fase: [
      {
        judul: "Bergabung & memahami posisi",
        rentang: "M1–M2",
        desc: "Langkah awal anggota baru yang langsung mendapat peran visual.",
        langkah: [
          { k: "Perkenalan di grup", a: "Sapa seluruh anggota, beri tahu nama dan profesi, serta minta maaf karena bergabung di tengah diskusi." },
          { k: "Memahami pembagian tugas", a: "Pelajari posisi sebagai spesialis visual/media: PPT, poster A4, skrip & video demo, forum; pahami pula bahwa Bab III kini ditangani Giren." },
          { k: "Menerima amanah PPT & poster", a: "Catat instruksi ketua kelompok untuk mulai menyusun PPT dan poster, dengan outline materi (latar belakang, dll.) yang tersedia di folder bahan." },
          { k: "Menetapkan kebijakan visual", a: "Tanyakan hal-hal yang butuh persetujuan anggota—misalnya pemakaian foto di slide anggota kelompok—dan kumpulkan persetujuannya." },
        ],
      },
      {
        judul: "Membangun kerangka visual",
        rentang: "M1–M2",
        desc: "Langkah desainer menyiapkan wajah proyek dari awal.",
        langkah: [
          { k: "Menyiapkan template PPT", a: "Tentukan skema warna, tipografi, dan tata letak slide yang konsisten dengan identitas proyek, siap untuk diisi konten kapan saja." },
          { k: "Menyiapkan template poster A4", a: "Buat kerangka poster satu halaman: judul, latar belakang, solusi, alur, hasil, dan identitas penulis." },
          { k: "Membuat visualisasi diagram alur/arsitektur", a: "Ubah hasil diskusi (misalnya alur pengajuan & RBAC dari ketua) menjadi visual yang enak dibaca untuk bahan slide dan poster." },
        ],
      },
      {
        judul: "Tugas 1 — Mendukung Proposal",
        rentang: "M3",
        desc: "Kontribusi visual agar proposal tampil rapi.",
        langkah: [
          { k: "Membantu tata letak visual Proposal", a: "Sumbang keahlian desain untuk kerapian dokumen proposal sebelum dikirim." },
          { k: "Aktif di forum diskusi M3", a: "Ikut serta dalam diskusi resmi tuton sebagai bagian keaktifan kelompok." },
        ],
      },
      {
        judul: "Menyiapkan materi presentasi",
        rentang: "M4",
        desc: "Langkah awal dari dua produk utama: video dan poster.",
        langkah: [
          { k: "Menulis skrip video demo", a: "Buat naskah penjelasan aplikasi dari alur sistem: login, cek stok, isi BQ, approval, monitoring." },
          { k: "Membuat draf poster A4", a: "Isi kerangka poster dengan konten sementara yang sudah tersedia." },
        ],
      },
      {
        judul: "Tugas 2 — PPT Laporan Kemajuan",
        rentang: "M5",
        desc: "Menurunkan laporan kemajuan menjadi presentasi.",
        langkah: [
          { k: "Menyusun 8–12 slide PPT Laporan Kemajuan", a: "Rangkai slide: judul, anggota, latar belakang, tujuan, metode, hasil, kendala, dan rencana lanjut, sesuai jatah slide yang diminta." },
        ],
      },
      {
        judul: "Pengumpulan rekaman anggota",
        rentang: "M6",
        desc: "Mengumpulkan bahan suara/gambar untuk video demo.",
        langkah: [
          { k: "Mengumpulkan rekaman video/suara anggota 1–5", a: "Atur jadwal perekaman, beri panduan singkat ke tiap anggota, lalu kumpulkan hasilnya rapi." },
        ],
      },
      {
        judul: "Tugas 3 — Publikasi final",
        rentang: "M7",
        desc: "Merampungkan dan mengunggah semua media publikasi.",
        langkah: [
          { k: "Menyunting video YouTube", a: "Gabungkan rekaman demo aplikasi + suara anggota menjadi video final yang jelas dan tak terlalu panjang." },
          { k: "Menyelesaikan Poster A4 & PPT final", a: "Finalisasi poster dan slide presentasi untuk pengumpulan tugas 3." },
          { k: "Upload semua media", a: "Unggah video ke YouTube, poster dan PPT ke Drive/link resmi, lalu bagikan tautannya." },
        ],
      },
      {
        judul: "Penutup",
        rentang: "M8",
        desc: "Memastikan media tetap bisa diakses saat evaluasi.",
        langkah: [
          { k: "Cek link YouTube tetap aktif", a: "Uji tautan video sebelum dan saat sesi evaluasi agar tidak rusak." },
        ],
      },
    ],
    bukti: [
      { tgl: "17 Sep · 20:08", judul: "Bergabung sebagai anggota kelima", isi: "Diundang ketua kelompok; diperkenalkan sebagai UI/UX Designer." },
      { tgl: "17 Sep · 20:18", judul: "Perkenalan diri", isi: "Menyapa anggota dan meminta maaf karena bergabung lebih lambat." },
      { tgl: "19 Sep · 20:38", judul: "Amanah mulai PPT & poster", isi: "Ketua mempersilakan menyicil PPT/poster; outline tersedia di folder bahan." },
      { tgl: "24 Sep · 21:10", judul: "Keputusan visual: foto anggota", isi: "Menanyakan kesediaan anggota menampilkan foto di slide; disetujui Fadhil & Avwan." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Perkenalan & memahami posisi sebagai Visual & Media Specialist.", done: true, bukti: "17 Sep" },
      { minggu: "M1–M2", teks: "Pelajari outline materi (latar belakang, alur sistem) di folder bahan.", done: true, bukti: "Instruksi 19 Sep" },
      { minggu: "M1–M2", teks: "Pastikan kebijakan visual (foto anggota di slide) disetujui anggota.", done: true, bukti: "24 Sep" },
      { minggu: "M1–M2", teks: "Siapkan template PPT & poster.", done: false, sedang: true },
      { minggu: "M1–M2", teks: "Buat visualisasi diagram alur/arsitektur dari hasil diskusi.", done: false },
      { minggu: "M3", teks: "Bantu tata letak visual Proposal.", done: false },
      { minggu: "M3", teks: "Aktif di forum diskusi M3.", done: false },
      { minggu: "M4", teks: "Susun skrip video demo.", done: false },
      { minggu: "M4", teks: "Buat draf poster A4.", done: false },
      { minggu: "M5", teks: "Susun 8–12 slide PPT Laporan Kemajuan.", done: false },
      { minggu: "M6", teks: "Kumpulkan rekaman video/suara anggota 1–5.", done: false },
      { minggu: "M7", teks: "Edit video YouTube + Poster A4 final + PPT final + upload.", done: false },
      { minggu: "M8", teks: "Pastikan link YouTube aktif.", done: false },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima outline materi & persetujuan fitur visual; output video dilaporkan lewat checklist mingguan." },
      { fokus: "ke Sarifah", isi: "Konten Bab I–II menjadi narasi utama slide & poster." },
      { fokus: "ke Giren", isi: "Diagram Bab III (DFD, flowchart, use case) dipakai sebagai bahan visual." },
      { fokus: "ke Avwan (developer)", isi: "Demo aplikasi direkam dari aplikasi yang dikembangkan Avwan; sudut pandang UI/UX Wida dapat membantu penyempurnaan tampilan." },
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
    avatar: "GR",
    kondisi: "Sudah menerima peran Bab III dan tengah menyusun metodologi serta merapikan diagram (DFD, flowchart, use case, activity, ERD) agar selaras dengan aplikasi yang dikembangkan.",
    tagline: "Analis sistem & spesialis pemodelan — penyusun Bab III lengkap dengan DFD, flowchart, use case, dan activity diagram.",
    ringkasan: [
      "Giren bertanggung jawab atas Bab III (Metodologi & Perancangan Sistem) beserta seluruh diagram pemodelan: context diagram/DFD, flowchart system, use case diagram, activity diagram, dan ERD.",
      "Ia bersikap proaktif sejak hari pertama dan fleksibel: saat anggota kelima bergabung, ia menerima pergeseran tugas dan mengambil alih penyusunan Bab III yang sarat pemodelan.",
      "Draft Bab III yang digarapnya mengikuti metode RAD + Continual Improvement (CI), merinci kebutuhan fungsional/non-fungsional, dan rancangannya diselaraskan dengan aplikasi web yang sedang dibangun developer.",
    ],
    fase: [
      {
        judul: "Penyelarasan peran",
        rentang: "M1–M2",
        desc: "Langkah awal: masuk, menawarkan ide, dan menerima posisi baru.",
        langkah: [
          { k: "Bergabung & membuka ruang ide", a: "Sapa grup dan nyatakan kesiapan; ajak anggota berbagi ide untuk didiskusikan bersama." },
          { k: "Mengikuti mekanisme pemilihan jadwal", a: "Ikut serta dalam polling jadwal diskusi bersama anggota lain." },
          { k: "Menyetujui pengalihan tugas Bab III", a: "Ketika ketua mengusulkan agar penyusunan Bab III (dengan banyak diagram) berpindah ke Giren, respons dengan persetujuan yang jelas agar tim lanjut bergerak." },
          { k: "Menerima kerangka & diagram awal", a: "Terima draf kerangka Bab III dan diagram awal dari ketua; catat arahan: rapikan dengan Visio/DrawIO dan selaraskan tentatif dengan aplikasi yang dikembangkan." },
          { k: "Mempelajari alur sistem & RBAC", a: "Kuasai flow dan hak akses setiap peran pengguna sebagai dasar akurat untuk menggambar diagram." },
        ],
      },
      {
        judul: "Menyusun metodologi penelitian",
        rentang: "M1–M2 / M3",
        desc: "Langkah analis menuliskan cara penelitian dan perekayasaan.",
        langkah: [
          { k: "Menetapkan pendekatan penelitian", a: "Gunakan Mixed Methods (kualitatif + kuantitatif) dalam kerangka RAD dan Continual Improvement—jelaskan alasan pemilihan paradigma pragmatisme." },
          { k: "Menentukan lokasi, waktu, dan subjek", a: "Tulis lokasi (Lini Steril Dept. Engineering PT Fonko), rentang waktu, dan teknik Purposive Sampling pada 6 peranan: Manager, SPV1, SPV2, Engineering Officer, 10 Teknisi, Administrator." },
          { k: "Menyusun teknik pengumpulan data", a: "Uraikan 4 teknik: observasi lapangan, wawancara terstruktur & FGD, studi dokumentasi (log EJO 305 menit, PR/PO, min-max), dan kuesioner dikotomis/Likert." },
          { k: "Menyusun teknik analisis data", a: "Jelaskan Why-Why & Fishbone, audit parameter stok min-max, analisis isi (content analysis), dan statistika deskriptif & komparatif." },
        ],
      },
      {
        judul: "Merancang sistem (perancangan & pemodelan)",
        rentang: "M1–M2 / M3",
        desc: "Langkah inti pembuatan seluruh diagram perancangan.",
        langkah: [
          { k: "Membuat context diagram / DFD level 0", a: "Gambarkan interaksi sistem dengan entitas eksternal secara global." },
          { k: "Membuat DFD level 1", a: "Pecah 4 proses utama: Kelola Master Stok & Critical Part, Pengajuan Form BQ, Verifikasi & Approval Multi-Tier, dan Monitoring & Reporting." },
          { k: "Membuat flowchart system", a: "Gambar alur pengajuan BQ & verification loop, serta alur preventive replenishment critical sparepart." },
          { k: "Membuat use case diagram & activity diagram", a: "Petakan aktor-label-aksi (login, cek stok, isi BQ, approval, monitoring) dan aktivitas-aktivitas sistem berurutan." },
          { k: "Merancang ERD & spesifikasi tabel", a: "Susun diagram relasi dan rinci tabel: USERS, FORM_BQ, DETAIL_BQ, STOCK_GUDANG_CRITICAL, APPROVAL_LOG beserta kolom-kunci." },
          { k: "Merancang antarmuka (UI)", a: "Gambarkan halaman login, dashboard RBAC, BQ personal/summary, pencarian on-hand, critical part list, form approval, dan embed Monthly Report—sesuai aplikasi nyata." },
          { k: "Menuliskan pengujian, implementasi, pemeliharaan", a: "Rincikan Black Box & UAT, lalu tahap migrasi data, penerbitan kredensial, sosialisasi SOP, go-live, serta FGD dan pemeliharaan berkala." },
          { k: "Merapikan seluruh diagram", a: "Rapikan setiap diagram dengan Visio/DrawIO agar jelas, konsisten, dan diselaraskan dengan fitur aplikasi." },
        ],
      },
      {
        judul: "Tugas 1 — Menuntaskan Bab III Proposal",
        rentang: "M3",
        desc: "Menyerahkan bagian metodologi yang siap digabung.",
        langkah: [
          { k: "Finalisasi Bab III Proposal", a: "Pastikan metodologi, perancangan, dan seluruh diagram lengkap lalu serahkan ke ketua untuk digabung & di-submit." },
        ],
      },
      {
        judul: "Iterasi berdasarkan umpan balik",
        rentang: "M4",
        desc: "Perawatan kualitas metode & diagram.",
        langkah: [
          { k: "Revisi Bab III & diagram sesuai feedback tutor", a: "Perbaiki isi dan gambar sesuai komentar dosen." },
        ],
      },
      {
        judul: "Laporan Kemajuan & Laporan Akhir",
        rentang: "M5–M6",
        desc: "Menulis ulang dan memantapkan bagian metodologi.",
        langkah: [
          { k: "Tulis Bab III Laporan Kemajuan", a: "Perbarui metode dan perancangan sesuai perkembangan aplikasi." },
          { k: "Finalisasi Bab III + penyempurnaan diagram", a: "Sempurnakan semua diagram untuk Laporan Akhir." },
        ],
      },
      {
        judul: "Karya Ilmiah & evaluasi",
        rentang: "M7–M8",
        desc: "Menyesuaikan ke format artikel dan evaluasi akhir.",
        langkah: [
          { k: "Konversi Bab III ke seksi Metodologi Karya Ilmiah", a: "Sesuaikan isi dengan format karya ilmiah dan integrasikan diagram." },
          { k: "Evaluasi kesesuaian dokumen final", a: "Periksa konsistensi metodologi dan pemodelan sebelum pengumpulan akhir." },
        ],
      },
    ],
    bukti: [
      { tgl: "15 Sep · 11:57", judul: "Masuk dan membuka ruang ide", isi: "'Siap ka, kalo ada ide boleh langsung di share aja nanti bisa kita diskusiin'." },
      { tgl: "15 Sep · 13:13", judul: "Ikut polling jadwal diskusi", isi: "Menjadi peserta voting terakhir yang ditunggu ketua." },
      { tgl: "17 Sep · 21:36", judul: "Menyetujui pengalihan Bab III", isi: "'Bebas ka atur aja' — menerima penyusunan Bab III." },
      { tgl: "20 Sep · 10:44", judul: "Menerima kerangka Bab III + diagram awal", isi: "Arahan: rapikan dengan Visio/DrawIO & selaraskan dengan aplikasi." },
      { tgl: "Ongoing", judul: "Menyusun Draft Bab III (Methodology + Design)", isi: "Draft Bab 3 CP 127 A: Mixed Methods + RAD/CI, DFD, flowchart, use case, activity, ERD, UI, pengujian & implementasi." },
    ],
    checklist: [
      { minggu: "M1–M2", teks: "Bergabung aktif & ikut menentukan jadwal diskusi.", done: true, bukti: "15 Sep" },
      { minggu: "M1–M2", teks: "Menyetujui dan mengambil alih penyusunan Bab III (hasil reshuffle).", done: true, bukti: "17 Sep" },
      { minggu: "M1–M2", teks: "Pelajari alur sistem & RBAC sebagai dasar pemodelan.", done: true, bukti: "Mengikuti paparan 18 Sep" },
      { minggu: "M1–M2", teks: "Terima kerangka Bab III + diagram awal dari ketua.", done: true, bukti: "20 Sep" },
      { minggu: "M3", teks: "Susun metodologi: mixed methods, RAD/CI, subjek (6 role), teknik data & analisis.", done: false, sedang: true, bukti: "Draf sudah tersusun" },
      { minggu: "M3", teks: "Selesaikan DFD, flowchart, use case, activity diagram & ERD, rapikan dengan Visio/DrawIO.", done: false, sedang: true },
      { minggu: "M3", teks: "Rancang UI yang selaras dengan aplikasi nyata.", done: false, sedang: true },
      { minggu: "M4", teks: "Revisi Bab III & diagram sesuai feedback tutor.", done: false },
      { minggu: "M5", teks: "Tulis Bab III Laporan Kemajuan.", done: false },
      { minggu: "M6", teks: "Finalisasi Bab III Laporan Akhir + penyempurnaan diagram.", done: false },
      { minggu: "M7", teks: "Konversi Bab III ke seksi Metodologi Karya Ilmiah + integrasi diagram.", done: false },
      { minggu: "M8", teks: "Evaluasi kesesuaian dokumen metodologi & pemodelan final.", done: false },
    ],
    keterkaitan: [
      { fokus: "ke Fadhil", isi: "Menerima kerangka & diagram awal Bab III dari Fadhil; berkoordinasi soal flow & RBAC." },
      { fokus: "ke Avwan (developer)", isi: "Diagram dan perancangan diselaraskan dengan menu serta fitur aplikasi yang dikembangkan." },
      { fokus: "ke Sarifah", isi: "Landasan teori di Bab II dipakai sebagai dasar istilah dan metode yang dirinci di Bab III." },
      { fokus: "ke Wida", isi: "Output diagram (use case, flowchart, activity) menjadi bahan visual PPT, poster, dan video demo." },
    ],
  },
];

/* ------------------------- state & helpers ------------------------- */

const $app = document.getElementById("app");
const $nav = document.getElementById("nav");
let current = "home";
const CK_KEY = "ck_a127_v2";
const savedChecks = JSON.parse(localStorage.getItem(CK_KEY) || "{}");

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function itemKey(m, c) { return m.id + "·" + c.teks.slice(0, 42); }

function checked(m, c) {
  if (savedChecks[itemKey(m, c)] === true) return true;
  return c.done === true;
}

/* ------------------------- navigation ------------------------- */

function renderNav() {
  const items = [{ id: "home", label: "Beranda", avatar: "A" }, ...MEMBERS.map((m) => ({ id: m.id, label: m.nama, avatar: m.avatar }))];
  $nav.innerHTML = items.map((it) => {
    const m = MEMBERS.find((x) => x.id === it.id);
    const active = current === it.id;
    return `<button class="${active ? "active" : ""}" data-slug="${it.id}" style="--ac:${m ? m.warna : "var(--ink)"}">
      <span class="nav-avatar">${it.avatar}</span>${esc(it.label)}</button>`;
  }).join("");
  $nav.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => navigate(b.dataset.slug)));
}

function navigate(slug) {
  current = slug;
  renderNav();
  window.scrollTo({ top: 0, behavior: "auto" });
  if (slug === "home") {
    $app.innerHTML = renderHome();
    bindHome();
    document.title = "Catatan Kerja Anggota · Capstone Kelompok A 127";
  } else {
    const m = MEMBERS.find((x) => x.id === slug);
    $app.innerHTML = renderMember(m);
    bindMember(m);
    document.title = m.nama + " · Catatan Kerja Anggota · Kelompok A 127";
  }
}

/* ------------------------- home ------------------------- */

function renderHome() {
  const cards = MEMBERS.map((m) => `
    <article class="member-card" style="--ac:${m.warna}" data-go="${m.id}">
      <div class="mcard-top">
        <span class="nav-avatar big" style="--ac:${m.warna}">${m.avatar}</span>
        <div>
          <span class="member-role">${esc(m.peran)}</span>
          <div class="nim">${esc(m.anggota)} · NIM ${m.nim}</div>
        </div>
      </div>
      <h3>${esc(m.namaLengkap)}</h3>
      <p class="desc">${esc(m.tagline)}</p>
      <div class="mcard-cta">Buka halaman ${esc(m.nama)} →</div>
    </article>`).join("");

  return `
    <div class="hero">
      <p class="page-kicker">Catatan Kerja Anggota</p>
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
      <ul class="crosslist">
        ${PROJEK.lingkupTitik.map((t) => `<li>${esc(t)}</li>`).join("")}
      </ul>
      <p class="small muted" style="margin-top:16px;">Halaman ini berisi analisa per anggota: <strong>kerangka kerja lengkap dari awal sampai selesai</strong> (langkahnya kecil-kecil, namun disusun dengan bahasa orang dewasa), <strong>bukti di grup</strong>, <strong>checklist pengerjaan</strong>, serta <strong>keterkaitan antar pemegang peran</strong>. Pilih nama di menu sebelah kiri.</p>
    </div>

    <div class="section">
      <h2>Empat anggota yang dianalisis</h2>
      <p class="muted">Analisa dikhususkan di luar developer aplikasi, untuk membantu teman-teman memahami tugasnya masing-masing.</p>
      <div class="member-cards">${cards}</div>
    </div>

    <div class="section">
      <h2>Garis waktu kelompok (ringkas)</h2>
      <div class="timeline" style="--ac:#26241f;">
        <div class="t-item"><div class="t-date">15 Sep 2026</div><div class="t-title">Grup dibentuk</div><div class="t-body">Fadhil membentuk grup, polling jadwal, Google Meet perdana, dan menyiapkan Google Drive tim.</div></div>
        <div class="t-item"><div class="t-date">16–18 Sep</div><div class="t-title">Penyamaan pemahaman</div><div class="t-body">Paparan problem statement (Why-Why), flow sistem &amp; RBAC semua peran.</div></div>
        <div class="t-item"><div class="t-date">17 Sep</div><div class="t-title">Tim lengkap</div><div class="t-body">Wida bergabung; Giren mengambil alih Bab III; pembagian tugas dikunci.</div></div>
        <div class="t-item"><div class="t-date">19–20 Sep</div><div class="t-title">Materi disiapkan</div><div class="t-body">Sarifah mendapat peta jurnal; Giren menerima kerangka Bab III; Wida mulai PPT/poster.</div></div>
        <div class="t-item"><div class="t-date">21–24 Sep</div><div class="t-title">Data &amp; bahan teknis</div><div class="t-body">Reminder submit; raw data &amp; flow data untuk aplikasi diunggah ke Drive.</div></div>
        <div class="t-item"><div class="t-date">25 Sep</div><div class="t-title">Bab I–II masuk</div><div class="t-body">Sarifah mengunggah Bab I–II; Fadhil memberi 5 catatan revisi; menuju submit Proposal di M3.</div></div>
      </div>
    </div>`;
}

function bindHome() {
  $app.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => navigate(el.dataset.go)));
}

/* ------------------------- member ------------------------- */

function renderMember(m) {
  const fase = m.fase.map((f, fi) => `
    <div class="fase">
      <div class="fase-head">
        <div>
          <span class="fase-badge">${esc(f.rentang)}</span>
          <h3>${fi + 1}. ${esc(f.judul)}</h3>
        </div>
        <p class="fase-desc">${esc(f.desc)}</p>
      </div>
      <div class="steps">${f.langkah.map((s, si) => `
        <div class="step">
          <div class="step-num">${fi + 1}.${si + 1}</div>
          <div>
            <h4>${esc(s.k)}</h4>
            <p>${esc(s.a)}</p>
          </div>
        </div>`).join("")}</div>
    </div>`).join("");

  const bukti = m.bukti.map((b) => `
    <div class="t-item">
      <div class="t-date">${esc(b.tgl)}</div>
      <div class="t-title">${esc(b.judul)}</div>
      <div class="t-body">${esc(b.isi)}</div>
    </div>`).join("");

  const checklist = m.checklist.map((c) => {
    const key = itemKey(m, c);
    const on = checked(m, c);
    return `
    <label class="ck-item ${on ? "done" : ""}">
      <input type="checkbox" data-group="${m.id}" data-ck="${key}" ${on ? "checked" : ""} />
      <div class="ck-main">
        <div class="ck-meta">
          <span class="ck-minggu">${esc(c.minggu)}</span>
          ${c.bukti ? `<span class="ck-verified">terverifikasi · ${esc(c.bukti)}</span>` : ""}
          ${c.sedang ? `<span class="ck-now">sedang dikerjakan</span>` : ""}
        </div>
        <div class="ck-text">${esc(c.teks)}</div>
      </div>
    </label>`;
  }).join("");

  const keterkaitan = m.keterkaitan.map((k) => `<li><b>${esc(k.fokus)}:</b> ${esc(k.isi)}</li>`).join("");

  const kLinks = [
    ["ringkasan", "Ringkasan", "#bd4b4b"],
    ["fase", "Kerangka kerja lengkap", "var(--ink)"],
    ["bukti", "Bukti di grup", "var(--ink)"],
    ["checklist", "Checklist", "var(--ink)"],
    ["kaitan", "Keterkaitan", "var(--ink)"],
  ];

  return `
    <button class="backlink" data-go="home">← Beranda</button>

    <div class="mhero" style="--ac:${m.warna};">
      <div class="mhero-avatar">${m.avatar}</div>
      <div>
        <p class="page-kicker" style="color:${m.warna};">${esc(m.anggota)} · NIM ${m.nim}</p>
        <h1>${esc(m.namaLengkap)}</h1>
        <p class="mhero-role">${esc(m.peran)}</p>
      </div>
      <div class="mhero-status"><span class="dot-pulse"></span>${esc(m.kondisi)}</div>
    </div>

    <div class="inpage-nav">
      ${kLinks.map((l) => `<button data-jump="${l[0]}">${esc(l[1])}</button>`).join("")}
    </div>

    <section id="ringkasan" class="section">
      <h2>Ringkasan peran</h2>
      ${m.ringkasan.map((p) => `<p>${esc(p)}</p>`).join("")}
    </section>

    <section id="fase" class="section">
      <h2>Kerangka kerja lengkap — dari awal sampai selesai</h2>
      <p class="muted">Langkah-langkah kecil urut dari paling awal hingga penutup proyek. Kata-katanya dewasa, tapi langkahnya diperinci supaya mudah diikuti satu per satu.</p>
      ${fase}
    </section>

    <section id="bukti" class="section">
      <h2>Bukti di grup (berurutan)</h2>
      <p class="muted">Jejak partisipasi yang tercatat di arsip chat grup per tanggal.</p>
      <div class="timeline" style="--ac:${m.warna};">${bukti}</div>
    </section>

    <section id="checklist" class="section">
      <h2>Checklist pengerjaan</h2>
      <div class="card">
        <div class="ck-header">
          <div class="ck-progress">
            <div class="pbar"><div class="pfill" id="pfill-${m.id}"></div></div>
            <div class="plabel" id="plabel-${m.id}"></div>
          </div>
          <button class="ck-reset" data-reset="${m.id}">Reset centang</button>
        </div>
        ${checklist}
      </div>
      <p class="small muted" style="margin-top:10px;">Centang bisa diubah bebas dan tersimpan di browser ini. Tanda <strong>terverifikasi</strong> berarti sudah terlihat pengerjaannya di chat/dokumen tim per 25 Sep 2026; tanda <strong>sedang dikerjakan</strong> berarti berjalan namun belum tuntas versi finalnya.</p>
    </section>

    <section id="kaitan" class="section">
      <h2>Keterkaitan pekerjaan dengan anggota lain</h2>
      <ul class="crosslist">${keterkaitan}</ul>
    </section>`;
}

function bindMember(m) {
  $app.querySelectorAll("[data-go]").forEach((el) => el.addEventListener("click", () => navigate(el.dataset.go)));

  $app.querySelectorAll("[data-jump]").forEach((b) =>
    b.addEventListener("click", () => {
      const el = document.getElementById(b.dataset.jump);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );

  const reset = $app.querySelector("[data-reset=" + m.id + "]");
  if (reset) reset.addEventListener("click", () => {
    m.checklist.forEach((c) => delete savedChecks[itemKey(m, c)]);
    localStorage.setItem(CK_KEY, JSON.stringify(savedChecks));
    navigate(m.id);
  });

  $app.querySelectorAll("[data-ck]").forEach((cb) =>
    cb.addEventListener("change", () => {
      savedChecks[cb.dataset.ck] = cb.checked;
      localStorage.setItem(CK_KEY, JSON.stringify(savedChecks));
      cb.closest(".ck-item").classList.toggle("done", cb.checked);
      updateProgress(m.id);
    })
  );

  updateProgress(m.id);
}

function updateProgress(group) {
  const boxes = Array.from(document.querySelectorAll('[data-group="' + group + '"]'));
  const n = boxes.filter((b) => b.checked).length;
  const p = document.getElementById("pfill-" + group);
  const l = document.getElementById("plabel-" + group);
  if (p) p.style.width = (boxes.length ? Math.round((n / boxes.length) * 100) : 0) + "%";
  if (l) l.textContent = n + " dari " + boxes.length + " langkah ditandai selesai · " + (boxes.length ? Math.round((n / boxes.length) * 100) : 0) + "%";
}

/* ------------------------- boot ------------------------- */
navigate("home");