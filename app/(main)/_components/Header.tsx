"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/contex/AuthContext";

function Header() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white dark:bg-gray-900">
      <Image src="/logo.svg" alt="Logo" width={300} height={300} />
      {user.picture && (
        <Image
          src={user.picture}
          alt="User profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      )}
    </header>
  );
}

export default Header;
