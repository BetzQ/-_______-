const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const { getSheetsClient, isCloudConfigured } = require('../config/googleSheets');

const DEFAULT_LOCAL_FILE = path.join(
  __dirname,
  '..',
  '..',
  'Salinan_Spreadsheet_Sparepart',
  'Master DB_User.xlsx'
);

function normalize(value) {
  return String(value == null ? '' : value).trim().toLowerCase();
}

function resolveColumnIndex(headers, aliases) {
  const normalized = headers.map(normalize);
  for (const alias of aliases) {
    const idx = normalized.indexOf(alias);
    if (idx !== -1) return idx;
  }
  return -1;
}

function mapRowsToUsers(rows) {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const colUsername = resolveColumnIndex(headers, ['username', 'user', 'namauser']);
  const colPassword = resolveColumnIndex(headers, ['password', 'pass', 'katasandi', 'sandi']);
  const colRole = resolveColumnIndex(headers, ['role', 'peran', 'hakakses', 'hak akses']);
  const colName = resolveColumnIndex(headers, ['name', 'nama', 'namalengkap', 'fullname']);
  const colBqLink = resolveColumnIndex(headers, ['bqlink', 'bq_link', 'bq-link', 'link']);

  if (colUsername === -1 || colPassword === -1) {
    throw new Error(
      'Struktur sheet Master DB tidak valid: kolom "username" dan/atau "password" tidak ditemukan.'
    );
  }

  return rows.slice(1).map((row) => ({
    username: String(row[colUsername] == null ? '' : row[colUsername]),
    password: String(row[colPassword] == null ? '' : row[colPassword]),
    role: colRole !== -1 ? String(row[colRole] == null ? '' : row[colRole]) : '',
    name: colName !== -1 ? String(row[colName] == null ? '' : row[colName]) : '',
    bqLink: colBqLink !== -1 ? String(row[colBqLink] == null ? '' : row[colBqLink]) : '',
  }));
}

async function readRowsFromCloud() {
  const sheets = await getSheetsClient();
  const sheetName = process.env.MASTER_DB_SHEET_NAME || 'Users';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.MASTER_SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
  });
  return response.data.values || [];
}

function readRowsFromLocal(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = process.env.MASTER_DB_SHEET_NAME || 'Users';
  const worksheet = workbook.Sheets[sheetName] || workbook.Sheets[workbook.SheetNames[0]];
  if (!worksheet) return [];
  return XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: '' });
}

async function loadUserRows() {
  const localFile = process.env.MASTER_DB_LOCAL_FILE
    ? path.resolve(process.env.MASTER_DB_LOCAL_FILE)
    : DEFAULT_LOCAL_FILE;

  if (isCloudConfigured()) {
    try {
      return await readRowsFromCloud();
    } catch (error) {
      console.warn('[Auth] Gagal mengakses Google Sheets cloud, fallback ke file lokal:', error.message);
      if (fs.existsSync(localFile)) return readRowsFromLocal(localFile);
      throw error;
    }
  }

  if (fs.existsSync(localFile)) return readRowsFromLocal(localFile);
  throw new Error(
    'Sumber data Master DB tidak tersedia. Siapkan credentials.json + MASTER_SPREADSHEET_ID (cloud) atau file Master DB_User.xlsx pada folder Salinan_Spreadsheet_Sparepart (lokal).'
  );
}

async function verifyLogin(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter username dan password wajib diisi',
    });
  }

  try {
    const rows = await loadUserRows();
    const users = mapRowsToUsers(rows);

    const found = users.find(
      (user) => normalize(user.username) === normalize(username) && user.password === String(password)
    );

    if (!found) {
      return res.status(401).json({
        status: 'error',
        message: 'Kombinasi Username atau Password salah',
      });
    }

    const profile = {
      username: found.username,
      role: found.role,
      name: found.name,
      bqLink: found.bqLink,
    };

    return res.status(200).json({
      status: 'ok',
      message: 'Login berhasil',
      data: profile,
    });
  } catch (error) {
    console.error('[Auth Error]', error.message);
    const isDev = process.env.NODE_ENV !== 'production';
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membaca data pengguna dari spreadsheet',
      ...(isDev && { detail: error.message }),
    });
  }
}

module.exports = { verifyLogin };