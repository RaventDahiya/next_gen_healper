"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

interface TokenContextType {
  userCredits: number;
  maxCredits: number;
  isLoading: boolean;
  refreshCredits: () => Promise<void>;
  canSendMessage: () => boolean;
  getUsagePercentage: () => number;
}

const TokenContext = createContext<TokenContextType>({
  userCredits: 0,
  maxCredits: 10000,
  isLoading: true,
  refreshCredits: async () => {},
  canSendMessage: () => false,
  getUsagePercentage: () => 0,
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const convex = useConvex();

  // Determine max credits based on plan
  const maxCredits = user?.orderId ? 500000 : 10000;

  const refreshCredits = async () => {
    if (!user?._id) {
      setIsLoading(false);
      setUserCredits(0); // Default to 0 if no user ID
      return;
    }

    setIsLoading(true);
    try {
      const userData = await convex.query(api.users.GetUserById, {
        userId: user._id,
      });
      if (userData) {
        setUserCredits(userData.credits || 0);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
      // Set default credits for fallback
      setUserCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  const canSendMessage = () => {
    // For pro users, always allow (assuming they have unlimited or very high limits)
    if (user?.orderId) return true;
    // For free users, check if they have credits
    return userCredits > 10; // Require at least 10 tokens to send a message
  };

  const getUsagePercentage = () => {
    const tokensUsed = maxCredits - userCredits;
    return Math.min((tokensUsed / maxCredits) * 100, 100);
  };

  useEffect(() => {
    if (user?._id) {
      refreshCredits();
    } else if (user) {
      // If we have a user but no _id yet, wait a bit and try again
      const timeout = setTimeout(() => {
        if (user._id) {
          refreshCredits();
        } else {
          setIsLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, [user?._id, user?.email, user?.orderId, user?.subscriptionId]);

  return (
    <TokenContext.Provider
      value={{
        userCredits,
        maxCredits,
        isLoading,
        refreshCredits,
        canSendMessage,
        getUsagePercentage,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};

// Safe hook that returns default values if not in provider
export const useTokenContextSafe = () => {
  try {
    return useTokenContext();
  } catch {
    return {
      userCredits: 0,
      maxCredits: 10000,
      isLoading: true,
      refreshCredits: async () => {},
      canSendMessage: () => false,
      getUsagePercentage: () => 0,
    };
  }
};

export { TokenContext };
