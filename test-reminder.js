require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { sendEncouragementMessage } = require("./index.js");

async function runTest() {
  console.log("Starting local test...");

  // 1. Initialize Discord Client
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.on("error", (error) => {
    console.error("Discord client encountered an error:", error);
  });

  try {
    // 2. Login and wait for ready
    await new Promise((resolve, reject) => {
      client.once("ready", () => {
        console.log(`Bot is ready as ${client.user.tag}`);
        resolve();
      });
      client.login(process.env.DISCORD_TOKEN).catch(reject);
    });

    // 3. Send the message
    console.log("Attempting to send a test encouragement message...");
    const result = await sendEncouragementMessage(client);
    console.log("Test finished.");

    if (result && result.success) {
      console.log("✅ Success:", result.message);
    } else {
      console.error("❌ Failure:", result ? result.error : "Unknown error");
    }
    
    // Return the result for better integration
    return result;
  } catch (error) {
    console.error("❌ An unexpected error occurred during the test:", error);
    return { success: false, error: error.message };
  } finally {
    // 4. Logout and cleanup
    if (client.isReady()) {
      console.log("Closing Discord client connection.");
      client.destroy();
    }
  }
}

// Run the test and handle the result
runTest().then(result => {
  if (result && result.success) {
    console.log("Test completed successfully!");
    process.exit(0);
  } else {
    console.error("Test failed!");
    process.exit(1);
  }
});