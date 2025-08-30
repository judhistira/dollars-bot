const config = require("./config");
const ParagraphSplitter = require("./messageSplitters/ParagraphSplitter");
const SentenceSplitter = require("./messageSplitters/SentenceSplitter");

/**
 * Get current time of day and day type (weekday/weekend)
 */
function getTimeInfo() {
  const now = new Date();
  const options = {
    timeZone: config.TIMEZONE,
    hour: "2-digit",
    hour12: false,
    weekday: "long", // Add weekday option
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(now);

  let hourInWIB;
  let dayNameInWIB;

  for (const part of parts) {
    if (part.type === 'hour') {
      hourInWIB = parseInt(part.value);
    }
    if (part.type === 'weekday') {
      dayNameInWIB = part.value;
    }
  }

  // Map day names to numbers for isWeekend calculation
  const dayNameToNumber = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
  };

  const isWeekend = dayNameToNumber[dayNameInWIB] === 0 || dayNameToNumber[dayNameInWIB] === 6;
  const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: config.TIMEZONE }).format(now);

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
    dayName,
  };
}

/**
 * Split message into chunks of maximum 2000 characters smartly
 */
function splitMessageIntoChunks(message) {
  const maxLength = 2000;
  const sentenceSplitter = new SentenceSplitter();
  const paragraphSplitter = new ParagraphSplitter(sentenceSplitter);

  return paragraphSplitter.split(message, maxLength);
}

/**
 * Converts Indonesian text to old Indonesian spelling based on specific rules.
 * This function uses a two-pass (placeholder) approach to ensure robustness
 * and prevent cascading replacements, handling both uppercase and lowercase.
 * 
 * Rules implemented:
 * - Y -> J (e.g., 'saya' -> 'saja')
 * - C -> Tj (e.g., 'cinta' -> 'tjinta')
 * - J -> Dj (e.g., 'jalan' -> 'djalan')
 * - U -> Oe (e.g., 'umur' -> 'oemoer')
 * - Sy -> Sj (e.g., 'syarat' -> 'sjarat')
 * - Ny -> Nj (e.g., 'nyanyi' -> 'njanyi')
 * - Kh -> Ch (e.g., 'khusus' -> 'choesoes')
 * 
 * Note: Handling diacritics like ain (‘) and trema (¨) requires more complex
 * phonetic or orthographic rules and is beyond simple string replacement.
 * This function focuses on direct character/digraph substitutions.
 * 
 * @param {string} text The input text to convert.
 * @returns {string} The converted text with old Indonesian spelling.
 */
function convertToOldIndonesianSpelling(text) {
  let convertedText = text;

  // Define all replacement rules. Multi-character replacements are listed first
  // to ensure they are processed before their constituent single characters.
  const replacements = [
    // Digraphs (two-character combinations)
    { original: /Sy/g, temp: '\uE000', final: 'Sj' },
    { original: /sy/g, temp: '\uE001', final: 'sj' },
    { original: /Ny/g, temp: '\uE002', final: 'Nj' },
    { original: /ny/g, temp: '\uE003', final: 'nj' },
    { original: /Kh/g, temp: '\uE004', final: 'Ch' },
    { original: /kh/g, temp: '\uE005', final: 'ch' },

    // Single characters
    { original: /Y/g, temp: '\uE006', final: 'J' }, // Y becomes J
    { original: /y/g, temp: '\uE007', final: 'j' },
    { original: /C/g, temp: '\uE008', final: 'Tj' }, // C becomes Tj
    { original: /c/g, temp: '\uE009', final: 'tj' },
    { original: /J/g, temp: '\uE00A', final: 'Dj' }, // J becomes Dj
    { original: /j/g, temp: '\uE00B', final: 'dj' },
    { original: /U/g, temp: '\uE00C', final: 'Oe' }, // U becomes Oe
    { original: /u/g, temp: '\uE00D', final: 'oe' },
  ];

  // Pass 1: Replace original characters/digraphs with unique temporary placeholders.
  // This prevents newly introduced characters from being re-processed by other rules.
  for (const rep of replacements) {
    convertedText = convertedText.replace(rep.original, rep.temp);
  }

  // Pass 2: Replace the temporary placeholders with their final old spelling equivalents.
  for (const rep of replacements) {
    // Use new RegExp to create a regex from the string placeholder for global replacement
    convertedText = convertedText.replace(new RegExp(rep.temp, 'g'), rep.final);
  }

  return convertedText;
}

module.exports = { getTimeInfo, splitMessageIntoChunks, convertToOldIndonesianSpelling };
