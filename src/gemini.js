const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("./config");
const NewsApiStrategy = require("./newsStrategies/NewsApiStrategy");
const GeminiNewsStrategy = require("./newsStrategies/GeminiNewsStrategy");
const RanggaPromptBuilder = require("./builders/RanggaPromptBuilder");
const FallbackMessageFactory = require("./factories/FallbackMessageFactory");
const { convertToOldIndonesianSpelling } = require("./utils");

/**
 * Get latest news about Indonesian government
 */
async function getGovernmentNews() {
  let newsStrategy;
  if (config.NEWS_API_KEY) {
    newsStrategy = new NewsApiStrategy();
  } else {
    newsStrategy = new GeminiNewsStrategy();
  }
  return newsStrategy.getNews();
}

/**
 * Generate final dynamic message combining all elements in a cohesive, poetic narrative
 */
async function generateFinalMessage(timeInfo, greetingMessage, governmentNews) {
  try {
    const model = new GoogleGenerativeAI(config.GEMINI_API_KEY).getGenerativeModel({
      model: config.GEMINI_MODEL,
    });

    const prompt = new RanggaPromptBuilder()
      .withGreeting(greetingMessage)
      .withTimeInfo(timeInfo)
      .withGovernmentNews(governmentNews)
      .build();

    const result = await model.generateContent(prompt);

    // Check if result and result.response are valid before accessing .text()
    if (!result || !result.response) {
      console.error("Gemini API returned an invalid response.", result);
      return FallbackMessageFactory.createFinalFallbackMessage(timeInfo, greetingMessage, governmentNews);
    }

    let responseText = result.response.text();

    // Clean up XML tags from the response
    responseText = responseText.replace(/<[^>]*>/g, "");

    // Ensure no more than 2 consecutive newlines (fix spacing)
    responseText = responseText.replace(/\n{3,}/g, "\n\n");

    // Apply old Indonesian spelling if LANGUAGE_STYLE is 'soe_hok_gie'
    if (config.LANGUAGE_STYLE === 'soe_hok_gie') {
      responseText = convertToOldIndonesianSpelling(responseText);
    }

    return responseText;
  } catch (error) {
    console.error("Error generating final message:", error.message);
    return FallbackMessageFactory.createFinalFallbackMessage(timeInfo, greetingMessage, governmentNews);
  }
}

module.exports = { getGovernmentNews, generateFinalMessage };