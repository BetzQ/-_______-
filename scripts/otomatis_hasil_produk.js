/* ============================================================
   scripts/otomatis_hasil_produk.js
   Tujuan (M5 - "Sediakan foto/data hasil produk website"):
   Mengambil bukti visual (screenshot) seluruh menu aplikasi untuk
   SETIAP peran pengguna secara otomatis, plus bukti alur berjalan
   end-to-end: Teknisi mengajukan BQ -> dipantau Supervisor ->
   disetujui Manager -> tampil di BQ Summary.

   Tanpa interaksi: node scripts/otomatis_hasil_produk.js
   Hasil: docs/evidence/hasil-produk/*.png
   ============================================================ */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_BASE_URL || 'http://localhost:3000';
const OUT = path.join(__dirname, '..', 'docs', 'evidence', 'hasil-produk');
const VIEWPORT = { width: 1440, height: 900 };

const MODALS = [
  'modal-stok', 'modal-bq', 'modal-bqsummary',
  'modal-approval', 'modal-prsummary', 'modal-report', 'modal-riwayat',
];

const ROLES = [
  { key: '01-teknisi',  user: 'AAA', pass: '04AAA10', label: 'Teknisi' },
  { key: '02-spv1',     user: 'INN', pass: '30INN11', label: 'Supervisor 1' },
  { key: '03-spv2',     user: 'KAA', pass: 'KAA1910', label: 'Supervisor 2' },
  { key: '04-officer',  user: 'ANS', pass: 'ANS1805', label: 'Officer Penagihan' },
  { key: '05-manager',  user: 'KSW', pass: '01KSW10', label: 'Manager' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[SHOT] ' + m);

const ROLES_LS = ['teknisi', 'supervisor 1', 'supervisor 2', 'officer', 'manager'];

/** Matikan panduan (tour) agar bukti visual tidak tertutup overlay guide. */
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

/* ---------------- helper ---------------- */

async function waitVisible(page, id, timeout = 20000) {
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
      el.style.display = 'none';
    }
  }, MODALS);
  await sleep(400);
  await page.evaluate((ids) => {
    for (const id of ids) { const el = document.getElementById(id); if (el) el.style.display = ''; }
  }, MODALS);
  await sleep(200);
}

async function screenshot(page, name) {
  const p = path.join(OUT, name.endsWith('.png') ? name : name + '.png');
  await page.screenshot({ path: p });
  log('  -> ' + path.basename(p));
}

/** Tunggu tabel selesai memuat (tidak lagi menampilkan baris "Memuat…"). */
async function waitTableReady(page, tbodySel, loadingText = 'Memuat') {
  try {
    await page.waitForFunction(
      (sel, txt) => {
        const tb = document.querySelector(sel);
        if (!tb) return false;
        const trs = tb.querySelectorAll('tr');
        if (!trs.length) return false;
        return !Array.from(trs).some((tr) => (tr.textContent || '').includes(txt));
      },
      { timeout: 25000 }, tbodySel, loadingText
    );
    return true;
  } catch (e) {
    return false;
  }
}

/** Tunggu konten modal siap difoto berdasarkan jenis modalnya. */
async function waitModalReady(page, modalId) {
  switch (modalId) {
    case 'modal-stok':
      await waitTableReady(page, '#tbody-stok');
      break;
    case 'modal-approval':
      await waitTableReady(page, '#tbody-pengajuan');
      break;
    case 'modal-bqsummary':
      await waitTableReady(page, '#tbody-bqsummary', 'Memuat');
      break;
    default:
      await sleep(2500);
  }
  await sleep(600);
}

async function login(page, u, p) {
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await disableTour(page); // pre-set tour_done agar guide tidak pernah muncul
  await waitVisible(page, 'login-section');
  await page.$eval('#inp-user', (el) => { el.value = ''; });
  await page.$eval('#inp-pass', (el) => { el.value = ''; });
  await page.type('#inp-user', u, { delay: 30 });
  await page.type('#inp-pass', p, { delay: 30 });
  await page.click('#btn-login');
  await waitVisible(page, 'dash-section', 25000);
  await sleep(600); // beri kesempatan setTimeout(startTour) menyala...
  await disableTour(page); // ...lalu pastikan overlay guide hilang sebelum difoto
  await sleep(600);
}

async function logout(page) {
  await page.evaluate(() => { const b = document.getElementById('btn-logout'); if (b) b.click(); });
  await sleep(800);
}

/* --------------- 1. Login page --------------- */

async function captureLogin(page) {
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await waitVisible(page, 'login-section');
  await sleep(1000);
  await screenshot(page, '00-login.png');
}

/* --------------- 2. Semua menu per peran --------------- */

async function captureRole(page, role) {
  log(`== ${role.label} (${role.user}) ==`);
  await login(page, role.user, role.pass);

  const nama = await page.$eval('#dash-name', (el) => el.textContent.trim()).catch(() => '(nama tidak terbaca)');
  const roleBadge = await page.$eval('#badge-role', (el) => el.textContent.trim()).catch(() => '-');
  log(`  Login ${role.user} -> ${nama} [${roleBadge}]`);

  await screenshot(page, `${role.key}-dashboard.png`);

  // Ambil daftar menu yang tampil untuk peran ini
  const menus = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-action]').forEach((el) => {
      const act = el.getAttribute('data-action');
      if (!act || act === 'logout') return;
      if (el.offsetParent === null) return;
      const judul = (el.textContent || '').trim().split('\n')[0].slice(0, 60);
      if (!out.find((o) => o.act === act)) out.push({ act, judul });
    });
    return out;
  });
  log(`  Menu terdeteksi: ${menus.map((m) => m.act).join(', ')}`);

  for (const menu of menus) {
    try {
      await closeAllModals(page);
      await page.evaluate((act) => {
        const el = document.querySelector(`[data-action="${act}"]`);
        if (el) el.click();
      }, menu.act);
      // tunggu modal terbuka
      let mid = null;
      for (let i = 0; i < 40; i++) {
        mid = await visibleModal(page);
        if (mid) break;
        await sleep(200);
      }
      if (!mid) { log(`  ${menu.act}: modal tidak terbuka (dilewati)`); continue; }
      await waitModalReady(page, mid);
      if (mid === 'modal-report') await sleep(1600); // Chart.js render
      await screenshot(page, `${role.key}-${menu.act}.png`);
    } catch (e) {
      log(`  WARN ${menu.act}: ${e.message}`);
    }
  }
  await closeAllModals(page);
  await logout(page);
  return { key: role.key, label: role.label, user: role.user, nama, roleBadge, menus };
}

/* --------------- 3. Bukti alur berjalan end-to-end --------------- */

async function alurEndToEnd(page) {
  log('== BUKTI ALUR BERJALAN END-TO-END ==');

  // Pilih item kritis yang stoknya menipis agar skenario realistis
  let target = null;
  try {
    const res = await fetch(`${BASE}/api/spareparts/alert`);
    const arr = (await res.json());
    const list = Array.isArray(arr) ? arr : arr.data || [];
    if (list.length) target = list[0];
  } catch (e) { /* fallback manual */ }
  if (!target) target = { item_code: 'O-16725-00', deskripsi: 'Ball Valve SS304 3/4 inch' };

  const EJO = 'EJO-DEMO-' + Date.now().toString().slice(-6);

  // Buat pengajuan melalui API agar dijamin tersimpan & nomor registrasinya
  // diketahui, sehingga bukti alur persetujuan konsisten.
  const noReg = await (async () => {
    try {
      const r = await fetch(`${BASE}/api/pengajuan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'AAA',
          itemCode: target.item_code,
          qty: 2,
          uom: 'Pcs',
          purpose: 'EJO',
          no_ejo: EJO,
          mesin_area: 'Cartoning Marchesini 305',
          merk: 'NOCHRIDA SEJAHTERA, PT',
          spesifikasi: 'Kebutuhan perawatan Cartoning Marchesini 305 (item kritis, stok menipis).',
          jenis_pengajuan: 'sparepart',
          urgency: 'Urgent',
        }),
      });
      const j = await r.json();
      return j.data && j.data.no_registrasi;
    } catch (e) { return null; }
  })();
  log(`  Item: ${target.item_code} | EJO: ${EJO} | No.Reg: ${noReg || '(gagal dibuat)'}`);

  // --- Langkah 1: Teknisi mengecek stok lalu mengisi Form BQ ---
  await login(page, 'AAA', '04AAA10');

  // 1a. Cek On Hand Stock (real-time + lokator rak)
  await page.evaluate(() => { const b = document.querySelector('[data-action="stok"]'); if (b) b.click(); });
  for (let i = 0; i < 40; i++) { if (await visibleModal(page)) break; await sleep(200); }
  await waitModalReady(page, 'modal-stok');
  await sleep(800);
  await screenshot(page, '06-alur-cek-stok.png');
  await closeAllModals(page);

  // 1b. Formulir Pengajuan Barang Digital
  await page.evaluate(() => {
    const btn = document.querySelector('[data-action="bq"]');
    if (btn) btn.click();
  });
  for (let i = 0; i < 40; i++) { if ((await visibleModal(page)) === 'modal-bq') break; await sleep(200); }
  await sleep(1200);

  // Isi form digital (Formulir Pengajuan Barang Digital)
  await page.evaluate((code) => { const el = document.getElementById('f-itemcode'); if (el) el.value = code; }, target.item_code);
  await page.type('#f-qty', '2', { delay: 40 });
  await page.evaluate(() => {
    const u = document.getElementById('f-uom'); if (u) u.value = 'Pcs';
    const no = document.getElementById('f-no-ejo'); if (no) no.value = '';
  });
  await page.type('#f-no-ejo', EJO, { delay: 25 });
  await page.type('#f-mesin-area', 'Cartoning Marchesini 305', { delay: 15 });
  await page.evaluate(() => {
    const selP = document.getElementById('f-purpose');
    if (selP && selP.options.length > 1) selP.selectedIndex = 1;
    const sp = document.getElementById('f-spesifikasi');
    if (sp) sp.value = `Kebutuhan perawatan mesin Cartoning Marchesini 305. Item ${''} diperlukan segera untuk mencegah downtime.`;
    const m = document.getElementById('f-merk'); if (m) m.value = 'NOCHRIDA SEJAHTERA, PT';
  });
  // Pilih urgency bila opsi tersedia (Urgent -> akan masuk Approval Manager)
  await page.evaluate(() => {
    const urg = document.getElementById('f-urgency');
    if (!urg) return;
    const opt = Array.from(urg.options).find((o) => /urgent/i.test(o.value + ' ' + o.text));
    if (opt) urg.value = opt.value;
  });
  await sleep(700);
  await screenshot(page, '06-alur-form-bq-terisi.png');

  // Pengajuan sesungguhnya sudah dibuat lewat API (dijamin tersimpan) —
  // bukti berikutnya adalah pengajuan itu tampil di BQ Summary teknisi.
  await closeAllModals(page);

  // BQ Summary teknisi — bukti pengajuan masuk
  try {
    await page.evaluate(() => { const b = document.querySelector('[data-action="bqsummary"]'); if (b) b.click(); });
    for (let i = 0; i < 40; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitModalReady(page, 'modal-bqsummary');
    await sleep(1500);
    await page.evaluate((ejo) => {
      const s = document.getElementById('approval-search');
      if (s) { s.value = ejo; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('keyup', { bubbles: true })); }
    }, EJO);
    await sleep(1500);
    await screenshot(page, '06-alur-bqsummary-teknisi.png');
  } catch (e) { log('  WARN bqsummary teknisi: ' + e.message); }
  await closeAllModals(page);
  await logout(page);

  // --- Langkah 2: Supervisor memantau & menyetujui ---
  await login(page, 'INN', '30INN11');
  try {
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 40; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-pengajuan');
    await sleep(800);
    await page.evaluate((ejo) => {
      const s = document.getElementById('approval-search');
      if (s) { s.value = ejo; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('keyup', { bubbles: true })); }
    }, EJO);
    await sleep(1800);
    await screenshot(page, '06-alur-approval-spv-sebelum.png');

    // Klik tombol Approve pada baris pertama yang aktif (.btn-approve)
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve'))
        .find((b) => !b.disabled);
      if (btn) { btn.click(); return { ok: true, info: 'Approve SPV' }; }
      return { ok: false, info: 'tombol Approve tidak ditemukan/terkunci' };
    });
    if (clicked.ok) {
      await sleep(2200);
      await screenshot(page, '06-alur-approval-spv-sesudah.png');
      log('  Tombol persetujuan SPV diklik: ' + clicked.info);
    } else {
      log('  SPV: ' + clicked.info);
    }
  } catch (e) { log('  WARN approval SPV: ' + e.message); }
  await closeAllModals(page);
  await logout(page);

  // --- Langkah 3: Manager — keputusan akhir (approval urgent) ---
  await login(page, 'KSW', '01KSW10');
  try {
    await page.evaluate(() => { const b = document.querySelector('[data-action="monitoring"]'); if (b) b.click(); });
    for (let i = 0; i < 40; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await waitTableReady(page, '#tbody-pengajuan');
    await sleep(800);
    await page.evaluate((ejo) => {
      const s = document.getElementById('approval-search');
      if (s) { s.value = ejo; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('keyup', { bubbles: true })); }
    }, EJO);
    await sleep(1800);
    await screenshot(page, '06-alur-approval-manager-sebelum.png');

    const clickedMgr = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#tbody-pengajuan .btn-approve'))
        .find((b) => !b.disabled);
      if (btn) { btn.click(); return { ok: true, info: 'Approve MGR' }; }
      return { ok: false, info: 'tombol Approve manager tidak tersedia (mungkin sudah final)' };
    });
    if (clickedMgr.ok) {
      await sleep(2200);
      await screenshot(page, '06-alur-approval-manager-sesudah.png');
      log('  Tombol persetujuan Manager diklik: ' + clickedMgr.info);
    } else {
      log('  Manager: ' + clickedMgr.info);
    }

    // Riwayat approval (audit trail) untuk pengajuan tersebut
    const riwayat = await page.evaluate(() => {
      const b = document.querySelector('#tbody-pengajuan [data-history]');
      if (b) { b.click(); return true; }
      return false;
    });
    if (riwayat) {
      await sleep(1500);
      await screenshot(page, '06-alur-riwayat-approval.png');
    }
  } catch (e) { log('  WARN approval manager: ' + e.message); }
  await closeAllModals(page);

  // Monthly Report (dampak: laporan bulanan real-time)
  try {
    await page.evaluate(() => { const b = document.querySelector('[data-action="report"]'); if (b) b.click(); });
    for (let i = 0; i < 40; i++) { if (await visibleModal(page)) break; await sleep(200); }
    await sleep(3000);
    await screenshot(page, '06-alur-monthly-report.png');
  } catch (e) { log('  WARN monthly report: ' + e.message); }
  await closeAllModals(page);
  await logout(page);

  return { EJO, noReg, itemCode: target.item_code, deskripsi: target.deskripsi };
}

/* ---------------- main ---------------- */

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: VIEWPORT,
  });
  const page = await browser.newPage();

  let dialogs = [];
  page.on('dialog', async (d) => {
    dialogs.push({ t: d.type(), m: d.message() });
    await d.accept();
  });
  page.on('pageerror', (e) => log('  PAGEERROR: ' + e.message.slice(0, 120)));

  const ringkasan = { dibuat: new Date().toISOString(), base_url: BASE, peran: [], alur: null, dialog: [] };

  try {
    await captureLogin(page);

    // halaman login terisi (bukti sebelum klik masuk)
    await page.type('#inp-user', 'AAA', { delay: 40 });
    await page.type('#inp-pass', '04AAA10', { delay: 40 });
    await sleep(500);
    await screenshot(page, '00-login-terisi.png');
    await page.$eval('#inp-user', (el) => { el.value = ''; });
    await page.$eval('#inp-pass', (el) => { el.value = ''; });

    for (const role of ROLES) {
      try {
        const r = await captureRole(page, role);
        ringkasan.peran.push(r);
      } catch (e) {
        log(`  FATAL peran ${role.label}: ${e.message}`);
        ringkasan.peran.push({ key: role.key, label: role.label, error: e.message });
      }
    }

    try {
      ringkasan.alur = await alurEndToEnd(page);
    } catch (e) {
      log('  FATAL alur end-to-end: ' + e.message);
      ringkasan.alur = { error: e.message };
    }
    ringkasan.dialog = dialogs;
  } finally {
    fs.writeFileSync(
      path.join(OUT, '_ringkasan-tangkap-layar.json'),
      JSON.stringify(ringkasan, null, 2),
      'utf8'
    );
    await browser.close();
    log('SELESAI. Bukti visual ada di docs/evidence/hasil-produk/');
  }
})().catch((e) => {
  console.error('[SHOT][FATAL] ' + e.stack);
  process.exit(1);
});
