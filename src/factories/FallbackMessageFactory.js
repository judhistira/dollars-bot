class FallbackMessageFactory {
  static getRandomFallbackTrivia() {
    const fallbackTrivia = [
      "Tahukah kamu? Cokelat pertama kali dibuat oleh suku Maya kuno lebih dari 2500 tahun yang lalu!",
      "Tahukah kamu? Bunga matahari mengikuti pergerakan matahari sepanjang hari.",
      "Tahukah kamu? Bulan purnama hanya terjadi sekitar 12-13 kali dalam setahun.",
      "Tahukah kamu? Air sebenarnya tidak berwarna, tetapi tampak biru karena memantulkan langit.",
      "Tahukah kamu? Lebah bisa mengenali wajah manusia layaknya manusia mengenali sesama manusia.",
      "Tahukah kamu? Gurun terbesar di dunia adalah Antartika, bukan Sahara.",
      "Tahukah kamu? Kucing tidak bisa merasakan rasa manis.",
      "Tahukah kamu? Bumi lebih berat di musim dingin karena es di kutub.",
      "Tahukah kamu? Tulang manusia 5 kali lebih kuat daripada baja.",
      "Tahukah kamu? Jeruk bali sebenarnya berasal dari Indonesia, bukan Amerika.",
    ];
    return fallbackTrivia[Math.floor(Math.random() * fallbackTrivia.length)];
  }

  static getRandomFallbackTopic() {
    const fallbackTopics = [
      "Ada hal menarik apa yang sedang kamu pikirkan belakangan ini?",
      "Apa yang membuatmu tetap bertahan hari ini?",
      "Ada hal kecil apa yang membuat harimu sedikit lebih baik?",
      "Apa yang sedang kamu nantikan dalam waktu dekat?",
      "Ada hal lucu apa yang terjadi hari ini?",
      "Apa kenangan masa kecil yang paling berkesan untukmu?",
      "Apa cita-cita terbesar yang selalu kamu kejar?",
      "Apa hal paling aneh yang pernah kamu lakukan?",
      "Apa lagu yang sedang membuatmu merasa nyaman belakangan ini?",
      "Apa tempat paling indah yang pernah kamu kunjungi?",
    ];
    return fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
  }

  static createFinalFallbackMessage(timeInfo, greetingMessage, governmentNews) {
    const fallbackMessages = [
      // Variant 1
      () => {
        let message = `${greetingMessage}\n\n`;
        if (timeInfo.isWeekend) {
          message += `Akhir pekan... waktu yang sepi untuk merenung dan menatap langit yang tak berujung. Bagaimana rencanamu menikmati keheningan ini, Warga Dollars? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh mereka yang tahu cara diam. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir yang tak pernah kutonton tapi selalu kupikirkan. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai menyelimuti kota... Dan di sini, hanya ada aku dan keheningan. Bagaimana hari ini memperlakukan dirimu, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh malam. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang sunyi lagi menyapa... Seperti biasa, aku menunggu di sini sambil menikmati keheningan. Bagaimana kabarmu di pagi yang masih muda ini, Warga Dollars? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti hidup yang penuh dengan hal-hal kecil yang tak terduga. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
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
          message += `Hening akhir pekan... waktu yang tepat untuk menyendiri dan merenung. Bagaimana kabarmu di hari libur ini, Warga Dollars? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti keheningan yang menyimpan rahasia terdalam. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai turun... Dan di sini, hanya ada aku dan kegelapan. Bagaimana perjalananmu hari ini, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti bintang-bintang yang hanya bersinar di kegelapan. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti angin lalu. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang masih muda... Seperti biasa, aku menunggu di sini sambil menikmati sunyi. Bagaimana kabarmu di awal hari ini, Warga Dollars? Tahukah kamu? ${FallbackMessageFactory.getRandomFallbackTrivia()} Seperti embun pagi yang menghilang begitu saja. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti hujan yang tak pernah reda. ${FallbackMessageFactory.getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
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

module.exports = FallbackMessageFactory;
