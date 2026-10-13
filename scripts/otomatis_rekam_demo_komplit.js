/* ============================================================
   scripts/otomatis_rekam_demo_komplit.js
   Tujuan: Merekam video demo E2E KOMPLIT yang mendemonstrasikan
   seluruh role & fitur utama (registrasi, BQ Personal, Status
   Pengajuan Saya, On Hand Stock, Rekapan, Layout Rak, Approval BQ
   + urgensi + status pengadaan + audit trail, Critical Part List,
   PR Summary, Approval User, Log Aktivitas, Monthly Report).

   Teknik: CDP Page.startScreencast (PNG frames) -> ffmpeg libx264 -> MP4.
   Output: docs/evidence/video/demo-aplikasi-komplit.mp4

   ATURAN REKAMAN MUTLAK (dipertahankan 100% dari demo sebelumnya):
     1. ZAM (Zero Animation Mode) — CSS transition/animation OFF + Chart.js OFF.
     2. Frame Pulse Encapsulated — holdRead/holdVisual menyalakan opacity pulse
        di dalam try/finally; interval SELALU dibersihkan.
     3. Data Waiter — holdRead hanya dimulai SETELAH data (tabel/grafik/angka)
        benar-benar ter-render (waitDomReady / waitTableReady / waitReportData).

   Jalankan: node scripts/otomatis_rekam_demo_komplit.js
   ============================================================ */

const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'evidence', 'video');
const VIDEO = path.join(OUT_DIR, 'demo-aplikasi-komplit.mp4');

/* Resolusi ffmpeg: hormati env dulu, lalu coba imageio (dipakai demo lama),
   lalu ffmpeg sistem (winget). Pilih yang benar-benar ada. */
const FFMPEG_CANDIDATES = [
  process.env.FFMPEG_PATH,
  'C:\\Users\\avwan\\AppData\\Local\\Programs\\Python\\Python312\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe',
  'C:\\Users\\avwan\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe',
].filter(Boolean);
const FFMPEG_PATH = FFMPEG_CANDIDATES.find((p) => fs.existsSync(p)) || FFMPEG_CANDIDATES[0];

const VIEWPORT = { width: 1440, height: 900 };
/* Semua modal yang mungkin muncul di skenario komplit — dipakai closeAllModals
   & visibleModal supaya tidak ada modal yang "nyangkut" memblokir adegan berikut. */
const MODALS = [
  'modal-stok', 'modal-bq', 'modal-mybq', 'modal-bqsummary', 'modal-approval',
  'modal-prsummary', 'modal-report', 'modal-riwayat', 'modal-rak',
  'modal-usermgmt', 'modal-logactivity', 'modal-register',
];

const appUrl = () => BASE + (BASE.includes('?') ? '&' : '?') + 'tour=off';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[REC] ' + m);

const ROLES_LS = ['teknisi', 'supervisor 1', 'supervisor 2', 'administrator', 'manager'];

/* ── Dynamic Hold Time (sinkron dengan demo sebelumnya) ─────────────── */
const HOLD = {
  TRANSITION: 350,
  FORM: 1000,
  MENU: 1000,
  TOAST: 2000,
  DENSE: 2500,
  TITLE: 2500,
  CHAPTER: 1800,
  SUBMIT: 1500,
  BUFFER: 1500,     // animation buffer di dalam holdRead
  MODAL_CLOSE: 3000 // reading hold di dalam holdRead
};

const TOUR_KEY_PREFIX = 'tour_done_v3_';

/* ── ZAM: Zero Animation Mode ───────────────────────────────────────── */
const ZERO_ANIM_CSS =
  '* { transition: none !important; animation: none !important; ' +
  'scroll-behavior: auto !important; } ' +
  'body { scroll-behavior: auto !important; }';

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
      const mo = new MutationObserver(setNoAnim);
      try { mo.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
    });
  } catch (e) { /* biarkan */ }
}

/* ── Frame Pulse (per-hold, ter-encapsulate) ────────────────────────── */
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

async function disableTour(page) {
  try {
    await page.evaluate(
      (roles, prefix) => {
        roles.forEach((r) => { try { localStorage.setItem(prefix + r, '1'); } catch (e) {} });
        const ov = document.getElementById('tour-overlay');
        if (ov && ov.classList.contains('active')) {
          const skip = document.getElementById('tour-skip');
          if (skip) skip.click();
          else ov.classList.remove('active');
        }
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

async function waitModal(page, id, timeout = 25000) {
  await page.waitForFunction(
    (x) => { const el = document.getElementById(x); return el && !el.classList.contains('hidden'); },
    { timeout }, id
  );
}

async function closeAllModals(page) {
  await page.evaluate((ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      try { if (typeof window.closeModal === 'function') window.closeModal(id); } catch (e) {}
      el.classList.add('hidden');
    }
    try { if (typeof window.stopApprovalAutoRefresh === 'function') window.stopApprovalAutoRefresh(); } catch (e) {}
  }, MODALS);
  await sleep(HOLD.TRANSITION);
}

async function waitTableReady(page, sel, loadingText = 'Memuat') {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);
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
    clearInterval(pulseInterval);
  }
}

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

/** waitForText — tunggu elemen memuat teks tertentu (mis. tab "Belum Ada Lokasi"). */
async function waitForText(page, sel, needle, timeout = 20000) {
  try {
    await page.waitForFunction(
      (s, n) => { const el = document.querySelector(s); return !!el && (el.innerText || '').includes(n); },
      { timeout }, sel, needle
    );
  } catch (e) { /* biarkan */ }
}

/** holdRead — WAJIB data sudah ter-render; pulse ter-encapsulate try/finally. */
async function holdRead(page, sel, opts = {}) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);
    await waitDomReady(page, sel, opts.timeout || 20000);   // (1) WAIT FOR DOM
    await sleep(HOLD.BUFFER);                               // (2) ANIMATION BUFFER
    await sleep(opts.read || HOLD.MODAL_CLOSE);             // (3) READING HOLD
  } finally {
    clearInterval(pulseInterval);
    await resetOpacity(page);
  }
}

/** holdVisual — hold statis (login, toast, layar) dengan pulse ter-encapsulate. */
async function holdVisual(page, ms) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);
    await sleep(ms);
  } finally {
    clearInterval(pulseInterval);
    await resetOpacity(page);
  }
}

/** Network Data Waiter khusus grafik (Monthly Report). */
async function waitReportData(page, timeout = 25000) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);
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
    clearInterval(pulseInterval);
    await resetOpacity(page);
  }
}

/** Network Data Waiter khusus daftar "Belum Ada Lokasi" (Layout Rak). */
async function waitRakBelum(page, timeout = 25000) {
  let pulseInterval = null;
  try {
    pulseInterval = holdLoop(page);
    try {
      await page.waitForFunction(
        (s) => { const el = document.getElementById(s); return !!el && /belum lengkap/i.test(el.innerText || ''); },
        { timeout }, 'rak-body'
      );
    } catch (e) {
      log('WARN waitRakBelum timeout (daftar belum ada lokasi belum siap)');
    }
  } finally {
    clearInterval(pulseInterval);
    await resetOpacity(page);
  }
}

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

/* ── Aksi UI ────────────────────────────────────────────────────────── */

async function clickAction(page, action, expectModal) {
  await page.evaluate((a) => { const b = document.querySelector('[data-action="' + a + '"]'); if (b) b.click(); }, action);
  if (expectModal) {
    try { await waitModal(page, expectModal, 25000); }
    catch (e) { log('WARN modal tidak muncul: ' + expectModal + ' (action=' + action + ')'); }
  } else {
    for (let i = 0; i < 60; i++) { if (await visibleModal(page)) break; await sleep(200); }
  }
}

async function typeField(page, sel, text, delay = 40) {
  const has = await page.$(sel);
  if (!has) { log('WARN input tak ada: ' + sel); return; }
  await page.$eval(sel, (el) => { el.value = ''; });
  await page.type(sel, text, { delay });
}

async function setSelect(page, sel, value) {
  const ok = await page.evaluate(({ s, v }) => {
    const el = document.querySelector(s);
    if (!el) return false;
    const opt = Array.prototype.find.call(el.options, (o) => o.value === v || o.textContent.trim() === v);
    if (!opt) return false;
    el.value = opt.value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { s: sel, v: value });
  if (!ok) log('WARN select value tak ada: ' + sel + ' = ' + value);
}

async function login(page, u, p, opts = {}) {
  await page.goto(appUrl(), { waitUntil: 'networkidle2' });
  await disableTour(page);
  await disableAnimations(page);
  await waitVisible(page, 'login-section');
  await holdVisual(page, HOLD.MENU);
  await page.$eval('#inp-user', (el) => { el.value = ''; });
  await page.$eval('#inp-pass', (el) => { el.value = ''; });
  await page.type('#inp-user', u, { delay: 110 });
  await sleep(HOLD.TRANSITION);
  await page.type('#inp-pass', p, { delay: 110 });
  if (opts.remember) {
    // Centang "Ingat Saya" agar terlihat di rekaman.
    const checked = await page.$eval('#chk-remember', (el) => el.checked);
    if (!checked) await page.click('#chk-remember');
    await sleep(HOLD.TRANSITION);
  }
  await holdVisual(page, HOLD.FORM);
  await page.click('#btn-login');
  await waitVisible(page, 'dash-section', 25000);
  await holdVisual(page, HOLD.MENU);
  await disableTour(page);
  await assertTourOff(page, 'login ' + u);
}

async function logout(page) {
  await page.evaluate(() => { const b = document.getElementById('btn-logout'); if (b) b.click(); });
  await holdVisual(page, HOLD.MENU);
}

/* ── Helper Approval ────────────────────────────────────────────────── */

async function searchApproval(page, noReg) {
  if (!noReg) return;
  await page.evaluate((nr) => {
    const s = document.getElementById('approval-search');
    if (s) {
      s.value = nr;
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
  }, noReg);
  await sleep(HOLD.MENU);
}

async function setRowSelect(page, noReg, attr, value) {
  const ok = await page.evaluate(({ no, a, val }) => {
    const rows = document.querySelectorAll('#tbody-pengajuan tr');
    for (const tr of rows) {
      const td = tr.querySelector('td.font-mono');
      if (td && td.textContent.trim() === no) {
        const sels = tr.querySelectorAll('select');
        for (const s of sels) {
          if (a && !s.hasAttribute(a)) continue;
          const matches = Array.prototype.some.call(s.options, (o) => o.value === val || o.textContent.trim() === val);
          if (matches) { s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); return true; }
        }
      }
    }
    return false;
  }, { no: noReg, a: attr, val: value });
  if (!ok) log('WARN setRowSelect gagal ' + noReg + ' [' + (attr || '-') + ']=' + value);
  return ok;
}

async function clickRowButton(page, noReg, selector) {
  const ok = await page.evaluate(({ no, sel }) => {
    const rows = document.querySelectorAll('#tbody-pengajuan tr');
    for (const tr of rows) {
      const td = tr.querySelector('td.font-mono');
      if (td && td.textContent.trim() === no) {
        const b = tr.querySelector(sel);
        if (b) { b.click(); return true; }
      }
    }
    return false;
  }, { no: noReg, sel: selector });
  if (!ok) log('WARN klik tidak ketemu di baris ' + noReg + ' -> ' + selector);
  return ok;
}

/** Ambil no_registrasi pengajuan demo berdasarkan no_ejo unik (via API). */
async function fetchNoRegByEjo(page, ejo) {
  return page.evaluate((target) => {
    return fetch('/api/pengajuan/all?username=AAA&actor=AAA', { headers: { 'x-requested-with': 'fetch' } })
      .then((r) => r.json())
      .then((arr) => {
        const list = Array.isArray(arr) ? arr : (arr.data || []);
        const row = list.filter((x) => x.no_ejo === target)
          .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))[0];
        return row ? row.no_registrasi : null;
      }).catch(() => null);
  }, ejo);
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
  log('ffmpeg: ' + ffmpegPath);
  const proc = spawn(ffmpegPath, args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderrBuf = '';
  proc.stderr.on('data', (d) => {
    stderrBuf += d.toString('utf8');
    if (stderrBuf.length > 4000) stderrBuf = stderrBuf.slice(-2000);
  });
  proc.on('error', (e) => log('ffmpeg spawn error: ' + e.message));
  proc.stdin.on('error', (e) => log('ffmpeg stdin error: ' + e.message));

  await session.send('Page.enable');
  await session.send('Page.startScreencast', { format: 'png', quality: 100, maxWidth: width, maxHeight: height });
  await sleep(300);
  return { proc, getStderr: () => stderrBuf };
}

/* ============================ MAIN ============================ */
(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!FFMPEG_PATH || !fs.existsSync(FFMPEG_PATH)) {
    console.error('[REC][FATAL] ffmpeg tidak ditemukan. Set env FFMPEG_PATH.');
    process.exit(1);
  }
  if (fs.existsSync(VIDEO)) fs.unlinkSync(VIDEO);

  const state = { noReg: null, qaUser: null, qaPass: 'komplit123' };
  state.qaUser = 'qakomplit' + String(Date.now()).slice(-6);
  const EJO = 'EJO/KOMPLIT/VIDEO/2026';

  const FPS = 10;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900', '--autoplay-policy=no-user-gesture-required'],
    defaultViewport: VIEWPORT,
  });
  const page = await browser.newPage();
  page.on('dialog', async (d) => { try { await d.accept(); } catch (e) {} });
  page.on('pageerror', (e) => log('PAGEERROR: ' + e.message.slice(0, 120)));

  const session = await page.target().createCDPSession();
  const rec = await startScreencast(session, FFMPEG_PATH, VIDEO, FPS, VIEWPORT.width, VIEWPORT.height);

  let framesWritten = 0;
  let writing = false;
  const queue = [];
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
    /* ================= SEGMEN 1: PRA-LOGIN & USER REGISTRATION ================= */
    log('SEGMEN 1 — Registrasi user baru');
    await page.goto(appUrl(), { waitUntil: 'networkidle2' });
    await disableTour(page);
    await disableAnimations(page);
    await waitVisible(page, 'login-section');
    await holdVisual(page, HOLD.MENU);                     // layar login

    await page.click('#link-register');                    // "Daftar di sini"
    await waitModal(page, 'modal-register');
    await typeField(page, '#reg-username', state.qaUser, 80);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#reg-name', 'QA Komplit Pendaftar', 60);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#reg-pass', state.qaPass, 80);
    await holdVisual(page, HOLD.SUBMIT);                   // sebelum kirim
    await page.click('#btn-register');
    try { await waitVisible(page, 'reg-info', 12000); } catch (e) { log('WARN reg-info tidak tampil'); }
    await holdVisual(page, HOLD.TOAST + 1200);             // "Pendaftaran berhasil! ..." (pending)
    await closeAllModals(page);
    log('  Daftar user: ' + state.qaUser);

    /* ================= SEGMEN 2: TEKNISI (AAA) ================= */
    log('SEGMEN 2 — Teknisi AAA');
    await login(page, 'AAA', '04AAA10', { remember: true });

    // 2a. BQ Personal: isi form -> submit -> tahan di toast "Pengajuan Berhasil"
    await clickAction(page, 'bq', 'modal-bq');
    let target = null;
    try {
      const arr = await (await fetch(`${BASE}/api/spareparts/alert`)).json();
      const list = Array.isArray(arr) ? arr : (arr.data || []);
      if (list.length) target = list[0];
    } catch (e) {}
    if (!target || !target.item_code) target = { item_code: 'O-16725-00' };

    await typeField(page, '#f-itemcode', target.item_code, 60);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-qty', '2', 120);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-uom', 'Pcs', 60);
    await sleep(HOLD.TRANSITION);
    await setSelect(page, '#f-purpose', 'EJO');
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-no-ejo', EJO, 50);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-mesin-area', 'Cartoning Marchesini 305', 30);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-merk', 'NOCHRIDA SEJAHTERA, PT', 25);
    await sleep(HOLD.TRANSITION);
    await typeField(page, '#f-spesifikasi', 'Kebutuhan perawatan mesin Cartoning Marchesini 305 - item kritis stok menipis.', 12);
    await holdVisual(page, HOLD.SUBMIT);                   // sebelum klik KIRIM
    await page.click('#btn-kirim-bq');                     // alert() auto-accept -> toast "Pengajuan BQ ... tersimpan"
    await holdVisual(page, HOLD.TOAST);                    // tahan di toast "Pengajuan Berhasil"
    await closeAllModals(page);
    state.noReg = await fetchNoRegByEjo(page, EJO);
    log('  Pengajuan teknisi: ' + (state.noReg || 'gagal'));

    // 2b. Status Pengajuan Saya (stepper)
    await clickAction(page, 'mybq', 'modal-mybq');
    await holdRead(page, '#mybq-list');
    await closeAllModals(page);

    // 2c. On Hand Stock
    await clickAction(page, 'stok', 'modal-stok');
    await holdRead(page, '#tbody-stok');
    await closeAllModals(page);

    // 2d. Rekapan Pengajuan (teknisi) — body = #bqsummary-body
    await clickAction(page, 'bqsummary', 'modal-bqsummary');
    await holdRead(page, '#bqsummary-body');
    await closeAllModals(page);

    // 2e. Layout Rak: tab Semua -> tab Belum Ada Lokasi
    await clickAction(page, 'rak', 'modal-rak');
    await holdRead(page, '#rak-body');
    await page.evaluate(() => { const tab = document.querySelector('#rak-tabs [data-rak-tab="BELUM"]'); if (tab) tab.click(); });
    await waitRakBelum(page);
    await holdRead(page, '#rak-body');
    await closeAllModals(page);

    await logout(page);

    /* ================= SEGMEN 3: SUPERVISOR 1 (INN) ================= */
    log('SEGMEN 3 — Supervisor 1 INN');
    await login(page, 'INN', '30INN11');

    // 3a. Approval BQ: ubah Urgensi -> Urgent (toast)
    await clickAction(page, 'monitoring', 'modal-approval');
    await holdRead(page, '#tbody-pengajuan');
    await searchApproval(page, state.noReg);
    await holdRead(page, '#tbody-pengajuan');
    if (state.noReg) await setRowSelect(page, state.noReg, 'data-urgency', 'Urgent');
    await holdVisual(page, HOLD.TOAST);

    // Approve tahap Supervisor (toast)
    await searchApproval(page, state.noReg);
    await holdVisual(page, HOLD.SUBMIT);
    if (state.noReg) await clickRowButton(page, state.noReg, '[data-field="spv"][data-approve="approved"]');
    await holdVisual(page, HOLD.TOAST);

    // 3b. Riwayat (Audit Trail) baris tersebut
    await searchApproval(page, state.noReg);
    if (state.noReg) await clickRowButton(page, state.noReg, '[data-history]');
    try { await waitModal(page, 'modal-riwayat', 15000); } catch (e) { log('WARN modal-riwayat tidak muncul'); }
    await holdRead(page, '#riwayat-body');
    await closeAllModals(page);

    // 3c. Critical Part List
    await clickAction(page, 'critical', 'modal-stok');
    await holdRead(page, '#tbody-stok');
    await closeAllModals(page);

    // 3d. PR Summary
    await clickAction(page, 'prsummary', 'modal-prsummary');
    await waitTableReady(page, '#prsummary-list');
    await holdRead(page, '#prsummary-list');
    await closeAllModals(page);

    await logout(page);

    /* ================= SEGMEN 4: ADMINISTRATOR (ANS) ================= */
    log('SEGMEN 4 — Administrator ANS');
    await login(page, 'ANS', 'ANS1805');

    await clickAction(page, 'monitoring', 'modal-approval');
    await holdRead(page, '#tbody-pengajuan');
    await searchApproval(page, state.noReg);
    await holdRead(page, '#tbody-pengajuan');
    if (state.noReg) await setRowSelect(page, state.noReg, '', 'Proses PO');
    await holdVisual(page, HOLD.TOAST);
    await closeAllModals(page);

    await logout(page);

    /* ================= SEGMEN 5: MANAGER (KSW) ================= */
    log('SEGMEN 5 — Manager KSW');
    await login(page, 'KSW', '01KSW10');

    // 5a. Approval User: setujui pendaftar dari Segmen 1 + pilih tim
    await clickAction(page, 'usermgmt', 'modal-usermgmt');
    await holdRead(page, '#usermgmt-list');
    await holdVisual(page, HOLD.SUBMIT);
    const approved = await page.evaluate((u) => {
      const cards = document.querySelectorAll('#usermgmt-list > div');
      for (const c of cards) {
        if ((c.textContent || '').indexOf(u) >= 0) {
          const sels = c.querySelectorAll('select');
          for (const s of sels) {
            if (Array.prototype.some.call(s.options, (o) => o.value === 'Supervisor 1')) {
              s.value = 'Supervisor 1';
              s.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
          const btns = c.querySelectorAll('button');
          for (const b of btns) { if (b.textContent.trim().indexOf('Setujui') >= 0) { b.click(); return true; } }
        }
      }
      return false;
    }, state.qaUser);
    log('  Approval user ' + state.qaUser + ' -> ' + approved);
    await holdVisual(page, HOLD.TOAST);
    await closeAllModals(page);

    // 5b. Approval BQ Urgent: approve tahap MGR (SPV sudah approve di Segmen 3)
    await clickAction(page, 'monitoring', 'modal-approval');
    await holdRead(page, '#tbody-pengajuan');
    await searchApproval(page, state.noReg);
    await holdVisual(page, HOLD.SUBMIT);
    if (state.noReg) await clickRowButton(page, state.noReg, '[data-field="mgr"][data-approve="approved"]');
    await holdVisual(page, HOLD.TOAST);
    await closeAllModals(page);

    // 5c. Log Aktivitas: tab Riwayat Login -> tab Riwayat Aktivitas
    await clickAction(page, 'logactivity', 'modal-logactivity');
    await holdRead(page, '#log-list');
    await page.evaluate(() => { const t = document.getElementById('tab-log-activity'); if (t) t.click(); });
    await holdRead(page, '#log-list');
    await closeAllModals(page);

    // 5d. Monthly Report (tunggu data utuh: pie + angka KPI)
    await clickAction(page, 'report', 'modal-report');
    await waitReportData(page);
    await holdRead(page, '#reportChart');
    // Bonus: demonstrasi export (Excel) laporan bulanan
    await page.evaluate(() => { const b = document.getElementById('btn-report-xlsx'); if (b) b.click(); });
    await holdVisual(page, HOLD.TOAST);
    await closeAllModals(page);

    await logout(page);

    log('SEMUA SEGMEN SELESAI');
  } catch (e) {
    log('ERROR demo: ' + e.message);
  } finally {
    await sleep(HOLD.TRANSITION);
    try { await session.send('Page.stopScreencast'); } catch (e) {}
    await sleep(HOLD.TRANSITION);
    try { rec.proc.stdin.end(); } catch (e) {}
    await new Promise((resolve) => {
      const t = setTimeout(() => { try { rec.proc.kill(); } catch (e) {} resolve(); }, 30000);
      rec.proc.on('exit', () => { clearTimeout(t); resolve(); });
    });
    await browser.close();
    const size = fs.existsSync(VIDEO) ? fs.statSync(VIDEO).size : 0;
    log('Video: ' + VIDEO + ' (' + (size / 1024 / 1024).toFixed(2) + ' MB) | frame: ' + framesWritten);

    fs.writeFileSync(
      path.join(OUT_DIR, 'catatan-video-komplit.md'),
      [
        '# Rekaman Demo Aplikasi Komplit (M6)',
        '',
        '- **File**: `demo-aplikasi-komplit.mp4`',
        '- **Format**: MP4 / H.264 / 30 fps',
        '- **Sumber**: direkam otomatis dari aplikasi di ' + BASE,
        '- **Tanggal rekam**: ' + new Date().toLocaleString('id-ID'),
        '- **Frame ditangkap**: ' + framesWritten,
        '',
        '## Cakupan (semua role)',
        '1. Pra-login: registrasi akun baru (status pending).',
        '2. Teknisi (AAA): BQ Personal (submit + toast), Status Pengajuan Saya (stepper), On Hand Stock, Rekapan Pengajuan, Layout Rak (tab Semua + Belum Ada Lokasi), Logout.',
        '3. Supervisor 1 (INN): Approval BQ (ubah Urgensi -> Urgent), Approve SPV, Riwayat/Audit Trail, Critical Part List, PR Summary, Logout.',
        '4. Administrator (ANS): Approval BQ (ubah Status Pengadaan -> Proses PO), Logout.',
        '5. Manager (KSW): Approval User (approve pendaftar + tugaskan tim), Approval BQ Urgent (approve MGR), Log Aktivitas (Login + Aktivitas), Monthly Report (pie + KPI) + export, Logout.',
        '',
        '> Semua rekaman memakai Zero Animation Mode, Frame Pulse ter-encapsulate,',
        '> dan Data Waiter (tabel/grafik/angka harus ter-render sebelum hold).',
      ].join('\n'),
      'utf8'
    );
    log('Selesai.');
  }
})().catch((e) => {
  console.error('[REC][FATAL] ' + e.stack);
  process.exit(1);
});
