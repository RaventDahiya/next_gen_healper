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
  return (
    assistant && (
      <div className="p-5 bg-secondary border-l-[1px] h-screen">
        <h2 className="text-2xl font-bold mb-4">Setting</h2>
        <div className="mt-4 flex gap-3">
          <BlurFade
            key={`assistant-${assistant._id}-image`}
            delay={0.25}
            inView
          >
            <Image
              src={assistant?.image}
              alt="assistant_img"
              width={100}
              height={100}
              className="rounded-xl h-[80px] w-[80px]"
            />
          </BlurFade>
          <BlurFade key={`assistant-${assistant._id}-info`} delay={0.35} inView>
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
            delay={0.45}
            inView
          >
            <h2 className="text-gray-500">Model: </h2>
          </BlurFade>
          <BlurFade
            key={`assistant-${assistant._id}-model-select`}
            delay={0.55}
            inView
          >
            <Select
              onValueChange={(value) => onHandleInputChange("aiModelId", value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {AiModelOptions.map((model, index) => (
                  <SelectItem value={model.OpenRouter} key={model.OpenRouter}>
                    <div className="flex items-center gap-2">
                      <BlurFade
                        key={`model-${model.OpenRouter}-image`}
                        delay={0.05 * index}
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
                        delay={0.1 * index}
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
            delay={0.65}
            inView
          >
            <h2 className="text-gray-500">Instruction: </h2>
          </BlurFade>
          <BlurFade
            key={`assistant-${assistant._id}-instruction-textarea`}
            delay={0.75}
            inView
          >
            <Textarea
              placeholder="Add Instruction"
              value={assistant?.userInstruction}
              className="h-[180px] bg-white "
              onChange={(e) =>
                onHandleInputChange("userInstruction", e.target.value)
              }
            />
          </BlurFade>
        </div>
        <div className="flex right-5 gap-5 absolute bottom-10">
          <ConfermationAlert
            OnDelete={OnDelete}
            buttonVariant="ghost"
            buttonChildren={
              <>
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </>
            }
          />

          <Button onClick={OnSave} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Save />}
            Save
          </Button>
        </div>
      </div>
    )
  );
}

export default Settings;
