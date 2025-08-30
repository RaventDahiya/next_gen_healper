import React from "react";
import AssistantList from "./_components/AssistantList";
import ChatUi from "./_components/ChatUi";
import Settings from "./_components/Settings";

function workspace() {
  return (
    <div className="h-screen w-full pt-20">
      <div className="grid grid-cols-5 h-full">
        <div className="hidden md:block h-full overflow-y-auto bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* assistant list */}
          <AssistantList />
        </div>
        <div className="md:col-span-4 lg:col-span-3 h-full overflow-hidden">
          {/* chat ui */}
          <ChatUi />
        </div>
        <div className="hidden lg:block h-full overflow-y-auto bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          {/* settings */}
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default workspace;
