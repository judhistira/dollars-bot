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

// Weather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const LOCATION = process.env.LOCATION || "Jatibarang, ID";

// Webhook configuration
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/gerd-reminder";

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

/**
 * Get current weather data for the configured location
 */
async function getWeatherData() {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
    );
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

/**
 * Get food recommendation based on weather
 */
async function getFoodRecommendation(weatherData, timeOfDay) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Berikan rekomendasi makanan yang cocok untuk kekasihmu yang memiliki penyakit GERD (gastroesophageal reflux disease) berdasarkan kondisi cuaca dan waktu saat ini:
    
    Waktu: ${timeOfDay}
    Cuaca: ${
      weatherData
        ? `${weatherData.description} dengan suhu ${weatherData.temperature}°C dan kelembapan ${weatherData.humidity}%`
        : "Data cuaca tidak tersedia"
    }
    
    Rekomendasikan 3 makanan dengan format **2 menu berbasis nasi dan 1 menu non-nasi yang variatif**. Semua makanan harus:
    1. Mudah diperoleh di warung makan, warteg, atau restoran terjangkau terdekat.
    2. Ramah bagi penderita GERD (tidak pedas, tidak asam, tidak berlemak).
    3. Sesuai dengan kondisi cuaca dan waktu saat ini (hangat jika dingin, segar jika panas).
    4. Cocok untuk orang yang sedang bekerja di kantor (mudah dibawa, tidak terlalu berminyak).
    5. Gunakan bahasa Indonesia yang ramah, personal, dan menarik.
    
    Format dalam bentuk daftar berikut (BUAT SINGKAT):
    - Menu Nasi 1
    - Menu Nasi 2
    - Menu Non-Nasi 1`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting food recommendation:", error.message);
    return "- Nasi tim ayam jamur\n- Nasi sup bening sayuran\n- Kentang rebus dengan telur";
  }
}

/**
 * Get motivational message based on time of day
 */
async function getMotivationalMessage(timeOfDay) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Buatkan pesan penyemangat singkat (1-2 kalimat) yang penuh kasih sayang untuk mengingatkan kekasihmu yang punya GERD agar makan teratur.
    
    Konteks Waktu: ${timeOfDay}
    
    - Jika waktu adalah 'Sarapan/Pagi' atau 'Makan Siang', berikan semangat untuk aktivitas atau pekerjaannya.
    - Jika waktu adalah 'Makan Malam', ingatkan dia untuk rileks dan beristirahat setelah makan.
    
    Gunakan bahasa yang lembut, hangat, dan penuh cinta.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting motivational message:", error.message);
    return "Jangan lupa makan ya, sayang! Jaga kesehatan lambungmu, aku peduli sama kamu.";
  }
}

/**
 * Generate final dynamic message combining all elements
 */
async function generateFinalMessage(
  weatherData,
  foodRecommendation,
  motivationalMessage
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Gabungkan semua informasi berikut menjadi pesan yang sangat personal dan penuh kasih sayang, seolah-olah dikirim oleh kekasih kepada pasangannya yang memiliki penyakit GERD:
    
    Cuaca saat ini: ${
      weatherData
        ? `${weatherData.description} dengan suhu ${weatherData.temperature}°C`
        : "Data cuaca tidak tersedia"
    }
    Rekomendasi makanan: ${foodRecommendation}
    Pesan penyemangat: ${motivationalMessage}
    
    Buat pesan yang penuh kasih sayang, perhatian, dan cinta dengan bahasa Indonesia yang lembut dan hangat. Format pesan harus cocok untuk dikirim di Discord. Gunakan emoji secukupnya untuk membuat pesan lebih menarik dan personal.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating final message:", error.message);
    // Fallback message if Gemini fails
    let fallbackMessage =
      `:alarm_clock: **Waktunya Makan, Sayang!** :alarm_clock:\n\n` +
      `Halo kekasihku! Jangan lupa makan :heart:\n\n` +
      `Cuaca: ${
        weatherData
          ? `${weatherData.description} (${weatherData.temperature}°C)`
          : "Tidak tersedia"
      }\n\n` +
      `**Rekomendasi:**\n${foodRecommendation}\n\n` +
      `:sparkling_heart: _\"${motivationalMessage}\"_`;

    return fallbackMessage.substring(0, 2000);
  }
}

/**
 * Send meal reminder to Discord channel
 * @param {Client} client The Discord client instance
 */
async function sendMealReminder(client) {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) {
      console.error("Channel not found");
      return { success: false, error: "Channel not found" };
    }

    const timeOfDay = new Date().getHours() < 10
        ? "Sarapan/Pagi"
        : new Date().getHours() < 15
        ? "Makan Siang"
        : "Makan Malam";

    const weatherData = await getWeatherData();
    const foodRecommendation = await getFoodRecommendation(weatherData, timeOfDay);
    const motivationalMessage = await getMotivationalMessage(timeOfDay);
    let finalMessage = await generateFinalMessage(
      weatherData,
      foodRecommendation,
      motivationalMessage
    );

    await channel.send(finalMessage.substring(0, 2000));
    console.log("Meal reminder sent successfully");
    return { success: true, message: "Meal reminder sent successfully" };
  } catch (error) {
    console.error("Error sending meal reminder:", error.message);
    return { success: false, error: error.message };
  }
}

// Helper function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Webhook endpoint for Vercel
app.all(WEBHOOK_PATH, async (req, res) => {
  console.log(`Webhook triggered. Starting GERD Bot lifecycle...`);
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
      result = await sendMealReminder(client);
      if (result.success) {
        console.log(`Message sent successfully on attempt ${attempt}.`);
        break; // Exit loop on success
      }
      if (attempt < MAX_RETRIES) {
        console.log(`Attempt ${attempt} failed. Retrying in ${RETRY_DELAY / 1000}s...`);
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
module.exports.sendMealReminder = sendMealReminder;

