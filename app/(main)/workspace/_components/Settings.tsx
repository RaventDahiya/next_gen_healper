"use client";
import { AssistantContext } from "@/contex/AssistantContext";
import Image from "next/image";
import React, { useContext, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Trash } from "lucide-react";
import { pre } from "motion/react-client";
import { useMutation } from "convex/react";
import { updateUserAssistant } from "@/convex/userAiAssistants";
import { api } from "@/convex/_generated/api";
function Settings() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const updateAssistant = useMutation(api.userAiAssistants.updateUserAssistant);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onHandleInputChange = (field: string, value: string) => {
    setAssistant((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  // cosnt OnSave()=>{
  //   setLoading(true);
  //   updateAssistant({
  //     assistantId:assistant._id,
  //     name:assistant.name,
  //     title:assistant.title,
  //     image:assistant.image,
  //     aiModelId:assistant.aiModelId,
  //     userInstruction:assistant.userInstruction,
  // })
  return (
    assistant && (
      <div className="p-5 bg-secondary border-l-[1px] h-screen">
        <h2 className="text-2xl font-bold mb-4">Setting</h2>
        <div className="mt-4 flex gap-3">
          <Image
            src={assistant?.image}
            alt="assistant_img"
            width={100}
            height={100}
            className="rounded-xl h-[80px] w-[80px]"
          />
          <div>
            <h2 className="font-bold">{assistant?.name}</h2>
            <p className=" text-gray-700 dark:text-gray-300">
              {assistant?.title}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-gray-500">Model: </h2>
          <Select
            defaultOpen={assistant?.aiModelId}
            onValueChange={(value) => onHandleInputChange("aiModelId", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelOptions.map((model, index) => (
                <SelectItem value={model.OpenRouter} key={index}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={model.logo}
                      alt="model_img"
                      width={20}
                      height={20}
                      className="rounded-xl h-[20px] w-[20px]"
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <h2 className="text-gray-500">Instruction: </h2>
          <Textarea
            placeholder="Add Instruction"
            value={assistant?.userInstruction}
            className="h-[180px] bg-white "
            onChange={(e) =>
              onHandleInputChange("userInstruction", e.target.value)
            }
          />
        </div>
        <div className="flex right-5 gap-5 absolute bottom-10">
          <Button variant={"ghost"}>
            {" "}
            <Trash />
            Delete
          </Button>
          <Button>
            {" "}
            <Save />
            Save
          </Button>
        </div>
      </div>
    )
  );
}

export default Settings;
