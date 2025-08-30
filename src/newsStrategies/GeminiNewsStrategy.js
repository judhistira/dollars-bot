const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

class GeminiNewsStrategy {
  async getNews() {
    try {
      const GEMINI_API_KEY = config.GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set. Cannot generate news with Gemini.");
        return "Berita terbaru: Kunci API Gemini tidak diatur. Tidak dapat menghasilkan berita.";
      }

      const model = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({
        model: config.GEMINI_MODEL,
      });

      const prompt = `Buat berita terbaru tentang pemerintah Indonesia, dengan fokus pada isu-isu aktivisme, demonstrasi, protes, atau unjuk rasa. Berita harus dalam satu kalimat dengan sindiran halus dan jenaka. Jangan terlalu menyindir, cukup sindiran ringan yang membuat orang tersenyum. Buat dalam bahasa Indonesia yang menarik.`;

      const result = await model.generateContent(prompt);

      // Explicitly check result and result.response
      if (!result || !result.response) {
        console.error("Gemini API returned an invalid response (result or result.response is null/undefined).", result);
        return "Berita terbaru: Gagal mendapatkan berita dari Gemini. Menggunakan berita fallback.";
      }

      return result.response.text();
    } catch (error) {
      console.error("Error generating news with Gemini:", error.message);
      const fallbackNews = "Berita terbaru: Pemerintah sedang mempertimbangkan untuk mengganti nama nasi padang menjadi nasi unggul karena prestasi atlet Indonesia yang luar biasa.";
      return fallbackNews;
    }
  }
}

module.exports = GeminiNewsStrategy;
