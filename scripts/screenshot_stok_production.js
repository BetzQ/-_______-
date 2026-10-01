/* ============================================================
   scripts/screenshot_stok_production.js
   Tujuan: ambil bukti visual modul stok (Daftar Stok Sparepart,
   Critical Part List, Stok Rendah, Stok Habis, Layout Rak)
   dari PRODUCTION memakai data real.

   Pakai:
     $env:APP_BASE_URL='https://e-sparepart-system-tau.vercel.app'
     node scripts/screenshot_stok_production.js

   Hasil: docs/evidence/hasil-produk/stok-*.png
   ============================================================ */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_BASE_URL || 'https://e-sparepart-system-tau.vercel.app';
const OUT = path.join(__dirname, '..', 'docs', 'evidence', 'hasil-produk');
const VIEWPORT = { width: 1440, height: 900 };

const ROLES = [
  { key: 'teknisi', user: 'AAA', pass: '04AAA10' },
  { key: 'spv1', user: 'INN', pass: '30INN11' },
  { key: 'spv2', user: 'KAA', pass: 'KAA1910' },
  { key: 'officer', user: 'ANS', pass: 'ANS1805' },
  { key: 'manager', user: 'KSW', pass: '01KSW10' },
];

const VIEWS = [
  { slug: 'semua', stock: 'all', action: 'stok', title: 'Daftar Stok Sparepart' },
  { slug: 'kritis', stock: 'critical', action: 'critical', title: 'Critical Part List' },
  { slug: 'rendah', stock: 'low', action: 'stok', title: 'Item Stok Rendah' },
  { slug: 'habis', stock: 'out', action: 'stok', title: 'Item Stok Habis' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[SHOT] ' + m);

async function disableTour(page) {
  await page.evaluate(() => {
    ['teknisi', 'supervisor 1', 'supervisor 2', 'officer', 'manager'].forEach((r) => {
      try { localStorage.setItem('tour_done_v2_' + r, '1'); } catch (e) {}
    });
    const ov = document.getElementById('tour-overlay');
    if (ov && ov.classList.contains('active')) ov.classList.remove('active');
  });
}

async function login(page, user, pass) {
  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => { try { sessionStorage.clear(); localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle2', timeout: 90000 });
  await page.waitForSelector('#inp-user', { timeout: 30000 });
  await page.type('#inp-user', user);
  await page.type('#inp-pass', pass);
  await page.click('#btn-login');
  // Tunggu dashboard benar-benar tampil (bukan hanya tombol diklik).
  await page.waitForFunction(
    () => { const d = document.getElementById('dash-section'); return d && !d.classList.contains('hidden'); },
    { timeout: 45000 }
  );
}

async function shoot(page, file) {
  const p = path.join(OUT, file);
  await page.screenshot({ path: p, fullPage: false });
  log('saved ' + file);
}

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const results = [];

  for (const role of ROLES) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    try {
      await login(page, role.user, role.pass);
      await disableTour(page);

      const ok = await page.evaluate(() => {
        const d = document.getElementById('dash-section');
        return !!(d && !d.classList.contains('hidden'));
      });
      if (!ok) { log('LOGIN GAGAL ' + role.key); await page.close(); continue; }

      // 1) Dashboard
      await sleep(2000);
      await shoot(page, 'stok-' + role.key + '-dashboard.png');

      // 2) Semua tampilan modal stok
      for (const v of VIEWS) {
        // Kartu KPI hanya tampil untuk non-Teknisi. Kalau tidak ada,
        // panggil openStokModal(mode) langsung supaya view-nya tetap benar.
        const opened = await page.evaluate((o) => {
          const kpi = document.querySelector('[data-stock="' + o.stock + '"]');
          if (kpi && !kpi.closest('.hidden')) { kpi.click(); return 'kpi'; }
          if (typeof window.openStokModal === 'function') { window.openStokModal(o.stock); return 'fungsi'; }
          const menu = document.querySelector('[data-action="' + o.action + '"]');
          if (menu) { menu.click(); return 'menu'; }
          return false;
        }, v);
        if (!opened) { log('lewati ' + v.slug + ' untuk ' + role.key); continue; }

        await page.waitForFunction(
          () => { const m = document.getElementById('modal-stok'); return m && !m.classList.contains('hidden'); },
          { timeout: 25000 }
        ).catch(() => {});
        await sleep(2800);

        // Pastikan subjudul yang tampil sudah benar sebelum difoto.
        const sub = await page.evaluate(() => {
          const el = document.getElementById('stok-modal-sub');
          return el ? el.textContent.trim() : '';
        });
        if (sub && /database lokal/i.test(sub)) log('PERINGATAN subjudul masih salah: ' + sub);

        const rows = await page.evaluate(() => document.querySelectorAll('#tbody-stok tr').length);
        const info = await page.evaluate(() => {
          const t = document.getElementById('stok-modal-title');
          return t ? t.textContent.trim() : '';
        });
        log(role.key + '/' + v.slug + ' via ' + opened + ' baris=' + rows + ' judul="' + info + '"');

        await shoot(page, 'stok-' + role.key + '-' + v.slug + '.png');
        await page.evaluate(() => { if (window.closeModal) closeModal('modal-stok'); });
        await sleep(900);
      }

      // 3) Layout Rak
      const rak = await page.evaluate(() => {
        const b = document.querySelector('[data-action="rak"]');
        if (!b) return false;
        b.click();
        return true;
      });
      if (rak) {
        await sleep(2600);
        await shoot(page, 'stok-' + role.key + '-layout-rak.png');
        await page.evaluate(() => { if (window.closeModal) closeModal('modal-rak'); });
      }

      results.push({ role: role.key, status: 'ok' });
    } catch (e) {
      log('ERROR ' + role.key + ': ' + e.message);
      results.push({ role: role.key, status: 'gagal', error: e.message });
    }
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(
    path.join(OUT, 'stok-_ringkasan.json'),
    JSON.stringify({ base: BASE, waktu: new Date().toISOString(), hasil: results }, null, 2)
  );
  log('SELESAI');
})().catch((e) => { console.error('FATAL: ' + e.message); process.exit(1); });