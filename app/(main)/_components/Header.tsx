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
import { LogOut, RefreshCw, User, UserCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import Profile from "../workspace/_components/profile";
import { useTokenContextSafe } from "@/contex/TokenContext";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { clearAssistantCache } from "@/lib/assistantCache";

function Header() {
  const { user } = useContext(AuthContext);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const { userCredits, isLoading: creditsLoading } = useTokenContextSafe();
  const convex = useConvex();
  const [headerCredits, setHeaderCredits] = useState(0);
  const [headerCreditsLoading, setHeaderCreditsLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  // Fetch credits for header warning
  useEffect(() => {
    const fetchHeaderCredits = async () => {
      if (!user?._id) {
        setHeaderCreditsLoading(false);
        return;
      }

      try {
        const userData = await convex.query(api.users.GetUserById, {
          userId: user._id,
        });
        if (userData) {
          setHeaderCredits(userData.credits || 0);
        }
      } catch (error) {
        console.error("Error fetching header credits:", error);
        setHeaderCredits(0);
      } finally {
        setHeaderCreditsLoading(false);
      }
    };

    fetchHeaderCredits();
  }, [user?._id, convex]);

  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 shadow-sm bg-white dark:bg-gray-900 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center py-2">
          <Image
            src="/nextgenhelper_ai_logo.png"
            alt="NextGenHelper AI Assistant"
            width={130}
            height={48}
            className="h-12 w-auto object-contain"
            priority
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
          <Image
            src="/nextgenhelper_ai_logo.png"
            alt="NextGenHelper AI Assistant"
            width={130}
            height={48}
            className="h-12 w-auto object-contain"
            priority
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
        <Image
          src="/nextgenhelper_ai_logo.png"
          alt="NextGenHelper AI Assistant"
          width={130}
          height={48}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>
      <div className="flex items-center space-x-4">
        {/* Low Credits Warning */}
        {user &&
          !user.orderId &&
          !headerCreditsLoading &&
          headerCredits < 1000 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-full">
              <Zap className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                {headerCredits.toLocaleString()} tokens left
              </span>
            </div>
          )}

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
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const { userCredits, maxCredits, isLoading } = useTokenContextSafe();
  const convex = useConvex();
  const [localCredits, setLocalCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  // Fetch credits directly for header since TokenProvider might not be fully loaded
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?._id) {
        setCreditsLoading(false);
        return;
      }

      try {
        const userData = await convex.query(api.users.GetUserById, {
          userId: user._id,
        });
        if (userData) {
          setLocalCredits(userData.credits || 0);
        }
      } catch (error) {
        console.error("Error fetching credits in header:", error);
        setLocalCredits(0);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCredits();
  }, [user?._id, convex]);

  const displayCredits = isLoading ? localCredits : userCredits;

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    // Clear assistant cache when logging out
    if (user?._id) {
      clearAssistantCache(user._id);
    }
    router.push("/");
    window.location.reload();
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem("user_token");
    // Clear assistant cache when switching accounts
    if (user?._id) {
      clearAssistantCache(user._id);
    }
    router.push("/sign-in");
  };

  return (
    <>
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
                {/* Credits Display */}
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span>
                    {creditsLoading
                      ? "Loading..."
                      : `${displayCredits.toLocaleString()} tokens`}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setOpenProfileDialog(true)}
            className="cursor-pointer p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <UserCircle2 className="w-4 h-4 mr-3 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Profile Settings
              </p>
              <p className="text-xs text-gray-500">
                View and manage your account
              </p>
            </div>
          </DropdownMenuItem>

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

      <Profile
        openDialog={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
      />
    </>
  );
}

export default Header;
