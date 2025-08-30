const config = require("./src/config");
const getDiscordClient = require("./src/services/discordService");
const { SendMessageCommand } = require("./src/bot.js");

async function runTest() {
  console.log("Starting local test...");

  let client;
  try {
    client = await getDiscordClient();

    // 3. Send the message
    console.log("Attempting to send a test encouragement message...");
    const result = await new SendMessageCommand(client).execute();
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
    // No client.destroy() here, as it's a singleton and should persist
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