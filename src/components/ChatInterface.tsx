import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useAIChat from "../hooks/useAIChat";
import { SendHorizontal } from "lucide-react";
import biniMalupiton from "../assets/bini-malupiton.jpg";

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
    <div className="chat-interface flex flex-col h-screen bg-[#212121]">
      <div className="bg-gradient-to-r from-gray-[#212121] to-black shadow-lg p-4 md:p-6">
        <h1 className="text-lg md:text-2xl font-bold text-center text-gray-400 tracking-wide">
          Your <span className="text-gray-500">Kupal AI</span> Companion
        </h1>
      </div>
      <div className="message-list flex-1 md:mb-14 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 pb-20 ">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <img
              src={biniMalupiton}
              alt="Bini Malupiton"
              className="md:w-64 md:h-64 w-28 h-28 object-cover rounded-full shadow-lg"
            />
            <p className="text-gray-500 text-center text-sm md:text-base">
              No messages yet. Start a conversation with Kupal!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => <Message key={index} {...msg} />)
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-xs md:text-sm">Kupal is typing</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 pb-3 md:pb-5 bg-[#212121]"
      >
        <div className="flex space-x-2 max-w-4xl mx-auto p-1 md:p-2 bg-[#252525] bg-opacity-70 backdrop-blur-sm rounded-full shadow-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Kupal"
            disabled={isLoading}
            className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#252525] bg-transparent text-gray-100"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-400 text-white rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <SendHorizontal size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
