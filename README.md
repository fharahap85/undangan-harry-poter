# Undangan Digital — Tema Surat Sihir (Prototype)

Prototype undangan pernikahan digital bertema dunia sihir: amplop bersegel lilin yang bisa dibuka, lilin melayang, dan surat perkamen. Dibuat sebagai demo awal untuk klien, **100% frontend** (HTML, CSS, JavaScript murni) tanpa backend dan database.

## Fitur

- **Akses khusus penerima** — tiap tamu punya kode unik di link (`?u=KODE`). Tanpa kode yang valid, isi undangan tidak tampil.
- **Nama tamu personal** di amplop dan isi surat.
- **Amplop interaktif** — ketuk segel lilin untuk membuka surat.
- **Hitung mundur** menuju hari acara.
- **Profil mempelai, waktu & tempat** dengan tombol peta dan *Simpan ke kalender* (.ics).
- **Jejak kisah** (timeline).
- **Galeri** dengan lightbox.
- **RSVP** — jumlah kursi dibatasi sesuai kuota tiap tamu.
- **Ucapan & doa** (buku tamu).
- **Tanda kasih** — salin nomor rekening sekali ketuk.
- **Musik latar** — melodi kotak musik orisinal (Web Audio), bisa diganti file lagu sendiri.
- Responsif mobile, navigasi bawah, mendukung *reduced motion*.

## Coba demo

Buka `index.html`, lalu gunakan salah satu link:

| Tamu | Link |
|---|---|
| Bapak Rahmat & Keluarga | `index.html?u=RMT7K2` |
| Dwi Anggraini | `index.html?u=DWI3Q9` |
| Teman-teman Kantor | `index.html?u=TMN5X4` |

Tanpa parameter `?u=`, halaman akan meminta kode undangan.

## Struktur

```
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── config.js   ← semua data undangan & daftar tamu (edit di sini)
│       └── app.js      ← logika tampilan
└── README.md
```

## Kustomisasi

Semua konten ada di `assets/js/config.js`: nama mempelai, tanggal, lokasi, kisah, rekening, dan daftar tamu beserta kodenya. Foto galeri saat ini berupa placeholder warna; ganti di fungsi `renderGallery()` pada `app.js`.

Untuk lagu sendiri, isi konstanta `MUSIC_FILE` di `app.js` (gunakan lagu bebas royalti atau berlisensi).

## Deploy ke GitHub Pages

1. Push repo ini ke GitHub.
2. **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. Link undangan: `https://<username>.github.io/<repo>/?u=KODE`

## Catatan prototype

- RSVP dan ucapan disimpan di `localStorage` (hanya di perangkat tamu). Versi produksi akan memakai backend (mis. Laravel + database) agar data terkumpul di satu dashboard.
- Gerbang kode di prototype ini bersifat frontend; daftar tamu masih terlihat di source code. Versi produksi akan memvalidasi kode di server sehingga undangan benar-benar hanya bisa dibuka penerima.
- Desain memakai estetika dunia sihir secara umum, tanpa nama, logo, atau karakter dari waralaba tertentu.
