"use client";

import { Checkbox } from "@/components/ui/checkbox";
import AiAssistantsList from "@/services/AiAssistantsList";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/contex/AuthContext";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
export type ASSISTANT = {
  id: number | string; // Support both number and string IDs
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
};
export default function AIAssistants() {
  const [selectedAssistants, setSelectedAssistants] = useState<ASSISTANT[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insertAssistants = useMutation(
    api.userAiAssistants.InsertSelectedAssistants
  );
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
    if (result.length > 0) {
      router.replace("/workspace");
      return;
    }
  };

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

  const onClickContinue = async () => {
    if (selectedAssistants.length === 0 || !user?._id) {
      return;
    }
    setLoading(true);
    try {
      const result = await insertAssistants({
        records: selectedAssistants.map((assistant) => ({
          ...assistant,
          id: assistant.id.toString(),
        })),
        uid: user._id,
      });
      console.log(result);
      router.push("/workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 md:px-12 lg:px-24 xl:px-32 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <BlurFade delay={0.25 * 1 * 0.05} inView>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Welcome To The World Of AI Assistants 🤖
            </h2>
          </BlurFade>
          <BlurFade delay={0.25 * 2 * 0.05} inView>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Choose Your AI Companion To Simplify Your Task
            </p>
          </BlurFade>
        </div>
        <RainbowButton
          className="self-end"
          disabled={selectedAssistants.length === 0 || loading}
          onClick={onClickContinue}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Continue"}
        </RainbowButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {AiAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.id} delay={0.25 + index * 0.05} inView>
            <div
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
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
