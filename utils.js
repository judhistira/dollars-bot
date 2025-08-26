/**
 * Get current time of day and day type (weekday/weekend)
 */
function getTimeInfo() {
  const now = new Date();
  const options = {
    timeZone: process.env.TIMEZONE || "Asia/Jakarta",
    hour: "2-digit",
    hour12: false,
  };
  const hourInWIB = parseInt(
    new Intl.DateTimeFormat("en-US", options).format(now)
  );

  const isWeekend = now.getDay() === 0 || now.getDay() === 6; // 0 = Sunday, 6 = Saturday

  let timeOfDay;
  if (hourInWIB < 11) {
    timeOfDay = "Pagi";
  } else if (hourInWIB < 17) {
    timeOfDay = "Siang";
  } else {
    timeOfDay = "Malam";
  }

  return {
    timeOfDay,
    isWeekend,
    hour: hourInWIB,
  };
}

/**
 * Split message into chunks of maximum 2000 characters smartly
 */
function splitMessageIntoChunks(message) {
  const chunks = [];
  const maxLength = 2000;

  // If message is short enough, just return it as a single chunk
  if (message.length <= maxLength) {
    chunks.push(message);
    return chunks;
  }

  // Split message into paragraphs first
  const paragraphs = message.split("\n\n");

  let currentChunk = "";

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit, push current chunk and start new one
    if (
      currentChunk.length + paragraph.length + 2 > maxLength &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph + "\n\n";
    } else {
      // Otherwise, add paragraph to current chunk
      currentChunk += paragraph + "\n\n";
    }
  }

  // Don't forget the last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  // If somehow we still have chunks that are too long, split them forcefully
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxLength) {
      finalChunks.push(chunk);
    } else {
      // Force split by sentences (split by periods, question marks, exclamation marks)
      const sentences = chunk.split(/(?<=[.!?])\s+/);
      let tempChunk = "";

      for (const sentence of sentences) {
        if (tempChunk.length + sentence.length + 1 > maxLength) {
          if (tempChunk.trim().length > 0) {
            finalChunks.push(tempChunk.trim());
          }
          tempChunk = sentence + " ";
        } else {
          tempChunk += sentence + " ";
        }
      }

      if (tempChunk.trim().length > 0) {
        finalChunks.push(tempChunk.trim());
      }
    }
  }

  return finalChunks;
}

module.exports = { getTimeInfo, splitMessageIntoChunks };