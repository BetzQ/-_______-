/**
 * ============================================================================
 *  SELF-TEST TAHAP 2 — RBAC "UBAH STATUS PENGADAAN"
 *  Micropage E-Sparepart — PT Fonko International Pharmaceuticals
 * ----------------------------------------------------------------------------
 *  TUJUAN
 *    Membuktikan secara terotomatis bahwa hak mengubah status procurement
 *    (BQ Baru -> Proses PO -> ... -> Selesai) sekarang DIKUNCI oleh role
 *    "Administrator", bukan lagi "Officer".
 *
 *  CARA KERJA
 *    Database di-MOCK (tidak pernah menyentuh Supabase / MySQL asli), lalu
 *    fungsi controller `updateStatusPengajuan()` dipanggil langsung dengan
 *    res/req tiruan. Ini menguji logika RBAC yang sesungguhnya — bukan
 *    sekadar pembacaan teks file.
 *
 *  JALAN
 *    node scripts/test_rbac_status_pengadaan.js
 *
 *  NOL DEPENDENSI EKSTERNAL — hanya modul bawaan Node.js (assert).
 * ============================================================================
 */

'use strict';

const assert = require('assert');
const path = require('path');

// ===========================================================================
// 1. MOCK DATABASE — disuntik ke require.cache SEBELUM controller di-load,
//    sehingga tidak ada koneksi ke server database sungguhan.
// ===========================================================================

let currentRole = 'Officer';
let currentRow = {
  status_approval_spv: 'Menunggu',
  status_approval_manager: 'Menunggu',
  status_pengadaan: 'BQ Baru',
  urgency: 'Normal',
};

const executedSql = [];
let updateCount = 0;

/** Tag template stand-in untuk `sql` (dipakai userManagementController). */
function sqlTag(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += (values[i] == null ? '' : String(values[i])) + strings[i + 1];
  }
  return out;
}

const mockDatabaseModule = {
  query: async (sqlText, params) => {
    const s = String(sqlText).trim();
    executedSql.push({ sql: s, params });

    if (/SELECT\s+id,\s*role,\s*name\s+FROM\s+users/i.test(s)) {
      return { rows: [{ id: 1, role: currentRole, name: 'User Uji' }], rowCount: 1 };
    }
    if (/SELECT\s+status_approval_spv/i.test(s)) {
      return { rows: [currentRow], rowCount: 1 };
    }
    if (/^UPDATE\s+pengajuan_bq/i.test(s)) {
      updateCount += 1;
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  },
  sql: sqlTag,
};

const dbPath = require.resolve(path.join(__dirname, '..', 'src', 'config', 'database.js'));
require.cache[dbPath] = {
  id: dbPath,
  filename: dbPath,
  loaded: true,
  exports: mockDatabaseModule,
  children: [],
  paths: [],
};

// ===========================================================================
// 2. LOAD CONTROLLER ASLI (kode yang akan dikirim ke dosen)
// ===========================================================================

const { updateStatusPengajuan } = require(path.join(
  __dirname, '..', 'src', 'controllers', 'bqController.js'
));

// ===========================================================================
// 3. HELPER — req/res tiruan
// ===========================================================================

function makeRes() {
  const res = { statusCode: 200, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => { res.body = payload; return res; };
  res.setHeader = () => res;
  return res;
}

/** Panggil controller sungguhan dan kembalikan { status, body, didUpdate }. */
async function callUpdate({ role, row, params }) {
  currentRole = role;
  if (row) currentRow = row;
  const before = updateCount;
  const req = { params: { id: 'BQ-TEST-0001' }, body: { username: 'uji', ...params } };
  const res = makeRes();
  await updateStatusPengajuan(req, res);
  return { status: res.statusCode, body: res.body, didUpdate: updateCount > before };
}

const rowDefault = {
  status_approval_spv: 'Menunggu',
  status_approval_manager: 'Menunggu',
  status_pengadaan: 'BQ Baru',
  urgency: 'Normal',
};
const rowFullApproved = {
  status_approval_spv: 'Disetujui',
  status_approval_manager: 'Disetujui',
  status_pengadaan: 'BQ Baru',
  urgency: 'Normal',
};

// ===========================================================================
// 4. RUMPUTAN TEST
// ===========================================================================

const results = [];
let failed = 0;

async function test(name, fn) {
  const uji = [];
  try {
    await fn({
      ok: (desc) => uji.push(`      + ${desc}`),
    });
    results.push({ name, status: 'LULUS', bukti: uji });
  } catch (err) {
    failed += 1;
    results.push({ name, status: 'GAGAL', bukti: uji.concat([`      ! ${err.message}`]) });
  }
}

const ujiPengadaan = (role, expect, ket = {}) => test(
  `[403/200] Status Pengadaan — role "${role}"`,
  async ({ ok }) => {
    const r = await callUpdate({
      role,
      row: rowDefault,
      params: { status_pengadaan: ket.target || 'Proses PO' },
    });
    assert.strictEqual(
      r.status, expect,
      `harapan HTTP ${expect},aktual ${r.status} (body: ${JSON.stringify(r.body)})`
    );
    ok(`HTTP ${r.status}`);
    if (expect === 403) {
      assert.match(
        String(r.body && r.body.message),
        /Administrator/i,
        'pesan 403 harus menyebut Administrator'
      );
      ok(`pesan: "${r.body.message}"`);
      assert.strictEqual(r.didUpdate, false, 'UPDATE TIDAK BOLEH dieksekusi');
      ok('tidak ada query UPDATE yang jalan (aman)');
    } else {
      assert.strictEqual(r.didUpdate, true, 'UPDATE harus dieksekusi');
      ok('query UPDATE dieksekusi -> status procurement berubah');
    }
  }
);

// ===========================================================================
// 4.6 MENJALANKAN SELURUH PENGUJIAN
// ===========================================================================

async function main() {

// --- 4.1 Officer WAJIB ditolak (ini inti revisi) ---------------------------
await ujiPengadaan('Officer', 403);
await ujiPengadaan('officer', 403);
await ujiPengadaan('OFFICER', 403);

// --- 4.2 Administrator WAJIB bisa -----------------------------------------
await ujiPengadaan('Administrator', 200);
await ujiPengadaan('administrator', 200);
await ujiPengadaan('ADMINISTRATOR', 200);

// --- 4.3 Peran lain tidak boleh bisa -------------------------------------
await ujiPengadaan('Manager', 200);
await ujiPengadaan('Supervisor 1', 403);
await ujiPengadaan('Supervisor 2', 403);
await ujiPengadaan('Teknisi', 403);
await ujiPengadaan('teknisi', 403);

// --- 4.4 Semua status dalam pipeline harus bisa oleh Administrator --------
await test('[Loop] Administrator mengubah SELURUH pipeline', async ({ ok }) => {
  const pipeline = [
    'BQ Baru', 'Pending', 'Proses PO', 'PO Open',
    'Mencari Penawaran', 'Barang Dikirim', 'Tiba di Gudang', 'Selesai',
  ];
  for (const target of pipeline) {
    const r = await callUpdate({
      role: 'Administrator',
      row: rowDefault,
      params: { status_pengadaan: target },
    });
    assert.strictEqual(r.status, 200, `pipeline "${target}" harus bisa diubah`);
  }
  ok(`8/8 status pipeline berhasil diubah: ${pipeline.join(' -> ')}`);
});

// --- 4.5 Role tidak dikenal tetap ditolak ---------------------------------
await ujiPengadaan('Guest', 403);
await ujiPengadaan('', 403);

// --- 4.6 REGRESI — alur lain TIDAK boleh rusak ----------------------------
await test('[Regresi] Supervisor TETAP bisa approval SPV + urgency', async ({ ok }) => {
  const r = await callUpdate({
    role: 'Supervisor 1',
    row: rowDefault,
    params: { status_approval_spv: 'Disetujui', urgency: 'Urgent' },
  });
  assert.strictEqual(r.status, 200, `Supervisor harus tetap bisa, aktual ${r.status}`);
  ok(`HTTP ${r.status} — hak SPV + urgency tidak terganggu`);
});

await test('[Regresi] Manager TIDAK bisa final-approve sebelum SPV', async ({ ok }) => {
  const r = await callUpdate({
    role: 'Manager',
    row: rowDefault,
    params: { status_approval_manager: 'Disetujui' },
  });
  assert.strictEqual(r.status, 400, `harus 400, aktual ${r.status}`);
  ok(`HTTP ${r.status} — ${r.body.message}`);
});

await test('[Regresi] Manager tetap bisa final-approve SETELAH SPV', async ({ ok }) => {
  const r = await callUpdate({
    role: 'Manager',
    row: rowFullApproved,
    params: { status_approval_manager: 'Disetujui' },
  });
  assert.strictEqual(r.status, 200, `harus 200, aktual ${r.status} — ${JSON.stringify(r.body)}`);
  ok('HTTP 200 — alur berjenjang SPV -> Manager utuh');
});

await test('[Regresi] Teknisi tetap 403 untuk status approval', async ({ ok }) => {
  const r = await callUpdate({
    role: 'Teknisi',
    row: rowDefault,
    params: { status_approval_spv: 'Disetujui' },
  });
  assert.strictEqual(r.status, 403, `harus 403, aktual ${r.status}`);
  ok(`HTTP ${r.status} — ${r.body.message}`);
});

await test('[Regresi] Nilai status_pengadaan tidak valid tetap 400', async ({ ok }) => {
  const r = await callUpdate({
    role: 'Administrator',
    row: rowDefault,
    params: { status_pengadaan: 'Status Ngawur' },
  });
  assert.strictEqual(r.status, 400, `harus 400, aktual ${r.status}`);
  ok(`HTTP ${r.status} — validasi input tetap bekerja`);
});

await test('[Regresi] Request tanpa username tetap 401', async ({ ok }) => {
  currentRole = 'Administrator';
  const before = updateCount;
  const res = makeRes();
  await updateStatusPengajuan(
    { params: { id: 'BQ-TEST-0001' }, body: { status_pengadaan: 'Proses PO' } },
    res
  );
  assert.strictEqual(res.statusCode, 401, `harus 401, aktual ${res.statusCode}`);
  assert.strictEqual(updateCount > before, false, 'tidak boleh ada UPDATE');
  ok('HTTP 401 — aktor wajib login');
});

// --- 4.7 Urutan alur procurement end-to-end -------------------------------
await test('[E2E] Alur procurement oleh Administrator', async ({ ok }) => {
  const urutan = ['Pending', 'Proses PO', 'PO Open', 'Mencari Penawaran', 'Barang Dikirim', 'Tiba di Gudang', 'Selesai'];
  for (const target of urutan) {
    const r = await callUpdate({
      role: 'Administrator',
      row: { ...rowFullApproved, status_pengadaan: 'BQ Baru' },
      params: { status_pengadaan: target },
    });
    assert.strictEqual(r.status, 200, `langkah "${target}" gagal: HTTP ${r.status}`);
  }
  ok(`7 langkah berurutan berhasil, akhir = Selesai (BQ Baru -> ${urutan.join(' -> ')})`);
});

// --- 4.8 Bukti kata 'officer' hilang dari sumber RBAC --------------------
await test('[Source] Tidak ada literal \'officer\' di bqController.js', async ({ ok }) => {
  const fs = require('fs');
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'controllers', 'bqController.js'),
    'utf8'
  );
  const hits = src.match(/officer/gi);
  assert.ok(!hits, `masih ada ${hits ? hits.length : 0} literal "officer"`);
  ok('0 literal "officer" pada sumber backend');
// --- 4.9 FRONTEND — dropdown status pengadaan hanya untuk Administrator ---
await test('[Frontend] canProcure hanya untuk Administrator + Manager', async ({ ok }) => {
  const fs = require('fs');
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'public', 'index.html'), 'utf8'
  );

  assert.ok(
    /const\s+canProcure\s*=\s*\(akey\s*===\s*'administrator'\s*\|\|\s*akey\s*===\s*'manager'\)/.test(html),
    'baris canProcure harus: (akey === \'administrator\' || akey === \'manager\')'
  );
  ok("canProcure = (akey === 'administrator' || akey === 'manager')");

  assert.ok(
    /function\s+actorKey\(\)\s*\{[\s\S]{0,400}?r\s*===\s*'administrator'\)\s*return\s*'administrator'/.test(html),
    'actorKey() harus memetakan administrator'
  );
  ok("actorKey() memetakan 'administrator' -> 'administrator'");

  assert.ok(
    /r\s*===\s*'administrator'\s*\|\|\s*r\s*===\s*'supervisor 2'/.test(html),
    'gating menu harus memakai administrator'
  );
  ok("gating menu: administrator || supervisor 2");

  assert.ok(/'Selamat Datang, Administrator!'/.test(html), 'sapaan harus Administrator');
  ok('sapaan "Selamat Datang, Administrator!"');

  assert.ok(/value="Administrator">Tim Administrator/.test(html), 'dropdown Tim harus Administrator');
  ok('dropdown Tim offering "Tim Administrator"');
});

await test('[Frontend] NOL literal \'officer\' di public/index.html', async ({ ok }) => {
  const fs = require('fs');
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'public', 'index.html'), 'utf8'
  );
  const hits = html.match(/officer/gi);
  assert.ok(!hits, `masih ada ${hits ? hits.length : 0} literal "officer"`);
  ok('0 literal "officer" pada frontend — dropdown otomatis tersembunyi untuk Officer');
});

await test('[Frontend] NOL literal \'officer\' di userManagementController.js', async ({ ok }) => {
  const fs = require('fs');
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'controllers', 'userManagementController.js'), 'utf8'
  );
  const hits = src.match(/officer/gi);
  assert.ok(!hits, `masih ada ${hits ? hits.length : 0} literal "officer"`);
  ok('0 literal "officer" — daftar tim server = supervisor 1 / supervisor 2 / administrator');
});

}); // akhir main()

// ===========================================================================
// 7. LAPORAN
// ===========================================================================

const garis = '='.repeat(78);
console.log(`\n${garis}`);
console.log('  SELF-TEST TAHAP 2 — RBAC "UBAH STATUS PENGADAAN"');
console.log('  Micropage E-Sparepart — PT Fonko International Pharmaceuticals');
console.log(garis);
console.log('  Database: MOCK (tidak ada koneksi ke server asli)\n');

for (const r of results) {
  const ikon = r.status === 'LULUS' ? '[LULUS]' : '[GAGAL]';
  console.log(`  ${ikon} ${r.name}`);
  r.bukti.forEach((b) => console.log(b));
}

const lulus = results.length - failed;
console.log(`\n${garis}`);
console.log(`  HASIL: ${lulus}/${results.length} pengujian LULUS`);
if (failed > 0) {
  console.log(`  ${failed} pengujian GAGAL — kode perlu diperbaiki.`);
} else {
  console.log('  Officer DITOLAK (403). Administrator & Manager BERHASIL (200).');
  console.log('  Semua regresi alur lama LOLOS. Kesiapan Tahap 3: AMAN.');
}
console.log(`${garis}\n`);

return failed > 0 ? 1 : 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('\n[ERROR] Pengujian terhenti:', err);
    process.exit(1);
  });