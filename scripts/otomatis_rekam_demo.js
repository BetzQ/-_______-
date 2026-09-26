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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[REC] ' + m);

const ROLES_LS = ['teknisi', 'supervisor 1', 'supervisor 2', 'officer', 'manager'];

/** Matikan panduan (tour) agar rekaman tidak tertutup overlay guide. */
async function disableTour(page) {
  try {
    await page.evaluate((roles) => {
      roles.forEach((r) => { try { localStorage.setItem('tour_done_' + r, '1'); } catch (e) {} });
      const ov = document.getElementById('tour-overlay');
      if (ov && ov.classList.contains('active')) {
        const skip = document.getElementById('tour-skip');
        if (skip) skip.click(); else ov.classList.remove('active');
      }
    }, ROLES_LS);
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
  await sleep(600);
}

async function waitTableReady(page, sel, loadingText = 'Memuat') {
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
}

async function login(page, u, p, jedaAwal = 1400) {
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await disableTour(page); // pre-set tour_done agar guide tidak pernah muncul
  await waitVisible(page, 'login-section');
  await sleep(jedaAwal);
  await page.$eval('#inp-user', (el) => { el.value = ''; });
  await page.$eval('#inp-pass', (el) => { el.value = ''; });
  await page.type('#inp-user', u, { delay: 120 });
  await sleep(400);
  await page.type('#inp-pass', p, { delay: 120 });
  await sleep(700);
  await page.click('#btn-login');
  await waitVisible(page, 'dash-section', 25000);
  await sleep(600); // beri kesempatan setTimeout(startTour) menyala...
  await disableTour(page); // ...lalu pastikan overlay guide hilang sebelum rekam adegan berikutnya
  await sleep(1200);
}

async function logout(page) {
  await page.evaluate(() => { const b = document.getElementById('btn-logout'); if (b) b.click(); });
  await sleep(1400);
}

async function titleCard(page, teks, sub, ms = 3200) {
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
  await sleep(800);
}

async function chapterCard(page, teks, ms = 2000) {
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
  await sleep(500);
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
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await disableTour(page); // pre-set tour_done sejak awal sesi perekaman
    await waitVisible(page, 'login-section');
    await titleCard(
      page,
      'Micropage E-Sparepart',
      'Demo end-to-end: Formulir Pengajuan Barang Digital &middot; Approval berjenjang &middot; Critical Sparepart List &middot; Monthly Report — Departemen Engineering PT Fonko International Pharmaceuticals'
    );

    // ====== 1. LOGIN ======
    await chapterCard(page, '1. Masuk Aplikasi');
    await page.type('#inp-user', 'AAA', { delay: 130 });
    await sleep(400);
    await page.type('#inp-pass', '04AAA10', { delay: 130 });
    await sleep(700);
    await page.click('#btn-login');
    await waitVisible(page, 'dash-section');
    await sleep(600); // beri kesempatan setTimeout(startTour) menyala...
    await disableTour(page); // ...lalu pastikan overlay guide hilang dari rekaman
    await sleep(1800);

    // ====== 2. TEKNISI ======
    await chapterCard(page, '2. Teknisi — Cek Stok & Ajukan Barang');
    await sleep(600);

    // Cek On Hand Stock
    await page.evaluate(() => { const b = document.querySelector('[data-action="stok"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-stok');
    await sleep(2600);
    await closeAllModals(page);

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
    await sleep(1500);
    await page.type('#f-itemcode', target.item_code, { delay: 70 });
    await sleep(400);
    await page.type('#f-qty', '2', { delay: 160 });
    await sleep(300);
    await page.type('#f-uom', 'Pcs', { delay: 80 });
    await sleep(300);
    await page.evaluate(() => { const p = document.getElementById('f-purpose'); if (p) p.value = 'EJO'; });
    await sleep(400);
    await page.type('#f-no-ejo', EJO, { delay: 60 });
    await sleep(300);
    await page.type('#f-mesin-area', 'Cartoning Marchesini 305', { delay: 40 });
    await sleep(300);
    await page.type('#f-merk', 'NOCHRIDA SEJAHTERA, PT', { delay: 30 });
    await sleep(300);
    await page.type('#f-spesifikasi', 'Kebutuhan perawatan mesin Cartoning Marchesini 305 - item kritis stok menipis.', { delay: 18 });
    await sleep(400);
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
    await sleep(1000);
    await closeAllModals(page);

    // BQ Summary teknisi
    await page.evaluate(() => { const b = document.querySelector('[data-action="bqsummary"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-bqsummary');
    await sleep(1400);
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await sleep(2400);
    }
    await closeAllModals(page);
    await logout(page);

    // ====== 3. SUPERVISOR 1 ======
    await chapterCard(page, '3. Supervisor 1 — Monitoring & Persetujuan');
    await login(page, 'INN', '30INN11', 600);
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-pengajuan');
    await sleep(1600);
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await sleep(2400);
    }
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve')).find((b) => !b.disabled);
      if (btn) btn.click();
    });
    await sleep(2800);
    await closeAllModals(page);
    await logout(page);

    // ====== 4. MANAGER ======
    await chapterCard(page, '4. Manager — Persetujuan Urgent & Laporan');
    await login(page, 'KSW', '01KSW10', 600);

    // Approval akhir
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-pengajuan');
    await sleep(1200);
    if (noReg) {
      await page.evaluate((nr) => {
        const s = document.getElementById('approval-search');
        if (s) {
          s.value = nr;
          s.dispatchEvent(new Event('input', { bubbles: true }));
          s.dispatchEvent(new Event('keyup', { bubbles: true }));
        }
      }, noReg);
      await sleep(2200);
    }
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve')).find((b) => !b.disabled);
      if (btn) btn.click();
    });
    await sleep(2800);

    // Riwayat approval (audit trail)
    await page.evaluate((nr) => {
      const s = document.getElementById('approval-search');
      if (s) {
        s.value = nr;
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('keyup', { bubbles: true }));
      }
    }, noReg || '');
    await sleep(1800);
    await page.evaluate(() => {
      const b = document.querySelector('#tbody-pengajuan [data-history]');
      if (b) b.click();
    });
    await sleep(2600);
    await closeAllModals(page);

    // Critical Part
    await page.evaluate(() => { const b = document.querySelector('[data-action="critical"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await sleep(3000);
    await closeAllModals(page);

    // Monthly Report
    await page.evaluate(() => { const b = document.querySelector('[data-action="report"]'); if (b) b.click(); });
    for (let i = 0; i < 50; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await sleep(3800);
    await closeAllModals(page);
    await logout(page);

    // ====== PENUTUP ======
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await waitVisible(page, 'login-section');
    await titleCard(
      page,
      'Terima kasih',
      'Demo end-to-end selesai — pengajuan dari Teknisi, disetujui Supervisor, disetujui Manager, terpantau di Monitoring & Monthly Report. Micropage E-Sparepart, Capstone Kelompok A 127, Universitas Terbuka.',
      3600
    );
  } catch (e) {
    log('ERROR demo: ' + e.message);
  } finally {
    await sleep(800);
    try {
      await session.send('Page.stopScreencast');
    } catch (e) { /* sudah berhenti */ }
    // beri ffmpeg kesempatan memproses sisa antrean
    await sleep(500);
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
        '## Timeline',
        '1. Kartu judul aplikasi',
        '2. Login aplikasi (akun Teknisi AAA)',
        '3. Teknisi: cek On Hand Stock (real-time + lokator rak)',
        '4. Teknisi: mengisi Formulir Pengajuan Barang Digital (BQ Urgent)',
        '5. Teknisi: memantau status di BQ Summary',
        '6. Supervisor 1: Monitoring & Approval — menyetujui pengajuan',
        '7. Manager: persetujuan akhir pengajuan Urgent',
        '8. Manager: Riwayat approval (audit trail)',
        '9. Manager: Critical Sparepart List',
        '10. Manager: Monthly Report (grafik bulanan)',
        '11. Kartu penutup',
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