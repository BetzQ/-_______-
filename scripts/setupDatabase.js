const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DB_NAME = process.env.DB_NAME || 'e_sparepart_local';
const SCHEMA_FILE = path.join(__dirname, '..', 'database', 'schema.sql');
const SEED_FILE = path.join(__dirname, '..', 'database', 'seed.sql');

const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function askQuestion(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function splitSqlStatements(sql) {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n' + BOLD + YELLOW + '======================================================');
  console.log('        AUTO-SETUP DATABASE LOKAL E-SPAREPART');
  console.log('======================================================' + RESET);
  console.log(`Target database : ${DB_NAME}`);
  console.log(`Host           : ${process.env.DB_HOST || 'localhost'}`);
  console.log(`User           : ${process.env.DB_USER || 'root'}`);
  console.log('');

  const answer = await askQuestion(
    rl,
    `PERHATIAN: Skrip ini akan membuat database '${DB_NAME}'. Jika sudah ada, apakah Anda ingin menghapus dan meresetnya dari awal? (y/n): `
  );

  if (answer.trim().toLowerCase() !== 'y') {
    console.log(RED + '\nSetup dibatalkan. Database lama dipertahankan.' + RESET);
    rl.close();
    process.exit(0);
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
    });

    console.log('\n' + YELLOW + '[1/5] Menghapus database lama (jika ada)...' + RESET);
    await conn.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\``);

    console.log(YELLOW + '[2/5] Membuat database baru...' + RESET);
    await conn.query(
      `CREATE DATABASE \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.query(`USE \`${DB_NAME}\``);

    console.log(YELLOW + '[3/5] Membaca database/schema.sql...' + RESET);
    if (!fs.existsSync(SCHEMA_FILE)) {
      throw new Error(`File skema tidak ditemukan: ${SCHEMA_FILE}`);
    }
    const sql = fs.readFileSync(SCHEMA_FILE, 'utf8');
    const statements = splitSqlStatements(sql).filter((stmt) => {
      const head = stmt.slice(0, 40).toUpperCase();
      return !head.startsWith('USE ') && !head.startsWith('CREATE DATABASE');
    });

    console.log(YELLOW + `[4/5] Mengeksekusi ${statements.length} pernyataan skema...` + RESET);
    for (const stmt of statements) {
      await conn.query(stmt);
    }

    console.log(YELLOW + '[5/5] Menjalankan database/seed.sql (data riil)...' + RESET);
    if (!fs.existsSync(SEED_FILE)) {
      throw new Error(`File seed tidak ditemukan: ${SEED_FILE}. Jalankan dulu: node scripts/generateSeed.js`);
    }
    const seedSql = fs.readFileSync(SEED_FILE, 'utf8');
    await conn.query(seedSql);

    console.log('\n' + GREEN + BOLD + 'Setup selesai!' + RESET);
    console.log(GREEN + `Database '${DB_NAME}' berhasil dibuat & di-seed dengan data riil.` + RESET);
    console.log('');
    console.log(GREEN + '  Contoh akun login:' + RESET);
    console.log(GREEN + '    - Teknisi      : AAA / 04AAA10' + RESET);
    console.log(GREEN + '    - Supervisor 1 : INN / 30INN11' + RESET);
    console.log(GREEN + '    - Officer      : ANS / ANS1805' + RESET);
    console.log(GREEN + '    - Manager      : KSW / 01KSW10' + RESET);
    console.log('');
    console.log(YELLOW + 'Pastikan .env menggunakan target yang sama, misalnya:' + RESET);
    console.log(YELLOW + `  DB_NAME=${DB_NAME}` + RESET);
  } catch (err) {
    console.error('\n' + RED + BOLD + '[Setup Gagal] ' + RESET + RED + err.message + RESET);
    process.exitCode = 1;
  } finally {
    if (conn) await conn.end();
    rl.close();
  }
}

main();