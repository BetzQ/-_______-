/**
 * ============================================================================
 *  MIGRASI ROLE:  Officer  ->  Administrator
 *  Micropage E-Sparepart — PT Fonko International Pharmaceuticals
 * ----------------------------------------------------------------------------
 *  MENGAPA INI PENTING
 *    Kode aplikasi sekarang hanya mengenali role `administrator` (lihat
 *    classifyRole() di src/controllers/bqController.js). Selama tabel `users`
 *    masih berisi role `Officer`, akun tersebut akan terbaca sebagai
 *    "role tak dikenal" dan:
 *      - dropdown Status Pengadaan TIDAK MUNCUL
 *      - menu "Approval BQ Tahap Supervisor" TIDAK MUNCUL untuk Administrator
 *      - Live Demo akan gagal di tengah jalan
 *
 *  CARA PAKAI (aman - default hanya MENAMPILKAN, tidak mengubah apa pun)
 *    1) Lihat dulu apa yang akan terjadi:
 *         node scripts/update_role_officer_to_administrator.js
 *    2) Kalau yakin, jalankan perubahan:
 *         node scripts/update_role_officer_to_administrator.js --apply
 *
 *  Script ini HANYA mengubah kolom `role` pada tabel `users`.
 *  Tidak menghapus, tidak menambah baris, tidak menyentuh data lain.
 * ============================================================================
 */

'use strict';

//dotenv opsional: kalau belum terpasang, .env tetap terbaca oleh pool pg
try { require('dotenv').config(); } catch (e) { /* abaikan */ }

const APPLY = process.argv.includes('--apply');

const PETA = [
  { dari: 'Officer', ke: 'Administrator' },
];

async function main() {
  console.log('\n' + '='.repeat(70));
  console.log('  MIGRASI ROLE: Officer -> Administrator');
  console.log('='.repeat(70));

  if (!process.env.DATABASE_URL) {
    console.error('\n  [ERROR] DATABASE_URL tidak ditemukan.');
    console.error('  Pastikan file .env ada di folder ini dan berisi DATABASE_URL.');
    console.error('  Kalau .env sudah dibersihkan (mis. folder untuk dosen),');
    console.error('  isi manual:  $env:DATABASE_URL = "postgresql://..."\n');
    process.exit(1);
  }

  // Sengaja pakai pg langsung supaya tidak butuh modul lain.
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // --- 1) Lihat kondisi sekarang ---
    console.log('\n  Kondisi SEKARANG di tabel users:');
    const { rows: sekarang } = await pool.query(
      `SELECT role, COUNT(*)::int AS jumlah FROM users GROUP BY role ORDER BY role`
    );
    if (!sekarang.length) {
      console.log('    (tabel users kosong)');
    } else {
      const lebar = Math.max(...sekarang.map((r) => String(r.role).length));
      sekarang.forEach((r) => {
        const tanda = PETA.some((p) => p.dari === r.role) ? '  <-- perlu diubah' : '';
        console.log(`    ${String(r.role).padEnd(lebar)} : ${r.jumlah} akun${tanda}`);
      });
    }

    // --- 2) Rincian akun yang terdampak ---
    const { rows: sasaran } = await pool.query(
      `SELECT id, username, role, name FROM users WHERE role = ANY($1) ORDER BY username`,
      [PETA.map((p) => p.dari)]
    );

    console.log(`\n  Akun yang akan diubah: ${sasaran.length}`);
    sasaran.forEach((r) => {
      const ke = PETA.find((p) => p.dari === r.role).ke;
      console.log(`    ${String(r.username).padEnd(10)} "${r.name}"  ${r.role} -> ${ke}`);
    });

    if (!sasaran.length) {
      console.log('\n  [OK] Tidak ada role "Officer" tersisa. Tidak ada yang perlu diubah.');
      console.log('  Aplikasi siap dipakai untuk Live Demo.\n');
      return 0;
    }

    // --- 3) Ubah atau tidak ---
    if (!APPLY) {
      console.log('\n  [MODE PERIKSA] Belum ada perubahan yang dilakukan.');
      console.log('  Jalankan ulang dengan --apply untuk benar-benar mengubah:');
      console.log('      node scripts/update_role_officer_to_administrator.js --apply');
      return 0;
    }

    console.log('\n  [MODE UBAH] Menjalankan UPDATE ...');
    for (const p of PETA) {
      const res = await pool.query(
        `UPDATE users SET role = $1 WHERE role = $2`,
        [p.ke, p.dari]
      );
      console.log(`    ${p.dari} -> ${p.ke} : ${res.rowCount} baris diperbarui`);
    }

    // --- 4) Verifikasi ---
    console.log('\n  Verifikasi - kondisi SESUDAH:');
    const { rows: sesudah } = await pool.query(
      `SELECT role, COUNT(*)::int AS jumlah FROM users GROUP BY role ORDER BY role`
    );
    const lebar2 = Math.max(...sesudah.map((r) => String(r.role).length));
    sesudah.forEach((r) => console.log(`    ${String(r.role).padEnd(lebar2)} : ${r.jumlah} akun`));

    const { rows: sisa } = await pool.query(`SELECT COUNT(*)::int AS n FROM users WHERE role = 'Officer'`);
    const { rows: cekAns } = await pool.query(
      `SELECT username, role FROM users WHERE username = 'ANS'`
    );

    if (sisa[0].n === 0) {
      console.log('\n  [OK] Migrasi selesai. Tidak ada role "Officer" tersisa.');
    } else {
      console.log(`\n  [PERINGATAN] Masih ada ${sisa[0].n} akun ber-role Officer.`);
    }
    if (cekAns[0]) {
      console.log(`  Akun ANS sekarang berperan: ${cekAns[0].role}`);
    }

    console.log('\n  Aplikasi siap dipakai untuk Live Demo.\n');
    return 0;
  } catch (err) {
    console.error('\n  [ERROR]', err.message);
    console.error('  Cek koneksi database dan isi .env Anda.\n');
    return 1;
  } finally {
    await pool.end().catch(() => {});
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('\n  [FATAL]', err);
    process.exit(1);
  });