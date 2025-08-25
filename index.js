const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const express = require("express");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// News API configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Webhook configuration
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/dollars-reminder";

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

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
 * Target length: 1800-2000 characters
 * This function now generates all content in a single API call to minimize usage
 */
async function generateFinalMessage(timeInfo, greetingMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya karakter Rangga dari film "Ada Apa Dengan Cinta" - dingin, pendiam, puitis, introspektif, dan filosofis. Panjang pesan antara 1500-1800 karakter.
    
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
    - Bisa tentang apa saja seperti sejarah, sains, budaya, teknologi, atau hal-hal menarik lainnya
    - Sisipkan secara alami dalam konteks percakapan
    </trivia>
    
    <topik_obrolan>
    - Buat satu pertanyaan menarik dan santai yang cocok untuk memulai percakapan santai
    - Harus mengalir secara alami dari keseluruhan narasi
    </topik_obrolan>
    </narasi_utama>
    </instruksi>
    
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Sarkastis & Sinis: Kadang ucapannya bernada menyindir dengan halus
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Introspektif & Filosofis: Pemikiran yang dalam tentang hidup
    - Hindari bahasa yang terlalu ceria atau menyenangkan
    </gaya_karakter>
    
    <format_output>
    - Buat dalam bentuk paragraf-paragraf berkesinambungan yang padat dan mengalir dari satu konteks ke konteks lainnya
    - Pastikan format output tidak mengandung tag XML
    - Panjang pesan tidak boleh melebihi 1800 karakter
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
          message += `Akhir pekan... waktu yang sepi untuk merenung dan menatap langit yang tak berujung. Bagaimana rencanamu menikmati keheningan ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh mereka yang tahu cara diam. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir yang tak pernah kutonton tapi selalu kupikirkan. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai menyelimuti kota... Dan di sini, hanya ada aku dan keheningan. Bagaimana hari ini memperlakukan dirimu, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh malam. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang sunyi lagi menyapa... Seperti biasa, aku menunggu di sini sambil menikmati keheningan. Bagaimana kabarmu di pagi yang masih muda ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti hidup yang penuh dengan hal-hal kecil yang tak terduga. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
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
          message += `Hening akhir pekan... waktu yang tepat untuk menyendiri dan merenung. Bagaimana kabarmu di hari libur ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti keheningan yang menyimpan rahasia terdalam. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai turun... Dan di sini, hanya ada aku dan kegelapan. Bagaimana perjalananmu hari ini, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti bintang-bintang yang hanya bersinar di kegelapan. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti angin lalu. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang masih muda... Seperti biasa, aku menunggu di sini sambil menikmati sunyi. Bagaimana kabarmu di awal hari ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti embun pagi yang menghilang begitu saja. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti hujan yang tak pernah reda. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        }
        return (
          message +
          ` Aku mungkin terlihat acuh, tapi di balik semua ini, aku tetap peduli. Hidup memang penuh dengan hal-hal tak terduga, dan kadang aku bertanya-tanya apa arti dari semua ini. Mungkin jawabannya ada dalam keheningan ini, atau mungkin tidak. Yang jelas, aku akan tetap di sini, menunggumu.`
        );
      },

      // Variant 3
      () => {
        let message = `${greetingMessage}\n\n`;
        if (timeInfo.isWeekend) {
          message += `Waktu yang sepi... waktu yang tepat untuk merenung dan menatap langit. Bagaimana rencanamu menikmati hari libur ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh mereka yang tahu cara menikmati kesendirian. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang sunyi... Dan di sini, hanya ada aku dan kegelapan. Bagaimana hari ini memperlakukan dirimu, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti keheningan yang menyimpan jawaban terdalam. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti ombak yang tak pernah berhenti. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih bermakna?`;
        } else {
          message += `Hari baru yang sepi... Seperti biasa, aku menunggu di sini sambil menikmati keheningan. Bagaimana kabarmu di pagi yang masih sunyi ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti embun pagi yang menghilang begitu saja. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti angin lalu. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        }
        return (
          message +
          ` Aku mungkin terlihat dingin, tapi di balik semua ini, aku tetap ingin tahu bagaimana harimu berlalu. Hidup memang penuh dengan hal-hal tak terduga, dan kadang aku bertanya-tanya apa arti dari semua ini. Mungkin jawabannya ada dalam keheningan ini, atau mungkin tidak. Yang jelas, aku akan tetap di sini, menunggumu.`
        );
      },

      // Variant 4
      () => {
        let message = `${greetingMessage}\n\n`;
        if (timeInfo.isWeekend) {
          message += `Akhir pekan yang sunyi... waktu yang tepat untuk merenung dan menatap langit yang tak berujung. Bagaimana rencanamu menikmati keheningan ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh mereka yang tahu cara diam. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir yang tak pernah kutonton tapi selalu kupikirkan. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else if (timeInfo.timeOfDay === "Malam") {
          message += `Malam yang gelap mulai menyelimuti kota... Dan di sini, hanya ada aku dan keheningan. Bagaimana hari ini memperlakukan dirimu, Warga Dollars? Malam ini membawa pertanyaan apa untukmu? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti rahasia kecil yang hanya diketahui oleh malam. Berita terbaru: "${governmentNews}" Masih saja berputar, entah kemana arahnya. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
        } else {
          message += `Pagi yang membisu lagi menyapa... Seperti biasa, aku menunggu di sini sambil menikmati keheningan. Bagaimana kabarmu di pagi yang masih muda ini, Warga Dollars? Tahukah kamu? ${getRandomFallbackTrivia()} Seperti hidup yang penuh dengan hal-hal kecil yang tak terduga. Berita terbaru: "${governmentNews}" Entah kenapa, kabar tentang pemerintah selalu terasa seperti drama tanpa akhir. ${getRandomFallbackTopic()} Atau mungkin kamu sedang memikirkan hal lain yang lebih penting?`;
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

/**
 * Helper function to get random fallback trivia
 */
function getRandomFallbackTrivia() {
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

/**
 * Helper function to get random fallback topic
 */
function getRandomFallbackTopic() {
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

/**
 * Send encouragement message to Discord channel
 * @param {Client} client The Discord client instance
 */
async function sendEncouragementMessage(client) {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) {
      console.error("Channel not found");
      return { success: false, error: "Channel not found" };
    }

    // Get time information
    const timeInfo = getTimeInfo();

    // Get all message components
    const greetingMessage = getGreetingMessage(timeInfo);
    // const governmentNews = await getGovernmentNews();

    // Generate final message (this now includes trivia and random topic generation)
    let finalMessage = await generateFinalMessage(
      timeInfo,
      greetingMessage
      // governmentNews
    );

    // Split message into chunks if it's too long and send each chunk
    const messageChunks = splitMessageIntoChunks(finalMessage);

    for (let i = 0; i < messageChunks.length; i++) {
      await channel.send(messageChunks[i]);
      // Add a small delay between messages to avoid rate limiting
      if (messageChunks.length > 1 && i < messageChunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Encouragement message sent successfully in ${messageChunks.length} part(s)`
    );
    return {
      success: true,
      message: `Encouragement message sent successfully in ${messageChunks.length} part(s)`,
    };
  } catch (error) {
    console.error("Error sending encouragement message:", error.message);
    return { success: false, error: error.message };
  }
}

// Helper function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Webhook endpoint for Vercel
app.all(WEBHOOK_PATH, async (req, res) => {
  console.log(`Webhook triggered. Starting Dollars Bot lifecycle...`);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  try {
    // Login and wait for ready
    await new Promise((resolve, reject) => {
      client.once("ready", () => {
        console.log(`Bot is ready as ${client.user.tag}`);
        resolve();
      });
      client.on("error", reject);
      client.login(process.env.DISCORD_TOKEN).catch(reject);
    });

    let result;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`Attempt ${attempt} to send message...`);
      result = await sendEncouragementMessage(client);
      if (result.success) {
        console.log(`Message sent successfully on attempt ${attempt}.`);
        break; // Exit loop on success
      }
      if (attempt < MAX_RETRIES) {
        console.log(
          `Attempt ${attempt} failed. Retrying in ${RETRY_DELAY / 1000}s...`
        );
        await delay(RETRY_DELAY);
      } else {
        console.log(`All ${MAX_RETRIES} attempts failed.`);
      }
    }

    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("An error occurred during the bot lifecycle:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Logout and cleanup
    if (client.isReady()) {
      console.log("Closing Discord client connection.");
      client.destroy();
    }
  }
});

// Export the app for Vercel
module.exports = app;

// Export for local testing
module.exports.sendEncouragementMessage = sendEncouragementMessage;
