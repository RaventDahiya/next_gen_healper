"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contex/AuthContext";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, checkAuth, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const convex = useConvex();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Checking redirect condition", {
      isLoading,
      isCheckingAuth,
      user,
    });
    if (!isLoading && !isCheckingAuth) {
      if (!user) {
        console.log("Redirecting to sign-in because no user");
        router.replace("/sign-in");
      }
    }
  }, [user, isLoading, isCheckingAuth, router]);

  // Fetch user data from Convex when user email is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        console.log("Fetching user data from Convex for email:", user.email);
        try {
          const result = await convex.query(api.users.GetUser, {
            email: user.email,
          });
          console.log("User data from Convex:", result);
          // Only update user state if we got a valid result
          // But don't override existing user data with undefined/null
          if (result && Object.keys(result).length > 0) {
            console.log("Setting user with Convex data");
            // Merge Convex data with existing Google data
            setUser({
              ...user, // Keep existing Google data
              ...result, // Add/override with Convex data
            });
          } else {
            console.log(
              "No Convex user data found, keeping existing user data"
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          console.log("Error fetching Convex data, keeping existing user data");
        }
      }
    };

    fetchUserData();
  }, [user?.email, convex, setUser]);

  // Show nothing while checking auth
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  // If user is not authenticated, don't render children
  if (!user || !user.email) {
    console.log("No user or email, not rendering children");
    return null;
  }

  return <div>{children}</div>;
}

export default Provider;
