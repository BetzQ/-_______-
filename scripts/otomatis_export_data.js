/* ============================================================
   scripts/otomatis_export_data.js
   Tujuan (M5 - "Sediakan foto/data hasil produk website"):
   Menarik seluruh data hasil produk langsung dari API aplikasi yang
   berjalan (http://localhost:3000) lalu menyusunnya menjadi:
     - docs/evidence/data/hasil-produk-stats.json
     - docs/evidence/data/ringkasan-bab-iv.md  (siap tempel ke Bab IV)
     - docs/evidence/data/*.csv                (lampiran mentah)
   Dijalankan tanpa interaksi: node scripts/otomatis_export_data.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'evidence', 'data');

const AKUN = [
  { username: 'AAA', password: '04AAA10', role: 'Teknisi' },
  { username: 'INN', password: '30INN11', role: 'Supervisor 1' },
  { username: 'KAA', password: 'KAA1910', role: 'Supervisor 2' },
  { username: 'ANS', password: 'ANS1805', role: 'Officer Penagihan' },
  { username: 'KSW', password: '01KSW10', role: 'Manager' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.log('[DATA] ' + m);

async function getJSON(url, token) {
  const headers = token ? { Authorization: 'Bearer ' + token } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

async function postJSON(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: Object.assign(
      { 'Content-Type': 'application/json' },
      token ? { Authorization: 'Bearer ' + token } : {}
    ),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} -> ${res.status}`);
  return res.json();
}

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

/** Ambil status pengajuan dari field apa pun yang namanya mirip status. */
function statusOf(p) {
  return (
    p.status_pengajuan ||
    p.status ||
    p.status_terkini ||
    p.status_akhir ||
    p.current_status ||
    '(tanpa status)'
  );
}
function roleOf(p) {
  return (
    p.pengaju_role ||
    p.role_pengaju ||
    p.nama_role ||
    p.role ||
    (p.user && (p.user.role || p.user_role)) ||
    (p.teknisi && (p.teknisi.role || p.teknisi_role)) ||
    '-'
  );
}
function countBy(arr, fn) {
  return arr.reduce((acc, item) => {
    const k = String(fn(item) || '-');
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}
function monthOf(v) {
  if (!v) return '-';
  const s = String(v);
  if (/^\d{4}-\d{2}/.test(s)) return s.slice(0, 7);
  if (/^\d{4}\/\d{2}/.test(s)) return s.slice(0, 7).replace('/', '-');
  const m = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(s);
  if (m) return `${m[3]}-${m[2]}`;
  return s.slice(0, 7);
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  log('Target API : ' + BASE);

  // ---------- 1. Data master sparepart ----------
  const spareparts = toArray(await getJSON(`${BASE}/api/spareparts`));
  let summary = {};
  let alerts = [];
  try {
    summary = await getJSON(`${BASE}/api/spareparts/summary`);
  } catch (e) {
    log('WARN: /api/spareparts/summary gagal: ' + e.message);
  }
  try {
    alerts = toArray(await getJSON(`${BASE}/api/spareparts/alert`));
  } catch (e) {
    log('WARN: /api/spareparts/alert gagal: ' + e.message);
  }
  log(`Master sparepart : ${spareparts.length} item`);
  log(`Alert stok menipis: ${alerts.length} item`);

  const sp = spareparts.map((s) => ({
    item_code: s.item_code,
    deskripsi: s.deskripsi,
    qty_on_hand: Number(s.qty_on_hand || 0),
    min_stock: Number(s.min_stock || 0),
    max_stock: Number(s.max_stock || 0),
    is_critical: !!(s.is_critical === true || s.is_critical === 1 || s.is_critical === '1'),
    lokasi_rak: s.lokasi_rak || '-',
  }));

  const totalSp = sp.length;
  const critical = sp.filter((s) => s.is_critical);
  const belowMin = sp.filter((s) => s.qty_on_hand < s.min_stock);
  const zeroStock = sp.filter((s) => s.qty_on_hand === 0);
  const totalNilaiUnit = sp.reduce((a, s) => a + s.qty_on_hand, 0);

  // ---------- 2. Data transaksi pengajuan ----------
  const pengajuan = toArray(await getJSON(`${BASE}/api/pengajuan/all`));
  const bqSummary = toArray(await getJSON(`${BASE}/api/pengajuan/bq-summary`));
  log(`Pengajuan (all)   : ${pengajuan.length} baris`);
  log(`BQ Summary        : ${bqSummary.length} baris`);

  let monthly = null;
  try {
    monthly = await getJSON(`${BASE}/api/reports/monthly`);
  } catch (e) {
    log('WARN: /api/reports/monthly gagal: ' + e.message);
  }

  const statusSpv = countBy(pengajuan, (p) => p.status_approval_spv || '-');
  const statusMgr = countBy(pengajuan, (p) => p.status_approval_manager || '-');
  const statusPengadaan = countBy(pengajuan, (p) => p.status_pengadaan || '-');
  const urgencyAll = countBy(pengajuan, (p) => p.urgency || '-');
  const roleAll = countBy(pengajuan, (p) => p.role_pengaju || '-');
  const statusAll = statusPengadaan;

  const dateFields = ['timestamp', 'created_at', 'tanggal', 'tgl_pengajuan', 'createdAt'];
  const pickDate = (p) => {
    for (const f of dateFields) if (p[f]) return p[f];
    return null;
  };
  const perBulan = countBy(pengajuan.filter((p) => pickDate(p)), (p) => monthOf(pickDate(p)));

  const N = pengajuan.length;
  const hitung = (obj, kunci) => obj[kunci] || 0;
  const statDisetujui = hitung(statusSpv, 'Disetujui') + hitung(statusMgr, 'Disetujui');
  const statMenunggu = hitung(statusSpv, 'Menunggu') + hitung(statusMgr, 'Menunggu');
  const statDitolak = hitung(statusSpv, 'Ditolak') + hitung(statusMgr, 'Ditolak');

  // ---------- 3. Login tiap role untuk bukti RBAC + PR Summary ----------
  const loginBukti = [];
  for (const ak of AKUN) {
    try {
      const r = await postJSON(`${BASE}/api/login`, ak);
      const ok = r.status === 'ok' && r.data && r.data.role;
      const roleDariServer = r.data && r.data.role ? r.data.role : '-';
      let prStatus = 'n/a';
      if (ok) {
        try {
          const pr = await getJSON(`${BASE}/api/pengajuan/summary?username=${encodeURIComponent(ak.username)}`);
          prStatus = Array.isArray(pr)
            ? pr.length + ' baris menunggu'
            : pr && typeof pr === 'object' && pr.status
              ? pr.status
              : 'ok';
        } catch (e) {
          // 403 = bukti RBAC bekerja: hanya Manager & Supervisor 1 yang boleh
          prStatus = e.message.includes('403') ? 'ditolak (403) - sesuai RBAC' : 'error: ' + e.message;
        }
      }
      loginBukti.push({
        username: ak.username,
        role: ak.role,
        role_dari_server: roleDariServer,
        login_berhasil: ok,
        akses_pr_summary: prStatus,
      });
      log(`  Login ${ak.role.padEnd(18)} (${ak.username}) -> ${ok ? 'OK (' + roleDariServer + ')' : 'GAGAL'} | PR Summary: ${prStatus}`);
    } catch (e) {
      loginBukti.push({ username: ak.username, role: ak.role, login_berhasil: false, error: e.message });
      log(`  Login ${ak.role.padEnd(18)} (${ak.username}) -> GAGAL (${e.message})`);
    }
    await sleep(120);
  }

  // ---------- 4. Susun statistik ----------
  const hasil = {
    generated_at: new Date().toISOString(),
    sumber: {
      aplikasi: 'Micropage E-Sparepart (Kelompok A 127 - Capstone UT)',
      api_base: BASE,
      endpoint: [
        '/api/spareparts', '/api/spareparts/summary', '/api/spareparts/alert',
        '/api/pengajuan/all', '/api/pengajuan/bq-summary', '/api/reports/monthly',
        '/api/login', '/api/pengajuan/summary',
      ],
    },
    master_sparepart: {
      total_item: totalSp,
      total_unit_on_hand: totalNilaiUnit,
      item_critical: critical.length,
      persen_critical: totalSp ? +((critical.length / totalSp) * 100).toFixed(2) : 0,
      item_di_bawah_min_stock: belowMin.length,
      item_stok_kosong: zeroStock.length,
      ringkasan_dari_api: summary,
    },
    transaksi_pengajuan: {
      total_baris: pengajuan.length,
      komposisi_status_pengadaan: statusPengadaan,
      komposisi_approval_spv: statusSpv,
      komposisi_approval_manager: statusMgr,
      komposisi_urgensi: urgencyAll,
      pengaju_per_role: roleAll,
      jumlah_per_bulan: perBulan,
      agregat: {
        keputusan_disetujui: statDisetujui,
        keputusan_menunggu: statMenunggu,
        keputusan_ditolak: statDitolak,
      },
    },
    bq_summary: { total_baris: bqSummary.length },
    monthly_report: monthly,
    uji_peran_login: loginBukti,
  };

  fs.writeFileSync(
    path.join(OUT_DIR, 'hasil-produk-stats.json'),
    JSON.stringify(hasil, null, 2),
    'utf8'
  );
  log('Tersimpan: hasil-produk-stats.json');

  // ---------- 5. CSV lampiran ----------
  const csv = (rows, header) => {
    const esc = (v) => '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"';
    return [header.map(esc).join(',')].concat(rows.map((r) => header.map((h) => esc(r[h])).join(','))).join('\n');
  };

  const headerSp = ['item_code', 'deskripsi', 'qty_on_hand', 'min_stock', 'max_stock', 'is_critical', 'lokasi_rak'];
  fs.writeFileSync(
    path.join(OUT_DIR, 'master-sparepart.csv'),
    csv(sp.map((s) => ({ ...s, is_critical: s.is_critical ? 'Ya' : 'Tidak' })), headerSp),
    'utf8'
  );

  const headerSt = ['status', 'jumlah', 'persen'];
  const rowsSt = Object.entries(statusAll)
    .sort((a, b) => b[1] - a[1])
    .map(([status, jumlah_]) => ({
      status,
      jumlah: jumlah_,
      persen: pengajuan.length ? ((jumlah_ / pengajuan.length) * 100).toFixed(2) : '0',
    }));
  fs.writeFileSync(path.join(OUT_DIR, 'komposisi-status-pengajuan.csv'), csv(rowsSt, headerSt), 'utf8');

  const headerAlert = ['item_code', 'deskripsi', 'qty_on_hand', 'min_stock', 'selisih', 'lokasi_rak'];
  const alertSrc = alerts.length ? alerts : belowMin.slice(0, 500);
  fs.writeFileSync(
    path.join(OUT_DIR, 'stok-di-bawah-minimum.csv'),
    csv(
      alertSrc.map((s) => ({
        item_code: s.item_code,
        deskripsi: s.deskripsi,
        qty_on_hand: s.qty_on_hand,
        min_stock: s.min_stock,
        selisih: Number(s.min_stock || 0) - Number(s.qty_on_hand || 0),
        lokasi_rak: s.lokasi_rak || '-',
      })),
      headerAlert
    ),
    'utf8'
  );
  log('Tersimpan: master-sparepart.csv, komposisi-status-pengajuan.csv, stok-di-bawah-minimum.csv');

  // ---------- 6. Ringkasan siap pakai untuk Bab IV ----------
  const topMenipis = alertSrc
    .slice()
    .sort((a, b) => (Number(b.min_stock || 0) - Number(b.qty_on_hand || 0)) - (Number(a.min_stock || 0) - Number(a.qty_on_hand || 0)))
    .slice(0, 10);

  const md = [];
  md.push('# Data Hasil Produk — Micropage E-Sparepart');
  md.push('');
  md.push('> Sumber: hasil ekspor langsung dari aplikasi yang berjalan (`' + BASE + '`)');
  md.push('> Dihasilkan otomatis: `' + new Date().toLocaleString('id-ID') + '`');
  md.push('> Dipakai untuk: **Bab IV (Hasil dan Analisis Dampak)** — diminta Fadhil kepada Lead Developer.');
  md.push('');
  md.push('## A. Cakupan Data Master yang Berhasil Diintegrasikan');
  md.push('');
  md.push('| Indikator | Nilai | Keterangan |');
  md.push('|---|---:|---|');
  md.push(`| Jumlah item sparepart terdaftar | ${totalSp.toLocaleString('id-ID')} | Database #1 — master sparepart & On Hand Stock |`);
  md.push(`| Total unit tersedia di gudang (on-hand) | ${totalNilaiUnit.toLocaleString('id-ID')} | Akumulasi qty_on_hand seluruh item |`);
  md.push(`| Item kategori Critical Part | ${critical.length.toLocaleString('id-ID')} (${hasil.master_sparepart.persen_critical}%) | Database #2 — Critical Sparepart List |`);
  md.push(`| Item di bawah min-stock (butuh reorder) | ${belowMin.length.toLocaleString('id-ID')} | Pemicu preventif tanpa menunggu breakdown |`);
  md.push(`| Item dengan stok kosong | ${zeroStock.length.toLocaleString('id-ID')} | Visibilitas ketersediaan secara real-time |`);
  md.push('');
  md.push('## B. Kinerja Digitalisasi Alur Pengajuan (Form BQ → Approval)');
  md.push('');
  md.push('### B.1 Status Persetujuan Supervisor (tahap 1)');
  md.push('');
  md.push('| Approval SPV | Jumlah | Persentase |');
  md.push('|---|---:|---:|');
  Object.entries(statusSpv).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
    md.push(`| ${k} | ${n.toLocaleString('id-ID')} | ${((n / N) * 100).toFixed(2)}% |`));
  md.push('');
  md.push('### B.2 Status Persetujuan Manager (tahap 2, khusus Urgent)');
  md.push('');
  md.push('| Approval Manager | Jumlah | Persentase |');
  md.push('|---|---:|---:|');
  Object.entries(statusMgr).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
    md.push(`| ${k} | ${n.toLocaleString('id-ID')} | ${((n / N) * 100).toFixed(2)}% |`));
  md.push('');
  md.push('### B.3 Status Pengadaan (alur hingga barang diterima)');
  md.push('');
  md.push('| Status pengadaan | Jumlah | Persentase |');
  md.push('|---|---:|---:|');
  Object.entries(statusPengadaan).sort((a, b) => b[1] - a[1]).forEach(([k, n]) =>
    md.push(`| ${k} | ${n.toLocaleString('id-ID')} | ${((n / N) * 100).toFixed(2)}% |`));
  md.push(`| **Total** | **${N.toLocaleString('id-ID')}** | **100%** |`);
  md.push('');
  md.push('### B.4 Kategori Urgensi');
  md.push('');
  md.push('| Urgensi | Jumlah |');
  md.push('|---|---:|');
  Object.entries(urgencyAll).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => md.push(`| ${k} | ${n.toLocaleString('id-ID')} |`));
  md.push('');
  md.push('Agregat alur persetujuan berjenjang (SPV + Manager):');
  md.push('');
  md.push('- Keputusan **disetujui**: ' + statDisetujui.toLocaleString('id-ID'));
  md.push('- Keputusan **menunggu**: ' + statMenunggu.toLocaleString('id-ID'));
  md.push('- Keputusan **ditolak**: ' + statDitolak.toLocaleString('id-ID'));
  md.push('- Baris BQ Summary terproses: ' + bqSummary.length.toLocaleString('id-ID'));
  md.push('');
  if (Object.keys(perBulan).length) {
    md.push('## C. Distribusi Pengajuan per Bulan');
    md.push('');
    md.push('| Bulan | Jumlah pengajuan |');
    md.push('|---|---:|');
    Object.entries(perBulan)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([b, n]) => md.push(`| ${b} | ${n.toLocaleString('id-ID')} |`));
    md.push('');
  }
  if (Object.keys(roleAll).length) {
    md.push('## D. Partisipasi Pengaju per Peran');
    md.push('');
    md.push('| Peran pengaju | Jumlah pengajuan |');
    md.push('|---|---:|');
    Object.entries(roleAll)
      .sort((a, b) => b[1] - a[1])
      .forEach(([r, n]) => md.push(`| ${r} | ${n.toLocaleString('id-ID')} |`));
    md.push('');
  }
  md.push('## E. Contoh Item yang Terpantau di Bawah Minimum (Preventive Replenishment)');
  md.push('');
  md.push('| Item Code | Deskripsi | On Hand | Min | Kekurangan | Rak |');
  md.push('|---|---|---:|---:|---:|---|');
  topMenipis.forEach((s) =>
    md.push(
      `| ${s.item_code} | ${String(s.deskripsi || '').slice(0, 70)} | ${s.qty_on_hand} | ${s.min_stock} | ${
        Number(s.min_stock || 0) - Number(s.qty_on_hand || 0)
      } | ${s.lokasi_rak || '-'} |`
    )
  );
  md.push('');
  md.push('## F. Uji Akses per Peran (RBAC)');
  md.push('');
  md.push('| Username | Peran | Role dari server | Login | Akses PR Summary |');
  md.push('|---|---|---|---|---|');
  loginBukti.forEach((l) =>
    md.push(
      `| ${l.username} | ${l.role} | ${l.role_dari_server || '-'} | ${l.login_berhasil ? 'Berhasil' : 'Gagal'} | ${
        l.akses_pr_summary || '-'
      } |`
    )
  );
  md.push('');
  md.push('## G. Berkas Lampiran Pendukung');
  md.push('');
  md.push('- `hasil-produk-stats.json` — seluruh statistik mentah (machine-readable)');
  md.push('- `master-sparepart.csv` — seluruh item sparepart beserta stok & status kritis');
  md.push('- `komposisi-status-pengajuan.csv` — komposisi status untuk grafik Bab IV');
  md.push('- `stok-di-bawah-minimum.csv` — daftar item yang menyentuh batas minimum');
  md.push('- `../hasil-produk/*.png` — bukti visual setiap menu per peran (lihat `M5-HASIL-PRODUK.md`)');
  md.push('- `../video/` — rekaman demo alur end-to-end');
  md.push('');

  fs.writeFileSync(path.join(OUT_DIR, 'ringkasan-bab-iv.md'), md.join('\n'), 'utf8');
  log('Tersimpan: ringkasan-bab-iv.md');
  log('SELESAI. Semua berkas ada di docs/evidence/data/');
})().catch((e) => {
  console.error('[DATA][FATAL] ' + e.stack);
  process.exit(1);
});
