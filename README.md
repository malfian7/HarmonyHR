# Harmony HR — Landing Page

Landing page untuk **Harmony HR**, software HR & HRD berbasis cloud yang mengotomatiskan absensi, payroll, reimbursement, dan administrasi HR — dikembangkan oleh [PT Prawathiya Karsa Pradiptha](https://www.pkp.co.id/en/).

Situs statis murni (HTML + CSS + JavaScript), **tanpa build step dan tanpa dependensi**. Cukup upload ke GitHub dan aktifkan GitHub Pages.

## Struktur

```
├── index.html
├── .nojekyll
└── assets/
    ├── css/style.css      ← semua warna, font, dan spacing ada di :root
    ├── js/main.js         ← menu mobile, FAQ, animasi scroll, formulir
    └── images/favicon.svg
```

## Menjalankan lokal

Buka `index.html` di browser, atau jalankan server statis:

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Upload seluruh isi folder ini ke root repo (`index.html` harus di root).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
4. Situs aktif di `https://<username>.github.io/HarmonyHR-LandingPage/`.

## Kustomisasi cepat

**Warna** — ubah variabel di bagian atas `assets/css/style.css`:

| Variabel | Nilai | Dipakai untuk |
|---|---|---|
| `--navy-900` | `#0b2540` | Heading, header gelap, footer |
| `--blue-500` | `#0e92cc` | Aksen utama (sama dengan warna tautan PT PKP di versi lama) |
| `--orange-500` | `#f5a623` | Tombol CTA |
| `--green-500` | `#22b573` | Ikon centang |

**Logo** — logo saat ini adalah ikon SVG sementara. Untuk memakai logo asli, ganti blok `<svg class="brand__mark">` di `index.html` dengan `<img src="assets/images/logo.png" alt="Harmony HR" height="38">`.

**Logo client** — ada komentar HTML di atas bagian CTA (`index.html`) sebagai tempat menambahkan logo client.

**Formulir demo** — ada dua mode:

- `data-endpoint` kosong (default): data dikirim lewat **WhatsApp** dengan pesan yang sudah terisi otomatis.
- Isi `data-endpoint="https://..."` pada `<form id="demo-form">` dengan URL layanan form (Formspree, Getform, Google Apps Script, dll.) untuk mengirim data sebagai JSON via `fetch`.

**Kontak** — nomor telepon, email, WhatsApp, dan alamat tertulis langsung di `index.html` (cari `84311636`, `marketing@pkp.co.id`, `628111568477`).

## Catatan desain

- Mobile-first, responsif (375 px – 1440 px), tanpa scroll horizontal.
- Aksesibilitas: kontras teks ≥ 4.5:1, fokus keyboard terlihat, tautan "lewati ke konten", label form yang selalu tampak, ringkasan error yang bisa difokus, dan dukungan `prefers-reduced-motion`.
- Font: Plus Jakarta Sans (Google Fonts).
- Tampilan dashboard, jadwal, slip gaji, dan grafik di halaman adalah **ilustrasi**; angka hanya contoh.
