class SentenceSplitter {
  constructor(nextSplitter = null) {
    this.nextSplitter = nextSplitter;
  }

  split(message, maxLength) {
    const chunks = [];
    const sentences = message.split(/(?<=[.!?])\s+/);
    let currentChunk = "";

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length + 1 > maxLength) {
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence + " ";
      } else {
        currentChunk += sentence + " ";
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    // If any chunk is still too long, pass it to the next splitter in the chain
    const finalChunks = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxLength) {
        finalChunks.push(chunk);
      } else if (this.nextSplitter) {
        finalChunks.push(...this.nextSplitter.split(chunk, maxLength));
      } else {
        // Fallback if no more splitters can handle it (shouldn't happen with SentenceSplitter as last)
        finalChunks.push(chunk);
      }
    }
    return finalChunks;
  }
}

module.exports = SentenceSplitter;
