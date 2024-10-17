import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/constants";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || config.VITE_GEMINI_API_KEY;

class GeminiService {
  private static genAI = new GoogleGenerativeAI(API_KEY!);
  private static model = GeminiService.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  static async getResponse(input: string): Promise<string> {
    try {
      const result = await this.model.generateContent(input);
      return result.response.text();
    } catch (error) {
      console.log("Error in GeminiService:", error);
      throw error;
    }
  }
}

export default GeminiService;
