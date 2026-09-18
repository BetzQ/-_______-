-- =====================================================================
-- supabase_seed.sql - Data seed untuk testing Supabase
-- Berisi: 1 Manager, 1 Supervisor 1, 1 Teknisi, 3 sparepart
-- Password: gunakan hash scrypt atau placeholder untuk testing
-- =====================================================================

-- ==================== USERS ====================
-- Password untuk semua akun: 'test1234'
-- Format: scrypt$<saltHex>$<hashHex> (contoh placeholder)
-- Untuk testing, gunakan password plaintext atau hash yang sama

INSERT INTO users (username, password, role, name, bqLink) VALUES
('MGR001', 'test1234', 'manager', 'Manager Utama', NULL),
('SPV001', 'test1234', 'Supervisor 1', 'Supervisor Satu', NULL),
('TEK001', 'test1234', 'teknisi', 'Teknisi Satu', 'https://docs.google.com/spreadsheets/d/example/edit');

-- ==================== SPAREPARTS ====================
INSERT INTO spareparts (item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak) VALUES
('SP-00001', 'Bearing 6200 ZZ - Deep Groove Ball Bearing', 50, 10, 100, FALSE, 'Rak A-01'),
('SP-00002', 'O-Ring EPDM 50x3mm - Seal Karet', 200, 50, 500, FALSE, 'Rak A-02'),
('SP-00003', 'Pressure Transducer PIZ - Sensor Tekanan', 5, 2, 10, TRUE, 'Rak B-01');
