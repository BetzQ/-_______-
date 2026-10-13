# Verifikasi Kode: Form BQ Tidak Menampilkan Stok (dasar jawaban POIN 1)

**Lokasi aplikasi:** `Micropage E-Sparepart - app - deployed` — file `public/index.html`
**Tanggal verifikasi:** 11 Oktober 2026
**Tujuan:** memastikan klaim Kak Fadhil bahwa "D1 tidak connected ke 2.0" benar untuk implementasi aktual.

---

## Hasil Verifikasi

### 1. Dropdown Item Code di Form BQ → hanya kode + deskripsi (TANPA stok)

`public/index.html:1936-1945` — filter pencarian item code:

```js
function itemcodeResults() {
  const q = ($('f-itemcode').value || '').trim().toLowerCase();
  const base = q
    ? SPAREPARTS_ALL.filter(function (p) {
        return String(p.item_code || '').toLowerCase().includes(q) ||
               String(p.deskripsi || '').toLowerCase().includes(q);
      })
    : SPAREPARTS_ALL.slice();
  return base.slice(0, 80);
}
```

`public/index.html:1955-1962` — render daftar hasil:

```js
list.innerHTML = res.map(function (p, i) {
  ...
  return '<div data-index="' + i + '" class="...">' +
    '<span class="font-mono text-xs text-sky-300">' + esc(p.item_code) + '</span>' +
    '<span class="text-[11px] text-slate-400 truncate">' + esc(p.deskripsi || '') + '</span>' +
  '</div>';
}).join('');
```

**Kesimpulan:** item yang dirender hanya `item_code` dan `deskripsi`. **Tidak ada `qty_on_hand`** — angka sisa stok sama sekali tidak tampil di form BQ.

### 2. `qty_on_hand` hanya dipakai DI LUAR form BQ

Kolom `qty_on_hand` muncul di modul:
- **On Hand Stock / Critical Part List** — `index.html:1165-1364` (tabel stok, filter low/out, export).
- **Layout Rak** — `index.html:1833-1915` (jumlah pcs per sel vs min_stock).
- **Dashboard KPI** (role selain teknisi).

Namun **tidak** direferensikan di fungsi pencarian/autocomplete item code form BQ manapun (`itemcodeResults`, `renderItemcodeList`, `filterItemCodes`, `itemcodeSelect`, `itemcodeKeydown` — `index.html:1936-1999`).

### 3. Kesimpulan Final

| Klaim | Status |
|---|---|
| "Form BQ tidak bisa lihat stok ada berapa" | ✅ **BENAR** — tidak ada angka stok di form |
| "D1 (Master Stok & Critical Part) tidak terhubung ke proses 2.0 (Pengajuan Form BQ)" | ✅ **BENAR** — sesuai implementasi sekarang |
| Teknisi memeriksa stok via menu terpisah (On Hand Stock / Layout Rak) | ✅ **BENAR** |

> **Konsekuensi jawaban:** DFD Level 0 tidak perlu mengubah apa pun — D1 memang tidak menyentuh 2.0. Jika di kemudian hari dropdown Form BQ di-update untuk menampilkan sisa stok, barulah hubungan D1→2.0 sah ditambahkan.