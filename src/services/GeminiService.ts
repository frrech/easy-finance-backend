// src/services/GeminiService.ts
import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Pick one — flash (faster) or pro (higher quality)
const MODEL_NAME = "models/gemini-2.5-flash";
// const MODEL_NAME = "models/gemini-2.5-pro";

export const geminiService = {
  async generateAnalysis(prompt: string) {
    console.log("DEBUG KEY:", process.env.GEMINI_API_KEY);
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error("Error generating analysis:", err);
      throw new Error("Failed to generate analysis from Gemini.");
    }
  },
};
