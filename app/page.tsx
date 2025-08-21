"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contex/AuthContext";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const handleGetStarted = () => {
    if (user) {
      router.push("/ai-assistants");
    } else {
      router.push("/sign-in");
    }
  };

  // Render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="NextGenHelper Logo"
              width={100}
              height={100}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full opacity-50"
              disabled
            >
              <Sun className="h-5 w-5 text-yellow-500" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button disabled>Sign In</Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Your Personal AI Assistant & Agent
              </h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Experience the future of productivity with our cutting-edge AI
                assistants. Get personalized help for learning, planning, and
                problem-solving.
              </p>
            </BlurFade>
            <BlurFade delay={0.75} inView>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="px-8 py-6 text-lg" disabled>
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  disabled
                >
                  Learn More
                </Button>
              </div>
            </BlurFade>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlurFade delay={1} inView>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Smart Assistance
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get intelligent help with learning, planning, and
                  problem-solving tailored to your needs.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={1.25} inView>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fast Results
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get instant answers and solutions with our powerful AI
                  technology.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={1.5} inView>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Personalized
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Customize your AI assistants to match your preferences and
                  work style.
                </p>
              </div>
            </BlurFade>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <p>
              © {new Date().getFullYear()} NextGenHelper. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="NextGenHelper Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            NextGenHelper
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user ? (
            <Button asChild>
              <Link href="/ai-assistants">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <BlurFade delay={0.25} inView>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Personal AI Assistant & Agent
            </h1>
          </BlurFade>
          <BlurFade delay={0.5} inView>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Experience the future of productivity with our cutting-edge AI
              assistants. Get personalized help for learning, planning, and
              problem-solving.
            </p>
          </BlurFade>
          <BlurFade delay={0.75} inView>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/ai-assistants">Learn More</Link>
              </Button>
            </div>
          </BlurFade>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <BlurFade delay={1} inView>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Assistance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get intelligent help with learning, planning, and
                problem-solving tailored to your needs.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={1.25} inView>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast Results
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant answers and solutions with our powerful AI
                technology.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={1.5} inView>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Personalized
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customize your AI assistants to match your preferences and work
                style.
              </p>
            </div>
          </BlurFade>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <p>
            © {new Date().getFullYear()} NextGenHelper. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
