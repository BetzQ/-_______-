require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server E-Sparepart Aktif' });
});

app.use('/api', authRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
});

if (process.env.VERCEL) {
  // Di Vercel: Express diekspor sebagai Serverless Function (tanpa listener).
  module.exports = app;
} else {
  // Di lokal: jalankan server dengan app.listen seperti biasa.
  app.listen(PORT, () => {
    console.log(`E-Sparepart System berjalan pada port ${PORT}`);
    console.log(`Health check : http://localhost:${PORT}/api/health`);
  });
}