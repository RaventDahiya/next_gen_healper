"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/contex/AuthContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { ASSISTANT } from "../../ai-assistants/page";
import Image from "next/image";
import { div } from "motion/react-client";
import { AssistantContext } from "@/contex/AssistantContext";
function AssistantList() {
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const { assistant, setAssistant } = useContext(AssistantContext);
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
    // Convert id from string to number to match ASSISTANT type
    const convertedResult = result.map((assistant: any) => ({
      ...assistant,
      id: Number(assistant.id),
    }));
    setAssistantList(convertedResult);
  };
  return (
    <div className="p-5 bg-secondary boarder-r-[1px] h-screen relative">
      <h2 className="font-bold text-lg ">Your Personal AI Assistant</h2>
      <Button className="w-full mt-3">+ Add New Assistant</Button>
      <Input className="bg-white mt-3" placeholder="Search for Assistant" />
      <div className="mt-5">
        {assistantList.map((assistant_, index) => (
          <div
            className={`p-2 flex gap-3 items-center mt-2 hover:bg-gray-200 hover:dark:bg-gray-700 hover:rounded-xl cursor-pointer 
              ${assistant?.id == assistant_.id && "bg-gray-200 dark:bg-gray-700 rounded-xl"}`}
            key={index}
            onClick={() => setAssistant(assistant_)}
          >
            <Image
              src={assistant_.image}
              alt={assistant_.name}
              width={60}
              height={60}
              className="rounded-xl w-[120px] h-[120px] object-cover"
            />
            <div>
              <h2 className="font-bold">{assistant_.name}</h2>
              <h2 className="text-gray-600 dark:text-gray-300 text-sm">
                {assistant_.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute bottom-5 flex gap-3 items-center 
      hover:bg-gray-200 w-[87%] p-2 rounded-xl cursor-pointer"
      >
        <Image
          src={user?.picture}
          alt="user_img"
          width={35}
          height={35}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold">{user?.name}</h2>
          <h2 className="text-gray-600 dark:text-gray-300 text-sm">
            {user?.orderId ? "Pro Plan" : "Free Plan"}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AssistantList;
