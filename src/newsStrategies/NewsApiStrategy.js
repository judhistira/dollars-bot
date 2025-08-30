const axios = require("axios");
const config = require("../config");

class NewsApiStrategy {
  async getNews() {
    try {
      const NEWS_API_KEY = config.NEWS_API_KEY;
      if (!NEWS_API_KEY) {
        return null; // Or throw an error, depending on desired behavior
      }

      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=indonesia+government&pagenumber=1&pagesize=1&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );

      if (response.data.articles && response.data.articles.length > 0) {
        const article = response.data.articles[0];
        return `${article.title} - ${article.description || ""}`;
      }
      return null;
    } catch (error) {
      console.error("Error fetching news from NewsAPI:", error.message);
      return null;
    }
  }
}

module.exports = NewsApiStrategy;
