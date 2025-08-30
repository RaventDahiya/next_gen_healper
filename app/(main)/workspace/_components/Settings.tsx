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
import { Loader2Icon, Save, Trash } from "lucide-react";
import { pre } from "motion/react-client";
import { useMutation } from "convex/react";
import {
  deleteUserAssistant,
  updateUserAssistant,
} from "@/convex/userAiAssistants";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import ConfermationAlert from "./ConfermationAlert";
import { BlurFade } from "@/components/magicui/blur-fade";
function Settings() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const updateAssistant = useMutation(api.userAiAssistants.updateUserAssistant);
  const deleteUserAssistant = useMutation(
    api.userAiAssistants.deleteUserAssistant
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onHandleInputChange = (field: string, value: string) => {
    setAssistant((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  const OnSave = async () => {
    setLoading(true);
    const result = await updateAssistant({
      id: assistant?._id,
      aiModelId: assistant?.aiModelId,
      userInstruction: assistant?.userInstruction,
    });
    toast("Changes Saved");
    setLoading(false);
  };

  const OnDelete = async () => {
    const result = await deleteUserAssistant({
      id: assistant?._id,
    });
    toast("Assistant Deleted");
    setAssistant(null);
  };
  // Find the selected model object
  const defaultModelValue = "google/gemini-2.0-flash-exp:free";
  // Fallback: if aiModelId is the display name, use the OpenRouter value
  let selectedModelValue = assistant?.aiModelId || defaultModelValue;
  // If the value is the display name, map it to OpenRouter value
  const displayNameToOpenRouter = (name: string) => {
    const found = AiModelOptions.find((m) => m.name === name);
    return found ? found.OpenRouter : name;
  };
  if (
    selectedModelValue &&
    !AiModelOptions.some((m) => m.OpenRouter === selectedModelValue)
  ) {
    // Try to map display name to OpenRouter value
    selectedModelValue = displayNameToOpenRouter(selectedModelValue);
  }
  const selectedModel = AiModelOptions.find(
    (model) => model.OpenRouter === selectedModelValue
  );

  return (
    assistant && (
      <div className="p-5 h-full pb-24">
        <h2 className="text-2xl font-bold mb-4">Setting</h2>
        <div className="mt-4 flex gap-3">
          <BlurFade key={`assistant-${assistant._id}-image`} delay={0} inView>
            <Image
              src={assistant?.image}
              alt="assistant_img"
              width={100}
              height={100}
              className="rounded-xl h-[80px] w-[80px]"
            />
          </BlurFade>
          <BlurFade key={`assistant-${assistant._id}-info`} delay={0} inView>
            <div>
              <h2 className="font-bold">{assistant?.name}</h2>
              <p className=" text-gray-700 dark:text-gray-300">
                {assistant?.title}
              </p>
            </div>
          </BlurFade>
        </div>
        <div className="mt-4">
          <BlurFade
            key={`assistant-${assistant._id}-model-label`}
            delay={0}
            inView
          >
            <h2 className="text-gray-500">Model: </h2>
          </BlurFade>
          <BlurFade
            key={`assistant-${assistant._id}-model-select`}
            delay={0}
            inView
          >
            <Select
              value={selectedModelValue}
              onValueChange={(value) => onHandleInputChange("aiModelId", value)}
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer">
                <SelectValue
                  placeholder={
                    selectedModel ? selectedModel.name : "Select Model"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {AiModelOptions.map((model, index) => (
                  <SelectItem value={model.OpenRouter} key={model.OpenRouter}>
                    <div className="flex items-center gap-2">
                      <BlurFade
                        key={`model-${model.OpenRouter}-image`}
                        delay={0}
                        inView
                      >
                        <Image
                          src={model.logo}
                          alt="model_img"
                          width={20}
                          height={20}
                          className="rounded-xl h-[20px] w-[20px]"
                        />
                      </BlurFade>
                      <BlurFade
                        key={`model-${model.OpenRouter}-name`}
                        delay={0}
                        inView
                      >
                        <h2>{model.name}</h2>
                      </BlurFade>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </BlurFade>
        </div>
        <div>
          <BlurFade
            key={`assistant-${assistant._id}-instruction-label`}
            delay={0}
            inView
          >
            <h2 className="text-gray-500">Instruction: </h2>
          </BlurFade>
          <BlurFade
            key={`assistant-${assistant._id}-instruction-textarea`}
            delay={0}
            inView
          >
            <Textarea
              placeholder="Add Instruction"
              value={assistant?.userInstruction}
              className="h-[180px] bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
              onChange={(e) =>
                onHandleInputChange("userInstruction", e.target.value)
              }
            />
          </BlurFade>
        </div>
        <div className="flex right-5 gap-5 absolute bottom-10">
          <ConfermationAlert
            OnDelete={OnDelete}
            buttonVariant="destructive"
            buttonChildren={
              <>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </>
            }
          />

          <Button
            onClick={OnSave}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 transition-colors"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : <Save />}
            Save
          </Button>
        </div>
      </div>
    )
  );
}

export default Settings;
