const pool = require('../config/database');

async function getAllSpareparts(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak ' +
      'FROM spareparts ORDER BY is_critical DESC, deskripsi ASC'
    );
    return res.status(200).json({ status: 'ok', data: rows });
  } catch (error) {
    console.error('[Sparepart Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data sparepart',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * GET /api/spareparts/summary
 * Ringkasan real-time untuk KPI dashboard:
 *  - total item, jumlah critical part
 *  - jumlah item stok rendah (qty_on_hand <= min_stock, min_stock > 0)
 *  - jumlah item stok habis (qty_on_hand = 0)
 *  - daftar item yang perlu segera dipesan (stok rendah, urut paling defisit)
 */
async function getStockSummary(req, res) {
  try {
    const { rows: countRows } = await pool.query(
      `SELECT
         COUNT(*)                                                   AS total_item,
         COALESCE(SUM(CASE WHEN is_critical = TRUE THEN 1 ELSE 0 END), 0) AS total_critical,
         COALESCE(SUM(CASE WHEN min_stock > 0 AND qty_on_hand <= min_stock THEN 1 ELSE 0 END), 0) AS stok_rendah,
         COALESCE(SUM(CASE WHEN qty_on_hand = 0 THEN 1 ELSE 0 END), 0) AS stok_habis
       FROM spareparts`
    );
    const counts = countRows[0];

    const { rows: lowStock } = await pool.query(
      `SELECT item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak
         FROM spareparts
        WHERE min_stock > 0 AND qty_on_hand <= min_stock
        ORDER BY (min_stock - qty_on_hand) DESC, is_critical DESC, deskripsi ASC
        LIMIT 12`
    );

    return res.status(200).json({
      status: 'ok',
      data: {
        total_item: Number(counts.total_item),
        total_critical: Number(counts.total_critical),
        stok_rendah: Number(counts.stok_rendah),
        stok_habis: Number(counts.stok_habis),
        low_stock: lowStock,
      },
    });
  } catch (error) {
    console.error('[Sparepart Summary Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil ringkasan stok',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

/**
 * GET /api/spareparts/rak
 * Layout rak gudang, diambil dari kolom `lokasi_rak` (Lokator pada On_Hand_Stock.xlsx).
 *
 * Nilai `lokasi_rak` di data nyata beragam sekali, jadi parser dibuat berlapis:
 *  1. Satu field bisa berisi BANYAK lokasi: "G-3-7 dan G-3-8", "N3 dan R-3-14 dan R-3-12".
 *     Item semacam itu dihitung SATU KALI pada total_item, tapi muncul di setiap sel rak
 *     yang relevan. Lihat total_penempatan untuk jumlah kemunculan sebenarnya.
 *  2. Kode rak lengkap : "A-4-15B" -> rak A, baris 4, kolom 15B.
 *     Varian tanda hubung di akhir dinormalkan: "D-1-18-B" -> "D-1-18B".
 *  3. Kode rak ringkas  : "M3", "L3", "E1" -> rak M, baris 3, kolom "".
 *  4. Zona/area        : "Ruang Filter", "Flammable", "Rak Kabel", "Box Kennedy".
 *     Dikelompokkan sebagai grup bertipe "zona" (bukan dijejalkan ke satu wok "LAINNYA"),
 *     dan typo yang merujuk tempat sama digabung lewat ZONA_CANONIK.
 *  5. Tidak ber-lokasi : "", "Not Located", atau angka tak bermakna ("0", "1").
 *     Item ini tidak masuk grid rak, tapi bisa dilihat lewat tab "Tanpa Lokasi"
 *     (?unlocated=1) supaya teknisi tahu data mana yang perlu dilengkapi.
 *
 * @query unlocated=1  -> daftar item tanpa lokasi (paginated + pencarian)
 * @query limit,offset -> pagination untuk mode unlocated
 * @query q            -> filter item_code/deskripsi untuk mode unlocated
 */

// Nilai yang secara semantik berarti "tidak ada lokasi", bukan nama tempat.
const TANPA_LOKASI = ['not located', 'notlocated', 'tidak ada lokasi', 'belum ada lokasi', 'n/a', 'na', '-', 'kosong'];

// Pemetaan zona ke label baku. Kunci lowercase. Menangkap typo yang merujuk
// lokasi yang sama supaya tidak terpecah jadi beberapa grup ("Ruang Filter",
// "Ruang filter", "Ruang Flter" -> satu grup "Ruang Filter").
const ZONA_CANONIK = {
  'atas flammable': 'Atas Flammable',
  'biru': 'Biru',
  'box kennedy': 'Box Kennedy',
  'dekat dumpwaiter': 'Dekat Dumpwaiter',
  'dw': 'DW',
  'flammable': 'Flammable',
  'kardus l3': 'Kardus L3',
  'kennedy': 'Kennedy',
  'klaris': 'Klaris',
  'putih': 'Putih',
  'rak kabel': 'Rak Kabel',
  'ruang filter': 'Ruang Filter',
  'ruang flter': 'Ruang Filter', // typo yang ada di data
  'sparepart': 'Sparepart',
  'tools': 'Tools',
  'wwtp': 'WWTP',
};

// Mengubah satu field lokasi mentah menjadi daftar token lokasi yang sudah dibersihkan.
function tokenisasiLokasi(raw) {
  const v = String(raw == null ? '' : raw).trim().replace(/\s+/g, ' ');
  if (!v) return [];
  if (TANPA_LOKASI.indexOf(v.toLowerCase()) >= 0) return [];
  // Angka murni ("0", "1") adalah sisa isi sel kosong di Excel, bukan lokasi.
  if (/^\d+$/.test(v)) return [];
  return v
    .split(/\s+(?:dan|and|&)\s+|\s*[,;/]\s*/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Menerjemahkan satu token menjadi { tipe, rak, baris, kolom, urut }, atau null bila itu nama zona.
function parseLokasi(raw) {
  let v = String(raw).trim();
  // "D-1-18-B" -> "D-1-18B" (huruf penanda kolom terselip sebagai segment terpisah).
  const glued = v.match(/^([A-Za-z]+)-(\d+)-(\d+)-([A-Za-z])$/);
  if (glued) v = `${glued[1]}-${glued[2]}-${glued[3]}${glued[4]}`;

  const lengkap = v.match(/^([A-Za-z]+)-(\d+)(?:-(\d+[A-Za-z]?))?$/);
  if (lengkap) {
    const kolom = lengkap[3] || '';
    return {
      tipe: 'rak',
      rak: lengkap[1].toUpperCase(),
      baris: parseInt(lengkap[2], 10),
      kolom,
      urut: parseInt(lengkap[2], 10) * 1000 + (parseInt(kolom, 10) || 0),
    };
  }

  // Bentuk ringkas tanpa tanda hubung: "M3" -> rak M, baris 3.
  const ringkas = v.match(/^([A-Za-z]+)(\d+)$/);
  if (ringkas) {
    return {
      tipe: 'rak',
      rak: ringkas[1].toUpperCase(),
      baris: parseInt(ringkas[2], 10),
      kolom: '',
      urut: parseInt(ringkas[2], 10) * 1000,
    };
  }

  return null;
}

// Daftar item yang belum punya lokasi rak yang berguna (kosong / "Not Located" / angka).
async function listUnlocated(req, res) {
  const where = `(
       lokasi_rak IS NULL
    OR BTRIM(lokasi_rak) = ''
    OR LOWER(BTRIM(lokasi_rak)) = ANY($1)
    OR BTRIM(lokasi_rak) ~ '^[0-9]+$'
  )`;

  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 200);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  const q = String(req.query.q || '').trim();

  const params = [TANPA_LOKASI];
  let search = '';
  if (q) {
    params.push(`%${q}%`);
    search = ` AND (item_code ILIKE $${params.length} OR deskripsi ILIKE $${params.length})`;
  }

  const { rows: meta } = await pool.query(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE is_critical)::int AS kritis,
            count(*) FILTER (WHERE qty_on_hand = 0)::int AS stok_habis
       FROM spareparts WHERE ${where}${search}`,
    params
  );

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT item_code, deskripsi, qty_on_hand, min_stock, is_critical,
            NULLIF(BTRIM(lokasi_rak), '') AS lokasi_rak,
            CASE
              WHEN lokasi_rak IS NULL OR BTRIM(lokasi_rak) = ''  THEN 'kosong'
              WHEN BTRIM(lokasi_rak) ~ '^[0-9]+$'                THEN 'angka'
              ELSE LOWER(BTRIM(lokasi_rak))
            END AS alasan
       FROM spareparts
      WHERE ${where}${search}
      ORDER BY is_critical DESC NULLS LAST, item_code ASC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const m = meta[0] || { total: 0, kritis: 0, stok_habis: 0 };
  return res.status(200).json({
    status: 'ok',
    total: m.total,
    kritis: m.kritis,
    stok_habis: m.stok_habis,
    limit,
    offset,
    q,
    data: rows.map((x) => ({
      item_code: x.item_code,
      deskripsi: x.deskripsi,
      qty_on_hand: Number(x.qty_on_hand) || 0,
      min_stock: Number(x.min_stock) || 0,
      is_critical: x.is_critical === true,
      lokasi_rak: x.lokasi_rak || null,
      alasan: x.alasan,
    })),
  });
}

async function getRackLayout(req, res) {
  try {
    if (String(req.query.unlocated || '') === '1') return await listUnlocated(req, res);

    const { rows } = await pool.query(
      `SELECT item_code, deskripsi, qty_on_hand, min_stock, max_stock, is_critical, lokasi_rak
         FROM spareparts
        WHERE lokasi_rak IS NOT NULL AND TRIM(lokasi_rak) <> ''
        ORDER BY lokasi_rak ASC, deskripsi ASC`
    );

    const rakMap = new Map();
    const itemTerpakai = new Set();
    const zonaTanpaAlias = new Set();
    let totalPenempatan = 0;

    rows.forEach((r) => {
      const tokens = tokenisasiLokasi(r.lokasi_rak);
      if (!tokens.length) return;

      const sel = {
        item_code: r.item_code,
        deskripsi: r.deskripsi,
        qty_on_hand: Number(r.qty_on_hand) || 0,
        min_stock: Number(r.min_stock) || 0,
        is_critical: r.is_critical === true,
      };
      itemTerpakai.add(r.item_code);

      tokens.forEach((token) => {
        const p = parseLokasi(token);
        // Tanpa kode rak -> perlakukan sebagai zona supaya tetap bisa dicari,
        // bukan tercebur ke dalam satu wok "LAINNYA".
        const keyZona = token.toLowerCase();
        const zona = p ? null : (ZONA_CANONIK[keyZona] || token);
        const rakKey = p ? p.rak : zona;
        if (!p && !ZONA_CANONIK[keyZona]) zonaTanpaAlias.add(zona);

        const barisKey = p ? String(p.baris) : token;
        const kolomKey = p ? p.kolom : token;

        if (!rakMap.has(rakKey)) {
          rakMap.set(rakKey, {
            rak: rakKey,
            tipe: p ? 'rak' : 'zona',
            label: zona,
            total_item: 0,
            total_qty: 0,
            item_kritis: 0,
            baris: new Map(),
          });
        }
        const g = rakMap.get(rakKey);
        g.tipe = p ? 'rak' : 'zona';
        g.total_item += 1;
        g.total_qty += sel.qty_on_hand;
        if (sel.is_critical) g.item_kritis += 1;
        totalPenempatan += 1;

        if (!g.baris.has(barisKey)) {
          g.baris.set(barisKey, { baris: barisKey, urut: p ? p.baris : 9999, kolom: new Map() });
        }
        const b = g.baris.get(barisKey);
        if (!b.kolom.has(kolomKey)) b.kolom.set(kolomKey, []);
        b.kolom.get(kolomKey).push(sel);
      });
    });

    const data = Array.from(rakMap.values())
      .map((g) => {
        const baris = Array.from(g.baris.values())
          .sort((a, b) => a.urut - b.urut || String(a.baris).localeCompare(String(b.baris)))
          .map((b) => ({
            baris: b.baris,
            kolom: Array.from(b.kolom.entries())
              .sort((a, c) => {
                const na = parseInt(a[0], 10), nc = parseInt(c[0], 10);
                return (isNaN(na) ? 9999 : na) - (isNaN(nc) ? 9999 : nc)
                  || String(a[0]).localeCompare(String(c[0]));
              })
              .map(([kode, items]) => ({
                kode,
                total_item: items.length,
                total_qty: items.reduce((s, x) => s + x.qty_on_hand, 0),
                items: items.map((x) => ({
                  item_code: x.item_code,
                  deskripsi: x.deskripsi,
                  qty_on_hand: x.qty_on_hand,
                  min_stock: x.min_stock,
                  is_critical: x.is_critical,
                })),
              })),
          }));
        return {
          rak: g.rak,
          tipe: g.tipe,
          label: g.label,
          total_item: g.total_item,
          total_qty: g.total_qty,
          item_kritis: g.item_kritis,
          baris,
        };
      })
      // Semua rak (A..Z) dulu, grup zona di akhir.
      .sort((a, b) => (a.tipe !== b.tipe ? (a.tipe === 'rak' ? -1 : 1) : a.rak.localeCompare(b.rak, 'id')));

    // Hitung terpisah supaya frontend bisa menampilkan angka ini di tab "Tanpa Lokasi".
    const { rows: belum } = await pool.query(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE is_critical)::int AS kritis
         FROM spareparts
        WHERE lokasi_rak IS NULL
           OR BTRIM(lokasi_rak) = ''
           OR LOWER(BTRIM(lokasi_rak)) = ANY($1)
           OR BTRIM(lokasi_rak) ~ '^[0-9]+$'`,
      [TANPA_LOKASI]
    );

    const belumLokasi = belum[0] || { total: 0, kritis: 0 };
    return res.status(200).json({
      status: 'ok',
      count: data.length,
      total_item: itemTerpakai.size,
      total_penempatan: totalPenempatan,
      zona: data.filter((d) => d.tipe === 'zona').length,
      zona_tanpa_alias: Array.from(zonaTanpaAlias),
      belum_ber_lokasi: belumLokasi.total,
      belum_ber_lokasi_kritis: belumLokasi.kritis,
      // Total katalog = item unik yang terpetakan + item tanpa lokasi.
      // (Baris dengan lokasi junk seperti "Not Located" masuk hitungan kedua,
      //  bukan total_item, jadi keduanya dijumlahkan tanpa dobel.)
      total_katalog: itemTerpakai.size + belumLokasi.total,
      // Berapa baris yang kolom lokasi_rak-nya saja tidak kosong (belum tentu
      // bisa dipetakan: ada "Not Located" dan angka sisa seperti "0"/"1").
      lokasi_terisi: rows.length,
      data,
    });
  } catch (error) {
    console.error('[Rack Layout Error]', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil layout rak',
      ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
    });
  }
}

module.exports = { getAllSpareparts, getStockSummary, getRackLayout };
