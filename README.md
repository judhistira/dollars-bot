# GERD Meal Reminder Bot

A Discord bot that reminds GERD patients to eat meals at scheduled times with weather-based food recommendations and motivational messages.

## Features

1. Scheduled meal reminders (customizable times)
2. Weather-based food recommendations using OpenWeatherMap
3. Gemini-powered food suggestions suitable for office workers with GERD
4. Motivational messages to encourage healthy eating
5. Dynamic message generation using Google Gemini API
6. Deployable on Railway's free tier with webhook support

## Setup Instructions

### Prerequisites

1. Node.js (v16 or higher)
2. Discord Bot Token
3. Google Gemini API Key
4. OpenWeatherMap API Key

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   DISCORD_TOKEN=your_discord_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   CHANNEL_ID=your_channel_id_here
   LOCATION=Jakarta
   TIMEZONE=Asia/Jakaka
   REMINDER_TIMES=08:00,12:00,18:00
   ```

### Configuration

- `DISCORD_TOKEN`: Your Discord bot token from the Discord Developer Portal
- `GEMINI_API_KEY`: Your Google Gemini API key from Google AI Studio
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
- `CHANNEL_ID`: The ID of the Discord channel where reminders will be sent
- `LOCATION`: Your city/location for weather data
- `TIMEZONE`: Timezone for scheduling (e.g., Asia/Jakarta)
- `REMINDER_TIMES`: Comma-separated list of reminder times in 24-hour format (for local deployment)
- `WEBHOOK_PATH`: (Optional) Custom webhook path (default: /gerd-reminder)
- `PORT`: (Optional) Port for webhook server (default: 3000)

### Running the Bot Locally

For local deployment with built-in scheduler:
```bash
npm start
```

To test the reminder functionality without waiting for scheduled times:
```bash
npm run test-reminder
```

### Deployment on Railway

1. Create a new project on [Railway](https://railway.app/)
2. Connect your GitHub repository or upload the files directly
3. Add the environment variables in the Railway dashboard
4. Set the run command to `npm start`
5. Deploy!

For Railway deployment, you'll need to set up an external scheduler (like Cron-job.org) to trigger the webhook:
- Endpoint: `https://your-app-url.railway.app/gerd-reminder`
- Method: POST
- Schedule: Configure based on your desired reminder times

Note: Railway's free tier has limitations on execution time, but the webhook approach will work within these constraints.

## How It Works

1. The bot fetches current weather data for your location
2. Uses Google Gemini to generate food recommendations based on weather and GERD dietary needs
3. Creates motivational messages to encourage healthy eating
4. Combines all information into a dynamic, engaging message
5. Sends reminders either:
   - Automatically at scheduled times (local deployment)
   - When triggered by webhook (Railway deployment)

## Testing

You can test the bot's reminder functionality without waiting for scheduled times:

```bash
npm run test-reminder
```

This will send a POST request to your webhook endpoint and trigger the reminder message to be sent to Discord. Make sure your bot is running before running this test.

If testing locally, the script will send a request to `http://localhost:3000/gerd-reminder` by default. You can customize this by setting the `APP_URL` environment variable in your `.env` file:

```env
APP_URL=https://your-app-url.railway.app
```