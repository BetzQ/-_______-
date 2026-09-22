/**
 * scripts/import_raw_data.js
 * =====================================================================
 * ETL Script: Import data dari file Excel raw data ke database
 * PostgreSQL (Supabase).
 *
 * Sumber data (PATOKAN UTAMA):
 *   SPAREPARTS:
 *     - All Item Code on Going.xlsx      → item_code, deskripsi (master)
 *     - Critical Part (1).xlsx           → min_stock, max_stock, is_critical
 *     - On Hand On Going.xlsx            → qty_on_hand, lokasi_rak
 *   PENGAJUAN_BQ:
 *     - Form BQ Testing [semua file]     → Re Order / Baru / Jasa sheets
 *     - BQ On Going.xlsx                 → data BQ ongoing
 *     - BQ Summary (2).xlsx              → ringkasan BQ + pipeline status
 *     - Database Approval SPV BQ Testing → status approval SPV audit
 *
 * KEBIJAKAN:
 *   - Menggunakan UPSERT (INSERT ... ON CONFLICT DO UPDATE) agar
 *     idempotent — aman dijalankan berulang kali.
 *   - Kolom analitik/ekstra (36 kolom dari Critical Part, PR Summary,
 *     dsb) DIABAIKAN sesuai keputusan.
 *   - Tabel users TIDAK di-impor (tidak ada sumber Excel).
 *
 * Penggunaan:
 *   node scripts/import_raw_data.js                  (impor penuh)
 *   node scripts/import_raw_data.js --dry             (preview saja, tidak tulis)
 *   node scripts/import_raw_data.js --spareparts      (import spareparts saja)
 *   node scripts/import_raw_data.js --bq              (import pengajuan_bq saja)
 *   node scripts/import_raw_data.js --reset-spareparts (hapus + impor ulang spareparts)
 * =====================================================================
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const XLSX = require('xlsx');
const { Pool } = require('pg');

// ==================== KONFIGURASI ====================

const DATA_DIR = path.join(
  __dirname, '..',
  'CP Kelompok A 127',
  'Bahan Capstone Project',
  'Raw Data CP-20260922T080238Z-1-001',
  'Raw Data CP'
);

const DRY = process.argv.includes('--dry');
const MODE_SPAREPARTS = process.argv.includes('--spareparts');
const MODE_BQ = process.argv.includes('--bq');
const MODE_RESET_SP = process.argv.includes('--reset-spareparts');

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  console.error('[FATAL] DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

// Sheet names yang akan diproses per file
const SP_SHEETS = ['All Item Code'];               // All Item Code on Going.xlsx
const CP_SHEETS = ['All Critical Part'];            // Critical Part (1).xlsx
const OH_SHEETS = ['Inventory Tarikan Oracle'];     // On Hand On Going.xlsx
const BQ_FORM_SHEETS = ['Re Order', 'Baru', 'Jasa']; // sheet types di Form BQ Testing
const BQ_SUMMARY_SHEET = 'BQ Summary Full Approved'; // BQ Summary (2).xlsx
const DB_APPROVAL_SHEET = 'Gform Aproval SPV BQ Testing'; // Database Approval SPV BQ Testing.xlsx

// ==================== POOL DATABASE ====================

const pool = new Pool({
  connectionString: DB_URL,
  max: 10,
  connectionTimeoutMillis: 10000,  // gagal jika koneksi tidak terbentuk dalam 10 detik
  idleTimeoutMillis: 30000,        // tutup client idle setelah 30 detik
  query_timeout: 60000,            // abort query yang menggantung > 60 detik
  statement_timeout: 60000,        // abort statement di sisi server > 60 detik
});

pool.on('error', (err) => {
  console.error('[DB Pool Error]', err.message);
});

async function getDbClient() {
  return pool.connect();
}

/**
 * Jalankan `fn` untuk setiap item dengan konkurensi terbatas.
 * Mengembalikan array hasil berurutan sesuai input (item → taskFn(item, i)).
 * Aman dipakai untuk operasi idempotent (UPSERT/UPDATE) ke Supabase jarak jauh.
 */
async function mapLimit(items, limit, taskFn) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await taskFn(items[i], i);
    }
  }

  const n = Math.min(Math.max(1, limit), items.length);
  await Promise.all(Array.from({ length: n }, worker));
  return results;
}

// ==================== HELPER: PEMBERSIHAN DATA ====================

/**
 * Bersihkan nilai dari Excel: kosong, '-', 'N/A', 'NA' → null
 */
function clean(v) {
  if (v === undefined || v === null) return null;
  const t = String(v).trim();
  if (!t || t === '-' || t === 'N/A' || t.toLowerCase() === 'na' || t === '--') return null;
  return t;
}

/**
 * Parsel tanggal Excel serial number → Date.
 * Jika sudah Date, langsung kembalikan.
 * Mendukung: serial number Excel, string ISO, dan format panjang Indonesia
 * (misal "Senin, 25 Mei 2026, 15.33.33").
 */
function xlToDate(v) {
  if (v instanceof Date) return v;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    if (d) return new Date(d.y, d.m - 1, d.d, d.H, d.M, Math.floor(d.S));
  }
  const str = String(v || '').trim();
  if (!str) return null;

  // Coba parse ISO string terlebih dahulu
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) return parsed;

  // Format Indonesia: "Senin, 25 Mei 2026, 15.33.33" | "Rabu, 22 Januari 2025, 14.18.30"
  const ID_MONTHS = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11,
  };
  const m = str.match(/^[A-Za-z]+,\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s*(\d{1,2})\.(\d{2})(\.(\d{2}))?/);
  if (m) {
    const monthIdx = ID_MONTHS[m[2].toLowerCase()];
    if (monthIdx !== undefined) {
      return new Date(
        Number(m[3]), monthIdx, Number(m[1]),
        Number(m[4]), Number(m[5]), Number(m[7] || 0)
      );
    }
  }

  // Format Indonesia tanpa nama hari: "25 Mei 2026 15.33.33"
  const m2 = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),?\s*(\d{1,2})\.(\d{2})(\.(\d{2}))?/);
  if (m2) {
    const monthIdx = ID_MONTHS[m2[2].toLowerCase()];
    if (monthIdx !== undefined) {
      return new Date(
        Number(m2[3]), monthIdx, Number(m2[1]),
        Number(m2[4]), Number(m2[5]), Number(m2[7] || 0)
      );
    }
  }

  // Format "dd Mon yyyy hh:mm:ss" (nama bulan bahasa Inggris, mis. "25 May 2026 15:33:33")
  const m3 = str.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4}).*?(\d{1,2}):(\d{2})/);
  if (m3) {
    const parsed2 = new Date(`${m3[2]} ${m3[1]}, ${m3[3]} ${m3[4]}:${m3[5]}:00`);
    if (!Number.isNaN(parsed2.getTime())) return parsed2;
  }

  // Format "gg/mm/yyyy hh:mm" (dd/mm/yyyy) — fallback umum
  const m4 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}).*?(\d{1,2}):(\d{2})/);
  if (m4) {
    return new Date(Number(m4[3]), Number(m4[2]) - 1, Number(m4[1]), Number(m4[4]), Number(m4[5]));
  }

  return null;
}

/**
 * Format Date → string timestamp PostgreSQL-compatible.
 */
function toPgTimestamp(d) {
  if (!d) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Parsel angka dari string Excel (hapus ribuan separator, dsb).
 */
function xlToNumber(v) {
  if (typeof v === 'number') return v;
  if (v === undefined || v === null) return null;
  const str = String(v).replace(/[^\d.-]/g, '');
  const n = parseFloat(str);
  return Number.isFinite(n) ? n : null;
}

// ==================== HELPER: NORMALISASI ====================

/**
 * Normalisasi urgency: "Status Urgent" Excel → DB urgency.
 *   "Normal" → "Normal"
 *   "Urgent" → "Urgent"
 *   Lainnya → "Normal" (default aman)
 */
function normalizeUrgency(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (v === 'urgent') return 'Urgent';
  if (v === 'normal') return 'Normal';
  // Handle variations like "URGENT", "urgent ", "Status Urgent"
  if (v.includes('urgent')) return 'Urgent';
  return 'Normal';
}

/**
 * Normalisasi jenis pengajuan: "Kategori" Excel → DB jenis_pengajuan.
 *   "Baru" → "sparepart"
 *   "Re Order" → "sparepart"
 *   "Jasa" → "jasa"
 *   Lainnya → "sparepart" (default)
 */
function normalizeJenis(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (v === 'jasa') return 'jasa';
  return 'sparepart'; // Baru, Re Order, dan lainnya → sparepart
}

/**
 * Normalisasi status pengadaan: "Status BQ" Excel → DB status_pengadaan.
 *   Pipeline: BQ Baru → Pending → Proses PO → Barang Dikirim → Tiba di Gudang → Selesai
 *   Hanya mengembalikan nilai yang VALID di CHECK constraint pengajuan_bq.
 *   Nilai yang tidak dikenal → "BQ Baru" (default aman).
 */
function normalizeStatusPengadaan(raw) {
  const v = String(raw || '').trim();
  if (!v) return 'BQ Baru';
  const map = {
    'BQ Baru': 'BQ Baru',
    'Mencari Penawaran': 'Pending',
    'Mencari Penawang': 'Pending',
    'Approval PR': 'Pending',
    'PR Open': 'Pending',
    'Proses PO': 'Proses PO',
    'PO Open': 'Proses PO',
    'Deliver': 'Barang Dikirim',
    'Barang Dikirim': 'Barang Dikirim',
    'Selesai': 'Tiba di Gudang',
    'Selesai.': 'Tiba di Gudang',
    'Tiba di Gudang': 'Tiba di Gudang',
  };
  return map[v] || 'BQ Baru'; // hanya return valid CHECK values
}

/**
 * Normalisasi status approval SPV.
 *   "Disetujui" → "Disetujui"
 *   "Ditolak" → "Ditolak"
 *   "Menunggu" → "Menunggu"
 *   Lainnya → "Menunggu" (default)
 */
function normalizeSpv(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (v.includes('setuju') || v === 'approve' || v === 'approved') return 'Disetujui';
  if (v.includes('tolak') || v === 'reject' || v === 'rejected') return 'Ditolak';
  if (v.includes('menunggu') || v === 'waiting') return 'Menunggu';
  if (v === 'disetujui') return 'Disetujui';
  if (v === 'ditolak') return 'Ditolak';
  return 'Menunggu';
}

/**
 * Derive is_critical dari kolom Status di Critical Part Excel.
 *   "Critical" → true
 *   "Aktif" → false (atau sesuai logika bisnis)
 *   Lainnya → false
 */
function deriveIsCritical(raw) {
  const v = String(raw || '').trim().toLowerCase();
  if (v.includes('critical')) return true;
  if (v.includes('critical part')) return true;
  return false;
}

/**
 * Gabungkan Status + Kategori untuk penentuan critical.
 * Kolom "Status" berisi Lebih/Kurang/Sama, sedangkan kata "Critical"
 * berada di kolom "Kategori Barang" (mis. "Critical Sparepart").
 */
function deriveIsCriticalFull(statusRaw, kategoriRaw) {
  const s = String(statusRaw || '').trim().toLowerCase();
  const k = String(kategoriRaw || '').trim().toLowerCase();
  return s.includes('critical') || k.includes('critical');
}

/**
 * Normalisasi semua string: trim, handle undefined/null.
 */
function norm(v) {
  if (v === undefined || v === null) return null;
  return String(v).trim();
}

// ==================== HELPER: PENENTUAN USER ID ====================

/**
 * Dari username (mis. "ANO"), cari user_id di database.
 * Username dari seed: AAA, ANO, BDU, MOB, MRN, NDS, RIA, ROS, SFH, KFF, ERA, WAP, MCL, INN, MUN, KAA, ANS, KSW.
 */
async function buildUserMap(client) {
  const result = await client.query('SELECT id, username FROM users');
  const map = new Map();
  for (const row of result.rows) {
    map.set(row.username.toUpperCase(), row.id);
  }
  return map;
}

/**
 * Dari nama file Form BQ Testing (mis. "Form BQ Testing ANO.xlsx"),
 * ekstrak username.
 * Handle suffix seperti "(HAS BEEN CLOSED)" → username = "AAA" dari "Form BQ Testing AAA (HAS BEEN CLOSED).xlsx".
 */
function extractUsernameFromFilename(fileName) {
  // Ambil semua teks antara "Form BQ Testing " dan ".xlsx"
  const match = fileName.match(/^Form BQ Testing (.+)\.xlsx$/);
  if (!match) return null;
  const raw = match[1].trim();
  // Ambil hanya kata pertama (username), abaikan suffix seperti "(HAS BEEN CLOSED)"
  return raw.split(/\s+/)[0].toUpperCase();
}

// ==================== HELPER: ROW-LEVEL SAFE COLUMN EXTRACTION ====================

/**
 * Ambil nilai dari baris Excel berdasarkan beberapa kemungkinan nama kolom.
 * Mengecek kolom mana yang ADA di header, lalu mengambil nilainya.
 */
function getVal(row, ...possibleKeys) {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return undefined;
}

// ==================== IMPORT: SPAREPARTS ====================

/**
 * STEP 1: Import master data spareparts dari "All Item Code on Going.xlsx".
 *   Kolom: item_code, deskripsi (dasar saja).
 */
async function importSparepartsMaster(client) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 1: Import Master Spareparts dari "All Item Code on Going.xlsx"');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'All Item Code on Going.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  // Cari sheet yang memiliki kolom "Item Code" dan "Deskripsi".
  // File asli memakai nama sheet acak seperti "Sheet1".
  let usedSheet = null;
  let usedWs = null;
  for (const sh of wb.SheetNames) {
    const probe = XLSX.utils.sheet_to_json(wb.Sheets[sh], { defval: '' });
    if (probe[0] && probe[0]['Item Code'] !== undefined && probe[0]['Deskripsi'] !== undefined) {
      usedSheet = sh;
      usedWs = wb.Sheets[sh];
      break;
    }
  }
  if (!usedWs) {
    // Fallback: sheet pertama
    usedSheet = wb.SheetNames[0];
    usedWs = wb.Sheets[usedSheet];
  }
  console.log(`  Menggunakan sheet: "${usedSheet}"`);

  const ws = usedWs;

  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  Total baris di sheet: ${rows.length}`);

  // Filter baris kosong
  const validRows = rows.filter((r) => r['Item Code'] && String(r['Item Code']).trim());
  console.log(`  Baris valid (ada Item Code): ${validRows.length}`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 5 baris pertama:');
    validRows.slice(0, 5).forEach((r, i) => {
      const itemCode = clean(r['Item Code']);
      const deskripsi = clean(r['Deskripsi']);
      console.log(`    ${i + 1}. item_code="${itemCode}", deskripsi="${deskripsi ? deskripsi.slice(0, 50) : '(kosong)'}..."`);
    });
    return validRows.length;
  }

  const SQL = `
    INSERT INTO spareparts (item_code, deskripsi)
    VALUES ($1, $2)
    ON CONFLICT (item_code) DO UPDATE SET deskripsi = EXCLUDED.deskripsi
  `;

  let inserted = 0;
  let skipped = 0;

  const results = await mapLimit(validRows, 8, async (r) => {
    const itemCode = clean(r['Item Code']);
    const deskripsi = clean(r['Deskripsi']) || '-';
    if (!itemCode) return { err: 'item-kosong' };
    try {
      await client.query(SQL, [itemCode, deskripsi]);
      return { err: null };
    } catch (err) {
      return { err: err.message };
    }
  });

  for (const res of results) {
    if (res.err === 'item-kosong') { skipped++; continue; }
    if (res.err) {
      skipped++;
      if (skipped <= 5) console.warn(`    [WARN] Gagal insert: ${res.err}`);
    } else {
      inserted++;
    }
  }

  console.log(`  ✅ Berhasil diinsert: ${inserted} spareparts`);
  if (skipped > 0) console.log(`  ⚠ Dilewati: ${skipped} baris`);
  return inserted;
}

/**
 * STEP 2: Update spareparts dari "Critical Part (1).xlsx" (min_stock, max_stock, is_critical).
 */
async function updateSparepartsFromCritical(client) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 2: Update Spareparts dari "Critical Part (1).xlsx"');
  console.log('  (min_stock, max_stock, is_critical)');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'Critical Part (1).xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets['All Critical Part'];
  if (!ws) {
    console.error(`[ERROR] Sheet "All Critical Part" tidak ditemukan.`);
    return 0;
  }

  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  Total baris di sheet: ${rows.length}`);

  const validRows = rows.filter((r) => r['Item Number'] && String(r['Item Number']).trim());
  console.log(`  Baris valid (ada Item Number): ${validRows.length}`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 5 baris pertama:');
    validRows.slice(0, 5).forEach((r, i) => {
      const itemNum = clean(r['Item Number']);
      const minQty = xlToNumber(r['Min Qty']);
      const maxQty = xlToNumber(r['Max Qty']);
      const status = clean(r['Status']);
      const kategori = clean(r['Kategori Barang']);
      console.log(`    ${i + 1}. item_code="${itemNum}", min=${minQty}, max=${maxQty}, status="${status}", kategori="${kategori}"`);
    });
    return validRows.length;
  }

  const SQL = `
    UPDATE spareparts
    SET min_stock = $2, max_stock = $3, is_critical = $4
    WHERE item_code = $1
  `;

  let updated = 0;
  let notFound = 0;

  const results = await mapLimit(validRows, 8, async (r) => {
    const itemCode = clean(r['Item Number']);
    const minStock = xlToNumber(r['Min Qty']);
    const maxStock = xlToNumber(r['Max Qty']);
    const isCritical = deriveIsCriticalFull(r['Status'] || r['Kategori Barang'] || '', r['Kategori Barang'] || r['Status'] || '');
    if (!itemCode) return { err: 'item-kosong' };
    try {
      const result = await client.query(SQL, [itemCode, minStock, maxStock, isCritical]);
      return { err: null, rowCount: result.rowCount };
    } catch (err) {
      return { err: err.message, rowCount: 0 };
    }
  });

  for (const res of results) {
    if (res.err === 'item-kosong') continue;
    if (res.err || res.rowCount === 0) { notFound++; continue; }
    updated++;
  }

  console.log(`  ✅ Berhasil diupdate: ${updated} spareparts`);
  console.log(`  ⚠ Tidak ditemukan di DB: ${notFound} (item_code belum ada di spareparts)`);
  return updated;
}

/**
 * STEP 3: Update spareparts dari "On Hand On Going.xlsx" (qty_on_hand, lokasi_rak).
 */
async function updateSparepartsFromOnHand(client) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 3: Update Spareparts dari "On Hand On Going.xlsx"');
  console.log('  (qty_on_hand, lokasi_rak)');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'On Hand On Going.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets['Inventory Tarikan Oracle'];
  if (!ws) {
    console.error(`[ERROR] Sheet "Inventory Tarikan Oracle" tidak ditemukan.`);
    return 0;
  }

  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  Total baris di sheet: ${rows.length}`);

  const validRows = rows.filter((r) => r['Item'] && String(r['Item']).trim());
  console.log(`  Baris valid (ada Item): ${validRows.length}`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 5 baris pertama:');
    validRows.slice(0, 5).forEach((r, i) => {
      const item = clean(r['Item']);
      const onHand = xlToNumber(r['On-hand']);
      const lokator = clean(r['Lokator']);
      console.log(`    ${i + 1}. item_code="${item}", qty_on_hand=${onHand}, lokasi_rak="${lokator}"`);
    });
    return validRows.length;
  }

  const SQL = `
    UPDATE spareparts
    SET qty_on_hand = $2, lokasi_rak = $3
    WHERE item_code = $1
  `;

  let updated = 0;
  let notFound = 0;

  const results = await mapLimit(validRows, 8, async (r) => {
    const itemCode = clean(r['Item']);
    const qtyOnHand = xlToNumber(r['On-hand']);
    const lokasiRak = clean(r['Lokator']);
    if (!itemCode) return { err: 'item-kosong' };
    try {
      const result = await client.query(SQL, [itemCode, qtyOnHand, lokasiRak]);
      return { err: null, rowCount: result.rowCount };
    } catch (err) {
      return { err: err.message, rowCount: 0 };
    }
  });

  for (const res of results) {
    if (res.err === 'item-kosong') continue;
    if (res.err || res.rowCount === 0) { notFound++; continue; }
    updated++;
  }

  console.log(`  ✅ Berhasil diupdate: ${updated} spareparts`);
  console.log(`  ⚠ Tidak ditemukan di DB: ${notFound} (item_code belum ada di spareparts)`);
  return updated;
}

// ==================== IMPORT: PENGAJUAN_BQ ====================

/**
 * Import dari Form BQ Testing (Re Order / Baru / Jasa).
 * Setiap file form memiliki username dalam namanya.
 */
async function importPengajuanFromForms(client, userMap) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 4: Import Pengajuan BQ dari Form BQ Testing [semua file]');
  console.log('='.repeat(70));

  const formFiles = fs.readdirSync(DATA_DIR)
    .filter((f) => f.startsWith('Form BQ Testing') && f.endsWith('.xlsx'))
    .sort();

  let totalImported = 0;
  let totalSkipped = 0;
  let totalPreview = 0;

  for (const file of formFiles) {
    const filePath = path.join(DATA_DIR, file);
    const wb = XLSX.readFile(filePath);

    // Extract username dari nama file
    const username = extractUsernameFromFilename(file);
    const userId = username ? userMap.get(username) : null;

    if (!userId && username) {
      console.log(`  ⚠ [${file}] username "${username}" tidak ditemukan di tabel users — baris akan dilewati`);
    }

    let fileImported = 0;
    let fileSkipped = 0;
    let filePreview = 0;
    let fileTotalRows = 0;
    let processed = 0;

    for (const sheetName of wb.SheetNames) {
      // Hanya proses sheet Re Order, Baru, Jasa
      if (!BQ_FORM_SHEETS.includes(sheetName)) continue;

      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      // Filter baris valid (harus ada Nomor Registrasi)
      const validRows = rows.filter((r) => {
        const noReg = getVal(r, 'Nomor Registrasi', 'No Registrasi');
        return noReg && String(noReg).trim();
      });

      if (validRows.length === 0) continue;

      fileTotalRows += validRows.length;

      // Jika username tidak dikenal → semua baris file ini tidak bisa di-insert
      // (kolom user_id NOT NULL). Lewati seluruh file tanpa menyentuh DB.
      if (!userId) {
        fileSkipped += validRows.length;
        console.log(`    → dilewati (${validRows.length} baris): username "${username}" tidak terdaftar`);
        continue;
      }

      console.log(`  ${file} → Sheet "${sheetName}": ${validRows.length} baris`);

      let results;
      if (DRY) {
        results = validRows.map((r) => ({ r, dry: true }));
      } else {
        results = await mapLimit(validRows, 8, async (r) => {
          const data = transformPengajuanRow(r, sheetName, userId, username);
          if (!data) return { r, skip: 'transform' };
          try {
            await insertPengajuan(client, data);
            return { r, ok: true };
          } catch (err) {
            return { r, ok: false, err: err.message };
          }
        });
      }

      for (const res of results) {
        processed++;

        if (res.dry) {
          filePreview++;
          if (filePreview <= 3) {
            console.log(`    [DRY] ${res.r['Nomor Registrasi']} | ${res.r['Kategori'] || 'sparepart'} | qty=${xlToNumber(res.r['Qty'])} | spv=${normalizeSpv(res.r['Status Approval SPV'] || 'Menunggu')} | urgency=${normalizeUrgency(res.r['Status Urgent'] || res.r['Status'] || 'Normal')}`);
          }
        } else if (res.skip === 'transform') {
          fileSkipped++;
        } else if (!res.ok) {
          fileSkipped++;
          if (fileSkipped <= 3) {
            console.warn(`    [WARN] ${file}/${sheetName}: ${res.err}`);
          }
        } else {
          fileImported++;
        }

        // Log progres setiap 100 baris agar terlihat masih berjalan
        if (processed % 100 === 0 || processed === validRows.length) {
          console.log(`    ... progres ${file} [${sheetName}]: ${processed}/${validRows.length} baris (impor=${fileImported}, skip=${fileSkipped})`);
        }
      }
    }

    if (DRY) {
      console.log(`    → [DRY] ${file}: ${filePreview} siap diinsert, ${fileSkipped} dilewati`);
    } else {
      console.log(`    → ✅ ${file}: ${fileImported} diinsert, ${fileSkipped} dilewati`);
    }
    totalImported += fileImported;
    totalSkipped += fileSkipped;
    totalPreview += filePreview;
  }

  if (DRY) {
    console.log(`\n  🔍 [DRY RUN] TOTAL Form BQ Testing: ${totalPreview} siap diinsert, ${totalSkipped} dilewati`);
  } else {
    console.log(`\n  📊 TOTAL Form BQ Testing: ${totalImported} diinsert, ${totalSkipped} dilewati`);
  }
  return DRY ? totalPreview : totalImported;
}

/**
 * Transform satu baris Excel Form BQ → data pengajuan_bq.
 *   r = baris data dari Excel
 *   sheetType = 'Re Order' | 'Baru' | 'Jasa'
 *   userId = user_id dari username di filename
 */
function transformPengajuanRow(r, sheetType, userId, username) {
  // Nomor Registrasi (PRIMARY KEY)
  const noReg = clean(getVal(r, 'Nomor Registrasi', 'No Registrasi'));
  if (!noReg) return null;

  // Timestamp
  const timestampRaw = xlToDate(getVal(r, 'Timestamp'));
  const timestamp = toPgTimestamp(timestampRaw);

  // Qty diminta
  const qtyRaw = xlToNumber(getVal(r, 'Qty'));
  const qtyDiminta = qtyRaw && qtyRaw > 0 ? Math.floor(qtyRaw) : 1;

  // UoM
  const uom = clean(getVal(r, 'UoM', 'UOM', 'Primary UOM'));

  // Spesifikasi lengkap
  let spesifikasi = clean(getVal(r, 'Spesifikasi (Termasuk tipe)', 'Spesifikasi (Termasuk Tipe)', 'Spesifikasi'));
  if (!spesifikasi) {
    // Fallback: Deskripsi Item atau Deskripsi Pekerjaan
    spesifikasi = clean(getVal(r, 'Deskripsi Item', 'Deskripsi Pekerjaan', 'Deskripsi')) || '-';
  }

  // Purpose
  const purpose = clean(getVal(r, 'Purpose'));

  // No EJO
  const noEjo = clean(getVal(r, 'No Ejo', 'No EJO', 'Ejo'));

  // Mesin/Area
  const mesinArea = clean(getVal(r, 'Mesin/Area', 'Mesin'));

  // Merk
  const merk = clean(getVal(r, 'Merk'));

  // Referensi Penawaran
  const referensi = clean(getVal(r, 'Referensi/Penawaran', 'Referensi', 'No PR', 'No PO', 'PR', 'PO'));

  // Status Approval SPV
  const spvRaw = getVal(r, 'Status Approval SPV', 'Status Approval', 'Status');
  const statusApprovalSpv = normalizeSpv(spvRaw);

  // Urgency
  const urgencyRaw = getVal(r, 'Status Urgent', 'Urgency', 'Status');
  const urgency = normalizeUrgency(urgencyRaw);

  // Jenis pengajuan (dari Kategori atau sheet type)
  const kategoriRaw = getVal(r, 'Kategori');
  let jenisPengajuan = normalizeJenis(kategoriRaw);
  // Override jika sheet type Jasa
  if (sheetType === 'Jasa') jenisPengajuan = 'jasa';
  else if (sheetType === 'Re Order' || sheetType === 'Baru') jenisPengajuan = 'sparepart';

  // Status pengadaan (dari Status BQ)
  const statusBqRaw = getVal(r, 'Status BQ');
  const statusPengadaan = normalizeStatusPengadaan(statusBqRaw);

  // Item code (opsional, tidak semua sheet memilikinya)
  const itemCode = clean(getVal(r, 'Item Code', 'Item Number', 'Item')) || null;

  // Email (kolom tambahan, diabaikan)
  // const email = clean(getVal(r, 'Email')); // diabaikan

  // VALIDASI: skip baris jika data critical tidak lengkap
  if (!noReg) return null;
  if (!timestamp) return null; // timestamp wajib (NOT NULL)
  // user_id boleh null (beberapa sumber data tidak punya info user)

  return {
    no_registrasi: noReg,
    user_id: userId,
    item_code: itemCode,
    jenis_pengajuan: jenisPengajuan,
    qty_diminta: qtyDiminta,
    uom: uom,
    spesifikasi_lengkap: spesifikasi,
    purpose: purpose,
    no_ejo: noEjo,
    mesin_area: mesinArea,
    merk: merk,
    referensi_penawaran: referensi,
    urgency: urgency,
    status_approval_spv: statusApprovalSpv,
    status_approval_manager: 'Menunggu', // default, akan diupdate oleh workflow
    status_pengadaan: statusPengadaan,
    timestamp: timestamp,
  };
}

/**
 * Insert/update pengajuan_bq (UPSERT).
 */
async function insertPengajuan(client, data) {
  const SQL = `
    INSERT INTO pengajuan_bq (
      no_registrasi, user_id, item_code, jenis_pengajuan,
      qty_diminta, uom, spesifikasi_lengkap, purpose, no_ejo,
      mesin_area, merk, referensi_penawaran, urgency,
      status_approval_spv, status_approval_manager, status_pengadaan, timestamp
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
    ON CONFLICT (no_registrasi) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      item_code = EXCLUDED.item_code,
      jenis_pengajuan = EXCLUDED.jenis_pengajuan,
      qty_diminta = EXCLUDED.qty_diminta,
      uom = EXCLUDED.uom,
      spesifikasi_lengkap = EXCLUDED.spesifikasi_lengkap,
      purpose = EXCLUDED.purpose,
      no_ejo = EXCLUDED.no_ejo,
      mesin_area = EXCLUDED.mesin_area,
      merk = EXCLUDED.merk,
      referensi_penawaran = EXCLUDED.referensi_penawaran,
      urgency = EXCLUDED.urgency,
      status_approval_spv = EXCLUDED.status_approval_spv,
      status_approval_manager = EXCLUDED.status_approval_manager,
      status_pengadaan = EXCLUDED.status_pengadaan,
      timestamp = EXCLUDED.timestamp
  `;

  const values = [
    data.no_registrasi, data.user_id, data.item_code, data.jenis_pengajuan,
    data.qty_diminta, data.uom, data.spesifikasi_lengkap, data.purpose, data.no_ejo,
    data.mesin_area, data.merk, data.referensi_penawaran, data.urgency,
    data.status_approval_spv, data.status_approval_manager, data.status_pengadaan,
    data.timestamp,
  ];

  await client.query(SQL, values);
}

/**
 * Dari nomor registrasi (mis. "ROSBR0002", "SFHRO0001", "MRNJA0001")
 * ekstrak username pengaju: ambil 3 huruf pertama dari kode registrasi.
 */
function extractUsernameFromNoReg(noReg) {
  const s = String(noReg || '').trim();
  const m = s.match(/^([A-Z]{2,4})\d/i);
  if (!m) return null;
  return m[1].toUpperCase();
}

/**
 * Import dari BQ On Going.xlsx (1 sheet, data ongoing).
 */
async function importPengajuanFromBQOnGoing(client, userMap) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 5: Import Pengajuan BQ dari "BQ On Going.xlsx"');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'BQ On Going.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  const sheetName = Object.keys(wb.Sheets)[0];
  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  console.log(`  Sheet: "${sheetName}" — ${rows.length} baris`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 3 baris pertama:');
    rows.slice(0, 3).forEach((r, i) => {
      console.log(`    ${i + 1}. ${JSON.stringify({
        noReg: clean(r['Nomor Registrasi']),
        requestor: clean(r['Requestor']),
        noBQ: clean(r['No BQ']),
        purpose: clean(r['Purpose']),
        qty: xlToNumber(r['Qty']),
      })}`);
    });
    return rows.length;
  }

  let imported = 0;
  let skipped = 0;

  let prepared = 0;
  const results = await mapLimit(rows, 8, async (r) => {
    // Nomor Registrasi adalah primary key sanding — tanpa itu, baris bukan
    // pengajuan yang sah. Jangan membuat no_registrasi tiruan dari No BQ.
    const noReg = clean(r['Nomor Registrasi']);
    if (!noReg) return { skip: 'no-reg' };

    // User dari kolom Requestor (berisi username pengaju)
    const req = String(r['Requestor'] || '').trim().toUpperCase();
    const userId = req ? userMap.get(req) : null;
    if (!userId) return { skip: 'no-user' }; // user_id wajib

    const data = {
      no_registrasi: noReg,
      user_id: userId,
      item_code: clean(r['Item Code']) || null,
      jenis_pengajuan: normalizeJenis(r['Kategori'] || r['Status'] || 'sparepart'),
      qty_diminta: Math.max(1, Math.floor(xlToNumber(r['Qty']) || 1)),
      uom: clean(r['Uom'] || r['UoM']),
      spesifikasi_lengkap: clean(r['Spesification'] || r['Part Name'] || r['Deskripsi Item']) || '-',
      purpose: clean(r['Purpose']),
      no_ejo: clean(r['No EJO'] || r['No Ejo']),
      mesin_area: clean(r['Machine / Part Number'] || r['Mesin/Area']),
      merk: clean(r['Merk']),
      referensi_penawaran: clean(r['PR'] || r['PO'] || r['Referensi/Penawaran']),
      urgency: normalizeUrgency(r['Status Urgent'] || r['Status'] || 'Normal'),
      status_approval_spv: normalizeSpv(r['Status Approval SPV'] || 'Menunggu'),
      status_approval_manager: 'Menunggu',
      status_pengadaan: normalizeStatusPengadaan(r['Status'] || r['Status BQ']),
      timestamp: toPgTimestamp(xlToDate(r['Tanggal'] || r['Timestamp'])),
    };

    if (!data.timestamp) return { skip: 'no-timestamp' };

    try {
      await insertPengajuan(client, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, err: err.message, noReg };
    }
  });

  for (const res of results) {
    prepared++;
    if (res.ok === true) {
      imported++;
    } else if (res.ok === false) {
      skipped++;
      if (imported + skipped <= 3) {
        console.warn(`    [WARN] ${res.noReg}: ${res.err}`);
      }
    } else {
      skipped++;
    }

    if (prepared % 500 === 0 || prepared === rows.length) {
      console.log(`    ... progres STEP 5: ${prepared}/${rows.length} baris (impor=${imported}, skip=${skipped})`);
    }
  }

  console.log(`  ✅ Berhasil: ${imported}, Dilewati: ${skipped}`);
  return imported;
}

/**
 * Import dari BQ Summary (2).xlsx → sheet "BQ Summary Full Approved".
 */
async function importPengajuanFromBQSummary(client, userMap) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 6: Import Pengajuan BQ dari "BQ Summary (2).xlsx"');
  console.log('  (sheet: BQ Summary Full Approved)');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'BQ Summary (2).xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  const sheetName = BQ_SUMMARY_SHEET;

  if (!wb.Sheets[sheetName]) {
    console.error(`[ERROR] Sheet "${sheetName}" tidak ditemukan.`);
    // Coba daftar semua sheet
    console.log(`  Sheet tersedia: ${wb.SheetNames.join(', ')}`);
    return 0;
  }

  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  ${sheetName}: ${rows.length} baris`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 3 baris pertama:');
    rows.slice(0, 3).forEach((r, i) => {
      console.log(`    ${i + 1}. ${JSON.stringify({
        noBq: clean(r['NO BQ']),
        tanggalRequest: clean(r['Tanggal Request']),
        deskripsi: clean(r['Deskripsi']),
        qty: xlToNumber(r['Qty']),
        statusBq: clean(r['Status BQ']),
        kategori: clean(r['Kategori']),
      })}`);
    });
    return rows.length;
  }

  let imported = 0;
  let skipped = 0;

  let prepared = 0;
  const results = await mapLimit(rows, 8, async (r) => {
    // Mapping khusus untuk BQ Summary
    const noReg = clean(r['NO BQ'] || r['Nomor Registrasi']);
    if (!noReg) return { skip: 'no-reg' };

    const timestampRaw = xlToDate(r['Tanggal Request'] || r['Timestamp']);
    const timestamp = toPgTimestamp(timestampRaw);

    const qtyRaw = xlToNumber(r['Qty']);
    const qtyDiminta = qtyRaw && qtyRaw > 0 ? Math.floor(qtyRaw) : 1;

    // Spesifikasi dari Deskripsi (BQ Summary tidak punya Spesifikasi column)
    const spesifikasi = clean(r['Deskripsi'] || r['Deskripsi Item']) || '-';

    const statusPengadaan = normalizeStatusPengadaan(r['Status BQ'] || r['Status']);
    const jenisPengajuan = normalizeJenis(r['Kategori']);

    // User dari kolom Requestor (berisi username pengaju)
    const req = String(r['Requestor'] || '').trim().toUpperCase();
    const userId = req ? userMap.get(req) : null;

    const data = {
      no_registrasi: noReg,
      user_id: userId, // boleh null; di-skip bila NOT NULL
      item_code: clean(r['Item Code']) || null,
      jenis_pengajuan: jenisPengajuan,
      qty_diminta: qtyDiminta,
      uom: clean(r['UoM'] || r['Uom']),
      spesifikasi_lengkap: spesifikasi,
      purpose: clean(r['Purpose']),
      no_ejo: clean(r['No EJO'] || r['No Ejo']),
      mesin_area: clean(r['Mesin/Area']),
      merk: clean(r['Merk']),
      referensi_penawaran: clean(r['No PR'] || r['No PO'] || r['Referensi/Penawaran']),
      urgency: normalizeUrgency(r['Status Urgent'] || 'Normal'), // tidak ada kolom Status Urgent di BQ Summary
      status_approval_spv: normalizeSpv(r['Status Approval SPV'] || 'Menunggu'),
      status_approval_manager: 'Menunggu',
      status_pengadaan: statusPengadaan,
      timestamp: timestamp,
    };

    // Skip jika data critical kosong
    if (!data.timestamp) return { skip: 'no-timestamp' };

    try {
      await insertPengajuan(client, data);
      return { ok: true };
    } catch (err) {
      return { ok: false, err: err.message, noReg };
    }
  });

  for (const res of results) {
    prepared++;
    if (res.ok === true) {
      imported++;
    } else if (res.ok === false) {
      skipped++;
      if (imported + skipped <= 3) {
        console.warn(`    [WARN] ${res.noReg}: ${res.err}`);
      }
    } else {
      skipped++;
    }

    if (prepared % 500 === 0 || prepared === rows.length) {
      console.log(`    ... progres STEP 6: ${prepared}/${rows.length} baris (impor=${imported}, skip=${skipped})`);
    }
  }

  console.log(`  ✅ Berhasil: ${imported}, Dilewati: ${skipped}`);
  return imported;
}

/**
 * Import dari Database Approval SPV BQ Testing.xlsx.
 */
async function importFromApprovalSPV(client, userMap) {
  console.log('\n' + '='.repeat(70));
  console.log('  STEP 7: Import dari "Database Approval SPV BQ Testing.xlsx"');
  console.log('  (sheet: Gform Aproval SPV BQ Testing)');
  console.log('='.repeat(70));

  const filePath = path.join(DATA_DIR, 'Database Approval SPV BQ Testing.xlsx');
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File tidak ditemukan: ${filePath}`);
    return 0;
  }

  const wb = XLSX.readFile(filePath);
  const sheetName = DB_APPROVAL_SHEET;

  if (!wb.Sheets[sheetName]) {
    console.error(`[ERROR] Sheet "${sheetName}" tidak ditemukan.`);
    return 0;
  }

  const ws = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  console.log(`  ${sheetName}: ${rows.length} baris`);

  if (DRY) {
    console.log('  [DRY RUN] Preview 3 baris pertama:');
    rows.slice(0, 3).forEach((r, i) => {
      console.log(`    ${i + 1}. ${JSON.stringify({
        noReg: clean(r['Nomor Registrasi BQ']),
        status: clean(r['Status Approval']),
        kategori: clean(r['Kategori']),
      })}`);
    });
    return rows.length;
  }

  let imported = 0;
  let skipped = 0;

  // STEP 7 berperan sebagai *enrichment*: cukup update kolom status approval SPV
  // untuk baris yang sudah ada (dari STEP 4-6). Find any approval not in DB → skipped.
  const SQL_UPDATE_SPV = `
    UPDATE pengajuan_bq
    SET status_approval_spv = $2
    WHERE no_registrasi = $1
  `;

  let attempted = 0;
  const results = await mapLimit(rows, 8, async (r) => {
    const noReg = clean(r['Nomor Registrasi BQ']);
    if (!noReg) return { noReg: null, skip: 'no-reg' };

    const spv = normalizeSpv(r['Status Approval']);
    if (!spv) return { noReg, skip: 'no-spv' };

    try {
      const res = await client.query(SQL_UPDATE_SPV, [noReg, spv]);
      return { noReg, rowCount: res.rowCount };
    } catch (err) {
      return { noReg, err: err.message };
    }
  });

  for (const res of results) {
    attempted++;
    if (res.skip || res.rowCount === 0 || res.err) {
      skipped++;
    } else {
      imported++;
    }

    if (attempted % 500 === 0 || attempted === rows.length) {
      console.log(`    ... progres STEP 7: ${attempted}/${rows.length} baris (update=${imported}, skip=${skipped})`);
    }
  }

  console.log(`  ✅ Berhasil: ${imported}, Dilewati: ${skipped}`);
  return imported;
}

// ==================== MAIN ====================

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║  IMPORT RAW DATA — ETL Script                                      ║');
  console.log('║  Sumber: Raw Data CP (Excel)  →  Tujuan: Supabase PostgreSQL        ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════╣');
  console.log('║');

  if (DRY) console.log('║  MODE: DRY RUN (tidak ada perubahan ke database)                   ║');
  if (MODE_SPAREPARTS) console.log('║  MODE: SPAREPARTS only                                            ║');
  if (MODE_BQ) console.log('║  MODE: PENGAJUAN_BQ only                                          ║');
  if (MODE_RESET_SP) console.log('║  MODE: RESET SPAREPARTS (DELETE + RE-IMPORT)                      ║');
  console.log('║');

  console.log('║  Data directory:');
  console.log(`  ║  ${DATA_DIR}`);
  console.log('║');

  if (!fs.existsSync(DATA_DIR)) {
    console.error('║  [FATAL] Data directory tidak ditemukan!');
    console.error('╚═══════════════════════════════════════════════════════════════════════╝');
    process.exit(1);
  }

  const excelFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.xlsx')).sort();
  console.log('║  File Excel ditemukan: ' + excelFiles.length + ' file');
  for (const f of excelFiles) {
    console.log('  ║    📄 ' + f);
  }
  console.log('║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝');

  // ===== CONNECT =====
  console.log('\n[1/6] Menghubungkan ke database...');
  try {
    await pool.query('SELECT 1'); // pastikan koneksi OK tanpa me-leak client
    const versionResult = await pool.query('SELECT version()');
    console.log('  ✅ Terhubung: ' + versionResult.rows[0].version.slice(0, 80));
  } catch (err) {
    console.error('  ❌ [FATAL] Gagal terhubung ke database: ' + err.message);
    process.exit(1);
  }

  // ===== VERIFY TABLES =====
  console.log('\n[2/6] Memverifikasi tabel...');
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN
        ('users', 'spareparts', 'pengajuan_bq', 'pengajuan_log')
      ORDER BY table_name
    `);
    const tables = result.rows.map((r) => r.table_name);
    console.log('  Tabel ditemukan: ' + tables.join(', '));
    const expected = ['spareparts', 'pengajuan_bq'];
    for (const t of expected) {
      if (!tables.includes(t)) {
        console.error(`  ❌ [FATAL] Tabel "${t}" tidak ditemukan!`);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('  ❌ [FATAL] Error memverifikasi tabel: ' + err.message);
    process.exit(1);
  }

  // ===== RESET SPAREPARTS (jika diminta) =====
  if (MODE_RESET_SP) {
    if (DRY) {
      console.log('\n[2.5/6] [DRY] RESET spareparts — (tidak dieksekusi karena DRY)');
    } else {
      console.log('\n[2.5/6] RESET spareparts — menghapus semua data...');
      await pool.query('DELETE FROM spareparts');
      console.log('  ✅ Tabel spareparts dikosongkan');
    }
  }

  // ===== BUILD USER MAP =====
  console.log('\n[3/6] Membangun peta user...');
  const userMap = await buildUserMap(pool);
  console.log(`  ✅ ${userMap.size} pengguna ditemukan: ${Array.from(userMap.keys()).join(', ')}`);

  // ===== IMPORT SPAREPARTS =====
  let spImported = 0;
  if (!MODE_BQ) {
    console.log('\n--- IMPORT SPAREPARTS ---');

    // Step 1: Master data
    spImported = await importSparepartsMaster(pool);

    // Step 2: Critical Part data (update)
    await updateSparepartsFromCritical(pool);

    // Step 3: On Hand data (update)
    await updateSparepartsFromOnHand(pool);

    console.log(`\n  📊 TOTAL spareparts: ${spImported} baris baru diinsert`);
  }

  // ===== IMPORT PENGAJUAN_BQ =====
  let bqImported = 0;
  if (!MODE_SPAREPARTS) {
    console.log('\n--- IMPORT PENGAJUAN_BQ ---');

    // Step 4: Form BQ Testing files
    bqImported = await importPengajuanFromForms(pool, userMap);

    // Step 5: BQ On Going
    const bqOg = await importPengajuanFromBQOnGoing(pool, userMap);
    bqImported += bqOg;

    // Step 6: BQ Summary
    const bqSum = await importPengajuanFromBQSummary(pool, userMap);
    bqImported += bqSum;

    // Step 7: Database Approval SPV
    const dbAppr = await importFromApprovalSPV(pool, userMap);
    bqImported += dbAppr;

    console.log(`\n  📊 TOTAL pengajuan_bq: ${bqImported} baris diinsert`);
  }

  // ===== VERIFICATION =====
  if (DRY) {
    console.log('\n[4/6] [DRY] Verifikasi data — (tidak dieksekusi karena DRY)');
  } else {
    console.log('\n[4/6] Verifikasi data...');
    try {
      const spCount = await pool.query('SELECT COUNT(*) AS total FROM spareparts');
      const bqCount = await pool.query('SELECT COUNT(*) AS total FROM pengajuan_bq');
      const spCritical = await pool.query("SELECT COUNT(*) AS total FROM spareparts WHERE is_critical = true");
      const spByStatus = await pool.query(`
        SELECT status_approval_spv, COUNT(*) AS total
        FROM pengajuan_bq
        GROUP BY status_approval_spv
        ORDER BY status_approval_spv
      `);

      console.log('  📊 spareparts total:    ' + spCount.rows[0].total);
      console.log('  📊 critical parts:      ' + spCritical.rows[0].total);
      console.log('  📊 pengajuan_bq total:  ' + bqCount.rows[0].total);
      console.log('  📊 Status approval SPV breakdown:');
      for (const row of spByStatus.rows) {
        console.log('      ' + row.status_approval_spv + ': ' + row.total);
      }
    } catch (err) {
      console.log('  ⚠ Verifikasi gagal: ' + err.message);
    }
  }

  // ===== CLOSE =====
  console.log('\n[5/6] Menutup koneksi database...');
  await pool.end();

  // ===== SUMMARY =====
  console.log('\n╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║  RINGKASAN IMPORT                                                   ║');
  console.log('╠═══════════════════════════════════════════════════════════════════════╣');
  console.log('║  spareparts:   ' + String(spImported).padEnd(28) + ' ' + (DRY ? '(dry run)' : 'diinsert') + '   ║');
  console.log('║  pengajuan_bq: ' + String(bqImported).padEnd(28) + ' ' + (DRY ? '(dry run)' : 'diinsert') + '   ║');
  console.log('║  Mode:         ' + (DRY ? 'DRY RUN' : 'IMPORT').padEnd(28) + '                            ║');
  if (MODE_SPAREPARTS) console.log('║  Filter:       spareparts only                                         ║');
  if (MODE_BQ) console.log('║  Filter:       pengajuan_bq only                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝');

  if (!DRY) {
    console.log('\n✅ Import selesai! Jalankan ulang jika perlu (idempotent — aman).');
    console.log('   Preview: node scripts/import_raw_data.js --dry');
  } else {
    console.log('\n🔍 Dry run selesai. Tidak ada data yang ditulis ke database.');
    console.log('   Jalankan tanpa --dry untuk mengimpor data.');
  }

  // Paksa exit bersih setelah pool ditutup, agar proses tidak menggantung
  // sambil menunggu handle lain (mis. keep-alive socket dari pool).
  process.exit(0);
}

// ==================== ERROR HANDLING ====================

main().catch((err) => {
  console.error('\n❌ [FATAL] Script gagal: ' + err.message);
  console.error(err.stack);
  process.exit(1);
});
