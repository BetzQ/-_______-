const puppeteer = require('puppeteer');
const BASE = 'http://localhost:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[SMOKE] ' + m);

(async () => {
  const errors = [];
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const rn = 'smoke_' + Date.now().toString().slice(-6);
  log('test user: ' + rn);

  // 1. Halaman login + link register
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#link-register');
  log('login page OK, #link-register ada');

  // 2. Buka modal register
  await page.click('#link-register');
  await sleep(300);
  const modalOpen = await page.$eval('#modal-register', (el) => !el.classList.contains('hidden'));
  if (!modalOpen) throw new Error('modal-register tidak terbuka');
  log('modal-register terbuka');

  // 3. Isi & submit pendaftaran
  await page.type('#reg-username', rn);
  await page.type('#reg-name', 'Smoke Test User');
  await page.type('#reg-pass', 'rahasia123');
  await page.click('#btn-register');
  await sleep(1200);
  const regInfo = await page.$eval('#reg-info', (el) => el.textContent.trim());
  log('register response: ' + regInfo.slice(0, 60));
  if (!/berhasil/i.test(regInfo)) throw new Error('Pendaftaran gagal: ' + regInfo);

  // 4. Tutup modal, login sebagai manager KSW
  await page.evaluate(() => { document.getElementById('modal-register').classList.add('hidden'); });
  await page.type('#inp-user', 'KSW');
  await page.type('#inp-pass', '01KSW10');
  await page.click('#btn-login');
  await page.waitForSelector('#menu-grid [data-action="usermgmt"]', { timeout: 10000 });
  log('manager login OK, menu Approval User tampil');

  // 5. Buka Approval User -> pastikan smoke user muncul
  await page.click('#menu-grid [data-action="usermgmt"]');
  await sleep(1500);
  const foundRow = await page.evaluate((u) => {
    const rows = Array.from(document.querySelectorAll('#usermgmt-list [data-reg]'));
    return rows.map((r) => ({ id: r.getAttribute('data-reg'), text: r.textContent })).find((x) => x.text.includes(u));
  }, rn);
  if (!foundRow) throw new Error('smoke user tidak muncul di approval list');
  log('pending user muncul di list, id=' + foundRow.id);

  // 6. Pilih tim Supervisor 1 lalu setujui
  await page.select('[data-reg-tim="' + foundRow.id + '"]', 'Supervisor 1');
  await page.evaluate((id) => window.approveRegistration(id), foundRow.id);
  await sleep(1500);
  const toastOk = await page.evaluate(() => document.body.textContent.includes('Pendaftaran disetujui'));
  log('approve toast: ' + toastOk);

  // 7. Buka Log Aktivitas, cek kedua tab
  await page.click('#menu-grid [data-action="logactivity"]');
  await sleep(1200);
  const loginRows = await page.$$eval('#log-list > div', (els) => els.length);
  log('tab login rows: ' + loginRows);
  await page.evaluate(() => window.switchLogTab('activity'));
  await sleep(1200);
  const actRows = await page.$$eval('#log-list > div', (els) => els.length);
  log('tab activity rows: ' + actRows);
  if (!actRows) throw new Error('activity log kosong');

  log('page errors: ' + (errors.length ? errors.join(' | ') : 'none'));
  await browser.close();
  console.log('SMOKE_RESULT=' + rn + '|' + foundRow.id + '|errors=' + errors.length);
})().catch((e) => { console.error('SMOKE_FAIL: ' + e.message); process.exit(1); });
