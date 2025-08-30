const express = require("express");
const getDiscordClient = require("./services/discordService");
const config = require("./config");
const { SendMessageCommand } = require("./bot.js");

// Initialize Express app
const app = express();
app.use(express.json());

// Webhook configuration
const WEBHOOK_PATH = config.WEBHOOK_PATH;

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Helper function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Webhook endpoint for Vercel
app.all(WEBHOOK_PATH, async (req, res) => {
  console.log(`Webhook triggered. Starting Dollars Bot lifecycle...`);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  let client;
  try {
    client = await getDiscordClient();

  try {
    

    let result;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`Attempt ${attempt} to send message...`);
      result = await new SendMessageCommand(client).execute();
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
    // No client.destroy() here, as it's a singleton and should persist
  }
});

// Export the app for Vercel
module.exports = app;

