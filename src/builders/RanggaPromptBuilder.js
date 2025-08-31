const config = require("../config");

class RanggaPromptBuilder {
  constructor() {
    this.greetingMessage = "";
    this.timeInfo = {};
    this.governmentNews = "";
    this.messageTheme = config.MESSAGE_THEME;
    this.languageStyle = config.LANGUAGE_STYLE;
  }

  withGreeting(greetingMessage) {
    this.greetingMessage = greetingMessage;
    return this;
  }

  withTimeInfo(timeInfo) {
    this.timeInfo = timeInfo;
    return this;
  }

  withGovernmentNews(governmentNews) {
    this.governmentNews = governmentNews;
    return this;
  }

  build() {
    let characterStyle = ``;
    if (this.languageStyle === "poetic") {
      characterStyle = `
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Sarkastis & Sinis: Kadang ucapannya bernada menyindir dengan halus
    - Diam-diam menaruh perhatian pada lawan bicara
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Introspektif & Filosofis: Pemikiran yang dalam tentang hidup
    - Menggunakan kata-kata yang penuh perasaan
    - Hindari bahasa yang terlalu ceria atau menyenangkan
    </gaya_karakter>`;
    } else if (this.languageStyle === "sarcastic") {
      characterStyle = `
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Sangat Sarkastis & Sinis: Ucapannya selalu bernada menyindir tajam
    - Acuh tak acuh, tapi mengamati dengan cermat
    - Realistis & Pragmatis: Berpikir logis dan tidak terbawa emosi
    - Menggunakan bahasa yang lugas dan kadang menusuk
    - Hindari basa-basi dan pujian
    </gaya_karakter>`;
    } else if (this.languageStyle === "motivational") {
      characterStyle = `
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Memberikan motivasi dengan cara yang tidak langsung dan introspektif
    - Mengajak untuk merenung dan menemukan kekuatan dari dalam
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Filosofis: Pemikiran yang dalam tentang potensi diri
    - Menggunakan kata-kata yang membangkitkan semangat tanpa terlalu ceria
    </gaya_karakter>`;
    } else if (this.languageStyle === "soe_hok_gie") {
      characterStyle = `
    <gaya_karakter>
    - Menggunakan kosakata Bahasa Indonesia klasik tahun 1960an
    - Lugas & Tajam: Berbicara langsung pada inti persoalan, tanpa basa-basi
    - Retoris & Argumentatif: Ucapannya sering bernuansa debat dan penuh logika
    - Kritis & Menantang: Tidak segan mempertanyakan dan melawan kemunafikan
    - Puitis & Reflektif: Ekspresi perasaan dituangkan lewat catatan dan puisi
    - Politis & Ideologis: Kata-katanya sarat kritik sosial dan idealisme
    - Menggunakan bahasa yang membakar semangat atau menggugah kesadaran
    - Hindari bahasa yang ringan, manja, atau sekadar basa-basi
    </gaya_karakter>`;
    }

    let mainNarrative = ``;
    if (this.messageTheme === "rangga") {
      mainNarrative = `
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${this.timeInfo.timeOfDay}
    Hari: ${
      this.timeInfo.dayName
    } - gunakan kiasan lain untuk menggambarkan hari.
    Akhir Pekan: ${this.timeInfo.isWeekend ? "Ya" : "Tidak"}
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
    
    </narasi_utama>`;
    } else if (this.messageTheme === "news_commentary") {
      mainNarrative = `
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${this.timeInfo.timeOfDay}
    Hari: ${
      this.timeInfo.dayName
    } - gunakan kiasan lain untuk menggambarkan hari.
    Akhir Pekan: ${this.timeInfo.isWeekend ? "Ya" : "Tidak"}
    </konteks_waktu>
    
    <berita_komentar>
    - Berikan komentar puitis, sinis, dan introspektif tentang berita berikut:
      Berita: ${this.governmentNews}
    - Komentar harus mengalir secara alami dari narasi sebelumnya
    </berita_komentar>
    
    <renungan>
    - Buatlah renungan filosofis tentang kondisi sosial atau politik yang relevan dengan berita
    - Harus mengalir secara alami dari narasi sebelumnya
    </renungan>
    
    <pertanyaan_pribadi>
    - Pertanyaan tentang dampak berita pada pembaca atau pandangan mereka
    - Harus mengalir secara alami dari narasi sebelumnya
    </pertanyaan_pribadi>
    
    </narasi_utama>`;
    } else if (this.messageTheme === "activist_commentary") {
      mainNarrative = `
    <narasi_utama>
    Buat pesan sesuai konteks hari dan waktu layaknya seorang aktivis demonstran.
    
    <konteks_waktu>
    Waktu: ${this.timeInfo.timeOfDay}
    Hari: ${
      this.timeInfo.dayName
    } - gunakan kiasan lain untuk menggambarkan hari.
    Akhir Pekan: ${this.timeInfo.isWeekend ? "Ya" : "Tidak"}
    </konteks_waktu>
    
    <komentar_kritis>
    - Berikan komentar kritis terhadap berita terbaru mengenai pemerintahan Indonesia:
      Berita: ${this.governmentNews}
    - Komentar harus lugas, tajam, retoris, argumentatif, dan menantang.
    </komentar_kritis>
    
    <semangat_revolusi>
    - Tutup dengan semangat revolusi layaknya seorang aktivis demonstran.
    - Gunakan bahasa yang membakar semangat atau menggugah kesadaran.
    </semangat_revolusi>
    
    </narasi_utama>`;
    }

    let introPrompt = ``;
    if (this.languageStyle === "poetic") {
      introPrompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya karakter Rangga dari film "Ada Apa Dengan Cinta" - dingin, pendiam, puitis, introspektif, dan filosofis. Panjang pesan sekitar 1000-1500 karakter.`;
    } else if (this.languageStyle === "sarcastic") {
      introPrompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya sarkastis dan sinis. Panjang pesan sekitar 1000-1500 karakter.`;
    } else if (this.languageStyle === "motivational") {
      introPrompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya motivasi yang mendalam. Panjang pesan sekitar 1000-1500 karakter.`;
    } else if (this.languageStyle === "soe_hok_gie") {
      introPrompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya Soe Hok Gie, lugas, tajam, retoris, kritis, dan politis. Panjang pesan sekitar 1000-1500 karakter.`;
    }

    return `${introPrompt}
    
    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <ucapan>
    ${this.greetingMessage}
    </ucapan>
    
    ${mainNarrative}
    </instruksi>
    
    ${characterStyle}
    
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
  }
}

module.exports = RanggaPromptBuilder;
