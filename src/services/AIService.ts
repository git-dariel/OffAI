import GeminiService from "./GeminiService";
import TensorFlowService from "./TensorFlowService";

class AIService {
  static async getResponse(input: string): Promise<string> {
    try {
      // First, try to get a response from the offline TensorFlow model
      const tfResponse = await TensorFlowService.getResponse(input);
      if (tfResponse) {
        return tfResponse.text;
      }

      // If TensorFlow doesn't provide a response, fall back to Gemini
      const geminiResponse = await GeminiService.getResponse(input);
      return AIService.formatGeminiResponse(geminiResponse);
    } catch (error) {
      console.error("Error in AIService:", error);
      throw error;
    }
  }

  private static formatGeminiResponse(response: string): string {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    return response.replace(codeBlockRegex, (_match, language, code) => {
      language = language || "plaintext";
      return `\`\`\`${language}\n${code.trim()}\n\`\`\``;
    });
  }
}

export default AIService;
