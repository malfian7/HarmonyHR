# Harmony HR — Landing Page

Landing page untuk **Harmony HR**, software HR & HRD berbasis cloud yang mengotomatiskan absensi, payroll, reimbursement, dan administrasi HR — dikembangkan oleh [PT Prawathiya Karsa Pradiptha](https://www.pkp.co.id/en/).

Situs statis murni (HTML + CSS + JavaScript), **tanpa build step dan tanpa dependensi**. Font sudah di-host sendiri, jadi tidak ada permintaan ke server pihak ketiga. Cukup upload ke GitHub dan aktifkan GitHub Pages.

## Struktur

```
├── index.html
├── 404.html               ← halaman 404 (noindex) untuk GitHub Pages
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.ico
├── .nojekyll
└── assets/
    ├── css/style.css          ← semua warna & font ada di :root
    ├── js/main.js             ← slip gaji interaktif, menu mobile, FAQ, formulir
    ├── fonts/                 ← Bricolage Grotesque, Hanken Grotesk, IBM Plex Mono (lisensi OFL)
    └── images/                ← logo.svg, logo-light.svg, favicon, ikon PWA, og-image.png (1200×630)
```

## Menjalankan lokal

Gunakan server statis agar font termuat dengan benar (membuka `index.html` langsung lewat `file://` tetap tampil, tetapi preload font akan memunculkan peringatan di konsol):

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Upload seluruh isi folder ini ke root repo (`index.html` harus di root).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pilih branch `main`, folder `/ (root)`, lalu **Save**.
4. Situs aktif di `https://<username>.github.io/HarmonyHR-LandingPage/`.

## Arah desain

Halaman ini berbicara lewat **dokumen nyata dunia HR**, bukan kartu ikon generik:

- **Hero** berupa slip gaji yang "tercetak" lalu dicap *Terkirim*. Slip-nya interaktif: ubah hari hadir dan jam lembur, total gaji ikut berubah. Semua angka hanya contoh.
- **Layanan** disusun sebagai alur data yang memang berurutan: *Kehadiran → Gaji → Keuangan*. Masing-masing memakai dokumennya sendiri (jadwal shift, daftar gaji, jurnal otomatis). Total daftar gaji dan jurnal sengaja cocok (36.070.000).
- **Keuntungan** berupa daftar bertipografi, bukan grid kartu ikon.
- **Gerak** dibatasi pada satu momen utama (slip dicetak + cap), muncul halus saat di-scroll, dan FAQ buka-tutup halus. Bila pengguna mengaktifkan "reduce motion", semuanya dimatikan.

Warna tetap mengikuti desain asli:

| Variabel | Nilai | Dipakai untuk |
|---|---|---|
| `--tinta` | `#0b2540` | Heading, band gelap, footer |
| `--harmoni` | `#0e92cc` | Aksen biru asli |
| `--sinyal` | `#f5a623` | Tombol CTA |
| `--daun` | `#22b573` | Ikon centang |

## SEO

Yang sudah diterapkan:

- **Meta**: title (58 karakter), meta description (155 karakter), `canonical`, `robots` (termasuk `max-image-preview:large`), `hreflang` (`id` dan `x-default`), `lang="id"`.
- **Open Graph dan Twitter Card** (`summary_large_image`) dengan gambar 1200×630 dan teks alternatif, supaya tautan tampil rapi saat dibagikan di WhatsApp, LinkedIn, Facebook, dan X.
- **Structured data (JSON-LD)**: `Organization` (PT Prawathiya Karsa Pradiptha, didirikan 2008-02), `WebSite`, `WebPage`, `SoftwareApplication` (Harmony HR), dan `FAQPage`. Teks FAQ di JSON-LD sama persis dengan FAQ yang tampil di halaman.
- **Struktur halaman**: satu `<h1>`, hierarki `h2`/`h3` tanpa lompatan level, landmark `header`/`nav`/`main`/`footer`, tautan internal berupa anchor yang semuanya valid.
- **File crawl**: `robots.txt`, `sitemap.xml`, dan `404.html` dengan `noindex`.
- **Ikon**: `favicon.ico`, SVG, PNG 32, `apple-touch-icon` 180, ikon 192/512 dan maskable, plus `site.webmanifest`.
- **Performa**: font di-host sendiri dan di-preload, `font-display: swap`, skrip `defer`, tanpa library, tanpa gambar berat (LCP mobile ±1,1 dtk, CLS 0).
- Konten tetap terbaca tanpa JavaScript (`<noscript>`).

Hasil Lighthouse (simulasi mobile dan desktop): Performance, Accessibility, Best Practices, dan SEO semuanya 100.

**Yang wajib Anda sesuaikan setelah situs live**

1. **URL dasar.** Semua URL absolut saat ini memakai alamat GitHub Pages `https://malfian7.github.io/HarmonyHR-LandingPage/`. Jika Anda memakai domain sendiri, ganti di `index.html` (canonical, hreflang, og/twitter, JSON-LD), `sitemap.xml`, `robots.txt`, dan `404.html`. Cara cepat:

   ```bash
   grep -rl "malfian7.github.io/HarmonyHR-LandingPage" . | xargs sed -i 's#https://malfian7.github.io/HarmonyHR-LandingPage/#https://domain-anda.com/#g'
   ```

2. **robots.txt hanya efektif di root domain.** Pada GitHub Pages untuk repo proyek, file ini berada di sub-path sehingga crawler mengabaikannya. Itu tidak masalah untuk halaman ini (semua boleh diindeks), tetapi `Sitemap:` tetap perlu didaftarkan manual di Google Search Console. Dengan domain sendiri, file ini langsung berlaku.
3. **Daftarkan situs** di [Google Search Console](https://search.google.com/search-console) dan [Bing Webmaster Tools](https://www.bing.com/webmasters), lalu kirim `sitemap.xml`.
4. **Uji** structured data di [Rich Results Test](https://search.google.com/test/rich-results) dan pratinjau OG di [opengraph.xyz](https://www.opengraph.xyz).
5. **Perbarui `lastmod`** di `sitemap.xml` dan `dateModified` di JSON-LD setiap kali konten berubah.
6. **Tambahkan `sameAs`** (profil resmi LinkedIn, Facebook, Instagram) pada objek `Organization` bila akun resminya sudah pasti. Saat ini sengaja dikosongkan karena akun Instagram dan TikTok di footer bernama `klinikhub`.

Catatan: kolom `keywords` pada meta tidak dipakai karena sudah diabaikan mesin pencari modern. Skema `offers`/`aggregateRating` juga sengaja tidak dibuat karena belum ada harga atau ulasan yang bisa diverifikasi.

## Kustomisasi cepat

- **Logo**: logo Harmony HR (tanda silang oranye–indigo + wordmark) ada di `assets/images/logo.svg` (latar terang) dan `logo-light.svg` (latar gelap, dipakai di footer). Logo ini dibangun ulang sebagai SVG vektor dari screenshot README lama karena file aslinya tidak ada di repo. Jika punya file logo resmi, timpa kedua file itu dengan nama yang sama.
- **Logo client**: ada komentar HTML di atas bagian CTA sebagai tempat menambahkan logo.
- **Rumus slip gaji**: konstanta ada di bagian "Slip gaji interaktif" pada `assets/js/main.js` (gaji pokok, tunjangan, tarif lembur, potongan per hari).
- **Formulir demo**: bila `data-endpoint` pada `<form id="demo-form">` kosong, data dikirim lewat **WhatsApp** (pesan terisi otomatis). Isi dengan URL layanan form (Formspree, Getform, Google Apps Script, dll.) untuk mengirim JSON via `fetch`.
- **Kontak**: nomor telepon, email, WhatsApp, dan alamat ada langsung di `index.html` (cari `84311636`, `marketing@pkp.co.id`, `628111568477`).

## Aksesibilitas

Kontras teks ≥ 4.5:1, fokus keyboard terlihat, tautan "lewati ke konten", label form selalu tampak, ringkasan error yang bisa difokus, tombol minimal 44 px, dan dukungan `prefers-reduced-motion`.

## Lisensi font

Bricolage Grotesque, Hanken Grotesk, dan IBM Plex Mono berlisensi SIL Open Font License 1.1 (salinan lisensi ada di `assets/fonts/`).
