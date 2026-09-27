const pool = require('../config/database');

/**
 * Modul Catatan Anggota (halaman /catatan-anggota.html)
 * Status checklist disimpan di database Supabase dan setiap
 * perubahan tercatat di tabel catatan_log (nama + tanggal + jam).
 */

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS catatan_checks (
  id          SERIAL PRIMARY KEY,
  member_id   VARCHAR(50)  NOT NULL,
  member_name VARCHAR(100),
  check_key   VARCHAR(255) NOT NULL,
  label       TEXT,
  checked     BOOLEAN      NOT NULL DEFAULT FALSE,
  updated_by  VARCHAR(100),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_catatan_checks ON catatan_checks (member_id, check_key);
CREATE INDEX IF NOT EXISTS idx_catatan_checks_member ON catatan_checks (member_id);

CREATE TABLE IF NOT EXISTS catatan_log (
  id          SERIAL PRIMARY KEY,
  member_id   VARCHAR(50)  NOT NULL,
  member_name VARCHAR(100),
  check_key   VARCHAR(255),
  label       TEXT,
  action      VARCHAR(20)  NOT NULL DEFAULT 'centang'
                           CHECK (action IN ('centang', 'batal', 'reset')),
  actor_name  VARCHAR(100) NOT NULL DEFAULT 'Tanpa nama',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_catatan_log_created ON catatan_log (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_catatan_log_member ON catatan_log (member_id);
`;

// Tabel dibuat otomatis sekali per proses supaya endpoint langsung siap
// dipakai tanpa menjalankan SQL terpisah (aman untuk Vercel).
let tablesReady = null;
function ensureTables() {
  if (!tablesReady) {
    tablesReady = pool.query(TABLE_SQL).catch((err) => {
      tablesReady = null; // biarkan request berikutnya mencoba lagi
      throw err;
    });
  }
  return tablesReady;
}

function writeLog(member_id, member_name, check_key, label, action, actor_name) {
  return pool.query(
    `INSERT INTO catatan_log (member_id, member_name, check_key, label, action, actor_name)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [member_id, member_name || null, check_key || null, label || null, action, actor_name || 'Tanpa nama']
  );
}

/**
 * GET /api/catatan/checks
 * Seluruh status checklist (lintas anggota) untuk sinkronisasi halaman.
 */
async function getCatatanChecks(req, res) {
  try {
    await ensureTables();
    const { rows } = await pool.query(
      `SELECT member_id, member_name, check_key, label, checked, updated_by, updated_at
         FROM catatan_checks
        ORDER BY updated_at ASC`
    );
    return res.status(200).json({ status: 'ok', count: rows.length, data: rows });
  } catch (error) {
    console.error('[Catatan Checks Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memuat status checklist',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * POST /api/catatan/check
 * Simpan status satu item checklist (upsert) + catat ke log.
 * Body: { member_id, member_name, check_key, label, checked, actor_name }
 */
async function saveCatatanCheck(req, res) {
  const {
    member_id, member_name, check_key, label, checked, actor_name,
  } = req.body || {};

  if (!member_id || !check_key) {
    return res.status(400).json({
      status: 'error',
      message: 'member_id dan check_key wajib diisi',
    });
  }

  const checkedVal = checked === true || checked === 'true';
  const action = checkedVal ? 'centang' : 'batal';

  try {
    await ensureTables();
    await pool.query(
      `INSERT INTO catatan_checks (member_id, member_name, check_key, label, checked, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (member_id, check_key)
       DO UPDATE SET member_name = EXCLUDED.member_name,
                     label       = EXCLUDED.label,
                     checked     = EXCLUDED.checked,
                     updated_by  = EXCLUDED.updated_by,
                     updated_at  = CURRENT_TIMESTAMP`,
      [member_id, member_name || null, check_key, label || null, checkedVal, actor_name || 'Tanpa nama']
    );

    // Log kegagalan tidak boleh membatalkan penyimpanan status.
    try {
      await writeLog(member_id, member_name, check_key, label, action, actor_name);
    } catch (logErr) {
      console.error('[Catatan Log Warning]', logErr.message);
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Status checklist tersimpan',
      data: { member_id, check_key, checked: checkedVal, action },
    });
  } catch (error) {
    console.error('[Catatan Save Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan status checklist',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * POST /api/catatan/reset
 * Hapus semua override centang milik satu anggota (kembali ke default
 * "terverifikasi") + catat aksi reset ke log.
 * Body: { member_id, member_name, actor_name }
 */
async function resetCatatanChecks(req, res) {
  const { member_id, member_name, actor_name } = req.body || {};

  if (!member_id) {
    return res.status(400).json({
      status: 'error',
      message: 'member_id wajib diisi',
    });
  }

  try {
    await ensureTables();
    await pool.query('DELETE FROM catatan_checks WHERE member_id = $1', [member_id]);

    try {
      await writeLog(member_id, member_name, null, 'Reset centang', 'reset', actor_name);
    } catch (logErr) {
      console.error('[Catatan Log Warning]', logErr.message);
    }

    return res.status(200).json({
      status: 'ok',
      message: 'Centang anggota tersebut direset',
      data: { member_id },
    });
  } catch (error) {
    console.error('[Catatan Reset Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mereset checklist',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * GET /api/catatan/log
 * Riwayat perubahan checklist terbaru (nama pelaku, item, tanggal, jam).
 * Query: ?limit=200&member_id=fadhil (opsional)
 */
async function getCatatanLog(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 200, 1000);
  const memberId = req.query.member_id;

  try {
    await ensureTables();
    const { rows } = await pool.query(
      `SELECT actor_name, member_id, member_name, check_key, label, action, created_at
         FROM catatan_log
        ${memberId ? 'WHERE member_id = $2' : ''}
        ORDER BY created_at DESC, id DESC
        LIMIT $1`,
      memberId ? [limit, memberId] : [limit]
    );
    return res.status(200).json({ status: 'ok', count: rows.length, data: rows });
  } catch (error) {
    console.error('[Catatan Log Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil log checklist',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

module.exports = {
  getCatatanChecks,
  saveCatatanCheck,
  resetCatatanChecks,
  getCatatanLog,
};
