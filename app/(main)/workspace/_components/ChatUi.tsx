"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import EmptyChatSpace from "./EmptyChatSpace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot } from "lucide-react";
import AiModelOptions from "@/services/AiModelOptions";
import { AssistantContext } from "@/contex/AssistantContext";
import { AuthContext } from "@/contex/AuthContext";
import axios from "axios";
import Image from "next/image";

function ChatUi() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { assistant } = useContext(AssistantContext);
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [assistant?.id]);

  const onMessageSend = async () => {
    if (!input.trim() || !assistant?.aiModelId) {
      console.log("Missing input or model");
      return;
    }

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      const userInput = input;
      setInput("");

      // Send the conversation history for context
      const result = await axios.post("/api/chat", {
        provider: assistant.aiModelId,
        userInput: userInput,
        conversationHistory: messages, // Send all previous messages for context
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <EmptyChatSpace />
        ) : (
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI Avatar (Left side) */}
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 flex flex-col items-center">
                    {assistant?.image ? (
                      <Image
                        src={assistant.image}
                        alt="AI Assistant"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {assistant?.name || "AI"}
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`max-w-[70%] ${
                    msg.role === "user" ? "ml-auto" : ""
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>

                {/* User Avatar (Right side) - REMOVED */}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 flex flex-col items-center">
                  {assistant?.image ? (
                    <Image
                      src={assistant.image}
                      alt="AI Assistant"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                    {assistant?.name || "AI"}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            placeholder={`Message ${assistant?.name || "AI Assistant"}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && onMessageSend()
            }
            disabled={isLoading}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full px-4 py-3"
          />
          <Button
            onClick={onMessageSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors rounded-full px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatUi;
