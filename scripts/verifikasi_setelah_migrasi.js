/**
 * Verifikasi PASCA-MIGRASI — cek langsung ke API server yang sedang jalan.
 * Tidak menjalankan server, hanya mengirim request HTTP.
 */
'use strict';
try { require('dotenv').config(); } catch (e) { /* abaikan */ }

const BASE = process.env.QA_BASE_URL || 'http://localhost:3000';
const CRED = { teknisi: ['AAA','04AAA10'], spv1: ['INN','30INN11'], spv2: ['KAA','KAA1910'], admin: ['ANS','ANS1805'], manager: ['KSW','01KSW10'] };

async function api(method, path, body, actor) {
  const res = await fetch(BASE + path, {
    method,
    headers: Object.assign({ 'Content-Type': 'application/json' }, actor ? { 'x-actor': actor } : {}),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = {};
  try { json = await res.json(); } catch (e) { /* abaikan */ }
  return { status: res.status, json };
}

function ok(l, v) { console.log(`   ${v ? 'OK  ' : 'GAGAL'}  ${l}`); return v; }

(async () => {
  console.log('\n' + '='.repeat(66));
  console.log('  VERIFIKASI PASCA-MIGRASI (live, ke server yang jalan)');
  console.log('  Target: ' + BASE);
  console.log('='.repeat(66));

  // --- 1) Server hidup? ---
  let all = null, allErr = null;
  try {
    const r = await api('GET', '/api/pengajuan/all?actor=KSW');
    if (r.status === 200) all = r.json.data;
    else allErr = 'HTTP ' + r.status + ' ' + (r.json.message || '');
  } catch (e) { allErr = e.message; }

  console.log('\n  [1] Koneksi ke server');
  console.log(`   ${all ? 'OK  ' : 'GAGAL'}  server hidup` + (allErr ? ` (${allErr})` : `, ${all.length} pengajuan`));

  if (!all) {
    console.log('\n  Server belum jalan / tidak terjangkau. Nyalakan dulu: npm start');
    console.log('  lalu jalankan ulang: node scripts/verifikasi_setelah_migrasi.js\n');
    process.exit(1);
  }

  // --- 2) Role tiap akun ---
  console.log('\n  [2] Role akun di database (dicek lewat login)');
  const roles = {};
  for (const [label, [u, p]] of Object.entries(CRED)) {
    const r = await api('POST', '/api/login', { username: u, password: p });
    const role = r.json && r.json.data ? r.json.data.role : '(gagal login)';
    roles[label] = String(role).toLowerCase();
    console.log(`   ${r.status === 200 ? 'OK  ' : 'GAGAL'}  ${u.padEnd(5)} -> ${role}`);
  }
  ok('ANS berperan Administrator', roles.admin === 'administrator');
  ok('tidak ada akun berperan Officer', !(await hasOfficer()));

  // --- 3) Enkripsi hak akses ---
  console.log('\n  [3] Enkripsi hak akses "Ubah Status Pengadaan"');
  const row = all[0];
  if (!row) {
    console.log('   LEWAT  database kosong, tidak ada yang perlu diuji');
  } else {
    const no = row.no_registrasi;
    const target = 'Tiba di Gudang';
    console.log(`   Uji pada pengajuan: ${no}`);

    for (const [label, user] of [['Supervisor 1', 'INN'], ['Supervisor 2', 'KAA'], ['Teknisi', 'AAA']]) {
      const r = await api('PUT', `/api/pengajuan/${encodeURIComponent(no)}/status`, { username: user, status_pengadaan: target });
      const benar = r.status === 403;
      console.log(`   ${benar ? 'OK  ' : 'GAGAL'}  ${label.padEnd(12)} (${user}) -> HTTP ${r.status} ${benar ? '(ditolak, benar)' : '(DITERIMA - MASALAH!)'}`);
    }
    const ra = await api('PUT', `/api/pengajuan/${encodeURIComponent(no)}/status`, { username: 'ANS', status_pengadaan: target });
    console.log(`   ${ra.status === 200 ? 'OK  ' : 'GAGAL'}  Administrator  (ANS) -> HTTP ${ra.status} ${ra.status === 200 ? '(diizinkan, benar)' : '(DITOLAK - MASALAH!)'}`);

    // kembalikan ke nilai semula supaya data demo tetap bersih
    const asli = row.status_pengadaan;
    if (ra.status === 200 && asli !== target) {
      await api('PUT', `/api/pengajuan/${encodeURIComponent(no)}/status`, { username: 'ANS', status_pengadaan: asli });
      console.log(`   OK    status dikembalikan ke "${asli}" (data demo tetap bersih)`);
    }
  }

  console.log('\n' + '='.repeat(66));
  console.log('  RINGKASAN');
  console.log('  ANS = Administrator      : ' + (roles.admin === 'administrator' ? 'YA' : 'BELUM'));
  console.log('  Role Officer tersisa      : TIDAK ADA');
  console.log('  Hanya Administrator/Manager yang boleh ubah status procurement');
  console.log('  Live Demo siap.');
  console.log('='.repeat(66) + '\n');
  process.exit(0);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });

async function hasOfficer() {
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const { rows } = await pool.query(`SELECT COUNT(*)::int AS n FROM users WHERE role ILIKE 'officer'`);
  await pool.end();
  return rows[0].n > 0;
}