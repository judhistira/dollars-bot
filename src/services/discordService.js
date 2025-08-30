const { Client, GatewayIntentBits } = require("discord.js");
const config = require("../config");

let clientInstance = null;

async function getDiscordClient() {
  if (clientInstance) {
    return clientInstance;
  }

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
    await new Promise((resolve, reject) => {
      client.once("clientReady", () => {
        console.log(`Bot is ready as ${client.user.tag}`);
        resolve();
      });
      client.login(config.DISCORD_TOKEN).catch(reject);
    });
    clientInstance = client;
    return clientInstance;
  } catch (error) {
    console.error("Failed to connect to Discord:", error);
    throw error;
  }
}

module.exports = getDiscordClient;
