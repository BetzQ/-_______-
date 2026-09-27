 const express = require('express');
 const { getAllSpareparts, getStockSummary } = require('../controllers/sparepartController');
  const {
    createPengajuan,
    getAllPengajuan,
    updateStatusPengajuan,
    getPengajuanLog,
    getPengajuanSummary,
    getStockAlert,
    getBqSummary,
    getMonthlyReport,
  } = require('../controllers/bqController');
  const { exportXlsx } = require('../controllers/exportController');
  const {
    getCatatanChecks,
    saveCatatanCheck,
    resetCatatanChecks,
    getCatatanLog,
  } = require('../controllers/catatanController');
  const {
    registerUser,
    listRegistrations,
    approveUser,
    rejectUser,
    getLoginLog,
    getActivityLog,
  } = require('../controllers/userManagementController');

  const router = express.Router();

  // ---- Modul Teknisi ----
  router.get('/spareparts', getAllSpareparts);
  router.get('/spareparts/summary', getStockSummary);
  router.get('/spareparts/alert', getStockAlert);
  router.post('/pengajuan', createPengajuan);

  // ---- Modul Manager ----
  router.get('/pengajuan/all', getAllPengajuan);              // monitoring & approval
  router.get('/pengajuan/:id/log', getPengajuanLog);          // audit trail
  router.put('/pengajuan/:id/status', updateStatusPengajuan); // update status
  router.get('/pengajuan/summary', getPengajuanSummary);      // PR Summary
  router.get('/pengajuan/bq-summary', getBqSummary);          // BQ Summary

  // ---- Laporan ----
  router.get('/reports/monthly', getMonthlyReport);           // Monthly Report

// ---- Export Excel (.xlsx) ----
router.post('/export/xlsx', exportXlsx);

// ---- Modul Catatan Anggota (halaman catatan-anggota.html) ----
router.get('/catatan/checks', getCatatanChecks);   // status centang
router.post('/catatan/check', saveCatatanCheck);   // simpan 1 centang + log
router.post('/catatan/reset', resetCatatanChecks); // reset centang anggota + log
router.get('/catatan/log', getCatatanLog);         // riwayat log checklist

// ---- Modul Manajemen User & Log (register -> approval Manager) ----
router.post('/register', registerUser);                       // daftar akun baru
router.get('/users/registrations', listRegistrations);        // daftar pending (Manager)
router.post('/users/approve', approveUser);                   // setujui + assign tim (Manager)
router.post('/users/reject', rejectUser);                     // tolak pendaftaran (Manager)
router.get('/log/login', getLoginLog);                        // riwayat login (Manager)
router.get('/log/activity', getActivityLog);                  // riwayat aktivitas (Manager)

module.exports = router;