/**
 * Isi supervisor_id pada teknisi sesuai pembagian tim.
 *
 * PENTING: skrip ini mengubah data produksi. Secara bawaan hanya menampilkan
 * rencana (dry-run). Jalankan dengan --apply bila sudah yakin.
 *
 *   node scripts/setSupervisorIds.js            # dry-run, hanya tampil
 *   node scripts/setSupervisorIds.js --apply    # benar-benar menulis
 *
 * Pembagian tim di bawah memakai username supervisor, bukan id angka, supaya
 * aman dipakai ulang walau urutan id berubah.
 */

require('dotenv').config();

const pool = require('../src/config/database');

const MAPPING = [
  { supervisor: 'INN', teknisi: ['AAA', 'ANO', 'BDU', 'MOB', 'MRN', 'NDS'] },
  { supervisor: 'MUN', teknisi: ['RIA', 'ROS', 'SFH', 'KFF', 'ERA'] },
  { supervisor: 'KAA', teknisi: ['WAP', 'MCL'] },
];

const APPLY = process.argv.includes('--apply');

async function setSupervisorIds() {
  const { rows: supervisors } = await pool.query(
    `SELECT id, username, role FROM users WHERE username = ANY($1)`,
    [MAPPING.map((m) => m.supervisor)]
  );

  const found = new Map(supervisors.map((s) => [s.username, s]));
  const rencana = [];
  const masalah = [];

  for (const m of MAPPING) {
    const spv = found.get(m.supervisor);
    if (!spv) {
      masalah.push(`Supervisor "${m.supervisor}" tidak ada di tabel users.`);
      continue;
    }
    console.log(`\nSupervisor ${spv.username} (id ${spv.id}, role: ${spv.role})`);
    const { rows: teknisiRows } = await pool.query(
      'SELECT id, username, supervisor_id FROM users WHERE username = ANY($1)',
      [m.teknisi]
    );
    const peta = new Map(teknisiRows.map((t) => [t.username, t]));

    for (const username of m.teknisi) {
      const t = peta.get(username);
      if (!t) {
        masalah.push(`Teknisi "${username}" tidak ada di tabel users.`);
        continue;
      }
      if (t.supervisor_id === spv.id) {
        console.log(`  = ${t.username} sudah benar, tidak diubah`);
        continue;
      }
      const lama = t.supervisor_id;
      console.log(`  ${lama === null ? '+' : '~'} ${t.username}: supervisor_id ${lama ?? 'NULL'} -> ${spv.id}`);
      rencana.push({ id: t.id, username: t.username, dari: lama, ke: spv.id });
    }
  }

  console.log('\n--- RINGKASAN ---');
  console.log(`Total teknisi yang perlu diubah: ${rencana.length}`);
  if (!rencana.length) {
    console.log('Data sudah sesuai, tidak ada yang perlu ditulis.');
  }

  if (masalah.length) {
    console.log('\nPerlu diperiksa manual:');
    masalah.forEach((p) => console.log('  ! ' + p));
  }

  if (!APPLY) {
    console.log('\nMode dry-run. Tidak ada data yang diubah.');
    console.log('Jalankan ulang dengan --apply untuk menulis ke database.');
    await pool.end();
    return;
  }

  if (!rencana.length) {
    await pool.end();
    return;
  }

  console.log('\nMenulis ke database...');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of rencana) {
      await client.query('UPDATE users SET supervisor_id = $1 WHERE id = $2', [r.ke, r.id]);
    }
    await client.query('COMMIT');
    console.log(`Selesai: ${rencana.length} teknisi diperbarui.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Gagal, semua perubahan dibatalkan:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

setSupervisorIds().catch((e) => {
  console.error(e);
  process.exit(1);
});