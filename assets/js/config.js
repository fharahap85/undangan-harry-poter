/* =========================================================
   KONFIGURASI UNDANGAN (hardcode — ganti sesuai klien)
   Semua teks, tanggal, dan daftar tamu ada di file ini.
   ========================================================= */
window.INVITE = {
  couple: {
    groom: { short: "Arya", full: "Arya Pradipta Wiratama", parents: "Putra pertama Bapak Hendra Wiratama & Ibu Lestari" },
    bride: { short: "Nadia", full: "Nadia Kirana Putri", parents: "Putri kedua Bapak Rahman Siregar & Ibu Aisyah" },
    initials: "A·N"
  },

  // Format ISO, zona WIB (+07:00)
  mainDate: "2026-12-12T08:00:00+07:00",

  events: [
    {
      title: "Akad Nikah",
      start: "2026-12-12T08:00:00+07:00",
      end:   "2026-12-12T10:00:00+07:00",
      place: "Aula Menara Bintang",
      address: "Jl. Jenderal Sudirman No. 12, Pekanbaru",
      maps: "https://maps.google.com/?q=Jl.+Jenderal+Sudirman+Pekanbaru"
    },
    {
      title: "Resepsi",
      start: "2026-12-12T11:00:00+07:00",
      end:   "2026-12-12T14:00:00+07:00",
      place: "Taman Lilin Terapung",
      address: "Jl. Jenderal Sudirman No. 12, Pekanbaru",
      maps: "https://maps.google.com/?q=Jl.+Jenderal+Sudirman+Pekanbaru"
    }
  ],

  story: [
    { year: "2019", title: "Satu meja di kelas ramuan", text: "Kami duduk bersebelahan di praktikum kimia semester satu. Ia memecahkan tabung reaksi, aku yang membersihkannya." },
    { year: "2022", title: "Surat pertama", text: "Sebuah pesan panjang terkirim jam dua pagi. Balasannya datang tiga hari kemudian, dan lebih panjang lagi." },
    { year: "2025", title: "Lamaran di bawah bintang", text: "Di atap rumah, dengan teleskop pinjaman dan cincin yang nyaris jatuh." },
    { year: "2026", title: "Surat ini", text: "Dan kini kami menulis kepadamu." }
  ],

  gift: [
    { bank: "Bank Contoh", number: "1234567890", holder: "Arya Pradipta W." },
    { bank: "Dompet Digital", number: "081234567890", holder: "Nadia Kirana P." }
  ],

  // Ucapan contoh yang tampil sebelum tamu menulis
  seedWishes: [
    { name: "Raka & Sinta", text: "Semoga rumah kalian selalu terang seperti lilin di surat ini.", time: "2 hari lalu" },
    { name: "Tante Mira",   text: "Barakallahu lakuma. Sampai jumpa di hari bahagia!", time: "5 hari lalu" }
  ],

  /* ---------------------------------------------------------
     DAFTAR TAMU — kunci = kode unik di link undangan.
     Link per tamu:  https://domain-anda/?u=KODE
     seats = jumlah kursi maksimal di form RSVP.
     --------------------------------------------------------- */
  guests: {
    "RMT7K2": { name: "Bapak Rahmat & Keluarga", seats: 4 },
    "DWI3Q9": { name: "Dwi Anggraini",            seats: 2 },
    "FKR8L1": { name: "Fikri",                    seats: 1 },
    "TMN5X4": { name: "Teman-teman Kantor",       seats: 6 }
  }
};
