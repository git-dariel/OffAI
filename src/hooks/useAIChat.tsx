import { useState, useCallback } from "react";
import { MessageType } from "../types";
import AIService from "../services/AIService";

const useAIChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { content, isUser: true }]);

    try {
      const response = await AIService.getResponse(content);
      setMessages((prev) => [...prev, { content: response, isUser: false }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        { content: "Sorry, an error occurred. Please try again.", isUser: false },
      ]);
    }

    setIsLoading(false);
  }, []);

  return { messages, sendMessage, isLoading };
};

export default useAIChat;
