#!/usr/bin/env node
/**
 * generate_supabase_seed.js
 * Generates comprehensive PostgreSQL seed for Supabase matching QA test expectations.
 * Run: node scripts/generate_supabase_seed.js
 * Output: database/supabase_seed_full.sql
 */

const fs = require('fs');
const path = require('path');

// ==================== CONFIG ====================
const EXPECT = {
  total_spareparts: 663,
  critical: 155,
  low_stock: 284,
  out_of_stock: 140,
  pengajuan: 200,
  months: 21,
  pengajuanSep: 8,
  pengajuanFeb: 20,
  pengajuanJan: 16,
  log_count: 3,
  FIXED_LOG_NO: 'BQ-2026-09-01-0001'
};

// ==================== USERS (18 entries, same as MySQL) ====================
const USERS = [
  { username: 'AAA', password: '04AAA10', role: 'teknisi', name: 'AAA', bqLink: 'https://docs.google.com/spreadsheets/d/1cQjqA9e_ROK_DL6lhwLlY--XdPO9xNC43VbfdVxxWsE/edit?usp=drive_link' },
  { username: 'ANO', password: '0808ANO', role: 'teknisi', name: 'ANO', bqLink: 'https://docs.google.com/spreadsheets/d/1z0nfI7RRQosYkqwM9LryCqReZEv89IqX7saa3TwWdVc/edit?usp=sharing' },
  { username: 'BDU', password: 'BDU2711', role: 'teknisi', name: 'BDU', bqLink: 'https://docs.google.com/spreadsheets/d/1pWfC8L9aOX-jH40t_eDbTYyag0jSXu2kttrNRmUoGyg/edit?usp=sharing' },
  { username: 'MOB', password: '08MOB10', role: 'teknisi', name: 'MOB', bqLink: 'https://docs.google.com/spreadsheets/d/1OeurbDSDkvtHP1YfNsN7uf9Bh_zQ0fKnU6JJvS-fUmk/edit?usp=sharing' },
  { username: 'MRN', password: '0810MRN', role: 'teknisi', name: 'MRN', bqLink: 'https://docs.google.com/spreadsheets/d/1o_G3OiybOBm1PhEKlTlMmcfRpd7w0N2lsKOv_Q-iB_c/edit?usp=sharing' },
  { username: 'NDS', password: 'NDS2711', role: 'teknisi', name: 'NDS', bqLink: 'https://docs.google.com/spreadsheets/d/1EHW0nnlfros-DP7FeVO8wdSGjz_E0M22VyvMVuQAb4Y/edit?usp=sharing' },
  { username: 'RIA', password: '14RIA05', role: 'teknisi', name: 'RIA', bqLink: 'https://docs.google.com/spreadsheets/d/1NvtqqkLL5FCQ2wJLsbulp8Yl05UgqaMnYHMx6xAbRuM/edit?usp=sharing' },
  { username: 'ROS', password: '2010ROS', role: 'teknisi', name: 'ROS', bqLink: 'https://docs.google.com/spreadsheets/d/1lLIK3NQUx_vn2Or3MY4mnuTooWiDsfTuxQZJcuiZ_PU/edit?usp=sharing' },
  { username: 'SFH', password: 'SFH0306', role: 'teknisi', name: 'SFH', bqLink: 'https://docs.google.com/spreadsheets/d/18DIWpGrQi5sH3iEsnKXxiVF3WHvl5gqUy2R8lI2oPnk/edit?usp=sharing' },
  { username: 'KFF', password: 'KFF0610', role: 'teknisi', name: 'KFF', bqLink: 'https://docs.google.com/spreadsheets/d/1R9Rwojmbt4YrHUeqVzIgXbY7DagAvEb1-RzGUjJpMV8/edit?usp=sharing' },
  { username: 'ERA', password: '19ERA01', role: 'teknisi', name: 'ERA', bqLink: 'https://docs.google.com/spreadsheets/d/1E4F_drOMHfl9nmGdjuVVKsBj4LihHj_ug7mzoCiv_yw/edit?usp=sharing' },
  { username: 'WAP', password: '0704WAP', role: 'teknisi', name: 'WAP', bqLink: 'https://docs.google.com/spreadsheets/d/1J4sZpKQpEWWldTKvmaqG1RUM6HH3juujFam5dK-MJ2I/edit?usp=sharing' },
  { username: 'MCL', password: 'MCL1702', role: 'teknisi', name: 'MCL', bqLink: 'https://docs.google.com/spreadsheets/d/1nCi_wyNHV1dHm6H1xxgptdUxG-Va9z6VEv44geRfT3s/edit?usp=sharing' },
  { username: 'INN', password: '30INN11', role: 'Supervisor 1', name: 'INN', bqLink: null },
  { username: 'MUN', password: '2506MUN', role: 'Supervisor 2', name: 'MUN', bqLink: null },
  { username: 'KAA', password: 'KAA1910', role: 'Supervisor 2', name: 'KAA', bqLink: null },
  { username: 'ANS', password: 'ANS1805', role: 'Officer', name: 'ANS', bqLink: null },
  { username: 'KSW', password: '01KSW10', role: 'manager', name: 'KSW', bqLink: null }
];

// ==================== MESIN AREAS ====================
const MESIN_AREAS = [
  'Capping VCM200', 'Autoclave FVA2/A1', 'Autoclave NA2247AU', 'Autoclave FOF/6 AC',
  'Freeze Dryer Lyofast 10', 'Freeze Dryer MBE1207', 'Filling VFM100', 'Tunnel ST1L',
  'Washing RAR4', 'Washing RAV4', 'Mixing Tank Adam', 'EDM EDM1',
  'cRABS Z064CR', 'Marchesini MA155', 'Robot Casepacker'
];

// ==================== PURPOSES ====================
const PURPOSES = ['Consumable', 'EJO', 'Non-EJO', 'Emergency'];

// ==================== URGENCY ====================
const URGENCY_TYPES = ['Normal', 'Urgent'];

// ==================== TYPES ====================
const ITEM_TYPES = ['sparepart', 'jasa'];

// ==================== STATUSES ====================
const APPROVAL_STATUSES = ['Menunggu', 'Disetujui', 'Ditolak'];
const PENGADAAN_STATUSES = ['BQ Baru', 'Pending', 'Proses PO', 'Barang Dikirim', 'Tiba di Gudang', 'Selesai'];

// ==================== SPAREPARTS ====================
// Parse spareparts from seed.sql - we'll read the original file and convert

function parseSpareparts() {
  const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
  const content = fs.readFileSync(seedPath, 'utf-8');
  
  // Extract INSERT INTO spareparts VALUES block
  const startMarker = "INSERT INTO spareparts (item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak) VALUES\n";
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find spareparts INSERT in seed.sql');
  
  const dataStart = startIdx + startMarker.length;
  // Find the end of the INSERT (next section or end)
  const nextSection = content.indexOf('\n-- ====================', dataStart);
  const dataEnd = nextSection !== -1 ? nextSection : content.indexOf(';', dataStart) + 1;
  const dataBlock = content.substring(dataStart, dataEnd);
  
  // Parse each tuple
  const spareparts = [];
  const tupleRegex = /\('([^']+)',\s*'([^']*(?:''[^']*)*)',\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(NULL|'[^']*')\)/g;
  let match;
  
  while ((match = tupleRegex.exec(dataBlock)) !== null) {
    const [, item_code, deskripsi, qty, min, max, critical, rak] = match;
    // Convert is_critical: 1 -> TRUE, 0 -> FALSE
    const is_critical = critical === '1' ? 'TRUE' : 'FALSE';
    const lokasi_rak = rak === 'NULL' ? 'NULL' : rak;
    spareparts.push({ item_code, deskripsi, qty_on_hand: parseInt(qty), min_stock: parseInt(min), max_stock: parseInt(max), is_critical, lokasi_rak });
  }
  
  return spareparts;
}

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'string') {
    if (val === 'NULL') return 'NULL';
    return "'" + val.replace(/'/g, "''") + "'";
  }
  return String(val);
}

function escapeStr(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

// ==================== GENERATE PENGAJUAN ====================
function generatePengajuan(spareparts, technisiIds) {
  const pengajuan = [];
  
  // Generate pengajuan for each month from Jan 2025 to Sep 2026 (21 months)
  const months = [];
  for (let y = 2025; y <= 2026; y++) {
    const endMonth = (y === 2026) ? 9 : 12;
    const startMonth = (y === 2025) ? 1 : 1;
    for (let m = startMonth; m <= endMonth; m++) {
      months.push({ year: y, month: m });
    }
  }
  
  // Distribution: target ~200+ total
  // Sep 2026: 8 pengajuan (current month - reduced)
  // Feb 2026: 20
  // Jan 2026: 16
  // Other months: spread remaining
  
  const monthCounts = {};
  months.forEach(m => {
    const key = `${m.year}-${String(m.month).padStart(2, '0')}`;
    if (key === '2026-09') monthCounts[key] = 8;      // Sep 2026: exactly 8
    else if (key === '2025-02') monthCounts[key] = 20; // Feb 2025: exactly 20
    else if (key === '2025-01') monthCounts[key] = 16; // Jan 2025: exactly 16
    else monthCounts[key] = 0; // will be calculated
  });
  
  // Target: at least 200 total
  const fixed = 8 + 20 + 16; // 44
  const remaining = EXPECT.pengajuan - fixed; // 156 for 19 other months
  const otherMonths = months.filter(m => {
    const key = `${m.year}-${String(m.month).padStart(2, '0')}`;
    return key !== '2026-09' && key !== '2025-02' && key !== '2025-01';
  });
  
  // Distribute ~8 per month for remaining 19 months = 152, plus some variation
  const basePerMonth = Math.floor(remaining / otherMonths.length);
  let extra = remaining % otherMonths.length;
  
  otherMonths.forEach(m => {
    const key = `${m.year}-${String(m.month).padStart(2, '0')}`;
    monthCounts[key] = basePerMonth + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
  });
  
  // Ensure total >= 200
  let totalPlanned = Object.values(monthCounts).reduce((a, b) => a + b, 0);
  if (totalPlanned < EXPECT.pengajuan) {
    // Add to first other month
    const firstKey = Object.keys(monthCounts).find(k => k !== '2026-09' && k !== '2025-02' && k !== '2025-01');
    monthCounts[firstKey] += (EXPECT.pengajuan - totalPlanned);
  }
  
  console.log('Monthly distribution:', monthCounts);
  console.log('Total planned:', Object.values(monthCounts).reduce((a, b) => a + b, 0));
  
  // Now generate entries - per-month numbering so Sep 2026 starts at 0001
  let bqNum = 0;
  for (const monthData of months) {
    const key = `${monthData.year}-${String(monthData.month).padStart(2, '0')}`;
    const count = monthCounts[key];
    bqNum = 1; // reset per month (1-indexed)
    
    for (let i = 0; i < count; i++) {
      const day = 1 + (i % 28);
      const hour = 8 + (i % 9); // 8-16
      const minute = (i * 13) % 60;
      
      const no_reg = `BQ-${monthData.year}-${String(monthData.month).padStart(2, '0')}-${String(day).padStart(2, '0')}-${String(bqNum).padStart(4, '0')}`;
      const userId = technisiIds[i % technisiIds.length];
      const sparepart = spareparts[i % spareparts.length];
      const qty = 1 + (i % 40);
      const purpose = PURPOSES[i % PURPOSES.length];
      const mesinArea = MESIN_AREAS[i % MESIN_AREAS.length];
      const noEjo = `EJO/${monthData.year}/${String(monthData.month).padStart(2, '0')}/${String(i + 1).padStart(3, '0')}`;
      const spvStatus = APPROVAL_STATUSES[i % APPROVAL_STATUSES.length];
      const pengadaanStatus = PENGADAAN_STATUSES[i % PENGADAAN_STATUSES.length];
      const urgency = URGENCY_TYPES[i % URGENCY_TYPES.length];
      const itemType = ITEM_TYPES[i % ITEM_TYPES.length];
      const merk = sparepart.item_code.startsWith('P-') ? 'General' : (i % 3 === 0 ? 'SKF' : (i % 3 === 1 ? 'INA' : '-'));
      const referensi = i % 4 === 0 ? 'https://www.tokopedia.com' : (i % 4 === 1 ? 'https://shopee.co.id' : (i % 4 === 2 ? 'https://www.lazada.co.id' : null));
      
      pengajuan.push({
        no_registrasi: no_reg,
        user_id: userId,
        item_code: sparepart.item_code,
        qty_diminta: qty,
        spesifikasi_lengkap: `${sparepart.deskripsi}; ${qty} pcs; untuk ${mesinArea}.`,
        purpose,
        no_ejo: noEjo,
        mesin_area: mesinArea,
        merk,
        referensi_penawaran: referensi,
        status_approval_spv: spvStatus,
        status_pengadaan: pengadaanStatus,
        urgency,
        jenis_pengajuan: itemType,
        timestamp: `${key}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+07:00`
      });
      
      bqNum++;
    }
  }
  
  return pengajuan;
}

// ==================== MAIN ====================
function main() {
  console.log('Parsing spareparts from seed.sql...');
  const spareparts = parseSpareparts();
  console.log(`Found ${spareparts.length} spareparts`);
  
  // Technisi IDs (1-13)
  const technisiIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  
  console.log('Generating pengajuan...');
  const pengajuan = generatePengajuan(spareparts, technisiIds);
  console.log(`Generated ${pengajuan.length} pengajuan entries`);
  
  // Generate SQL
  let sql = `-- =====================================================================
-- supabase_seed_full.sql - Comprehensive seed data untuk Supabase
-- Generated by scripts/generate_supabase_seed.js
-- Matches QA test expectations:
--   users: 18
--   spareparts: 663 (critical: 155, low: 284, out: 140)
--   pengajuan: ${pengajuan.length}+
--   months: 21 (Jan 2025 - Sep 2026)
-- =====================================================================

-- ==================== USERS ====================
INSERT INTO users (username, password, role, name, bqLink) VALUES
`;

  USERS.forEach((u, i) => {
    const comma = i < USERS.length - 1 ? ',' : ';';
    const bqLink = escapeStr(u.bqLink);
    sql += `('${u.username}', '${u.password}', '${u.role}', '${u.name}', ${bqLink})${comma}\n`;
  });
  
  sql += `\n-- ==================== SPAREPARTS (${spareparts.length} items) ====================\n`;
  sql += `INSERT INTO spareparts (item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak) VALUES\n`;
  
  spareparts.forEach((sp, i) => {
    const comma = i < spareparts.length - 1 ? ',' : ';';
    sql += `('${sp.item_code}', '${sp.deskripsi.replace(/'/g, "''")}', ${sp.qty_on_hand}, ${sp.min_stock}, ${sp.max_stock}, ${sp.is_critical}, ${sp.lokasi_rak})${comma}\n`;
  });
  
  sql += `\n-- ==================== PENGAJUAN BQ (${pengajuan.length} entries) ====================\n`;
  
  // Use batch inserts for efficiency
  const BATCH_SIZE = 20;
  for (let i = 0; i < pengajuan.length; i += BATCH_SIZE) {
    const batch = pengajuan.slice(i, i + BATCH_SIZE);
    sql += `INSERT INTO pengajuan_bq (no_registrasi, user_id, item_code, qty_diminta, spesifikasi_lengkap, purpose, no_ejo, mesin_area, merk, referensi_penawaran, status_approval_spv, status_pengadaan, urgency, jenis_pengajuan, timestamp) VALUES\n`;
    
    batch.forEach((p, j) => {
      const comma = j < batch.length - 1 ? ',' : ';';
      sql += `('${p.no_registrasi}', ${p.user_id}, '${p.item_code}', ${p.qty_diminta}, '${escapeStr(p.spesifikasi_lengkap).slice(1, -1)}', '${p.purpose}', '${p.no_ejo}', '${p.mesin_area}', '${p.merk}', ${escapeStr(p.referensi_penawaran)}, '${p.status_approval_spv}', '${p.status_pengadaan}', '${p.urgency}', '${p.jenis_pengajuan}', '${p.timestamp}')${comma}\n`;
    });
    sql += '\n';
  }
  
  // ==================== PENGAJUAN LOG ====================
  sql += `\n-- ==================== PENGAJUAN LOG (audit trail for ${EXPECT.FIXED_LOG_NO}) ====================\n`;
  sql += `INSERT INTO pengajuan_log (no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value, created_at) VALUES\n`;
  
  const logs = [
    { no_reg: EXPECT.FIXED_LOG_NO, actor_id: 1, actor_name: 'AAA', actor_role: 'teknisi', field: 'status_approval_spv', old_value: null, new_value: 'Menunggu', created_at: '2026-09-01T08:00:00+07:00' },
    { no_reg: EXPECT.FIXED_LOG_NO, actor_id: 14, actor_name: 'INN', actor_role: 'Supervisor 1', field: 'status_approval_spv', old_value: 'Menunggu', new_value: 'Disetujui', created_at: '2026-09-01T10:30:00+07:00' },
    { no_reg: EXPECT.FIXED_LOG_NO, actor_id: 18, actor_name: 'ANS', actor_role: 'Officer', field: 'status_pengadaan', old_value: 'BQ Baru', new_value: 'Proses PO', created_at: '2026-09-01T14:00:00+07:00' }
  ];
  
  logs.forEach((log, i) => {
    const comma = i < logs.length - 1 ? ',' : ';';
    const oldVal = log.old_value ? `'${log.old_value}'` : 'NULL';
    sql += `('${log.no_reg}', ${log.actor_id}, '${log.actor_name}', '${log.actor_role}', '${log.field}', ${oldVal}, '${log.new_value}', '${log.created_at}')${comma}\n`;
  });
  
  sql += '\n';
  
  // Write file
  const outPath = path.join(__dirname, '..', 'database', 'supabase_seed_full.sql');
  fs.writeFileSync(outPath, sql, 'utf-8');
  console.log(`\nSeed file written to: ${outPath}`);
  console.log(`File size: ${(Buffer.byteLength(sql) / 1024).toFixed(1)} KB`);
  
  // Verify counts
  console.log('\n=== VERIFICATION ===');
  console.log(`Users: ${USERS.length}`);
  console.log(`Spareparts: ${spareparts.length}`);
  console.log(`Pengajuan: ${pengajuan.length}`);
  console.log(`Logs: ${logs.length}`);
  
  // Count by month
  const monthStats = {};
  pengajuan.forEach(p => {
    const m = p.no_registrasi.substring(4, 11); // BQ-YYYY-MM
    monthStats[m] = (monthStats[m] || 0) + 1;
  });
  console.log('\nPengajuan by month:');
  Object.entries(monthStats).sort().forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });
  
  // Count critical
  const critical = spareparts.filter(s => s.is_critical === 'TRUE').length;
  const lowStock = spareparts.filter(s => s.qty_on_hand <= s.min_stock && s.qty_on_hand > 0).length;
  const outOfStock = spareparts.filter(s => s.qty_on_hand === 0).length;
  console.log(`\nSpareparts stats: critical=${critical}, low-stock=${lowStock}, out-of-stock=${outOfStock}`);
}

main();
