import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";

const genAI = new GoogleGenerativeAI(config.api_key);

class GeminiService {
  public async generateAnalysis(prompt: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-latest",
      });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error generating analysis:", error);
      throw new Error("Failed to generate analysis from Gemini.");
    }
  }
}

export const geminiService = new GeminiService();
