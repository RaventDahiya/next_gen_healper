"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AiAssistantsList from "@/services/AiAssistantsList";
import Image from "next/image";
import React, { useState } from "react";
export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
};
export default function AIAssistants() {
  const [selectedAssistants, setSelectedAssistants] = useState<ASSISTANT[]>([]);
  const onSelect = (assistant: ASSISTANT) => {
    const item = selectedAssistants?.find(
      (item: ASSISTANT) => item.id === assistant.id
    );
    if (item) {
      setSelectedAssistants(
        selectedAssistants.filter((item: ASSISTANT) => item.id !== assistant.id)
      );
    } else {
      setSelectedAssistants([...selectedAssistants, assistant]);
    }
  };

  const isAssistantSelected = (assistant: ASSISTANT) => {
    return selectedAssistants.some(
      (item: ASSISTANT) => item.id === assistant.id
    );
  };

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Welcome To The World Of AI Assistants 🤖
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Choose Your AI Companion To Simplify Your Task
          </p>
        </div>
        <Button variant="secondary" className="self-end">
          Continue
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {AiAssistantsList.map((assistant) => (
          <div
            key={assistant.id}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden "
            onClick={() => onSelect(assistant)}
          >
            <div className="relative w-full pt-[100%]">
              {" "}
              {/* 1:1 Aspect Ratio */}
              <Checkbox
                className="absolute top-2 left-2 w-5 h-5 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-sm data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-colors z-10 shadow-sm"
                checked={isAssistantSelected(assistant)}
              />
              <Image
                src={assistant.image}
                alt={assistant.title}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {assistant.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {assistant.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
