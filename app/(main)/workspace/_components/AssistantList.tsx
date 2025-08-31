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
import { Search, X } from "lucide-react";
import AddAssistantDialog from "./AddAssistantDialog";

function AssistantList() {
  const [assistantList, setAssistantList] = useState<ASSISTANT[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const { assistant, setAssistant } = useContext(AssistantContext);

  useEffect(() => {
    user && GetAllUserAssistants();
  }, [user && assistant == null]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      id: assistant.id, // Keep original ID (string or number)
    }));
    setAssistantList(convertedResult);
  };

  const handleAssistantSelect = (selectedAssistant: ASSISTANT) => {
    setAssistant(selectedAssistant);
    console.log("Selected assistant:", selectedAssistant); // Debug log
  };

  const handleAddAssistant = () => {
    setIsAddDialogOpen(true);
  };

  const handleAssistantAdded = () => {
    console.log("handleAssistantAdded called - refreshing assistant list");
    GetAllUserAssistants(); // Refresh the list
  };

  const isSelected = (assistantItem: ASSISTANT) => {
    return assistant?.id === assistantItem.id;
  };

  // Filter out duplicate assistants by id and ensure unique keys
  const uniqueAssistants = assistantList.filter(
    (assistant, index, self) =>
      index === self.findIndex((a) => a.id === assistant.id)
  );

  // Filter assistants based on search query
  const filteredAssistants = uniqueAssistants.filter((assistant) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      assistant.name.toLowerCase().includes(query) ||
      assistant.title.toLowerCase().includes(query) ||
      assistant.instruction?.toLowerCase().includes(query)
    );
  });

  // Function to highlight search matches
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-5 bg-gray-100 dark:bg-gray-800 border-r-[1px] h-full relative">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Your Personal AI Assistants
      </h2>

      <Button
        className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer transition duration-200 ease-in-out"
        onClick={handleAddAssistant}
      >
        + Add New Assistant
      </Button>

      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 pl-10 pr-10 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search assistants... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {/* Search Results Counter */}
        {searchQuery.trim() && (
          <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
            {filteredAssistants.length === 0
              ? "No results found"
              : `${filteredAssistants.length} result${filteredAssistants.length !== 1 ? "s" : ""} found`}
          </div>
        )}

        {filteredAssistants.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery.trim() ? (
              <div className="text-gray-500 dark:text-gray-400">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No assistants found</p>
                <p className="text-xs mt-1">
                  Try searching with different keywords
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-blue-500 hover:text-blue-600 text-xs mt-2 underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Search className="h-6 w-6 opacity-50" />
                </div>
                <p className="text-sm font-medium">No assistants yet</p>
                <p className="text-xs mt-1">
                  Add your first assistant to get started
                </p>
              </div>
            )}
          </div>
        ) : (
          filteredAssistants.map((assistant_, index) => {
            const selected = isSelected(assistant_);
            // Create a truly unique key using id, index, and name
            const uniqueKey = `assistant_${assistant_.id}_${index}_${assistant_.name?.replace(/\s+/g, "_")}`;
            return (
              <BlurFade key={uniqueKey} delay={0.25 * index} inView>
                <div
                  className={`p-3 rounded-xl shadow-sm transition-all duration-300 ease-in-out flex items-center gap-4 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1 ${
                    selected
                      ? "bg-blue-100 dark:bg-blue-900 shadow-md border-2 border-blue-300 dark:border-blue-600"
                      : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => handleAssistantSelect(assistant_)}
                >
                  <div className="relative">
                    <Image
                      src={assistant_.image || "/logo.svg"}
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
                      {highlightMatch(assistant_.name, searchQuery)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-200">
                      {highlightMatch(assistant_.title, searchQuery)}
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
          })
        )}
      </div>

      <div className="mt-5 p-3 rounded-xl bg-white dark:bg-gray-700 shadow-md flex items-center gap-4">
        <Image
          src={user?.picture || "/logo.svg"}
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

      <AddAssistantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAssistantAdded={handleAssistantAdded}
      />
    </div>
  );
}

export default AssistantList;
