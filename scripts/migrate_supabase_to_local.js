/**
 * Migrasi data dari Supabase (PostgreSQL) → MySQL lokal (XAMPP e_sparepart_local).
 *
 * Proses:
 *  1. Backup data lokal (spareparts, pengajuan_bq, pengajuan_log, users) ke file JSON angka penuh.
 *  2. Hapus data lokal pada 3 tabel (spareparts, pengajuan_bq, pengajuan_log) — users dibiarkan.
 *  3. Salin seluruh data dari Supabase: spareparts → pengajuan_bq → pengajuan_log.
 *  4. Verifikasi counts & cross-check sample.
 *
 * Dipakai : aplikasi "Micropage E-Sparepart - app - LCL" dan "LCL - 2"
 *           (keduanya memakai database yang sama: e_sparepart_local)
 * Jalankan : node scripts/migrate_supabase_to_local.js   (dari folder ...-deployed)
 */
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = require('pg');
const mysql = require('mysql2/promise');

// Kredensial MySQL diambil dari .env aplikasi LCL (biar konsisten dengan konfigurasi app)
const LCL_ENV = 'C:\\0000-Universitas_Terbuka\\semester8\\capstoneproject\\App-list\\Micropage E-Sparepart - app - LCL\\.env';
const lcl = {};
for (const line of fs.readFileSync(LCL_ENV, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m) lcl[m[1]] = m[2];
}

const BACKUP_DIR = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'Temp', 'opencode')
  : path.join(require('os').tmpdir(), 'opencode');
fs.mkdirSync(BACKUP_DIR, { recursive: true });

const pg = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const my = mysql.createPool({
  host: lcl.DB_HOST || 'localhost',
  port: Number(lcl.DB_PORT) || 3306,
  user: lcl.DB_USER || 'root',
  password: lcl.DB_PASSWORD || '',
  database: lcl.DB_NAME || 'e_sparepart_local',
  waitForConnections: true,
  connectionLimit: 8,
  queueLimit: 0,
});

const dump = (name, rows) => {
  const f = path.join(BACKUP_DIR, `backup_esplocal_${name}_${Date.now()}.json`);
  fs.writeFileSync(f, JSON.stringify(rows, null, 1), 'utf8');
  return f;
};

const tsMy = (v) => {
  if (v === null || v === undefined) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const chk = (v, dflt) => (v === null || v === undefined ? dflt : v);

async function main() {
  console.log('== MIGRASI Supabase → MySQL lokal (e_sparepart_local) ==\n');

  console.log('[1/6] Backup data lokal...');
  const myConn = await my.getConnection();
  const b_sp = (await myConn.query('SELECT * FROM spareparts'))[0];
  const b_pd = (await myConn.query('SELECT * FROM pengajuan_bq'))[0];
  const b_lg = (await myConn.query('SELECT * FROM pengajuan_log'))[0];
  const b_us = (await myConn.query('SELECT * FROM users'))[0];
  dump('users', b_us);
  dump('spareparts', b_sp);
  dump('pengajuan_bq', b_pd);
  dump('pengajuan_log', b_lg);
  console.log(`  Backup OK: spareparts=${b_sp.length}, pengajuan_bq=${b_pd.length}, pengajuan_log=${b_lg.length}, users=${b_us.length}`);

  console.log('\n[2/6] Hapus data lama (3 tabel data, users dibiarkan)...');
  await myConn.query('DELETE FROM pengajuan_log');
  await myConn.query('DELETE FROM pengajuan_bq');
  await myConn.query('DELETE FROM spareparts');

  console.log('\n[3/6] Ambil data dari Supabase...');
  const spRows = (await pg.query('SELECT * FROM spareparts ORDER BY item_code')).rows;
  const pdRows = (await pg.query('SELECT * FROM pengajuan_bq ORDER BY no_registrasi')).rows;
  const lgRows = (await pg.query(
    'SELECT id, no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value, created_at FROM pengajuan_log ORDER BY id'
  )).rows;
  console.log(`  Supabase: spareparts=${spRows.length}, pengajuan_bq=${pdRows.length}, pengajuan_log=${lgRows.length}`);

  console.log('\n[4/6] Salin spareparts...');
  {
    const SQL = `INSERT INTO spareparts (item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak)
                 VALUES (?,?,?,?,?,?,?)
                 ON DUPLICATE KEY UPDATE
                   deskripsi=VALUES(deskripsi), qty_on_hand=VALUES(qty_on_hand),
                   min_stock=VALUES(min_stock), max_stock=VALUES(max_stock),
                   is_critical=VALUES(is_critical), lokasi_rak=VALUES(lokasi_rak)`;
    let ok = 0, err = 0;
    for (const r of spRows) {
      try {
        await myConn.query(SQL, [
          r.item_code, chk(r.deskripsi, '-'),
          numOr0(r.qty_on_hand), numOr0(r.min_stock), numOr0(r.max_stock),
          r.is_critical === true ? 1 : 0,
          r.lokasi_rak,
        ]);
        ok++;
      } catch (e) { err++; if (err <= 5) console.warn(`  [WARN] ${r.item_code}: ${e.message}`); }
    }
    console.log(`  spareparts: ${ok} ok, ${err} error`);
  }

  console.log('\n[5/6] Salin pengajuan_bq & pengajuan_log...');
  {
    const SQL = `INSERT INTO pengajuan_bq (
        no_registrasi, user_id, item_code, jenis_pengajuan, qty_diminta, uom,
        spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran,
        urgency, status_approval_spv, status_approval_manager, status_pengadaan, timestamp
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE
        user_id=VALUES(user_id), item_code=VALUES(item_code), jenis_pengajuan=VALUES(jenis_pengajuan),
        qty_diminta=VALUES(qty_diminta), uom=VALUES(uom), spesifikasi_lengkap=VALUES(spesifikasi_lengkap),
        purpose=VALUES(purpose), no_ejo=VALUES(no_ejo), mesin_area=VALUES(mesin_area),
        merk=VALUES(merk), referensi_penawaran=VALUES(referensi_penawaran),
        urgency=VALUES(urgency), status_approval_spv=VALUES(status_approval_spv),
        status_approval_manager=VALUES(status_approval_manager),
        status_pengadaan=VALUES(status_pengadaan), timestamp=VALUES(timestamp)`;
    let ok = 0, err = 0;
    for (const r of pdRows) {
      try {
        await myConn.query(SQL, [
          r.no_registrasi, r.user_id, r.item_code, r.jenis_pengajuan,
          numOr1(r.qty_diminta), r.uom, chk(r.spesifikasi_lengkap, '-'),
          r.purpose, r.no_ejo, r.mesin_area, r.merk, r.referensi_penawaran,
          chk(r.urgency, 'Normal'), chk(r.status_approval_spv, 'Menunggu'),
          chk(r.status_approval_manager, 'Menunggu'), chk(r.status_pengadaan, 'BQ Baru'),
          tsMy(r.timestamp),
        ]);
        ok++;
      } catch (e) { err++; if (err <= 5) console.warn(`  [WARN] ${r.no_registrasi}: ${e.message}`); }
    }
    console.log(`  pengajuan_bq: ${ok} ok, ${err} error`);

    const SQLL = `INSERT INTO pengajuan_log (id, no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value, created_at)
                  VALUES (?,?,?,?,?,?,?,?,?)`;
    let okL = 0, errL = 0;
    for (const r of lgRows) {
      try {
        await myConn.query(SQLL, [
          r.id, chk(r.no_registrasi, ''), r.actor_id, r.actor_name, r.actor_role,
          chk(r.field, '-'), r.old_value, r.new_value, tsMy(r.created_at),
        ]);
        okL++;
      } catch (e) { errL++; if (errL <= 5) console.warn(`  [WARN] log ${r.id}: ${e.message}`); }
    }
    console.log(`  pengajuan_log: ${okL} ok, ${errL} error`);
  }

  console.log('\n[6/6] Verifikasi...');
  {
    const c1 = (await myConn.query('SELECT COUNT(*) AS c FROM spareparts'))[0][0].c;
    const c2 = (await myConn.query('SELECT COUNT(*) AS c FROM pengajuan_bq'))[0][0].c;
    const c3 = (await myConn.query('SELECT COUNT(*) AS c FROM pengajuan_log'))[0][0].c;
    const c4 = (await myConn.query('SELECT COUNT(*) AS c FROM users'))[0][0].c;
    const crit = (await myConn.query('SELECT COUNT(*) AS c FROM spareparts WHERE is_critical=1'))[0][0].c;
    const jb = (await myConn.query('SELECT jenis_pengajuan, COUNT(*) AS c FROM pengajuan_bq GROUP BY jenis_pengajuan'))[0];
    const sv = (await myConn.query('SELECT status_approval_spv, COUNT(*) AS c FROM pengajuan_bq GROUP BY status_approval_spv ORDER BY status_approval_spv'))[0];
    console.log('  spareparts       :', c1, '(critical:', crit + ')');
    console.log('  pengajuan_bq     :', c2, '(jenis:', JSON.stringify(jb) + ')');
    console.log('  pengajuan_log    :', c3);
    console.log('  users (tetap)    :', c4);
    console.log('  spv:', JSON.stringify(sv));
    const exp = { sp: spRows.length, bq: pdRows.length, lg: lgRows.length };
    const act = { sp: c1, bq: c2, lg: c3 };
    const match = exp.sp === act.sp && exp.bq === act.bq && exp.lg === act.lg;
    console.log('\n  ' + (match ? 'OK — jumlah identik dengan Supabase.' : 'PERHATIAN — jumlah tidak identik.') + ` (Supabase: ${JSON.stringify(exp)} vs lokal: ${JSON.stringify(act)})`);
  }

  myConn.release();
  await my.end();
  await pg.end();
  console.log('\nSelesai. Backup tersimpan di: ' + BACKUP_DIR);
  process.exit(0);
}

function numOr0(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function numOr1(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

main().catch((e) => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});