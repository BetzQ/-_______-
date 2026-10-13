/* Rekam alur test manual QA -> seg-01..12.mp4 (video, belum ada suara).
   Jalankan: node scripts/rekam_alur_qa.js  (server harus jalan di :3000) */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');

const BASE = 'http://localhost:3000';
const FFMPEG = 'C:\\Users\\avwan\\AppData\\Local\\Programs\\Python\\Python312\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe';
const VIEWPORT = { width: 1400, height: 950 };
const OUT_DIR = 'C:\\0000-Universitas_Terbuka\\semester8\\capstoneproject\\App-list\\video_belajar_cp\\video-alur-qa-guide';
const SEG_DIR = path.join(OUT_DIR, 'seg');
const TOUR_KEY = 'tour_done_v3_';
const ROLES = ['teknisi', 'supervisor 1', 'supervisor 2', 'administrator', 'manager'];

/* ── Dynamic Hold Time ───────────────────────────────────────────────
   Ritme rekaman dijaga lincah: jeda sekilas di titik penting, tanpa
   membuat audiens mengantuk. TIDAK ada lagi jeda 4–5 detik.
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
                   // BUKAN saat animasi CSS fade-in selesai. Beri 1,5 dtk agar visual
                   // stabil dulu, sehingga HOLD.MODAL_CLOSE (3 dtk) terpakai untuk membaca.
  MODAL_CLOSE: 3000, // Hold 3 dtk (reading time) TEPAT SEBELUM klik close modal data
};

let browser, page, session;
let current = null;
const state = { noReg: null, qaUser: null };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function log(m) { console.log('[' + new Date().toISOString().slice(11, 19) + '] ' + m); }

function ffmpegArgs(out) {
  return ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '10', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out];
}

function pumpFrames() {
  session.on('Page.screencastFrame', ({ data, sessionId }) => {
    if (current) { try { current.proc.stdin.write(Buffer.from(data, 'base64')); } catch (e) {} }
    session.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
}

async function recStart(seg) {
  const outPath = path.join(SEG_DIR, 'seg-' + seg + '.mp4');
  if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  const proc = spawn(FFMPEG, ffmpegArgs(outPath), { stdio: ['pipe', 'ignore', 'pipe'] });
  proc.stderr.on('data', (d) => { const s = String(d); if (/[Ee]rror/.test(s)) log('ffmpeg: ' + s.trim().slice(0, 160)); });
  proc.on('error', (e) => log('spawn err: ' + e.message));
  current = { proc, out: outPath };
  await session.send('Page.enable');
  await session.send('Page.startScreencast', { format: 'png', quality: 100, maxWidth: VIEWPORT.width, maxHeight: VIEWPORT.height });
  await sleep(500);
}

async function recStop() {
  try { await session.send('Page.stopScreencast'); } catch (e) {}
  await sleep(500);
  const p = current && current.proc;
  current = null;
  if (p) {
    try { p.stdin.end(); } catch (e) {}
    await new Promise((res) => {
      const t = setTimeout(() => { try { p.kill(); } catch (e) {} res(); }, 20000);
      p.on('exit', () => { clearTimeout(t); res(); });
      p.on('error', () => { clearTimeout(t); res(); });
    });
  }
}

async function recordSegment(seg, fn) {
  log('=== SEGMEN ' + seg + ' mulai ===');
  await recStart(seg);
  try { await fn(); } catch (e) { log('SEG ' + seg + ' ERR: ' + e.message); }
  await recStop();
  log('=== SEGMEN ' + seg + ' selesai ===');
}

async function disableTour() {
  for (const r of ROLES) {
    await page.evaluate((k) => localStorage.removeItem(k), TOUR_KEY + r).catch(() => {});
  }
}

async function armTourOff() {
  for (const r of ROLES) {
    await page.evaluate((k) => localStorage.setItem(k, '1'), TOUR_KEY + r).catch(() => {});
  }
}

/* ── Zero Animation Mode (ZAM) ────────────────────────────────────────
   Matikan semua transisi/animasi CSS + animasi Chart.js agar modal, tabel &
   grafik langsung tampil UTUH (0 dtk) — tidak ada lingkaran pie yang
   terpotong. Pulse kini ter-encapsulate di dalam holdRead (repaint tiap 100 ms)
   setiap detik hold benar-benar terekam sebagai frame oleh screencast. */
const ZERO_ANIM_CSS =
  '* { transition: none !important; animation: none !important; ' +
  'scroll-behavior: auto !important; } ' +
  'body { scroll-behavior: auto !important; }';

async function disableAnimations() {
  try { await page.addStyleTag({ content: ZERO_ANIM_CSS }); } catch (e) {}
  try {
    await page.evaluate(() => {
      const setNoAnim = () => {
        if (!window.Chart) return;
        try { Chart.defaults.animation = false; } catch (e) {}
        try { Chart.defaults.animations = false; } catch (e) {}
        try { Chart.defaults.global && (Chart.defaults.global.animation = false); } catch (e) {}
      };
      setNoAnim();
      try { new MutationObserver(setNoAnim).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
    });
  } catch (e) {}
}

async function isShown(sel) {
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return false;
    if (el.classList.contains('hidden') || el.getAttribute('aria-hidden') === 'true') return false;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }, sel).catch(() => false);
}

async function assertTourOff() {
  const on = await page.evaluate(() => {
    const o = document.getElementById('tour-overlay');
    return !!(o && o.classList.contains('active'));
  }).catch(() => false);
  if (on) {
    log('WARN tour aktif -> dimatikan');
    await page.evaluate(() => { try { const o = document.getElementById('tour-overlay'); if (o) { o.classList.remove('active'); o.classList.add('hidden'); } } catch (e) {} });
  }
}

async function waitShown(sel, t) {
  const start = Date.now();
  while (Date.now() - start < (t || 20000)) { if (await isShown(sel)) return true; await sleep(200); }
  log('WARN waitShown timeout: ' + sel);
  return false;
}

async function visibleModal(id) {
  return page.evaluate((m) => {
    const el = document.getElementById(m);
    return !!(el && !el.classList.contains('hidden'));
  }, id).catch(() => false);
}
async function waitModal(id, t) {
  const start = Date.now();
  while (Date.now() - start < (t || 20000)) { if (await visibleModal(id)) return; await sleep(200); }
  log('WARN waitModal timeout: ' + id);
}
async function closeModal(id) {
  await page.evaluate((m) => {
    const b = document.querySelector('#' + m + ' button[onclick^="closeModal"]');
    if (b) b.click();
  }, id).catch(() => {});
}
async function closeAllModals() {
  const ids = ['modal-bq', 'modal-my', 'modal-approval', 'modal-bqsummary', 'modal-rak', 'modal-stok',
    'modal-report', 'modal-prsummary', 'modal-riwayat', 'modal-usermgmt', 'modal-logactivity'];
  for (const id of ids) { if (await visibleModal(id)) { await closeModal(id); if (id === 'modal-approval') await page.evaluate(() => { try { stopApprovalAutoRefresh(); } catch (e) {} }); } }
  await sleep(HOLD.TRANSITION);
}

async function waitBody(sel, t) {
  const start = Date.now();
  while (Date.now() - start < (t || 20000)) {
    const n = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return 0;
      return Math.max(el.children.length, el.innerText.trim().length);
    }, sel).catch(() => 0);
    if (n > 40) return;
    await sleep(250);
  }
  log('WARN waitBody timeout: ' + sel);
}

/* Tunggu elemen konten benar-benar ter-render (generik, dipakai holdRead).
   Mendukung tabel/daftar (punya baris), teks (Riwayat), dan canvas (Chart.js). */
async function waitDomReady(sel, t) {
  const start = Date.now();
  while (Date.now() - start < (t || 20000)) {
    const ok = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return false;
      if (el.tagName === 'CANVAS') return el.width > 0 && el.height > 0;
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^(memuat|loading)/i.test(txt) && el.children.length <= 1) return false;
      return el.children.length > 0 || txt.length > 0;
    }, sel).catch(() => false);
    if (ok) return;
    await sleep(200);
  }
  log('WARN waitDomReady timeout: ' + sel);
}

/* holdRead — SATU pintu untuk setiap penutupan modal/popup data.
   Mengunci URUTAN MUTLAK: (1) Wait DOM -> (2) Animation Buffer 1,5 dtk
   -> (3) Reading Hold 3 dtk. Render-animasi TIDAK PERNAH digabung dengan
   waktu baca: buffer render dituntaskan dulu, baru jeda baca berjalan.
   Frame Pulse DI-ENCAPSULATE di dalam try/finally: interval SELALU dibersihkan
   dan opacity dipaksa reset, apa pun yang terjadi. Tidak ada interval global
   yang bocor/ke-skip ke langkah berikutnya. */
async function holdRead(sel, opts) {
  opts = opts || {};
  await waitDomReady(sel, opts.timeout || 20000);                       // (1) WAIT FOR DOM
  let pulseInterval = null;
  try {
    pulseInterval = setInterval(() => {                                 // (2) Frame Pulse lokal
      page.evaluate(() => {
        const on = document.body.dataset.p === '1';
        document.body.style.opacity = on ? '1' : '0.999';
        document.body.dataset.p = on ? '0' : '1';
      }).catch(() => {});
    }, 100);
    await sleep(HOLD.BUFFER);                                           //     ANIMATION BUFFER
    await sleep(opts.read == null ? HOLD.MODAL_CLOSE : opts.read);      // (3) READING HOLD
  } finally {
    clearInterval(pulseInterval);                                       // wajib: interval tidak bocor
    try {
      await page.evaluate(() => { document.body.style.opacity = '1'; delete document.body.dataset.p; });
    } catch (e) { /* halaman sedang ganti — abaikan */ }
  }
}

/* Network Data Waiter khusus grafik (Monthly Report).
   Canvas #reportChart sudah berdimensi SELAGI data masih kosong (fetch
   /api/reports/monthly selesai SETELAH modal terbuka), jadi cek width/height
   canvas TIDAK cukup. WATOR ini menunggu sampai: (1) Chart.getChart menemukan
   instance, (2) dataset berisi nilai (bukan []), (3) kartu KPI lbl-total /
   lbl-menunggu / lbl-disetujui terisi. Dengan begitu holdRead di seg09 baru
   mulai saat pie chart tampil UTUH. Selama menunggu, Frame Pulse tetap berjalan
   (interval di-clear di finally) agar periode load ikut terekam frame. */
async function waitReportData(timeout = 25000) {
  let pulseInterval = null;
  try {
    pulseInterval = setInterval(() => {                 // Frame Pulse lokal
      page.evaluate(() => {
        const on = document.body.dataset.p === '1';
        document.body.style.opacity = on ? '1' : '0.999';
        document.body.dataset.p = on ? '0' : '1';
      }).catch(() => {});
    }, 100);
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const ready = await page.evaluate(() => {
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
      }).catch(() => false);
      if (ready) return;
      await sleep(250);
    }
    log('WARN waitReportData timeout (chart/KPI belum siap)');
  } finally {
    clearInterval(pulseInterval);                       // wajib: interval tidak bocor
    try { await page.evaluate(() => { document.body.style.opacity = '1'; delete document.body.dataset.p; }); } catch (e) {}
  }
}

async function clickTile(action) {
  const ok = await page.evaluate((a) => {
    const el = document.querySelector('[data-action="' + a + '"]');
    if (el) { el.click(); return true; }
    return false;
  }, action).catch(() => false);
  if (!ok) log('WARN clickTile tidak ketemu: ' + action);
  return ok;
}
async function clickStock(type) {
  await page.evaluate((x) => { const el = document.querySelector('[data-stock="' + x + '"]'); if (el) el.click(); }, type).catch(() => {});
}

async function typeInto(sel, text) {
  const tag = await page.evaluate((s) => { const el = document.querySelector(s); return el ? el.tagName : ''; }, sel).catch(() => '');
  if (tag === 'SELECT') {
    const ok = await page.evaluate(({ s, text }) => {
      const el = document.querySelector(s);
      const opt = Array.prototype.find.call(el.options, (o) => o.textContent.trim() === text || o.value === text);
      if (opt) { el.value = opt.value; el.dispatchEvent(new Event('change', { bubbles: true })); return true; }
      return false;
    }, { s: sel, text: text }).catch(() => false);
    if (!ok) log('WARN select value tak ada: ' + sel + ' = ' + text);
    return;
  }
  const el = await page.$(sel);
  if (el) { await el.click({ clickCount: 3 }); await el.type(text, { delay: 35 }); }
  else log('WARN input tak ada: ' + sel);
}

async function freshLogin(user, pass) {
  await page.evaluate(() => { try { clearSession(); } catch (e) {} });
  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' });
  await disableTour();
  await disableAnimations(); // ZAM: semua grafik/modal tampil utuh seketika
  await armTourOff();
  await waitShown('#login-section', 12000);
  await sleep(HOLD.TRANSITION);
  const inp = await page.$('#inp-user');
  if (inp) { await inp.click({ clickCount: 3 }); await inp.type(user, { delay: 45 }); }
  const pe = await page.$('#inp-pass');
  if (pe) await pe.type(pass, { delay: 45 });
  await page.evaluate(() => { const b = document.getElementById('btn-login'); if (b) b.click(); });
  await page.waitForFunction(() => {
    const d = document.getElementById('dash-section');
    return d && !d.classList.contains('hidden');
  }, { timeout: 20000 }).catch(() => log('WARN login->dash timeout'));
  await assertTourOff();
  // Tanpa sleep di sini: pembukaan menu setelah login harus instan.
}

async function doLogout() {
  const ok = await page.evaluate(() => { const b = document.getElementById('btn-logout'); if (b) { b.click(); return true; } return false; }).catch(() => false);
  if (!ok) { await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' }); }
  const wait = await waitShown('#login-section', 12000);
  if (!wait) { await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' }); await waitShown('#login-section', 12000); }
  await sleep(HOLD.TRANSITION);
}

async function titleCard(big, small) {
  // [DIMATIKAN] Layar pembuka & penutup ("MICROPAGE E-SPAREPART" / "TERIMA KASIH")
  // tidak pernah dirender agar rekaman murni UI. Hapus `return;` untuk mengaktifkan lagi.
  return;
  await page.evaluate(({ big, small }) => {
    const d = document.createElement('div');
    d.id = 'rec-title';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#020617,#0f172a 60%,#020617);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;';
    d.innerHTML = '<div style="font-size:44px;font-weight:900;color:#7dd3fc;letter-spacing:2px;">' + big +
      '</div><div style="font-size:22px;color:#94a3b8;font-weight:600;max-width:900px;line-height:1.6;padding:0 24px;">' + small + '</div>';
    document.body.appendChild(d);
  }, { big, small });
  await sleep(HOLD.TITLE);
  await page.evaluate(() => { const d = document.getElementById('rec-title'); if (d) d.remove(); });
  await sleep(HOLD.TRANSITION);
}

async function chapterCard(title, sub) {
  // [DIMATIKAN] Teks transisi bab ("2 · LOGIN ...", "3 · FORM BQ ...", dst)
  // tidak pernah dirender agar rekaman murni UI. Hapus `return;` untuk mengaktifkan lagi.
  return;
  await page.evaluate(({ title, sub }) => {
    const d = document.createElement('div');
    d.id = 'rec-chapter';
    d.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#020617;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;';
    d.innerHTML = '<div style="font-size:30px;font-weight:800;color:#38bdf8;letter-spacing:1px;text-align:center;padding:0 24px;">' + title +
      '</div><div style="font-size:16px;color:#94a3b8;text-align:center;padding:0 48px;max-width:950px;line-height:1.65;">' + sub + '</div>';
    document.body.appendChild(d);
  }, { title, sub });
  await sleep(HOLD.CHAPTER);
  await page.evaluate(() => { const d = document.getElementById('rec-chapter'); if (d) d.remove(); });
  await sleep(HOLD.TRANSITION);
}

async function searchApproval(noReg) {
  const inp = await page.$('#approval-search');
  if (inp) { await inp.click({ clickCount: 3 }); await inp.type(noReg, { delay: 30 }); }
  await sleep(HOLD.MENU);
}
async function clickRowButton(noReg, selector) {
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
  }, { no: noReg, sel: selector }).catch(() => false);
  if (!ok) log('WARN klik tidak ketemu di baris ' + noReg + ' -> ' + selector);
  return ok;
}
async function setRowSelect(noReg, attr, value) {
  const ok = await page.evaluate(({ no, attr, value }) => {
    const rows = document.querySelectorAll('#tbody-pengajuan tr');
    for (const tr of rows) {
      const td = tr.querySelector('td.font-mono');
      if (td && td.textContent.trim() === no) {
        const sels = tr.querySelectorAll('select');
        for (const s of sels) {
          if (attr && !s.hasAttribute(attr)) continue;
          const matches = Array.prototype.some.call(s.options, (o) => o.value === value || o.textContent.trim() === value);
          if (matches) { s.value = value; s.dispatchEvent(new Event('change', { bubbles: true })); return true; }
        }
      }
    }
    return false;
  }, { no: noReg, attr: attr, value: value }).catch(() => false);
  if (!ok) log('WARN select gagal ' + noReg + ' [' + (attr || '-') + ']=' + value);
  return ok;
}

/* ============================ SEGMEN ============================ */

async function seg01() {
  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' });
  await disableTour();
  await disableAnimations(); // ZAM: semua grafik/modal tampil utuh seketika
  await armTourOff();
  await waitShown('#login-section', 12000);
  await assertTourOff();
  await titleCard('MICROPAGE E-SPAREPART', 'Panduan Test Manual QA — Alur Lengkap Pengujian');
  await sleep(HOLD.TRANSITION);
}

async function seg02() {
  await freshLogin('AAA', '04AAA10');
  await chapterCard('2 · LOGIN & DASHBOARD TEKNISI', 'Otentikasi AUTH-01..08 · menu sesuai peran UI-03');
  await sleep(HOLD.MENU);
}

async function seg03() {
  await clickTile('bq');
  await waitModal('modal-bq');
  await chapterCard('3 · FORM BQ PERSONAL', 'Autocomplete item FORM-03..06 · isi & kirim pengajuan');
  const ic = await page.$('#f-itemcode');
  if (ic) { await ic.click({ clickCount: 3 }); await ic.type('O-50834', { delay: 50 }); }
  await sleep(HOLD.FORM); // tunggu daftar autocomplete
  await page.evaluate(() => { const s = document.querySelector('#itemcode-list [data-index="0"]'); if (s) s.click(); }).catch(() => log('WARN suggestion tdk ada'));
  await sleep(HOLD.TRANSITION);
  await page.evaluate(() => {
    const el = document.getElementById('f-itemcode');
    if (el) { el.value = 'O-50834-00'; el.dispatchEvent(new Event('input', { bubbles: true })); }
  });
  await sleep(HOLD.TRANSITION);
  log('f-itemcode = ' + (await page.evaluate(() => document.getElementById('f-itemcode').value)));
  await typeInto('#f-qty', '2');
  await typeInto('#f-uom', 'Pcs');
  await typeInto('#f-purpose', 'EJO');
  await typeInto('#f-no-ejo', 'EJO/QA/VIDEO/2026');
  await typeInto('#f-mesin-area', 'Mesin Capping VCM200');
  await typeInto('#f-merk', 'Sanyo');
  await typeInto('#f-spesifikasi', 'Sparepart khusus untuk video panduan QA');
  await sleep(HOLD.SUBMIT); // Hold 1,5 dtk setelah isi form sebelum klik KIRIM PENGAJUAN
  await page.evaluate(() => { const b = document.getElementById('btn-kirim-bq'); if (b) b.click(); });
  await sleep(HOLD.TOAST); // toast "Pengajuan Berhasil"
  await closeAllModals();
  const noReg = await page.evaluate(() => {
    return fetch('/api/pengajuan/all?username=AAA&actor=AAA', { headers: { 'x-requested-with': 'fetch' } })
      .then((r) => r.json())
      .then((arr) => {
        const list = Array.isArray(arr) ? arr : (arr.data || []);
        const row = list.filter((x) => x.no_ejo === 'EJO/QA/VIDEO/2026').sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))[0];
        return row ? row.no_registrasi : null;
      }).catch(() => null);
  });
  state.noReg = noReg;
  log('noReg hasil submit = ' + noReg);
  await sleep(HOLD.MENU);
}

async function seg04() {
  await doLogout();
  await chapterCard('4 · APPROVAL BQ — TAHAP SUPERVISOR', 'RBAC-15 supervisor setujui + tentukan urgensi · audit trail MON-09');
  await freshLogin('KAA', 'KAA1910');
  await clickTile('monitoring');
  await waitModal('modal-approval');
  await holdRead('#tbody-pengajuan'); // Wait DOM -> buffer animasi -> reading hold (tabel Approval BQ)
  if (state.noReg) {
    await searchApproval(state.noReg);
    await setRowSelect(state.noReg, 'data-urgency', 'Urgent');
    await sleep(HOLD.DENSE);
    await sleep(HOLD.SUBMIT); // Hold 1,5 dtk sebelum klik Approve (Supervisor)
    await clickRowButton(state.noReg, '[data-field="spv"][data-approve="approved"]');
    await sleep(HOLD.TOAST); // toast "disetujui"
    await clickRowButton(state.noReg, '[data-history]');
    await waitModal('modal-riwayat');
    await holdRead('#riwayat-body'); // Wait DOM -> buffer animasi -> reading hold (Riwayat Approval)
    await closeAllModals();
  }
  await sleep(HOLD.MENU);
}

async function seg05() {
  await doLogout();
  await chapterCard('5 · STATUS PENGADAAN — ADMINISTRATOR', 'Administrator tak menyetujui, hanya mengelola status pengadaan MON-01');
  await freshLogin('ANS', 'ANS1805');
  await clickTile('monitoring');
  await waitModal('modal-approval');
  await holdRead('#tbody-pengajuan'); // Wait DOM -> buffer animasi -> reading hold (tabel Approval BQ)
  if (state.noReg) {
    await searchApproval(state.noReg);
    await setRowSelect(state.noReg, '', 'Proses PO');
    await sleep(HOLD.DENSE);
  }
  await sleep(HOLD.MENU);
}

async function seg06() {
  await doLogout();
  await chapterCard('6 · APPROVAL FINAL MANAGER + RIWAYAT', 'RBAC-10/11 manager · riwayat 3 entri (SPV, pengadaan, MGR)');
  await freshLogin('KSW', '01KSW10');
  await clickTile('monitoring');
  await waitModal('modal-approval');
  await holdRead('#tbody-pengajuan'); // Wait DOM -> buffer animasi -> reading hold (tabel Approval BQ)
  if (state.noReg) {
    await searchApproval(state.noReg);
    await sleep(HOLD.SUBMIT); // Hold 1,5 dtk sebelum klik Approve (Manager)
    await clickRowButton(state.noReg, '[data-field="mgr"][data-approve="approved"]');
    await sleep(HOLD.TOAST); // toast "disetujui"
    await clickRowButton(state.noReg, '[data-history]');
    await waitModal('modal-riwayat');
    await holdRead('#riwayat-body'); // Wait DOM -> buffer animasi -> reading hold (Riwayat Approval)
    await closeAllModals();
  }
  await sleep(HOLD.MENU);
}

async function seg07() {
  await chapterCard('7 · REKAPAN PENGAJUAN', 'MON-01b rekapan hanya pengajuan disetujui penuh SPV + Manager');
  await clickTile('bqsummary');
  await waitModal('modal-bqsummary');
  await waitBody('#bqsummary-body', 25000);
  const stuck = await page.evaluate(() => {
    const b = document.getElementById('bqsummary-body');
    return !!b && /Memuat/.test(b.innerText);
  }).catch(() => false);
  if (stuck) {
    log('bqsummary masih memuat -> coba refresh muat ulang');
    await page.evaluate(() => { const m = document.getElementById('modal-bqsummary'); m.classList.add('hidden'); });
    await sleep(HOLD.TRANSITION);
    await clickTile('bqsummary');
    await waitModal('modal-bqsummary');
    await waitBody('#bqsummary-body', 25000);
  }
  await holdRead('#bqsummary-body'); // Wait DOM -> buffer animasi -> reading hold (Rekapan Pengajuan)
  await closeAllModals();
}

async function seg08() {
  await chapterCard('8 · LAYOUT RAK · ON HAND STOCK', 'RAK-01..06 layout & Belum Ada Lokasi · STOK-01/02 · Critical Part');
  await clickTile('rak');
  await waitModal('modal-rak');
  await holdRead('#rak-body'); // Wait DOM -> buffer animasi -> reading hold (Layout Rak - tab Semua)
  const okTab = await page.evaluate(() => {
    const tab = document.querySelector('#rak-tabs [data-rak-tab="BELUM"]');
    if (tab) { tab.click(); return true; }
    return false;
  }).catch(() => false);
  if (!okTab) log('WARN tab BELUM tdk ada');
  await holdRead('#rak-body'); // Wait DOM -> buffer animasi -> reading hold (Layout Rak - Belum Ada Lokasi)
  await closeAllModals();
  await clickTile('stok');
  await waitModal('modal-stok');
  await holdRead('#tbody-stok'); // Wait DOM -> buffer animasi -> reading hold (On Hand Stock)
  await closeAllModals();
  await clickStock('critical');
  await waitModal('modal-stok');
  await holdRead('#tbody-stok'); // Wait DOM -> buffer animasi -> reading hold (Critical Part List)
  await closeAllModals();
}

async function seg09() {
  await chapterCard('9 · MONTHLY REPORT · PR SUMMARY', 'REP-01..05 laporan 22 periode · MON-06 PR read-only tanpa approve');
  await clickTile('report');
  await waitModal('modal-report');
  await waitReportData(); // BLOKIR sampai KPI + pie chart terisi data API
  await holdRead('#reportChart'); // lalu hold penuh 4,5 dtk dengan grafik UTUH
  await closeAllModals();
  await clickTile('prsummary');
  await waitModal('modal-prsummary');
  await holdRead('#prsummary-list'); // Wait DOM -> buffer animasi -> reading hold (PR Summary)
  await page.evaluate(() => { const w = document.getElementById('prsummary-warning'); if (w) w.classList.remove('hidden'); });
  await sleep(HOLD.DENSE);
  await closeAllModals();
}

async function seg10() {
  await chapterCard('10 · APPROVAL USER + LOG AKTIVITAS', 'USR-01..10 pendaftar pending -> tugaskan tim · log login & aktivitas');
  state.qaUser = 'qa_vid' + String(Date.now()).slice(-6);
  const regOk = await page.evaluate((u) => {
    return fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: 'qa123456', name: 'QA Video Pendaftar' })
    }).then((r) => r.json()).then((j) => !!(j.status === 'ok' || j.ok)).catch(() => false);
  }, state.qaUser).catch(() => false);
  log('register ' + state.qaUser + ' -> ' + regOk);
  await clickTile('usermgmt');
  await waitModal('modal-usermgmt');
  await holdRead('#usermgmt-list'); // Wait DOM -> buffer animasi -> reading hold (Approval User)
  const ap = await page.evaluate((u) => {
    const cards = document.querySelectorAll('#usermgmt-list > div, #usermgmt-list [data-username], #usermgmt-list .card, #usermgmt-list tr');
    for (const c of cards) {
      if (c.textContent.indexOf(u) >= 0) {
        const sels = c.querySelectorAll('select');
        for (const s of sels) {
          if (Array.prototype.some.call(s.options, (o) => o.value === 'Supervisor 1')) {
            s.value = 'Supervisor 1'; s.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        const btns = c.querySelectorAll('button');
        for (const b of btns) { if (b.textContent.trim().indexOf('Setujui') >= 0) { b.click(); return true; } }
      }
    }
    return false;
  }, state.qaUser);
  log('approve pendaftar -> ' + ap);
  await sleep(HOLD.TOAST); // toast "Pendaftaran disetujui"
  await closeAllModals();
  await clickTile('logactivity');
  await waitModal('modal-logactivity');
  await holdRead('#log-list'); // Wait DOM -> buffer animasi -> reading hold (Log Aktivitas)
  await page.evaluate(() => { const t = document.getElementById('tab-log-activity'); if (t) t.click(); });
  await sleep(HOLD.DENSE);
  await page.evaluate(() => { const t = document.getElementById('tab-log-login'); if (t) t.click(); });
  await sleep(HOLD.DENSE);
  await closeAllModals();
}

async function seg11() {
  await doLogout();
  await chapterCard('11 · MODE DEMO — TOUR GUIDE OFF', 'UI-15/16 panduan sekali per peran · parameter ?tour=off untuk demo/rekaman');
  await page.evaluate(() => localStorage.removeItem('tour_done_v3_teknisi'));
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle2' });
  await waitShown('#login-section', 12000);
  await sleep(HOLD.TRANSITION);
  const inp = await page.$('#inp-user');
  if (inp) { await inp.click({ clickCount: 3 }); await inp.type('AAA', { delay: 40 }); }
  const pe = await page.$('#inp-pass');
  if (pe) await pe.type('04AAA10', { delay: 40 });
  await page.evaluate(() => { const b = document.getElementById('btn-login'); if (b) b.click(); });
  await page.waitForFunction(() => { const d = document.getElementById('dash-section'); return d && !d.classList.contains('hidden'); }, { timeout: 20000 }).catch(() => {});
  await sleep(HOLD.MENU);
  const tourShown = await page.evaluate(() => { const o = document.getElementById('tour-overlay'); return !!(o && o.classList.contains('active')); }).catch(() => false);
  log('tour AKTIF terlihat: ' + tourShown);
  await sleep(HOLD.MENU);
  await page.evaluate(() => { const s = document.getElementById('tour-skip'); if (s) s.click(); });
  await sleep(HOLD.MENU);
  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' });
  await disableTour();
  await disableAnimations(); // ZAM: semua grafik/modal tampil utuh seketika
  await sleep(HOLD.MENU);
  await page.evaluate(() => { try { const o = document.getElementById('tour-overlay'); if (o) { o.classList.remove('active'); o.classList.add('hidden'); } } catch (e) {} });
  const tourOff = await page.evaluate(() => { const o = document.getElementById('tour-overlay'); return !!(o && o.classList.contains('active')); }).catch(() => false);
  log('tour OFF terlihat: ' + tourOff + ' (harus false)');
  await sleep(HOLD.MENU);
}

async function seg12() {
  await page.evaluate(() => { try { clearSession(); } catch (e) {} });
  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2' });
  await disableTour();
  await disableAnimations(); // ZAM: semua grafik/modal tampil utuh seketika
  await armTourOff();
  await waitShown('#login-section', 12000);
  await titleCard('TERIMA KASIH', '87 test manual · 114 test otomatis — seluruh alur sudah dijalankan');
  await sleep(HOLD.MENU);
}

const SEGMENTS = [
  ['01', seg01], ['02', seg02], ['03', seg03], ['04', seg04], ['05', seg05], ['06', seg06],
  ['07', seg07], ['08', seg08], ['09', seg09], ['10', seg10], ['11', seg11], ['12', seg12],
];

(async () => {
  const t0 = Date.now();
  for (let i = 0; i < 30; i++) {
    try { const r = await fetch(BASE + '/api/pengajuan/all?username=AAA&actor=AAA'); if (r.ok) break; } catch (e) {}
    await sleep(1000);
  }
  log('server siap / lanjut');
  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=' + VIEWPORT.width + ',' + VIEWPORT.height, '--force-device-scale-factor=1']
  });
  page = await browser.newPage();
  page.on('dialog', async (d) => { try { await d.accept(); } catch (e) {} });
  session = await page.target().createCDPSession();
  pumpFrames();
  await session.send('Page.enable');
  log('recorder siap, mulai ' + SEGMENTS.length + ' segmen');

  for (const [seg, fn] of SEGMENTS) {
    await recordSegment(seg, fn);
  }
  await browser.close();
  log('SELESAI dalam ' + Math.round((Date.now() - t0) / 1000) + ' detik');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });