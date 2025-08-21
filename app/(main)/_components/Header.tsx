"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!user) return null;

  // Render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex fixed items-center justify-between px-6 py-4 shadow-sm bg-white dark:bg-gray-900 w-full z-10">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="h-8 w-auto"
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
          {user.picture ? (
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
      </div>
    );
  }

  return (
    <div className="flex fixed items-center justify-between px-6 py-4 shadow-sm bg-white dark:bg-gray-900 w-full z-10">
      <div className="flex items-center">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          className="h-10 w-auto"
        />
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
        <UserDropdown user={user} />
      </div>
    </div>
  );
}

function UserDropdown({ user }: { user: any }) {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the user token from localStorage
    localStorage.removeItem("user_token");
    // Redirect to home page
    router.push("/");
    // Reload the page to clear the user context
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user.picture ? (
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
