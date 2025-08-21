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
import { AssistantContext } from "@/contex/AssistantContext";
import { BlurFade } from "@/components/magicui/blur-fade";

function AssistantList() {
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const { assistant, setAssistant } = useContext(AssistantContext);

  useEffect(() => {
    user && GetAllUserAssistants();
  }, [user && assistant == null]);

  const GetAllUserAssistants = async () => {
    if (!user || !user._id) return;
    const result = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      {
        uid: user._id,
      }
    );
    console.log(result);
    const convertedResult = result.map((assistant: any) => ({
      ...assistant,
      id: Number(assistant.id),
    }));
    setAssistantList(convertedResult);
  };

  const handleAssistantSelect = (selectedAssistant: ASSISTANT) => {
    setAssistant(selectedAssistant);
    console.log("Selected assistant:", selectedAssistant); // Debug log
  };

  const isSelected = (assistantItem: ASSISTANT) => {
    return assistant?.id === assistantItem.id;
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 border-r-[1px] h-full relative">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Your Personal AI Assistants
      </h2>

      <Button className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer transition duration-200 ease-in-out">
        + Add New Assistant
      </Button>

      <Input
        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 mt-3 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Search for Assistant"
      />

      <div className="mt-5 space-y-3">
        {assistantList.map((assistant_, index) => {
          const selected = isSelected(assistant_);
          return (
            <BlurFade key={assistant_.id || index} delay={0.25 * index} inView>
              <div
                className={`p-3 rounded-xl shadow-sm transition-all duration-300 ease-in-out flex items-center gap-4 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1 ${
                  selected
                    ? "bg-blue-100 dark:bg-blue-900 shadow-md border-2 border-blue-300 dark:border-blue-600" // Enhanced selected state
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
                onClick={() => handleAssistantSelect(assistant_)}
              >
                <div className="relative">
                  <Image
                    src={assistant_.image || "/placeholder.png"}
                    alt={assistant_.name}
                    width={60}
                    height={60}
                    className="rounded-xl w-16 h-16 object-cover shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-xl bg-black opacity-0 hover:opacity-5 transition-opacity duration-300"></div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold transition-colors duration-200 ${
                      selected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {assistant_.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">
                    {assistant_.title}
                  </p>
                </div>
                <div
                  className={`transition-opacity duration-300 ${
                    selected ? "opacity-100" : "opacity-0 hover:opacity-100"
                  } text-gray-400`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </BlurFade>
          );
        })}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-white dark:bg-gray-700 shadow-md flex items-center gap-4">
        <Image
          src={user?.picture || "/placeholder.png"}
          alt="user_img"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {user?.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {user?.orderId ? "Pro Plan" : "Free Plan"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AssistantList;
