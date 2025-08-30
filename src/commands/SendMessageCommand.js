const config = require("../config");
const { getTimeInfo, splitMessageIntoChunks } = require("../utils.js");
const { getGovernmentNews, generateFinalMessage } = require("../gemini.js");
const { getGreetingMessage } = require("../message/greetingGenerator.js");

class SendMessageCommand {
  constructor(client) {
    this.client = client;
  }

  async execute() {
    try {
      const channelIds = config.CHANNEL_IDS;
      if (channelIds.length === 0) {
        console.error(
          "No channel IDs found in CHANNEL_IDS environment variable."
        );
        return { success: false, error: "No channel IDs specified." };
      }

      // Get time information
      const timeInfo = getTimeInfo();

      // Get all message components
      const greetingMessage = getGreetingMessage(timeInfo);
      const governmentNews = await getGovernmentNews();

      // Generate final message (this now includes trivia and random topic generation)
      let finalMessage = await generateFinalMessage(
        timeInfo,
        greetingMessage,
        governmentNews
      );

      // Split message into chunks if it's too long and send each chunk
      const messageChunks = splitMessageIntoChunks(finalMessage);

      const results = [];
      for (const channelId of channelIds) {
        try {
          const channel = await this.client.channels.fetch(channelId);
          if (!channel) {
            console.warn(`Channel with ID ${channelId} not found. Skipping.`);
            results.push({
              channelId,
              success: false,
              error: "Channel not found",
            });
            continue;
          }

          for (let i = 0; i < messageChunks.length; i++) {
            let chunkToSend = messageChunks[i];
            if (i > 0) {
              chunkToSend = "​\n" + chunkToSend;
            }
            await channel.send(chunkToSend);
            // Add a small delay between messages to avoid rate limiting
            if (messageChunks.length > 1 && i < messageChunks.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }

          console.log(
            `Encouragement message sent successfully to channel ${channelId} in ${messageChunks.length} part(s)`
          );
          results.push({
            channelId,
            success: true,
            message: `Encouragement message sent successfully in ${messageChunks.length} part(s)`,
          });
        } catch (error) {
          console.error(
            `Error sending message to channel ${channelId}:`,
            error.message
          );
          results.push({ channelId, success: false, error: error.message });
        }
      }
      return { success: results.some((r) => r.success), results };
    } catch (error) {
      console.error("Error in SendMessageCommand execution:", error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = SendMessageCommand;
