# Mengubah Meta Title & Description

Semua meta title dan description ada di **satu file**:

```
src/data/seo.ts
```

Tidak ada file halaman yang menyimpan teksnya sendiri. Ubah string di file
ini, dan tab browser, hasil Google, serta preview link WhatsApp semuanya ikut
berubah. Tidak ada file lain yang perlu disinkronkan.

---

## Langkah-langkah

### 1. Buka `src/data/seo.ts`

Isinya dua daftar:

| Daftar | Untuk apa | Kuncinya |
|---|---|---|
| `PAGE_SEO` | 11 halaman statis | path URL — `"/"`, `"/pricing"`, `"/our-doctor"` |
| `TREATMENT_SEO` | 32 halaman treatment | slug treatment — `"botox"`, `"hifu/body"` |

### 2. Cari entri yang mau diubah

Halaman statis — cari path-nya:

```ts
"/pricing": {
  title: "Price List | Aesthetic Treatment Cost in Bali",
  description:
    "Discover affordable medi spa treatment prices in Ubud, Bali. ...",
},
```

Halaman treatment — cari slug-nya (sama persis dengan `slug` di
`src/data/treatments.ts`):

```ts
botox: {
  title: "Affordable Botox in Ubud Bali",
  description:
    "Get safe and affordable Botox in Ubud, Bali, ...",
},
```

### 3. Ganti teksnya, simpan

Ubah isi tanda kutip saja. **Jangan** ubah kuncinya (`"/pricing"`, `botox`) —
kunci itu yang menghubungkan entri ke halamannya.

Kalau teksnya mengandung tanda kutip ganda, pakai `\"` atau ganti ke kutip
tunggal:

```ts
title: "Botox \"Baby Dose\" di Ubud",
```

### 4. Cek hasilnya

```bash
npm run dev
```

Buka halamannya, lalu **View Source** (Ctrl+U) dan cari `<title>` serta
`<meta name="description">`. Atau di Console:

```js
document.title
document.querySelector('meta[name=description]').content
```

> Judul di tab browser adalah sumber kebenarannya. React DevTools tidak
> menampilkan meta tag.

---

## Panjang yang disarankan

| | Aman | Terpotong di Google |
|---|---|---|
| Title | 50–60 karakter | > ~60 |
| Description | 140–160 karakter | > ~160 |

Google tetap memotong lebih pendek di mobile. Taruh kata terpenting di awal.

Cek panjang semua entri sekaligus:

```bash
node -e "const s=require('fs').readFileSync('src/data/seo.ts','utf8');[...s.matchAll(/title: \"([^\"]+)\"/g)].forEach(m=>{if(m[1].length>60)console.log(m[1].length,m[1])})"
```

---

## Menambah halaman treatment baru

1. Tambahkan treatment-nya di `src/data/treatments.ts`.
2. Tambahkan entri dengan slug yang sama di `TREATMENT_SEO`.

Kalau langkah 2 dilewat, halaman **tidak error**. Ia otomatis memakai
`"<Nama Treatment> in Ubud, Bali"` dan `shortDescription`-nya sebagai
cadangan. Itu aman untuk sementara, tapi bukan teks yang dioptimalkan —
tetap isi entrinya.

---

## Menambah halaman statis baru

1. Tambahkan entri di `PAGE_SEO` dengan path-nya, misalnya `"/faq"`.
2. Di file halaman `src/app/faq/page.tsx`:

```tsx
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/faq")!;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/faq" },
  openGraph: { title: seo.title, description: seo.description },
};
```

Tanda `!` berarti "entri ini pasti ada". Kalau path-nya salah ketik, halaman
akan error saat build — itu disengaja, supaya salah ketik ketahuan sekarang
dan bukan setelah live.

---

## Soal `{ absolute: ... }`

Di `src/app/layout.tsx` ada template judul:

```ts
title: { template: `%s | Healthy Look Aesthetic` }
```

Artinya judul biasa otomatis dapat imbuhan `| Healthy Look Aesthetic`.
Halaman-halaman di atas memakai `{ absolute: seo.title }` untuk **melewati**
template itu, supaya judulnya sama persis dengan website lama.

- Mau imbuhan otomatis? Ganti `title: { absolute: seo.title }` → `title: seo.title`,
  lalu hapus nama brand dari `seo.ts`.
- Mau kontrol penuh per halaman (seperti sekarang)? Biarkan `absolute`.

Jangan pakai keduanya — nanti jadi
`"Botox | Healthy Look Aesthetic | Healthy Look Aesthetic"`.

---

## Artikel blog

14 artikel mengambil meta dari `src/data/articles.ts` (field `title` dan
`description` di tiap artikel), **bukan** dari `seo.ts`. Itu disengaja:
judul artikel dipakai juga sebagai `<h1>` dan judul kartu di halaman blog,
jadi menyimpannya dua kali akan membuat keduanya bisa berbeda.

Untuk mengubah meta artikel, edit `title`/`description` di `articles.ts`.

---

## ⚠ Empat hal dari website lama yang sebaiknya diperbaiki

Semua meta di `seo.ts` disalin **apa adanya** dari website lama. Empat di
antaranya bermasalah dan sudah ditandai `FIXME` di file itu:

1. **Tiga judul memakai fallback WordPress** — nama domain mentah muncul di
   tab browser:
   - `/ubud-bali` → `Treatment - healthylook-aesthetic.com`
   - `/before-after` → `Before & After - healthylook-aesthetic.com`
   - `/gift-card` → `Gift Card - healthylook-aesthetic.com`

2. **`/our-blog` punya title dan description yang identik dengan
   `/our-doctor`** — persis sama kata per kata. Dua halaman bersaing di kata
   kunci yang sama, dan Google hanya akan memilih salah satu.

3. **`/gift-card` tidak punya meta description sama sekali** di website lama.
   Di sini diisi teks cadangan supaya tidak kosong.

4. **Description Eye Rejuvenation isinya tentang Botox** — menyebut kerutan,
   bruxism, dan kontur tubuh, tidak menyebut area mata sama sekali.

Masing-masing sudah ada saran penggantinya di komentar `FIXME` pada
`src/data/seo.ts`. Semua bisa diperbaiki hanya dengan mengganti satu string.
