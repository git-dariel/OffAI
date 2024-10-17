import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useAIChat from "../hooks/useAIChat";
import { SendHorizontal } from "lucide-react";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="chat-interface flex flex-col h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-gray-300 to-gray shadow-lg p-6">
        <h1 className="text-base md:text-2xl font-bold text-center text-gray-600 tracking-wide">
          Your <span className="text-gray-700">Kupal AI</span> Companion
        </h1>
      </div>
      <div className="message-list flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm">Kupal is typing</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="pb-5">
        <div className="flex space-x-2 max-w-4xl mx-auto p-1 md:p-2 bg-white border-t border-gray-200 rounded-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Kupal"
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
