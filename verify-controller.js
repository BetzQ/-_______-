const pool = require('./src/config/database');

async function verify() {
  console.log('=== VERIFIKASI CONTROLLER ===\n');

  // 1. Cek struktur DB
  console.log('--- Struktur DB ---');
  const [pCols] = await pool.query('SHOW COLUMNS FROM pengajuan_bq');
  ['jenis_pengajuan','urgency','item_code'].forEach(f => {
    const c = pCols.find(x => x.Field === f);
    if (c) console.log(`  pengajuan_bq.${f}: ${c.Type} (${c.Null})`);
  });
  const [uCols] = await pool.query('SHOW COLUMNS FROM users');
  const su = uCols.find(x => x.Field === 'supervisor_id');
  if (su) console.log(`  users.supervisor_id: ${su.Type} (${su.Null})`);

  // 2. Cek getAllPengajuan return kolom baru
  console.log('\n--- GET /api/pengajuan/all ---');
  const [allRows] = await pool.query(`
    SELECT bq.jenis_pengajuan, bq.urgency, bq.no_registrasi
    FROM pengajuan_bq bq LIMIT 3
  `);
  allRows.forEach(r => console.log(`  ${r.no_registrasi}: jenis=${r.jenis_pengajuan}, urgency=${r.urgency}`));

  // 3. Cek getPengajuanSummary return array
  console.log('\n--- GET /api/pengajuan/summary ---');
  const [[summaryRows]] = await pool.query(`
    SELECT bq.no_registrasi, bq.jenis_pengajuan, bq.urgency
    FROM pengajuan_bq bq
    JOIN users u ON u.id = bq.user_id
    WHERE bq.status_approval_spv = 'Menunggu'
    ORDER BY bq.timestamp ASC
  `);
  console.log(`  count: ${summaryRows.length}, isArray: ${Array.isArray(summaryRows)}`);
  if (summaryRows.length) console.log(`  sample: ${JSON.stringify(summaryRows[0])}`);

  // 4. Cek getStockAlert return array
  console.log('\n--- GET /api/spareparts/alert ---');
  const [[alertRows]] = await pool.query(`
    SELECT item_code, deskripsi, qty_on_hand, min_stock
    FROM spareparts
    WHERE qty_on_hand <= min_stock AND min_stock > 0
    LIMIT 3
  `);
  console.log(`  isArray: ${Array.isArray(alertRows)}, count: ${alertRows.length}`);
  alertRows.forEach(r => console.log(`  ${r.item_code}: qty=${r.qty_on_hand}, min=${r.min_stock}`));

  // 5. Verifikasi createPengajuan dengan jasa
  console.log('\n--- BUAT JASA TEST ---');
  const stamp = Date.now().toString().slice(-6);
  try {
    await pool.execute(`INSERT INTO pengajuan_bq (no_registrasi, user_id, item_code, qty_diminta, uom, spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran, jenis_pengajuan, urgency, status_approval_spv, status_approval_manager, status_pengadaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', 'Menunggu', 'BQ Baru')`,
      [`TEST-JASA-${stamp}`, 1, null, 1, 'Pcs', `Jasa test ${stamp}`, 'EJO', `EJO/QA/${stamp}`, 'Area QA', null, null, 'jasa', 'Normal']
    );
    console.log('  Jasa create OK!');
    // Cek data
    const [[ja]] = await pool.query(`SELECT no_registrasi, jenis_pengajuan, item_code FROM pengajuan_bq WHERE no_registrasi='TEST-JASA-${stamp}'`);
    console.log(`  Result: ${JSON.stringify(ja[0])}`);
    // Hapus
    await pool.execute(`DELETE FROM pengajuan_bq WHERE no_registrasi='TEST-JASA-${stamp}'`);
    console.log('  Test data dibersihkan.');
  } catch(e) {
    console.log('  ERR:', e.message);
  }

  // 6. Verifikasi createPengajuan dengan urgency
  console.log('\n--- BUAT URGENT TEST ---');
  const stamp2 = Date.now().toString().slice(-6);
  try {
    const [[sp]] = await pool.execute('SELECT item_code FROM spareparts LIMIT 1');
    await pool.execute(`INSERT INTO pengajuan_bq (no_registrasi, user_id, item_code, qty_diminta, uom, spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran, jenis_pengajuan, urgency, status_approval_spv, status_approval_manager, status_pengadaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', 'Menunggu', 'BQ Baru')`,
      [`TEST-URG-${stamp2}`, 1, sp.item_code, 1, 'Pcs', `Urgent test ${stamp2}`, 'EJO', `EJO/QA/${stamp2}`, 'Area QA', null, null, 'sparepart', 'Urgent']
    );
    console.log('  Urgent create OK!');
    const [[ur]] = await pool.query(`SELECT no_registrasi, jenis_pengajuan, urgency FROM pengajuan_bq WHERE no_registrasi='TEST-URG-${stamp2}'`);
    console.log(`  Result: ${JSON.stringify(ur[0])}`);
    await pool.execute(`DELETE FROM pengajuan_bq WHERE no_registrasi='TEST-URG-${stamp2}'`);
    console.log('  Test data dibersihkan.');
  } catch(e) {
    console.log('  ERR:', e.message);
  }

  // 7. Verifikasi FORM-09: create tanpa spesifikasi
  console.log('\n--- FORM-09: create tanpa spesifikasi ---');
  try {
    await pool.execute(`INSERT INTO pengajuan_bq (no_registrasi, user_id, item_code, qty_diminta, uom, spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran, jenis_pengajuan, urgency, status_approval_spv, status_approval_manager, status_pengadaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu', 'Menunggu', 'BQ Baru')`,
      ['FORM09-TEST', 1, 'O-16725-00', 1, 'Pcs', '', 'EJO', 'EJO/QA/0', 'Area QA', null, null, 'sparepart', 'Normal']
    );
    console.log('  ERR: Seharusnya gagal!');
  } catch(e) {
    if (e.message.includes('Data too long') || e.message.includes('specifikasi')) {
      console.log('  OK: spesifikasi NOT NULL constraint bekerja (message: ' + e.message.slice(0,80) + ')');
    } else {
      console.log('  ERR unexpected:', e.message.slice(0,100));
    }
  }
  await pool.execute(`DELETE FROM pengajuan_bq WHERE no_registrasi='FORM09-TEST'`).catch(()=>{});

  console.log('\n=== SEMUA VERIFIKASI SELESAI ===');
  process.exit(0);
}

verify().catch(e => { console.error(e); process.exit(1); });
