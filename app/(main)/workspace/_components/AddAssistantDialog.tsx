"use client";

import React, { useState, useContext, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { ASSISTANT } from "@/app/(main)/ai-assistants/page";
import AiAssistantsList from "@/services/AiAssistantsList";
import AiModelOptions from "@/services/AiModelOptions";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/contex/AuthContext";
import { AssistantContext } from "@/contex/AssistantContext";
import { toast } from "sonner";
import { Plus, Sparkles, Upload, Loader2, X } from "lucide-react";

const AVAILABLE_IMAGES = [
  { name: "Bug Fixer", path: "/bug-fixer.png" },
  { name: "Calories Tracker", path: "/calories-tracker.png" },
  { name: "DSA Solver", path: "/dsa-solver.jpg" },
  { name: "Finance Assistant", path: "/finance-assistant.png" },
  { name: "Gym Trainer", path: "/gym-trainer.png" },
  { name: "PDF Reader", path: "/pdf-reader.png" },
  { name: "Personal Teacher", path: "/personal-teacher.png" },
  { name: "Roadmap Creator", path: "/roadmap-creator.png" },
  { name: "UI Designer", path: "/ui-designer.png" },
  { name: "Virtual Friend", path: "/virtual-friend.png" },
];

interface AddAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssistantAdded: () => void;
}

const AddAssistantDialog: React.FC<AddAssistantDialogProps> = ({
  open,
  onOpenChange,
  onAssistantAdded,
}) => {
  const [selectedStep, setSelectedStep] = useState<"default" | "custom">(
    "default"
  );
  const [selectedDefaultAssistants, setSelectedDefaultAssistants] = useState<
    ASSISTANT[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customAssistant, setCustomAssistant] = useState({
    name: "",
    title: "",
    image: "", // No default image initially
    instruction: "",
    userInstruction: "",
    selectedModel: "",
    sampleQuestions: ["", "", "", ""],
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useContext(AuthContext);
  const { setAssistant } = useContext(AssistantContext);
  const insertAssistants = useMutation(
    api.userAiAssistants.InsertSelectedAssistants
  );
  const createCustomAssistant = useMutation(
    api.userAiAssistants.CreateUserAssistant
  );

  const handleDefaultAssistantSelect = (assistant: ASSISTANT) => {
    const isSelected = selectedDefaultAssistants.some(
      (item) => item.id === assistant.id
    );
    if (isSelected) {
      setSelectedDefaultAssistants((prev) =>
        prev.filter((item) => item.id !== assistant.id)
      );
    } else {
      setSelectedDefaultAssistants((prev) => [...prev, assistant]);
    }
  };

  const handleCustomAssistantChange = (field: string, value: string) => {
    setCustomAssistant((prev) => ({ ...prev, [field]: value }));
  };

  const handleSampleQuestionChange = (index: number, value: string) => {
    const newSampleQuestions = [...customAssistant.sampleQuestions];
    newSampleQuestions[index] = value;
    setCustomAssistant((prev) => ({
      ...prev,
      sampleQuestions: newSampleQuestions,
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setCustomAssistant((prev) => ({ ...prev, image: result.imageUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddAssistants = async () => {
    if (!user?._id) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      if (selectedStep === "default") {
        // Add default assistants
        if (selectedDefaultAssistants.length === 0) {
          toast.error("Please select at least one assistant");
          setLoading(false);
          return;
        }

        await insertAssistants({
          records: selectedDefaultAssistants.map((assistant) => ({
            ...assistant,
            id: assistant.id.toString(),
          })),
          uid: user._id,
        });

        toast.success(
          `${selectedDefaultAssistants.length} assistant(s) added successfully!`
        );
      } else {
        // Create custom assistant
        if (
          !customAssistant.name ||
          !customAssistant.title ||
          !customAssistant.instruction
        ) {
          toast.error(
            "Please fill in all required fields (name, title, and instruction)"
          );
          setLoading(false);
          return;
        }

        console.log("Creating custom assistant with data:", {
          name: customAssistant.name,
          title: customAssistant.title,
          instruction: customAssistant.instruction,
          image: customAssistant.image || "/logo.svg",
          selectedModel: customAssistant.selectedModel,
        });

        const result = await createCustomAssistant({
          uid: user._id,
          name: customAssistant.name,
          title: customAssistant.title,
          instruction: customAssistant.instruction,
          image: customAssistant.image || "/logo.svg",
          sampleQuestions: customAssistant.sampleQuestions.filter(
            (q) => q.trim() !== ""
          ),
          aiModelId:
            customAssistant.selectedModel || "deepseek/deepseek-r1:free",
        });

        console.log("Custom assistant created with result:", result);
        toast.success("Custom assistant created successfully!");
      }

      onAssistantAdded();
      resetDialog();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding assistants:", error);
      toast.error("Failed to add assistants");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSelectedStep("default");
    setSelectedDefaultAssistants([]);
    setSearchQuery("");
    setCustomAssistant({
      name: "",
      title: "",
      image: "", // No default image
      instruction: "",
      userInstruction: "",
      selectedModel: "",
      sampleQuestions: ["", "", "", ""],
    });
  };

  const canAddAssistants = () => {
    if (selectedStep === "default") {
      return selectedDefaultAssistants.length > 0;
    } else {
      return (
        customAssistant.name &&
        customAssistant.title &&
        customAssistant.instruction
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          resetDialog();
        }
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Add New AI Assistant
          </DialogTitle>
          <DialogDescription>
            Choose from our curated collection or create your own custom AI
            assistant
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Selection Options */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={selectedStep === "default" ? "default" : "outline"}
                onClick={() => setSelectedStep("default")}
                className="flex-1"
              >
                Default Assistants
              </Button>
              <Button
                variant={selectedStep === "custom" ? "default" : "outline"}
                onClick={() => setSelectedStep("custom")}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Your Own
              </Button>
            </div>

            {selectedStep === "default" ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="font-semibold">Select Default Assistants:</h3>
                <Input
                  placeholder="Search assistants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-3"
                />
                {AiAssistantsList.filter(
                  (assistant) =>
                    assistant.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    assistant.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                ).map((assistant) => (
                  <div
                    key={assistant.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedDefaultAssistants.some(
                        (item) => item.id === assistant.id
                      )
                        ? "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleDefaultAssistantSelect(assistant)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedDefaultAssistants.some(
                          (item) => item.id === assistant.id
                        )}
                        onCheckedChange={() =>
                          handleDefaultAssistantSelect(assistant)
                        }
                      />
                      <Image
                        src={assistant.image}
                        alt={assistant.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{assistant.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {assistant.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold">Create Custom Assistant:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name *
                    </label>
                    <Input
                      placeholder="e.g., CodeHelper"
                      value={customAssistant.name}
                      onChange={(e) =>
                        handleCustomAssistantChange("name", e.target.value)
                      }
                      className={!customAssistant.name ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title *
                    </label>
                    <Input
                      placeholder="e.g., Programming Assistant 💻"
                      value={customAssistant.title}
                      onChange={(e) =>
                        handleCustomAssistantChange("title", e.target.value)
                      }
                      className={!customAssistant.title ? "border-red-300" : ""}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    🎨 Choose Assistant Image
                  </label>
                  <div className="space-y-4">
                    {/* Enhanced Image Gallery */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Select from gallery
                        </p>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {AVAILABLE_IMAGES.map((img) => (
                          <div
                            key={img.path}
                            className={`group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                              customAssistant.image === img.path
                                ? "border-blue-500 ring-4 ring-blue-100 shadow-lg transform scale-105"
                                : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                            }`}
                            onClick={() =>
                              handleCustomAssistantChange("image", img.path)
                            }
                          >
                            <div className="aspect-square p-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                              <Image
                                src={img.path}
                                alt={img.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>

                            {/* Selection Indicator */}
                            {customAssistant.image === img.path && (
                              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
                                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}

                            {/* Hover Tooltip */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                              {img.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Upload Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Upload custom image
                        </p>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={imageUploading}
                          className="w-full h-12 text-sm border-none bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {imageUploading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Uploading image...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 mr-2" />
                              Choose file from PC
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          PNG, JPG, WebP up to 5MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Selected Image Preview */}
                    {customAssistant.image && (
                      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Selected image
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Image
                            src={customAssistant.image}
                            alt="Selected"
                            width={60}
                            height={60}
                            className="rounded-xl object-cover border shadow-md"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {AVAILABLE_IMAGES.find(
                                (img) => img.path === customAssistant.image
                              )?.name || "Custom Image"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {customAssistant.image.startsWith("/")
                                ? "Gallery image"
                                : "Uploaded image"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCustomAssistantChange("image", "")
                            }
                            className="ml-auto text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Main Instruction *
                  </label>
                  <Textarea
                    placeholder="Describe what this assistant should do and how it should behave..."
                    value={customAssistant.instruction}
                    onChange={(e) =>
                      handleCustomAssistantChange("instruction", e.target.value)
                    }
                    rows={3}
                    className={
                      !customAssistant.instruction ? "border-red-300" : ""
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    User Instruction
                  </label>
                  <Textarea
                    placeholder="Additional context for user interactions (optional)"
                    value={customAssistant.userInstruction}
                    onChange={(e) =>
                      handleCustomAssistantChange(
                        "userInstruction",
                        e.target.value
                      )
                    }
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Model *
                  </label>
                  <Select
                    value={customAssistant.selectedModel}
                    onValueChange={(value) =>
                      handleCustomAssistantChange("selectedModel", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        !customAssistant.selectedModel ? "border-red-300" : ""
                      }
                    >
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AiModelOptions.map((model) => (
                        <SelectItem key={model.id} value={model.OpenRouter}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={model.logo}
                              alt={model.name}
                              width={20}
                              height={20}
                              className="rounded"
                            />
                            {model.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sample Questions (Optional)
                  </label>
                  <div className="space-y-2 mt-2">
                    {customAssistant.sampleQuestions.map((question, index) => (
                      <Input
                        key={index}
                        placeholder={`Sample question ${index + 1}`}
                        value={question}
                        onChange={(e) =>
                          handleSampleQuestionChange(index, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold">Preview:</h3>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {selectedStep === "default" ? (
                <div className="space-y-3">
                  <h4 className="font-medium">
                    Selected Assistants ({selectedDefaultAssistants.length}):
                  </h4>
                  {selectedDefaultAssistants.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No assistants selected
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDefaultAssistants.map((assistant) => (
                        <div
                          key={assistant.id}
                          className="flex items-center gap-3 p-2 bg-white dark:bg-gray-700 rounded"
                        >
                          <Image
                            src={assistant.image}
                            alt={assistant.name}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {assistant.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {assistant.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-medium">Custom Assistant Preview:</h4>
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        {customAssistant.image ? (
                          <Image
                            src={customAssistant.image}
                            alt={customAssistant.name || "Custom Assistant"}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover border"
                            onError={(e) => {
                              // Fallback to default logo on error
                              e.currentTarget.src = "/logo.svg";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                        {imageUploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-semibold">
                          {customAssistant.name || "Assistant Name"}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customAssistant.title || "Assistant Title"}
                        </p>
                      </div>
                    </div>
                    {customAssistant.instruction && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Instruction:
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                          {customAssistant.instruction}
                        </p>
                      </div>
                    )}
                    {customAssistant.selectedModel && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Model:
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {
                            AiModelOptions.find(
                              (m) =>
                                m.OpenRouter === customAssistant.selectedModel
                            )?.name
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              resetDialog();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddAssistants}
            disabled={!canAddAssistants() || loading}
            className="min-w-[120px]"
          >
            {loading
              ? "Adding..."
              : `Add Assistant${selectedStep === "default" && selectedDefaultAssistants.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssistantDialog;
