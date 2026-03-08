import { useCallback, useState } from "react";
import { useChatbotResponse } from "./useQueries";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SAMPLE_RESPONSES: Record<string, string> = {
  default:
    "I'm UniLearn AI, your academic assistant! I can help you understand course materials, work through assignments, suggest study strategies, and answer academic questions. What would you like to explore today?",
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm UniLearn AI, your intelligent academic assistant. I can help you understand complex topics, assist with assignments, provide study tips, and answer any academic questions you have. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { mutateAsync: getChatbotResponse } = useChatbotResponse();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const response = await getChatbotResponse(content.trim());
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response || SAMPLE_RESPONSES.default,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [getChatbotResponse],
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm UniLearn AI. How can I help you with your studies today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isTyping, sendMessage, clearMessages };
}
