require("dotenv").config();

const { client, sendMealReminder } = require("./index.js");

console.log("Starting local test...");

client.once("clientReady", async () => {
  console.log(`Bot is ready as ${client.user.tag}`);
  console.log("Attempting to send a test reminder...");

  try {
    const result = await sendMealReminder();
    console.log("Test finished.");

    if (result && result.success) {
      console.log("✅ Success:", result.message);
    } else {
      console.error("❌ Failure:", result ? result.error : "Unknown error");
    }
  } catch (error) {
    console.error("❌ An unexpected error occurred during the test:", error);
  } finally {
    // Close the connection to allow the script to exit
    console.log("Closing Discord client connection.");
    client.destroy();
  }
});

client.on("error", (error) => {
  console.error("Discord client encountered an error:", error);
});

// The login is already handled in index.js when it's required
console.log("Waiting for Discord client to log in...");