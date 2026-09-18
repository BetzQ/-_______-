-- =====================================================================
-- E-Sparepart Schema (PostgreSQL / Supabase)
-- Diterjemahkan dari MySQL (schema.sql) ke PostgreSQL syntax.
-- =====================================================================

-- ----------------------------------------------------------------
-- 1) Tabel USERS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(50)  NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role         VARCHAR(50)  NOT NULL,
  name         VARCHAR(100) NOT NULL,
  bqLink       TEXT,
  supervisor_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_users_username UNIQUE (username)
);

-- ----------------------------------------------------------------
-- 2) Tabel SPAREPARTS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spareparts (
  item_code   VARCHAR(50)  NOT NULL,
  deskripsi   VARCHAR(255) NOT NULL,
  qty_on_hand INT NOT NULL DEFAULT 0,
  min_stock   INT NOT NULL DEFAULT 0,
  max_stock   INT NOT NULL DEFAULT 0,
  is_critical BOOLEAN      NOT NULL DEFAULT FALSE,
  lokasi_rak  VARCHAR(50),
  PRIMARY KEY (item_code)
);

CREATE INDEX IF NOT EXISTS idx_spareparts_critical ON spareparts (is_critical);
CREATE INDEX IF NOT EXISTS idx_spareparts_deskripsi ON spareparts (deskripsi);

-- ----------------------------------------------------------------
-- 3) Tabel PENGAJUAN_BQ
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pengajuan_bq (
  no_registrasi          VARCHAR(50)  NOT NULL,
  user_id                INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_code              VARCHAR(50)  REFERENCES spareparts(item_code) ON DELETE RESTRICT,
  jenis_pengajuan        VARCHAR(20)  NOT NULL DEFAULT 'sparepart'
                         CHECK (jenis_pengajuan IN ('sparepart', 'jasa')),
  qty_diminta            INT NOT NULL DEFAULT 1,
  uom                    VARCHAR(20),
  spesifikasi_lengkap    TEXT         NOT NULL,
  purpose                VARCHAR(100),
  no_ejo                 VARCHAR(30),
  mesin_area             VARCHAR(100),
  merk                   VARCHAR(100),
  referensi_penawaran    TEXT,
  urgency                VARCHAR(10)  NOT NULL DEFAULT 'Normal'
                         CHECK (urgency IN ('Normal', 'Urgent')),
  status_approval_spv    VARCHAR(20)  NOT NULL DEFAULT 'Menunggu'
                         CHECK (status_approval_spv IN ('Menunggu', 'Disetujui', 'Ditolak')),
  status_approval_manager VARCHAR(20) NOT NULL DEFAULT 'Menunggu'
                         CHECK (status_approval_manager IN ('Menunggu', 'Disetujui', 'Ditolak')),
  status_pengadaan       VARCHAR(30)  NOT NULL DEFAULT 'BQ Baru'
                         CHECK (status_pengadaan IN ('BQ Baru', 'Pending', 'Proses PO', 'Barang Dikirim', 'Tiba di Gudang', 'Selesai')),
  timestamp              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (no_registrasi)
);

CREATE INDEX IF NOT EXISTS idx_bq_user ON pengajuan_bq (user_id);
CREATE INDEX IF NOT EXISTS idx_bq_item ON pengajuan_bq (item_code);
CREATE INDEX IF NOT EXISTS idx_bq_jenis ON pengajuan_bq (jenis_pengajuan);
CREATE INDEX IF NOT EXISTS idx_bq_urgency ON pengajuan_bq (urgency);
CREATE INDEX IF NOT EXISTS idx_bq_status_spv ON pengajuan_bq (status_approval_spv);
CREATE INDEX IF NOT EXISTS idx_bq_status_mgr ON pengajuan_bq (status_approval_manager);
CREATE INDEX IF NOT EXISTS idx_bq_status_pengadaan ON pengajuan_bq (status_pengadaan);

-- ----------------------------------------------------------------
-- 4) Tabel PENGAJUAN_LOG (Audit Trail Approval)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pengajuan_log (
  id             SERIAL PRIMARY KEY,
  no_registrasi  VARCHAR(50)  NOT NULL REFERENCES pengajuan_bq(no_registrasi) ON DELETE CASCADE,
  actor_id       INT,
  actor_name     VARCHAR(100),
  actor_role     VARCHAR(50),
  field          VARCHAR(30)  NOT NULL,
  old_value      VARCHAR(50),
  new_value      VARCHAR(50),
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_log_no ON pengajuan_log (no_registrasi);
CREATE INDEX IF NOT EXISTS idx_log_created ON pengajuan_log (created_at);
