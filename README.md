# 🎮 Nama Game: "Galaxy Defender"

## 📝 Deskripsi Singkat
Space Explorer adalah game platformer 2D yang dibangun menggunakan framework Phaser 3. Pemain mengendalikan karakter yang bertugas mengumpulkan kristal energi di luar angkasa sambil menghindari rintangan meteor yang jatuh. Game ini menawarkan:
- 2 level dengan kesulitan berbeda
- Sistem skor & nyawa
- Animasi karakter dan efek suara


---

## 📂 Struktur Folder
```
├── index.html
├── game.js
├── assets/
│   ├── images/
│   │   ├── bg-menu.png
│   │   ├── bg-lvl1.png
│   │   ├── bg-lvl2.png
│   │   ├── blue_crystal.png
│   │   ├── green_crystal.png
│   │   ├── meteor.png
│   │   └── meteor-lvl2.png
│   └── sounds/
│       ├── menu.ogg
│       ├── collect-crystal.ogg
│       ├── lose.ogg
│       └── hit-meteor.ogg
└── README.md
```
---

## ⚙️ Cara Menjalankan Game
1. Pastikan sudah menginstal web server lokal (misal: Live Server di VSCode).
2. Jalankan `index.html` menggunakan web server.
3. Game akan berjalan di browser.

---

## 🧠 Penjelasan Umum Struktur Kode
- `game.js`:
  - Inisialisasi Phaser,
  - konfigurasi scene,
  - Menampilkan menu utama dengan tombol Start, Instructions, dan Exit.
  - Memuat background dan musik.
  - Muncul saat nyawa habis, menampilkan skor akhir dan opsi restart.

---

## 🎵 Aset
- Semua aset gambar dan audio berada di dalam folder `assets/`.
- Aset yang digunakan bersumber dari [OpenGameArt.org](https://opengameart.org/) dan [Kenney.nl](https://kenney.nl/) dan bebas digunakan untuk keperluan edukasi.

