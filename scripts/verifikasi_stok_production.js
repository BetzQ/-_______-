/* ============================================================
   scripts/verifikasi_stok_production.js
   Tujuan: cek TEKS modal stok di production (bukan gambar),
   dipakai untuk memastikan bukti screenshot akurat.

   node scripts/verifikasi_stok_production.js
   ============================================================ */

const puppeteer = require('puppeteer');

const BASE = process.env.APP_BASE_URL || 'https://e-sparepart-system-tau.vercel.app';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(BASE + '/index.html?tour=off', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => { try { sessionStorage.clear(); localStorage.clear(); } catch (e) {} });
  await page.reload({ waitUntil: 'networkidle2', timeout: 90000 });
  await page.waitForSelector('#inp-user', { timeout: 30000 });
  await page.type('#inp-user', 'KSW');
  await page.type('#inp-pass', '01KSW10');
  await page.click('#btn-login');
  await page.waitForFunction(
    () => { const d = document.getElementById('dash-section'); return d && !d.classList.contains('hidden'); },
    { timeout: 45000 }
  );

  for (const mode of ['all', 'critical', 'low', 'out']) {
    await page.evaluate((m) => window.openStokModal(m), mode);
    await sleep(3000);
    const info = await page.evaluate(() => {
      const cell = (i) => {
        const r = document.querySelectorAll('#tbody-stok tr')[0];
        if (!r) return '(kosong)';
        const c = r.children[i];
        return c ? c.innerText.replace(/\s+/g, ' ').trim() : '-';
      };
      const meta = Array.from(document.querySelectorAll('#modal-stok [id*="stok"]'))
        .map((e) => e.id + '=' + e.innerText.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      return {
        judul: document.getElementById('stok-modal-title').innerText.trim(),
        subjudul: document.getElementById('stok-modal-sub').innerText.trim(),
        baris: document.querySelectorAll('#tbody-stok tr').length,
        contoh: [cell(0), cell(1), cell(2), cell(3), cell(4)],
        meta: meta,
      };
    });
    console.log('--- MODE ' + mode + ' ---');
    console.log(JSON.stringify(info, null, 2));
    await page.evaluate(() => window.closeModal('modal-stok'));
    await sleep(800);
  }

  await browser.close();
})().catch((e) => { console.error('FATAL: ' + e.message); process.exit(1); });