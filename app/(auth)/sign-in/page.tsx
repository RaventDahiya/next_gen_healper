"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext } from "react";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/contex/AuthContext";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { setUser } = useContext(AuthContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem("user_token", tokenResponse.access_token);
      const userData = await GetAuthUserData(tokenResponse.access_token);

      // Create or update user in Convex
      const result = await CreateUser({
        name: userData?.name,
        email: userData?.email,
        picture: userData?.picture,
      });

      // Update context with user data
      setUser({
        name: userData?.name,
        email: userData?.email,
        picture: userData?.picture,
      });

      // Redirect to main app
      router.replace("/ai-assistants");
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8 text-center">
          <Image
            src="/logo.svg"
            alt="NextGenHelper Logo"
            width={300}
            height={300}
            className="mx-auto mb-6 dark:brightness-110"
          />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-6 transition-colors duration-300">
            Sign in to your AI Personal Assistant & Agent to get started.
          </p>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-3 py-3 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-50 hover:cursor-pointer dark:hover:bg-gray-700 dark:hover:cursor-pointer transition-colors duration-300"
            onClick={() => googleLogin()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </Button>
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors duration-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-indigo-600 dark:text-indigo-400 hover:underline transition-colors duration-300"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
