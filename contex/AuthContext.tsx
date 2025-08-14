import { createContext, useState, useEffect, useRef } from "react";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useRouter } from "next/navigation";

interface User {
  name?: string;
  email?: string;
  picture?: string;
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
      console.log("Token from localStorage:", token);
      if (!token) {
        console.log("No token found, setting user to null");
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("Fetching user data with token");
      const userData = await GetAuthUserData(
        token,
        abortControllerRef.current.signal
      );
      console.log("User data from Google:", userData);
      if (userData?.email) {
        console.log("Setting user with Google data");
        setUser({
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        });
      } else {
        // If we get here, the token is invalid or expired
        console.log(
          "No email in user data, removing token and setting user to null"
        );
        localStorage.removeItem("user_token");
        setUser(null);
      }
    } catch (error: any) {
      // Don't treat cancellation as an error
      if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
        console.log("Request was cancelled");
        return;
      }

      console.error("Auth check failed:", error);
      // If we get a 401 error, the token is expired or invalid
      if (error?.response?.status === 401) {
        console.log("401 error, removing token and setting user to null");
        localStorage.removeItem("user_token");
        setUser(null);
      }
      // For other errors (network issues, timeouts, etc.),
      // we don't change the user state to maintain login
      console.log("Other error, keeping current user state");
    } finally {
      console.log("Finished auth check, setting isLoading to false");
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
