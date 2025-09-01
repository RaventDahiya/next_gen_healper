"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Crown, X, AlertTriangle } from "lucide-react";

interface UpgradePromptProps {
  show: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  message?: string;
  compact?: boolean;
  userCredits?: number; // Add this to determine the appropriate title
}

function UpgradePrompt({
  show,
  onClose,
  onUpgrade,
  message = "You've used all your free plan tokens. Upgrade to Pro for 500,000 tokens/month.",
  compact = false,
  userCredits = 0,
}: UpgradePromptProps) {
  if (!show) return null;

  // Determine title and message based on credit levels
  const isExhausted = userCredits <= 100;
  const isVeryLow = userCredits <= 1000 && userCredits > 100;

  const getTitle = () => {
    if (isExhausted) return "Credits Exhausted";
    if (isVeryLow) return "Credits Running Low";
    return "Limited Credits";
  };

  const getDefaultMessage = () => {
    if (isExhausted)
      return "You've used all your free plan tokens. Upgrade to Pro for 500,000 tokens/month.";
    if (isVeryLow)
      return `Only ${userCredits.toLocaleString()} tokens remaining. Upgrade to Pro for unlimited usage.`;
    return `You have ${userCredits.toLocaleString()} tokens left. Upgrade to Pro for 500,000 tokens/month.`;
  };

  const displayMessage =
    message ===
    "You've used all your free plan tokens. Upgrade to Pro for 500,000 tokens/month."
      ? getDefaultMessage()
      : message;

  if (compact) {
    return (
      <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              {getTitle()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              onClick={onUpgrade}
            >
              <Crown className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
            {getTitle()}
          </h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            {displayMessage}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            onClick={onUpgrade}
          >
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UpgradePrompt;
