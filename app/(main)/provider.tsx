"use client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/contex/AuthContext";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, setUser } = useContext(AuthContext);
  const router = useRouter();
  const convex = useConvex();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, isLoading, router]);

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

  if (user) {
    return <div>{children}</div>;
  }

  return null;
}

export default Provider;
