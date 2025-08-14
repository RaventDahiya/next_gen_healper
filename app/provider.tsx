"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "@/contex/AuthContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ConvexProvider client={convex}>
        <AuthProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div>{children}</div>
          </NextThemesProvider>
        </AuthProvider>
      </ConvexProvider>
    </GoogleOAuthProvider>
  );
}

export default Provider;
