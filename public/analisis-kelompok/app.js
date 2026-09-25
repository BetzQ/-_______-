/* ============================================================
   Catatan Kerja Anggota — Capstone Kelompok A 127 (STSI4401)
   Analisa per anggota: kerangka kerja lengkap dari awal sampai
   selesai. Disusun dari arsip obrolan tim dan dokumen hasil kerja.
   Per tanggal 25 September 2026 (minggu ke-2 / M1–M2).
   v3: setiap langkah dipecah jadi sub-langkah centang + hasil.
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
          {
            k: "Membentuk grup WhatsApp Capstone",
            a: "Buat grup baru, undang seluruh calon anggota satu per satu, lalu kirim pesan pembuka: mengingatkan jadwal Tuweb sesi 1 dan mengajak semua menentukan topik paling lambat Kamis.",
            cara: [
              "Buka menu baru di WhatsApp lalu pilih New Group.",
              "Undang kelima calon anggota satu per satu sampai lengkap.",
              "Kirim pesan pembuka: ingatkan jadwal Tuweb sesi 1 (Jumat malam).",
              "Tutup pesan dengan tenggat: topik harus ditentukan paling lambat Kamis.",
            ],
            hasil: "Grup resmi terbentuk berisi semua anggota + tenggat pemilihan topik tersampaikan.",
          },
          {
            k: "Menggelar polling jadwal diskusi",
            a: "Buat polling pilihan waktu diskusi perdana (malam ini / besok / Kamis), beri batas waktu voting, lalu ingatkan anggota yang belum memilih sampai semua ikut.",
            cara: [
              "Buka menu polling di dalam grup.",
              "Isi opsi: Malam ini 15 Sep / Besok malam 16 Sep / Kamis malam 17 Sep.",
              "Beri batas waktu voting (mis. sampai pukul 17.00).",
              "Ingatkan satu-satu anggota yang belum memilih (contoh: tinggal Giren).",
            ],
            hasil: "Tanggal diskusi perdana terkunci dan semua anggota ikut voting.",
          },
          {
            k: "Menyelenggarakan Google Meet perdana",
            a: "Buat link Meet, bagikan ke grup, pastikan kehadiran semua anggota, dan tegaskan bahwa isi pertemuan dicatat untuk lampiran berita acara laporan CP.",
            cara: [
              "Buat agenda Google Meet (dari Google Calendar).",
              "Salin link Meet lalu bagikan ke grup sebelum jam mulai.",
              "Ingatkan satu sama lain agar semua hadir.",
              "Catat poin kesepakatan singkat untuk bahan berita acara.",
            ],
            hasil: "Link Meet + notulensi singkat pertemuan (siap jadi lampiran laporan).",
          },
          {
            k: "Menyiapkan Google Drive tim",
            a: "Buat folder Drive yang rapi: checklist & to-do list mingguan, folder referensi (contoh CP kating), dan folder bahan pendukung, lalu bagikan tautannya ke seluruh anggota.",
            cara: [
              "Buat folder induk bernama yang jelas, misal 'CP Kelompok A 127'.",
              "Buat subfolder: 'Checklist & To Do List', 'Referensi CP (kating)', 'Bahan Capstone Project'.",
              "Atur izin akses (Editor) untuk semua anggota.",
              "Salin tautan ke grup dan minta semua membukanya.",
            ],
            hasil: "Struktur Drive rapi yang dipakai bersama seluruh tim.",
          },
          {
            k: "Menyiapkan kerangka dokumen awal",
            a: "Buat draf 'kasar' proposal capstone dan draf laporan capstone sebagai kerangka yang akan dikembangkan penulis; buat dokumen 'Aps Script CP' berisi tautan aplikasi dan source code untuk developer.",
            cara: [
              "Buat gdoc 'Proposal Capstone' berisi kerangka bab kasar.",
              "Buat gdoc 'Laporan Capstone' berisi kerangka laporan kasar.",
              "Buat gdoc 'Aps Script CP' berisi tautan aplikasi + source code.",
              "Letakkan ketiganya di folder Bahan dan tunjuk pemiliknya (Sarifah & Avwan).",
            ],
            hasil: "3 kerangka awal siap dikembangkan penulis dan developer.",
          },
          {
            k: "Membagi tanggung jawab perdana",
            a: "Sebarkan tugas awal: penulis melengkapi jurnal, developer mempelajari bahan teknis, dan anggota lain meninjau bahan untuk PPT/poster — sambil mempertegas bahwa progres dicentang di checklist Drive.",
            cara: [
              "Tetapkan peran awal tiap anggota (penulis / teknis / media).",
              "Kirim instruksi tugas dan tenggatnya per orang.",
              "Tegaskan: setiap selesai, centang di checklist mingguan Drive.",
              "Minta konfirmasi 'siap' dari semua anggota.",
            ],
            hasil: "Daftar tugas awal jelas dan seluruh anggota menyetujui.",
          },
        ],
      },
      {
        judul: "Menyamakan pemahaman seluruh tim",
        rentang: "M1–M2",
        desc: "Langkah seorang business analyst yang memastikan setiap anggota melihat masalah dan sistem dari sudut yang sama.",
        langkah: [
          {
            k: "Memaparkan problem statement resmi",
            a: "Jelaskan di grup: sparepart sering tidak tersedia saat dibutuhkan; uraikan dua akar masalah dari Why-Why Analysis (pengajuan tidak lengkap + monitoring lemah; belum ada critical sparepart list) beserta solusi dan target sistemnya.",
            cara: [
              "Tulis paparan latar belakang topik di grup.",
              "Cantumkan 2 akar masalah utama dari Why-Why Analysis.",
              "Sebutkan data pendukung: downtime Cartoning Marchesini 305 menit dari 6 dokumen EJO.",
              "Sebutkan 4 modul sistem sasaran (BQ digital, approval, critical part, monthly report).",
            ],
            hasil: "Semua anggota memahami masalah, akar masalah, dan solusinya dengan sudut pandang yang sama.",
          },
          {
            k: "Menawarkan dukungan data",
            a: "Umumkan bahwa semua data pendukung (raw data, contoh report, log) bisa diminta kapan saja, terutama untuk kebutuhan developer aplikasi.",
            cara: [
              "Tulis ketersediaan data pendukung di grup.",
              "Sebutkan lokasi data di Drive agar tahu tempatnya.",
              "Persilakan developer menyebut kebutuhan data yang diinginkan.",
            ],
            hasil: "Developer tahu sumber data dan tidak ragu meminta.",
          },
          {
            k: "Melengkapi tim dan menata ulang tugas",
            a: "Undang anggota yang belum masuk (Wida), kenalkan kelebihannya (UI/UX Designer), lalu ajukan penyesuaian pembagian tugas: Bab III yang sarat diagram dialihkan ke Giren, dan mintalah persetujuan anggota yang bersangkutan.",
            cara: [
              "Undang Wida ke grup dan kenalkan profilnya (UI/UX Designer).",
              "Jelaskan alasan penyesuaian: Bab III berisi banyak diagram (DFD, dll).",
              "Ajukan tawaran ke Giren untuk mengambil alih Bab III.",
              "Tunggu persetujuan Giren sebelum mengunci pembagian.",
            ],
            hasil: "Tim lengkap 5 orang + pembagian tugas baru disepakati.",
          },
          {
            k: "Menjawab pertanyaan kebutuhan fungsional",
            a: "Jawab satu per satu pertanyaan developer: format Monthly Report (ada contoh + link Looker), pemakaian status Normal/Urgent, siapa saja yang boleh approval (SPV1, SPV2, Officer), pemakaian PR Summary, dan status Jenis Jasa.",
            cara: [
              "Kumpulkan semua pertanyaan developer menjadi satu daftar.",
              "Jawab tertulis di grup satu per satu.",
              "Sertakan link Looker Studio untuk format Monthly Report.",
              "Jelaskan aturan: Normal/Urgent per pengajuan, approval oleh SPV/Officer, PR Summary khusus Manager & SPV1, dan Jenis Jasa juga masuk pengajuan.",
            ],
            hasil: "Seluruh jawaban kebutuhan fungsional tercatat di grup sebagai acuan developer.",
          },
          {
            k: "Mendokumentasikan flow & hak akses (RBAC)",
            a: "Tuliskan menu setiap peran pengguna (Teknisi, Officer, SPV1, SPV2, Manager, Administrator), alur pengajuan barang reguler/urgent, dan alur preventive replenishment critical part — sebagai kontrak bersama antara analis, penulis Bab III, dan developer.",
            cara: [
              "Buat daftar menu & hak akses per role (Teknisi, Officer, SPV1, SPV2, Manager, Administrator).",
              "Tulis alur pengajuan barang reguler dan urgent.",
              "Tulis alur preventive replenishment critical sparepart.",
              "Simpan di gdoc 'Flow & RBAC' dan bagikan ke analis, penulis Bab III, developer.",
            ],
            hasil: "Dokumen Flow & RBAC sebagai kontrak bersama seluruh tim.",
          },
          {
            k: "Memberi peta literatur ke penulis",
            a: "Susun daftar topik pencarian jurnal (bahasa Indonesia dan Inggris) dan serahkan ke penulis Bab I-II; kunci pembagian Bab agar tidak tumpang tindih.",
            cara: [
              "Susun 5 topik jurnal bahasa Indonesia (mis. sistem pengadaan berbasis web, RAD, min-max stok, workflow approval, analisis downtime).",
              "Susun 4 topik jurnal bahasa Inggris (critical spareparts, inventory control, dll).",
              "Kirim daftar topik ke Sarifah sebagai panduan pencarian.",
              "Ingatkan syarat: jurnal 5 tahun terakhir.",
              "Kunci pembagian bab agar tidak tumpang tindih.",
            ],
            hasil: "Peta literatur sampai ke penulis Bab I-II.",
          },
          {
            k: "Menyerahkan kerangka Bab III + diagram awal",
            a: "Siapkan draf kerangka Bab III dan diagram awal, serahkan ke penyusun Bab III, lengkap dengan arahan: rapikan pakai Visio/DrawIO dan selaraskan dengan aplikasi yang tengah dikembangkan.",
            cara: [
              "Buka dokumen 'Draft Bab 3 CP 127 A' di folder Bahan.",
              "Periksa kerangka & diagram kasar yang sudah dibuat.",
              "Serahkan ke Giren secara tertulis di grup.",
              "Beri arahan: rapikan pakai Visio/DrawIO & selaraskan dengan aplikasi.",
            ],
            hasil: "Kerangka Bab III resmi berpindah tangan ke Giren.",
          },
          {
            k: "Menyuplai data mentah & flow data",
            a: "Unggah seluruh raw data ke Drive (folder Raw Data CP) untuk developer; buat dokumen flow data pengajuan barang, dan janjikan flow modul stok/critical part yang lebih sederhana menyusul.",
            cara: [
              "Unggah seluruh raw data ke folder 'Bahan Capstone Project > Raw Data CP'.",
              "Buat dokumen flow data pengajuan barang.",
              "Umumkan lokasi file ke developer di grup.",
              "Jelaskan bahwa flow modul stok/critical part menyusul.",
            ],
            hasil: "Developer menerima raw data + flow data pengajuan barang.",
          },
          {
            k: "Mereview hasil tulisan anggota",
            a: "Baca kiriman penulis (Bab I–II), beri penilaian singkat yang menumbuhkan semangat, lalu beri catatan koreksi yang spesifik (contoh: cantumkan ilustrasi Why-Why, buat jadwal 8 minggu, hapus sebutan IoT/Blockchain, samakan pertanyaan & tujuan penelitian).",
            cara: [
              "Buka Bab I & II yang diunggah Sarifah di Drive.",
              "Beri penilaian apresiasi dulu (mis. 'overall udah bagus banget').",
              "Sampaikan catatan per poin: ilustrasi why-why, jadwal 8 minggu, hapus rentang waktu, hapus IoT/Blockchain, samakan pertanyaan-tujuan.",
              "Minta hasil revisi dikembalikan sebelum tenggat submit M3.",
            ],
            hasil: "Daftar revisi yang jelas untuk pemilik bab.",
          },
        ],
      },
      {
        judul: "Tugas 1 — Mengantarkan Proposal",
        rentang: "M3",
        desc: "Menjadi editor, penyusun format, dan submitter dokumen resmi pertama kelompok.",
        langkah: [
          {
            k: "Menggabungkan seluruh bagian proposal",
            a: "Rangkai Bab I–II dari penulis, Bab III dari penyusun sistem, daftar pustaka, dan jadwal kegiatan menjadi satu dokumen utuh.",
            cara: [
              "Kumpulkan file Bab I-II (Sarifah) dan Bab III (Giren) dari Drive.",
              "Gabungkan jadi satu dokumen proposal.",
              "Masukkan daftar pustaka dan jadwal kegiatan 8 minggu.",
              "Susun urut: sampul, Bab I, Bab II, Bab III, daftar pustaka.",
            ],
            hasil: "Satu file proposal utuh siap diedit.",
          },
          {
            k: "Memvalidasi kesesuaian fitur & data pada Bab III",
            a: "Periksa bahwa perancangan dan diagram di Bab III benar-benar cocok dengan fitur serta data yang sudah ditetapkan (flow & RBAC), sebelum dikirim.",
            cara: [
              "Bandingkan diagram Bab III dengan fitur aplikasi yang sedang dibuat.",
              "Cek menu per role sesuai dokumen RBAC.",
              "Catat bagian yang belum cocok lalu kirim ke Giren untuk diperbaiki.",
            ],
            hasil: "Bab III valid dan selaras dengan aplikasi.",
          },
          {
            k: "Melakukan formatting resmi",
            a: "Rapikan sampul, halaman pengesahan, daftar isi, daftar tabel/gambar, dan penomoran sesuai pedoman UT.",
            cara: [
              "Buat sampul dan halaman pengesahan sesuai pedoman.",
              "Generate daftar isi, daftar tabel, daftar gambar otomatis.",
              "Periksa penomoran halaman dan konsistensi font.",
              "Baca ulang ejaan sebelum kirim.",
            ],
            hasil: "Proposal ter-format sesuai pedoman UT.",
          },
          {
            k: "Submit Proposal sebagai Tugas 1",
            a: "Unggah proposal sesuai ketentuan tuton pada pekan M3 dan umumkan ke anggota.",
            cara: [
              "Cek ketentuan tenggat pekan M3 di tuton.",
              "Unggah proposal sesuai format yang diminta.",
              "Simpan bukti submit (tangkapan layar / notifikasi).",
              "Umumkan ke grup bahwa Tugas 1 sudah terkirim.",
            ],
            hasil: "Tugas 1 terkirim + bukti pengumpulan tersimpan.",
          },
        ],
      },
      {
        judul: "Pengujian & draf hasil",
        rentang: "M4",
        desc: "Menjembatani produk aplikasi menjadi bab analisis.",
        langkah: [
          {
            k: "Mengumpulkan data & foto hasil produk",
            a: "Minta developer menyediakan tangkapan layar dan data hasil pengujian aplikasi untuk dijadikan bahan tulisan.",
            cara: [
              "Minta developer menyiapkan tangkapan layar tiap modul utama.",
              "Minta ringkasan hasil uji (black box / UAT).",
              "Kelompokkan bahan menjadi: tampilan, alur, dan hasil pengujian.",
            ],
            hasil: "Paket bahan lengkap untuk Bab IV.",
          },
          {
            k: "Menyusun Draf Bab IV",
            a: "Tulis Bab IV berisi hasil pengembangan, hasil uji (misal black box), dan analisis dampaknya terhadap downtime/efisiensi.",
            cara: [
              "Tulis hasil pengembangan (fitur yang berhasil diterapkan).",
              "Tulis ringkasan hasil uji black box.",
              "Tulis analisis dampak terhadap downtime/efisiensi.",
              "Sisipkan gambar dan tabel pendukung.",
            ],
            hasil: "Draf Bab IV pertama selesai.",
          },
        ],
      },
      {
        judul: "Tugas 2 — Laporan Kemajuan",
        rentang: "M5",
        desc: "Merangkai kemajuan proyek menjadi laporan resmi kedua.",
        langkah: [
          {
            k: "Menulis Bab IV Laporan Kemajuan",
            a: "Perbarui hasil pengembangan dan uji sampai pekan M5 ke dalam Bab IV.",
            cara: [
              "Perbarui data hasil uji sampai pekan M5.",
              "Sinkronkan dengan fitur aplikasi terbaru.",
              "Rapikan tabel dan gambar.",
            ],
            hasil: "Bab IV versi laporan kemajuan.",
          },
          {
            k: "Menyatukan dan formatting",
            a: "Rangkai Bab I–V dari semua anggota sesuai pembagian, rapikan format, lalu submit sebagai Tugas 2.",
            cara: [
              "Gabungkan Bab I–V dari semua anggota.",
              "Format ulang sesuai pedoman UT.",
              "Submit sebagai Tugas 2 lalu umumkan ke grup.",
            ],
            hasil: "Laporan kemajuan ter-publish sebagai Tugas 2.",
          },
        ],
      },
      {
        judul: "Finalisasi laporan akhir",
        rentang: "M6",
        desc: "Menutup bagian teknis laporan utama.",
        langkah: [
          {
            k: "Finalisasi Bab IV",
            a: "Sempurnakan Bab IV Laporan Akhir dengan data nilai yang sudah final.",
            cara: [
              "Cek data hasil uji yang sudah final.",
              "Perbaiki analisis dampak dengan angka final.",
              "Lengkapi lampiran pendukung (surat pernyataan, berita acara, log kegiatan).",
            ],
            hasil: "Bab IV final siap dirakit di laporan akhir.",
          },
        ],
      },
      {
        judul: "Karya ilmiah & presentasi",
        rentang: "M7",
        desc: "Mengubah bagian laporan menjadi artikel ilmiah.",
        langkah: [
          {
            k: "Konversi Bab IV ke seksi Teknis Karya Ilmiah",
            a: "Sesuaikan isi Bab IV dengan format artikel ilmiah (bagian teknis), siap untuk digabung dengan seksi lainnya.",
            cara: [
              "Baca template karya ilmiah yang diminta.",
              "Ringkas Bab IV menjadi bagian 'Teknis' sesuai format.",
              "Selaraskan format sitasi dan struktur seksi.",
              "Serahkan ke penggabung karya ilmiah.",
            ],
            hasil: "Seksi Teknis karya ilmiah siap digabung.",
          },
        ],
      },
      {
        judul: "Penutup & evaluasi",
        rentang: "M8",
        desc: "Memastikan seluruh laporan teknis sah dan lengkap.",
        langkah: [
          {
            k: "Evaluasi laporan teknis",
            a: "Tinjau ulang kelengkapan Bab IV beserta lampiran (surat pernyataan, berita acara, log kegiatan) sebelum pengumpulan akhir.",
            cara: [
              "Cek kelengkapan Bab IV beserta lampiran satu per satu.",
              "Pastikan berita acara dan log kegiatan tersedia.",
              "Siapkan file final sebelum tenggat pengumpulan.",
            ],
            hasil: "Laporan teknis lengkap dan siap dikumpulkan.",
          },
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
          {
            k: "Menerima peta topik pencarian jurnal",
            a: "Catat daftar topik yang diberikan ketua kelompok (5 topik bahasa Indonesia dan 4 topik bahasa Inggris) sebagai panduan pencarian.",
            cara: [
              "Buka daftar topik yang dikirim Fadhil di grup.",
              "Simpan daftarnya di catatan pribadi.",
              "Kelompokkan 5 topik bahasa Indonesia dan 4 topik bahasa Inggris.",
            ],
            hasil: "Peta riset tercatat lengkap dan siap dipakai mencari.",
          },
          {
            k: "Mencari jurnal 5 tahun terakhir",
            a: "Cari 5–10 jurnal yang relevan per pilar topik: sistem informasi pengadaan berbasis web, metode RAD, pengendalian stok min-max, otomasi workflow approval, dan analisis downtime.",
            cara: [
              "Buka Google Scholar atau portal jurnal kampus/UT.",
              "Gunakan kata kunci per pilar: sistem pengadaan berbasis web, RAD, min-max stock, workflow approval, analisis downtime.",
              "Pilih jurnal 5 tahun terakhir.",
              "Kumpulkan minimal 5–10 jurnal yang relevan.",
            ],
            hasil: "Kumpulan jurnal terpilih (target 5–10).",
          },
          {
            k: "Menyeleksi dan mengunduh sumber",
            a: "Pilih jurnal yang benar-benar mendukung pembahasan, simpan referensinya, dan siapkan daftar pustaka yang bisa dilacak (penulis, tahun, judul, jurnal, tautan).",
            cara: [
              "Baca abstrak tiap jurnal untuk memastikan dukungannya.",
              "Catat metadata: penulis, tahun, judul, nama jurnal, tautan.",
              "Simpan berkas PDF di folder riset.",
              "Susun daftar pustaka sementara.",
            ],
            hasil: "Daftar pustaka terkelola dan bisa dilacak.",
          },
        ],
      },
      {
        judul: "Menulis Bab I & II",
        rentang: "M1–M2",
        desc: "Langkah seorang penulis menyusun bab pembuka laporan.",
        langkah: [
          {
            k: "Menyusun Bab I — Pendahuluan",
            a: "Tulis latar belakang masalah (pakai problem statement dan data downtime 305 menit dari ketua kelompok), rumusan masalah, tujuan (SMART), manfaat, ruang lingkup, dan jadwal kegiatan.",
            cara: [
              "Tulis latar belakang berbasis problem statement + data downtime 305 menit.",
              "Tulis rumusan masalah.",
              "Tulis tujuan penelitian dengan format SMART.",
              "Tulis manfaat dan ruang lingkup.",
              "Buat jadwal kegiatan 8 minggu yang konsisten.",
            ],
            hasil: "Draf Bab I utuh (Pendahuluan).",
          },
          {
            k: "Menyusun Bab II — Kajian Pustaka & Landasan Teori",
            a: "Sintesis literatur yang ditemukan menjadi kajian pustaka per pilar, susun landasan teori, lalu tutup dengan pertanyaan penelitian dan hipotesis (H1–H3).",
            cara: [
              "Sintesis literatur per pilar menjadi kajian pustaka (hindari copas mentah).",
              "Susun landasan teori (sistem informasi, RAD, min-max stock, RBAC).",
              "Tulis pertanyaan penelitian.",
              "Tulis hipotesis H1–H3.",
              "Hindari istilah di luar lingkup proyek (mis. IoT/Blockchain).",
            ],
            hasil: "Draf Bab II utuh dengan sitasi.",
          },
          {
            k: "Mengunggah hasil & meminta review",
            a: "Simpan Bab I dan II ke Google Drive (lengkap dengan jurnal pendukung), lalu beri tahu ketua kelompok dan minta dicek/dikoreksi.",
            cara: [
              "Buat/isi gdoc Bab I dan Bab II di Drive.",
              "Unggah jurnal pendukung (PDF) bersamanya.",
              "Tandai/ping Fadhil minta dicek dan dikoreksi.",
            ],
            hasil: "Bab I-II terunggah + permintaan review tersampaikan.",
          },
          {
            k: "Menyempurnakan hasil revisi",
            a: "Kerjakan catatan revisi satu per satu: cantumkan ilustrasi Why-Why, ubah jadwal jadi 8 minggu, hapus rentang waktu yang tidak cocok, hilangkan sebutan IoT/Blockchain, dan samakan poin pertanyaan dengan tujuan penelitian.",
            cara: [
              "Tambahkan gambar/ilustrasi Why-Why Analysis.",
              "Ubah jadwal kegiatan menjadi 8 minggu.",
              "Hapus rentang waktu yang tidak cocok dengan jadwal CP.",
              "Hapus sebutan IoT dan Blockchain.",
              "Samakan poin pertanyaan penelitian dengan tujuan penelitian.",
            ],
            hasil: "5 catatan revisi selesai dikerjakan.",
          },
        ],
      },
      {
        judul: "Tugas 1 — Finalisasi Proposal",
        rentang: "M3",
        desc: "Menutup bab pendahuluan yang dijadikan syarat submit.",
        langkah: [
          {
            k: "Finalisasi Bab I & II + jadwal kegiatan",
            a: "Pastikan isi Bab I–II sudah sesuai arahan dan jadwal kegiatan memakai rentang 8 minggu CP.",
            cara: [
              "Cek semua catatan revisi sudah dikerjakan.",
              "Pastikan jadwal kegiatan memakai rentang 8 minggu CP.",
              "Periksa kelengkapan daftar pustaka.",
            ],
            hasil: "Bab I-II final siap digabungkan ke proposal.",
          },
          {
            k: "Menyerahkan ke ketua untuk format & submit",
            a: "Berikan bab final ke ketua kelompok agar digabung, di-format, dan di-submit sebagai Tugas 1.",
            cara: [
              "Kirim tautan file final ke Fadhil.",
              "Tandai bagian yang masih diragukan (jika ada).",
              "Tunggu konfirmasi setelah di-format dan di-submit.",
            ],
            hasil: "Tugas submit Proposal berpindah ke ketua.",
          },
        ],
      },
      {
        judul: "Iterasi berdasarkan umpan balik",
        rentang: "M4",
        desc: "Perawatan kualitas bab pendahuluan.",
        langkah: [
          {
            k: "Revisi Bab I & II sesuai feedback tutor",
            a: "Terjemahkan komentar dosen/tutor menjadi perbaikan isi.",
            cara: [
              "Catat komentar tutor satu per satu.",
              "Kelompokkan menjadi perubahan isi vs perubahan format.",
              "Perbaiki lalu perbarui di Drive.",
            ],
            hasil: "Feedback tutor masuk ke Bab I-II.",
          },
          {
            k: "Kelola daftar pustaka",
            a: "Rapikan referensi, tambahkan yang baru, dan pastikan semua sitasi tercantum lengkap.",
            cara: [
              "Periksa semua sitasi tercantum dalam daftar pustaka.",
              "Tambahkan referensi baru bila diperlukan.",
              "Rapikan format bibliografi agar konsisten.",
            ],
            hasil: "Daftar pustaka rapi dan lengkap.",
          },
        ],
      },
      {
        judul: "Tugas 2 — Laporan Kemajuan",
        rentang: "M5",
        desc: "Menulis kembali bab pendahuluan dalam dokumen kemajuan.",
        langkah: [
          {
            k: "Tulis Bab I, II, V Laporan Kemajuan",
            a: "Perbarui konten sesuai perkembangan proyek; tulis Bab V (penutup sementara).",
            cara: [
              "Perbarui isi Bab I-II sesuai perkembangan.",
              "Tulis Bab V (penutup sementara).",
              "Sisipkan data/progres terbaru.",
            ],
            hasil: "Bab baru versi laporan kemajuan.",
          },
          {
            k: "Formatting & submit",
            a: "Rapikan sesuai pedoman, gabungkan dengan bab lain, lalu submit bersama ketua.",
            cara: [
              "Rapikan format sesuai pedoman UT.",
              "Gabungkan dengan bab dari anggota lain.",
              "Submit bersama ketua.",
            ],
            hasil: "Tugas 2 terkumpul.",
          },
        ],
      },
      {
        judul: "Laporan Akhir",
        rentang: "M6",
        desc: "Mencerahkan versi final laporan.",
        langkah: [
          {
            k: "Finalisasi Bab I, II, V, VI",
            a: "Sempurnakan seluruh bab pendahuluan dan penutup untuk Laporan Akhir.",
            cara: [
              "Perbarui dengan data final.",
              "Sempurnakan kesimpulan dan saran (Bab V/VI).",
              "Cek konsistensi antar-bab.",
            ],
            hasil: "Versi final bab-bab Sarifah di laporan akhir.",
          },
        ],
      },
      {
        judul: "Karya Ilmiah",
        rentang: "M7",
        desc: "Menyesuaikan tulisan dengan format artikel.",
        langkah: [
          {
            k: "Konversi Bab I, II, V ke seksi Umum Karya Ilmiah",
            a: "Sesuaikan isi dengan format karya ilmiah yang diminta.",
            cara: [
              "Ikuti template karya ilmiah yang diminta.",
              "Ringkas bab menjadi seksi pendahuluan & kesimpulan.",
              "Selaraskan format sitasi.",
            ],
            hasil: "Seksi Umum karya ilmiah siap digabung.",
          },
          {
            k: "Menyusun Berita Acara",
            a: "Siapkan berita acara kerja kelompok sebagai lampiran.",
            cara: [
              "Kumpulkan ringkasan kegiatan per pertemuan.",
              "Susun format berita acara standar UT.",
              "Minta konfirmasi/tanda tangan semua anggota.",
            ],
            hasil: "Berita acara siap menjadi lampiran.",
          },
        ],
      },
      {
        judul: "Arsip akhir",
        rentang: "M8",
        desc: "Mengamankan seluruh dokumen resmi.",
        langkah: [
          {
            k: "Arsipkan dokumen final",
            a: "Simpan semua versi final laporan dan karya ilmiah di tempat yang rapi dan dapat diaudit.",
            cara: [
              "Kumpulkan versi final proposal, kemajuan, laporan akhir, karya ilmiah.",
              "Simpan rapi di folder Drive sesuai subfolder.",
              "Catat daftar tautan di satu tempat.",
            ],
            hasil: "Arsip final terdokumentasi rapi.",
          },
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
          {
            k: "Perkenalan di grup",
            a: "Sapa seluruh anggota, beri tahu nama dan profesi, serta minta maaf karena bergabung di tengah diskusi.",
            cara: [
              "Sapa semua anggota di grup.",
              "Kenalkan nama dan profesi (UI/UX Designer).",
              "Sampaikan maaf karena bergabung lebih lambat.",
            ],
            hasil: "Kehadiran anggota baru tercatat di grup.",
          },
          {
            k: "Memahami pembagian tugas",
            a: "Pelajari posisi sebagai spesialis visual/media: PPT, poster A4, skrip & video demo, forum; pahami pula bahwa Bab III kini ditangani Giren.",
            cara: [
              "Baca ulang posisi sebagai spesialis visual & media.",
              "Kenali lingkup: PPT, poster A4, skrip & video demo, forum.",
              "Pahami bahwa Bab III kini ditangani Giren.",
              "Tanya bila ada bagian yang kurang jelas.",
            ],
            hasil: "Posisi dan lingkup kerja dipahami jelas.",
          },
          {
            k: "Menerima amanah PPT & poster",
            a: "Catat instruksi ketua kelompok untuk mulai menyusun PPT dan poster, dengan outline materi (latar belakang, dll.) yang tersedia di folder bahan.",
            cara: [
              "Catat instruksi ketua: mulai menyusun PPT dan poster.",
              "Buka folder Bahan untuk outline materi.",
              "Buat rencana mulai mengerjakan dua produk tersebut.",
            ],
            hasil: "Tugas PPT & poster diterima resmi.",
          },
          {
            k: "Menetapkan kebijakan visual",
            a: "Tanyakan hal-hal yang butuh persetujuan anggota—misalnya pemakaian foto di slide anggota kelompok—dan kumpulkan persetujuannya.",
            cara: [
              "Tanyakan ke grup: bolehkah menampilkan foto anggota di slide?",
              "Kumpulkan jawaban tiap anggota.",
              "Catat keputusan dan lanjutkan pengerjaan.",
            ],
            hasil: "Kebijakan visual (foto slide) terkunci oleh persetujuan anggota.",
          },
        ],
      },
      {
        judul: "Membangun kerangka visual",
        rentang: "M1–M2",
        desc: "Langkah desainer menyiapkan wajah proyek dari awal.",
        langkah: [
          {
            k: "Menyiapkan template PPT",
            a: "Tentukan skema warna, tipografi, dan tata letak slide yang konsisten dengan identitas proyek, siap untuk diisi konten kapan saja.",
            cara: [
              "Tentukan palet warna yang senada identitas proyek.",
              "Pilih tipografi untuk judul dan isi.",
              "Buat master slide: judul, daftar isi, isi, penutup.",
              "Simpan template di folder Bahan.",
            ],
            hasil: "Template PPT siap diisi konten.",
          },
          {
            k: "Menyiapkan template poster A4",
            a: "Buat kerangka poster satu halaman: judul, latar belakang, solusi, alur, hasil, dan identitas penulis.",
            cara: [
              "Buat kanvas berukuran A4.",
              "Atur zona: judul, latar belakang, solusi, alur, hasil, identitas.",
              "Sisipkan placeholder untuk gambar dan teks.",
            ],
            hasil: "Kerangka poster A4 siap diisi.",
          },
          {
            k: "Membuat visualisasi diagram alur/arsitektur",
            a: "Ubah hasil diskusi (misalnya alur pengajuan & RBAC dari ketua) menjadi visual yang enak dibaca untuk bahan slide dan poster.",
            cara: [
              "Kumpulkan hasil diskusi (flow pengajuan, RBAC, alur sistem).",
              "Gambar alur dengan tool pilihan (Figma/Canva).",
              "Pastikan label menunya konsisten dengan aplikasi.",
            ],
            hasil: "Visual alur siap dipakai di slide dan poster.",
          },
        ],
      },
      {
        judul: "Tugas 1 — Mendukung Proposal",
        rentang: "M3",
        desc: "Kontribusi visual agar proposal tampil rapi.",
        langkah: [
          {
            k: "Membantu tata letak visual Proposal",
            a: "Sumbang keahlian desain untuk kerapian dokumen proposal sebelum dikirim.",
            cara: [
              "Minta file draft proposal yang sedang disusun.",
              "Perbaiki kerapian tabel, gambar, dan spasi.",
              "Beri saran tata letak halaman bila perlu.",
            ],
            hasil: "Proposal tampil lebih rapi sebelum submit.",
          },
          {
            k: "Aktif di forum diskusi M3",
            a: "Ikut serta dalam diskusi resmi tuton sebagai bagian keaktifan kelompok.",
            cara: [
              "Cek jadwal forum di minggu M3.",
              "Pilih topik diskusi yang relevan dengan proyek.",
              "Tulis tanggapan yang bermakna sesuai kapasitas media.",
            ],
            hasil: "Keaktifan forum tercatat atas nama kelompok.",
          },
        ],
      },
      {
        judul: "Menyiapkan materi presentasi",
        rentang: "M4",
        desc: "Langkah awal dari dua produk utama: video dan poster.",
        langkah: [
          {
            k: "Menulis skrip video demo",
            a: "Buat naskah penjelasan aplikasi dari alur sistem: login, cek stok, isi BQ, approval, monitoring.",
            cara: [
              "Susun alur cerita: login, cek stok, isi BQ, approval, monitoring.",
              "Tulis narasi singkat per adegan.",
              "Cocokkan dengan menu aplikasi yang sebenarnya.",
            ],
            hasil: "Naskah video demo siap direkam.",
          },
          {
            k: "Membuat draf poster A4",
            a: "Isi kerangka poster dengan konten sementara yang sudah tersedia.",
            cara: [
              "Isi template poster dengan konten sementara.",
              "Atur keseimbangan visual teks dan gambar.",
              "Kumpulkan masukan anggota.",
            ],
            hasil: "Draf poster pertama selesai.",
          },
        ],
      },
      {
        judul: "Tugas 2 — PPT Laporan Kemajuan",
        rentang: "M5",
        desc: "Menurunkan laporan kemajuan menjadi presentasi.",
        langkah: [
          {
            k: "Menyusun 8–12 slide PPT Laporan Kemajuan",
            a: "Rangkai slide: judul, anggota, latar belakang, tujuan, metode, hasil, kendala, dan rencana lanjut, sesuai jatah slide yang diminta.",
            cara: [
              "Susun narasi: judul, anggota, latar belakang, tujuan, metode, hasil, kendala, rencana lanjut.",
              "Isi dengan data dan grafik kemajuan terkini.",
              "Pastikan jumlah slide sesuai jatah (8–12).",
            ],
            hasil: "PPT Laporan Kemajuan siap.",
          },
        ],
      },
      {
        judul: "Pengumpulan rekaman anggota",
        rentang: "M6",
        desc: "Mengumpulkan bahan suara/gambar untuk video demo.",
        langkah: [
          {
            k: "Mengumpulkan rekaman video/suara anggota 1–5",
            a: "Atur jadwal perekaman, beri panduan singkat ke tiap anggota, lalu kumpulkan hasilnya rapi.",
            cara: [
              "Buat jadwal perekaman per anggota.",
              "Kirim panduan singkat (durasi, konten, kondisi kamera).",
              "Kumpulkan file dan beri nama rapi.",
            ],
            hasil: "Seluruh rekaman anggota terkumpul.",
          },
        ],
      },
      {
        judul: "Tugas 3 — Publikasi final",
        rentang: "M7",
        desc: "Merampungkan dan mengunggah semua media publikasi.",
        langkah: [
          {
            k: "Menyunting video YouTube",
            a: "Gabungkan rekaman demo aplikasi + suara anggota menjadi video final yang jelas dan tak terlalu panjang.",
            cara: [
              "Gabungkan rekaman demo aplikasi dan suara anggota.",
              "Tambahkan teks dan gambar pembuka.",
              "Jaga durasi ringkas, lalu render versi final.",
            ],
            hasil: "Video final siap diunggah.",
          },
          {
            k: "Menyelesaikan Poster A4 & PPT final",
            a: "Finalisasi poster dan slide presentasi untuk pengumpulan tugas 3.",
            cara: [
              "Perbarui poster dan PPT dengan data final.",
              "Cek konsistensi warna dan keterbacaan.",
              "Export versi final.",
            ],
            hasil: "Poster A4 & PPT final.",
          },
          {
            k: "Upload semua media",
            a: "Unggah video ke YouTube, poster dan PPT ke Drive/link resmi, lalu bagikan tautannya.",
            cara: [
              "Unggah video ke YouTube.",
              "Unggah poster dan PPT ke Drive/link resmi.",
              "Bagikan tautan ke grup dan simpan bukti.",
            ],
            hasil: "Semua media publikasi ter-upload.",
          },
        ],
      },
      {
        judul: "Penutup",
        rentang: "M8",
        desc: "Memastikan media tetap bisa diakses saat evaluasi.",
        langkah: [
          {
            k: "Cek link YouTube tetap aktif",
            a: "Uji tautan video sebelum dan saat sesi evaluasi agar tidak rusak.",
            cara: [
              "Buka dan uji tautan video.",
              "Cek ulang menjelang dan saat sesi evaluasi.",
              "Siapkan tautan cadangan bila perlu.",
            ],
            hasil: "Media tetap bisa diakses saat evaluasi.",
          },
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
          {
            k: "Bergabung & membuka ruang ide",
            a: "Sapa grup dan nyatakan kesiapan; ajak anggota berbagi ide untuk didiskusikan bersama.",
            cara: [
              "Sapa grup dan nyatakan kesiapan.",
              "Ajak anggota membagikan ide di grup.",
              "Siap menerima hasil diskusi.",
            ],
            hasil: "Partisipasi aktif tercatat di hari pertama.",
          },
          {
            k: "Mengikuti mekanisme pemilihan jadwal",
            a: "Ikut serta dalam polling jadwal diskusi bersama anggota lain.",
            cara: [
              "Buka polling jadwal yang dibuat ketua.",
              "Pilih salah satu opsi waktu.",
              "Konfirmasi selesai voting.",
            ],
            hasil: "Jadwal diskusi disetujui oleh semua anggota.",
          },
          {
            k: "Menyetujui pengalihan tugas Bab III",
            a: "Ketika ketua mengusulkan agar penyusunan Bab III (dengan banyak diagram) berpindah ke Giren, respons dengan persetujuan yang jelas agar tim lanjut bergerak.",
            cara: [
              "Baca usulan ketua mengenai pengalihan Bab III.",
              "Beri persetujuan yang jelas di grup.",
            ],
            hasil: "Pembagian tugas terkunci dan tim melanjutkan.",
          },
          {
            k: "Menerima kerangka & diagram awal",
            a: "Terima draf kerangka Bab III dan diagram awal dari ketua; catat arahan: rapikan dengan Visio/DrawIO dan selaraskan tentatif dengan aplikasi yang dikembangkan.",
            cara: [
              "Akses dokumen 'Draft Bab 3 CP 127 A' di Drive.",
              "Pelajari kerangka dan diagram kasar.",
              "Catat arahan: rapikan Visio/DrawIO, selaraskan dengan aplikasi.",
            ],
            hasil: "Kerangka Bab III dipahami sepenuhnya.",
          },
          {
            k: "Mempelajari alur sistem & RBAC",
            a: "Kuasai flow dan hak akses setiap peran pengguna sebagai dasar akurat untuk menggambar diagram.",
            cara: [
              "Baca dokumen flow & RBAC dari ketua.",
              "Catat menu setiap peran.",
              "Tanyakan bagian yang belum jelas.",
            ],
            hasil: "Dasar pemodelan diagram akurat.",
          },
        ],
      },
      {
        judul: "Menyusun metodologi penelitian",
        rentang: "M1–M2 / M3",
        desc: "Langkah analis menuliskan cara penelitian dan perekayasaan.",
        langkah: [
          {
            k: "Menetapkan pendekatan penelitian",
            a: "Gunakan Mixed Methods (kualitatif + kuantitatif) dalam kerangka RAD dan Continual Improvement—jelaskan alasan pemilihan paradigma pragmatisme.",
            cara: [
              "Tulis pemilihan Mixed Methods (kualitatif + kuantitatif).",
              "Kaitkan dengan kerangka RAD dan Continual Improvement.",
              "Jelaskan alasan paradigma pragmatisme.",
            ],
            hasil: "Pendekatan & paradigma penelitian tertulis lengkap.",
          },
          {
            k: "Menentukan lokasi, waktu, dan subjek",
            a: "Tulis lokasi (Lini Steril Dept. Engineering PT Fonko), rentang waktu, dan teknik Purposive Sampling pada 6 peranan: Manager, SPV1, SPV2, Engineering Officer, 10 Teknisi, Administrator.",
            cara: [
              "Tulis lokasi: Lini Steril Dept. Engineering PT Fonko.",
              "Tulis rentang waktu penelitian.",
              "Tulis teknik Purposive Sampling.",
              "Rinci subjek: Manager, SPV1, SPV2, Engineering Officer, 10 Teknisi, Administrator.",
            ],
            hasil: "Lokasi, waktu, dan subjek terdokumentasi.",
          },
          {
            k: "Menyusun teknik pengumpulan data",
            a: "Uraikan 4 teknik: observasi lapangan, wawancara terstruktur & FGD, studi dokumentasi (log EJO 305 menit, PR/PO, min-max), dan kuesioner dikotomis/Likert.",
            cara: [
              "Uraikan observasi lapangan.",
              "Uraikan wawancara terstruktur dan FGD.",
              "Uraikan studi dokumentasi (EJO 305 menit, PR/PO, min-max).",
              "Uraikan kuesioner dikotomis/Likert.",
            ],
            hasil: "Empat teknik pengumpulan data ditulis lengkap.",
          },
          {
            k: "Menyusun teknik analisis data",
            a: "Jelaskan Why-Why & Fishbone, audit parameter stok min-max, analisis isi (content analysis), dan statistika deskriptif & komparatif.",
            cara: [
              "Jelaskan teknik Why-Why dan Fishbone.",
              "Jelaskan audit parameter stok min-max.",
              "Jelaskan analisis isi (content analysis).",
              "Jelaskan statistika deskriptif & komparatif.",
            ],
            hasil: "Metode analisis data tertulis lengkap.",
          },
        ],
      },
      {
        judul: "Merancang sistem (perancangan & pemodelan)",
        rentang: "M1–M2 / M3",
        desc: "Langkah inti pembuatan seluruh diagram perancangan.",
        langkah: [
          {
            k: "Membuat context diagram / DFD level 0",
            a: "Gambarkan interaksi sistem dengan entitas eksternal secara global.",
            cara: [
              "Identifikasi entitas eksternal (teknisi, officer, SPV, manager, admin).",
              "Gambar sistem sebagai satu proses global di DrawIO.",
              "Beri label alur data masuk dan keluar.",
            ],
            hasil: "Context diagram / DFD level 0.",
          },
          {
            k: "Membuat DFD level 1",
            a: "Pecah 4 proses utama: Kelola Master Stok & Critical Part, Pengajuan Form BQ, Verifikasi & Approval Multi-Tier, dan Monitoring & Reporting.",
            cara: [
              "Pecah proses jadi 4 modul (master stok & critical part, pengajuan BQ, verifikasi & approval, monitoring & reporting).",
              "Hubungkan tiap proses dengan data store.",
              "Cek konsistensi label antar level.",
            ],
            hasil: "DFD level 1 lengkap.",
          },
          {
            k: "Membuat flowchart system",
            a: "Gambar alur pengajuan BQ & verification loop, serta alur preventive replenishment critical sparepart.",
            cara: [
              "Gambar alur pengajuan BQ dan loop verifikasinya.",
              "Gambar alur preventive replenishment critical sparepart.",
              "Pastikan ada decision point (Normal/Urgent, approve/reject).",
            ],
            hasil: "Flowchart sistem untuk dua alur utama.",
          },
          {
            k: "Membuat use case diagram & activity diagram",
            a: "Petakan aktor-label-aksi (login, cek stok, isi BQ, approval, monitoring) dan aktivitas-aktivitas sistem berurutan.",
            cara: [
              "Petakan aktor dan use case utama.",
              "Beri label aksi: login, cek stok, isi BQ, approval, monitoring.",
              "Buat activity diagram untuk alur utama.",
            ],
            hasil: "Use case diagram & activity diagram.",
          },
          {
            k: "Merancang ERD & spesifikasi tabel",
            a: "Susun diagram relasi dan rinci tabel: USERS, FORM_BQ, DETAIL_BQ, STOCK_GUDANG_CRITICAL, APPROVAL_LOG beserta kolom-kunci.",
            cara: [
              "Gambar relasi antar tabel utama (USERS, FORM_BQ, DETAIL_BQ, STOCK_GUDANG_CRITICAL, APPROVAL_LOG).",
              "Tulis kolom kunci setiap tabel.",
              "Validasi ke developer agar cocok dengan database aplikasi.",
            ],
            hasil: "ERD + spesifikasi tabel.",
          },
          {
            k: "Merancang antarmuka (UI)",
            a: "Gambarkan halaman login, dashboard RBAC, BQ personal/summary, pencarian on-hand, critical part list, form approval, dan embed Monthly Report—sesuai aplikasi nyata.",
            cara: [
              "Gambar halaman login dan dashboard per role.",
              "Gambar BQ personal & summary, pencarian on-hand, critical part list.",
              "Gambar form approval.",
              "Sisipkan tampilan embed Monthly Report.",
              "Samakan menu dengan aplikasi yang sedang dibuat.",
            ],
            hasil: "Rancangan UI selaras aplikasi nyata.",
          },
          {
            k: "Menuliskan pengujian, implementasi, pemeliharaan",
            a: "Rincikan Black Box & UAT, lalu tahap migrasi data, penerbitan kredensial, sosialisasi SOP, go-live, serta FGD dan pemeliharaan berkala.",
            cara: [
              "Tulis rencana pengujian Black Box dan UAT.",
              "Tulis tahap implementasi: migrasi data, kredensial, sosialisasi SOP, go-live.",
              "Tulis jadwal FGD dan pemeliharaan berkala.",
            ],
            hasil: "Rincian pengujian & implementasi.",
          },
          {
            k: "Merapikan seluruh diagram",
            a: "Rapikan setiap diagram dengan Visio/DrawIO agar jelas, konsisten, dan diselaraskan dengan fitur aplikasi.",
            cara: [
              "Cek tiap diagram dari segi label, konsistensi, dan ukuran.",
              "Rapikan dengan Visio/DrawIO menjadi satu file rapi.",
              "Selaraskan dengan fitur aplikasi yang sudah berjalan.",
            ],
            hasil: "Seluruh diagram final dan konsisten.",
          },
        ],
      },
      {
        judul: "Tugas 1 — Menuntaskan Bab III Proposal",
        rentang: "M3",
        desc: "Menyerahkan bagian metodologi yang siap digabung.",
        langkah: [
          {
            k: "Finalisasi Bab III Proposal",
            a: "Pastikan metodologi, perancangan, dan seluruh diagram lengkap lalu serahkan ke ketua untuk digabung & di-submit.",
            cara: [
              "Cek kelengkapan metodologi dan seluruh diagram.",
              "Perbaiki bagian yang belum jelas.",
              "Serahkan file final ke Fadhil untuk digabung & di-submit.",
            ],
            hasil: "Bab III final siap digabung ke proposal.",
          },
        ],
      },
      {
        judul: "Iterasi berdasarkan umpan balik",
        rentang: "M4",
        desc: "Perawatan kualitas metode & diagram.",
        langkah: [
          {
            k: "Revisi Bab III & diagram sesuai feedback tutor",
            a: "Perbaiki isi dan gambar sesuai komentar dosen.",
            cara: [
              "Catat komentar tutor.",
              "Perbaiki isi dan gambar diagram.",
              "Perbarui versi di Drive.",
            ],
            hasil: "Revisi tutor masuk ke Bab III.",
          },
        ],
      },
      {
        judul: "Laporan Kemajuan & Laporan Akhir",
        rentang: "M5–M6",
        desc: "Menulis ulang dan memantapkan bagian metodologi.",
        langkah: [
          {
            k: "Tulis Bab III Laporan Kemajuan",
            a: "Perbarui metode dan perancangan sesuai perkembangan aplikasi.",
            cara: [
              "Perbarui metode sesuai perkembangan aplikasi.",
              "Sinkronkan diagram dengan fitur terbaru.",
            ],
            hasil: "Bab III versi laporan kemajuan.",
          },
          {
            k: "Finalisasi Bab III + penyempurnaan diagram",
            a: "Sempurnakan semua diagram untuk Laporan Akhir.",
            cara: [
              "Perbaiki seluruh diagram untuk laporan akhir.",
              "Pastikan konsisten dengan hasil aplikasi di Bab IV.",
            ],
            hasil: "Bab III final laporan akhir.",
          },
        ],
      },
      {
        judul: "Karya Ilmiah & evaluasi",
        rentang: "M7–M8",
        desc: "Menyesuaikan ke format artikel dan evaluasi akhir.",
        langkah: [
          {
            k: "Konversi Bab III ke seksi Metodologi Karya Ilmiah",
            a: "Sesuaikan isi dengan format karya ilmiah dan integrasikan diagram.",
            cara: [
              "Ikuti template karya ilmiah.",
              "Ringkas metode dan integrasikan diagram.",
              "Selaraskan format sitasi.",
            ],
            hasil: "Seksi Metodologi karya ilmiah.",
          },
          {
            k: "Evaluasi kesesuaian dokumen final",
            a: "Periksa konsistensi metodologi dan pemodelan sebelum pengumpulan akhir.",
            cara: [
              "Cek konsistensi metodologi dan pemodelan.",
              "Validasi dengan hasil yang ada di Bab IV.",
            ],
            hasil: "Dokumen metodologi final konsisten.",
          },
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
const CK_KEY = "ck_a127_v3";
const WHO_KEY = "ck_a127_who";
const TOUR_DONE = "ck_a127_tour_done_";
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
      <p class="small muted" style="margin-top:16px;">Halaman ini berisi analisa per anggota: <strong>kerangka kerja lengkap dari awal sampai selesai</strong> (langkahnya kecil-kecil, disusun dengan bahasa orang dewasa), <strong>catatan singkat kontribusi</strong>, <strong>checklist pengerjaan</strong>, serta <strong>keterkaitan antar pemegang peran</strong>. Setiap langkah juga sudah dipecah jadi <strong>sub-langkah</strong> yang bisa dicentang (ada penghitung kecil di samping judul langkah). Pilih nama di menu sebelah kiri.</p>
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
  const fase = m.fase.map((f, fi) => {
    const steps = f.langkah.map((s, si) => {
      const fkey = m.id + "." + fi + "." + si;
      const cara = (s.cara || []).map((c, ci) => {
        const sk = fkey + "." + ci;
        const on = savedChecks[sk] === true;
        return `<li><label class="sub-check ${on ? "on" : ""}"><input type="checkbox" data-sub="${fkey}" data-sk="${sk}" ${on ? "checked" : ""}/><span>${esc(c)}</span></label></li>`;
      }).join("");
      return `
        <div class="step">
          <div class="step-num">${fi + 1}.${si + 1}</div>
          <div>
            <h4>${esc(s.k)} ${cara ? `<span class="sub-prog" data-sp="${fkey}"></span>` : ""}</h4>
            <p class="step-a">${esc(s.a)}</p>
            ${cara ? `<ul class="substeps">${cara}</ul>` : ""}
            ${s.hasil ? `<div class="hasil">${esc(s.hasil)}</div>` : ""}
          </div>
        </div>`;
    }).join("");
    return `
      <div class="fase">
        <div class="fase-head">
          <div>
            <span class="fase-badge">${esc(f.rentang)}</span>
            <h3>${fi + 1}. ${esc(f.judul)}</h3>
          </div>
          <p class="fase-desc">${esc(f.desc)}</p>
        </div>
        <div class="steps">${steps}</div>
      </div>`;
  }).join("");

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
    ["bukti", "Jejak kontribusi", "var(--ink)"],
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
      <p class="muted">Langkah-langkah kecil urut dari paling awal hingga penutup proyek. Di samping judul langkah ada penghitung sub-langkah (mis. 2/4) — centang tiap sub-langkah yang sudah dikerjakan.</p>
      ${fase}
    </section>

    <section id="bukti" class="section">
      <h2>Jejak kontribusi (berurutan)</h2>
      <p class="muted">Rangkaian kegiatan yang sudah dijalankan anggota beserta waktunya.</p>
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
      <p class="small muted" style="margin-top:10px;">Centang bisa diubah bebas dan tersimpan di browser ini. Tanda <strong>terverifikasi</strong> berarti pengerjaannya sudah tampak per 25 Sep 2026; tanda <strong>sedang dikerjakan</strong> berarti berjalan namun belum tuntas versi finalnya.</p>
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

  $app.querySelectorAll("[data-sub]").forEach((cb) =>
    cb.addEventListener("change", () => {
      savedChecks[cb.dataset.sk] = cb.checked;
      localStorage.setItem(CK_KEY, JSON.stringify(savedChecks));
      cb.closest(".sub-check").classList.toggle("on", cb.checked);
      updateSubProgress(cb.dataset.sub);
    })
  );

  updateProgress(m.id);
  document.querySelectorAll("[data-sp]").forEach((el) => updateSubProgress(el.dataset.sp));
}

function updateProgress(group) {
  const boxes = Array.from(document.querySelectorAll('[data-group="' + group + '"]'));
  const n = boxes.filter((b) => b.checked).length;
  const p = document.getElementById("pfill-" + group);
  const l = document.getElementById("plabel-" + group);
  if (p) p.style.width = (boxes.length ? Math.round((n / boxes.length) * 100) : 0) + "%";
  if (l) l.textContent = n + " dari " + boxes.length + " langkah ditandai selesai · " + (boxes.length ? Math.round((n / boxes.length) * 100) : 0) + "%";
}

function updateSubProgress(fkey) {
  const boxes = Array.from(document.querySelectorAll('[data-sub="' + fkey + '"]'));
  const n = boxes.filter((b) => b.checked).length;
  const el = document.querySelector('[data-sp="' + fkey + '"]');
  if (el) el.textContent = n + "/" + boxes.length;
}

/* ------------------------- tour (panduan menunjuk ke bagian) ------------------------- */

const TOURS = {
  home: [
    { sel: ".hero", judul: "Judul halaman ini", isi: "Ini halaman khusus kelompok kita. Judul di sini berisi topik proyek yang sedang dikerjakan, lengkap dengan mata kuliah, universitas, pembimbing, dan jadwalnya." },
    { sel: ".member-cards", judul: "Empat kartu anggota", isi: "Setiap kartu adalah satu anggota. Tinggal diklik untuk membuka halaman yang berisi tugas-tugasnya. Di kartu ini juga tertera peran dan NIM-nya." },
    { sel: ".timeline", judul: "Garis waktu kelompok", isi: "Ini rangkuman perjalanan kelompok dari awal sampai sekarang, jadi semua tahu kapan apa yang terjadi." },
    { sel: ".nav", judul: "Menu pindah halaman", isi: "Menu di kiri ini tempat berpindah antara beranda dan halaman masing-masing anggota." },
  ],
};

function memberTour() {
  return [
    { sel: ".mhero", judul: "Kartu identitas Anda", isi: "Kartu paling atas ini berisi nama lengkap, NIM, peran Anda di kelompok, dan satu kalimat status pekerjaan yang sedang berjalan. Huruf di kotak sebelah kiri adalah avatar untuk memudahkan menemukan Anda di menu." },
    { sel: "#ringkasan", judul: "Ringkasan peran", isi: "Sebelum masuk ke langkah-langkah, bagian ini menjelaskan gambaran besar: apa yang Anda kerjakan dan bagaimana itu membantu kelompok." },
    { sel: "#fase", judul: "Kerangka kerja lengkap", isi: "Ini bagian terpenting. Tugas diurutkan dari yang paling awal sampai selesai, lalu dibagi-bagi menjadi beberapa tahap. Mulailah dari tahap bernomor 1 dan berjalan ke bawah pelan-pelan." },
    { sel: "#fase .fase", judul: "Satu tahap kerja", isi: "Setiap kotak besar adalah satu tahap. Bagian atasnya menampilkan penanda minggu (misalnya M1–M2) dan judul tahap. Di bawahnya berisi langkah-langkah kerja." },
    { sel: "#fase .step", judul: "Langkah kerja bernomor", isi: "Ini satu langkah kerja, contohnya 1.1. Angka pertama menunjuk tahap ke berapa, angka kedua menunjuk langkah ke berapa. Baca judul dan keterangannya, lalu kerjakan urut dari atas." },
    { sel: "#fase .substeps", judul: "Sub-langkah yang bisa dicentang", isi: "Satu langkah besar dipecah lagi menjadi sub-langkah kecil. Selesai satu, centang satu. Di samping judul langkah ada penghitung seperti 2/4, jadi langsung terlihat berapa yang sudah beres." },
    { sel: "#fase .hasil", judul: "Kotak hasil", isi: "Kotak garis putus-putus ini mengingatkan apa yang seharusnya menjadi keluaran setelah langkah selesai. Kalau keluarnya belum ada, berarti langkah itu belum kelar." },
    { sel: "#bukti", judul: "Jejak kontribusi", isi: "Ini rangkuman waktu: kapan suatu kegiatan pernah dikerjakan. Berguna untuk menceritakan kemajuan saat diskusi atau mengecek progres." },
    { sel: "#checklist .card", judul: "Checklist pengerjaan", isi: "Ini rangkuman semua tugas dalam bentuk daftar centang, lengkap dengan tanda sudah selesai (terverifikasi) atau sedang dikerjakan. Ada tombol 'Reset centang' untuk mengulang dari nol." },
    { sel: "#kaitan", judul: "Keterkaitan dengan anggota lain", isi: "Bagian terakhir menunjukkan bahwa pekerjaan masing-masing orang saling berhubungan. Ini membantu melihat siapa yang perlu diajak bicara supaya tugas berjalan lancar." },
  ];
}

let tour = null;

function bindTour() {
  const start = document.getElementById("tour-start");
  const whoBox = document.getElementById("tour-who");
  const reopen = document.getElementById("guide-reopen");
  if (start && whoBox) {
    whoBox.querySelectorAll("[data-gotour]").forEach((b) =>
      b.addEventListener("click", () => {
        const who = b.dataset.gotour;
        localStorage.setItem(WHO_KEY, who);
        start.classList.remove("show");
        startTour(who);
      })
    );
  }
  if (reopen) reopen.addEventListener("click", () => { if (start) start.classList.add("show"); });
  const nextB = document.getElementById("tour-next");
  if (nextB) nextB.addEventListener("click", tourNext);
  const prevB = document.getElementById("tour-prev");
  if (prevB) prevB.addEventListener("click", tourPrev);
  const who = localStorage.getItem(WHO_KEY);
  if (who) {
    if (localStorage.getItem(TOUR_DONE + who) !== "1") startTour(who);
  } else if (start) {
    start.classList.add("show");
  }
}

function startTour(who) {
  const steps = who === "home" ? TOURS.home : memberTour();
  if (!steps || !steps.length) return;
  navigate(who);
  tour = { who, steps, idx: -1, el: null };
  tourNext();
}

function tourNext() {
  if (!tour) return;
  if (tour.idx + 1 >= tour.steps.length) { tourFinish(); return; }
  tour.idx += 1;
  renderTourStep();
}

function tourPrev() {
  if (!tour) return;
  if (tour.idx <= 0) return;
  tour.idx -= 1;
  renderTourStep();
}

let tourRaf = null;
function addTourListeners() {
  window.addEventListener("scroll", onTourReposition, true);
  window.addEventListener("resize", onTourReposition);
}
function removeTourListeners() {
  window.removeEventListener("scroll", onTourReposition, true);
  window.removeEventListener("resize", onTourReposition);
  if (tourRaf) { cancelAnimationFrame(tourRaf); tourRaf = null; }
}
function onTourReposition() {
  if (!tour || !tour.el) return;
  if (tourRaf) return;
  tourRaf = requestAnimationFrame(function () {
    tourRaf = null;
    if (tour && tour.el) positionTour(tour.el);
  });
}

function positionTour(el) {
  const sEl = document.getElementById("tour-spotlight");
  const card = document.getElementById("tour-bubble");
  if (!sEl || !card) return;
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardW = Math.min(420, vw - 24);
  card.style.width = cardW + "px";
  card.style.maxWidth = cardW + "px";
  const cardH = card.offsetHeight;
  const gap = 14;
  let top;
  if (r.top - cardH - gap > 12) {
    top = r.top - cardH - gap;
  } else {
    top = r.bottom + gap;
    if (top + cardH > vh - 12) top = Math.max(12, vh - cardH - 12);
  }
  const left = Math.min(Math.max(r.left + r.width / 2 - cardW / 2, 12), vw - cardW - 12);
  card.style.left = left + "px";
  card.style.top = top + "px";
  sEl.style.left = (r.left - 6) + "px";
  sEl.style.top = (r.top - 6) + "px";
  sEl.style.width = (r.width + 12) + "px";
  sEl.style.height = (r.height + 12) + "px";
}

function renderTourStep() {
  const overlay = document.getElementById("tour-overlay");
  const titleEl = document.getElementById("tour-title2");
  const descEl = document.getElementById("tour-desc");
  const stepEl = document.getElementById("tour-step");
  const dotsEl = document.getElementById("tour-dots");
  const prevEl = document.getElementById("tour-prev");
  const nextEl = document.getElementById("tour-next");
  if (!overlay || !titleEl) { tourFinish(); return; }
  const s = tour.steps[tour.idx];
  const el = document.querySelector(s.sel);
  if (!el) { tourNext(); return; }
  tour.el = el;
  titleEl.textContent = s.judul;
  descEl.textContent = s.isi;
  stepEl.textContent = (tour.idx + 1) + " / " + tour.steps.length;
  dotsEl.innerHTML = tour.steps.map((_, d) =>
    `<span class="t-dot ${d <= tour.idx ? "on" : ""}"></span>`).join("");
  const last = tour.idx === tour.steps.length - 1;
  nextEl.textContent = last ? "Selesai" : "Lanjut";
  prevEl.style.visibility = tour.idx > 0 ? "visible" : "hidden";
  overlay.classList.add("active");
  addTourListeners();
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { positionTour(el); });
  });
}

function tourFinish() {
  const overlay = document.getElementById("tour-overlay");
  if (overlay) overlay.classList.remove("active");
  removeTourListeners();
  if (tour) localStorage.setItem(TOUR_DONE + tour.who, "1");
  tour = null;
}

/* ------------------------- boot ------------------------- */
navigate("home");
bindTour();