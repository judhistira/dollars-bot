const dotenv = require("dotenv");

dotenv.config();

const config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  CHANNEL_IDS: process.env.CHANNEL_IDS ? process.env.CHANNEL_IDS.split(",").map((id) => id.trim()) : [],
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  TIMEZONE: process.env.TIMEZONE || "Asia/Jakarta",
  WEBHOOK_PATH: process.env.WEBHOOK_PATH || "/dollars-reminder",
  MESSAGE_THEME: process.env.MESSAGE_THEME || "rangga", // Default theme
  LANGUAGE_STYLE: process.env.LANGUAGE_STYLE || "poetic", // Default style
};

// Add valid themes and styles for validation or documentation
config.VALID_MESSAGE_THEMES = ["rangga", "activist_commentary"];
config.VALID_LANGUAGE_STYLES = ["poetic", "sarcastic", "motivational", "soe_hok_gie"];

// Validate essential environment variables
if (!config.DISCORD_TOKEN) {
  console.warn("DISCORD_TOKEN is not set. Bot functionality may be limited.");
}
if (!config.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set. Gemini AI functionality will not work.");
}
if (config.CHANNEL_IDS.length === 0) {
  console.warn("CHANNEL_IDS is not set. Messages will not be sent to any channel.");
}

module.exports = config;
