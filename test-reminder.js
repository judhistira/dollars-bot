require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { sendMealReminder } = require("./index.js");

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
    console.log("Attempting to send a test reminder...");
    const result = await sendMealReminder(client);
    console.log("Test finished.");

    if (result && result.success) {
      console.log("✅ Success:", result.message);
    } else {
      console.error("❌ Failure:", result ? result.error : "Unknown error");
    }
  } catch (error) {
    console.error("❌ An unexpected error occurred during the test:", error);
  } finally {
    // 4. Logout and cleanup
    if (client.isReady()) {
      console.log("Closing Discord client connection.");
      client.destroy();
    }
  }
}

runTest();