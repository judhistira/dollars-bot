const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

// Get the Railway app URL or use localhost for local testing
const APP_URL = process.env.APP_URL || "https://bucin-gerd-bot.vercel.app";
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || "/gerd-reminder";

// The full webhook URL
const WEBHOOK_URL = `${APP_URL}${WEBHOOK_PATH}`;

async function testReminder() {
  try {
    console.log(`Sending test request to: ${WEBHOOK_URL}`);

    // Send POST request to trigger the reminder
    const response = await axios.post(WEBHOOK_URL, {});

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.data.success) {
      console.log("✅ Test reminder sent successfully!");
    } else {
      console.log("❌ Error sending test reminder:", response.data.error);
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.log("❌ Server error:", error.response.status);
      console.log("Error data:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.log("❌ No response received from server");
      console.log("Error message:", error.message);
    } else {
      // Something else happened
      console.log("❌ Error:", error.message);
    }
  }
}

// Run the test
console.log("Testing GERD bot reminder...");
testReminder();
