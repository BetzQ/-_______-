/* ============================================================
   scripts/otomatis_rekam_demo.js
   Tujuan (M6 - "Rekam screen record demo aplikasi website"):
   Merekam video demo end-to-end aplikasi secara otomatis dengan
   CDP Page.startScreencast (PNG frames) -> ffmpeg (libx264) -> MP4.

   Output: docs/evidence/video/demo-aplikasi.mp4

   Jalankan: node scripts/otomatis_rekam_demo.js
   ============================================================ */

const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'evidence', 'video');
const VIDEO = path.join(OUT_DIR, 'demo-aplikasi.mp4');

const FFMPEG_PATH =
  process.env.FFMPEG_PATH ||
  'C:\\Users\\avwan\\AppData\\Local\\Programs\\Python\\Python312\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe';

const VIEWPORT = { width: 1440, height: 900 };
const MODALS = ['modal-stok', 'modal-bq', 'modal-bqsummary', 'modal-approval', 'modal-prsummary', 'modal-report', 'modal-riwayat'];

/** URL aplikasi dengan flag ?tour=off — aplikasi akan skip startTour() sepenuhnya. */
const appUrl = () => BASE + (BASE.includes('?') ? '&' : '?') + 'tour=off';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[REC] ' + m);

const ROLES_LS = ['teknisi', 'supervisor 1', 'supervisor 2', 'administrator', 'manager'];

/* ── Dynamic Hold Time ───────────────────────────────────────────────
   Ritme rekaman dijaga lincah: cukup sekejap untuk dilihat audiens, lalu
   langsung lanjut ke aksi berikutnya. TIDAK ada lagi jeda 4–5 detik.
   Aturan: input-form & pindah menu = 1 dtk · toast sukses = 1,5 dtk ·
   data padat saja yang boleh 2,5 dtk (maksimum). */
const HOLD = {
  TRANSITION: 350, // pindah elemen / mouse / scroll — cepat & natural
  FORM: 1000,      // jeda isian umum / pindah menu
  MENU: 1000,      // pindah menu / tile
  TOAST: 2000,     // Hold 2 dtk SETELAH aksi penting -> toast hijau sempat terbaca
  DENSE: 2500,     // data padat (tabel Approval BQ, Layout Rak, chart Monthly)
  TITLE: 2500,     // kartu judul
  CHAPTER: 1800,   // kartu bab
  SUBMIT: 1500,    // Hold 1,5 dtk TEPAT SEBELUM klik Submit / Approve / Reject
  BUFFER: 1500,    // Animation Buffer: WAJIB di antara render-selesai dan reading-hold.
                   // Dipakai di dalam holdRead(): waitDomReady resolve saat DOM terisi,
                   // BUKAN saat animasi CSS fade-in / counter / pie chart selesai. Beri
                   // 1,5 dtk agar visual stabil dulu, sehingga HOLD.MODAL_CLOSE (3 dtk)
                   // benar-benar terpakai untuk membaca.
  MODAL_CLOSE: 3000, // Hold 3 dtk (reading time) TEPAT SEBELUM klik close modal data
};

/* Kunci localStorage yang dipakai aplikasi untuk menandai tour sudah selesai.
   WAJIB sinkron dengan tourKey() di public/index.html — kalau berubah, rekaman
   akan ketutup overlay tour guide. prefixed 'v3_' = versi步骤 tour saat ini. */
const TOUR_KEY_PREFIX = 'tour_done_v3_';

/* ── Zero Animation Mode (ZAM) ────────────────────────────────────────
   Semua transisi/animasi CSS dimatikan biar modal, tabel & grafik langsung
   tampil UTUH (0 dtk). Pie Chart / bar Chart.js digambar sekaligus tanpa
   animasi memutar, sehingga tidak ada lagi "lingkaran terpotong". */
const ZERO_ANIM_CSS =
  '* { transition: none !important; animation: none !important; ' +
  'scroll-behavior: auto !important; } ' +
  'body { scroll-behavior: auto !important; }';

/** Matikan animasi global: (1) CSS force-kill, (2) Chart.js animation=false.
 *  Chart dibiarkan undefined (mis. belum dipakai) — guard di dalam. */
async function disableAnimations(page) {
  try {
    await page.addStyleTag({ content: ZERO_ANIM_CSS });
  } catch (e) { /* biarkan */ }
  try {
    await page.evaluate(() => {
      const setNoAnim = () => {
        if (!window.Chart) return;
        try { Chart.defaults.animation = false; } catch (e) {}
        try { Chart.defaults.animations = false; } catch (e) {}
        try { Chart.defaults.global && (Chart.defaults.global.animation = false); } catch (e) {}
      };
      setNoAnim();
      // Amankan juga kalau script Chart baru dimuat belakangan.
      const mo = new MutationObserver(setNoAnim);
      try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
    });
  } catch (e) { /* biarkan */ }
}

/* ── Frame Pulse (per-hold, aman) ─────────────────────────────────────
   CDP Page.startScreencast hanya memancarkan frame saat halaman REPAINT.
   Saat layar statis (hold baca), tidak ada repaint -> tidak ada frame -> di
   ffmpeg segmen hold "runtuh" sehingga penonton melihat modal terbuka lalu
   langsung tertutup padahal jeda walldock sudah benar. Pulse ini memaksa
   repaint kecil (opacity 1 <-> 0.999, tak terlihat mata) tiap ~100 ms agar
   SETIAP detik hold benar-benar terekam menjadi frame.
   PENTING: Pulse DI-ENCAPSULATE di dalam holdRead — interval dibuat SAAT hold
   dimulai dan di-CLEAR di `finally` bersama reset opacity. Tidak ada variabel
   global timer, tidak ada interval yang bocor/ke-skip ke langkah berikutnya. */
function holdLoop(page) {
  return setInterval(() => {
    page.evaluate(() => {
      const on = document.body.dataset.p === '1';
      document.body.style.opacity = on ? '1' : '0.999';
      document.body.dataset.p = on ? '0' : '1';
    }).catch(() => {});
  }, 100);
}
async function resetOpacity(page) {
  try {
    await page.evaluate(() => {
      document.body.style.opacity = '1';
      delete document.body.dataset.p;
    });
  } catch (e) { /* halaman sedang ganti — abaikan */ }
}

/** Matikan panduan (tour) agar rekaman tidak tertutup overlay guide.
 *  3 lapis: (1) set flag localStorage, (2) klik "Lewati", (3) paksa buang overlay
 *  dari DOM + matiin startTour() supaya tidak muncul lagi di tengah rekaman. */
async function disableTour(page) {
  try {
    await page.evaluate(
      (roles, prefix) => {
        // (1) Tandai semua role sudah pernah lihat tour
        roles.forEach((r) => {
          try { localStorage.setItem(prefix + r, '1'); } catch (e) {}
        });
        // (2) Klik tombol "Lewati" kalau overlay sedang aktif
        const ov = document.getElementById('tour-overlay');
        if (ov && ov.classList.contains('active')) {
          const skip = document.getElementById('tour-skip');
          if (skip) skip.click();
          else ov.classList.remove('active');
        }
        // (3) Paksa buang overlay & neutralize startTour() -> overlay tak akan muncul lagi
        const ov2 = document.getElementById('tour-overlay');
        if (ov2) ov2.parentNode && ov2.parentNode.removeChild(ov2);
        const sp = document.getElementById('tour-spotlight');
        if (sp) sp.style.display = 'none';
        try { window.startTour = function () {}; } catch (e) {}
      },
      ROLES_LS,
      TOUR_KEY_PREFIX
    );
  } catch (e) { /* halaman belum siap — abaikan */ }
}

async function waitVisible(page, id, timeout = 25000) {
  await page.waitForFunction(
    (x) => { const el = document.getElementById(x); return el && !el.classList.contains('hidden'); },
    { timeout }, id
  );
}

async function visibleModal(page) {
  return page.evaluate((ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden') && getComputedStyle(el).display !== 'none') return id;
    }
    return null;
  }, MODALS);
}

async function closeAllModals(page) {
  await page.evaluate((ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      try { if (typeof window.closeModal === 'function') window.closeModal(id); } catch (e) {}
      el.classList.add('hidden');
    }
  }, MODALS);
  await sleep(HOLD.TRANSITION);
}

async function waitTableReady(page, sel, loadingText = 'Memuat') {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page); // frame selama tabel memuat (ZAM mematikan spinner)
    try {
      await page.waitForFunction(
        (s, t) => {
          const tb = document.querySelector(s);
          if (!tb) return false;
          const trs = tb.querySelectorAll('tr');
          if (!trs.length) return false;
          return !Array.from(trs).some((tr) => (tr.textContent || '').includes(t));
        },
        { timeout: 25000 }, sel, loadingText
      );
    } catch (e) { /* biarkan */ }
  } finally {
    clearInterval(pulseInterval);   // wajib: interval tidak bocor
  }
}

/** Tunggu elemen konten benar-benar ter-render (generik, dipakai holdRead).
 *  Mendukung tabel/daftar (punya baris), teks (Riwayat), dan canvas (Chart.js). */
async function waitDomReady(page, sel, timeout = 20000) {
  try {
    await page.waitForFunction(
      (s) => {
        const el = document.querySelector(s);
        if (!el) return false;
        if (el.tagName === 'CANVAS') return el.width > 0 && el.height > 0;
        const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (/^(memuat|loading)/i.test(txt) && el.children.length <= 1) return false;
        return el.children.length > 0 || txt.length > 0;
      },
      { timeout }, sel
    );
  } catch (e) { /* biarkan */ }
}

/** holdRead — SATU pintu untuk setiap penutupan modal/popup data.
 *  STRICT BLOCKING: pulse dimulai SEJAK data dimuat (menutupi spinner "Memuat"
 *  yang animasinya sudah dimatikan ZAM), lalu (1) WAIT FOR DOM -> (2) ANIMATION
 *  BUFFER 1,5 dtk -> (3) READING HOLD 3 dtk = min. 4,5 dtk penahanan mutlak.
 *  Interval pulse SELALU dibersihkan di finally + opacity direset apa pun yang
 *  terjadi — tidak ada interval yang bocor ke langkah berikutnya. */
async function holdRead(page, sel, opts = {}) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);                     // mulai pulse (framing sejak load)
    await waitDomReady(page, sel, opts.timeout || 20000); // (1) tunggu konten masuk DOM (WAIT total)
    await sleep(HOLD.BUFFER);                           // (2) animation buffer 1,5 dtk (WAIT total)
    await sleep(opts.read || HOLD.MODAL_CLOSE);         // (3) reading hold 3 dtk (WAIT total)
    // Total penahanan mutlak = 4,5 dtk; tiap detiknya terekam sebagai frame.
  } finally {
    clearInterval(pulseInterval);                       // wajib: interval tidak bocor
    await resetOpacity(page);                           // wajib: opacity kembali 100%
  }
}

/** holdVisual — hold statis dengan Frame Pulse ter-encapsulate (thread-safe).
 *  Dipakai untuk layar/momen statis DI LUAR modal (login, logout, toast sukses,
 *  daftar padat, jeda menu) yang tidak memicu repaint sendiri. Tanpa pulse,
 *  segmen seperti ini "runtuh" di timeline karena ZAM mematikan spinner/CSS-anim
 *  yang biasanya menghasilkan frame. Interval dibuat & diclear dalam satu cakupan
 *  try/finally — tidak bisa bocor ke langkah berikutnya. */
async function holdVisual(page, ms) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);                     // mulai Frame Pulse lokal
    await sleep(ms);                                    // tahan layar (WAIT total)
  } finally {
    clearInterval(pulseInterval);                       // wajib: interval tidak bocor
    await resetOpacity(page);                           // wajib: opacity kembali 100%
  }
}

/** Network Data Waiter khusus grafik (Monthly Report).
 *  Skenario ini memuat data lewat fetch /api/reports/monthly SETELAH modal
 *  terbuka. Canvas #reportChart sudah ada berdimensi SELAGI data masih kosong,
 *  jadi cek canvas width/height TIDAK cukup. Di sini kita TUNGGU SAMPAI:
 *    (1) instance Chart.js benar-benar dibuat (Chart.getChart) DAN
 *    (2) dataset-nya punya nilai (bukan array kosong) DAN
 *    (3) kartu KPI (total/menunggu/disetujui) sudah terisi oleh renderReport().
 *  Dengan begitu `holdRead` berikutnya baru dijalankan saat pie chart tampil
 *  UTUH — tidak ada lagi hold yang habis duluan gara-gara data masih ""/0.
 *  Selama menunggu, Frame Pulse tetap berjalan (interval di-clear di finally)
 *  supaya periode load ikut terekam frame. */
async function waitReportData(page, timeout = 25000) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page); // frame selama fetch/render chart statis
    try {
      await page.waitForFunction(
        () => {
          const canvas = document.getElementById('reportChart');
          if (!canvas) return false;
          let data = [];
          try {
            const chart = window.Chart && Chart.getChart ? Chart.getChart('reportChart') : null;
            if (chart && chart.data && chart.data.datasets && chart.data.datasets[0]) {
              data = Array.isArray(chart.data.datasets[0].data) ? chart.data.datasets[0].data : [];
            }
          } catch (e) { /* belum siap */ }
          if (!data.length) return false;
          const lbl = (id) => { const el = document.getElementById(id); return el ? (el.textContent || '').trim() : ''; };
          return lbl('lbl-total') !== '' && lbl('lbl-menunggu') !== '' && lbl('lbl-disetujui') !== '';
        },
        { timeout }
      );
      return;
    } catch (e) {
      log('WARN waitReportData timeout (chart/KPI belum siap): ' + e.message.slice(0, 90));
    }
  } finally {
    clearInterval(pulseInterval);                       // wajib: interval tidak bocor
    await resetOpacity(page);                           // wajib: opacity kembali 100%
  }
}

/** Cek apakah overlay tour masih aktif. Dipanggil setelah login supaya
 *  rekaman dijamin bersih dari guide (bukan sekadar "kebetulan tidak muncul"). */
async function assertTourOff(page, konteks) {
  const residue = await page.evaluate(() => {
    const ov = document.getElementById('tour-overlay');
    const sp = document.getElementById('tour-spotlight');
    return {
      overlayAda: !!ov,
      overlayAktif: !!(ov && ov.classList.contains('active')),
      spotlightTampil: !!(sp && getComputedStyle(sp).display !== 'none'),
    };
  });
  if (residue.overlayAktif || residue.spotlightTampil) {
    log('WARNING: tour guide masih terlihat setelah ' + konteks + ' ' + JSON.stringify(residue));
    await disableTour(page);
    await sleep(HOLD.TRANSITION);
  } else {
    log('OK tour guide mati setelah ' + konteks);
  }
}

async function login(page, u, p, jedaAwal = HOLD.MENU) {
  await page.goto(appUrl(), { waitUntil: 'networkidle2' });
  await disableTour(page); // pre-set tour_done + buang overlay sebelum apa pun
  await disableAnimations(page); // ZAM: matikan semua transisi/animasi + Chart anim
  await waitVisible(page, 'login-section');
  await holdVisual(page, jedaAwal); // layar login statis -> pulse agar terekam frame
  await page.$eval('#inp-user', (el) => { el.value = ''; });
  await page.$eval('#inp-pass', (el) => { el.value = ''; });
  await page.type('#inp-user', u, { delay: 120 });
  await sleep(HOLD.TRANSITION);
  await page.type('#inp-pass', p, { delay: 120 });
  await holdVisual(page, HOLD.FORM); // jeda sejenak sebelum menekan submit (layar statis)
  await page.click('#btn-login');
  await waitVisible(page, 'dash-section', 25000);
  await holdVisual(page, HOLD.MENU); // beri kesempatan setTimeout(startTour) menyala...
  await disableTour(page); // ...lalu pastikan overlay guide hilang sebelum rekam adegan berikutnya
  await assertTourOff(page, 'login ' + u);
  // CATATAN: tidak ada sleep di sini — pembukaan menu setelah login harus instan.
  // Penundaan tampilan data diletakkan SETELAH render (HOLD.MODAL_CLOSE / DENSE).
}

async function logout(page) {
  await page.evaluate(() => { const b = document.getElementById('btn-logout'); if (b) b.click(); });
  await holdVisual(page, HOLD.MENU); // layar logout -> pulse agar terekam frame
}

async function titleCard(page, teks, sub, ms = HOLD.TITLE) {
  // [DIMATIKAN] Layar pembuka & penutup ("Micropage E-Sparepart" / "Terima kasih")
  // tidak pernah dirender agar rekaman murni UI. Hapus `return;` untuk mengaktifkan lagi.
  return;
  await page.evaluate((t, s) => {
    const div = document.createElement('div');
    div.id = '__titlecard';
    div.style.cssText =
      'position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#0f172a,#1e293b);' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;' +
      'font-family:Segoe UI,Arial,sans-serif;transition:opacity .5s';
    div.innerHTML =
      '<div style="font-size:15px;letter-spacing:6px;color:#38bdf8;font-weight:700;text-transform:uppercase">' +
      'Capstone Kelompok A 127 · STSI4401</div>' +
      '<div style="font-size:44px;font-weight:800;margin:18px 0 10px">' + t + '</div>' +
      '<div style="font-size:19px;color:#94a3b8;max-width:820px;text-align:center;line-height:1.6">' + s + '</div>';
    (document.body || document.documentElement).appendChild(div);
  }, teks, sub);
  await sleep(ms);
  await page.evaluate(() => {
    const el = document.getElementById('__titlecard');
    if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 600); }
  });
  await sleep(HOLD.TRANSITION);
}

async function chapterCard(page, teks, ms = HOLD.CHAPTER) {
  // [DIMATIKAN] Teks transisi bab ("1. Masuk Aplikasi", "2. Teknisi - ...", dst)
  // tidak pernah dirender agar rekaman murni UI. Hapus `return;` untuk mengaktifkan lagi.
  return;
  await page.evaluate((t) => {
    const div = document.createElement('div');
    div.id = '__chapter';
    div.style.cssText =
      'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;' +
      'background:rgba(15,23,42,.94);border:1px solid #334155;border-radius:18px;padding:26px 46px;' +
      'color:#fff;font-family:Segoe UI,Arial,sans-serif;font-size:30px;font-weight:800;' +
      'box-shadow:0 20px 60px rgba(0,0,0,.5)';
    div.textContent = t;
    (document.body || document.documentElement).appendChild(div);
  }, teks);
  await sleep(ms);
  await page.evaluate(() => { const el = document.getElementById('__chapter'); if (el) el.remove(); });
  await sleep(HOLD.TRANSITION);
}

/* ----- Screencast pencer (CDP -> ffmpeg stdin) ----- */

async function startScreencast(session, ffmpegPath, videoPath, fps, width, height) {
  const args = [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(fps),
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '22',
    '-preset', 'ultrafast',
    '-vf', `crop=min(iw\\,${width}):min(ih\\,${height}):0:0,scale=${width}:${height}`,
    '-movflags', '+faststart',
    '-r', '30',
    videoPath,
  ];
  log('ffmpeg args: ffmpeg ' + args.join(' '));
  const proc = spawn(ffmpegPath, args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderrBuf = '';
  proc.stderr.on('data', (d) => {
    stderrBuf += d.toString('utf8');
    if (stderrBuf.length > 4000) stderrBuf = stderrBuf.slice(-2000);
  });
  proc.on('error', (e) => log('ffmpeg spawn error: ' + e.message));
  proc.stdin.on('error', (e) => {
    log('ffmpeg stdin error: ' + e.message);
    log('ffmpeg stderr:\n' + stderrBuf.slice(-900));
  });

  // Aktifkan domain Page lalu mulai screencast CDP
  await session.send('Page.enable');
  await session.send('Page.startScreencast', {
    format: 'png',
    quality: 100,
    maxWidth: width,
    maxHeight: height,
  });
  await sleep(300);
  return { proc, getStderr: () => stderrBuf };
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(FFMPEG_PATH)) {
    console.error('[REC][FATAL] ffmpeg tidak ditemukan: ' + FFMPEG_PATH);
    process.exit(1);
  }
  if (fs.existsSync(VIDEO)) fs.unlinkSync(VIDEO);

  const FPS = 10;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: VIEWPORT,
  });
  const page = await browser.newPage();
  page.on('dialog', async (d) => { await d.accept(); });
  page.on('pageerror', (e) => log('PAGEERROR: ' + e.message.slice(0, 100)));

  const session = await page.target().createCDPSession();

  // FFmpeg writer
  const rec = await startScreencast(session, FFMPEG_PATH, VIDEO, FPS, VIEWPORT.width, VIEWPORT.height);
  let framesWritten = 0;
  let writing = false;
  const queue = [];
  let stopped = false;

  async function pump() {
    if (writing || !queue.length) return;
    writing = true;
    const { buf, sessionId } = queue.shift();
    try {
      await session.send('Page.screencastFrameAck', { sessionId });
      await new Promise((resolve) => {
        const ok = rec.proc.stdin.write(buf, () => resolve());
        if (ok) resolve();
      });
      framesWritten++;
    } catch (e) {
      log('pump err: ' + e.message);
    }
    writing = false;
    if (queue.length) setImmediate(pump);
  }

  session.on('Page.screencastFrame', (event) => {
    queue.push({ buf: Buffer.from(event.data, 'base64'), sessionId: event.sessionId });
    pump();
  });

  try {
    // ====== JUDUL ======
    await page.goto(appUrl(), { waitUntil: 'networkidle2' });
    await disableTour(page); // pre-set tour_done sejak awal sesi perekaman
    await disableAnimations(page); // ZAM: semua grafik/modal tampil utuh seketika
    await waitVisible(page, 'login-section');
    await titleCard(
      page,
      'Micropage E-Sparepart',
      'Demo end-to-end: Formulir Pengajuan Barang Digital &middot; Approval berjenjang &middot; Critical Sparepart List &middot; Monthly Report — Departemen Engineering PT Fonko International Pharmaceuticals'
    );

    // ====== 1. LOGIN ======
    await chapterCard(page, '1. Masuk Aplikasi');
    await page.type('#inp-user', 'AAA', { delay: 130 });
    await sleep(HOLD.TRANSITION);
    await page.type('#inp-pass', '04AAA10', { delay: 130 });
    await holdVisual(page, HOLD.FORM); // jeda sejenak sebelum submit login (layar statis)
    await page.click('#btn-login');
    await waitVisible(page, 'dash-section');
    await holdVisual(page, HOLD.MENU); // beri kesempatan setTimeout(startTour) menyala...
    await disableTour(page); // ...lalu pastikan overlay guide hilang dari rekaman
    await assertTourOff(page, 'login teknisi AAA');

    // ====== 2. TEKNISI ======
    await chapterCard(page, '2. Teknisi — Cek Stok & Ajukan Barang');

    // Cek On Hand Stock — klik BUKA instan -> tunggu render -> hold baca sebelum tutup
    await page.evaluate(() => { const b = document.querySelector('[data-action="stok"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await holdRead(page, '#tbody-stok');       // (1) Wait DOM -> (2) buffer animasi -> (3) reading hold
    await closeAllModals(page);                // tutup

    // Form BQ
    let target = null;
    try {
      const arr = await (await fetch(`${BASE}/api/spareparts/alert`)).json();
      const list = Array.isArray(arr) ? arr : arr.data || [];
      if (list.length) target = list[0];
    } catch (e) {}
    if (!target) target = { item_code: 'O-16725-00' };
    const EJO = 'EJO-DEMO-VIDEO';

    await page.evaluate(() => { const b = document.querySelector('[data-action="bq"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if ((await visibleModal(page)) === 'modal-bq') break; await sleep(200); }
    await page.type('#f-itemcode', target.item_code, { delay: 70 });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-qty', '2', { delay: 160 });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-uom', 'Pcs', { delay: 80 });
    await sleep(HOLD.TRANSITION);
    await page.evaluate(() => { const p = document.getElementById('f-purpose'); if (p) p.value = 'EJO'; });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-no-ejo', EJO, { delay: 60 });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-mesin-area', 'Cartoning Marchesini 305', { delay: 40 });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-merk', 'NOCHRIDA SEJAHTERA, PT', { delay: 30 });
    await sleep(HOLD.TRANSITION);
    await page.type('#f-spesifikasi', 'Kebutuhan perawatan mesin Cartoning Marchesini 305 - item kritis stok menipis.', { delay: 18 });
    await holdVisual(page, HOLD.SUBMIT); // Hold 1,5 dtk setelah isi form sebelum submit (KIRIM PENGAJUAN)
    await page.evaluate(() => { const u = document.getElementById('f-urgency'); if (u) u.value = 'Urgent'; });

    // Buat pengajuan lewat API (dijamin tersimpan)
    let noReg = null;
    try {
      const r = await fetch(`${BASE}/api/pengajuan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'AAA', itemCode: target.item_code, qty: 2, uom: 'Pcs',
          purpose: 'EJO', no_ejo: EJO, mesin_area: 'Cartoning Marchesini 305',
          merk: 'NOCHRIDA SEJAHTERA, PT',
          spesifikasi: 'Kebutuhan perawatan mesin Cartoning Marchesini 305 - item kritis stok menipis.',
          jenis_pengajuan: 'sparepart', urgency: 'Urgent',
        }),
      });
      const j = await r.json();
      noReg = j.data && j.data.no_registrasi;
    } catch (e) {}
    log('  Pengajuan demo: ' + (noReg || 'gagal'));
    await holdVisual(page, HOLD.TOAST); // pengajuan berhasil dibuat
    await closeAllModals(page);

    // BQ Summary teknisi
    await page.evaluate(() => { const b = document.querySelector('[data-action="bqsummary"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-bqsummary');
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await waitTableReady(page, '#tbody-bqsummary'); // (b) tunggu hasil filter masuk DOM
    }
    await holdRead(page, '#tbody-bqsummary'); // Wait DOM -> buffer animasi -> reading hold (Rekapan Pengajuan)
    await closeAllModals(page);
    await logout(page);

    // ====== 3. SUPERVISOR 1 ======
    await chapterCard(page, '3. Supervisor 1 — Monitoring & Persetujuan');
    await login(page, 'INN', '30INN11', HOLD.MENU);
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await holdRead(page, '#tbody-pengajuan'); // Wait DOM -> buffer animasi -> reading hold (tabel Approval BQ)
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await holdVisual(page, HOLD.DENSE);
    }
    await holdVisual(page, HOLD.SUBMIT); // Hold 1,5 dtk sebelum klik Approve (Supervisor)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve')).find((b) => !b.disabled);
      if (btn) btn.click();
    });
    await holdVisual(page, HOLD.TOAST); // Hold 2 dtk setelah Approve -> toast "disetujui" sempat terbaca
    await closeAllModals(page);
    await logout(page);

    // ====== 4. MANAGER ======
    await chapterCard(page, '4. Manager — Persetujuan Urgent & Laporan');
    await login(page, 'KSW', '01KSW10', HOLD.MENU);

    // Approval akhir
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await holdRead(page, '#tbody-pengajuan'); // Wait DOM -> buffer animasi -> reading hold (tabel Approval BQ)
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await holdVisual(page, HOLD.DENSE);
    }
    await holdVisual(page, HOLD.SUBMIT); // Hold 1,5 dtk sebelum klik Approve (Manager)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve')).find((b) => !b.disabled);
      if (btn) btn.click();
    });
    await holdVisual(page, HOLD.TOAST); // Hold 2 dtk setelah Approve -> toast "disetujui" sempat terbaca

    // Riwayat approval (audit trail)
    await page.evaluate((nr) => {
      const s = document.getElementById('approval-search');
      if (s) {
        s.value = nr;
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('keyup', { bubbles: true }));
      }
    }, noReg || '');
    await holdVisual(page, HOLD.DENSE);
    await page.evaluate(() => {
      const b = document.querySelector('#tbody-pengajuan [data-history]');
      if (b) b.click();
    });
    for (let i = 0; i < 50; i++) { if ((await visibleModal(page)) === 'modal-riwayat') break; await sleep(200); }
    await holdRead(page, '#riwayat-body'); // Wait DOM -> buffer animasi -> reading hold (Riwayat Approval)
    await closeAllModals(page);

    // Critical Part
    await page.evaluate(() => { const b = document.querySelector('[data-action="critical"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await holdRead(page, '#tbody-stok'); // Wait DOM -> buffer animasi -> reading hold (Critical Part List)
    await closeAllModals(page);

    // Monthly Report
    await page.evaluate(() => { const b = document.querySelector('[data-action="report"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitReportData(page);           // BLOKIR sampai KPI + pie chart terisi data API
    await holdRead(page, '#reportChart'); // lalu hold penuh 4,5 dtk dengan grafik UTUH
    await closeAllModals(page);
    await logout(page);

    // ====== PENUTUP ======
    await page.goto(appUrl(), { waitUntil: 'networkidle2' });
    await disableTour(page);
    await disableAnimations(page); // ZAM tetap aktif hingga layar penutup
    await waitVisible(page, 'login-section');
    await titleCard(
      page,
      'Terima kasih',
      'Demo end-to-end selesai — pengajuan dari Teknisi, disetujui Supervisor, disetujui Manager, terpantau di Monitoring & Monthly Report. Micropage E-Sparepart, Capstone Kelompok A 127, Universitas Terbuka.',
      HOLD.TITLE
    );
  } catch (e) {
    log('ERROR demo: ' + e.message);
  } finally {
    await sleep(HOLD.TRANSITION);
    try {
      await session.send('Page.stopScreencast');
    } catch (e) { /* sudah berhenti */ }
    // beri ffmpeg kesempatan memproses sisa antrean
    await sleep(HOLD.TRANSITION);
    try { rec.proc.stdin.end(); } catch (e) {}
    await new Promise((resolve) => {
      const t = setTimeout(() => { try { rec.proc.kill(); } catch (e) {} resolve(); }, 30000);
      rec.proc.on('exit', () => { clearTimeout(t); resolve(); });
    });
    await browser.close();
    const size = fs.existsSync(VIDEO) ? fs.statSync(VIDEO).size : 0;
    log('Video: ' + VIDEO + ' (' + (size / 1024 / 1024).toFixed(2) + ' MB) | frame: ' + framesWritten);
    // catatan
    fs.writeFileSync(
      path.join(OUT_DIR, 'catatan-video.md'),
      [
        '# Rekaman Demo Aplikasi (M6)',
        '',
        '- **File**: `demo-aplikasi.mp4`',
        '- **Format**: MP4 / H.264 / 30 fps (siap YouTube)',
        '- **Sumber**: direkam otomatis dari aplikasi berjalan di ' + BASE,
        '- **Tanggal rekam**: ' + new Date().toLocaleString('id-ID'),
        '- **Frame ditangkap**: ' + framesWritten,
        '',
        '## Timeline (murni UI — tanpa kartu judul/bab/penutup)',
        '1. Login aplikasi (akun Teknisi AAA)',
        '2. Teknisi: cek On Hand Stock (real-time + lokator rak)',
        '3. Teknisi: mengisi Formulir Pengajuan Barang Digital (BQ Urgent)',
        '4. Teknisi: memantau status di BQ Summary',
        '5. Supervisor 1: Monitoring & Approval — menyetujui pengajuan',
        '6. Manager: persetujuan akhir pengajuan Urgent',
        '7. Manager: Riwayat approval (audit trail)',
        '8. Manager: Critical Sparepart List',
        '9. Manager: Monthly Report (grafik bulanan)',
        '',
        '> Catatan untuk Wida (Visual & Media Specialist): file ini bahan mentah untuk',
        '> video YouTube Tugas 3 (M7). Tambah narasi suara anggota & branding kelompok,',
        '> lalu upload ke YouTube (untuk Tugas 3 M7).',
      ].join('\n'),
      'utf8'
    );
    log('Selesai.');
  }
})().catch((e) => {
  console.error('[REC][FATAL] ' + e.stack);
  process.exit(1);
});