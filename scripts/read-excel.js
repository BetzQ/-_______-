const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const folder = 'C:\\0000-Universitas_Terbuka\\semester8\\capstoneproject\\App-list\\Micropage E-Sparepart - app - deployed\\CP Kelompok A 127\\Bahan Capstone Project\\Raw Data CP-20260924T053522Z-1-001_v2_baru\\Raw Data CP';

const files = fs.readdirSync(folder).filter(f => f.endsWith('.xlsx')).sort();

const results = [];

for (const file of files) {
  const filePath = path.join(folder, file);
  try {
    const wb = XLSX.readFile(filePath);
    const sheets = [];
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const headerRow = XLSX.utils.sheet_to_json(ws, { header: 1, range: 0, defval: '' });
      const headers = headerRow.length > 0 ? headerRow[0] : [];
      const cleanHeaders = headers.map(h => (h === undefined || h === null) ? '(empty)' : String(h).trim());
      const allData = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const totalRows = allData.length;
      sheets.push({
        sheetName,
        totalDataRows: totalRows,
        headers: cleanHeaders,
      });
    }
    results.push({ file, sheets });
  } catch (e) {
    results.push({ file, error: e.message });
  }
}

console.log(JSON.stringify(results, null, 2));
