"use client";
import React, { useContext } from "react";
import Image from "next/image";

import { AuthContext } from "@/contex/AuthContext";
function Header() {
  const { user } = useContext(AuthContext);
  return (
    user && (
      <div className="p-3 shadow-sm flex items-center justify-between py-5">
        <Image src={"/logo.svg"} alt="logo" width={300} height={300} />
        {user.picture && (
          <Image
            src={user.picture}
            alt="User profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
    )
  );
}

export default Header;
