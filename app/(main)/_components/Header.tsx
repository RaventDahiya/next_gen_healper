"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/contex/AuthContext";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, RefreshCw, User } from "lucide-react";
import { useRouter } from "next/navigation";

function Header() {
  const { user } = useContext(AuthContext);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-900 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center py-2">
          <img
            src="/nextgenhelper_ai_logo.png"
            alt="NextGenHelper AI Assistant"
            className="h-50 w-auto object-contain"
          />
        </div>

        <div className="flex items-center space-x-4">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="rounded-full"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </header>
    );
  }

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-900 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center py-2">
          <img
            src="/nextgenhelper_ai_logo.png"
            alt="NextGenHelper AI Assistant"
            className="h-50 w-auto object-contain"
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
          {user?.picture ? (
            <Image
              src={user.picture}
              alt="User profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">?</span>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-900 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center py-2">
        <img
          src="/nextgenhelper_ai_logo.png"
          alt="NextGenHelper AI Assistant"
          className="h-50 w-auto object-contain"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <UserDropdown user={user} />
      </div>
    </header>
  );
}

function UserDropdown({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    router.push("/");
    window.location.reload();
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem("user_token");
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user?.picture ? (
          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-transform duration-200 hover:scale-105">
            <Image
              src={user.picture}
              alt="User profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </button>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">
            <span className="text-gray-500 text-xl">?</span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-2 transition-all duration-300 ease-in-out"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 mb-2">
            {user?.picture ? (
              <Image
                src={user.picture}
                alt="User profile"
                width={48}
                height={48}
                className="rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.orderId ? "Pro Plan" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSwitchAccount}
          className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-3 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Switch Account
            </p>
            <p className="text-xs text-gray-500">
              Sign in with different account
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Sign Out
            </p>
            <p className="text-xs text-gray-500">Sign out of your account</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Header;
