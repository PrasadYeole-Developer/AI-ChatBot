const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getContent(history) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: history,
  });
  return response.text;
}

module.exports = { getContent };
