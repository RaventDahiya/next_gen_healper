"use client";
import { BlurFade } from "@/components/magicui/blur-fade";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { AssistantContext } from "@/contex/AssistantContext";
import { ChevronRight, Key } from "lucide-react";
import { div } from "motion/react-client";
import React, { useContext } from "react";

function EmptyChatSpace() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  return (
    <div className="flex flex-col items-center">
      <SparklesText className="text-center text-4xl text-gray-800 dark:text-gray-200">
        How Can I Assit You?
      </SparklesText>
      <div className="mt-7">
        {assistant?.sampleQuestions.map((question: string, index: number) => (
          <BlurFade delay={0.25 + index * 0.05} key={question}>
            <div>
              <h2
                className="p-4 text-xl border border-gray-300 dark:border-gray-600 rounded-xl mt-1 
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer 
                flex items-center justify-between gap-10 transition-colors duration-200"
              >
                {question}
                <ChevronRight className="text-gray-500 dark:text-gray-400" />
              </h2>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default EmptyChatSpace;
