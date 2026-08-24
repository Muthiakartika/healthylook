# Catatan lanjutan — sistem CMS & dashboard admin

Ditulis untuk melanjutkan pekerjaan di PC lain. Isinya: kondisi terakhir,
langkah berikutnya, dan jebakan-jebakan yang sudah ketemu supaya tidak
diulang dari nol.

---

## ⚠️ LANGKAH NOL — jangan dilewat

Seluruh pekerjaan CMS **belum di-commit**. Commit terakhir di repo masih
`4f00463` (revisi konten), dan di atasnya ada 30 file dimodifikasi + 14 file
baru — termasuk catatan ini — yang hanya hidup di PC ini.

**Sebelum meninggalkan PC ini:**

```bash
git add -A
git commit -m "Add admin dashboard, CMS and database-backed content"
git push origin main
```

Kalau ini terlewat, di PC kantor tidak ada apa-apa untuk dilanjutkan.

**Satu hal yang TIDAK ikut ter-push** (dan memang tidak boleh):
`.env.local` — file itu gitignored karena berisi connection string. Di PC
kantor harus dibuat ulang; isinya ada di bagian setup di bawah.

---

## Setup di PC kantor

```bash
git pull origin main
npm install                 # node_modules tidak ikut git
```

Lalu buat `.env.local` di root project:

```
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
```

`DATABASE_URL` diisi **pooled connection string** dari Neon — host-nya
mengandung `-pooler`. Yang direct membuka koneksi baru tiap invocation
serverless dan akan menghabiskan batas koneksi.

`BLOB_READ_WRITE_TOKEN` opsional; hanya untuk upload gambar. Tanpa itu
seluruh dashboard tetap jalan, hanya menu Images yang bilang belum aktif.

---

## Kondisi terakhir

### Sudah jadi

| Bagian | Keterangan |
|---|---|
| Autentikasi | scrypt dari `node:crypto` (tanpa native addon), sesi server-side yang bisa dicabut, throttle login 8×/15 menit, audit log |
| Peran | `admin` (semua + kelola tim) dan `editor` (semua konten, tanpa kelola tim) |
| Kelola tim | `/admin/users` — tambah editor, ubah peran, reset password, nonaktifkan (sekaligus hapus sesinya) |
| CRUD konten | 7 koleksi, form digenerate dari satu registry, tiap simpan menyimpan versi sebelumnya + tombol restore |
| Import | `/admin/import` — menyalin isi `src/data/` ke database, aman dijalankan dua kali |
| Situs publik | seluruh halaman baca dari database, dengan fallback ke `src/data/` di setiap titik |
| Upload gambar | client upload ke Vercel Blob, pustaka media, alt text, pembersih orphan |
| Editor blok artikel | pengganti textarea JSON, 5 tipe blok, bisa diurutkan, dengan escape hatch JSON |

### Belum

- **Belum pernah dijalankan terhadap Postgres sungguhan.** Login, tambah
  editor, simpan-restore, import, upload — semuanya belum teruji end-to-end.
  Yang sudah terverifikasi: kompilasi, lint, build, penjagaan rute, dan
  perilaku fallback saat database/blob belum dikonfigurasi.
- Belum deploy ke Vercel.
- `BLOB_READ_WRITE_TOKEN` belum diisi, jadi upload masih mati.

---

## Langkah berikutnya, berurutan

```bash
# 1. Pastikan koneksi jalan. Perintah ini menjawab sekaligus:
#    koneksinya benar? skemanya sudah dibuat? isinya apa?
npm run db:check

# 2. Buat tabel
npm run db:migrate

# 3. Buat admin pertama (tidak ada halaman sign-up, memang disengaja)
npm run db:admin

# 4. Jalankan, lalu login di /admin/login
npm run dev
```

Setelah masuk:

1. Buka **Import** → jalankan. Ini menyalin 14 artikel, 32 treatment, copy
   halaman, dokter, dan testimoni ke database.
2. Buka **Team** → tambah satu editor untuk mengecek alurnya. Password
   sementara muncul **sekali** di layar itu.
3. Buka **Blog articles** → edit satu artikel dengan editor blok, simpan.
4. Cek halaman publiknya berubah.

### Yang harus dicek saat pengujian

- Setelah menyimpan, halaman publik berubah **tanpa perlu build ulang**
  (lewat `revalidateTag`).
- Editor yang dinonaktifkan langsung tidak bisa akses, bukan menunggu
  cookie kedaluwarsa.
- Restore versi lama mengembalikan isi yang benar.

---

## Jebakan yang sudah ketemu — jangan diulang

**1. Jangan `next build` saat dev server hidup.**
Keduanya menulis ke `.next`. Build akan menimpa chunk yang sedang dipakai
dev server, dan hasilnya error `Cannot find module './611.js'` yang
membingungkan. Kalau terlanjur: matikan proses node-nya dulu, baru
`rm -rf .next`, baru `npm run dev`. Di Windows urutannya wajib begitu —
folder tidak bisa dihapus selagi prosesnya memegang file.

**2. Halaman publik WAJIB tetap `○` atau `●` di output build.**
Ini properti terpenting seluruh arsitektur. Kalau ada yang berubah jadi
`ƒ` (dynamic), artinya halaman itu query database **tiap request** —
Neon akan dibangunkan terus, compute hours habis, dan pengunjung pertama
setelah idle kena cold start ~1 detik.

Cek tiap habis menyentuh pemanggil di `src/lib/site-content.ts`:

```bash
npx next build | grep -E "○ /|● /|ƒ /"
```

Hanya `/admin/*` dan `/api/*` yang boleh `ƒ`.

**3. Client component tidak bisa baca database.**
Sudah kena tiga kali: mega menu (`navItems.ts`), tab treatment di homepage
(`Treatments.tsx`), dan carousel testimoni. Solusinya sama — resolve di
server component induknya, kirim sebagai props.

**4. Jangan `await` di module scope.**
`FeaturedTreatment` dan `TreatmentHighlights` awalnya melakukan lookup di
module scope. Itu hanya jalan sekali saat modul pertama diimpor lalu
hasilnya dipegang selamanya — jadi konten tidak pernah ikut berubah.
Resolve di dalam komponen.

**5. Upload gambar tidak lewat server, dan itu bukan optimasi.**
Server action dibatasi body 1 MB, fungsi serverless Vercel 4,5 MB dan
tidak bisa dinaikkan. Foto ponsel 3–8 MB. Jadi browser mengirim langsung
ke Blob; server hanya menerbitkan token.

**6. `next/image` menolak host yang tidak terdaftar.**
Gambar hasil upload ada di `*.public.blob.vercel-storage.com`. Sudah
didaftarkan di `images.remotePatterns` pada `next.config.ts`. Kalau
dihapus, gambar upload tampil rusak tanpa pesan apa pun.

**7. Webhook Blob tidak jalan di localhost.**
Makanya baris pustaka ditulis oleh browser setelah upload selesai, bukan
dari `onUploadCompleted`. Konsekuensinya bisa ada file terupload tapi tak
tercatat kalau tab ditutup di sela — layar Images mendeteksi dan
membersihkannya.

---

## Peta file baru

```
src/lib/db.ts              koneksi Postgres (driver `pg`, bukan Neon-specific)
src/lib/schema.sql         6 tabel, aman dijalankan berulang
src/lib/auth.ts            hashing, sesi, peran, audit, throttle
src/lib/auth.shared.ts     konstanta yang aman untuk edge runtime
src/lib/collections.ts     ★ registry: apa yang bisa diedit & bentuk form-nya
src/lib/content.ts         baca/tulis dokumen + cache tag + revalidasi
src/lib/site-content.ts    ★ yang dibaca SITUS PUBLIK, semua ada fallback
src/lib/importContent.ts   penyalin src/data → database
src/middleware.ts          gerbang pertama /admin (bukan gerbang keamanan)
scripts/db.cjs             CLI: check / migrate / admin

src/app/admin/             dashboard
src/app/api/admin/media/   penerbit token upload
src/components/PublicChrome.tsx   menyembunyikan header/footer publik di /admin
```

Dua yang bertanda ★ adalah tempat mulai membaca kalau lupa konteks.

**Menambah field baru** ke treatment/artikel/halaman cukup satu baris di
`collections.ts` — tidak perlu bikin form baru.

---

## Keputusan yang masih terbuka

1. **Neon masih di akun pribadi.** Bisa dipindah kapan saja — tidak ada
   kode khusus Neon, drivernya `pg` standar. Caranya ada di `README.md`
   bagian "Moving the database later". Yang **tidak** ikut pindah sendiri
   adalah gambar di Vercel Blob; kalau nanti diserahkan ke klien,
   pertimbangkan project Vercel-nya langsung di akun klien sejak awal.

2. **IPL & Chemical Peeling → `performedBy: "Nurse"`** adalah inferensi
   saya, bukan pernyataan klinik. Klien hanya bilang "bukan dokter" tanpa
   menyebut siapa. Masih perlu dikonfirmasi.

3. **Empat treatment tidak ada di Excel klien** — botox/korean,
   eye-rejuvenation, facial, profhilo. Data At a glance-nya belum
   dikonfirmasi.

4. **"Exosome Hair"** ada di Excel tapi bukan halaman tersendiri —
   sekarang cuma baris harga di dalam Hair Mesotherapy. Perlu diputuskan
   apakah dijadikan treatment sendiri.

---

## Perintah yang sering dipakai

```bash
npm run dev            # dev server, port 3006
npm run db:check       # koneksi + skema + isi
npm run db:migrate     # buat/perbarui tabel
npm run db:admin       # buat atau perbaiki akun admin
npx next build         # cek halaman publik masih statis
npx tsc --noEmit       # typecheck
npx eslint src         # lint
```
