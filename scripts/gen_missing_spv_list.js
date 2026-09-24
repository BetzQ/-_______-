require('dotenv').config();
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const fold = path.join('CP Kelompok A 127', 'Bahan Capstone Project', 'Raw Data CP-20260924T053522Z-1-001_v2_baru', 'Raw Data CP');

(async () => {
  const wb = XLSX.readFile(path.join(fold, 'Database Approval SPV BQ Testing.xlsx'));
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['Gform Aproval SPV BQ Testing'], { defval: '' });
  const spvRegs = new Map();
  rows.forEach((r) => {
    const reg = String(r['Nomor Registrasi BQ'] || '').trim();
    const st = String(r['Status Approval'] || '').trim();
    const kat = String(r['Kategori'] || '').trim();
    if (reg) spvRegs.set(reg, { status: st, kategori: kat });
  });
  console.log('SPV unique regs:', spvRegs.size);

  const regs = [...spvRegs.keys()];
  const { rows: dbRows } = await pool.query('SELECT no_registrasi FROM pengajuan_bq WHERE no_registrasi = ANY($1)', [regs]);
  const dbSet = new Set(dbRows.map((r) => r.no_registrasi));
  const missing = regs.filter((r) => !dbSet.has(r)).sort();

  let out = [];
  out.push('# Daftar No. Registrasi di Database_Approval_SPV_BQ_Testing.xlsx yang TIDAK ada di tabel pengajuan_bq (Supabase)');
  out.push('# Total: ' + missing.length);
  out.push('# Format: no_registrasi | status_SPV_file | kategori_SPV_file');
  out.push('---');
  for (const reg of missing) {
    const d = spvRegs.get(reg);
    out.push(`${reg} | ${d.status} | ${d.kategori}`);
  }
  const outPath = path.join(__dirname, '..', 'Data_SPV_tidak_ada_di_DB_pengajuan.txt');
  fs.writeFileSync(outPath, out.join('\n'), 'utf8');
  console.log('Missing count:', missing.length);
  console.log('Ditulis ke:', outPath);
  console.log('Contoh 12 baris:');
  for (const reg of missing.slice(0, 12)) {
    const d = spvRegs.get(reg);
    console.log('  ', reg, '|', d.status, '|', d.kategori);
  }

  const approve = rows.filter((r) => String(r['Status Approval'] || '').trim() === 'Approve').length;
  const reject = rows.filter((r) => String(r['Status Approval'] || '').trim() === 'Reject').length;
  console.log('SPV file status: approve=' + approve + ' reject=' + reject);
  await pool.end();
})();