class ParagraphSplitter {
  constructor(nextSplitter = null) {
    this.nextSplitter = nextSplitter;
  }

  split(message, maxLength) {
    const chunks = [];
    const paragraphs = message.split("\n\n");

    let currentChunk = "";

    for (const paragraph of paragraphs) {
      if (
        currentChunk.length + paragraph.length + 2 > maxLength &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        currentChunk = paragraph + "\n\n";
      } else {
        currentChunk += paragraph + "\n\n";
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
        // Fallback if no more splitters can handle it (shouldn't happen with SentenceSplitter)
        finalChunks.push(chunk);
      }
    }
    return finalChunks;
  }
}

module.exports = ParagraphSplitter;
