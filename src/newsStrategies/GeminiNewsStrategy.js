const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

class GeminiNewsStrategy {
  async getNews() {
    try {
      const model = new GoogleGenerativeAI(config.GEMINI_API_KEY).getGenerativeModel({
        model: config.GEMINI_MODEL,
      });

      const prompt = `Buat berita terbaru tentang pemerintah Indonesia dalam satu kalimat dengan sindiran halus dan jenaka. Jangan terlalu menyindir, cukup sindiran ringan yang membuat orang tersenyum. Buat dalam bahasa Indonesia yang menarik.`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating news with Gemini:", error.message);
      return "Berita terbaru: Pemerintah sedang mempertimbangkan untuk mengganti nama nasi padang menjadi nasi unggul karena prestasi atlet Indonesia yang luar biasa.";
    }
  }
}

module.exports = GeminiNewsStrategy;
