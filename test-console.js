require("dotenv").config();
const { generateFinalMessage } = require("./gemini.js");
const { getTimeInfo, splitMessageIntoChunks } = require("./utils.js");
const { getGreetingMessage } = require("./bot.js");

/**
 * Test function to generate and display message in console
 */
async function testConsoleOutput() {
  console.log("=== Test Console Output for Dollars Bot ===\n");

  try {
    // Get time information
    const timeInfo = getTimeInfo();
    console.log(
      `Waktu saat ini: ${timeInfo.dayName} ${timeInfo.timeOfDay} (${
        timeInfo.isWeekend ? "Akhir Pekan" : "Hari Kerja"
      })\n`
    );

    // Get all message components
    const greetingMessage = getGreetingMessage(timeInfo);
    console.log(`Greeting: ${greetingMessage}\n`);

    // Generate final message
    console.log("Menghasilkan pesan utama...\n");
    const finalMessage = await generateFinalMessage(timeInfo, greetingMessage);

    // Split message into chunks if it's too long
    const messageChunks = splitMessageIntoChunks(finalMessage);

    console.log("=== PESAN YANG DIHASILKAN ===\n");
    for (let i = 0; i < messageChunks.length; i++) {
      console.log(`--- Bagian ${i + 1} dari ${messageChunks.length} ---`);
      console.log(messageChunks[i]);
      console.log("\n" + "=".repeat(50) + "\n");
    }

    console.log(`Total karakter: ${finalMessage.length}`);
    console.log(`Jumlah bagian: ${messageChunks.length}`);

    console.log("\n=== Test Selesai ===");
  } catch (error) {
    console.error("Error during test:", error.message);
  }
}

// Run the test
testConsoleOutput();
