import React from "react";
import { MessageType } from "../types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast, Toaster } from "sonner";
import { Copy } from "lucide-react";

interface FormattedContent {
  text: string;
  image?: string;
}

const Message: React.FC<MessageType> = ({ content, isUser }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard");
  };

  const formatContent = (content: string | FormattedContent): React.ReactNode => {
    if (isUser) return typeof content === "string" ? content : content.text;

    const text = typeof content === "string" ? content : content.text;
    const image = typeof content === "object" && content.image ? content.image : undefined;

    // Split the content into parts, separating code blocks from regular text
    const parts = text.split(/(```[\s\S]*?```)/);

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("```") && part.endsWith("```")) {
            // This is a code block
            const [, language, code] = part.match(/```(\w+)?\n?([\s\S]*?)```/) || [];
            return (
              <div key={index} className="relative bg-black rounded-lg overflow-hidden my-2">
                <SyntaxHighlighter
                  language={language || "plaintext"}
                  style={atomOneDark}
                  customStyle={{
                    padding: "1rem",
                    backgroundColor: "black",
                    fontSize: "0.875rem",
                  }}
                >
                  {code.trim()}
                </SyntaxHighlighter>
                <button
                  className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(code.trim());
                    toast.success("Code copied to clipboard");
                  }}
                >
                  Copy code
                </button>
              </div>
            );
          } else {
            // This is regular text
            return (
              <div key={index} className="whitespace-pre-wrap markdown-content">
                {part.split("/n").map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {React.createElement("div", {
                      dangerouslySetInnerHTML: {
                        __html: line
                          .replace(/<strong>(.*?)<\/strong>/g, "<strong>$1</strong>")
                          .replace(/<code>(.*?)<\/code>/g, "<code>$1</code>")
                          .replace(/\*(.*?)\*/g, "<strong>$1</strong>"),
                      },
                    })}
                    {lineIndex < part.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            );
          }
        })}
        {image && (
          <img
            src={image}
            alt="Response"
            className="mt-2 max-w-full h-auto object-contain rounded-md"
            style={{ maxHeight: "80vh" }}
            onError={(e) => {
              console.error("Error loading image:", image);
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <Toaster position="bottom-right" expand={true} richColors />
      </>
    );
  };

  const fullContent = typeof content === "string" ? content : (content as { text: string }).text;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-pink-500 text-white ml-2 md:ml-3" : "bg-gray-500 text-white mr-2 md:mr-3"
          }`}
        >
          {isUser ? "U" : "K"}
        </div>
        <div
          className={`max-w-[85%] md:max-w-3xl text-sm md:text-base rounded-lg px-3 py-2 md:px-4 md:py-2 ${
            isUser ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-200"
          }`}
        >
          <div className="text-xs md:text-sm markdown-content relative group">
            {formatContent(content)}
            {!isUser && (
              <button
                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(fullContent)}
              >
                <Copy size={14} className="md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
