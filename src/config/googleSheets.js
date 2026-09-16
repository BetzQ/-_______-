const path = require('path');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getGoogleLib() {
  return require('googleapis').google;
}

function getCredentialsPath() {
  return path.resolve(
    process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, '..', '..', 'credentials.json')
  );
}

// Baca kredensial Service Account. Prioritas: Environment Variable (Vercel),
// fallback: file credentials.json (lokal). Mengembalikan null jika keduanya tidak tersedia.
function getCredentials() {
  if (process.env.GOOGLE_CREDENTIALS) {
    try {
      return JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } catch (err) {
      console.warn('[googleSheets] GOOGLE_CREDENTIALS tidak valid, fallback ke file lokal:', err.message);
    }
  }

  const filePath = getCredentialsPath();
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.warn('[googleSheets] Gagal membaca credentials.json:', err.message);
    }
  }

  return null;
}

function isCloudConfigured() {
  return Boolean(process.env.MASTER_SPREADSHEET_ID) && Boolean(getCredentials());
}

function getAuth() {
  const google = getGoogleLib();
  const credentials = getCredentials();
  if (credentials) {
    return new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
  }
  return new google.auth.GoogleAuth({ keyFile: getCredentialsPath(), scopes: SCOPES });
}

async function getSheetsClient() {
  const google = getGoogleLib();
  const auth = getAuth();
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

module.exports = {
  getAuth,
  getSheetsClient,
  getCredentials,
  getCredentialsPath,
  isCloudConfigured,
  SCOPES,
};