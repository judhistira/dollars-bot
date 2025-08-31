# Bot Dollars ✨

Selamat datang di repositori Bot Dollars! Bot Discord ini dirancang untuk memberikan pesan-pesan penyemangat harian di server kamu dengan gaya yang unik, terinspirasi dari karakter Rangga di film "Ada Apa Dengan Cinta?".

Bot ini sudah aktif dan bisa kamu temui langsung di server **Dollars Indonesia**!

[![Gabung Dollars Indonesia](https://img.shields.io/badge/Gabung%20Dollars%20Indonesia-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://bit.ly/DollarsIndonesia)

## 🌟 Fitur Utama

- **Pesan Terjadwal**: Mengirimkan ucapan selamat pagi, siang, dan malam secara otomatis.
- **Gaya Bahasa Khas & Dinamis**: Setiap pesan dirangkai dengan gaya bahasa yang puitis, introspektif, dan terkadang sedikit sinis, khas karakter Rangga. Kini mendukung berbagai gaya bahasa dan tema pesan yang dapat dikonfigurasi melalui variabel lingkungan, termasuk gaya 'soe_hok_gie' yang memiliki sapaan uniknya sendiri.
- **Konten Bervariasi**: Tidak hanya sapaan, bot juga menyajikan:
  - **Trivia Menarik**: Fakta-fakta unik untuk menambah wawasan.
  - **Berita Terkini**: Informasi seputar pemerintah, dengan prioritas pada isu-isu aktivisme dan demonstrasi, dibalut dengan komentar halus.
  - **Topik Diskusi**: Pertanyaan-pertanyaan acak untuk memancing obrolan di server.
- **Penanganan Pesan Cerdas**: Pesan yang melebihi batas karakter Discord akan secara otomatis dipecah menjadi beberapa bagian agar tetap nyaman dibaca.
- **Deployment Mudah**: Proyek ini telah dioptimalkan untuk proses deployment yang mudah dan gratis melalui Vercel.

## 🏗️ Arsitektur & Pola Desain

Proyek ini telah direfaktor secara ekstensif untuk mengadopsi pola desain modern, meningkatkan modularitas, pemeliharaan, dan ekstensibilitas. Beberapa pola yang diterapkan meliputi:

-   **Singleton**: Untuk pengelolaan instance Discord Client yang efisien.
-   **Strategy**: Digunakan untuk pemilihan pesan sapaan dan sumber berita, memungkinkan penambahan variasi dengan mudah.
-   **Builder**: Untuk konstruksi prompt Gemini AI yang kompleks dan dinamis, mendukung berbagai tema pesan dan gaya bahasa.
-   **Factory Method**: Untuk pembuatan konten fallback (trivia, topik, pesan).
-   **Command**: Mengenkapsulasi proses pengiriman pesan untuk operasi yang lebih terstruktur.
-   **Chain of Responsibility**: Untuk mekanisme pemisahan pesan yang fleksibel.

Struktur direktori proyek kini lebih terorganisir:

```
. (root)
├── src/
│   ├── builders/             # Pola Builder untuk prompt AI
│   ├── commands/             # Pola Command untuk operasi
│   ├── config/               # Konfigurasi terpusat
│   ├── factories/            # Pola Factory untuk objek
│   ├── message/              # Modul terkait pesan (misal: generator sapaan)
│   ├── messageSplitters/     # Pola Chain of Responsibility untuk pemisahan pesan
│   ├── newsStrategies/       # Pola Strategy untuk sumber berita
│   ├── services/             # Layanan (misal: Discord Client Singleton)
│   ├── bot.js                # Logika inti bot
│   ├── gemini.js             # Integrasi Gemini AI
│   └── utils.js              # Fungsi utilitas
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prompt.txt
├── README.md
├── test-console.js
├── test-reminder.js
├── send-custom-message.js
└── vercel.json             # Konfigurasi deployment Vercel (entry point di src/index.js)
```

## 🔧 Panduan Instalasi (Lokal)

Jika kamu ingin mencoba atau mengembangkan bot ini secara lokal, silakan ikuti langkah-langkah berikut:

1.  **Clone Repositori**

    ```bash
    git clone https://github.com/judhistira/dollars-bot.git
    cd dollars-bot
    ```

2.  **Instalasi Dependensi**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**

    - Buat salinan dari file `.env.example` dan ubah namanya menjadi `.env`.
    - Buka file `.env` tersebut dan isi semua variabel yang diperlukan.

    ```env
    # Token bot dari Discord Developer Portal
    DISCORD_TOKEN="..."

    # API Key dari Google AI Studio
    GEMINI_API_KEY="..."

    # API Key dari NewsAPI.org (opsional)
    NEWS_API_KEY="..."

    # ID Channel Discord tujuan (pisahkan dengan koma jika lebih dari satu)
    CHANNEL_IDS="..."

    # Model AI yang ingin digunakan
    GEMINI_MODEL="gemini-2.5-flash"

    # Zona waktu (misal: Asia/Jakarta)
    TIMEZONE="Asia/Jakarta"

    # Tema pesan (misal: rangga, activist_commentary)
    MESSAGE_THEME="rangga"

    # Gaya bahasa (misal: poetic, sarcastic, motivational, soe_hok_gie)
    LANGUAGE_STYLE="poetic"
    ```

## 🔑 Panduan Mendapatkan Kunci API

- **DISCORD_TOKEN**:

  1.  Kunjungi [Portal Developer Discord](https://discord.com/developers/applications).
  2.  Buat "New Application".
  3.  Buka tab "Bot", lalu klik "Add Bot".
  4.  Di bawah nama bot, klik "Reset Token" untuk mendapatkan token kamu. _Mohon jaga kerahasiaan token ini._

- **GEMINI_API_KEY**:

  1.  Kunjungi [Google AI Studio](https://aistudio.google.com/).
  2.  Masuk dengan akun Google kamu.
  3.  Klik "Get API key" atau "Create API key" untuk membuat kunci API baru.

- **NEWS_API_KEY** (Opsional):
  1.  Daftar untuk sebuah akun di [NewsAPI.org](https://newsapi.org/).
  2.  API key gratis akan tersedia di dashboard akun kamu setelah berhasil mendaftar.

## 🚀 Panduan Deployment

Proyek ini dirancang untuk dideploy dengan mudah di Vercel.

1.  **Push ke Repositori GitHub**: Pastikan semua perubahan kode kamu sudah tersimpan di repositori GitHub.
2.  **Impor Proyek di Vercel**:
    - Masuk ke dashboard Vercel kamu.
    - Klik "Add New..." -> "Project", lalu pilih repositori bot ini.
3.  **Atur Environment Variables**: Pada halaman konfigurasi proyek di Vercel, masukkan semua variabel yang ada di file `.env` kamu.
4.  **Deploy**: Klik tombol "Deploy". Vercel akan menangani proses build dan deployment secara otomatis.

Setelah proses deployment selesai, kamu akan mendapatkan sebuah URL webhook. Gunakan URL tersebut pada layanan cron job eksternal (seperti [cron-job.org](https://cron-job.org/)) untuk memanggil bot secara berkala sesuai jadwal yang kamu inginkan.

## 👨‍💻 Informasi Pembuat

Bot ini dibuat dan dikelola oleh **Judhistira Natha Junior**.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/judhistira)
[![Discord](https://img.shields.io/badge/Discord-RazeRunner-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/RazeRunner)
