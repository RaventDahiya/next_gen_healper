"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contex/AuthContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { ASSISTANT } from "../../ai-assistants/page";

function AssistantList() {
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  useEffect(() => {
    user && GetAllUserAssistants();
  }, [user]);

  const GetAllUserAssistants = async () => {
    if (!user || !user._id) return;
    const result = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      {
        uid: user._id,
      }
    );
    console.log(result);
    setAssistantList(result);
  };
  return (
    <div className="p-5 bg-secondary boarder-r-[1px] h-screen">
      <h2 className="font-bold text-lg ">Your Personal AI Assistant</h2>
      <Button className="w-full mt-3">+ Add New Assistant</Button>
      <Input className="bg-white mt-3" placeholder="Search for Assistant" />
    </div>
  );
}

export default AssistantList;
