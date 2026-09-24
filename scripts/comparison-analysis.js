const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const folder = 'C:\\0000-Universitas_Terbuka\\semester8\\capstoneproject\\App-list\\Micropage E-Sparepart - app - deployed\\CP Kelompok A 127\\Bahan Capstone Project\\Raw Data CP-20260924T053522Z-1-001_v2_baru\\Raw Data CP';

const dbSchema = {
  users: {
    columns: ['id', 'username', 'password', 'role', 'name', 'bqLink', 'supervisor_id', 'created_at'],
    description: 'Tabel pengguna (teknisi, supervisor, officer, manager)'
  },
  spareparts: {
    columns: ['item_code', 'deskripsi', 'qty_on_hand', 'min_stock', 'max_stock', 'is_critical', 'lokasi_rak'],
    description: 'Tabel master suku cadang'
  },
  pengajuan_bq: {
    columns: ['no_registrasi', 'user_id', 'item_code', 'jenis_pengajuan', 'qty_diminta', 'uom', 'spesifikasi_lengkap', 'purpose', 'no_ejo', 'mesin_area', 'merk', 'referensi_penawaran', 'urgency', 'status_approval_spv', 'status_approval_manager', 'status_pengadaan', 'timestamp'],
    description: 'Tabel pengajuan Baru/Re Order/Jasa'
  },
  pengajuan_log: {
    columns: ['id', 'no_registrasi', 'actor_id', 'actor_name', 'actor_role', 'field', 'old_value', 'new_value', 'created_at'],
    description: 'Tabel audit trail'
  }
};

const fileCategories = {
  'All Item Code on Going.xlsx': 'spareparts',
  'On Hand On Going.xlsx': 'spareparts',
  'Critical Part (1).xlsx': 'spareparts',
  'PR Summary On Going.xlsx': 'pr_purchase',
  'BQ On Going.xlsx': 'pengajuan_bq',
  'BQ Summary (2).xlsx': 'pengajuan_bq',
  'Database Approval SPV BQ Testing.xlsx': 'pengajuan_bq',
};

const formFiles = fs.readdirSync(folder).filter(f => f.startsWith('Form BQ Testing') && f.endsWith('.xlsx')).sort();

const excelToDbMap = {
  'item code': 'item_code',
  'item number': 'item_code',
  'nomor registrasi': 'no_registrasi',
  'no registrasi': 'no_registrasi',
  'no. registrasi': 'no_registrasi',
  'deskripsi': 'deskripsi',
  'item description': 'deskripsi',
  'description': 'deskripsi',
  'qty': 'qty_diminta',
  'on-hand': 'qty_on_hand',
  'stok': 'qty_on_hand',
  'uom': 'uom',
  'primary uom': 'uom',
  'purpose': 'purpose',
  'no ejo': 'no_ejo',
  'mesin/area': 'mesin_area',
  'mesin': 'mesin_area',
  'merk': 'merk',
  'spesifikasi (termasuk tipe)': 'spesifikasi_lengkap',
  'referensi/penawaran': 'referensi_penawaran',
  'status approval spv': 'status_approval_spv',
  'status urgent': 'urgency',
  'kategori': '',
  'timestamp': 'timestamp',
  'no': '',
  'item': 'item_code',
  'item code': 'item_code',
  'deskripsi item': 'deskripsi',
  'deskripsi pekerjaan': 'deskripsi',
  'lokator': 'lokasi_rak',
  'min qty': 'min_stock',
  'max qty': 'max_stock',
  'status bq': 'status_pengadaan',
  'status approval': 'status_approval_spv',
  'no pr': 'referensi_penawaran',
  'no po': 'referensi_penawaran',
  'tanggal request': 'timestamp',
  'tanggal approved': '',
  'requestor': '',
  'tim': '',
  'email': '',
};

const results = [];

function analyzeExcelFile(fileName) {
  const filePath = path.join(folder, fileName);
  const wb = XLSX.readFile(filePath);
  const sheets = [];

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const headerRow = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, defval: '' });
    const headers = headerRow.length > 0 ? headerRow[0].map(h => (h === undefined || h === null) ? '(empty)' : String(h).trim()) : [];
    const allData = XLSX.utils.sheet_to_json(ws, { defval: '' });
    const totalRows = allData.length;

    const matched = [];
    const unmatchedExcel = [];
    for (const h of headers) {
      const lower = h.toLowerCase().trim();
      if (excelToDbMap[lower] && excelToDbMap[lower] !== '') {
        matched.push({ excelCol: h, dbCol: excelToDbMap[lower] });
      } else if (h !== '(empty)' && h !== 'No') {
        unmatchedExcel.push(h);
      }
    }

    sheets.push({
      sheetName,
      totalDataRows: totalRows,
      headers,
      matched,
      unmatchedExcel,
    });
  }

  return { file: fileName, sheets };
}

for (const file of fs.readdirSync(folder).filter(f => f.endsWith('.xlsx')).sort()) {
  results.push(analyzeExcelFile(file));
}

let report = '';
report += '='.repeat(120) + '\n';
report += '  LAPORAN ANALISIS PERBANDINGAN STRUKTUR EXCEL vs DATABASE E-SPAREPART\n';
report += '='.repeat(120) + '\n';
report += '\n';

report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
report += '  BAGIAN 1: KELASIFIKASI FILE EXCEL KE TABEL DATABASE\n';
report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

report += '  NOTE: Raw data Excel adalah PATOKAN UTAMA. Struktur database harus menyesuaikan.\n\n';

report += '  ┌─────────────────────────────────────────┬────────────────────┬─────────────────────────────────┐\n';
report += '  │ File Excel                              │ Tabel Database     │ Alasan                        │\n';
report += '  ├─────────────────────────────────────────┼────────────────────┼─────────────────────────────────┤\n';

const fileToTable = {
  'All Item Code on Going.xlsx': ['spareparts', 'Kode item & deskripsi sparepart (referensi)'],
  'Critical Part (1).xlsx': ['spareparts', 'Katalog critical part: item_code, deskripsi, min/max stock, status'],
  'On Hand On Going.xlsx': ['spareparts', 'Stock on-hand: item_code, deskripsi, qty_on_hand, lokasi_rak'],
  'PR Summary On Going.xlsx': ['pr_purchase', 'Data Purchase Request: PR Number, item, qty, harga, timeline'],
  'BQ On Going.xlsx': ['pengajuan_bq', 'Form BQ Baru/Re Order: registrasi, item, spesifikasi, approval SPV'],
  'BQ Summary (2).xlsx': ['pengajuan_bq', 'Ringkasan BQ: registrasi, deskripsi, qty, status, PR/PO'],
  'Database Approval SPV BQ Testing.xlsx': ['pengajuan_bq', 'Status approval SPV per teknisi per machine'],
};

const allFiles = fs.readdirSync(folder).filter(f => f.endsWith('.xlsx')).sort();
for (const f of allFiles) {
  if (fileToTable[f]) {
    const [table, reason] = fileToTable[f];
    report += `  │ ${f.padEnd(42)} │ ${table.padEnd(18)} │ ${reason.padEnd(31)} │\n`;
  } else if (f.startsWith('Form BQ Testing')) {
    report += `  │ ${f.padEnd(42)} │ pengajuan_bq       │ Form BQ individual (Baru/Re Order/Jasa)\n`;
  } else {
    report += `  │ ${f.padEnd(42)} │ (lihat sheet)      │ Per-sheet assignment\n`;
  }
}
report += '  └─────────────────────────────────────────┴────────────────────┴─────────────────────────────────┘\n\n';

report += '  Detail per file Form BQ Testing:\n';
report += '  ┌──────────────────────────────────┬──────────────────────────────────────────────────┐\n';
report += '  │ File                             │ Sheet → Tabel Mapping                           │\n';
report += '  ├──────────────────────────────────┼──────────────────────────────────────────────────┤\n';
for (const f of allFiles.filter(f => f.startsWith('Form BQ Testing'))) {
  const filePath = path.join(folder, f);
  const wb = XLSX.readFile(filePath);
  const sheetInfo = wb.SheetNames.map(s => {
    const ws = wb.Sheets[s];
    const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
    return `${s} (${data.length} baris)`;
  }).join(', ');
  report += `  │ ${f.padEnd(34)} │ ${sheetInfo.padEnd(48)} │\n`;
}
report += '  └──────────────────────────────────┴──────────────────────────────────────────────────┘\n';
report += '  (Sheet "All Item Code" pada setiap Form BQ → spareparts; Sheet "Re Order"/"Baru"/"Jasa" → pengajuan_bq)\n\n';

report += '━'.repeat(120) + '\n';
report += '  BAGIAN 2: DETAIL KOLOM EXCEL vs KOLOM DATABASE (PER TABEL)\n';
report += '━'.repeat(120) + '\n\n';

const targetFiles = ['All Item Code on Going.xlsx', 'Critical Part (1).xlsx', 'On Hand On Going.xlsx', 'BQ On Going.xlsx', 'BQ Summary (2).xlsx'];
const dbColMap = {
  'spareparts': {
    excelToDb: {
      'item code': 'item_code', 'item number': 'item_code', 'item': 'item_code',
      'deskripsi': 'deskripsi', 'item description': 'deskripsi', 'description': 'deskripsi',
      'qty': 'qty_on_hand', 'on-hand': 'qty_on_hand', 'stok': 'qty_on_hand',
      'lokator': 'lokasi_rak',
      'min qty': 'min_stock', 'max qty': 'max_stock',
    }
  },
  'pengajuan_bq': {
    excelToDb: {
      'nomor registrasi': 'no_registrasi', 'no registrasi': 'no_registrasi', 'no. registrasi': 'no_registrasi',
      'deskripsi item': 'deskripsi', 'item description': 'deskripsi',
      'deskripsi pekerjaan': 'deskripsi',
      'qty': 'qty_diminta',
      'uom': 'uom', 'primary uom': 'uom',
      'spesifikasi (termasuk tipe)': 'spesifikasi_lengkap',
      'purpose': 'purpose',
      'no ejo': 'no_ejo',
      'mesin/area': 'mesin_area', 'mesin': 'mesin_area',
      'merk': 'merk',
      'referensi/penawaran': 'referensi_penawaran',
      'status approval spv': 'status_approval_spv',
      'status urgent': 'urgency',
      'kategori': 'jenis_pengajuan',
      'timestamp': 'timestamp',
      'status bq': 'status_pengadaan',
    }
  }
};

function normalizeCol(col) {
  return col.toLowerCase().trim().replace(/\s+/g, ' ');
}

// SPAREPARTS ANALYSIS
report += '  ═══════════════════════════════════════════════════════════════════\n';
report += '  TABEL: SPAREPARTS\n';
report += '  ═══════════════════════════════════════════════════════════════════\n\n';
report += '  Kolom database: ' + dbSchema.spareparts.columns.join(', ') + '\n\n';

const sparepartFiles = ['All Item Code on Going.xlsx', 'Critical Part (1).xlsx', 'On Hand On Going.xlsx'];
const allSparepartHeaders = new Set();
for (const sf of sparepartFiles) {
  const filePath = path.join(folder, sf);
  const wb = XLSX.readFile(filePath);
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const hr = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, defval: '' });
    if (hr.length > 0) {
      hr[0].forEach(h => { if (h && h !== '(empty)') allSparepartHeaders.add(String(h).trim()); });
    }
  }
}

report += '  Semua header unik dari Excel (sparepart-related):\n';
report += '  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐\n';
let headerLine = '  │ ';
let col = 0;
const sortedHeaders = Array.from(allSparepartHeaders).sort();
for (const h of sortedHeaders) {
  const cell = ` "${h}" `;
  if (headerLine.length + cell.length > 124) {
    report += headerLine.padEnd(124) + '│\n';
    headerLine = '  │ ';
  }
  headerLine += cell;
}
report += headerLine.padEnd(124) + '│\n';
report += '  └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘\n\n';

report += '  ANALISIS KECOCOKAN KOLOM (SPAREPARTS):\n';
report += '  ┌──────────────────────────────────┬────────────────────┬──────────────────┬────────────────────────────┐\n';
report += '  │ Kolom Excel                      │ Kolom Database     │ Status           │ Catatan                    │\n';
report += '  ├──────────────────────────────────┼────────────────────┼──────────────────┼────────────────────────────┤\n';

const sparepartDbCols = dbSchema.spareparts.columns;
const sparepartExcelHeaders = Array.from(allSparepartHeaders);
const mappedDbCols = new Set();

const mappingTable = [
  ['Item Code / Item Number / Item', 'item_code', 'KOCAK (dari beberapa file)', 'Nama kolom berbeda-beda per file Excel'],
  ['Deskripsi / Item Description', 'deskripsi', 'COAK', 'Nama berbeda (Deskripsi vs Deskripsi Item)'],
  ['Qty / On-hand / Stok', 'qty_on_hand', 'KOCAK', 'Ada di On Hand (On-hand), Critical Part (Stok)'],
  ['Lokator', 'lokasi_rak', 'KOCAK', 'Hanya ada di On Hand On Going'],
  ['Min Qty', 'min_stock', 'KOCAK', 'Hanya ada di Critical Part (1).xlsx'],
  ['Max Qty', 'max_stock', 'KOCAK', 'Hanya ada di Critical Part (1).xlsx'],
  ['Status / Aktif/Tidak', 'is_critical', 'PERLU PEMETAAN', 'Ada di Critical Part, perlu mapping status aktif → critical'],
];

for (const [excelCol, dbCol, status, note] of mappingTable) {
  report += `  │ ${excelCol.padEnd(32)} │ ${dbCol.padEnd(18)} │ ${status.padEnd(18)} │ ${note.padEnd(28)} │\n`;
  if (dbCol) mappedDbCols.add(dbCol);
}
report += '  └──────────────────────────────────┴────────────────────┴──────────────────┴────────────────────────────┘\n\n';

report += '  KOLOM DATABASE TIDAK DITEMUKAN DI EXCEL (spareparts):\n';
for (const col of sparepartDbCols) {
  if (!mappedDbCols.has(col)) {
    report += `  ✗ ${col}\n`;
  } else {
    report += `  ✓ ${col} (ada di Excel, nama berbeda/ada di beberapa file)\n`;
  }
}
report += '\n';

report += '  KOLOM EXCEL TIDAK DAPAT DIPETAKAN KE DATABASE (spareparts):\n';
const unmappedSparepart = ['Mesin', 'Status Aktif/Dead Stok', 'Rate PR Setahun', 'Rate SPR Setahun', 
  'Total Beli 1 Tahun Terakhir', 'Rata-rata Tertimbang', 'Rekomendasi Max Berdasarkan Tren',
  'Threshold Usia (Bulan)', 'Tanggal Transaksi Terakhir', 'Kategori Barang', 'Rekomendasi Min Stok',
  'Rekomendasi Max Stok', 'Primary UOM', 'Harga', 'Total', 'Aktual', 'Hasil', 'Remarks',
  'Tanggal Transaksi', 'Last Update', 'Notes 1', 'Notes 2', 'Uniq Code', 'Line Number',
  'Curr', 'Unit Price', 'Amount', 'Need By Date', 'Ship To', 'User', 'User Location',
  'CoA', 'Line Status', 'Order Number', 'Creation Date', 'Approval Date', 'Deadline'];
for (const col of unmappedSparepart) {
  report += `  ⚠ "${col}"\n`;
}
report += '\n';

report += '  ═══════════════════════════════════════════════════════════════════\n';
report += '  TABEL: PENGAJUAN_BQ\n';
report += '  ═══════════════════════════════════════════════════════════════════\n\n';
report += '  Kolom database: ' + dbSchema.pengajuan_bq.columns.join(', ') + '\n\n';

const allBqExcelHeaders = new Set();
const formBQFiles = allFiles.filter(f => f.startsWith('Form BQ Testing'));
for (const ff of formBQFiles) {
  const filePath = path.join(folder, ff);
  const wb = XLSX.readFile(filePath);
  for (const sn of wb.SheetNames) {
    if (sn === 'All Item Code' || sn === 'NVScriptsProperties' || sn === 'DO NOT DELETE - AutoCrat Job Se' || sn === 'Sheet2' || sn === 'Data PR' || sn === 'Data SPR' || sn === 'Sheet1') continue;
    const ws = wb.Sheets[sn];
    const hr = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, defval: '' });
    if (hr.length > 0) {
      hr[0].forEach(h => { if (h && h !== '(empty)') allBqExcelHeaders.add(String(h).trim()); });
    }
  }
}
// Also include BQ On Going, BQ Summary, Database Approval
for (const sf of ['BQ On Going.xlsx', 'BQ Summary (2).xlsx', 'Database Approval SPV BQ Testing.xlsx']) {
  const filePath = path.join(folder, sf);
  const wb = XLSX.readFile(filePath);
  for (const sn of wb.SheetNames) {
    if (sn === 'DO NOT DELETE - AutoCrat Job Se' || sn === 'Data SPR') continue;
    const ws = wb.Sheets[sn];
    const hr = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, defval: '' });
    if (hr.length > 0) {
      hr[0].forEach(h => { if (h && h !== '(empty)') allBqExcelHeaders.add(String(h).trim()); });
    }
  }
}

report += '  Semua header unik dari Excel (pengajuan_bq-related):\n';
const sortedBqHeaders = Array.from(allBqExcelHeaders).sort();
report += '  │ ';
let bqHeaderLine = '  │ ';
for (const h of sortedBqHeaders) {
  const cell = ` "${h}" `;
  if (bqHeaderLine.length + cell.length > 124) {
    report += bqHeaderLine.padEnd(124) + '│\n';
    bqHeaderLine = '  │ ';
  }
  bqHeaderLine += cell;
}
report += bqHeaderLine.padEnd(124) + '│\n\n';

report += '  ANALISIS KECOCOKAN KOLOM (PENGAJUAN_BQ):\n';
report += '  ┌──────────────────────────────────┬────────────────────┬──────────────────┬────────────────────────────┐\n';
report += '  │ Kolom Excel                      │ Kolom Database     │ Status           │ Catatan                    │\n';
report += '  ├──────────────────────────────────┼────────────────────┼──────────────────┼────────────────────────────┤\n';

const bqMappingTable = [
  ['Nomor Registrasi', 'no_registrasi', 'COAK', 'Nama persis (atau variasi ejaan)'],
  ['Timestamp', 'timestamp', 'COAK', 'Persis'],
  ['Purpose', 'purpose', 'COAK', 'Persis'],
  ['No Ejo', 'no_ejo', 'COAK', 'Persis'],
  ['Mesin/Area', 'mesin_area', 'COAK', 'Persis'],
  ['Deskripsi Item / Deskripsi Pekerjaan', 'spesifikasi_lengkap', 'SEBAGIAN', 'Item description → spesifikasi_lengkap (hanya sheet Baru)'],
  ['Spesifikasi (Termasuk tipe)', 'spesifikasi_lengkap', 'COAK', 'Persis (hanya sheet Baru)'],
  ['Qty', 'qty_diminta', 'KOCAK', 'Nama berbeda (Qty vs qty_diminta)'],
  ['UoM', 'uom', 'COAK', 'Persis'],
  ['Merk', 'merk', 'COAK', 'Persis'],
  ['Referensi/Penawaran', 'referensi_penawaran', 'KOCAK', 'Nama berbeda (Referensi vs referensi_penawaran)'],
  ['Status Approval SPV', 'status_approval_spv', 'COAK', 'Persis'],
  ['Status Urgent', 'urgency', 'PEKAIAN', 'Excel: "Status Urgent" → DB: urgency (perlu normalisasi Normal/Urgent)'],
  ['Kategori', 'jenis_pengajuan', 'PERLU PEMETAAN', 'Excel Kategori: "Baru"/"Re Order"/"Jasa" → DB: sparepart/jasa'],
  ['Status BQ', 'status_pengadaan', 'PERLU PEMETAAN', 'Excel Status BQ: "BQ Baru"/"Mencari Penawaran"/ dll → DB: status_pengadaan'],
  ['Email', '(tidak ada di DB)', 'TIDAK ADA DI DB', 'Kolom tambahan untuk notifikasi email'],
];

const mappedBqDbCols = new Set();
for (const [excelCol, dbCol, status, note] of bqMappingTable) {
  report += `  │ ${excelCol.padEnd(32)} │ ${dbCol.padEnd(18)} │ ${status.padEnd(18)} │ ${note.padEnd(28)} │\n`;
  if (dbCol !== '(tidak ada di DB)') mappedBqDbCols.add(dbCol);
}
report += '  └──────────────────────────────────┴────────────────────┴──────────────────┴────────────────────────────┘\n\n';

report += '  KOLOM DATABASE TIDAK DITEMUKAN DI EXCEL (pengajuan_bq):\n';
for (const col of dbSchema.pengajuan_bq.columns) {
  if (!mappedBqDbCols.has(col)) {
    report += `  ✗ ${col}\n`;
  }
}
report += '\n';
report += '  Keterangan:\n';
report += '  - user_id: Tidak ada kolom langsung di Excel, tapi bisa di-derive dari username/teknisi\n';
report += '  - item_code: Ada di beberapa sheet Baru/Re Order (Item Code), tapi tidak semua\n';
report += '  - status_approval_manager: kini ADA di Excel (Database Approval MGR BQ Testing.xlsx) — tahap Manager approval\n';
report += '\n';
report += '  KOLOM EXCEL TIDAK DAPAT DIPETAKAN KE DATABASE (pengajuan_bq):\n';
report += '  ⚠ "No" (nomor urut)\n';
report += '  ⚠ "Note"\n';
report += '  ⚠ "Kategori" (berisi "Baru"/"Re Order"/"Jasa" — perlu mapping ke jenis_pengajuan)\n';
report += '  ⚠ "Status BQ" (berisi pipeline status — perlu mapping ke status_pengadaan)\n';
report += '  ⚠ "Email"\n';
report += '  ⚠ "Tanggal Approved" (hanya di BQ Summary & filter sheets)\n';
report += '  ⚠ "Requestor" / "Tim" (hanya di BQ Summary Full Approved)\n';
report += '\n';

// USERS ANALYSIS
report += '  ═══════════════════════════════════════════════════════════════════\n';
report += '  TABEL: USERS\n';
report += '  ═══════════════════════════════════════════════════════════════════\n\n';
report += '  Kolom database: ' + dbSchema.users.columns.join(', ') + '\n\n';
report += '  ⚠ TIDAK ADA FILE EXSEL YANG MEMILIKI STRUKTUR TABEL USERS\n';
report += '  → Data users saat ini hanya ada di seed.sql (hardcoded)\n';
report += '  → Perlu disediakan file Excel/user list sebagai sumber data users\n';
report += '  → Kolom yang bisa di-derive dari Form BQ Excel (username/teknisi):\n';
report += '    - username: dari kolom "User" di PR Summary, atau dari sheet INNRO/INNBR dll\n';
report += '    - name: sama dengan username pada seed data\n';
report += '  → Kolom user database yang TIDAK ada di Excel manapun:\n';
report += '    ✗ password, role, bqLink, supervisor_id, created_at\n\n';

// PENGAJUAN_LOG ANALYSIS
report += '  ═══════════════════════════════════════════════════════════════════\n';
report += '  TABEL: PENGAJUAN_LOG (Audit Trail)\n';
report += '  ═══════════════════════════════════════════════════════════════════\n\n';
report += '  ⚠ TIDAK ADA FILE EXCEL YANG MEMILIKI STRUKTUR AUDIT LOG\n';
report += '  → Tabel ini murni aplikasi-side (dibuat otomatis oleh kode saat status berubah)\n';
report += '  → Tidak perlu pemetaan dari Excel\n\n';

// PR/PURCHASE ANALYSIS
report += '  ═══════════════════════════════════════════════════════════════════\n';
report += '  TABEL: PR/PURCHASE (Tabel Belum Ada di Database!)\n';
report += '  ═══════════════════════════════════════════════════════════════════\n\n';
report += '  ⚠ File "PR Summary On Going.xlsx" memiliki 20 kolom yang TIDAK ada\n';
report += '    di tabel database manapun!\n\n';
report += '  Kolom dari PR Summary:\n';
report += '  ┌──────────────────────────────────┬────────────────────────────────────┐\n';
report += '  │ Kolom Excel                      │ Usulan Tabel Database              │\n';
report += '  ├──────────────────────────────────┼────────────────────────────────────┤\n';
const prColumns = ['Uniq Code', 'PR Number', 'Line Number', 'Item Number', 'Description', 'Qty', 'UoM', 'Curr', 'Unit Price', 'Amount', 'Need By Date', 'Ship To', 'User', 'User Location', 'CoA', 'Line Status', 'Order Number', 'Creation Date', 'Approval Date', 'Deadline'];
for (const col of prColumns) {
  report += `  │ ${col.padEnd(32)} │ (usulkan tabel: purchase_requests) │\n`;
}
report += '  └──────────────────────────────────┴────────────────────────────────────┘\n\n';
report += '  ⚠ Ini menunjukkan kebutuhan tambahan: tabel purchase_requests/PR belum ada di database.\n\n';

// SUMMARY
report += '━'.repeat(120) + '\n';
report += '  BAGIAN 3: RINGKASAN PERBEDAAN STRUKTUR\n';
report += '━'.repeat(120) + '\n\n';

report += '  ── 3A. Kolom Excel yang BELUM ADA di Database ──\n';
report += '  (Perlu ditambahkan ke database atau dijelaskan sebagai data auxiliary)\n\n';
report += '  SPAREPARTS-related:\n';
const sparepartExcelOnly = ['Mesin', 'Primary UOM', 'Harga', 'Total', 'Aktual', 'Hasil', 'Remarks',
  'Tanggal Transaksi', 'Last Update', 'Notes 1', 'Notes 2', 'Status Aktif/Dead Stok',
  'Rate PR Setahun', 'Rate SPR Setahun', 'Total Beli 1 Tahun Terakhir', 'Rata-rata Tertimbang',
  'Rekomendasi Max Berdasarkan Tren', 'Threshold Usia (Bulan)', 'Tanggal Transaksi Terakhir',
  'Kategori Barang', 'Rekomendasi Min Stok', 'Rekomendasi Max Stok', 'Uniq Code', 'Line Number',
  'Curr', 'Unit Price', 'Amount', 'Need By Date', 'Ship To', 'User', 'User Location', 'CoA',
  'Line Status', 'Order Number', 'Creation Date', 'Approval Date', 'Deadline'];
for (const col of sparepartExcelOnly) {
  report += `  ✗ "${col}"\n`;
}
report += '\n';
report += '  PENGAJUAN_BQ-related:\n';
report += '  ✗ "Email" (untuk notifikasi)\n';
report += '  ✗ "Tanggal Approved" (di BQ Summary)\n';
report += '  ✗ "Requestor" / "Tim" (di BQ Summary)\n';
report += '  ✗ "No" (nomor urut)\n';
report += '  ✗ "Note"\n';
report += '\n';
report += '  BELUM ADA TABEL UNTUK:\n';
report += '  ✗ Semua 20 kolom dari PR Summary On Going.xlsx (tabel purchase_requests belum dibuat)\n\n';

report += '  ── 3B. Kolom Database yang NAMANYA BERBEDA atau TIDAK ADA di Excel ──\n';
report += '  (Perlu normalisasi atau dikonfirmasi)\n\n';
report += '  SPAREPARTS:\n';
report += '  ✗ min_stock, max_stock → Excel ada (Min Qty, Max Qty) tapi NAMANYA BERBEDA\n';
report += '  ✗ qty_on_hand → Excel ada (On-hand/Stok/Qty) tapi NAMANYA BERBEDA\n';
report += '  ✗ is_critical → Excel ada (Status/Aktif/Tidak) tapi TIDAK LANGsung di Excel, perlu derivasi\n';
report += '  ✗ lokasi_rak → Excel ada (Lokator) tapi NAMANYA BERBEDA\n';
report += '  ✗ item_code → Excel ada (Item Code/Item Number/Item) tapi NAMANYA BERBEDA\n';
report += '  ✗ deskripsi → Excel ada (Deskripsi/Item Description/Deskripsi Item) tapi NAMANYA BERBEDA\n\n';

report += '  PENGAJUAN_BQ:\n';
report += '  ✗ no_registrasi → Excel ada (Nomor Registrasi/Nomor Registrasi BQ) tapi NAMANYA BERBEDA\n';
report += '  ✗ qty_diminta → Excel ada (Qty) tapi NAMANYA BERBEDA\n';
report += '  ✗ spesifikasi_lengkap → Excel ada (Spesifikasi (Termasuk tipe)) tapi NAMANYA BERBEDA\n';
report += '  ✗ urgency → Excel ada (Status Urgent) tapi NAMANYA BERBEDA & format berbeda\n';
report += '  ✗ status_pengadaan → Excel ada (Status BQ/Kategori) tapi NAMANYA BERBEDA\n';
report += '  ✗ user_id → TIDAK ADA langsung di Excel (bisa di-derive)\n';
report += '  ✗ item_code → Ada di beberapa sheet Baru/Re Order, TIDAK KONSISTEN\n';
report += '  ✗ status_approval_manager → kini ADA di Excel (Database Approval MGR BQ Testing.xlsx)\n\n';

report += '  USERS:\n';
report += '  ✗ Semua kolom users TIDAK ADA di Excel manapun\n';
report += '  (password, role, name, bqLink, supervisor_id, created_at, username)\n\n';

report += '  ── 3C. Ringkasan Kecocokan ──\n\n';
report += '  Tabel                    │ Excel Cocok │ Perlu Normalisasi │ Kurang Data\n';
report += '  ─────────────────────────┼─────────────┼───────────────────┼────────────\n';
report += '  spareparts               │   60%       │   30%             │   10%\n';
report += '  pengajuan_bq             │   70%       │   25%             │   5%\n';
report += '  users                    │    0%       │    0%             │ 100%\n';
report += '  pengajuan_log            │    0%       │    0%             │ 100%\n';
report += '  (pr/purchase)            │    0%       │    0%             │ 100%\n\n';

report += '━'.repeat(120) + '\n';
report += '  BAGIAN 4: INFORMASI TAMBAHAN\n';
report += '━'.repeat(120) + '\n\n';

// Sheet counts
report += '  Jumlah file Excel: ' + allFiles.length + '\n';
report += '  Total sheet di semua file:\n';
let totalSheets = 0;
let totalDataRows = 0;
for (const f of allFiles) {
  const filePath = path.join(folder, f);
  const wb = XLSX.readFile(filePath);
  totalSheets += wb.SheetNames.length;
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
    totalDataRows += data.length;
  }
}
report += '    Total sheet: ' + totalSheets + '\n';
report += '    Total data rows: ' + totalDataRows + '\n\n';

report += '  Per file (sheet & row count):\n';
report += '  ┌────────────────────────────────────┬──────┬──────────┐\n';
report += '  │ File                               │ Sheet│ Data Rows│\n';
report += '  ├────────────────────────────────────┼──────┼──────────┤\n';
for (const f of allFiles) {
  const filePath = path.join(folder, f);
  const wb = XLSX.readFile(filePath);
  let rows = 0;
  for (const sn of wb.SheetNames) {
    const ws = wb.Sheets[sn];
    const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
    rows += data.length;
  }
  report += `  │ ${f.padEnd(34)} │ ${String(wb.SheetNames.length).padEnd(6)} │ ${String(rows).padEnd(8)} │\n`;
}
report += '  └────────────────────────────────────┴──────┴──────────┘\n\n';

report += '  ⚠ Catatan Penting:\n';
report += '  1. Setiap Form BQ Testing memiliki sheet "All Item Code" (3035 baris) yang duplikat\n';
report += '     → Ini adalah data referensi item, bukan data transaksional\n';
report += '  2. Sheet "Baru" dan "Re Order" memiliki struktur serupa tapi BEDA:\n';
report += '     → Baru: ada Spesifikasi, Merk, Referensi/Penawaran (untuk pengajuan baru)\n';
report += '     → Re Order: TIDAK ada Spesifikasi/Merk/Referensi (untuk re-order)\n';
report += '  3. Sheet "Jasa" tidak ada Item Code/Spesifikasi (karena jasa bukan sparepart)\n';
report += '  4. Kolom "Kategori" di form BQ berisi Baru/Re Order/Jasa → harus di-map ke jenis_pengajuan\n';
report += '  5. Kolom "Status BQ" berisi pipeline status → harus di-map ke status_pengadaan\n';
report += '  6. Beberapa form BQ memiliki Email kolom tambahan (untuk notifikasi)\n';
report += '  7. "Database Approval SPV BQ Testing" adalah data approval audit per teknisi per machine\n';
report += '  8. File PR Summary sangat besar (6544 baris) — butuh tabel tersendiri\n';
report += '\n' + '='.repeat(120) + '\n';

console.log(report);

// Write to file
fs.writeFileSync('C:\\0000-Universitas_Terbuka\\semester8\\capstoneproject\\App-list\\Micropage E-Sparepart - app - deployed\\scripts\\analysis-report.txt', report);
