const pool = require('../config/database');
const { logActivity } = require('./userManagementController');

// Nomor registrasi format seragam: BQ-YYYYMMDD-NNNN dengan NNNN angka
// urut per hari (bukan 4 digit terakhir milidetik yang bisa bentrok).
//Suffix panjang 4 digit di-zero-pad, jadi urutan DESC pada teks = urutan angka.
async function buildNoRegistrasi() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const prefix = `BQ-${date}-`;
  try {
    const { rows } = await pool.query(
      `SELECT no_registrasi FROM pengajuan_bq
        WHERE no_registrasi LIKE $1 AND no_registrasi ~ ('^' || $2 || '[0-9]{4}$')
        ORDER BY no_registrasi DESC LIMIT 1`,
      [`${prefix}%`, prefix]
    );
    if (rows.length > 0) {
      const lastSeq = parseInt(String(rows[0].no_registrasi).slice(prefix.length), 10);
      if (!isNaN(lastSeq) && lastSeq >= 0) {
        return prefix + String(lastSeq + 1).padStart(4, '0');
      }
    }
    return prefix + '0001';
  } catch (err) {
    console.error('[buildNoRegistrasi Error]', err.message);
    return prefix + String(Date.now()).slice(-4);
  }
}

 async function createPengajuan(req, res) {
  const {
    username, itemCode, qty, uom, spesifikasi, purpose, no_ejo, mesin_area, merk, referensi_penawaran,
    jenis_pengajuan, urgency,
  } = req.body || {};

  if (!username) {
    return res.status(401).json({ status: 'error', message: 'Anda harus login terlebih dahulu' });
  }
  const jenisV = String(jenis_pengajuan || 'sparepart').trim();

  if (!spesifikasi || (jenisV === 'sparepart' && !itemCode)) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter itemCode dan spesifikasi wajib diisi',
    });
  }

  const uomV     = String(uom == null ? '' : uom).trim();
  const purposeV = String(purpose == null ? '' : purpose).trim();
  const noEjoV   = String(no_ejo == null ? '' : no_ejo).trim();
  const areaV    = String(mesin_area == null ? '' : mesin_area).trim();

  if (!uomV || !purposeV || !noEjoV || !areaV) {
    return res.status(400).json({
      status: 'error',
      message: 'UoM, Purpose, No. EJO, dan Mesin/Area wajib diisi agar pengajuan komplit',
    });
  }

  const merkV = String(merk == null ? '' : merk).trim() || null;
  const refV  = String(referensi_penawaran == null ? '' : referensi_penawaran).trim() || null;

  const qtyN = Number(qty);
  if (!Number.isInteger(qtyN) || qtyN <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Qty harus berupa angka bulat lebih dari 0',
    });
  }

  try {
    const { rows: userRows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const user = userRows[0];
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User tidak ditemukan. Silakan login ulang.' });
    }

    // Ambil nama & role untuk log aktivitas (dipakai semua role).
    const { rows: whoRows } = await pool.query(
      'SELECT name, role FROM users WHERE id = $1 LIMIT 1', [user.id]
    );
    const who = whoRows[0] || { name: username, role: '-' };

    // Status urgensi TIDAK lagi dipilih teknisi saat submit — ditetapkan
    // oleh Supervisor pada tahap approval (lihat updateStatusPengajuan).
    // Pengajuan baru selalu mulai dari "Normal".
    const urgencyV = 'Normal';

    let sparepartItem = null;
    if (jenisV === 'sparepart') {
      if (!itemCode) {
        return res.status(400).json({
          status: 'error',
          message: 'ItemCode wajib diisi untuk pengajuan sparepart',
        });
      }
      const { rows: spRows } = await pool.query('SELECT item_code FROM spareparts WHERE item_code = $1', [itemCode]);
      const sp = spRows[0];
      if (!sp) {
        return res.status(400).json({
          status: 'error',
          message: `Item Code '${itemCode}' tidak ditemukan di database.`,
        });
      }
      sparepartItem = sp.item_code;
    }

    // no_registrasi adalah primary key. Kalau dua teknisi submit persis
    // bersamaan dan nomor sama-sama terpakai, ambil nomor berikutnya lalu
    // coba lagi (maks 5x) supaya tidak ada pengajuan yang hilang.
    let noRegistrasi = await buildNoRegistrasi();
    let inserted = false;
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      try {
        await pool.query(
          `INSERT INTO pengajuan_bq
            (no_registrasi, user_id, item_code, qty_diminta, uom, spesifikasi_lengkap,
             purpose, no_ejo, mesin_area, merk, referensi_penawaran,
             jenis_pengajuan, urgency, status_approval_spv, status_approval_manager, status_pengadaan)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Menunggu', 'Menunggu', 'BQ Baru')`,
          [noRegistrasi, user.id, sparepartItem, qtyN, uomV, spesifikasi,
           purposeV, noEjoV, areaV, merkV, refV,
           jenisV, urgencyV]
        );
        inserted = true;
      } catch (insErr) {
        if (insErr.code === '23505') {           // unique_violation
          noRegistrasi = await buildNoRegistrasi();
          continue;
        }
        throw insErr;
      }
    }
    if (!inserted) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal membuat nomor registrasi otomatis. Silakan coba lagi.',
      });
    }

    // Log aktivitas: buat pengajuan (aksi mengubah data).
    await logActivity(
      username, who.name, who.role, 'create_bq',
      'Buat pengajuan ' + noRegistrasi + ' — ' + jenisV + ' ' + qtyN + ' ' + uomV +
        ' (' + urgencyV + ')' + (sparepartItem ? ' item ' + sparepartItem : '') +
        (noEjoV ? ' · EJO ' + noEjoV : '')
    );

    return res.status(201).json({
      status: 'ok',
      message: 'Pengajuan BQ berhasil dibuat',
      data: { no_registrasi: noRegistrasi, jenis_pengajuan: jenisV, urgency: urgencyV },
    });
  } catch (error) {
    console.error('[BQ Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menyimpan pengajuan BQ',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

// =====================================================================
// MODUL MANAGER - Monitoring & Approval
// =====================================================================

// Whitelist nilai status di database (baku, sesuai seed & BQ Monitoring).
const STATUS_APPROVAL = ['Menunggu', 'Disetujui', 'Ditolak'];

// Alias API yang ramah frontend -> nilai baku di database.
// Frontend cukup kirim 'approved' / 'rejected' sesuai kontrak spec PM.
const ALIAS_APPROVAL = {
  approved: 'Disetujui',
  rejected: 'Ditolak',
  waiting:  'Menunggu',
};

// Pipeline status pengadaan. 'BQ Baru' = status awal dari createPengajuan,
// sisanya urutan alur pengadaan sesuai spec manager.
// WAJIB sinkron dengan CHECK constraint pengajuan_bq_status_pengadaan_check di DB,
// kalau tidak nilai yang sah di DB akan ditolak backend (atau conversely: baris
// existing dengan nilai yang tidak ada di sini tidak bisa dipilih ulang di UI).
const STATUS_PENGADAAN = [
  'BQ Baru',
  'Pending',
  'Proses PO',
  'PO Open',
  'Mencari Penawaran',
  'Barang Dikirim',
  'Tiba di Gudang',
  'Selesai',
];

// Status urgensi. Menyesuaikan kolom ENUM urgency di tabel pengajuan_bq.
// WAJIB ditetapkan oleh Supervisor (bukan oleh teknisi saat submit).
const STATUS_URGENCY = ['Normal', 'Urgent'];

// Normalisasi nilai status approval:
// terima nilai baku ('Disetujui') ATAU alias ('approved') -> balikan nilai baku.
function normalizeApproval(value) {
  const s = String(value == null ? '' : value).trim();
  if (!s) return null;
  const exact = STATUS_APPROVAL.find((x) => x.toLowerCase() === s.toLowerCase());
  if (exact) return exact;
  return ALIAS_APPROVAL[s.toLowerCase()] || null;
}

// =====================================================================
// RBAC: pembagian hak akses aksi monitoring & approval.
//  - Supervisor : hanya SPV approval (tahap 1)
//  - Manager    : final approval + boleh ikut update status pengadaan
//  - Officer    : hanya status pengadaan (pipeline procurement)
// =====================================================================
function classifyRole(role) {
  const r = String(role || '').toLowerCase();
  if (r.startsWith('supervisor')) return 'supervisor';
  if (r === 'officer')          return 'officer';
  if (r === 'manager')          return 'manager';
  return 'other';
}

// Status approval mana yang boleh diubah oleh sebuah role.
function allowedApprovalFields(roleKey) {
  if (roleKey === 'manager') {
    return { status_approval_spv: true, status_approval_manager: true };
  }
  if (roleKey === 'supervisor') {
    return { status_approval_spv: true, status_approval_manager: false };
  }
  return { status_approval_spv: false, status_approval_manager: false };
}

/**
 * GET /api/pengajuan/all
 * Mengambil SELURUH pengajuan BQ dengan JOIN ke users (data teknisi)
 * dan spareparts (deskripsi barang), diurutkan dari yang paling baru.
 *
 * Query opsional:
 *  - ?username=<u> : batasi hanya pengajuan milik user tersebut (dipakai
 *    dashboard Teknisi agar hanya melihat pengajuannya sendiri).
 *  - ?full_approved=1 : hanya pengajuan yang sudah FULL approve
 *    (SPV = Disetujui DAN Manager = Disetujui) — dipakai "Rekapan Pengajuan".
 */
async function getAllPengajuan(req, res) {
  try {
    const { username, full_approved } = req.query || {};

    const where = [];
    const params = [];
    if (username) {
      params.push(username);
      where.push(`u.username = $${params.length}`);
    }
    if (String(full_approved) === '1') {
      where.push(`bq.status_approval_spv = 'Disetujui' AND bq.status_approval_manager = 'Disetujui'`);
    }

    const { rows } = await pool.query(
       `SELECT
           bq.jenis_pengajuan,
           bq.urgency,
           bq.no_registrasi,
           bq.user_id,
           bq.item_code,
           COALESCE(sp.deskripsi, '-')           AS deskripsi_barang,
           bq.qty_diminta,
          bq.uom,
          bq.spesifikasi_lengkap,
          bq.purpose,
          bq.no_ejo,
          bq.mesin_area,
          bq.merk,
          bq.referensi_penawaran,
          bq.status_approval_spv,
          bq.status_approval_manager,
          bq.status_pengadaan,
          bq.timestamp,
          u.username              AS username_teknisi,
          u.name                  AS nama_teknisi,
          u.role                  AS role_pengaju
         FROM pengajuan_bq bq
         JOIN users      u  ON u.id = bq.user_id
         LEFT JOIN spareparts sp ON sp.item_code = bq.item_code
         ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
         ORDER BY bq.timestamp DESC, bq.no_registrasi DESC`,
      params
    );

    return res.status(200).json({
      status: 'ok',
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('[BQ List Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data pengajuan BQ',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * PUT /api/pengajuan/:id/status
 * Update status approval (SPV/Manager) DAN/ATAU status_pengadaan DAN/ATAU urgency
 * berdasarkan no_registrasi.
 * Body: { username, status_approval_spv?, status_approval_manager?, status_pengadaan?, urgency? }
 *
 * RBAC (Backend):
 *  - Supervisor dapat mengubah status_approval_spv (tahap 1) dan urgency.
 *  - Manager    dapat mengubah status_approval_manager (tahap 2/final),
 *                status_pengadaan, dan urgency.
 *  - Officer    hanya dapat mengubah status_pengadaan (pipeline procurement).
 *  - Teknisi    tidak memiliki hak ubah status apa pun.
 *
 * Aturan alur: Manager TIDAK bisa memberi keputusan final sebelum SPV menyetujui.
 */
async function updateStatusPengajuan(req, res) {
  const { id } = req.params; // no_registrasi
  const {
    username, status_approval_spv, status_approval_manager, status_pengadaan, urgency,
  } = req.body || {};

  // 0) Identitas aktor wajib ada (konsisten dengan createPengajuan).
  if (!username) {
    return res.status(401).json({ status: 'error', message: 'Anda harus login terlebih dahulu' });
  }

  // 1) Validasi nilai status yang dikirim.
  const spvVal   = normalizeApproval(status_approval_spv);
  const mgrVal   = normalizeApproval(status_approval_manager);
  const pengadaan = String(status_pengadaan == null ? '' : status_pengadaan).trim();
  const urgensi  = String(urgency == null ? '' : urgency).trim();

  const hasSpv = status_approval_spv !== undefined && status_approval_spv !== null && String(status_approval_spv).trim() !== '';
  const hasMgr = status_approval_manager !== undefined && status_approval_manager !== null && String(status_approval_manager).trim() !== '';
  const hasPengadaan = pengadaan !== '';
  const hasUrgency = urgensi !== '';

  if (!hasSpv && !hasMgr && !hasPengadaan && !hasUrgency) {
    return res.status(400).json({
      status: 'error',
      message: 'Tidak ada status yang dikirim untuk diubah',
    });
  }
  if (hasSpv && !spvVal) {
    return res.status(400).json({
      status: 'error',
      message: `status_approval_spv tidak valid. Nilai yang diizinkan: ${STATUS_APPROVAL.join(', ')} (atau approved/rejected)`,
    });
  }
  if (hasMgr && !mgrVal) {
    return res.status(400).json({
      status: 'error',
      message: `status_approval_manager tidak valid. Nilai yang diizinkan: ${STATUS_APPROVAL.join(', ')} (atau approved/rejected)`,
    });
  }
  if (hasPengadaan && !STATUS_PENGADAAN.includes(pengadaan)) {
    return res.status(400).json({
      status: 'error',
      message: `status_pengadaan tidak valid. Nilai yang diizinkan: ${STATUS_PENGADAAN.join(', ')}`,
    });
  }
  if (hasUrgency && !STATUS_URGENCY.includes(urgensi)) {
    return res.status(400).json({
      status: 'error',
      message: `urgency tidak valid. Nilai yang diizinkan: ${STATUS_URGENCY.join(', ')}`,
    });
  }

  // 2) Cek identitas & role aktor dari database.
  let actor;
  try {
    const { rows } = await pool.query(
      'SELECT id, role, name FROM users WHERE username = $1',
      [username]
    );
    const row = rows[0];
    if (!row) {
      return res.status(401).json({
        status: 'error',
        message: 'User tidak ditemukan. Silakan login ulang.',
      });
    }
    actor = row;
  } catch (error) {
    console.error('[BQ RBAC Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memeriksa hak akses pengguna',
    });
  }
  const actorRole = classifyRole(actor.role);

  // Hak akses per field status.
  const allowedApproval = allowedApprovalFields(actorRole);
  if ((hasSpv && !allowedApproval.status_approval_spv) ||
      (hasMgr && !allowedApproval.status_approval_manager)) {
    return res.status(403).json({
      status: 'error',
      message: 'Role Anda tidak memiliki hak untuk melakukan approval ini.',
    });
  }
  if (hasPengadaan && actorRole !== 'manager' && actorRole !== 'officer') {
    return res.status(403).json({
      status: 'error',
      message: 'Status pengadaan hanya bisa diubah oleh Officer / Manager.',
    });
  }
  if (hasUrgency && actorRole !== 'supervisor' && actorRole !== 'manager') {
    return res.status(403).json({
      status: 'error',
      message: 'Status urgensi hanya bisa ditentukan oleh Supervisor / Manager.',
    });
  }

  // 3) Ambil status terkini (untuk aturan alur + audit trail).
  let current;
  try {
    const { rows } = await pool.query(
      'SELECT status_approval_spv, status_approval_manager, status_pengadaan, urgency FROM pengajuan_bq WHERE no_registrasi = $1',
      [id]
    );
    const row = rows[0];
    if (!row) {
      return res.status(404).json({
        status: 'error',
        message: `Pengajuan ${id} tidak ditemukan`,
      });
    }
    current = row;
  } catch (error) {
    console.error('[BQ Lookup Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memeriksa data pengajuan',
    });
  }

  // Aturan alur: keputusan final manager menunggu persetujuan SPV dulu.
  if (hasMgr && normalizeApproval(current.status_approval_spv) !== 'Disetujui') {
    return res.status(400).json({
      status: 'error',
      message: 'Manager hanya bisa menyetujui setelah Supervisor menyetujui pengajuan ini (SPV = Disetujui).',
    });
  }

  // 4) Bangun klausa SET secara dinamis (hanya kolom yang dikirim).
  const sets = [];
  const params = [];
  let paramIndex = 1;

  if (hasMgr) {
    sets.push(`status_approval_manager = $${paramIndex++}`);
    params.push(mgrVal);
  }
  if (hasSpv) {
    sets.push(`status_approval_spv = $${paramIndex++}`);
    params.push(spvVal);
  }
  if (hasPengadaan) {
    sets.push(`status_pengadaan = $${paramIndex++}`);
    params.push(pengadaan);
  }
  if (hasUrgency) {
    sets.push(`urgency = $${paramIndex++}`);
    params.push(urgensi);
  }

  try {
    const result = await pool.query(
      `UPDATE pengajuan_bq SET ${sets.join(', ')} WHERE no_registrasi = $${paramIndex}`,
      [...params, id]
    );

    // Nilai yang dikirim sama dengan yang tersimpan -> tidak ada perubahan.
    if (result.rowCount === 0) {
      return res.status(200).json({
        status: 'ok',
        message: 'Status tidak berubah (nilai sudah sama)',
        data: { no_registrasi: id },
      });
    }

    // Audit trail: catat setiap field yang benar-benar berubah.
    // Kegagalan pencatatan log TIDAK boleh menggagalkan update status.
    const changes = [];
    if (hasSpv && String(current.status_approval_spv) !== spvVal) {
      changes.push(['status_approval_spv', current.status_approval_spv, spvVal]);
    }
    if (hasMgr && String(current.status_approval_manager) !== mgrVal) {
      changes.push(['status_approval_manager', current.status_approval_manager, mgrVal]);
    }
    if (hasPengadaan && String(current.status_pengadaan) !== pengadaan) {
      changes.push(['status_pengadaan', current.status_pengadaan, pengadaan]);
    }
    if (hasUrgency && String(current.urgency) !== urgensi) {
      changes.push(['urgency', current.urgency, urgensi]);
    }
    try {
      for (const [field, oldV, newV] of changes) {
        await pool.query(
          `INSERT INTO pengajuan_log
             (no_registrasi, actor_id, actor_name, actor_role, field, old_value, new_value)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, actor.id, actor.name, actor.role, field, oldV, newV]
        );
      }
    } catch (logErr) {
      console.error('[BQ Log Warning]', logErr.message);
    }

    // Log aktivitas: ubah status pengajuan — ringkas: field, dari, ke.
    const statusDetail = changes.length
      ? changes.map((c) => c[0] + ': ' + (c[1] || '-') + ' -> ' + c[2]).join('; ')
      : 'Tidak ada perubahan';
    await logActivity(
      username, actor.name, actor.role, 'update_status',
      'Ubah status ' + id + ' — ' + statusDetail
    );

    return res.status(200).json({
      status: 'ok',
      message: 'Status pengajuan berhasil diperbarui',
      data: {
        no_registrasi: id,
        ...(hasSpv && { status_approval_spv: spvVal }),
        ...(hasMgr && { status_approval_manager: mgrVal }),
        ...(hasPengadaan && { status_pengadaan: pengadaan }),
        ...(hasUrgency && { urgency: urgensi }),
      },
    });
  } catch (error) {
    console.error('[BQ Update Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui status pengajuan',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * GET /api/pengajuan/:id/log
 * Riwayat perubahan status (audit trail) sebuah pengajuan.
 */
async function getPengajuanLog(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT actor_name, actor_role, field, old_value, new_value, created_at
         FROM pengajuan_log
        WHERE no_registrasi = $1
        ORDER BY created_at ASC, id ASC`,
      [id]
    );
    return res.status(200).json({ status: 'ok', count: rows.length, data: rows });
  } catch (error) {
    console.error('[BQ Log Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil riwayat pengajuan',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

// =====================================================================
// MODUL MANAGER - PR Summary & Stock Alert
// =====================================================================

/**
 * GET /api/pengajuan/summary
 * PR Summary (read-only): seluruh data pengajuan, bukan hanya yang Menunggu.
 * Query param:
 *   username   (wajib)  - penanda login
 *   status     - 'Menunggu' | 'Disetujui' | 'Ditolak' | 'semua' (default: semua)
 *   filterTim  - 'tim' (default Supervisor 1) | 'semua'
 *   q          - pencarian bebas (no registrasi / teknisi / item / EJO)
 *   page, limit- paginasi (default 25)
 * Akses: Supervisor 1 dan Manager.
 * Read-only: halaman ini tidak mengubah status apa pun. Approve/reject hanya
 * di Monitoring & Approval BQ supaya Urgensi selalu ikut terisi.
 */
async function getPengajuanSummary(req, res) {
  try {
    const { username, status, filterTim, q } = req.query;
    const page  = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(10, parseInt(req.query.limit, 10) || 25));

    if (!username) {
      return res.status(401).json({ status: 'error', message: 'Anda harus login terlebih dahulu' });
    }
    const { rows: actorRows } = await pool.query('SELECT id, role FROM users WHERE username = $1', [username]);
    const actor = actorRows[0];
    if (!actor) {
      return res.status(401).json({ status: 'error', message: 'User tidak ditemukan' });
    }
    const roleKey = classifyRole(actor.role);
    const isSupervisor = actor.role === 'Supervisor 1';
    if (roleKey !== 'manager' && !isSupervisor) {
      return res.status(403).json({ status: 'error', message: 'Hanya Manager/Supervisor 1 yang dapat melihat PR Summary' });
    }

    const whereClauses = [];
    const params = [];
    const push = (v) => { params.push(v); return '$' + params.length; };

    // Cakupan tim harus dihitung lebih dulu supaya agregasi KPI bisa memakai
    // clauses yang sama tanpa mengulang placeholder.
    // Filter per tim: u.supervisor_id harus dicocokkan dengan actor.id
    // (id supervisor yang sedang login), bukan actor.supervisor_id.
    const perTim = isSupervisor && String(filterTim || 'tim') !== 'semua';
    let filterTimAktif = false;
    let tanpaBawahan = false;
    if (perTim) {
      whereClauses.push(`u.supervisor_id = ${push(actor.id)}`);
      filterTimAktif = true;
      const { rows: anakRows } = await pool.query(
        'SELECT COUNT(*)::int AS n FROM users WHERE supervisor_id = $1',
        [actor.id]
      );
      tanpaBawahan = (anakRows[0]?.n || 0) === 0;
    }
    const scopeWhere = whereClauses.length ? ' WHERE ' + whereClauses.join(' AND ') : '';

    // Filter status approval SPV. Default 'semua' supaya supervisor bisa
    // melihat keseluruhan data PR sesuai permintaan (bukan hanya antrean).
    const statusV = String(status || 'semua').trim();
    if (statusV !== 'semua') {
      whereClauses.push(`bq.status_approval_spv = ${push(statusV)}`);
    }

    // Pencarian bebas di beberapa kolom sekaligus.
    const qV = String(q || '').trim();
    if (qV) {
      const like = push('%' + qV + '%');
      whereClauses.push(
        `(bq.no_registrasi ILIKE ${like} OR u.name ILIKE ${like} OR bq.item_code ILIKE ${like}` +
        ` OR bq.no_ejo ILIKE ${like} OR bq.spesifikasi_lengkap ILIKE ${like}` +
        ` OR bq.mesin_area ILIKE ${like} OR bq.purpose ILIKE ${like})`
      );
    }

    const whereSql = whereClauses.length ? ' WHERE ' + whereClauses.join(' AND ') : '';

    // KPI memakai scope tim saja (tanpa filter status/pencarian) supaya kartu
    // rekap tetap menampilkan gambaran utuh cakupan terpilih.
    const { rows: aggRows } = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Menunggu')::int AS menunggu,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Disetujui')::int AS disetujui,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Ditolak')::int   AS ditolak,
              COUNT(*) FILTER (WHERE bq.urgency = 'Urgent')::int                 AS urgent,
              COUNT(*) FILTER (WHERE bq.jenis_pengajuan = 'sparepart')::int      AS sparepart,
              COUNT(*) FILTER (WHERE bq.jenis_pengajuan = 'jasa')::int           AS jasa
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id${scopeWhere}`,
      params
    );
    const agg = aggRows[0] || { total: 0, menunggu: 0, disetujui: 0, ditolak: 0, urgent: 0, sparepart: 0, jasa: 0 };

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*)::int AS total
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id${whereSql}`,
      params
    );
    const totalTersaring = (countRows[0] || {}).total || 0;

    const offset = (page - 1) * limit;
    const { rows } = await pool.query(
      `SELECT bq.no_registrasi, bq.item_code, sp.deskripsi AS deskripsi_barang,
              bq.qty_diminta, bq.uom, bq.spesifikasi_lengkap, bq.purpose, bq.no_ejo,
              bq.mesin_area, bq.merk, bq.status_pengadaan, bq.timestamp,
              bq.jenis_pengajuan, bq.urgency,
              bq.status_approval_spv, bq.status_approval_manager,
              u.name AS nama_teknisi, u.role AS role_pengaju
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id
         LEFT JOIN spareparts sp ON sp.item_code = bq.item_code${whereSql}
        ORDER BY bq.timestamp DESC
        LIMIT ${push(limit)} OFFSET ${push(offset)}`,
      params
    );

    const totalHalaman = Math.max(1, Math.ceil(totalTersaring / limit));

    return res.status(200).json({
      status: 'ok',
      count: totalTersaring,
      // total = baris hasil filter (untuk pagination & "X ditemukan")
      total: totalTersaring,
      // totalSemua = seluruh data pada cakupan tim, apa pun filter status/pencarian
      totalSemua: agg.total,
      data: rows,
      page,
      limit,
      totalHalaman,
      filterTimAktif,
      tanpaBawahan,
      summary: {
        total: agg.total,
        menunggu: agg.menunggu,
        disetujui: agg.disetujui,
        ditolak: agg.ditolak,
        urgent: agg.urgent,
        normal: agg.total - agg.urgent,
        sparepart: agg.sparepart,
        jasa: agg.jasa,
      },
    });
  } catch (error) {
    console.error('[PR Summary Error]', error.message);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil PR Summary' });
  }
}

/**
 * GET /api/spareparts/alert
 * Daftar sparepart dengan stok di bawah min_stock (peringatan perlu dipesan).
 * Digunakan sebagai badge di KPI / Critical Part List.
 */
async function getStockAlert(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak,
               (min_stock - qty_on_hand) AS defisit
          FROM spareparts
         WHERE qty_on_hand <= min_stock AND min_stock > 0
         ORDER BY defisit DESC, is_critical DESC, item_code ASC`
    );
    return res.status(200).json({ status: 'ok', count: rows.length, data: rows });
  } catch (error) {
    console.error('[Stock Alert Error]', error.message);
    return res.status(500).json({ status: 'error', message: 'Gagal mengambil data alert stok' });
  }
}

// =====================================================================
// REKAP PENGAJUAN (dulu "BQ Summary")
// Hanya menghitung pengajuan yang sudah FULL APPROVE, yaitu:
//   status_approval_spv = 'Disetujui' DAN status_approval_manager = 'Disetujui'
// =====================================================================

/**
 * GET /api/pengajuan/bq-summary
 * Rekapan keseluruhan pengajuan dari SEMUA teknisi yang sudah disetujui penuh.
 * - Total pengajuan full approve, per urgency, per jenis
 * - Rekap per teknisi (siapa yang mengajukan berapa)
 * - Pipeline status pengadaan dari pengajuan yang sudah disetujui
 * - Bisa diakses semua role yang punya menu Rekapan Pengajuan
 */
async function getBqSummary(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT bq.no_registrasi, bq.jenis_pengajuan, bq.urgency,
              bq.status_approval_spv, bq.status_approval_manager, bq.status_pengadaan,
              bq.qty_diminta, bq.item_code, bq.mesin_area, bq.purpose, bq.timestamp,
              u.name AS nama_teknisi
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id
        WHERE bq.status_approval_spv = 'Disetujui'
          AND bq.status_approval_manager = 'Disetujui'
        ORDER BY bq.timestamp DESC`
    );

    const total = rows.length;
    const urgent = rows.filter(r => r.urgency === 'Urgent').length;
    const normal = total - urgent;
    const sparepart = rows.filter(r => r.jenis_pengajuan === 'sparepart').length;
    const jasa = total - sparepart;

    // Rekap per teknisi: siapa sudah berapa pengajuan yang disetujui penuh.
    const perTeknisi = {};
    rows.forEach(r => {
      const key = r.nama_teknisi || '-';
      if (!perTeknisi[key]) perTeknisi[key] = { nama_teknisi: key, total: 0, urgent: 0, sparepart: 0, jasa: 0 };
      perTeknisi[key].total += 1;
      if (r.urgency === 'Urgent') perTeknisi[key].urgent += 1;
      if (r.jenis_pengajuan === 'jasa') perTeknisi[key].jasa += 1;
      else perTeknisi[key].sparepart += 1;
    });
    const perTeknisiList = Object.values(perTeknisi).sort((a, b) => b.total - a.total);

    const pipelineBreakdown = {};
    rows.forEach(r => {
      const st = r.status_pengadaan || 'BQ Baru';
      pipelineBreakdown[st] = (pipelineBreakdown[st] || 0) + 1;
    });

    return res.status(200).json({
      status: 'ok',
      count: total,
      data: rows,
      summary: {
        total, urgent, normal, sparepart, jasa,
        perTeknisi: perTeknisiList,
        pipeline: pipelineBreakdown,
      },
    });
  } catch (error) {
    console.error('[BQ Summary Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil Rekapan Pengajuan',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

// =====================================================================
// MONTHLY REPORT — Laporan bulanan (Supervisor 1 & Manager)
// =====================================================================

/**
 * GET /api/reports/monthly?year=2026&month=9
 * GET /api/reports/monthly?all=1          -> seluruh periode
 * Endpoint resmi Monthly Report. Halaman Monthly Report di web memakai
 * endpoint ini, bukan menarik seluruh data pengajuan ke browser.
 *
 * Definisi status seragam web & backend:
 *   menunggu / disetujui / ditolak -> status_approval_spv
 *   fullApproved                   -> SPV disetujui DAN Manager disetujui
 */
async function getMonthlyReport(req, res) {
  try {
    const now = new Date();
    const wantAll = String(req.query.all || '') === '1';
    const year  = parseInt(req.query.year, 10)  || now.getFullYear();
    const month = parseInt(req.query.month, 10) || (now.getMonth() + 1);

    if (month < 1 || month > 12) {
      return res.status(400).json({ status: 'error', message: 'Bulan tidak valid (1-12)' });
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endMonth  = month === 12 ? 1 : month + 1;
    const endYear   = month === 12 ? year + 1 : year;
    const endDate   = `${endYear}-${String(endMonth).padStart(2, '0')}-01`;

    const selectCols = `bq.no_registrasi, bq.jenis_pengajuan, bq.urgency,
              bq.status_approval_spv, bq.status_approval_manager, bq.status_pengadaan,
              bq.qty_diminta, bq.timestamp,
              u.name AS nama_teknisi, u.role AS role_pengaju`;

    const rangeSql = wantAll ? '' : 'WHERE bq.timestamp >= $1 AND bq.timestamp < $2';
    const rangeParams = wantAll ? [] : [startDate, endDate];

    // Ringkasan dihitung di database, bukan di browser.
    const { rows: sumRows } = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE bq.urgency = 'Urgent')::int AS urgent,
              COUNT(*) FILTER (WHERE bq.jenis_pengajuan = 'sparepart')::int AS sparepart,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Menunggu')::int  AS waiting,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Disetujui')::int AS approved,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Ditolak')::int   AS rejected,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Disetujui'
                                 AND bq.status_approval_manager = 'Disetujui')::int AS full_approved,
              COUNT(*) FILTER (WHERE bq.status_approval_spv = 'Disetujui'
                                 AND bq.status_approval_manager = 'Menunggu')::int  AS waiting_manager
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id
         ${rangeSql}`,
      rangeParams
    );
    const s = sumRows[0] || {};

    // Pengelompokan grafik juga dihitung di server supaya browser tidak perlu
    // iterasi ribuan baris setiap kali grafik digambar ulang.
    const groupQuery = (expr, order) => pool.query(
      `SELECT ${expr} AS kunci, COUNT(*)::int AS jumlah
         FROM pengajuan_bq bq
         JOIN users u ON u.id = bq.user_id
         ${rangeSql}
        GROUP BY 1
        ORDER BY ${order}`,
      rangeParams
    );
    const [bulanRows, approvalRows, pengadaanRows] = await Promise.all([
      groupQuery(`to_char(date_trunc('month', bq.timestamp), 'YYYY-MM')`, '1 ASC'),
      groupQuery('bq.status_approval_spv', '1 ASC'),
      groupQuery(`COALESCE(NULLIF(bq.status_pengadaan, ''), 'Belum ada status')`, '1 ASC'),
    ]);

    // Rincian baris hanya dikirim bila dibutuhkan. Untuk "Semua Bulan" data
    // bisa sangat banyak, jadi default-nya ringkasan saja; tambahkan
    // ?detail=1 bila pemanggil benar-benar butuh baris mentah.
    const wantDetail = String(req.query.detail || '') === '1';
    let rows = [];
    if (!wantAll || wantDetail) {
      const detailCols = wantDetail
        ? `${selectCols}, bq.item_code, sp.deskripsi AS deskripsi_barang, bq.no_ejo, bq.mesin_area,
                   bq.purpose, bq.uom, bq.spesifikasi_lengkap`
        : selectCols;
      const { rows: detailRows } = await pool.query(
        `SELECT ${detailCols}
           FROM pengajuan_bq bq
           JOIN users u ON u.id = bq.user_id
           ${wantDetail ? 'LEFT JOIN spareparts sp ON sp.item_code = bq.item_code' : ''}
           ${rangeSql}
          ORDER BY bq.timestamp ASC`,
        rangeParams
      );
      rows = detailRows;
    }

    // Daftar periode yang punya data, untuk mengisi dropdown "Periode".
    const { rows: periodRows } = await pool.query(
      `SELECT to_char(date_trunc('month', bq.timestamp), 'YYYY-MM') AS periode,
              COUNT(*)::int AS jumlah
         FROM pengajuan_bq bq
        GROUP BY 1
        ORDER BY 1 DESC`
    );

    const total = s.total || 0;
    const urgent = s.urgent || 0;
    const sparepart = s.sparepart || 0;
    const fullApproved = s.full_approved || 0;
    const waiting = s.waiting || 0;
    const approved = s.approved || 0;
    const rejected = s.rejected || 0;
    const waitingManager = s.waiting_manager || 0;

    return res.status(200).json({
      status: 'ok',
      period: wantAll ? { year: null, month: null, all: true } : { year, month },
      periods: periodRows,
      count: total,
      jumlahBaris: rows.length,
      data: rows,
      groups: {
        bulan: bulanRows,
        approval: approvalRows,
        pengadaan: pengadaanRows,
      },
      summary: {
        total, urgent, normal: total - urgent, sparepart, jasa: total - sparepart,
        approved, rejected, waiting,
        fullApproved, waitingManager,
      },
    });
  } catch (error) {
    console.error('[Monthly Report Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil laporan bulanan',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

module.exports = { createPengajuan, getAllPengajuan, updateStatusPengajuan, getPengajuanLog, getPengajuanSummary, getStockAlert, getBqSummary, getMonthlyReport };
