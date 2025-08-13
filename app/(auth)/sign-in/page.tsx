"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SignIn() {
  const CreateUser = useMutation(api.users.CreateUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      localStorage.setItem("user_token", tokenResponse.access_token);
      const user = await GetAuthUserData(tokenResponse.access_token);
      console.log(user);
      const result = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
      });
      console.log("login success", result);
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <Image
            src="/logo.svg"
            alt="NextGenHelper Logo"
            width={300}
            height={300}
            className="mx-auto mb-6 pl-13"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 mb-6">
            Sign in to your AI Personal Assistant & Agent to get started.
          </p>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-3 py-3 text-lg"
            onClick={() => googleLogin()}
          >
            <span>Sign in with Google</span>
          </Button>
          <p className="mt-4 text-sm text-gray-400">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
