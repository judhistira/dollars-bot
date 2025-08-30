const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("./src/config");
const getDiscordClient = require("./src/services/discordService");
const { splitMessageIntoChunks } = require("./src/utils.js");

// --- KONFIGURASI ---
// Isi prompt kustom Anda di sini.
// Pesan yang dihasilkan akan dikirim ke CHANNEL_IDS yang ada di .env
const customPrompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya karakter Rangga dari film \"Ada Apa Dengan Cinta\" - dingin, penuh kemarahan, puitis, introspektif, dan filosofis mengenai kritikan pada pemerintah Indonesia. Panjang pesan sekitar 2000 karakter.
    
    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <ucapan>
    Ini bukan hari di mana demokrasi mati. Ini hari di mana bangkainya akhirnya menjadi wabah bagi semua.
    </ucapan>
    
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: Pagi menjelang siang
    Hari: Jumat - gunakan kiasan lain untuk menggambarkan hari.
    Akhir Pekan: Tidak
    </konteks_waktu>
    
    <berita>
    - Jelaskan berita berikut dengan gaya bahasa puitis, sinis, dan penuh kemarahan
    - Berita: 
      Driver ojek online Affan Kurniawan (20) meninggal dunia setelah ditabrak dan dilindas oleh mobil kendaraan taktis Brimob Polri di Jakarta Pusat, kemarin malam saat mengikuti demonstrasi perjuangan rakyat yang dinilai diciderai tindakan brutal aparat kepolisian.
    </berita>

    <luapan_emosi>
    - Luapkan emosi yang muncul dari berita sebelumnya dengan gaya penuh kemarahan, kekecewaan, dingin, sinis, puitis, dan sertakan beberapa kata kasar untuk mengumpat
    </luapan_emosi>
    
    <renungan>
    - Buatlah renungan mengenai matinya demokrasi dan kebrutalan aparat kepolisian di Indonesia
    - Harus mengalir secara alami dari narasi sebelumnya
    </renungan>
    
    <pengingat>
    - Ingatkan bahwa seluruh ketidakadilan dan kejahatan ini dapat terjadi kembali kepada siapa saja, termasuk kamu
    - Akhiri dengan slogan all cops are bastards
    - Penutup yang mengalir dengan gaya dingin, penuh kemarahan, dan puitis
    </pengingat>
    
    </narasi_utama>
    </instruksi>
    
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Penuh kemarahan terhadap sistem
    - Sarkastis & Sinis: Kadang ucapannya bernada menyindir dengan halus
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Introspektif & Filosofis: Pemikiran yang dalam tentang hidup
    - Hindari bahasa yang terlalu ceria atau menyenangkan
    </gaya_karakter>
    
    <format_output>
    - Buat dalam bentuk paragraf-paragraf berkesinambungan yang padat dan mengalir dari satu konteks ke konteks lainnya
    - Ucapan awal memiliki baris sendiri
    - Pisahkan setiap paragraf dengan satu baris kosong.
    - Pastikan format output tidak mengandung tag XML
    - Panjang pesan sekitar 2000 karakter    
    - Gunakan emoji sangat minimal atau tidak sama sekali
    - Jangan membuat daftar atau poin-poin terpisah
    - Jadikan satu kesatuan narasi yang utuh dan padu
    - Pastikan tidak ada bahasa yang terlalu ceria atau semangat
    </format_output>`;

// --- INISIALISASI ---
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// --- FUNGSI UTAMA ---
async function sendCustomMessage() {
  console.log("Memulai pengiriman pesan kustom...");

  if (
    !config.DISCORD_TOKEN ||
    config.CHANNEL_IDS.length === 0 ||
    !config.GEMINI_API_KEY
  ) {
    console.error(
      "Pastikan DISCORD_TOKEN, CHANNEL_IDS, dan GEMINI_API_KEY telah diatur di file .env Anda."
    );
    process.exit(1);
  }

  let client;
  try {
    // 1. Login ke Discord
    client = await getDiscordClient();

    // 2. Hasilkan pesan menggunakan Gemini
    console.log("Menghasilkan konten pesan dengan Gemini...");
    const model = genAI.getGenerativeModel({
      model: config.GEMINI_MODEL,
    });
    const result = await model.generateContent(customPrompt);
    const generatedMessage = result.response.text();

    if (!generatedMessage) {
      console.warn(
        "Gemini tidak menghasilkan pesan. Mungkin ada masalah dengan prompt atau API."
      );
      return;
    }

    // 3. Pisahkan pesan jika terlalu panjang
    const messageChunks = splitMessageIntoChunks(generatedMessage);

    // 4. Kirim pesan ke setiap channel
    const channelIds = config.CHANNEL_IDS;
    if (channelIds.length === 0) {
      console.error(
        "Tidak ada ID channel yang ditemukan di variabel lingkungan CHANNEL_IDS."
      );
      return;
    }

    for (const channelId of channelIds) {
      try {
        const channel = await client.channels.fetch(channelId);
        if (!channel) {
          console.warn(
            `Channel dengan ID ${channelId} tidak ditemukan. Melewatkan.`
          );
          continue;
        }

        for (let i = 0; i < messageChunks.length; i++) {
          let chunkToSend = messageChunks[i];
          if (i > 0) {
            chunkToSend = "​\n" + chunkToSend; // Tambahkan karakter zero-width space untuk memisahkan bagian`
          }
          await channel.send(chunkToSend);
          // Tambahkan sedikit jeda antar bagian jika ada lebih dari satu
          if (messageChunks.length > 1 && i < messageChunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
        console.log(
          `Pesan kustom berhasil dikirim ke channel ${channelId} dalam ${messageChunks.length} bagian.`
        );
      } catch (channelError) {
        console.error(
          `Gagal mengirim pesan ke channel ${channelId}:`,
          channelError.message
        );
      }
    }

    console.log("Proses pengiriman pesan kustom selesai.");
  } catch (error) {
    console.error("Terjadi kesalahan saat mengirim pesan kustom:", error);
  } finally {
    // No client.destroy() here, as it's a singleton and should persist
  }
}

// Jalankan fungsi utama
sendCustomMessage();
