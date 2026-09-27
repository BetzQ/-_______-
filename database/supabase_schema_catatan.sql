-- =====================================================================
-- Tambahan Schema Catatan Anggota (PostgreSQL / Supabase)
-- File ini hanya berisi tabel BARU untuk halaman /catatan-anggota.html
-- (status checklist + log riwayat). Aman dijalankan berulang: sudah
-- pakai IF NOT EXISTS, jadi tabel lama tidak akan terganggu.
--
-- Cara pakai: buka Supabase Dashboard -> SQL Editor -> paste seluruh
-- isi file ini -> Run.
--
-- Catatan: skema utama (users, spareparts, pengajuan_bq, pengajuan_log)
-- tetap berada di database/supabase_schema.sql sebagai satu kesatuan
-- untuk keperluan reset ulang database dari nol.
-- =====================================================================

-- ----------------------------------------------------------------
-- 1) Tabel CATATAN_CHECKS (status centang halaman catatan anggota)
--    Dipakai oleh halaman /catatan-anggota.html supaya centang
--    tersimpan di database, bukan hanya di browser.
-- ----------------------------------------------------------------
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

-- Satu item = satu baris, sehingga bisa di-upsert.
CREATE UNIQUE INDEX IF NOT EXISTS uk_catatan_checks ON catatan_checks (member_id, check_key);
CREATE INDEX IF NOT EXISTS idx_catatan_checks_member ON catatan_checks (member_id);

-- ----------------------------------------------------------------
-- 2) Tabel CATATAN_LOG (riwayat Checklist siapa · apa · kapan)
--    Append-only: setiap perubahan centang dicatat lengkap dengan
--    nama pelaku, tanggal, dan jam.
-- ----------------------------------------------------------------
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

-- ----------------------------------------------------------------
-- (Opsional) Verifikasi cepat setelah Run:
-- SELECT table_name FROM information_schema.tables
--  WHERE table_schema = 'public' AND table_name LIKE 'catatan%';
-- ----------------------------------------------------------------
