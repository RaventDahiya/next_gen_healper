"use client";
import { AssistantContext } from "@/contex/AssistantContext";
import Image from "next/image";
import React, { useContext, useState, useEffect } from "react";
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
import { AuthContext } from "@/contex/AuthContext";
function Settings() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const { user } = useContext(AuthContext);
  const updateAssistant = useMutation(api.userAiAssistants.updateUserAssistant);
  const deleteUserAssistant = useMutation(
    api.userAiAssistants.deleteUserAssistant
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-set default model if assistant doesn't have one
  useEffect(() => {
    if (
      assistant &&
      (!assistant.aiModelId ||
        !AiModelOptions.some((m) => m.OpenRouter === assistant.aiModelId))
    ) {
      console.log(
        "Assistant missing valid model, setting default:",
        "deepseek/deepseek-r1:free"
      );
      setAssistant((prev: any) => ({
        ...prev,
        aiModelId: "deepseek/deepseek-r1:free",
      }));
    }
  }, [assistant?._id]); // Run when assistant changes
  const onHandleInputChange = (field: string, value: string) => {
    console.log("Input change:", field, value); // Debug log
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
  const defaultModelValue = "deepseek/deepseek-r1:free";
  // Ensure we always have a valid model value
  let selectedModelValue = assistant?.aiModelId;

  // Debug logging
  console.log("Assistant data:", assistant);
  console.log("Original aiModelId:", assistant?.aiModelId);
  console.log(
    "Available models:",
    AiModelOptions.map((m) => ({ name: m.name, OpenRouter: m.OpenRouter }))
  );

  // If no model is set or model is invalid, use default
  if (
    !selectedModelValue ||
    !AiModelOptions.some((m) => m.OpenRouter === selectedModelValue)
  ) {
    selectedModelValue = defaultModelValue;
    console.log("Using default model:", selectedModelValue);
  }

  const selectedModel = AiModelOptions.find(
    (model) => model.OpenRouter === selectedModelValue
  );

  console.log("Final selected model:", selectedModel);
  console.log("Final selected model value:", selectedModelValue);

  return (
    assistant && (
      <div className="p-5 h-full pb-24">
        <h2 className="text-2xl font-bold mb-4">Setting</h2>
        <div className="mt-4 flex gap-3">
          <BlurFade key={`assistant-${assistant._id}-image`} delay={0} inView>
            <Image
              src={assistant?.image}
              alt="assistant_img"
              width={80}
              height={80}
              className="rounded-xl h-20 w-20 object-cover"
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
                <SelectValue placeholder="Select Model">
                  {selectedModel ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedModel.logo}
                        alt="model_img"
                        width={20}
                        height={20}
                        className="rounded-xl h-5 w-5 object-cover"
                      />
                      <span>{selectedModel.name}</span>
                    </div>
                  ) : (
                    "Select Model"
                  )}
                </SelectValue>
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
                          className="rounded-xl h-5 w-5 object-cover"
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
