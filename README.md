# GERD Meal Reminder Bot

Bot Discord sederhana yang dirancang untuk menjadi teman pengingat makan bagi penderita GERD. Bot ini memberikan rekomendasi makanan yang aman dan sesuai dengan kondisi cuaca, serta pesan penyemangat yang personal menggunakan AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Freponame) *<-- Ganti `username/reponame` dengan URL repo Anda untuk membuat tombol ini berfungsi!*

---

## ✨ Fitur Utama

- **Pengingat Terjadwal**: Mengirim pengingat makan 3x sehari secara otomatis.
- **Rekomendasi Cerdas**: Rekomendasi makanan disesuaikan dengan cuaca (panas/dingin) dan waktu (pagi/siang/malam).
- **Aman untuk GERD**: Semua saran makanan difilter agar tidak pedas, tidak asam, dan tidak berlemak.
- **Personalisasi AI**: Pesan dibuat seolah-olah dari orang terdekat menggunakan Google Gemini API.
- **Siap Deploy**: Dioptimalkan untuk deployment mudah dan gratis di Vercel.

## 🚀 Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Library Discord**: Discord.js v14
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Data Cuaca**: OpenWeatherMap API
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

    # API Key dari OpenWeatherMap
    OPENWEATHER_API_KEY="..."

    # ID Channel Discord tujuan pengingat
    CHANNEL_ID="..."

    # Lokasi untuk data cuaca (opsional)
    LOCATION="Jatibarang, ID"
    ```

## 🧪 Menjalankan Tes Lokal

Untuk mengirim satu pesan pengingat secara manual ke channel Discord Anda, jalankan perintah berikut:

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
    `https://<nama-proyek-anda>.vercel.app/gerd-reminder`
    Ganti `<nama-proyek-anda>` dengan nama proyek Anda di Vercel.

2.  **Gunakan Layanan Cron Job Eksternal**:
    - Daftar di layanan gratis seperti [cron-job.org](https://cron-job.org/) atau layanan serupa.
    - Buat tiga cron job baru untuk jadwal pengingat yang Anda inginkan (misal: pagi, siang, malam).
    - Untuk setiap cron job, masukkan URL webhook Anda sebagai target yang harus dipanggil.
    - Atur jadwal sesuai waktu yang Anda inginkan. Ingat untuk menyesuaikan zona waktu jika diperlukan.

    Contoh jadwal (WIB):
    - **Pagi**: `0 7 * * *`
    - **Siang**: `0 12 * * *`
    - **Malam**: `0 19 * * *`

Dengan cara ini, layanan eksternal akan memicu bot Anda untuk mengirim pengingat sesuai jadwal yang telah ditentukan.
