/**
 * scripts/syncApprovalManager.js
 * =====================================================================
 * Sinkronisasi hasil approval MANAGER (File: Database Approval MGR
 * BQ Testing.xlsx) ke tabel `pengajuan_bq` — kolom status_approval_manager.
 *
 * Sumber : CP Kelompok A 127/Bahan Capstone Project/Raw Data CP-...
 *          _v2_baru/Raw Data CP/Database Approval MGR BQ Testing.xlsx
 *          (sheet "Gform Aproval SPV BQ Testing" → kolom
 *           Nomor Registrasi BQ, Status Approval)
 *
 * Alur   : SPV Approve -> Manager Approve (tahap 2/final). Nilai asli
 *          spreadsheet "Approve"/"Reject" dipetakan ke "Disetujui"/"Ditolak".
 *
 * Target : Supabase (DATABASE_URL) + MySQL lokal (e_sparepart_local).
 * Sifat  : idempotent — hanya baris yang ada di file yang di-update,
 *          nilai lama "Menunggu" diganti sesuai keputusan file.
 *
 * Jalankan: node scripts/syncApprovalManager.js     (proses)
 *           node scripts/syncApprovalManager.js --dry (preview saja)
 * =====================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const XLSX = require('xlsx');
const { Pool } = require('pg');
const mysql = require('mysql2/promise');

const DRY = process.argv.includes('--dry');

// Folder raw data terbaru (update 24 Sep 2026).
const SRC_DIR = path.join(
  __dirname, '..', 'CP Kelompok A 127', 'Bahan Capstone Project',
  'Raw Data CP-20260924T053522Z-1-001_v2_baru', 'Raw Data CP'
);
const SRC = path.join(SRC_DIR, 'Database Approval MGR BQ Testing.xlsx');
const SHEET = 'Gform Aproval SPV BQ Testing';

const APPROVAL_MAP = { approve: 'Disetujui', reject: 'Ditolak', waiting: 'Menunggu' };

function mapStatus(raw) {
  const key = String(raw == null ? '' : raw).trim().toLowerCase();
  return APPROVAL_MAP[key];
}

// Konversi timestamp file (string dd/mm/yyyy hh:mm:ss ATAU serial Excel) -> Date.
function parseTs(v) {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();
  if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) {
    const d = new Date(s.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const n = Number(s);
  if (Number.isFinite(n) && n > 20000) {
    const parsed = XLSX.SSF.parse_date_code(n);
    if (!parsed) return null;
    return new Date(parsed.y, parsed.m - 1, parsed.d, parsed.H, parsed.M, Math.floor(parsed.S));
  }
  return null;
}

function nowMy(d) {
  if (!d) return new Date();
  return d;
}

async function readApprovals() {
  const wb = XLSX.readFile(SRC);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[SHEET], { defval: '' });
  const out = [];
  const counter = { approve: 0, reject: 0, unknown: 0, noReg: 0 };
  for (const r of rows) {
    const reg = String(r['Nomor Registrasi BQ'] || '').trim();
    const st = mapStatus(r['Status Approval']);
    if (!reg) { counter.noReg++; continue; }
    if (!st) { counter.unknown++; continue; }
    if (st === 'Disetujui') counter.approve++; else counter.reject++;
    out.push({
      no_registrasi: reg,
      status_approval_manager: st,
      timestamp: parseTs(r['Timestamp']),
      note: String(r['Note'] == null ? '' : r['Note']).trim(),
    });
  }
  return { rows: out, counter };
}

async function main() {
  const { rows, counter } = await readApprovals();
  console.log('== Sinkronisasi Approval Manager (Database Approval MGR BQ Testing.xlsx) ==');
  console.log('Sumber  :', SRC);
  console.log('Record  :', rows.length, `(Approve=${counter.approve}, Reject=${counter.reject}, tanpa-reg=${counter.noReg}, status-tak-terpetakan=${counter.unknown})`);

  if (DRY) {
    console.log('\n[DRY RUN] 3 contoh update:');
    rows.slice(0, 3).forEach((r) => console.log('  ', JSON.stringify(r)));
    return;
  }

  // ----- Koneksi ke Supabase & MySQL lokal -----
  const pg = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 5 });
  const my = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'e_sparepart_local',
    waitForConnections: true,
    connectionLimit: 5,
  });

  // Cari user manager (untuk audit trail pengajuan_log).
  const manager = (
    await pg.query(`SELECT id, username, name, role FROM users WHERE role = 'manager' ORDER BY id LIMIT 1`)
  ).rows[0] || { id: null, username: 'manager', name: 'Manager', role: 'manager' };

  const pgStat = { updated: 0, missing: 0, skipped: 0 };
  const myStat = { updated: 0, missing: 0, skipped: 0 };

  for (const r of rows) {
    // --- Supabase ---
    if (r.status_approval_manager === 'Disetujui' && r.no_registrasi === 'ROSBR0007') {
      // Anomali data asli: file MGR menyetujui meski SPV menolak.
      console.log(`  [ANOMALI] ${r.no_registrasi}: SPV=Ditolak namun MGR menyetujui — tetap diterapkan sesuai file.`);
    }
    const pgRes = await pg.query(
      `UPDATE pengajuan_bq SET status_approval_manager = $2
        WHERE no_registrasi = $1 AND status_approval_manager = 'Menunggu'`,
      [r.no_registrasi, r.status_approval_manager]
    );
    if (pgRes.rowCount > 0) {
      pgStat.updated++;
      try {
        await pg.query(
          `INSERT INTO pengajuan_log (no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value, created_at)
           VALUES ($1, $2, $3, $4, 'status_approval_manager', 'Menunggu', $5, $6)`,
          [r.no_registrasi, manager.id, manager.username, manager.role, r.status_approval_manager, nowMy(r.timestamp)]
        );
      } catch (logErr) {
        console.warn(`  [WARN] log ${r.no_registrasi}: ${logErr.message}`);
      }
    } else {
      const chk = await pg.query('SELECT 1 FROM pengajuan_bq WHERE no_registrasi = $1', [r.no_registrasi]);
      if (chk.rowCount === 0) pgStat.missing++; else pgStat.skipped++;
    }

    // --- MySQL lokal (e_sparepart_local) ---
    const myRes = await my.query(
      `UPDATE pengajuan_bq SET status_approval_manager = ?
        WHERE no_registrasi = ? AND status_approval_manager = 'Menunggu'`,
      [r.status_approval_manager, r.no_registrasi]
    );
    if (myRes[0].affectedRows > 0) {
      myStat.updated++;
      try {
        await my.query(
          `INSERT INTO pengajuan_log (no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value, created_at)
           VALUES (?, ?, ?, ?, 'status_approval_manager', 'Menunggu', ?, ?)`,
          [r.no_registrasi, manager.id, manager.username, manager.role, r.status_approval_manager, nowMy(r.timestamp)]
        );
      } catch (logErr) {
        console.warn(`  [WARN] log-lokal ${r.no_registrasi}: ${logErr.message}`);
      }
    } else {
      const chk = (
        await my.query('SELECT 1 FROM pengajuan_bq WHERE no_registrasi = ?', [r.no_registrasi])
      )[0];
      if (chk.length === 0) myStat.missing++; else myStat.skipped++;
    }
  }

  console.log('\nSupabase           :', JSON.stringify(pgStat));
  console.log('MySQL lokal        :', JSON.stringify(myStat));
  console.log('Aktor (manager)    :', manager.username);

  await pg.end();
  await my.end();
  console.log('\nSelesai.');
  process.exit(0);
}

main().catch((e) => {
  console.error('[Gagal]', e.message);
  process.exit(1);
});