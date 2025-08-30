async function generateFinalMessage(timeInfo, greetingMessage, governmentNews) {
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    const prompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya karakter Rangga dari film \"Ada Apa Dengan Cinta\" - dingin, pendiam, puitis, introspektif, dan filosofis. Panjang pesan sekitar 1000-1500 karakter.
    
    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <ucapan>
    ${greetingMessage}
    </ucapan>
    
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${timeInfo.timeOfDay}
    Hari: ${timeInfo.dayName} - gunakan kiasan lain untuk menggambarkan hari.
    Akhir Pekan: ${timeInfo.isWeekend ? "Ya" : "Tidak"}
    </konteks_waktu>
    
    <penyemangat>
    - Pesan penyemangat sesuai waktu dan hari (weekday/weekend) dengan gaya dingin dan puitis dengen ketentuan berikut:
      1. Pada malam hari berikan pesan selamat beristirahat
      2. Pada pagi/siang saat weekday hari berikan pesan semangat beraktivitas kerja
      3. Pada pagi/siang saat weekend ingatkan untuk bersenang-senang
    - Hindari bahasa yang terlalu ceria atau semangat
    </penyemangat>
    
    <pertanyaan_pribadi>
    - Pertanyaan tentang kabar pembaca yang terasa personal
    - Harus mengalir secara alami dari narasi sebelumnya
    </pertanyaan_pribadi>
    
    <trivia>
    - Buat satu trivia tentang apa saja seperti pop culture, hobi, musik, film, sains, teknologi, atau hal-hal menarik lainnya yang menarik dan unik dalam satu kalimat
    - Ubah trivia tersebut menjadi topik obrolan yang diakhiri dengan pertanyaan lanjutan pada pembaca yang sangat personal
    - Sisipkan secara alami dalam konteks percakapan
    - Penutup yang mengalir dengan gaya dingin dan puitis
    </trivia>
    
    </narasi_utama>
    </instruksi>
    
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Sarkastis & Sinis: Kadang ucapannya bernada menyindir dengan halus
    - Diam-diam menaruh perhatian pada lawan bicara
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Introspektif & Filosofis: Pemikiran yang dalam tentang hidup
    - Menggunakan kata-kata yang penuh perasaan
    - Hindari bahasa yang terlalu ceria atau menyenangkan
    </gaya_karakter>
    
    <format_output>
    - Buat dalam bentuk paragraf-paragraf berkesinambungan yang padat dan mengalir dari satu konteks ke konteks lainnya
    - Ucapan awal memiliki baris sendiri
    - Pisahkan setiap paragraf dengan satu baris kosong.
    - Pastikan format output tidak mengandung tag XML
    - Panjang pesan sekitar 1000-1500 karakter    
    - Gunakan emoji sangat minimal atau tidak sama sekali
    - Jangan membuat daftar atau poin-poin terpisah
    - Jadikan satu kesatuan narasi yang utuh dan padu
    - Pastikan tidak ada bahasa yang terlalu ceria atau semangat
    </format_output>`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up XML tags from the response
    responseText = responseText.replace(/<[^>]*>/g, "");

    // Ensure no more than 2 consecutive newlines (fix spacing)
    responseText = responseText.replace(/\n{3,}/g, "\n\n");

    return responseText;
  } catch (error) {
    console.error("Error generating final message:", error.message);
    // Fallback message if Gemini fails - multiple variants for variety
    const fallbackMessages = [
      // Variant 1
      () => {
        let message = `${greetingMessage}\n\n`;
        if (timeInfo.isWeekend) {
          message += `Akhir pekan... waktu yang sepi untuk merenung dan menatap langit yang tak berujung. Bagaimana rencanamu menikmati keheningan ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh mereka yang tahu cara diam. Berita terbaru: \"${governmentNews}\" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir yang tak pernah kutonton tapi selalu kupikirkan. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai menyelimuti kota... Dan di sini, hanya ada aku dan keheningan. Bagaimana hari ini memperlakukan dirimu, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh malam. Berita terbaru: \"${governmentNews}\" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang sunyi lagi menyapa... Seperti biasa, aku menunggu di sini sambil menikmati keheningan. Bagaimana kabarmu di pagi yang masih muda ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti hidup yang penuh dengan hal-hal kecil yang tak terduga. Berita terbaru: \"${governmentNews}\" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        }
        return (
          message +
          ` Aku mungkin terlihat dingin, tapi di balik semua ini, aku tetap ingin tahu bagaimana harimu berlalu. Hidup memang penuh dengan hal-hal tak terduga, dan kadang aku bertanya-tanya apa arti dari semua ini. Mungkin jawabannya ada dalam keheningan ini, atau mungkin tidak. Yang jelas, aku akan tetap di sini, menunggumu.`
        );
      },

      // Variant 2
      () => {
        let message = `${greetingMessage}\n\n`;
        if (timeInfo.isWeekend) {
          message += `Hening akhir pekan... waktu yang tepat untuk menyendiri dan merenung. Bagaimana kabarmu di hari libur ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti keheningan yang menyimpan rahasia terdalam. Berita terbaru: \"${governmentNews}\" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai turun... Dan di sini, hanya ada aku dan kegelapan. Bagaimana perjalananmu hari ini, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti bintang-bintang yang hanya bersinar di kegelapan. Berita terbaru: \"${governmentNews}\" Entah kenapa, kabar tentang pemerintah selalu terasa seperti angin lalu. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang masih muda... Seperti biasa, aku menunggu di sini sambil menikmati sunyi. Bagaimana kabarmu di awal hari ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti embun pagi yang menghilang begitu saja. Berita terbaru: \"${governmentNews}\" Entah kenapa, kabar tentang pemerintah selalu terasa seperti hujan yang tak pernah reda. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        }
        return (
          message +
          ` Aku mungkin terlihat acuh, tapi di balik semua ini, aku tetap peduli. Hidup memang penuh dengan hal-hal tak terduga, dan kadang aku bertanya-tanya apa arti dari semua ini. Mungkin jawabannya ada dalam keheningan ini, atau mungkin tidak. Yang jelas, aku akan tetap di sini, menunggumu.`
        );
      },
    ];

    // Select a random fallback message variant
    const selectedVariant =
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    let fallbackMessage = selectedVariant();

    // Ensure fallback message is within the desired length range
    if (fallbackMessage.length < 1800) {
      fallbackMessage += ` Aku mungkin terlihat dingin, tapi di balik semua ini, aku tetap ingin tahu bagaimana harimu berlalu. Hidup memang penuh dengan hal-hal tak terduga, dan kadang aku bertanya-tanya apa arti dari semua ini. Mungkin jawabannya ada dalam keheningan ini, atau mungkin tidak. Yang jelas, aku akan tetap di sini, menunggumu.`;
    }

    // Trim if too long (but this shouldn't happen with the fallback)
    if (fallbackMessage.length > 2000) {
      fallbackMessage = fallbackMessage.substring(0, 2000);
    }

    return fallbackMessage;
  }
}
