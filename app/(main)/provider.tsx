"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contex/AuthContext";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AssistantContext } from "@/contex/AssistantContext";
import { usePathname } from "next/navigation";
import { getAssistantCache, setAssistantCache } from "@/lib/assistantCache";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, setUser } = useContext(AuthContext);
  const router = useRouter();
  const convex = useConvex();
  const pathname = usePathname();
  const [assistant, setAssistant] = useState(null);
  const [routingChecked, setRoutingChecked] = useState(false);

  // Reset routing check when user changes
  useEffect(() => {
    if (!user) {
      setRoutingChecked(false);
    }
  }, [user?.email]); // Use email as dependency to detect user changes

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, isLoading, router]);

  // Handle smart routing based on user's assistant status
  useEffect(() => {
    const handleSmartRouting = async () => {
      if (!user?._id || isLoading) return;

      try {
        // First check if we have cached assistant status for immediate routing
        const cachedStatus = getAssistantCache(user._id);

        if (cachedStatus !== null) {
          // Use cached status for immediate routing (synchronous)
          const hasAssistants = cachedStatus;

          // Route based on current path and assistant status
          if (hasAssistants) {
            // User has assistants
            if (pathname === "/ai-assistants") {
              router.replace("/workspace");
            } else if (pathname === "/") {
              router.replace("/workspace");
            }
          } else {
            // User has no assistants
            if (pathname === "/workspace") {
              router.replace("/ai-assistants");
            } else if (pathname === "/") {
              router.replace("/ai-assistants");
            }
          }

          setRoutingChecked(true);
          return;
        }

        // No cache, query the database (asynchronous)
        if (!routingChecked) {
          const result = await convex.query(
            api.userAiAssistants.GetAllUserAssistants,
            {
              uid: user._id,
            }
          );

          const hasAssistants = result && result.length > 0;

          // Cache the result for next time
          setAssistantCache(user._id, hasAssistants);

          // Route based on current path and assistant status
          if (hasAssistants) {
            // User has assistants
            if (pathname === "/ai-assistants") {
              router.replace("/workspace");
            } else if (pathname === "/") {
              router.replace("/workspace");
            }
          } else {
            // User has no assistants
            if (pathname === "/workspace") {
              router.replace("/ai-assistants");
            } else if (pathname === "/") {
              router.replace("/ai-assistants");
            }
          }

          setRoutingChecked(true);
        }
      } catch (error) {
        console.error("Error in smart routing:", error);
        setRoutingChecked(true);
      }
    };

    // Only run smart routing if user is authenticated
    if (user && !isLoading) {
      handleSmartRouting();
    }
  }, [user, isLoading, convex, pathname, router, routingChecked]);

  // Fetch user data from Convex when user email is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const result = await convex.query(api.users.GetUser, {
            email: user.email,
          });
          if (result && Object.keys(result).length > 0) {
            setUser({
              ...user,
              ...result,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (!isLoading) {
      fetchUserData();
    }
  }, [user?.email, convex, setUser, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // Show loading only for pages that need routing check when cache is not available
  if (
    !routingChecked &&
    user?._id &&
    (pathname === "/" ||
      pathname === "/ai-assistants" ||
      pathname === "/workspace")
  ) {
    const cachedStatus = getAssistantCache(user._id);
    if (cachedStatus === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      );
    }
  }

  if (user) {
    return (
      <div>
        <AssistantContext.Provider value={{ assistant, setAssistant }}>
          {children}
        </AssistantContext.Provider>
      </div>
    );
  }

  return null;
}

export default Provider;
