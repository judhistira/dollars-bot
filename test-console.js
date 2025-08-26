require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// News API configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Get current time of day and day type (weekday/weekend)
 */
function getTimeInfo() {
  const now = new Date();
  const options = {
    timeZone: process.env.TIMEZONE || "Asia/Jakarta",
    hour: "2-digit",
    hour12: false,
  };
  const hourInWIB = parseInt(
    new Intl.DateTimeFormat("en-US", options).format(now)
  );

  const isWeekend = now.getDay() === 0 || now.getDay() === 6; // 0 = Sunday, 6 = Saturday

  let timeOfDay;
  if (hourInWIB < 12) {
    timeOfDay = "Pagi";
  } else if (hourInWIB < 18) {
    timeOfDay = "Siang";
  } else {
    timeOfDay = "Malam";
  }

  return {
    timeOfDay,
    isWeekend,
    hour: hourInWIB,
  };
}

/**
 * Get latest news about Indonesian government
 */
async function getGovernmentNews() {
  try {
    // If we have News API key, use it to get real news
    if (NEWS_API_KEY) {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=indonesia+government&pagenumber=1&pagesize=1&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );

      if (response.data.articles && response.data.articles.length > 0) {
        const article = response.data.articles[0];
        return `${article.title} - ${article.description || ""}`;
      }
    }

    // Fallback to Gemini-generated "news" with subtle satire
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Buat berita terbaru tentang pemerintah Indonesia dalam satu kalimat dengan sindiran halus dan jenaka. Jangan terlalu menyindir, cukup sindiran ringan yang membuat orang tersenyum. Buat dalam bahasa Indonesia yang menarik.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting government news:", error.message);
    return "Berita terbaru: Pemerintah sedang mempertimbangkan untuk mengganti nama nasi padang menjadi nasi unggul karena prestasi atlet Indonesia yang luar biasa.";
  }
}

/**
 * Generate greeting message based on time of day and day type
 * Style: Rangga from "Ada Apa Dengan Cinta" - cold, poetic, introspective
 */
function getGreetingMessage(timeInfo) {
  // Different greetings for weekend
  if (timeInfo.isWeekend) {
    const weekendGreetings = [
      "**Akhir pekan...**",
      "**Hari libur...**",
      "**Waktu yang sepi...**",
      "**Hening akhir pekan...**",
    ];
    return weekendGreetings[
      Math.floor(Math.random() * weekendGreetings.length)
    ];
  }

  // Different greetings based on time of day
  if (timeInfo.timeOfDay === "Pagi") {
    const morningGreetings = [
      "**Pagi yang sunyi...**",
      "**Hari baru yang sepi...**",
      "**Cahaya pagi yang redup...**",
      "**Pagi yang membisu...**",
    ];
    return morningGreetings[
      Math.floor(Math.random() * morningGreetings.length)
    ];
  } else if (timeInfo.timeOfDay === "Siang") {
    const noonGreetings = [
      "**Matahari terik...**",
      "**Siang yang membakar...**",
      "**Terik hari ini...**",
      "**Sinar yang menyilaukan...**",
    ];
    return noonGreetings[Math.floor(Math.random() * noonGreetings.length)];
  } else {
    const eveningGreetings = [
      "**Malam yang gelap...**",
      "**Kegelapan menyapa...**",
      "**Senja yang membisu...**",
      "**Malam yang sunyi...**",
    ];
    return eveningGreetings[
      Math.floor(Math.random() * eveningGreetings.length)
    ];
  }
}

/**
 * Split message into chunks of maximum 2000 characters smartly
 */
function splitMessageIntoChunks(message) {
  const chunks = [];
  const maxLength = 2000;

  // If message is short enough, just return it as a single chunk
  if (message.length <= maxLength) {
    chunks.push(message);
    return chunks;
  }

  // Split message into paragraphs first
  const paragraphs = message.split("\n\n");

  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit, push current chunk and start new one
    if (
      currentChunk.length + paragraph.length + 2 > maxLength &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph + "\n\n";
    } else {
      // Otherwise, add paragraph to current chunk
      currentChunk += paragraph + "\n\n";
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  // If somehow we still have chunks that are too long, split them forcefully
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxLength) {
      finalChunks.push(chunk);
    } else {
      // Force split by sentences (split by periods, question marks, exclamation marks)
      const sentences = chunk.split(/(?<=[.!?])\s+/);
      let tempChunk = "";

      for (const sentence of sentences) {
        if (tempChunk.length + sentence.length + 1 > maxLength) {
          if (tempChunk.trim().length > 0) {
            finalChunks.push(tempChunk.trim());
          }
          tempChunk = sentence + " ";
        } else {
          tempChunk += sentence + " ";
        }
      }

      if (tempChunk.trim().length > 0) {
        finalChunks.push(tempChunk.trim());
      }
    }
  }

  return finalChunks;
}

/**
 * Generate final dynamic message combining all elements in a cohesive, poetic narrative
 * diantara 1000-1500-2000 characters
 * This function now generates all content in a single API call to minimize usage
 */
async function generateFinalMessage(timeInfo, greetingMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya karakter Rangga dari film "Ada Apa Dengan Cinta" - dingin, pendiam, puitis, introspektif, dan filosofis. Panjang pesan diantara 1000-1500 karakter.
    
    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <ucapan>
    ${greetingMessage}
    </ucapan>
    
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${timeInfo.timeOfDay}
    Akhir Pekan: ${timeInfo.isWeekend ? "Ya" : "Tidak"}
    </konteks_waktu>
    
    <penyemangat>
    - Pesan penyemangat sesuai waktu dan hari (weekday/weekend) dengan gaya dingin dan puitis
    - Hindari bahasa yang terlalu ceria atau semangat
    </penyemangat>
    
    <pertanyaan_pribadi>
    - Pertanyaan tentang kabar pembaca yang terasa personal
    - Harus mengalir secara alami dari narasi sebelumnya
    </pertanyaan_pribadi>
    
    <trivia>
    - Buat satu trivia menarik dan unik dalam satu kalimat
    - Bisa tentang apa saja seperti fenomena sosial, seni, sejarah, sains, budaya, teknologi, atau hal-hal menarik lainnya
    - Sisipkan secara alami dalam konteks percakapan
    </trivia>
    
    <topik_obrolan>
    - Buat satu pertanyaan menarik dan santai yang cocok untuk memulai percakapan santai
    - Harus mengalir secara alami dari keseluruhan narasi
    </topik_obrolan>

    <penutup>
    - Memberikan pesan selamat beraktivitas pada pagi dan siang hari
    - Memberikan pesan selamat beristirahat pada malam hari
    - Penutup yang mengalir dengan gaya dingin dan puitis
    </penutup>

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
    - Pastikan format output tidak mengandung tag XML
    - Panjang pesan tidak melebihi 1500 karakter    
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
    return "Maaf, terjadi kesalahan dalam menghasilkan pesan. Ini adalah pesan fallback.";
  }
}

/**
 * Test function to generate and display message in console
 */
async function testConsoleOutput() {
  console.log("=== Test Console Output for Dollars Bot ===\n");

  try {
    // Get time information
    const timeInfo = getTimeInfo();
    console.log(
      `Waktu saat ini: ${timeInfo.timeOfDay} (${
        timeInfo.isWeekend ? "Akhir Pekan" : "Hari Kerja"
      })\n`
    );

    // Get all message components
    const greetingMessage = getGreetingMessage(timeInfo);
    console.log(`Greeting: ${greetingMessage}\n`);

    // const governmentNews = await getGovernmentNews();
    // console.log(`Berita Pemerintah: ${governmentNews}\n`);

    // Generate final message
    console.log("Menghasilkan pesan utama...\n");
    const finalMessage = await generateFinalMessage(timeInfo, greetingMessage);

    // Split message into chunks if it's too long
    const messageChunks = splitMessageIntoChunks(finalMessage);

    console.log("=== PESAN YANG DIHASILKAN ===\n");
    for (let i = 0; i < messageChunks.length; i++) {
      console.log(`--- Bagian ${i + 1} dari ${messageChunks.length} ---`);
      console.log(messageChunks[i]);
      console.log("\n" + "=".repeat(50) + "\n");
    }

    console.log(`Total karakter: ${finalMessage.length}`);
    console.log(`Jumlah bagian: ${messageChunks.length}`);

    console.log("\n=== Test Selesai ===");
  } catch (error) {
    console.error("Error during test:", error.message);
  }
}

// Run the test
testConsoleOutput();
