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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="rounded-full"
            disabled={!mounted}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
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
            className="h-16 w-auto object-contain"
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
          className="h-16 w-auto object-contain"
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
        className="w-56 transition-all duration-300 ease-in-out"
      >
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Header;
