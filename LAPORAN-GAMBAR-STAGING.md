# Laporan — gambar terpotong & gambar yang hilang dari situs lama

Tanggal: Selasa, 20 Oktober 2026 (jam WITA)
Permintaan klien (Irene, WhatsApp): gambar yang di-upload terpotong, dan
"there are many missing pictures" dibanding situs lama.

## Catatan waktu pengerjaan

| Jam | Pekerjaan |
| --- | --- |
| 12:26 | Mulai — baca permintaan, cek kode gambar & Sanity |
| 12:26–12:33 | Cari penyebab gambar terpotong, perbaiki kodenya |
| 12:33–12:46 | Crawl staging: 57 halaman, 499 file media → 294 gambar konten; sidik jari visual vs 206 aset Sanity + 103 file lokal |
| 12:46–13:00 | Cek ulang yang lolos (keypoint matching untuk foto before/after hasil crop Canva), review visual, tentukan posisi tiap gambar |
| 13:00–13:10 | Perbaiki tampilan daftar ikon, tulis script + data, dry run |
| 13:09 | Upload percobaan pertama putus di file ke-4 (koneksi) — ditambah retry |
| 13:10–13:18 | Upload 131 file + tulis 37 draft di Sanity |
| 13:18–13:38 | Verifikasi di localhost (desktop + HP), cek ulang script aman dijalankan dua kali, laporan |
| **Total** | **± 1 jam 11 menit** (12:26:53 → 13:38) |

Jam 12:26:53, 12:46, 13:09, 13:10:56–13:18:03 dan 13:38 tercatat dari log; batas fase lainnya perkiraan.

### Deploy (perbaikan crop saja)

| Jam | Pekerjaan |
| --- | --- |
| ± 15:00–15:07 | Build produksi lokal 2× (cek semua halaman publik tetap statis), commit `2ff40cd` |
| 15:07:44 | Push ke `office/main` → Vercel |
| 15:09:46 | Live: diagram Sylfirm X tampil utuh (bingkai 510×156 = rasio gambar 3,27:1) |
| 15:10 | Selesai — **± 11 menit** |

**Total keseluruhan: ± 1 jam 22 menit.**

Atas permintaan user, restore gambar dari staging **ditunda**: 37 draft tetap di
Sanity, belum dipublish; script, data dan laporan ini belum di-commit.

## 1. Gambar terpotong

Yang di-upload Irene adalah diagram 3 panel Sylfirm X (1055×323, rasio
3,27:1) di section *How Sylfirm X RF Microneedling work?*. Gambar di section
treatment selalu dipotong ke bingkai 16:9, kecuali kotak **Show the whole
image** dicentang — dan kotak itu tidak diketahui klien. Hasilnya cuma panel
tengah yang kelihatan.

Perbaikan (kode, belum di-deploy):

- Gambar di section treatment dan di rich text (artikel blog) sekarang
  **tampil utuh secara default**. Kotak "Show the whole image" jadi opsi
  untuk *mematikan*, kalau foto memang mau dipotong ke bingkai.
- Kalau gambar di-crop di Studio, bentuk bingkainya ikut hasil crop.
- Saat ini belum ada foto lain di section treatment, jadi tidak ada halaman
  yang tampilannya berubah selain diagram ini.

## 2. Gambar yang hilang

Semua gambar di 57 halaman staging dibandingkan dengan isi situs baru —
lewat nama file, sidik jari visual, dan keypoint matching (yang menangkap
foto before/after yang sama tapi sudah di-crop ulang di Canva).

| | Jumlah |
| --- | --- |
| Gambar konten di staging (tanpa logo, logo partner, ikon footer) | 294 |
| Sudah ada di situs baru (bentuk lain / crop Canva) — **tidak di-upload ulang** | 141 |
| Benar-benar hilang | 153 |
| File yang di-upload ke Sanity | 131 (128 dari staging, 3 file lokal situs) |
| Posisi gambar yang diisi | 192 |
| Duplikat file di media library setelah upload | 0 |

Di WordPress ada 3 pasang gambar yang sama di-upload dua kali — masing-masing
di-upload sekali saja dan dipakai di dua tempat.

### Yang ditambahkan (semua masih DRAFT)

- **25 halaman treatment**
  - Ikon di daftar "Why choose…" / "What can be treated…": satu ikon per poin,
    seperti di situs lama (layout *iconCards*, sama dengan XERF).
  - 8 daftar yang tadinya bullet biasa diubah jadi satu blok per poin supaya
    bisa diberi ikon. Teksnya tetap sama persis.
  - Foto & diagram di section yang sesuai: HIFU, Sylfirm X, IV Drip, Exosome,
    Juvelook, Skin Booster, Lysiwave, HIPEX, IPL, Sculptra, PRP, Fat
    Dissolving, Facial, Korean Botox, Eye Rejuvenation, Collagen Stimulator,
    Autologous Micrograft (5 langkah, layout kartu), dan lainnya.
- **Before & After** (`/before-after`): +35 foto ke board Botox, Lip Filler,
  Dermal Filler, HIFU, Muscle Sculpting, Lysiwave; plus 2 board baru —
  **HIFU Body** dan **Autologous Micrograft Hair Restoration** — yang langsung
  tampil di halaman treatment masing-masing.
- **10 artikel blog**: foto di dalam artikel, termasuk 6 foto before/after di
  dua artikel Botox (pakai foto Canva yang sudah ada — pasien yang sama).
- **Gift card**: 6 desain voucher (Christmas, Thanksgiving, Birthday, Wedding,
  Honeymoon, Healthy Look) sebagai galeri di atas form.

### Yang sengaja tidak ditambahkan

- **Foto before/after Exosome (3)** — ada tulisan "Credit to …" dari
  produsen, bukan pasien klinik. Perlu konfirmasi klinik dulu.
- **Ikon di dalam artikel blog** (Hydra Facial, Liquid Lifting, Personalize
  Mesotherapy) — rich text artikel tidak punya layout ikon; ikon akan tampil
  sebesar kolom.
- Gambar kartu/thumbnail di halaman daftar (Treatments, Blog, Home) — situs
  baru sudah punya gambar sendiri di posisi itu.
- Beberapa foto yang tidak punya tempat di situs baru (mis. foto "Popular
  areas" Botox & Dermal Filler, foto menu Medi Facial).

### Perlu diketahui

- Halaman treatment hanya menampilkan **6 foto pertama** dari board-nya. Foto
  baru yang ditambahkan di akhir board lama tampil di `/before-after`, belum
  di halaman treatment.
- Form gift card belum punya pilihan desain — galeri hanya menampilkan desain.
- `drafts.treatment.collagen-stimulator` sudah ada sebelumnya (edit dari
  editor). Gambar ditambahkan ke draft itu, jadi publish-nya ikut membawa
  edit lama tersebut.

## Urutan go-live (penting)

1. **Deploy kode dulu.** Tampilan ikon versi lama hanya menampilkan judul
   poin; kalau draft dipublish sebelum deploy, kalimat di bawah setiap poin
   hilang dari live site.
2. Baru **publish draft** di Studio (37 dokumen: 25 treatment, 10 post,
   `page.before-after`, `page.gift-card`).

Script: `scripts/sanity/restore-staging-images.ts` (data:
`restore-staging-images.data.json`). Aman dijalankan ulang — file yang sudah
di-upload dan posisi yang sudah terisi dilewati.
