# Pemulihan isi dari staging — 21 Oktober 2026

Sumber: https://staging.healthylook-aesthetic.com. Daftar Blog tetap hanya artikel, sesuai arahan pengguna; kartu treatment tidak ditambahkan. Gambar tambahan blog yang dibatalkan tidak dibawa ke draft pemulihan.

## Hasil

14 artikel dicocokkan dengan isi sumber: paragraf, subjudul, daftar, isi sel tabel, dan tautan. Sebagian besar teks sudah ada, tetapi migrasi sebelumnya meratakan tabel menjadi paragraf dan menggandakan sebagian daftar. Sebagian teks pendek dan tautan belum terbawa. Pemulihan mengembalikan 11 tabel di 6 artikel, 82 butir daftar, dan 21 anotasi tautan.

- botox-before-after
- how-long-does-botox-last
- how-long-does-lip-filler-last
- how-many-units-of-botox-for-forehead
- hydra-facial-in-ubud
- liquid-lifting
- mesotherapy-for-rejuvenating-skin-hair
- non-surgical-face-lift
- nucleofill-vs-rejuran
- personalize-mesotherapy-ubud-bali
- revitalize-skin-with-hifu-treatment
- skin-clinic-bali
- what-is-microneedling-good-for
- when-to-start-botox-bali

Artikel baru xerf-vs-hifu dipertahankan karena tidak ada isi artikel padanannya di staging. Metadata dan gambar yang sudah dipublish dipertahankan. Dua gambar yang sudah ada di artikel microneedling tetap ada; gambar baru tidak ditambahkan.

Pemindaian 42 halaman nonblog menemukan tiga tambahan substantif yang dipulihkan: penjelasan teknologi IPL (wavelength dan pendingin), manfaat PRP untuk scalp, serta cara menukar gift card dan membayar selisih. Teks PRP/T-Lab dan produk dermal filler yang lebih baru tidak ditimpa. Perbedaan testimonial dan navigasi lama tidak dianggap sebagai konten yang terhapus. Pemindaian ini bukan jaminan kesamaan seluruh elemen visual/harga/formulir.

## Status

Semua perubahan disimpan sebagai **draft Sanity**, belum dipublish. Dokumen publik tidak diubah. Total dokumen untuk ditinjau/publish: 14 post, treatment.ipl, treatment.prp, page.gift-card. Kode renderer yang ada sudah mendukung tabel dan daftar; pemulihan konten tidak memerlukan deploy renderer baru.

## Verifikasi

Pemeriksaan independen membandingkan teks di luar batas ekstraksi, urutan heading/list dan 11 tabel dengan sumber. Isi sumber tercakup; dokumen publik, metadata draft, dan referensi gambar publik tetap sama. Preview lokal menunjukkan tabel desktop dan penyajian kartu di HP. Backup lengkap dan hasil pemeriksaan tersedia di folder sesi lokal:

C:/Users/asus/.codex/visualizations/2026/10/21/01a15d8b-86fd-7330-96c7-45772f2c85ac

Script pemulihan berjalan dry run secara default; --apply hanya menulis draft. Data sumber tersimpan bersama script di scripts/sanity/. Backup disimpan sebelum mutasi.

## Update 22 Oktober 2026: blog sudah dipublish

Pemeriksaan ulang 14 artikel staging (teks, sel tabel, daftar, tautan, gambar): semua teks staging sudah ada di draft. Sisa perbedaan hanya label tombol "Book Now" dan tautan kosong `http://` yang membungkus jawaban FAQ di WordPress.

- 13 post dipublish lewat `scripts/sanity/sync-blog-from-staging.cjs`. Tabel, daftar, dan tautan dari pemulihan 21 Oktober sekarang tampil di live.
- 26 foto artikel staging ditambahkan, masing-masing setelah paragraf yang sama seperti di staging. 22 di antaranya berasal dari audit gambar 20 Oktober, ditambah 4 foto klinik yang waktu itu dilewati: Hydra Facial, Non-Surgical Face Lift, mesin Linear Z (HIFU), dan Skin Clinic. Ikon tetap tidak dibawa.
- **liquid-lifting tidak disentuh.** Artikel ini ditulis ulang dan dipublish editor di Studio pada 22 Oktober pukul 02:29 UTC.
- Enam foto before/after di dua artikel Botox: di staging berupa galeri. Kode website sekarang menampilkan foto yang berurutan sebagai grid (3 kolom di desktop, 2 di HP). Ini baru aktif di live setelah kode di-deploy; sebelum itu foto tampil bersusun satu per baris.
- Draft treatment.ipl, treatment.prp, dan page.gift-card dari 21 Oktober bukan bagian blog, jadi masih draft.

Backup sebelum publish: `C:\Users\asus\hla-sanity-backups\blog-sync-2026-10-22T02-49-44-684Z.json`.
