"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import EmptyChatSpace from "./EmptyChatSpace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, AlertTriangle, Crown, X } from "lucide-react";
import AiModelOptions from "@/services/AiModelOptions";
import { AssistantContext } from "@/contex/AssistantContext";
import { AuthContext } from "@/contex/AuthContext";
import { useTokenContext } from "@/contex/TokenContext";
import UpgradePrompt from "./UpgradePrompt";
import axios from "axios";
import Image from "next/image";

function ChatUi() {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { assistant } = useContext(AssistantContext);
  const { user } = useContext(AuthContext);
  const { userCredits, canSendMessage, refreshCredits } = useTokenContext();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [showUpgradeMessage, setShowUpgradeMessage] = useState(false);
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

  // Auto-show upgrade message when credits are very low or exhausted
  useEffect(() => {
    if (!user?.orderId && userCredits <= 100 && userCredits >= 0) {
      setShowUpgradeMessage(true);
    }
  }, [userCredits, user?.orderId]);

  const onMessageSend = async () => {
    if (!input.trim() || !assistant?.aiModelId) {
      console.log("Missing input or model");
      return;
    }

    // Enhanced credit checking with debugging
    console.log(
      "Credit check - User:",
      user?.orderId ? "Pro" : "Free",
      "Credits:",
      userCredits
    );

    // Check if user can send message (enhanced check)
    if (!user?.orderId && userCredits <= 10) {
      console.log(
        "User has insufficient credits:",
        userCredits,
        "showing upgrade message"
      );
      setShowUpgradeMessage(true);
      return;
    }

    // Double check with canSendMessage function
    if (!canSendMessage()) {
      console.log("canSendMessage returned false, credits:", userCredits);
      setShowUpgradeMessage(true);
      return;
    }

    console.log(
      "Proceeding with message send, user has sufficient credits:",
      userCredits
    );

    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      const userInput = input;
      setInput("");

      // Send the conversation history for context along with assistant ID
      const result = await axios.post("/api/chat", {
        provider: assistant.aiModelId,
        userInput: userInput,
        conversationHistory: messages, // Send all previous messages for context
        assistantId: assistant._id || assistant.id, // Pass the assistant ID to get instructions
        userId: user?._id, // Pass user ID for assistant lookup
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.data.message },
      ]);

      // Refresh credits after successful message
      await refreshCredits();
    } catch (error: any) {
      console.error("Error sending message:", error);

      // Handle insufficient credits error
      if (error.response?.data?.error === "insufficient_credits") {
        setShowUpgradeMessage(true);
        setMessages((prev) => prev.slice(0, -1)); // Remove user message
        // Refresh credits to get updated count
        await refreshCredits();
      } else {
        // Get error message from response if available
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details ||
          "Sorry, I encountered an error. Please try again.";

        const errorCode = error.response?.data?.errorCode;
        const provider = error.response?.data?.provider;

        let displayMessage = errorMessage;

        // Provide more specific error messages
        if (provider && provider.includes("gemini")) {
          displayMessage = `The Google Gemini model is currently unavailable. Please try selecting a different AI model from the dropdown above. Error: ${errorMessage}`;
        } else if (errorCode === "404") {
          displayMessage = `The selected AI model is not available. Please try a different model. Error: ${errorMessage}`;
        } else if (errorCode === "429") {
          displayMessage =
            "Rate limit exceeded. Please wait a moment and try again.";
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: displayMessage,
          },
        ]);
      }
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
        {/* Upgrade Message */}
        <UpgradePrompt
          show={showUpgradeMessage && !user?.orderId}
          onClose={() => setShowUpgradeMessage(false)}
          onUpgrade={() => {
            // TODO: Add upgrade functionality
            console.log("Upgrade clicked from chat");
          }}
          userCredits={userCredits}
        />

        {showUpgradeMessage && !user?.orderId && <div className="mb-4" />}

        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            placeholder={
              !user?.orderId && userCredits <= 10
                ? "Upgrade to Pro to continue chatting..."
                : `Message ${assistant?.name || "AI Assistant"}...`
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && onMessageSend()
            }
            disabled={isLoading || (!user?.orderId && userCredits <= 10)}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full px-4 py-3 disabled:opacity-50"
          />
          <Button
            onClick={onMessageSend}
            disabled={
              isLoading ||
              !input.trim() ||
              (!user?.orderId && userCredits <= 10)
            }
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
