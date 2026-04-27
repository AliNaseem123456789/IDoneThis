import React, { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I'm the AI Agent from Company. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        text: data.response || "Sorry, I couldn't process that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Error connecting to server. Is the backend running?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-xl overflow-hidden border z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-bold text-sm tracking-wide">AI Assistant</span>
        </div>
      </div>

      {/* Chat Window */}
      <div
        ref={scrollRef}
        className="p-4 h-64 overflow-y-auto flex flex-col gap-3 bg-gray-50"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] p-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-indigo-500 text-white self-end rounded-br-none"
                : "bg-white text-gray-700 self-start shadow-sm border rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-xs text-gray-400 italic animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex border-t bg-white p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 outline-none text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-sm font-bold rounded-md transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
