# TES ROLE: OFFICER → ADMINISTRATOR

**URL: https://e-sparepart-system-tau.vercel.app**

---

## TES 1 — Masuk sebagai Administrator

| Klik | Isi |
|---|---|
| Kolom Username | `ANS` |
| Kolom Password | `ANS1805` |
| Tombol **LOGIN** | |

**HARUS MUNCUL:** tulisan **"Selamat Datang, Administrator!"**
+ 5 kartu menu (Rekapan · **Approval BQ Tahap Supervisor** · Critical Part · On Hand Stock · Layout Rak)

---

## TES 2 — Administrator BOLEH ubah status

| Klik | Isi |
|---|---|
| Kartu **Approval BQ Tahap Supervisor** | |
| Kolom **Cari** | `O-16731` |
| Dropdown **Status Pengadaan** | pilih `Proses PO` |

**HARUS MUNCUL:** toast hijau + status berubah jadi **Proses PO**

---

## TES 3 — Supervisor TIDAK BOLEH

| Klik | Isi |
|---|---|
| Tombol **Logout** | |
| Kolom Username | `INN` |
| Kolom Password | `30INN11` |
| Tombol **LOGIN** | |
| Kartu **Approval BQ Tahap Supervisor** | |
| Kolom **Cari** | `O-16731` |

**HARUS MUNCUL:** kolom **Status Pengadaan = TEKS biasa**, **TIDAK ADA dropdown**

---

## TES 4 — Bukti 403 (opsional, paling kuat untuk juri)

### CARA PAKAI

```
1. Buka browser di  https://e-sparepart-system-tau.vercel.app
2. Tekan F12                    →  tab Console
3. Klik di area Console         →  ketik "allow pasting" lalu Enter
4. Tekan Ctrl + V               →  paste kode di bawah
5. Tekan Enter
6. Lihat hasilnya di Console
```

### KODE YANG DIPASTE

```javascript
(async () => {
  const all = await fetch('/api/pengajuan/all?actor=KSW').then(r => r.json());
  const no = all.data[0].no_registrasi;
  for (const u of ['ANS', 'INN', 'KSW']) {
    const r = await fetch('/api/pengajuan/' + encodeURIComponent(no) + '/status', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username: u, status_pengadaan: 'PO Open' })
    });
    console.log(u, 'HTTP', r.status);
  }
})();
```

### HARUS MUNCUL DI CONSOLE

```
ANS HTTP 200
INN HTTP 403
KSW HTTP 200
```

> **Wajib:** Chrome akan minta ketik `allow pasting` dulu sebelum bisa paste. Itu normal.

---

## ✅ HASIL YANG BENAR

| Tes | Harus muncul |
|---|---|
| 1 | Tulisan "Administrator" + 5 kartu |
| 2 | Toast hijau, status jadi "Proses PO" |
| 3 | Tidak ada dropdown Status Pengadaan |
| 4 | `200` / `403` / `200` |

**Jawaban kalau ditanya:**
> *"Dulu role-nya Officer. Sekarang Administrator. Hak ubah status pengadaan
> hanya Administrator dan Manager. Sudah diuji: role lain dapat error 403."*