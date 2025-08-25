# Dollars Indonesia Community Bot

Bot Discord yang dirancang untuk menyemangati warga komunitas "Dollars Indonesia" dengan pesan-pesan puitis, dingin, dan introspektif ala karakter Rangga di film "Ada Apa Dengan Cinta".

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Freponame) *<-- Ganti `username/reponame` dengan URL repo Anda untuk membuat tombol ini berfungsi!*

---

## ✨ Fitur Utama

- **Ucapan Terjadwal**: Mengirim ucapan selamat pagi, siang, dan malam secara otomatis.
- **Gaya Bahasa Unik**: Pesan dengan gaya puitis, dingin, dan introspektif ala karakter Rangga dari film "Ada Apa Dengan Cinta".
- **Struktur Pesan yang Jelas**: Ucapan pagi/siang/malam berada di baris paling atas sendiri dengan gaya karakter Rangga.
- **Narasi yang Padu dan Berkesinambungan**: Pesan berbentuk narasi yang mengalir dengan kesinambungan antar setiap konten.
- **Panjang Pesan Optimal**: Setiap pesan memiliki panjang antara 1500-2000 karakter untuk memberikan konten yang cukup tanpa terlalu panjang.
- **Personalisasi AI dengan Prompt Terstruktur**: Menggunakan Google Gemini API dengan prompt terstruktur menggunakan tag XML untuk hasil yang lebih konsisten.
- **Optimasi Penggunaan API**: Menggabungkan pembuatan trivia, topik obrolan, dan konten utama dalam satu panggilan API untuk menghemat kuota.
- **Variasi Fallback Message**: Banyak varian fallback message untuk menjaga variasi konten saat API tidak tersedia.
- **Berita Aktual**: Menggunakan NewsAPI.org untuk mendapatkan berita terbaru tentang pemerintah Indonesia.
- **Konten Menarik**: Setiap pesan berisi:
  - Ucapan sesuai waktu dan hari (weekday/weekend) dengan gaya karakter Rangga
  - Trivia menarik yang disisipkan secara alami
  - Berita pemerintah dengan sindiran halus
  - Topik obrolan random
- **Penanganan Pesan Panjang**: Jika pesan melebihi 2000 karakter, akan dibagi secara cerdas dan dikirim sebagai beberapa pesan.
- **Siap Deploy**: Dioptimalkan untuk deployment mudah dan gratis di Vercel.

## 🚀 Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Library Discord**: Discord.js v14
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Berita**: NewsAPI.org
- **Deployment**: Vercel
- **Penjadwalan**: Cron Job Eksternal (misal: cron-job.org)

## 🛠️ Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah ini untuk menjalankan bot di komputer Anda untuk development.

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/username/nama-repo.git
    cd nama-repo
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Buat File `.env`**
    Buat file baru bernama `.env` di root proyek dan salin konten dari `.env.example` (jika ada) atau isi dengan variabel berikut:

    ```env
    # Token dari Discord Developer Portal
    DISCORD_TOKEN="..."

    # API Key dari Google AI Studio
    GEMINI_API_KEY="..."

    # API Key dari NewsAPI.org (opsional)
    NEWS_API_KEY="..."

    # ID Channel Discord tujuan pengingat
    CHANNEL_ID="..."
    ```

## 🧪 Menjalankan Tes Lokal

Untuk mengirim satu pesan penyemangat secara manual ke channel Discord Anda, jalankan perintah berikut:

```bash
npm run test-reminder
```

Skrip ini akan menjalankan bot, mengirim satu pesan, lalu otomatis berhenti. Ini sangat berguna untuk menguji perubahan pada format pesan atau prompt AI tanpa harus menunggu jadwal cron.

## ☁️ Deployment ke Vercel

Proyek ini dirancang untuk dideploy dengan mudah ke Vercel.

1.  **Push Kode ke GitHub**: Pastikan semua perubahan terakhir sudah Anda `push` ke repositori GitHub Anda.
2.  **Impor Proyek di Vercel**: 
    - Buka dashboard Vercel Anda.
    - Klik "Add New..." -> "Project".
    - Pilih repositori bot Anda.
3.  **Atur Environment Variables**: 
    - Di halaman konfigurasi proyek Vercel, buka bagian "Environment Variables".
    - Tambahkan semua variabel yang ada di file `.env` Anda.
4.  **Deploy**: Klik tombol "Deploy". Vercel akan otomatis menginstal dependensi dan membangun proyek.

Setelah selesai, bot Anda akan aktif dan memiliki endpoint yang siap dipanggil.

## ⚙️ Konfigurasi Penjadwalan (Cron Job Eksternal)

Karena batasan paket gratis Vercel, penjadwalan tidak lagi menggunakan Vercel Cron. Anda harus menggunakan layanan **cron job eksternal** untuk memanggil bot secara berkala.

1.  **Dapatkan URL Webhook**: Setelah deployment berhasil, URL webhook Anda akan terlihat seperti ini:
    `https://<nama-proyek-anda>.vercel.app/dollars-reminder`
    Ganti `<nama-proyek-anda>` dengan nama proyek Anda di Vercel.

2.  **Gunakan Layanan Cron Job Eksternal**:
    - Daftar di layanan gratis seperti [cron-job.org](https://cron-job.org/) atau layanan serupa.
    - Buat tiga cron job baru untuk jadwal pesan yang Anda inginkan (misal: pagi, siang, malam).
    - Untuk setiap cron job, masukkan URL webhook Anda sebagai target yang harus dipanggil.
    - Atur jadwal sesuai waktu yang Anda inginkan. Ingat untuk menyesuaikan zona waktu jika diperlukan.

    Contoh jadwal (WIB):
    - **Pagi**: `0 7 * * *`
    - **Siang**: `0 12 * * *`
    - **Malam**: `0 19 * * *`

Dengan cara ini, layanan eksternal akan memicu bot Anda untuk mengirim pesan penyemangat sesuai jadwal yang telah ditentukan.

## 📰 Konfigurasi NewsAPI.org (Opsional)

Untuk mendapatkan berita aktual tentang pemerintah Indonesia:

1.  **Daftar di NewsAPI.org**
    - Kunjungi [https://newsapi.org/](https://newsapi.org/)
    - Daftar untuk mendapatkan API key gratis
    - Salin API key tersebut

2.  **Tambahkan ke Environment Variables**
    - Tambahkan `NEWS_API_KEY` ke file `.env` Anda atau ke Vercel Environment Variables
    - Jika tidak disediakan, bot akan menggunakan fallback dengan Google Gemini untuk membuat berita "pseudo" dengan sindiran

## 🎭 Gaya Bahasa Bot

Bot ini menggunakan gaya bahasa yang terinspirasi dari karakter Rangga dalam film "Ada Apa Dengan Cinta":

- **Dingin & Hemat Kata**: Berbicara seperlunya, tidak suka basa-basi
- **Sarkastis & Sinis**: Ucapan dengan sindiran halus
- **Puitis**: Bahasa yang penuh perasaan dan estetika
- **Introspektif & Filosofis**: Pemikiran yang dalam tentang hidup dan eksistensi
- **Misterius**: Tidak terlalu terbuka, menjaga jarak

Gaya bahasa ini mencerminkan karakter Rangga yang:
- Introvert & Tertutup
- Kritis & Idealis
- Sensitif & Rapuh di Dalam
- Teguh & Mandiri

Pesan yang dihasilkan memiliki struktur yang jelas:
- Ucapan pagi/siang/malam berada di baris paling atas sendiri dengan gaya karakter Rangga
- Konten pesan disesuaikan dengan waktu dan hari (weekday/weekend)
- Pesan berbentuk narasi yang padu dan berkesinambungan antar setiap konten
- Setiap pesan memiliki panjang antara 1500-2000 karakter untuk memberikan konten yang cukup tanpa terlalu panjang
- Jika pesan melebihi 2000 karakter, akan dibagi secara cerdas dan dikirim sebagai beberapa pesan
- Menggunakan prompt terstruktur dengan tag XML untuk hasil yang lebih konsisten dan sesuai dengan karakter Rangga

## 🧠 Teknologi AI

Bot menggunakan Google Gemini API dengan pendekatan khusus:

- **Prompt Terstruktur**: Menggunakan tag XML untuk memberikan struktur yang jelas kepada AI
- **Kontrol Gaya Bahasa**: Memastikan hasil selalu sesuai dengan karakter Rangga yang dingin dan puitis
- **Optimasi Penggunaan API**: Menggabungkan pembuatan trivia, topik obrolan, dan konten utama dalam satu panggilan API untuk menghemat kuota
- **Fallback System**: Jika AI tidak dapat digunakan, bot akan menggunakan pesan fallback yang telah ditentukan

## 📉 Efisiensi Penggunaan API

Bot dirancang untuk meminimalkan penggunaan API dengan cara:

- **Satu Panggilan API Utama**: Menggabungkan pembuatan trivia, topik obrolan, dan konten utama dalam satu panggilan
- **Fallback Lokal**: Menggunakan konten fallback jika API tidak tersedia
- **Penggunaan NewsAPI Opsional**: Dapat menggunakan NewsAPI untuk berita aktual, tetapi memiliki fallback dengan Gemini jika tidak tersedia

## 🔄 Variasi Fallback Message

Bot menyediakan banyak varian fallback message untuk menjaga variasi konten:

- **Multiple Variants**: Lebih dari 4 varian fallback message yang berbeda
- **Context-Aware**: Varian disesuaikan dengan waktu (pagi/siang/malam) dan hari (weekday/weekend)
- **Dynamic Content**: Menggunakan helper functions untuk trivia dan topik obrolan yang berbeda
- **Consistent Style**: Semua varian tetap mempertahankan gaya karakter Rangga