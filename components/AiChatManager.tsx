"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const response = await fetch("http://localhost:5000/api/ai/parse-task", {
      method: "POST", // ✅ important
      headers: {
        "Content-Type": "application/json", // ✅ important
      },
      body: JSON.stringify({
        text: userMessage.content, // ✅ send message here
      }),
    });

    const data = await response.json();
    setInput("");
    setIsLoading(true);
    console.log("res, ",data);

    // Simulate AI response (replace with your actual AI API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.task.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Open Button - Bottom Right */}
      <button
        onClick={toggleChat}
        className="fixed top-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all z-50 group"
        aria-label="Open AI Chat"
      >
        <Bot className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </button>

      {/* AI Chat Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#1e1e1e] border-l border-[#333] shadow-2xl transition-all duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "w-96" : "w-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] bg-[#252526]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">AI Assistant</h2>
              <p className="text-xs text-gray-400">Powered by Grok</p>
            </div>
          </div>

          <button
            onClick={toggleChat}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-[#2d2d2d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#1e1e1e] custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-[#2d2d2d] text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.content}
                <div className="text-[10px] opacity-60 mt-1 text-right">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2d2d2d] rounded-2xl px-4 py-3 rounded-bl-none">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#333] bg-[#252526]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-[#3c3c3c] text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-5 rounded-xl flex items-center justify-center transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-2">
            AI can make mistakes. Consider checking important info.
          </p>
        </div>
      </div>

      {/* Overlay when chat is open (optional) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleChat}
        />
      )}
    </>
  );
}
