import { createContext, useState, useEffect, useRef } from "react";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useRouter } from "next/navigation";
import { Id } from "../convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Function to get or create user in Convex
const getOrCreateUserInConvex = async (userData: {
  name: string;
  email: string;
  picture: string;
}) => {
  try {
    // First try to get the existing user
    const getUserResponse = await fetch("/api/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userData.email }),
    });

    if (getUserResponse.ok) {
      const user = await getUserResponse.json();
      if (user) {
        return user;
      }
    }

    // If user doesn't exist, create a new one
    const createUserResponse = await fetch("/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (createUserResponse.ok) {
      const newUser = await createUserResponse.json();
      return newUser;
    }

    throw new Error("Failed to get or create user");
  } catch (error) {
    console.error("Error getting or creating user in Convex:", error);
    throw error;
  }
};

interface User {
  _id?: Id<"user">;
  name?: string;
  email?: string;
  picture?: string;
  orderId?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  checkAuth: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkAuth = async () => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("user_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await GetAuthUserData(
        token,
        abortControllerRef.current.signal
      );
      if (userData?.email) {
        // Get or create user in Convex to ensure we have the _id
        try {
          const convexUser = await getOrCreateUserInConvex({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          });

          setUser({
            _id: convexUser._id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          });
        } catch (error) {
          console.error("Failed to get or create user in Convex:", error);
          // Still set the user with Google data, but without _id
          setUser({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          });
        }
      } else {
        // If we get here, the token is invalid or expired
        localStorage.removeItem("user_token");
        setUser(null);
      }
    } catch (error: any) {
      // Don't treat cancellation as an error
      if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
        return;
      }

      console.error("Auth check failed:", error);
      // If we get a 401 error, the token is expired or invalid
      if (error?.response?.status === 401) {
        localStorage.removeItem("user_token");
        setUser(null);
      }
      // For other errors (network issues, timeouts, etc.),
      // we don't change the user state to maintain login
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue: AuthContextType = {
    user,
    setUser,
    isLoading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
