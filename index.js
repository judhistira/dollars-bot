const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const express = require("express");

// Load environment variables
dotenv.config();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize Express app for webhook
const app = express();
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Weather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const LOCATION = process.env.LOCATION || "Jatibarang, ID";

// Timezone configuration
const TIMEZONE = process.env.TIMEZONE || "Asia/Jakarta";

// Parse reminder times (for local deployment)
const REMINDER_TIMES = process.env.REMINDER_TIMES
  ? process.env.REMINDER_TIMES.split(",")
  : [];

// Webhook configuration (for Railway deployment)
const WEBHOOK_PORT = process.env.PORT || 3000;
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
async function getFoodRecommendation(weatherData) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Berikan rekomendasi makanan yang cocok untuk kekasihmu yang memiliki penyakit GERD (gastroesophageal reflux disease) berdasarkan kondisi cuaca dan waktu saat ini:
    
    Waktu: ${
      new Date().getHours() < 10
        ? "Sarapan/Pagi"
        : new Date().getHours() < 15
        ? "Makan Siang"
        : "Makan Malam"
    }
    Cuaca: ${
      weatherData
        ? `${weatherData.description} dengan suhu ${weatherData.temperature}°C dan kelembapan ${weatherData.humidity}%`
        : "Data cuaca tidak tersedia"
    }
    
    Rekomendasikan 3 makanan yang:
    1. Mudah diperoleh di warung makan, warteg, atau restoran terjangkau terdekat
    2. Ramah bagi penderita GERD (tidak pedas, tidak asam, tidak berlemak)
    3. Sesuai dengan kondisi cuaca dan waktu saat ini:
       - Jika cuaca dingin, sarankan makanan hangat
       - Jika cuaca panas, sarankan makanan segar/dingin
       - Untuk sarapan, sarankan makanan ringan namun bergizi
       - Untuk makan siang, sarankan makanan mengenyangkan
       - Untuk makan malam, sarankan makanan ringan dan mudah dicerna
    4. Cocok untuk orang yang sedang bekerja di kantor (mudah dibawa, tidak terlalu berminyak)
    5. Gunakan bahasa Indonesia yang ramah, personal, dan menarik
    
    Format dalam bentuk daftar berikut (BUAT SINGKAT):
    - Makanan 1
    - Makanan 2
    - Makanan 3`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting food recommendation:", error.message);
    return "- Nasi uduk dengan ayam suwir\n- Bubur ayam tanpa kuah pedas\n- Roti panggang dengan selai kacang";
  }
}

/**
 * Get motivational message
 */
async function getMotivationalMessage() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Buatkan pesan penyemangat singkat (1-2 kalimat) yang penuh kasih sayang dan perhatian untuk mengingatkan kekasihmu yang memiliki penyakit GERD agar tetap makan teratur dan menjaga pola makan. Gunakan bahasa yang lembut, hangat, dan penuh cinta. Pesan ini akan digunakan sebagai pengingat makan.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error getting motivational message:", error.message);
    return "Jangan lupa makan ya! Pola makan teratur penting untuk menjaga kesehatan lambungmu.";
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
    // Fallback message if Gemini fails - keep it concise
    let fallbackMessage =
      `:alarm_clock: **Waktunya Makan, Sayang!** :alarm_clock:\n\n` +
      `Halo kekasihku! Jangan lupa makan :heart:\n\n` +
      `Cuaca: ${
        weatherData
          ? `${weatherData.description} (${weatherData.temperature}°C)`
          : "Tidak tersedia"
      }\n\n` +
      `**Rekomendasi:**\n${foodRecommendation}\n\n` +
      `:sparkling_heart: _"${motivationalMessage}"_`;

    // Ensure fallback message is also within limit
    if (fallbackMessage.length > 2000) {
      fallbackMessage = fallbackMessage.substring(0, 1997) + "...";
    }

    return fallbackMessage;
  }
}

/**
 * Send meal reminder to Discord channel
 */
async function sendMealReminder() {
  try {
    // Get channel
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (!channel) {
      console.error("Channel not found");
      return;
    }

    // Get weather data
    const weatherData = await getWeatherData();

    // Get food recommendation
    const foodRecommendation = await getFoodRecommendation(weatherData);

    // Get motivational message
    const motivationalMessage = await getMotivationalMessage();

    // Generate final message
    let finalMessage = await generateFinalMessage(
      weatherData,
      foodRecommendation,
      motivationalMessage
    );

    // Ensure message is within Discord's 2000 character limit
    if (finalMessage.length > 2000) {
      console.log(
        `Message too long (${finalMessage.length} characters). Truncating...`
      );
      // Try to truncate at a natural break point
      finalMessage = finalMessage.substring(0, 1997) + "...";
    }

    // Send message to channel
    await channel.send(finalMessage);
    console.log("Meal reminder sent successfully");
    return { success: true, message: "Meal reminder sent successfully" };
  } catch (error) {
    console.error("Error sending meal reminder:", error.message);
    return { success: false, error: error.message };
  }
}

// For Vercel/Webhook deployment: Set up webhook endpoint
app.post(WEBHOOK_PATH, async (req, res) => {
  console.log("Webhook triggered for meal reminder");
  // Ensure client is ready before sending message
  if (!client.isReady()) {
    console.log("Client not ready, waiting for login...");
    await new Promise((resolve) => client.once("clientReady", resolve));
  }
  const result = await sendMealReminder();
  res.status(result.success ? 200 : 500).json(result);
});

// Discord client events
client.once("clientReady", () => {
  console.log("GERD Bot is ready!");
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

// Export the app for Vercel
module.exports = app;

// Export for local testing
module.exports.client = client;
module.exports.sendMealReminder = sendMealReminder;
